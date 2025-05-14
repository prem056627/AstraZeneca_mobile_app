import moment from 'moment';

export const getProfileInitialValues = (storedData = {}) => {
  return {
    // Personal Details
    full_name: storedData.full_name || "",
    gender: storedData.gender || "",
    date_of_birth: storedData.date_of_birth ? new Date(storedData.date_of_birth) : null,
    mobile_number: "",
    email: storedData.email || "",
    nationality: storedData.nationality || "",
    primary_language: storedData.primary_language || "",
    secondary_language: storedData.secondary_language || "",
    alternative_mobile: storedData.alternative_mobile || "",

    // Address
    address: {
      line1: storedData.address?.line1 || "",
      city: storedData.address?.city || "",
      state: storedData.address?.state || "",
      pincode: storedData.address?.pincode || "",
    },

    // ID Details
    employer_reimbursement: storedData.employer_reimbursement || "",
  };
};

// Field groups for different sections (optional, but helpful for organization)
export const fieldGroups = {
  personalDetails: [
    'full_name',
    'gender',
    'date_of_birth',
    'mobile_number',
    'email',
    'nationality',
    'primary_language'
  ],
  addressDetails: [
    'address.line1',
    'address.city',
    'address.state',
    'address.pincode'
  ],
  reimbursementDetails: [
    'employer_reimbursement'
  ]
};
