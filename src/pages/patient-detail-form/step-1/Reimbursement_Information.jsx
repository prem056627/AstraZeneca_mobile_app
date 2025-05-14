import React, { useState, useEffect, useMemo } from 'react';
import SelectField from '../../../components/Form/SelectField';
import { useDispatch } from 'react-redux';
import { setCompletedSections, setProfileDetailCompleted } from '../../../slice/patient-detail-form';

const reimbursementOptions = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

export default function ReimbursementDetails({ formik }) {
  const dispatch = useDispatch();
  
  // Required fields for this form section
  const requiredFields = ['employer_reimbursement'];

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
  }, [formik.values, formik.errors, requiredFields]);

  // Update completion status whenever form validity changes
  useEffect(() => {
    if (isFormValid) {
      dispatch(setProfileDetailCompleted(3));
    }
  }, [isFormValid, dispatch]);

  return (
    <>
      <div className="flex grow flex-col gap-4 mb-16">
        <SelectField
          key="employer_reimbursement"
          label={<>Do you have reimbursement from your employer?</>}
          name="employer_reimbursement"
          id="employer_reimbursement"
          formik={formik}
          placeholder="Select an option"
          value={formik.values.employer_reimbursement}
          optionsDataName="employer_reimbursement"
          optionsData={reimbursementOptions}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

       
      </div>
    </>
  );
}