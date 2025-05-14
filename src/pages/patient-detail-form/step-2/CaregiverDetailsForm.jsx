import React, { useMemo } from "react";
import InputField from "../../../components/Form/InputField";
import SelectField from "../../../components/Form/SelectField";
import { useDispatch, useSelector } from "react-redux";
import { selectInitializeData, setCaregiverDetailCompleted, setCompletedSections, setSubFormCurrentStep } from "../../../slice/patient-detail-form";
import { ReactComponent as DownTickPrimary } from '../../../assets/images/svg/down_tick_dark.svg';
import { ReactComponent as DownTickSecondary } from '../../../assets/images/svg/down_tick_grey.svg';

const CaregiverDetailsForm = ({ formik }) => {
  const initialDataa = useSelector(selectInitializeData);
  const dispatch = useDispatch();

  // Gender options for the dropdown
  const genderOptions = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "other", label: "Other" }
  ];

  // Caregiver relation options
  const relationOptions = [
    { id: "parent", label: "Parent" },
    { id: "spouse", label: "Spouse" },
    { id: "child", label: "Child" },
    { id: "sibling", label: "Sibling" },
    { id: "friend", label: "Friend" },
    { id: "other", label: "Other" }
  ];

  // Required fields for this form section - conditional based on hasCaregiverFlag
  const requiredFields = [
    'caregiver.fullName',
    'caregiver.email',
    'caregiver.gender',
    'caregiver.mobileNumber',
    'caregiver.relation'
  ];

  // Check if all required fields are filled and valid
  const isFormValid = useMemo(() => {
    // Check if all required fields have values
    const allFieldsFilled = requiredFields.every(field => {
      const fieldPath = field.split('.');
      let currentObj = formik.values;
      
      // Navigate to the nested field value
      for (const part of fieldPath) {
        if (!currentObj || !currentObj[part]) return false;
        currentObj = currentObj[part];
      }
      
      return !!currentObj; // Check if value exists and is not empty
    });

    // Check if there are any errors in the required fields
    const hasNoErrors = requiredFields.every(field => {
      const fieldPath = field.split('.');
      let errorValue = formik.errors;
      
      // Navigate to the nested error value
      for (const part of fieldPath) {
        if (!errorValue || !errorValue[part]) return true; // No error at this path
        errorValue = errorValue[part];
      }
      
      return !errorValue; // No error found
    });

    return allFieldsFilled && hasNoErrors;
  }, [formik.values, formik.errors]);

  // Handle Next button click
  const handleNext = () => {
    if (isFormValid) {
      dispatch(setCaregiverDetailCompleted(1));
      // Move to the next subform step
      dispatch(setSubFormCurrentStep(2));
    }
  };

  return (
    <div className="flex grow flex-col gap-4">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="hasCaregiverFlag"
          name="hasCaregiverFlag"
          checked={formik.values.hasCaregiverFlag || false}
          onChange={formik.handleChange}
          className="w-4 h-4 text-[#7C084B] border-gray-300 rounded focus:ring-[#7C084B]"
        />
        <label htmlFor="hasCaregiverFlag" className="ml-2 font-medium text-gray-700">
          Is there a caregiver of the patient?
        </label>
      </div>

      <InputField
        key="caregiver.fullName"
        label="Caregiver Full Name"
        name="caregiver.fullName"
        id="caregiver.fullName"
        placeholder="Enter Caregiver Full Name"
        value={formik.values.caregiver?.fullName || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.caregiver?.fullName &&
          formik.errors.caregiver?.fullName
        }
      />

      <InputField
        key="caregiver.email"
        label="Email"
        name="caregiver.email"
        id="caregiver.email"
        type="email"
        placeholder="Enter Email Address"
        value={formik.values.caregiver?.email || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.caregiver?.email &&
          formik.errors.caregiver?.email
        }
      />

      <SelectField
        key="caregiver.gender"
        label="Gender"
        name="caregiver.gender"
        id="caregiver.gender"
        formik={formik}
        placeholder="Select Gender"
        value={formik.values.caregiver?.gender || ""}
        optionsData={genderOptions}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.caregiver?.gender &&
          formik.errors.caregiver?.gender
        }
      />

      <InputField
        key="caregiver.mobileNumber"
        label="Mobile Number"
        name="caregiver.mobileNumber"
        id="caregiver.mobileNumber"
        type="tel"
        placeholder="Enter Mobile Number"
        value={formik.values.caregiver?.mobileNumber || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.caregiver?.mobileNumber &&
          formik.errors.caregiver?.mobileNumber
        }
      />

      <SelectField
        key="caregiver.relation"
        label="Caregiver Relation"
        name="caregiver.relation"
        id="caregiver.relation"
        formik={formik}
        placeholder="Select Relation"
        value={formik.values.caregiver?.relation || ""}
        optionsData={relationOptions}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.caregiver?.relation &&
          formik.errors.caregiver?.relation
        }
      />

      {formik.values.caregiver?.relation === "other" && (
        <InputField
          key="caregiver.relationName"
          label="Specify Relation"
          name="caregiver.relationName"
          id="caregiver.relationName"
          placeholder="Enter Relation Name"
          value={formik.values.caregiver?.relationName || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.caregiver?.relationName &&
            formik.errors.caregiver?.relationName
          }
        />
      )}


      <div className="flex justify-end mt-6">
        <div className="flex items-center gap-[6px]">
          {isFormValid ? <DownTickPrimary className="w-5 h-5"/> : <DownTickSecondary className="w-5 h-5"/>}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isFormValid}
            className={`py-2 font-bold font-sans ${
              isFormValid 
                ? 'text-[#7C084B] focus:ring-2 focus:ring-[#ffffff] focus:ring-offset-2' 
                : 'text-gray-500 cursor-not-allowed'
            } transition-colors duration-200`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDetailsForm;