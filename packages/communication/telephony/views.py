import json
import requests
import os

from rest_framework.views import APIView
from django.core import serializers
from django.forms.models import model_to_dict
from django.core.files import File

from zango.core.api import get_api_response
from zango.apps.appauth.models import AppUserModel
from zango.core.utils import get_package_url

from .models import TelephonyConfigModel, CallRecordModel, TelephonyAgent
from ..configure.serializers import TelephonyConfigureSerializer
from .serializers import TelephonyAgentSerializer, AppUserSerializer
from ..utils import validate_phone


class TelephonyORMView(APIView):
    def get(self, request, *args, **kwargs):
        action = request.GET.get("action", "")
        if action == "fetch_users":
            destination_number = request.GET.get("destination_number", "")
            objects = TelephonyAgent.objects.filter(
                primary_phone__icontains=destination_number
            )
            result = serializers.serialize("json", objects)
            return get_api_response(True, result, 200)
        if action == "get_agent":
            user_id = request.GET.get("user_id", None)
            agent_id = request.GET.get("agent_id", None)
            try:
                if user_id:
                    agent = TelephonyAgent.objects.get(user_id=int(user_id))
                elif agent_id:
                    agent = TelephonyAgent.objects.get(id=agent_id)
                else:
                    return get_api_response(
                        False, "Please provide either User ID or Agent ID", 400
                    )
            except TelephonyAgent.DoesNotExist:
                return get_api_response(False, "Agent not found", 404)
            except Exception as e:
                return get_api_response(False, str(e), 500)
            return get_api_response(True, model_to_dict(agent), 200)
        if action == "get_config":
            key = request.GET.get("config_key", None)
            if key is not None:
                config = TelephonyConfigModel.objects.get(key=key)
            else:
                try:
                    config = TelephonyConfigModel.objects.get(is_default=True)
                except TelephonyConfigModel.DoesNotExist:
                    return get_api_response(False, "No default config found", 400)
            return get_api_response(True, config.config, 200)
        if action == "get_call_records":
            objects = (
                CallRecordModel.objects.filter(is_file_synced=False)
                .exclude(call_record_url=None)
                .exclude(call_record_url="")
                .order_by("-created_at")
            )
            result = serializers.serialize("json", objects)
            return get_api_response(True, json.loads(result), 200)
        if action == "get_notes_key":
            key = request.GET.get("config_key", None)
            if key is not None:
                config = TelephonyConfigModel.objects.get(key=key)
            else:
                try:
                    config = TelephonyConfigModel.objects.get(is_default=True)
                except TelephonyConfigModel.DoesNotExist:
                    return get_api_response(False, "No default config found", 400)
            return get_api_response(True, config.notes_key, 200)
        return get_api_response(False, "Invalid action", 400)

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        action = request.GET.get("action", "")
        if action == "create_telephony_user":
            TelephonyAgent.objects.create(**data)
            return get_api_response(True, "Telephony user created successfully", 200)
        if action == "create_call_record":
            if data.get("agentId"):
                agent = TelephonyAgent.objects.get(
                    config__contains={"agentId": str(data["agentId"])}
                )
                data["agent_id"] = agent.pk
            if data.get("contactId") or data.get("extra_data", {}).get("contactId"):
                contactId = str(
                    data.get("contactId")
                    if data.get("contactId")
                    else data.get("extra_data", {}).get("contactId")
                )
                if not CallRecordModel.objects.filter(
                    extra_data__contains={"contactId": contactId}
                ).exists():
                    del data["contactId"]
                    call_record = CallRecordModel.objects.create(**data)
                    created = True
                else:
                    call_record = CallRecordModel.objects.get(
                        extra_data__contains={"contactId": contactId}
                    )
                    created = False
            else:
                call_record = CallRecordModel.objects.create(**data)
                created = True
            record = model_to_dict(call_record)
            del record["call_record"]
            del record["start_time"]
            return get_api_response(
                True,
                {
                    "record": record,
                    "created": created,
                    "object_uuid": str(call_record.object_uuid),
                },
                200,
            )
        if action == "create_inbound_call_record":
            try:
                call_record = CallRecordModel.objects.get(
                    extra_data__contains={"contactId": data["extra_data"]["contactId"]}
                )
            except CallRecordModel.DoesNotExist:
                call_record = CallRecordModel.objects.create(**data)
            record = model_to_dict(call_record)
            del record["call_record"]
            return get_api_response(
                True,
                {"record": record, "object_uuid": str(call_record.object_uuid)},
                200,
            )
        if action == "call_record_query":
            order_by = request.GET.get("order_by", "")
            first = request.GET.get("first", "")
            objects = CallRecordModel.objects.filter(**data)
            if order_by:
                objects.order_by(order_by)
            if first:
                objects.first()
            result = json.loads(serializers.serialize("json", objects))
            return get_api_response(True, result, 200)
        if action == "user_query":
            objects = TelephonyAgent.objects.filter(**data)
            result = serializers.serialize("json", objects)
            return get_api_response(True, result, 200)
        if action == "add_recording_file":
            path = data.get("path", "")
            if path:
                record = CallRecordModel.objects.get(id=data["id"])
                with open(path, "rb") as f:
                    django_file = File(f)
                    record.call_record.save(os.path.basename(path), django_file)
                    record.is_file_synced = True
                    if record.extra_data is None:
                        record.extra_data = {"recording_type": data["recording_type"]}
                    else:
                        record.extra_data["recording_type"] = data["recording_type"]
                    record.save()
                os.remove(path)
            return get_api_response(True, "File added successfully", 200)
        if action == "telephony_agent_query":
            objects = TelephonyAgent.objects.filter(**data)
            result = serializers.serialize("json", objects)
            return get_api_response(True, result, 200)
        return get_api_response(False, "Invalid action", 400)

    def put(self, request, *args, **kwargs):
        action = request.GET.get("action", "")
        data = json.loads(request.body)
        if action == "update_call_record":
            if data.get("query", False):
                call_record = (
                    CallRecordModel.objects.filter(**data.pop("query"))
                    .order_by("-id")
                    .first()
                )
            elif data.get("pk", False):
                call_record = CallRecordModel.objects.get(pk=data.pop("pk"))
            elif request.GET.get("pk", False):
                call_record = CallRecordModel.objects.get(pk=request.GET.get("pk"))
            else:
                return get_api_response(False, "Invalid call record", 400)
            if data.get("extra_data", False):
                extra_data = call_record.extra_data
                if extra_data is None:
                    extra_data = {}
                extra_data.update(**data["extra_data"])
                call_record.extra_data = extra_data
                call_record.save()
                data.pop("extra_data")
            if data.get("agent_id"):
                call_record.agent_id = data.pop("agent_id")
                call_record.save()
            for key, value in data.items():
                setattr(call_record, key, value)
            call_record.save()
            record = model_to_dict(call_record)
            del record["call_record"]
            del record["start_time"]
            return get_api_response(
                True,
                {
                    "record": record,
                },
                200,
            )
        return get_api_response(False, "Invalid action", 400)


class TelephonyAPIView(APIView):
    def post(self, request, *args, **kwargs):
        action = request.GET.get("action", None)
        provider = request.GET.get("provider")
        data = request.data
        if action == "call":
            destination_number = data.get("destination_number")
            if not validate_phone(destination_number):
                return get_api_response(False, "Invalid phone number", 400)
            resp = requests.post(
                get_package_url(
                    request,
                    f"telephony/api/?action=call&user_id={request.user.id}",
                    provider,
                ),
                data={"destination_number": destination_number},
                headers={"Content-Type": "application/json"},
            )
            resp_data = resp.json()
            qna_resp = requests.get(
                get_package_url(request, "qna/api/get-details/", "qna")
                + "?action=get_questionnaire_details&questionnaire_key="
                + resp_data["response"]["notes_key"]
                + "&app_object_uuid="
                + resp_data["response"]["object_uuid"]
            )
            qna_resp_data = qna_resp.json()
            data = qna_resp_data.get("response").get("data")
            if data.get("can_fill", False):
                notes_link = (
                    "/qna/qna/app/take-responses/"
                    + data.get("questionnaire_uuid")
                    + "/"
                    + resp_data["response"]["object_uuid"]
                    + "/?redirect_url="
                    + "/communication/dashboard/telephony"
                )
            if resp.status_code == 200:
                return get_api_response(
                    True, {"message": "Call initiated", "notes_link": notes_link}, 200
                )
            if resp.status_code == 401:
                return get_api_response(False, "Unauthorized", 401)
            return get_api_response(False, "Call Failed", resp.status_code)


class TelephonyConfigureView(APIView):
    def get(self, request, *args, **kwargs):
        action = request.GET.get("action", "")

        if action == "fetch_configs":
            provider = request.GET.get("provider", "")
            objects = TelephonyConfigModel.objects.filter(provider=provider).order_by(
                "-modified_at"
            )
            result = TelephonyConfigureSerializer(objects, many=True).data
            return get_api_response(True, result, 200)
        if action == "get_config":
            pk = request.GET.get("pk", None)
            if pk is not None:
                telephony_config = TelephonyConfigModel.objects.get(pk=pk)
            else:
                try:
                    telephony_config = TelephonyConfigModel.objects.get(is_default=True)
                except TelephonyConfigModel.DoesNotExist:
                    return get_api_response(False, "No default config found", 400)
            return get_api_response(True, telephony_config.config, 200)
        if action == "get_telephony_agents":
            provider = request.GET.get("provider", "")
            objs = TelephonyAgent.objects.filter(provider=provider)
            result = TelephonyAgentSerializer(objs, many=True).data
            return get_api_response(True, result, 200)
        if action == "get_app_users":
            objs = AppUserModel.objects.exclude(
                id__in=TelephonyAgent.objects.values("user")
            )
            result = AppUserSerializer(objs, many=True).data
            return get_api_response(True, result, 200)
        if action == "initialize_agent_form":
            path = os.path.dirname(os.path.realpath(__file__))
            with open(f"{path}/agent_schema.json", "r") as f:
                schema = json.load(f)
                schema["json_schema"]["properties"]["user"]["enum"] = [
                    obj.pk
                    for obj in AppUserModel.objects.exclude(
                        id__in=TelephonyAgent.objects.values("user")
                    )
                ]
                schema["json_schema"]["properties"]["user"]["enumNames"] = [
                    obj.name
                    for obj in AppUserModel.objects.exclude(
                        id__in=TelephonyAgent.objects.values("user")
                    )
                ]
            return get_api_response(True, {"form": schema}, 200)
        if action == "get_agent_update_form":
            pk = request.GET.get("pk", None)
            provider = request.GET.get("provider", "")
            path = os.path.dirname(os.path.realpath(__file__))
            current = TelephonyAgent.objects.get(pk=pk)
            with open(f"{path}/agent_schema.json", "r") as f:
                schema = json.load(f)
                enum = [
                    obj.pk
                    for obj in AppUserModel.objects.exclude(
                        id__in=TelephonyAgent.objects.values("user")
                    )
                ]
                enumNames = [
                    obj.name
                    for obj in AppUserModel.objects.exclude(
                        id__in=TelephonyAgent.objects.values("user")
                    )
                ]
                enum.append(current.user.pk)
                enumNames.append(current.user.name)
                schema["json_schema"]["properties"]["user"]["enum"] = enum
                schema["json_schema"]["properties"]["user"]["enumNames"] = enumNames
                schema["json_schema"]["title"] = f"Update {provider} Agent"
                schema["form_data"] = model_to_dict(TelephonyAgent.objects.get(pk=pk))
                schema["form_data"]["config"] = json.dumps(
                    schema["form_data"]["config"]
                )
            return get_api_response(True, {"form": schema}, 200)
        return get_api_response(False, "Invalid action", 400)

    def post(self, request, *args, **kwargs):
        body = request.data
        action = request.GET.get("action", "")
        provider = request.GET.get("provider", "")
        if action == "create_config":
            try:
                TelephonyConfigModel.objects.create(
                    config=body["config"],
                    provider=provider,
                    provider_package_name=body.get("provider_package_name"),
                )
            except Exception as e:
                return get_api_response(False, str(e), 500)
            return get_api_response(True, "config created", 200)
        if action == "create_agent":
            appuser_pk = body["user"]
            user = AppUserModel.objects.get(pk=appuser_pk)
            try:
                TelephonyAgent.objects.create(
                    user=user,
                    provider=request.GET.get("provider", ""),
                    provider_package_name=request.GET.get("provider_package_name", ""),
                    config=json.loads(body["config"]),
                )
            except Exception as e:
                return get_api_response(False, str(e), 500)
            return get_api_response(True, "config created", 200)
        return get_api_response(False, "Invalid action", 400)

    def put(self, request, *args, **kwargs):
        body = request.data
        action = request.GET.get("action", None)
        pk = request.GET.get("pk", None)
        if action == "update_config":
            telephony_config = TelephonyConfigModel.objects.get(pk=pk)
            telephony_config.config = body["config"]
            telephony_config.save()
            return get_api_response(True, "config updated", 200)
        if action == "update_agent":
            agent = TelephonyAgent.objects.get(pk=pk)
            if body.get("config"):
                config = agent.config
                if type(body["config"]) == str:
                    config.update(**json.loads(body["config"]))
                else:
                    config.update(**body["config"])
                agent.config = config
            if body.get("is_active"):
                if body.get("is_active") == "true":
                    agent.is_active = True
                else:
                    agent.is_active = False
            if body.get("user"):
                agent.user = AppUserModel.objects.get(pk=body["user"])
            agent.save()
            return get_api_response(True, "config updated", 200)
        return get_api_response(False, "Invalid action", 400)
