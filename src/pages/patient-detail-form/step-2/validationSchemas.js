import * as Yup from "yup";
import moment from "moment";



// Caregiver validation schema - can be used separately if needed
export const caregiverValidationSchema = Yup.object().shape({
  caregiver: Yup.object().shape({
    fullName: Yup.string().required("Caregiver full name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Caregiver email is required"),
    gender: Yup.string().required("Caregiver gender is required"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
      .required("Caregiver mobile number is required"),
    relation: Yup.string().required("Relationship to patient is required"),
    idProofType: Yup.string().required("ID proof type is required"),
    idProofFiles: Yup.array()
      .min(1, "At least one ID proof document is required")
      .required("ID proof documents are required")
  })
});