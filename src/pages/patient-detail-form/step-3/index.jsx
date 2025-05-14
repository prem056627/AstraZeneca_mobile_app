

import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";

import FormSubmitFooter from "../components/FormSubmitFooter";
import FormSection from "../components/FormSection";
import {
  changeStep,
  selectCurrentPageState,
  selectCurrentStep,
  selectInitializeData,
  setCurrentPageState,
} from "../../../slice/patient-detail-form";
import {  uploadDocsValidationSchema } from "./validationSchemas";
import useLocalStorage from "../../../hooks/useLocalstorage";

import { getProfileInitialValues,fieldGroups, getUploadDocsInitialValues } from "./initialValues";
import useApi from "../../../hooks/useApi";
import { transformToPatientDetailsFormData } from "../../../utils/forms";
import moment from 'moment';
import { LoaderContext } from "../../../context/LoaderContextProvider";

import UploadDocsForm from "./UploadDocsForm";

const FormDebugger = ({ values, errors, touched }) => {
  React.useEffect(() => {
    console.log('Current Values:', values);
    console.log('Current Errors:', errors);
    console.log('Touched Fields:', touched);
  }, [values, errors, touched]);

  return null;
};

const UploadDocs = () => {
  const dispatch = useDispatch();
  // const currentStep = useSelector(selectCurrentStep);

  const currentPageState = useSelector(selectCurrentPageState);


  const initialDataa = useSelector(selectInitializeData);
// // Avoid accessing undefined properties
// const step1Data = initialDataa?.enrollment_details?.step_data?.personal_details || {};


const [formData, setFormData] = useLocalStorage("formData", {});
const { setLoading, isLoading } = useContext(LoaderContext);

  const triggerApi = useApi();
  
  // Get initial values from stored data
  const initialValues = getUploadDocsInitialValues(formData.upload_files);



// And here's the fixed client-side function:
const makeApiCall = async (values) => {
  let tempValues = values;
  const payload_val =  transformToPatientDetailsFormData(tempValues)
  try {
    setLoading(true);

    // Set current_step parameter in the URL
    const currentStep = currentPageState; // This should be dynamically assigned
   const url = `/patient_dashboard/?current_step=${currentStep}`;

    const { response, success } = await triggerApi({
      url: url,
      type: "POST",
      payload: payload_val || {},
      // headers: {
      //   // "Content-Type": "application/json",
      //   "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      // },
      loader: true,
    });

    if (success && response) {
      // console.log("Form data submitted successfully:", response.current_step);
     
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

    // setFormData({
    //   ...formData,
    //   upload_files: values,
    // });
   
    


  await makeApiCall(values)
console.log("Form Values!!!!:", values);
  dispatch(setCurrentPageState('authorization'))
};


  const formSections = [
    {
            title: "Patient Documents",
            isSubmitted: false,
            isDefaultOpen: true,
            component: <UploadDocsForm />,
            fields: fieldGroups.caregiverDetails,
            step:1,
          },
 
  ];

  // const initialDataaaaa = useSelector(selectInitializeData);

  // console.log( "initialaaaaaa!!!!!",initialDataaaaa);

  return (
    <div className="w-full pb-24">
      <div className="mx-auto w-full rounded-2xl">
        <Formik
          initialValues={initialValues}
          validationSchema={uploadDocsValidationSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={onSubmit}
          enableReinitialize={false}
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
                  {React.cloneElement(section.component, {
                    formik,
                    fields: section.fields,
                    values: formik.values,
                    errors: formik.errors,
                    touched: formik.touched
                  })}
                </FormSection>
              ))}
              <FormSubmitFooter
                formik={formik}
               
                // disabled={!formik.isValid || formik.isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UploadDocs;