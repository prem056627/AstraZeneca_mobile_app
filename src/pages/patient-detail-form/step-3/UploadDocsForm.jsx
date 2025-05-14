import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectInitializeData, setUploadDocCompleted } from "../../../slice/patient-detail-form";
import MultiFileUpload from "../../../components/Form/MultiFileUpload";

const UploadDocsForm = ({ formik }) => {
  const initialDataa = useSelector(selectInitializeData);
  const dispatch = useDispatch();

  // Define required fields for validation
  const requiredFields = [
    'documents.prescription',
    'documents.hcpRecommendation',
    'documents.coupon'
  ];

  const isFormValid = useMemo(() => {
    const allFieldsFilled = requiredFields.every(field => {
      const fieldPath = field.split('.');
      let currentObj = formik.values;

      for (const part of fieldPath) {
        if (!currentObj || !currentObj[part]) return false;
        currentObj = currentObj[part];
      }

      // For file arrays, check they're not empty
      if (Array.isArray(currentObj)) {
        return currentObj.length > 0;
      }

      return !!currentObj;
    });

    const hasNoErrors = requiredFields.every(field => {
      const fieldPath = field.split('.');
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
      dispatch(setUploadDocCompleted(1));
    }
  }, [isFormValid, dispatch]);

  return (
    <div className="flex grow flex-col gap-4">
      <MultiFileUpload
        formik={formik}
        label="Prescription"
        id="documents.prescription"
        name="documents.prescription"
        isMultiple={false}
        value={formik.values.documents?.prescription || []}
        onFileUpload={(files) => {
          formik.setFieldValue("documents.prescription", files);
        }}
        onFileRemove={(files) => {
          formik.setFieldValue("documents.prescription", files);
        }}
        error={
          formik.touched.documents?.prescription &&
          formik.errors.documents?.prescription
        }
      />
     
      
      <MultiFileUpload
        formik={formik}
        label="HCP Recommendation Form"
        id="documents.hcpRecommendation"
        name="documents.hcpRecommendation"
        isMultiple={false}
        value={formik.values.documents?.hcpRecommendation }
        onFileUpload={(files) => {
          formik.setFieldValue("documents.hcpRecommendation", files);
        }}
        onFileRemove={(files) => {
          formik.setFieldValue("documents.hcpRecommendation", files);
        }}
        error={
          formik.touched.documents?.hcpRecommendation &&
          formik.errors.documents?.hcpRecommendation
        }
      />
      
      <MultiFileUpload
        formik={formik}
        label="Coupon"
        id="documents.coupon"
        name="documents.coupon"
        isMultiple={false}
        value={formik.values.documents?.coupon || []}
        onFileUpload={(files) => {
          formik.setFieldValue("documents.coupon", files);
        }}
        onFileRemove={(files) => {
          formik.setFieldValue("documents.coupon", files);
        }}
        error={
          formik.touched.documents?.coupon &&
          formik.errors.documents?.coupon
        }
      />
    </div>
  );
};

export default UploadDocsForm;

