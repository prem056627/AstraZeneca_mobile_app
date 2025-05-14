import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInitializeData,
  setAuthorizeConcentCompleted,
} from "../../../slice/patient-detail-form";

import Radio from "../../../components/Form/Radio";

// IconToggleTick component
const IconToggleTick = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AuthorizeForm = ({ formik }) => {
  const initialData = useSelector(selectInitializeData);
  const dispatch = useDispatch();

  // Define required fields for validation - with correct paths matching the validation schema
  const requiredFields = [
    "concent.program_explained",
    "concent.data_processing_consent", 
    "concent.caregiver_consent"
  ];

  // Ensure the concent object is initialized
  useEffect(() => {
    if (!formik.values.concent) {
      formik.setFieldValue("concent", {
        program_explained: "",
        data_processing_consent: "",
        caregiver_consent: false
      });
    }
  }, [formik.values, formik]);

  const isFormValid = useMemo(() => {
    // Make sure concent object exists before validation
    if (!formik.values.concent) return false;
    
    const allFieldsFilled = requiredFields.every((field) => {
      const fieldPath = field.split(".");
      let currentObj = formik.values;

      for (const part of fieldPath) {
        if (!currentObj || currentObj[part] === undefined || currentObj[part] === null) return false;
        currentObj = currentObj[part];
      }

      // For file arrays, check they're not empty
      if (Array.isArray(currentObj)) {
        return currentObj.length > 0;
      }

      // For radio buttons, make sure they have a valid value (yes/no)
      if (field.includes("program_explained") || field.includes("data_processing_consent")) {
        return currentObj === "yes" || currentObj === "no";
      }

      return !!currentObj;
    });

    const hasNoErrors = requiredFields.every((field) => {
      const fieldPath = field.split(".");
      let errorValue = formik.errors;

      for (const part of fieldPath) {
        if (!errorValue || !errorValue[part]) return true;
        errorValue = errorValue[part];
      }

      return !errorValue;
    });

    return allFieldsFilled && hasNoErrors;
  }, [formik.values, formik.errors, requiredFields]);

  useEffect(() => {
    if (isFormValid) {
      dispatch(setAuthorizeConcentCompleted(1));
    } else {
      dispatch(setAuthorizeConcentCompleted(0));
    }
  }, [isFormValid, dispatch]);

  // Authorization content
  const AuthorizationContent = () => (
    <div className="flex flex-col">
      <span className="font-open-sans text-sm leading-5">
        I hereby authorize XYZ Centre to
      </span>
      <ol className="list-decimal pl-6 mt-2 space-y-3 text-sm">
        <li>
          Obtain my health information from healthcare providers, treating
          Doctor and insurance company to certify accuracy of the information
          for completion of the enrolment process.
        </li>
        <li>
          To conduct necessary audit and patient verification processes
          (including through third parties) on behalf of AZ during my enrolment
          for and anticipation in the program. Failure to do so may affect the
          ability to enter/continue in the patient assistance program.
        </li>
        <li>
          Contact me or my caretaker for additional information or for providing
          services of program either by call or email or other form of
          communication.
        </li>
        <li>
          I allow XYZ to report any adverse event, that may be identified during
          our interactions to AZ and also agree that AZ may contact my treating
          physician to get more details if needed.
        </li>
      </ol>
    </div>
  );

  const CaregiverPrivacyCheckbox = () => {
    return (
      <div className="mt-4 w-full max-w-xl">
        <label
          htmlFor="concent.caregiver_consent"
          className="flex gap-2 cursor-pointer"
        >
          {formik.values.concent?.caregiver_consent ? (
            <div className="relative flex items-center justify-center h-[20px] min-h-[20px] w-[20px] min-w-[20px] rounded-sm bg-primary border-2 border-primary">
              <IconToggleTick className="w-4 h-4" />
            </div>
          ) : (
            <div className="h-[20px] min-h-[20px] w-[20px] min-w-[20px] rounded-sm border-2 border-[#C4C4C4]"></div>
          )}
          <input
            className="invisible absolute h-[0px] w-[0px]"
            name="concent.caregiver_consent"
            id="concent.caregiver_consent"
            type="checkbox"
            disabled={false}
            checked={formik.values.concent?.caregiver_consent || false}
            onChange={() => {
              // Set the new value to the opposite of the current value
              const newValue = !(formik.values.concent?.caregiver_consent || false);
              
              // Ensure concent object exists
              if (!formik.values.concent) {
                formik.setFieldValue("concent", {
                  program_explained: "",
                  data_processing_consent: "",
                  caregiver_consent: false
                });
              }
              
              // Update formik
              formik.setFieldValue("concent.caregiver_consent", newValue);
            }}
            onBlur={formik.handleBlur}
          />
          <div className="flex flex-col">
            <span className="font-lato text-sm leading-5 text-[#3B3B3B]">
              <AuthorizationContent />
            </span>
          </div>
        </label>
        {formik.touched.concent?.caregiver_consent &&
          formik.errors.concent?.caregiver_consent && (
            <p className="text-[#cc3300] text-xs mt-1">
              {formik.errors.concent.caregiver_consent}
            </p>
          )}
      </div>
    );
  };

  return (
    <div className="flex grow flex-col gap-4">
      <CaregiverPrivacyCheckbox />

      <div className=" flex flex-col gap-6 pt-4 pb-4">
        <Radio
          label="I confirm that the AZ patient support programme has been fully explained to me and I consent to join the programme as explained above."
          name="concent.program_explained"
          radioData={[
            {
              id: "program_explained_yes",
              value: "yes",
              label: "Yes",
            },
            {
              id: "program_explained_no",
              value: "no",
              label: "No",
            },
          ]}
          formik={formik}
          value={formik.values.concent?.program_explained || ""}
          // isMadetory={true}
          checkboxType="circle"
        />

        <Radio
          label="I consent to XYZ Center processing my Personal Information for the purposes of providing the AZ patient support programme as explained above."
          name="concent.data_processing_consent"
          radioData={[
            {
              id: "data_processing_yes",
              value: "yes",
              label: "Yes",
            },
            {
              id: "data_processing_no",
              value: "no",
              label: "No",
            },
          ]}
          formik={formik}
          value={formik.values.concent?.data_processing_consent || ""}
          // isMadetory={true}.
          checkboxType="circle"
        />
      </div>
    </div>
  );
};

export default AuthorizeForm;