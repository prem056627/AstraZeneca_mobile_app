import * as Yup from "yup";

export const concentValidationSchema = Yup.object().shape({
  concent: Yup.object().shape({
    program_explained: Yup.string()
      .required("Program explanation acknowledgment is required"),
    data_processing_consent: Yup.string()
      .required("Data processing consent is required"),
    caregiver_consent: Yup.boolean()
      .required("Caregiver consent is required")
  })
});

