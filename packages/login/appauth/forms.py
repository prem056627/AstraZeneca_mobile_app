import requests
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate
from django import forms
from django.conf import settings

from crispy_forms.helper import FormHelper
from crispy_forms.layout import (
    Layout,
    ButtonHolder,
    Submit,
    HTML,
    Div,
    Field,
)

from zango.apps.appauth.models import AppUserModel, OldPasswords
from zango.apps.shared.tenancy.models import TenantModel
from zango.api.app_auth.profile.v1.utils import PasswordValidationMixin
from zango.core.utils import get_package_url
from zango.core.package_utils import package_installed


class ZelthyAuthenticationForm(AuthenticationForm):
    """
    Modified django standard authenticationform to allow taking given usermodel
    """

    usermodel = None

    def __init__(self, request=None, *args, **kwargs):
        if not self.usermodel:
            return super(ZelthyAuthenticationForm, self).__init__(
                request=None, *args, **kwargs
            )

        self.request = request
        self.user_cache = None

        super(ZelthyAuthenticationForm, self).__init__(*args, **kwargs)

        # Set the label for the "username" field.
        self.username_field = self.usermodel._meta.get_field(
            self.usermodel.USERNAME_FIELD
        )


class LoginForm(ZelthyAuthenticationForm):
    """Login form."""

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_show_labels = False
        submit_button = Submit("submit", "Login")
        submit_button.field_classes = "btn"
        layout_list = [
            Div(
                Field("username", placeholder="Email ID/ Mobile Number"),
                Field("password", placeholder="Password"),
            ),
            ButtonHolder(submit_button),
        ]

        self.helper.layout = Layout(*layout_list)

        self.helper.form_class = "uk-form uk-form-stacked"
        self.helper.field_class = "uk-input-group uk-text-small"


class AppLoginForm(LoginForm):
    usermodel = AppUserModel

    def __init__(self, *args, **kwargs):
        super(AppLoginForm, self).__init__(*args, **kwargs)
        self.request = self.initial["request"]
        sso_pkg_config = package_installed("sso", self.request.tenant)
        self.helper = FormHelper()
        self.helper.form_show_labels = False
        submit_button = Submit("submit", "Login")
        submit_button.field_classes = "btn"
        layout_list = [
            Div(
                Field("username", placeholder="Email ID/ Mobile Number"),
                Field("password", placeholder="Password"),
            ),
            ButtonHolder(submit_button),
        ]

        saml_div = None
        if sso_pkg_config:
            self.fields["saml"] = forms.ChoiceField()
            self.fields["saml"].required = False
            self.fields["username"].required = False
            self.fields["password"].required = False

            samls = {}
            url = get_package_url(
                self.request,
                f"saml/fetch_saml_config/?action=fetch_config",
                "sso",
            )
            response = requests.get(url)
            saml_choices = [
                (0, "Select organization"),
            ]
            if response.status_code == 200:
                samls = response.json().get("response")
            for s in samls:
                saml_choices.append((s, samls[s]))
            saml_choices = tuple(saml_choices)
            self.fields["saml"].choices = saml_choices
            saml_div = Div(
                HTML("""<p style='text-align:center;'>Or</p>"""),
                HTML("""<h4>Choose a single sign-on option</h4>"""),
                Field("saml", label="Select organization", css_class="select-style"),
            )

        if len(layout_list) > 1:
            if saml_div:
                layout_list.insert(len(layout_list) - 1, saml_div)
        self.helper.layout = Layout(*layout_list)

        self.helper.form_class = "uk-form uk-form-stacked"
        self.helper.field_class = "uk-input-group uk-text-small"


class UserRoleSelectionForm(forms.Form):
    user_role = forms.ChoiceField()

    def __init__(self, *args, **kwargs):
        self.user = kwargs["user"]
        kwargs.pop("user")
        super(UserRoleSelectionForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.user_roles = self.user.roles.filter(is_active=True)
        self.helper.form_show_labels = False
        choices = []
        for t in self.user_roles:
            choices.append(
                (t.id, f"{t.name}"),
            )
        choices = tuple(choices)
        self.fields["user_role"].choices = choices
        _text = "Select User Role"
        submit_button = Submit("submit", "Proceed")
        submit_button.field_classes = "btn"
        if len(choices) > 0:
            if len(choices) > 1:
                self.helper.layout = Layout(
                    Div(
                        HTML(f"<h2>{_text}</h2>"),
                        Field(
                            "user_role",
                            label="Select User Role",
                            css_class="select-style",
                        ),
                    ),
                    ButtonHolder(submit_button),
                )
            else:
                ## If only 1 role is available and the form is shown (required in openid login), then autosubmit
                self.helper.layout = Layout(
                    Div(
                        HTML(
                            "<script>document.addEventListener('DOMContentLoaded', function(event) {document.getElementById('submit-id-submit').click()})</script>"
                        ),
                        Field(
                            "user_role",
                            label="Select User Role",
                            css_class="select-style",
                        ),
                    ),
                    ButtonHolder(submit_button),
                )

        else:
            self.helper.layout = Layout(
                Div(
                    HTML(
                        """<p>There are no roles mapped to your account. You may not proceed!</p>"""
                    )
                )
            )


class ChangePasswordForm(forms.Form, PasswordValidationMixin):
    password = forms.CharField(widget=forms.PasswordInput)
    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)
    oldpassword_model = OldPasswords

    def __init__(self, *args, **kwargs):
        if kwargs.get("user"):
            self.user = kwargs["user"]
            kwargs.pop("user")
        if kwargs["initial"].get("user"):
            self.user = kwargs["initial"]["user"]
        if kwargs["initial"].get("token"):
            self.token = kwargs["initial"]["token"]
        else:
            self.token = None
        super(ChangePasswordForm, self).__init__(*args, **kwargs)
        submit_button = Submit("submit", "Submit")
        submit_button.field_classes = "btn"

        self.helper = FormHelper()
        self.helper.form_show_labels = False
        self.helper.layout = Layout(
            Div(
                HTML("""<h2>Set a new password</h2>"""),
                Field("password", placeholder="Current password"),
                Field("password1", placeholder="New password"),
                Field("password2", placeholder="Confirm password"),
            ),
            ButtonHolder(submit_button),
        )
        self.helper.form_class = "form"

    def clean_password(self):
        """
        Validates that the email is not already in use.
        """
        if self.cleaned_data.get("password", None):
            try:
                user = authenticate(
                    username=self.user.email, password=self.cleaned_data["password"]
                )
            except:
                raise forms.ValidationError(
                    "The current password you have entered is wrong. Please try again!"
                )
            return self.cleaned_data["password"]

    def clean_password2(self):
        """method to validate password"""
        password = self.cleaned_data.get("password", "")
        password1 = self.cleaned_data.get("password1", "")
        password2 = self.cleaned_data["password2"]

        validation = self.run_all_validations(self.user, password1, password2, password)
        if not validation.get("validation"):
            raise forms.ValidationError(validation.get("msg"))
        return password2

    def save(self):
        password = self.cleaned_data.get("password1", "")
        self.user.set_password(password)
        self.user.save()
        obj = self.oldpassword_model.objects.create(user=self.user)
        obj.setPasswords(self.user.password)
        obj.save()
        return


class ResetPasswordForm(ChangePasswordForm):
    password = None

    def __init__(self, *args, **kwargs):
        super(ResetPasswordForm, self).__init__(*args, **kwargs)
        submit_buttton = Submit("submit", "Submit")
        submit_buttton.field_classes = "btn"
        self.helper.layout = Layout(
            Div(
                HTML("""<h2>Set a new password</h2>"""),
                Field("password1", placeholder="New password"),
                Field("password2", placeholder="Confirm password"),
            ),
            ButtonHolder(submit_buttton),
        )

    def clean_password(self):
        pass


class AppUserResetPasswordForm(ResetPasswordForm):
    oldpassword_model = OldPasswords
    password = None
