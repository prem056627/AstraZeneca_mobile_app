import React, { useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { ReactComponent as DropDownIcon } from '../../../assets/images/svg/Form-dropDown-icon.svg';
import { ReactComponent as DropDownTickIcon } from '../../../assets/images/svg/Form-dropDownTick-icon.svg';
import { useSelector } from 'react-redux';
import { 
  selectAuthorizeConcentCompleted,
  selectCaregiverDetailsCompleted,
  selectCompletedSections, 
  selectCurrentPageState, 
  selectProfileDetailsCompleted, 
  selectSubFormCurrentStep,
  selectUploadDocCompleted,
  // selectStepsForSection // Make sure this selector is imported
} from '../../../slice/patient-detail-form';
import { ReactComponent as Tick } from '../../../assets/images/svg/tick.svg';

const FormSection = ({
  title,
  isSubmitted,
  step,
  children
}) => {
  const currentSubformStep = useSelector(selectSubFormCurrentStep);
  // const completedSections = useSelector(selectCompletedSections);
  const profileSteps = useSelector(selectProfileDetailsCompleted);
  const caregiverSteps = useSelector(selectCaregiverDetailsCompleted);
  const currentPageState = useSelector(selectCurrentPageState);
  const uploadDocsteps = useSelector(selectUploadDocCompleted);
  const authorizeConcentsteps = useSelector(selectAuthorizeConcentCompleted);



  // Check if this section is completed based on the current page state
  // const isSectionCompleted = completedSections?.includes(step);
  
  const isProfileStepsCompleted = profileSteps?.includes(step);
  const isCaregiverStepsCompleted = caregiverSteps?.includes(step);
  const isUploadDocStepsCompleted = uploadDocsteps?.includes(step);
  const isAuthorizeConcentStepsCompleted = authorizeConcentsteps?.includes(step);

  // Determine whether to show the completion tick based on the current page state
  const shouldShowCompletionTick = () => {
    switch(currentPageState) {
      case "personal_details":
        return isProfileStepsCompleted;
      case "caregiver_details":
        return isCaregiverStepsCompleted;
      case "upload_documents":
        return isUploadDocStepsCompleted;
      case "authorization":
        return isAuthorizeConcentStepsCompleted;
      default:
        return; // Default fallback to the general completion status
    }
  };
  console.log("currentSubformStep", currentSubformStep);
  console.log("step", step);
  // Create a ref to the disclosure button
  const disclosureButtonRef = React.useRef(null);
  
  // Control the open state based on the current step
  useEffect(() => {
    if (disclosureButtonRef.current) {
      // If this is the current step, open this section
      if (currentSubformStep === step) {

       
        // Check if it's already open to avoid unnecessary clicks
        const isOpen = disclosureButtonRef.current.getAttribute('data-open') === 'true';
        if (!isOpen) {
          disclosureButtonRef.current.click();
        }
      } 
      // If not the current step, close this section
      else {
        // Check if it's already closed to avoid unnecessary clicks
        const isOpen = disclosureButtonRef.current.getAttribute('data-open') === 'true';
        if (isOpen) {
          disclosureButtonRef.current.click();
        }
      }
    }
  }, [currentSubformStep, step]);


  return (
    <Disclosure 
      as="div" 
      className="opacity-100 mt-1"
      defaultOpen={currentSubformStep === step} // Set initial state based on currentSubformStep
    >
      {({ open }) => (
        <>
          <Disclosure.Button 
            ref={disclosureButtonRef}
            data-open={open}
            className="flex w-full items-center justify-between bg-white px-6 py-4 text-left text-sm font-medium text-black shadow-md hover:bg-white focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="text-base font-bold text-[#283A46] inline-flex items-center">
                {title}
                <span className="px-6 opacity-100">
                  {shouldShowCompletionTick() && <Tick className="h-5 w-5" />}
                </span>
              </span>
              {isSubmitted && <DropDownTickIcon className="h-6 w-6" />}
            </div>
            <DropDownIcon className={`${open ? 'rotate-180 transform' : ''} h-8 w-8`} />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-8 pt-4 text-sm text-gray-500">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default FormSection;