import { get } from "lodash";
import moment from "moment";
import React, { useMemo } from "react";
import FormDatePicker from "../../../components/Form/FormDatePicker";
import InputField from "../../../components/Form/InputField";
import SelectField from "../../../components/Form/SelectField";
import { nationalityOptions } from "../../../utils/constants";
import { selectInitializeData, setCompletedSections, setProfileDetailCompleted, setSubFormCurrentStep } from "../../../slice/patient-detail-form";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as DownTickPrimary } from '../../../assets/images/svg/down_tick_dark.svg';
import { ReactComponent as DownTickSecondary } from '../../../assets/images/svg/down_tick_grey.svg';

const genderOptions = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
];

const languageOptions = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "tamil", label: "Tamil" },
  { id: "telugu", label: "Telugu" },
  { id: "kannada", label: "Kannada" },
  { id: "malayalam", label: "Malayalam" },
  { id: "marathi", label: "Marathi" },
  { id: "bengali", label: "Bengali" },
  { id: "gujarati", label: "Gujarati" },
  { id: "punjabi", label: "Punjabi" },
  { id: "urdu", label: "Urdu" },
  { id: "other", label: "Other" },
];

export default function PersonalDetailsForm({ formik, onNext }) {
  const initiaData = useSelector(selectInitializeData);
  const patient_mobile_number = initiaData?.mobile;
  const dispatch = useDispatch();
  
  // Add this useEffect to set the mobile number in Formik values when the component mounts
  React.useEffect(() => {
    if (patient_mobile_number) {
      formik.setFieldValue("mobile_number", patient_mobile_number);
    }
  }, [patient_mobile_number]);

  // Required fields for this form section
  const requiredFields = [
    'full_name',
    'gender',
    'date_of_birth',
    'mobile_number',
    'email',
    'nationality',
    'primary_language'
  ];

  // Check if all required fields are filled and valid
  const isFormValid = useMemo(() => {
    // Check if all required fields have values
    const allFieldsFilled = requiredFields.every(field => {
      const fieldValue = get(formik.values, field);
      return !!fieldValue; // Check if value exists and is not empty
    });

    // Check if there are any errors in the required fields
    const hasNoErrors = requiredFields.every(field => {
      const errorValue = get(formik.errors, field);
      return !errorValue; // No error found
    });

    return allFieldsFilled && hasNoErrors;
  }, [formik.values, formik.errors, requiredFields]);


  function handleNext() {
    // dispatch(setCompletedSections(1));
    dispatch(setProfileDetailCompleted(1));
    dispatch(setSubFormCurrentStep(2));
  }
  
  return (
    <div className="flex grow flex-col gap-[16px]">
      <InputField
        key="full_name"
        label="Full Name *"
        name="full_name"
        id="full_name"
        placeholder="Enter"
        value={formik.values.full_name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.full_name && formik.errors.full_name}
      />
      
      <div className="md:grid md:grid-cols-2 flex flex-col gap-4">
        <SelectField
          key="gender"
          label="Gender *"
          name="gender"
          id="gender"
          formik={formik}
          placeholder="Select"
          value={formik.values.gender}
          optionsDataName="gender"
          optionsData={genderOptions}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-1/2"
          error={formik.touched.gender && formik.errors.gender}
        />

        <FormDatePicker
          key={'date_of_birth'}
          label="Date of Birth *"
          name={'date_of_birth'}
          id={'date_of_birth'}
          placeholder="Select"
          value={formik.values.date_of_birth}
          formik={formik}
          min={moment().subtract(100, 'years')}
          max={moment()}
          error={formik.touched.date_of_birth && formik.errors.date_of_birth}
        />
      </div>

      <div className="flex flex-col gap-[4px]">
        <label
          htmlFor="mobile_number"
          className="font-open-sans text-form-xs font-semibold text-[#595454]"
        >
          Mobile Number *
        </label>
        <div className="flex gap-[12px] rounded-md border border-[#ACA9A9] px-[12px] py-[14px] bg-white">
          <span className="font-open-sans text-[#6C747D]">+91</span>
          <input
            id="mobile_number"
            name="mobile_number"
            type="text"
            readOnly
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength="10"
            value={formik.values.mobile_number}
            className="h-full w-full font-open-sans text-[#283A46] placeholder:text-[#9A9A9A] hover:outline-0 focus:outline-0 disabled:bg-[#f2f2f2]"
            placeholder="0000000000"
          />
        </div>
        {formik.touched.mobile_number && formik.errors.mobile_number && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.mobile_number}</div>
        )}
      </div>
      
      <div className="flex flex-col gap-[4px]">
        <label
          htmlFor="alternative_mobile"
          className="font-open-sans text-form-xs font-semibold text-[#595454]"
        >
          Alternative Phone Number
        </label>
        <div className="flex gap-[12px] rounded-md border border-[#ACA9A9] px-[12px] py-[14px] bg-white">
          <span className="font-open-sans text-[#6C747D]">+91</span>
          <input
            id="alternative_mobile"
            name="alternative_mobile"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength="10"
            value={formik.values.alternative_mobile || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="h-full w-full font-open-sans text-[#283A46] placeholder:text-[#9A9A9A] hover:outline-0 focus:outline-0 disabled:bg-[#f2f2f2]"
            placeholder="0000000000"
          />
        </div>
        {formik.touched.alternative_mobile && formik.errors.alternative_mobile && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.alternative_mobile}</div>
        )}
      </div>
      
      <InputField
        key="email"
        label="Email ID *"
        name="email"
        id="email"
        placeholder="john.doe@xyz.com"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
      />

      <div className="md:grid md:grid-cols-2 flex flex-col gap-4">
        <SelectField
          key="nationality"
          label="Nationality *"
          name="nationality"
          id="nationality"
          formik={formik}
          placeholder="Select"
          value={formik.values.nationality}
          optionsDataName="nationality"
          optionsData={nationalityOptions}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full"
          error={formik.touched.nationality && formik.errors.nationality}
        />
        
        <SelectField
          key="primary_language"
          label="Primary Language *"
          name="primary_language"
          id="primary_language"
          formik={formik}
          placeholder="Select"
          value={formik.values.primary_language}
          optionsDataName="language"
          optionsData={languageOptions}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full"
          error={formik.touched.primary_language && formik.errors.primary_language}
        />
      </div>
      
      <SelectField
        key="secondary_language"
        label="Secondary Language"
        name="secondary_language"
        id="secondary_language"
        formik={formik}
        placeholder="Select"
        value={formik.values.secondary_language}
        optionsDataName="language"
        optionsData={languageOptions}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-1/2"
        error={formik.touched.secondary_language && formik.errors.secondary_language}
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
}