import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import useMediaQuery from "../hooks/useMediaQuery";
import { selectCurrentPageState } from "../slice/patient-detail-form";

const Stepper = ({ steps }) => {
  const currentPageState = useSelector(selectCurrentPageState);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Function to determine the current step index based on page state
  const getCurrentStepIndex = () => {
    if (currentPageState === "personal_details") {
      return 1; // 1st step
    } else if (currentPageState === "caregiver_details") {
      return 2; // 2nd step
    }
    else if (currentPageState === "upload_documents") {
      return 3; // 2nd step
    }
    else if (currentPageState === "authorization") {
      return 4; // 2nd step
    }
     else {
      // Handle any other states that might be added in the future
      // Default to the first step if state is unknown
      return 1;
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 justify-center items-center gap-4">
        {steps.map((step, index) => {
          const shouldDisplay = !isMobile || currentStep === index + 1;

          return (
            shouldDisplay && (
              <Step
                key={index}
                stepNumber={index + 1}
                label={step.title}
                isActive={currentStep === index + 1}
                isCompleted={currentStep > index + 1}
              />
            )
          );
        })}
      </div>
      {/* <div className="pl-6 pt-20"></div> */}
    </>
  );
};

const Step = ({ stepNumber, label, isActive, isCompleted }) => {
  return (
    <div className="flex flex-col justify-start items-start px-4 gap-2">
      {/* Step Indicator */}
      <div className={`flex justify-center items-center gap-2 self-start md:self-start font-inter ${
        isActive ? "text-primary" : "text-gray-300"
      }`}>
        <span className="text-4xl hidden md:block">{stepNumber}</span>
        <p className="text-sm font-bold self-center text-start">
          <span className="md:hidden">{`${stepNumber}.`}</span>
          {label.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < label.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>
      {/* Step Progress Bar */}
      <div className="md:flex w-full items-center gap-x-2 hidden">
        <div className={`border w-4 h-4 p-[2px] aspect-square rounded-full ${
          isActive ? "border-primary" : "border-transparent"
        }`}>
          <span className={`block w-full h-full rounded-full ${
            isCompleted
              ? "bg-primary"
              : isActive
                ? "bg-primary"
                : "bg-gray-300"
          }`} />
        </div>
        <div className={`block flex-1 w-full h-1 rounded-md ${
          isCompleted ? "bg-primary" : "bg-gray-300"
        }`} />
      </div>
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.array.isRequired,
};

Step.propTypes = {
  stepNumber: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
};

export default Stepper;