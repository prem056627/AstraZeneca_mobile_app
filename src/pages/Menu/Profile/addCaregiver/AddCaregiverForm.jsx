import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";

import {
  setPatientDetails,
  selectCurrentPageState,
  setCurrentPageState,
  setPatientEnrollmentSuccessModalOpen,
  setIsAddCaregiverFormOpen,
  setIsProfilePageOpen,
} from "../../../../slice/patient-detail-form";
import useApi from "../../../../hooks/useApi";
// import { combinedValidationSchema } from "../../../patient-detail-form/step-1/validationSchemas";

// import CaregiverDetails from "../../x../patient-detail-form/step-2/CaregiverDetails";
import { transformToPatientDetailsFormData } from "../../../../utils/forms";
import useLocalStorage from "../../../../hooks/useLocalstorage";
import { getAddCaregiverDetailsInitialValues } from "./intialValues";
import { combinedAddValidationSchema } from "./validationSchemas";
import AddCaregiverDetails from "./AddCaregiverDetails";
import FormSubmitFooter from "../../../patient-detail-form/components/FormSubmitFooter";
import { LoaderContext } from "../../../../context/LoaderContextProvider";

const AddCaregiverForm = () => {
  const dispatch = useDispatch();
  const currentPageState = useSelector(selectCurrentPageState);
  const [formData, setFormData] = useLocalStorage("formData", {});
  // const [isLoading, setLoading] = useState(true);
  const { setLoading, isLoading } = useContext(LoaderContext);
  const triggerApi = useApi();
  
  const initialValues = {
    ...getAddCaregiverDetailsInitialValues(formData)
  };

//   // Function to refresh the application
//   const refreshApplication = () => {
//     window.location.reload();
//   };

  const makeApiCall = async (values) => {
    try {
      setLoading(true);

      const url = `/patient_dashboard/?current_step=update_caregiver`;
      
      // Prepare FormData using values
      const preparedFormData = transformToPatientDetailsFormData(values);
      
      const { response, success } = await triggerApi({
        url: url,
        type: "POST",
        payload: preparedFormData, 
        loader: true,
      });

      if (success && response) {
        dispatch(setCurrentPageState(response?.current_step));
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

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // Log values to debug
      // console.log("Form Values:", values);

      // setFormData({
      //   ...formData,
      //   // CaregiverDetails: values,
      // });
      
      const result = await makeApiCall(values);
      
      if (result.success) {
         dispatch(setIsAddCaregiverFormOpen(false));
         dispatch(setIsProfilePageOpen(false));
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

 

  return (
    <div className="w-full pb-20">
      <div className="mx-auto w-full rounded-2xl ">
        <Formik
          initialValues={initialValues}
          validationSchema={combinedAddValidationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form className="complete-hidden-scroll-style flex grow flex-col gap-4 overflow-y-auto ">
              {/* Directly using CaregiverDetails component instead of wrapping it in FormSection */}
              <AddCaregiverDetails formik={formik} />
              
              {/* Uncomment this if you need the footer */}
              {/* <FormSubmitFooter formik={formik} step={currentPageState}  /> */}


            <div className=" sticky bottom-0 flex flex-col gap-[8px]  pt-[24px] font-lato text-[#696969] md:items-endpx-4 ">
            <button
                type="submit"
                disabled={!(formik.isValid && formik.dirty)}
                className={`flex h-12 items-center justify-center gap-2 rounded-md bg-primary p-4 text-white font-open-sans font-semibold tracking-wide 
                ${!(formik.isValid && formik.dirty) ? 'opacity-30' : 'opacity-100'} disabled:opacity-50`}
                // onClick={handleSubmit}
            >
                <span>Submit</span>
                {/* <RightArrow /> */}
            </button>
            </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCaregiverForm;