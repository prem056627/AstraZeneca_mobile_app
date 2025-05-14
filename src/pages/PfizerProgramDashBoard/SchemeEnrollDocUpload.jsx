import React, { useContext, useState } from "react";
import { Formik } from "formik";
import MultiFileUpload from "../../components/Form/MultiFileUpload";
import Radio from "../../components/Form/Radio";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsSampleAadharOpenActive,
  selectSelectedEnrollProgram,
  setCurrentPageState,
  setIsSampleAadharOpen,
  setIsSampleAadharOpenActive,
  setProgramEnrollmentConsent,
  setProgramEnrollmentSuccess,
  setSchemaShown,
} from "../../slice/patient-detail-form";
import useApi from "../../hooks/useApi";
import { transformToFormData } from "../../utils/forms";
import { ReactComponent as Lorla } from "../../assets/images/svg/Lorbriqua_PAP_Scheme.svg";
import { ReactComponent as Palbace } from "../../assets/images/svg/palbace_scheme.svg";
import { ReactComponent as Crizalk } from "../../assets/images/svg/Crizalk_Scheme.svg";
import { LoaderContext } from "../../context/LoaderContextProvider";
import { ReactComponent as ToolTip } from '../../assets/images/svg/tooltip.svg';
import { ReactComponent as ToolTip_red } from '../../assets/images/svg/tooltip_red.svg';
const SchemeEnrollDocUpload = () => {
  const [showUploadFields, setShowUploadFields] = useState(false);
  const { setLoading, isLoading } = useContext(LoaderContext);
  const isActive= useSelector(selectIsSampleAadharOpenActive)
  const dispatch = useDispatch();
  const triggerApi = useApi();
  const selectedEnrollProgram = useSelector(selectSelectedEnrollProgram);

  const getRadioData = () => {
    const programName = selectedEnrollProgram.program_name;

    // Default radio data (empty)
    const defaultRadioData = [];

    // Program-specific radio data
    if (programName === "Lorbriqua Care") {
      return [
        {
          id: "1+1",
          value: "1+1",
          label: " ",
          description: "",
        },
      ];
    } else if (programName === "Palbace Program") {
      return [
        {
          id: "9_lft",
          value: "9+LTF",
          label:
            "  1 + 3    Patient has to purchase 1 unit of Palbace, post which 3 assistance units will be provided",
          description: "",
        },
      ];
    } else if (programName === "Crizalk Program") {
      return [
        {
          id: "1_1",
          value: "1+1",
          label:
            "  1 Paid + 1 Free up to 18 cycles, and then LifeTime Free: Patient buys 1 unit/box of Crizalk and gets 1 unit/box of Crizalk for a month as assistance. This pattern continues up to 18 cycles. After 18 cycles, patient is eligible to get lifetime free assistance",
          description: "",
        },
      ];
    }

    return defaultRadioData; // Return empty array for other programs
  };

  const radioData = getRadioData();
  const uploadFields = [
    { id: "prescription", label: "Prescription" },
    { id: "id_proof", label: "ID Proof" },
    { id: "address_proof", label: "Address Proof" },
  ];

  // Combine standard and extra fields
  const combinedUploadFields = [...uploadFields];

  const initialValues = {
    program_id: selectedEnrollProgram.program_id,
    program_name: selectedEnrollProgram.program_name,
    scheme: "",
    id_proof: [],
    address_proof: [],
    prescription: [],
  };

  const validate = (values) => {
    const errors = {};

    if (!values.scheme) {
      errors.scheme = "Please select a scheme";
    }

    if (showUploadFields) {
      combinedUploadFields.forEach((field) => {
        const uploadedFiles = values[field.id];

        if (!uploadedFiles || uploadedFiles.length === 0) {
          errors[field.id] = "Please upload the required document";
        } else {
          // Validate file count
          const maxFiles = 5;
          if (uploadedFiles.length > maxFiles) {
            errors[field.id] = `You can upload a maximum of ${maxFiles} files.`;
          } else {
            // Validate file types and sizes (up to 5MB)
            const validTypes = ["image/jpeg", "image/png", "application/pdf"];
            const maxSizeMB = 5;

            const invalidFiles = uploadedFiles.filter((file) => {
              const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB
              return !validTypes.includes(file.type) || fileSizeMB > maxSizeMB;
            });

            if (invalidFiles.length > 0) {
              errors[field.id] =
                `Invalid file format or size. Use JPG, PNG, or PDF under ${maxSizeMB}MB.`;
            }
          }
        }
      });
    }

    return errors;
  };

  function PoweredByFooter() {
    const phoneNumber = "18002587008"; // Define the phone number

    return (
      <div className="flex flex-row justify-between items-center mt-2 px-5">
        <div className="flex flex-row items-center">
          <p className="text-xs text-gray-500 italic">
            Powered by <span className="font-bold text-black">TATA 1mg</span>
          </p>
        </div>

        <div className="flex items-center">
          <span className="text-xs text-gray-500">Contact: </span>
          <a
            href={`tel:${phoneNumber}`}
            className="text-primary font-bold text-xs no-underline"
          >
            {phoneNumber}
          </a>
        </div>
      </div>
    );
  }

  // Updated API call function to properly handle file uploads with FormData
  const makeApiCall = async (values) => {
    let tempValues = values;
    tempValues["program_id"] = selectedEnrollProgram?.program_id;
    tempValues["program_name"] = selectedEnrollProgram.program_name;
    tempValues["scheme"] = values?.scheme;

    try {
      setLoading(true);

      // Set current_step parameter in the URL
      const url = `/patient_dashboard/?current_step=program_enrolment`;

      // Create a FormData object

      let dynamicFormData = transformToFormData(tempValues);

      const { response, success } = await triggerApi({
        url: url,
        type: "POST",
        payload: dynamicFormData,
        loader: true,
        headers: {}, // Let the browser set Content-Type with boundary
      });

      if (success && response) {
        dispatch(setCurrentPageState(response?.current_step));

        // Close modal and change page state after 5 seconds
        // setTimeout(() => {
        //   // dispatch(setProgramEnrollmentSuccess(false));
        //   window.location.reload();
        // }, 5000);

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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // dispatch(setSchemaShown(false));
    // dispatch(setProgramEnrollmentConsent(false));

    if (!showUploadFields) {
      setShowUploadFields(true);
      setSubmitting(false);
      return;
    }

    try {
      // Submit form data to API
      const result = await makeApiCall(values);

      if (result.success) {
        // Show success modal
        dispatch(setProgramEnrollmentSuccess(true));
        // console.log('Form submitted successfully:', result.data.current_step);
      } else {
        // Handle API errors
        console.error("Form submission failed:", result.error);
        setErrors({ submit: "Form submission failed. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  function handleLater() {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }


  function HandleToolTipModal(event){
    event.preventDefault();
    event.stopPropagation();
    dispatch(setIsSampleAadharOpenActive(true));
    dispatch(setIsSampleAadharOpen(true));
    console.log("hello Modal!!");
  }

  
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {/* flex-1 overflow-y-auto container mx-auto md:px-14 py-24 bg-[##F9FAFB]  */}
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className="relative flex flex-col pt-6  container mx-auto  mb-50  "
        >
          {/* Pfizer Logo */}
          <div className=" ">
            {!showUploadFields && (
              <div className="w-full  mb-10 h-1/2 ">
             <div>
             <div className=" mt-8 px-[20px]">
                  <Radio
                    label="Select a scheme"
                    name="scheme"
                    radioData={radioData}
                    formik={formik}
                    value={formik.values.scheme}
                    checkboxType="circle"
                  />
                  {/* {formik.touched.scheme && formik.errors.scheme && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.scheme}</div>
              )} */}
                </div>

                {/* Render the correct image based on the selected program */}
                {selectedEnrollProgram.program_name === "Lorbriqua Care" && (
                  <div className="rounded-lg">
                    <Lorla className="max-w-full w-auto p-5 rounded-lg  h-[300px]" />
                    <p className="text-[14px] px-[20px] text-gray-700 font-open-sans">
                      your enrolment and allotment to a scheme shall be subject
                      to verification of all the documents and information
                      shared by you.
                    </p>
                  </div>
                )}
                {selectedEnrollProgram.program_name === "Palbace Program" && (
                  <Palbace className="max-w-full w-auto p-5 rounded-lg h-[300px]" />
                )}
                {selectedEnrollProgram.program_name === "Crizalk Program" && (
                 <> <Crizalk className="max-w-full w-auto p-5 rounded-lg h-[300px]" />


                 <p className="text-[14px] px-[20px] text-gray-700 font-open-sans">Your enrolment and allotment to a scheme shall be subject to verification of all the documents and information shared by you.</p></>
                )}
             </div>

          

               
              </div>
            )}

            {/* Document Upload Section */}
            {showUploadFields && (
              <div className="mb-8 overflow-y-auto  h-[600px] pb-0">
                <div className="flex flex-col justify-between items-start mt-12 mb-6 px-4">
                  <h2 className="text-[18px] font-sans  font-semibold">
                    Upload Documents
                  </h2>
                  {/* <a href="#" className="text-primary text-[14px]">
                  Know more <span className="text-[#767676] font-sans font-semibold">about the program</span>
                </a> */}
                </div>

              

                <div className="space-y-4 px-4 mb-10">
                  {combinedUploadFields.map((field) => (
                    <MultiFileUpload
                      key={field.id}
                      formik={formik}
                      label={field.label}
                      id={field.id}
                      isMultiple={true}
                      // description="Upload jpg/pdf/png format file"
                      onFileUpload={(files) =>
                        console.log(`${field.id} files:`, files)
                      }
                      onFileRemove={(files) =>
                        console.log(`${field.id} files after remove:`, files)
                      }
                    />
                  ))}
                </div>

                <div className="text-sm text-[#CC3300] italic font-sans mb-4 px-4 space-y-2">
  <p>The file must be in jpg/pdf/png format.</p>

  <p>In case you need to upload more than one image, you can convert it into a PDF and upload it as one single PDF which has multiple images.</p>

  <p>Maximum size of the document should be 5MB.</p>

  <ul className="list-disc list-inside space-y-1">
    <p>Mentioned below is the list of acceptable ID and Address proof</p>
    <li>Passport</li>
    <li>Voter ID</li>
    <li>Driving License</li>
    <li>PAN card</li>
    <li>Home Lease Agreement</li>
    <li>Bank statement / Agreement</li>
    <li className="flex  justify-start items-center gap-2 pl-4">Redacted Aadhar Card <button className="text-[#CC3300]" onClick={HandleToolTipModal}>
      
      {
        isActive ?  <ToolTip/>  : <ToolTip_red/>
      }
    
     
      
      </button></li>
  </ul>

  <p className="pl-4">
    (To mask Aadhar card number, QR code, VID number, and photo use a black pen)
  </p>
</div>

              </div>
            )}
          </div>
         
          


          {/* Fixed Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">

          {/* { (<div className={`'
                } `}>{PoweredByFooter()}</div>)} */}

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
                  className={`flex-1 py-3 px-4 text-white rounded-md ${
                    (!showUploadFields && formik.values.scheme) ||
                    showUploadFields
                      ? "bg-primary"
                      : "bg-blue-200"
                  }`}
                  disabled={
                    (!showUploadFields && !formik.values.scheme) ||
                    formik.isSubmitting ||
                    isLoading
                  }
                >
                  {isLoading
                    ? "Loading..."
                    : showUploadFields
                      ? "Submit"
                      : "Next"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SchemeEnrollDocUpload;
