import React, { useEffect, useMemo } from "react";
import SelectField from "../../../components/Form/SelectField";
import { useDispatch, useSelector } from "react-redux";
import { selectInitializeData, setCaregiverDetailCompleted } from "../../../slice/patient-detail-form";
import MultiFileUpload from "../../../components/Form/MultiFileUpload";

const CareGiversIdProof = ({ formik }) => {
  const initialDataa = useSelector(selectInitializeData);
  const dispatch = useDispatch();

  const idCardOptions = [
    { id: "passport", label: "Passport" },
    { id: "aadhaar", label: "Aadhaar" },
    { id: "pan", label: "PAN Card" },
    { id: "others", label: "Others" },
    { id: "driving", label: "Driving License" },
  ];

  // Required fields for this form section
  const requiredFields = [
    'caregiver.idProofType',
    'caregiver.idProofFiles'
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
      
      // For files array, check that it's not empty
      if (field === 'caregiver.idProofFiles' && Array.isArray(currentObj)) {
        return currentObj.length > 0;
      }
      
      return !!currentObj; // Check if value exists and is not empty
    });

    // Check if there are no errors in the required fields
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
  
  // Update completion status whenever form validity changes
  useEffect(() => {
    if (isFormValid) {
      dispatch(setCaregiverDetailCompleted(2));
    }
  }, [isFormValid, dispatch]);

  return (
    <div className="flex grow flex-col gap-4">
      <SelectField
        key="caregiver.idProofType"
        label="Select ID Proof Type"
        name="caregiver.idProofType"
        id="caregiver.idProofType"
        formik={formik}
        placeholder="Select ID Proof Type"
        value={formik.values.caregiver?.idProofType || ""}
        optionsData={idCardOptions}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.caregiver?.idProofType &&
          formik.errors.caregiver?.idProofType
        }
      />

      <MultiFileUpload
        formik={formik}
        label="Upload ID Proof Documents"
        id="caregiver.idProofFiles"
        name="caregiver.idProofFiles"
        isMultiple={true}
        value={formik.values.caregiver?.idProofFiles || []}
        onFileUpload={(files) => {
          formik.setFieldValue("caregiver.idProofFiles", files);
        }}
        onFileRemove={(files) => {
          formik.setFieldValue("caregiver.idProofFiles", files);
        }}
        error={
          formik.touched.caregiver?.idProofFiles &&
          formik.errors.caregiver?.idProofFiles
        }
      />
    </div>
  );
};

export default CareGiversIdProof;