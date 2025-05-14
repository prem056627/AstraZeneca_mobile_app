import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentPageState, selectSubFormCurrentStep } from "../../slice/patient-detail-form";
import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";
import Step4 from "./step-4";
import Stepper from "../../components/Stepper";
import MobProgressSteps from "../../components/MobProgressSteps";
import { use } from "react";

const PatientDetailForm = () => {
  // Get the current page state from Redux store instead of step
  const currentPageState = useSelector(selectCurrentPageState);

  const steps = [
    {
      title: "Profile Details",
    },
    {
      title: "Caregiver Details",
    },
    {
      title: "Upload Documents ",
    },
    {
      title: "Authorization",
    },
  ];

  const subFormstep = useSelector(selectSubFormCurrentStep);

  useEffect(() => {
    // This effect runs when the component mounts or when currentPageState changes
    // You can add any side effects here if needed
  }, [subFormstep]);


  // Get component based on current page state instead of step number
  const getPageComponent = () => {
    switch (currentPageState) {
      case "personal_details":
        return <Step1 />;
      case "caregiver_details":
        return <Step2 />;
      case "upload_documents":
        return <Step3 />;
      case "authorization":
        return <Step4 />;
      default:
        return <Step1 />; // Default to Step1 if state is undefined
    }
  };

  // Get current step number for progress indicators based on page state
  const getCurrentStepNumber = () => {
    switch (currentPageState) {
      case "personal_details":
        return 1;
      case "caregiver_details":
        return 2;
      case "upload_documents":
        return 3;
      case "authorization":
        return 4;
      default:
        return 1;
    }
  };


  // Current step number for the progress indicators
  const currentStepNumber = getCurrentStepNumber();

  return (
    <div className="w-full  max-h-screen">
      <h3 className="text-start text-[16px] font-sans font-semibold text-black mt-2 py-6 border-b-[1px] border-[#DBDBDB] mx-4">
        Profile Enrollment 
      </h3>

      <div className="md:container mx-auto md:px-6 py-8 relative">
        <Stepper steps={steps} />

        {/* Mobile Progress Steps - now passing the current step number */}
        <div className="w-full h-6 px-4 gap-2 md:hidden py-4">
          <MobProgressSteps currentStep={currentStepNumber} />
        </div>
      </div>
      <div className="mx-auto w-full">{getPageComponent()}</div>
    </div>
  );
};

export default PatientDetailForm;