export const getCaregiverInitialValues = (storedData = {}) => {
 
  return {
    caregiver: {
      fullName: storedData.caregiver?.fullName || "",
      email: storedData.caregiver?.email || "",
      gender: storedData.caregiver?.gender || "",
      mobileNumber: storedData.caregiver?.mobileNumber || "",
      relation: storedData.caregiver?.relation || "",
      idProofType: storedData.caregiver?.idProofType || "",
      idProofFiles: storedData.caregiver?.idProofFiles || []
    }
  };
};

// Field groups for organizing caregiver fields
export const fieldGroups = {
  caregiverDetails: [
    'caregiver.fullName',
    'caregiver.email',
    'caregiver.gender',
    'caregiver.mobileNumber',
    'caregiver.relation',
    'caregiver.idProofType',
    'caregiver.idProofFiles'
  ]
};
