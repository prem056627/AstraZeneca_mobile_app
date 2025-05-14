import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import MultiFileUpload from '../../components/Form/MultiFileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { selectInitializeData, selectSelectedEnrollProgram, setDocUploadStatus, setProgramEnrollmentConsent, setProgramEnrollmentSuccess, setProgramStatus, setSchemaShown } from '../../slice/patient-detail-form';
import { toast } from 'react-toastify';
import { ReactComponent as Tick } from "../../../src/assets/images/physicalVerify/tick_1.svg";
import { transformToFormData } from '../../utils/forms';
import useApi from '../../hooks/useApi';
import { LoaderContext } from '../../context/LoaderContextProvider';

const ShortFallDoc = () => {
  const [showUploadFields, setShowUploadFields] = useState(false);
  const { setLoading, isLoading } = useContext(LoaderContext);
  const dispatch = useDispatch();
  const triggerApi = useApi();
  const selectedEnrollProgram = useSelector(selectSelectedEnrollProgram);

  const initiaData = useSelector(selectInitializeData);
  const uploadFieldsforShortfall = initiaData?.program_data?.applied_programs;

  // Initialize with empty array
  let uploadFields = [];

  // Check if uploadFieldsforShortfall exists and has data
 
  if (uploadFieldsforShortfall && uploadFieldsforShortfall.length > 0) {
    // Map the data to the format you need
    uploadFields = uploadFieldsforShortfall.flatMap(program => {

      
      // Check if reupload_document exists and is an array
      if (program.reupload_document && Array.isArray(program.reupload_document)) {
        return program.reupload_document.map(prog => {
          return {
            id: prog.id || program.id,
            label: prog.label || program.label
          };
        });
      } else {
        // If no reupload_document array, return the program itself
        return [{
          id: program.id,
          label: program.label
        }];
      }
    });
  } else {
    // Use empty array if uploadFieldsforShortfall is not available
    uploadFields = [];
  }

  // Dynamically create initial values based on upload fields
  const generateInitialValues = () => {
    const initialValues = {};
    uploadFields.forEach(field => {
      initialValues[field.id] = [];
    });
    return initialValues;
  };

  // Validate function that dynamically checks all required fields
  const validate = (values) => {
    const errors = {};
    const MAX_FILES = 5;
    
    // Check each field from uploadFields
    uploadFields.forEach(field => {
      if (!values[field.id] || values[field.id].length === 0) {
        errors[field.id] = `${field.label} is required`;
      } else if (values[field.id].length > MAX_FILES) {
        errors[field.id] = `Maximum ${MAX_FILES} files allowed for ${field.label}`;
      }
    });
    
    return errors;
  };

  const notify = (message = 'You have successfully uploaded your documents.') =>
    toast(message, {
      duration: 6000,
      position: 'top-right',
      style: {
        borderBottom: '1.5px solid #86C4B6',
        fontFamily: 'open sans',
        fontSize: '14px',
        padding: '16px',
        fontWeight: '800',
        color: '#156352',
        background: '#E6FAF3',
        width: '100%',
      },
      className: 'custom-toast',
      progressStyle: { background: '#B4E3D5' },
      icon: <Tick className="w-16 h-12" />,
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    });

  // Function to make API call with FormData
  const makeApiCall = async (values) => {
    try {
      setLoading(true);
  
    let tempValues = values;
		tempValues['program_id'] = selectedEnrollProgram?.program_id;
      // Create new FormData
      const formData = transformToFormData(values)
      
  
      // Set current_step parameter in the URL
      const url = `/patient_dashboard/?current_step=reupload_documents`;
      
      // Make the API call with the FormData payload
      const { response, success } = await triggerApi({
        url: url,
        type: "POST",
        payload: formData,
        loader: true,
        // Important: Don't manually set Content-Type for FormData
        headers: {
          // Let the browser set the Content-Type with boundary
        }
      });
  
      if (success && response) {
        console.log("Form data submitted successfully:", response);

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        return { success: true, data: response };
      } else {
        console.error("API call failed or returned no data.");
        return { success: false, error: "API call failed" };
      }
    } catch (error) {
      console.error("Error in makeApiCall:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Form values before submission:', values);
      
      // Check if at least one file is selected
      const hasAnyFiles = uploadFields.some(field => 
        values[field.id] && values[field.id].length > 0
      );
      
      if (!hasAnyFiles) {
        toast.error('Please select at least one file to upload');
        return;
      }
      
      // Make API call with the values
      const result = await makeApiCall(values);
      
      if (result.success) {
        notify();
     
      } else {
        toast.error('Failed to upload documents. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to upload documents. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Function to refresh the application
  const refreshApplication = () => {
    // Method 1: Reload the current page
    window.location.reload();
  };

  function handleLater() {
    setTimeout(() => {
      refreshApplication();
    }, 200);
  }

  return (
    <Formik 
      initialValues={generateInitialValues()} 
      validate={validate} 
      onSubmit={handleSubmit}
      enableReinitialize={true} // Add this to handle dynamic fields after data loads
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit} className="relative flex flex-col pt-6" encType="multipart/form-data">
          <div className="mb-8 px-4">
            <h2 className="text-[18px] font-sans font-semibold">Upload Documents</h2>
          </div>

          <div className="text-sm text-black font-sans italic mb-4 px-4">
            The file must be in jpg/pdf/png format.
            <br />
            Maximum size of the document should be 5MB.
          </div>

          <div className="space-y-4 px-4 mb-40">
            {uploadFields.length > 0 ? (
              uploadFields.map((field) => (
                <div key={field.id}>
                  <MultiFileUpload
                    formik={formik}
                    label={field.label}
                    id={field.id}
                    isMultiple={true}
                    
                    onFileUpload={(files) => {
                      formik.setFieldValue(field.id, files);
                    }}
                    onFileRemove={(files) => {
                      formik.setFieldValue(field.id, files);
                    }}
                  />
                  
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No document upload fields available</div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 px-4 py-8">
                <button
                  type="button"
                  onClick={handleLater}
                  className="flex-1 py-3 px-4 border shadow-[inset_0_0_0_1px_#0101C8] text-primary rounded-md"
                >
                  Finish Later
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 text-white rounded-md bg-primary"
                  disabled={formik.isSubmitting || isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ShortFallDoc;