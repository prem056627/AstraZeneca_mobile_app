import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import PersonlDetailsForm from "./PersonlDetailsForm";
import FormSubmitFooter from "../components/FormSubmitFooter";
import FormSection from "../components/FormSection";
import {
  setCurrentPageState,
  selectCurrentPageState,
  selectSubFormCurrentStep,
  setSubFormCurrentStep,
  selectInitializeData,
} from "../../../slice/patient-detail-form";
import { combinedValidationSchema, profileValidationSchema } from "./validationSchemas";
import useLocalStorage from "../../../hooks/useLocalstorage";
import AddressProofForm from "./AddressProofForm";
import IDDetails from "./Reimbursement_Information";
import { getProfileInitialValues, fieldGroups } from "./initialValues";
import useApi from "../../../hooks/useApi";
import { transformToPatientDetailsFormData } from "../../../utils/forms";
import moment from 'moment';
import { LoaderContext } from "../../../context/LoaderContextProvider";
import ReimbursementDetails from "./Reimbursement_Information";

const FormDebugger = ({ values, errors, touched }) => {
  React.useEffect(() => {
    console.log('Current Values:', values);
    console.log('Current Errors:', errors);
    console.log('Touched Fields:', touched);
  }, [values, errors, touched]);

  return null;
};

const PersonalDetails = () => {
  const dispatch = useDispatch();
  const currentPageState = useSelector(selectCurrentPageState);
  const currentSubformStep = useSelector(selectSubFormCurrentStep);
  const initialDataa = useSelector(selectInitializeData);
  const [formData, setFormData] = useLocalStorage("formData", {});
  const { setLoading, isLoading } = useContext(LoaderContext);

  const triggerApi = useApi();
  
  // Get initial values from stored data
  const initialValues = getProfileInitialValues(formData.profile_details);

  // Set the first step as active when component mounts
  useEffect(() => {
    dispatch(setSubFormCurrentStep(1));
  }, [dispatch]);

  const makeApiCall = async (values) => {
    let tempValues = values;
    tempValues['date_of_birth'] = values?.date_of_birth
    ? moment(values.date_of_birth).format('DD/MM/YYYY')  // Convert to string
    : '';
    
    const payload_val = transformToPatientDetailsFormData(tempValues);
    
    try {
      setLoading(true);

      // Set current_step parameter in the URL
      const currentStep = currentPageState; // This should be dynamically assigned
      const url = `/patient_dashboard/?current_step=${currentStep}`;

      const { response, success } = await triggerApi({
        url: url,
        type: "POST",
        payload: payload_val || {},
        loader: true,
      });

      if (success && response) {
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
    // Save to local storage
    setFormData({
      ...formData,
      profile_details: values,
    });
    
    // You can submit data to API here if needed
    const result = await makeApiCall(values);
    
    // Navigate to next page
    dispatch(setCurrentPageState('caregiver_details'));
  };

  const formSections = [
    {
      title: "Personal Details",
      isSubmitted: false,
      component: <PersonlDetailsForm />,
      fields: fieldGroups.personalDetails,
      step: 1,
    },
    {
      title: "Address proof",
      isSubmitted: false,
      component: <AddressProofForm />,
      fields: fieldGroups.addressProof,
      step: 2,
    },
    // {
    //   title: "Current Residential Address",
    //   isSubmitted: false,
    //   component: <CurrentResidentialAddress />,
    //   fields: fieldGroups.currentResidentialAddress,
    //   step: 3,
    // },
    {
      title: "Reimbursement Information",
      isSubmitted: false,
      component: <ReimbursementDetails/>,
      fields: fieldGroups.idDetails,
      step: 3,
    },
  ];

  return (
    <div className="w-full pb-24">
      <div className="mx-auto w-full rounded-2xl">
        <Formik
          initialValues={initialValues}
          validationSchema={profileValidationSchema}
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
                disabled={!formik.isValid || formik.isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalDetails;