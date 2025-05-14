import * as Yup from "yup";

const FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 5MB in bytes

// Custom test function to properly validate file size for both individual files and arrays
const createFileValidator = () => 
  Yup.mixed().test(
    "fileSize",
    "Maximum size of the document should be 2MB",
    (value) => {
      // If empty, validation passes (for optional files)
      if (!value) return true;
      
      // For array of files
      if (Array.isArray(value)) {
        // Empty array is valid (handled by required/min validation separately)
        if (value.length === 0) return true;
        
        // Check that every file in array is valid
        return value.every(file => {
          // Skip null/undefined entries
          if (!file) return true;
          
          // For File objects with size property
          if (file.size !== undefined) {
            return file.size <= FILE_SIZE_LIMIT;
          }
          
          return true; // For non-File objects, pass validation
        });
      } 
      
      // For single file object
      if (value && value.size !== undefined) {
        return value.size <= FILE_SIZE_LIMIT;
      }
      
      return true; // For other values, pass validation
    }
  );

// Create base schemas with proper error messages
const createRequiredFileSchema = (fieldName) => 
  createFileValidator()
    .required(`${fieldName} is required`);

export const uploadDocsValidationSchema = Yup.object().shape({
  documents: Yup.object().shape({
    prescription: createRequiredFileSchema("Prescription document"),
    hcpRecommendation: createRequiredFileSchema("HCP Recommendation"),
    coupon: createRequiredFileSchema("Coupon document")
  })
});