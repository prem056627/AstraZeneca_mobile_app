import moment from "moment";

// Simplified initial values without the validation schema
export const getUploadDocsInitialValues = (storedData = {}) => {
  return {
    documents: {
      prescription: storedData.documents?.prescription ,
      hcpRecommendation: storedData.documents?.hcpRecommendation ,
      coupon: storedData.documents?.coupon 
    }
  };
};

// Field groups for organizing document fields
export const fieldGroups = {
  documentDetails: [
    'documents.prescription',
    'documents.hcpRecommendation',
    'documents.coupon'
  ]
};