import * as Yup from "yup";

export const getConcentInitialValues = () => {
  return {
    concent: {
      program_explained: '',
      data_processing_consent: '',
      caregiver_consent: false
    }
  };
};

// Field groups for organizing concent fields
export const fieldGroups = {
  concent: [
    'concent.program_explained',
    'concent.data_processing_consent',
    'concent.caregiver_consent'
  ]
};