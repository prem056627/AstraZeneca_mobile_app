import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";

import useApi from "../../../hooks/useApi";
import {
  setPatientDetails,
  changeStep,
  selectCurrentStep,
  selectPatientDetails,
  setPatientEnrollmentSuccessModalOpen,
  selectCurrentPageState,
  setCurrentPageState,
  setProgramStatus,
} from "../../../slice/patient-detail-form";
import { combinedValidationSchema, concentValidationSchema } from "./validationSchemas";
import { getConcentInitialValues } from "./initialValues";
import FormSection from "../components/FormSection";
import FormSubmitFooter from "../components/FormSubmitFooter";
import useLocalStorage from "../../../hooks/useLocalstorage";
import { transformToFormDataOrder, transformToPatientDetailsFormData } from "../../../utils/forms";
import { LoaderContext } from "../../../context/LoaderContextProvider";
import AuthorizeForm from "./AuthorizeForm";

const CaregiverDetailsForm = () => {
  const FormDebugger = ({ values, errors, touched }) => {
    React.useEffect(() => {
      console.log('Current Values:', values);
      console.log('Current Errors:', errors);
      console.log('Touched Fields:', touched);
    }, [values, errors, touched]);
  
    return null;
  };

  const dispatch = useDispatch();

  const currentPageState = useSelector(selectCurrentPageState);
  const [formData, setFormData] = useLocalStorage("formData", {});
  // const [isLoading, setLoading] = useState(true);
  const { setLoading, isLoading } = useContext(LoaderContext);
  const triggerApi = useApi();
  
  const initialValues = {
    ...getConcentInitialValues(formData)
  };

  let initiaData = useSelector(selectPatientDetails);


    // Function to refresh the application
    const refreshApplication = () => {
      window.location.reload();
    };

  const makeApiCall = async (values) => {
    try {
      setLoading(true);

      const url = `/patient_dashboard/?current_step=caregiver_details`;
      
      // Prepare FormData using values
      const preparedFormData = transformToPatientDetailsFormData(values);
      
      const { response, success } = await triggerApi({
        url: url,
        type: "POST",
        payload: preparedFormData, 
        loader: true,
      });

      if (success && response) {
        dispatch(setCurrentPageState('program_enrollment'));

        // setTimeout(() => {
        //   window.location.reload();
        // }, 500);
      
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
      console.log("Form Values:", values);

      setFormData({
        ...formData,
        CaregiverDetails: values,
      });
      
      const result = await makeApiCall(values);
      
      if (result.success) {
        dispatch(setPatientEnrollmentSuccessModalOpen(true));
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };




  // In your component, add a function to skip this step
const skipCaregiverStep = async () => {
  try {
    setLoading(true);
    
    // Call your API to inform the backend that we're skipping this step
    const url = `/patient_dashboard/?current_step=caregiver_details&skip=true`;
    
    const { response, success } = await triggerApi({
      url: url,
      type: "POST",
      payload: {}, // Empty payload or minimal required data
      loader: true,
    });

    if (success && response) {
      // Update Redux store with the next step from the response
      dispatch(setCurrentPageState(response?.current_step));
      
      // You may need to navigate to the next step here
      // If your app uses react-router, you might need:
      // history.push('/next-step-route');
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500);
    
 
        dispatch(setPatientEnrollmentSuccessModalOpen(true));
      
      
      return { success: true, data: response };
    } else {
      console.error("Skip step API call failed");
      return { success: false, error: "API call failed" };
    }
  } catch (error) {
    console.error("Error in skipCaregiverStep:", error);
    return { success: false, error };
  } finally {
    setLoading(false);
  }
};

  const formSections = [
    {
      title: "Caregiver Details",
      isSubmitted: false,
      isDefaultOpen: true,
      component: <AuthorizeForm />,
      step:1,
    },
  ];

  return (
    <div className="w-full pb-24">
      <div className="mx-auto w-full rounded-2xl">
        <Formik
          initialValues={initialValues}
          validationSchema={concentValidationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
                  {/* <FormDebugger 
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
              /> */}
              {formSections.map((section) => (
                <FormSection
                  key={section.title}
                  title={section.title}
                  isSubmitted={section.isSubmitted}
                  isDefaultOpen={section.isDefaultOpen}
                  step={section.step}
                >
                  {React.cloneElement(section.component, { formik })}
                </FormSection>
              ))}
              <FormSubmitFooter formik={formik} step={currentPageState}  onSkip={skipCaregiverStep}  />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CaregiverDetailsForm;