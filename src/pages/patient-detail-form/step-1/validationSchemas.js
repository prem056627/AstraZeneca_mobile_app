import * as Yup from "yup";
import moment from "moment";

export const profileValidationSchema = Yup.object().shape({
  // Personal Details
  full_name: Yup.string().required("Full Name is required"),
  gender: Yup.string().required("Gender is required"),
  
  date_of_birth: Yup.date()
    .nullable()
    .test(
      "is-over-18",
      "You must be at least 18 years old",
      (value) => {
        if (!value) return true; // Allow null values
        const today = new Date();
        const eighteenYearsAgo = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        return value <= eighteenYearsAgo;
      }
    ),
  
  mobile_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
    
  email: Yup.string()
    .email("Invalid email format")
    .required("Email ID is required"),
  
  nationality: Yup.string().required("Nationality is required"),
  
  primary_language: Yup.string().required("Primary language is required"),

  // Address
  address: Yup.object().shape({
    line1: Yup.string().required("Address Line 1 is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
      .required("Pincode is required"),
  }),

  // Reimbursement Details
  employer_reimbursement: Yup.string().required("Please specify if employer provides reimbursement")
});