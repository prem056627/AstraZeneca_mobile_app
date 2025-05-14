import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputField from "../../../components/Form/InputField";
import SelectField from "../../../components/Form/SelectField";
import { selectInitializeData, setProfileDetailCompleted, setSubFormCurrentStep } from "../../../slice/patient-detail-form";
import { ReactComponent as DownTickPrimary } from '../../../assets/images/svg/down_tick_dark.svg';
import { ReactComponent as DownTickSecondary } from '../../../assets/images/svg/down_tick_grey.svg';


const AddressProofForm = ({ formik }) => {
  const dispatch = useDispatch();
  let initialDataa = useSelector(selectInitializeData);

  const STATE_MAPPING = initialDataa?.state;
  const CITY_MAPPING = initialDataa?.city;

  // Required fields for this form section - using the correct path with address prefix
  const requiredFields = [
    'address.line1',
    'address.city',
    'address.state',
    'address.pincode'
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
      dispatch(setProfileDetailCompleted(2));
      // Move to the next subform step (step 3)
      dispatch(setSubFormCurrentStep(3));
    }
  };

  return (
    <div className="flex grow flex-col gap-4">
      <InputField
        key="address.line1"
        label="Address Line *"
        name="address.line1"
        id="address.line1"
        placeholder="Enter Address Line"
        value={formik.values.address?.line1 || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.address?.line1 &&
          formik.errors.address?.line1
        }
      />

      <SelectField
        key="address.city"
        label={<>City *</>}
        name="address.city"
        id="address.city"
        formik={formik}
        placeholder="Select"
        value={formik.values.address?.city || ""}
        optionsDataName="city"
        optionsData={
          CITY_MAPPING
            ? CITY_MAPPING.map((stateItem) => ({
                id: stateItem[1],
                label: stateItem[1],
              })).sort((a, b) => a.label.localeCompare(b.label))
            : []
        }
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-1/2"
        bottomPadding={false}
      />

      <SelectField
        key="address.state"
        label={<>State *</>}
        name="address.state"
        id="address.state"
        formik={formik}
        placeholder="Select"
        value={formik.values.address?.state || ""}
        optionsDataName="state"
        optionsData={
          STATE_MAPPING
            ? STATE_MAPPING.map((stateItem) => ({
                id: stateItem[1],
                label: stateItem[1],
              })).sort((a, b) => a.label.localeCompare(b.label))
            : []
        }
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-1/2"
        bottomPadding={false}
      />

      <InputField
        key="address.pincode"
        label="Pincode *"
        name="address.pincode"
        id="address.pincode"
        type="number"
        placeholder="Enter Pincode"
        value={formik.values.address?.pincode || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.address?.pincode && 
          formik.errors.address?.pincode
        }
      />
      
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

export default AddressProofForm;