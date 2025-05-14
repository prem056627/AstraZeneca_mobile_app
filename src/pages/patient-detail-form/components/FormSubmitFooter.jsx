import React, { useEffect, useState } from 'react';
import { ReactComponent as FormSubmitLeftArrow } from '../../../assets/images/svg/FormSubmit_Left_Arrow.svg';
import { ReactComponent as RightArrow } from '../../../assets/images/svg/right-arrow.svg';
import { useDispatch, useSelector } from 'react-redux';

import {
  setPatientDetails,
  changeStep,
  selectCurrentStep,
  selectPatientDetails,
  selectCurrentPageState,
  setCurrentPageState,
  selectIsCaregiverSkipVisible,
  setIsCaregiverSkipVisible,
  resetCompletedSections,
  resetSubFormCurrentStep,
//   setCurrentPageState,
} from '../../../slice/patient-detail-form';
import useApi from '../../../hooks/useApi';



function FormSubmitFooter({ formik ,onSkip}) {
  const dispatch = useDispatch();
  
  // Get the current page state from Redux store
  const currentPageState = useSelector(selectCurrentPageState);
  const skipVisible = useSelector(selectIsCaregiverSkipVisible);

//   console.log("currentPageStatecurrentPageState!",currentPageState)
  
  const handleSubmit = () => {

    dispatch(resetSubFormCurrentStep());
  };


  const onsubmitReverse = async () => {
    switch (currentPageState) {
      case "caregiver_details":
        // dispatch(setIsCaregiverSkipVisible(false));
        dispatch(setCurrentPageState("personal_details"));
        break;
      case "upload_documents":
        dispatch(setCurrentPageState("caregiver_details"));
        break;
      case "authorization":
        dispatch(setCurrentPageState("upload_documents"));
        break;
      case "personal_details":
      default:
        // Already at the first step, maybe do nothing or show a warning
        break;
    }
  };
  


   // Local state to trigger re-render
   const [shouldRender, setShouldRender] = useState(skipVisible);

  //  useEffect(() => {
  //    setShouldRender(skipVisible); // Update state when skipVisible changes
  //  }, [skipVisible]);




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

  

 

  // useEffect()
  // skipVisible
  return (

  <div className="fixed bottom-0 left-0 z-50 w-full">

   {/* <div className=' bg-[#F4F4FF] py-2'> */}
    {/* {PoweredByFooter()} */}
   {/* </div> */}
   
    <div className=" flex justify-center w-full border-t bg-white px-6 py-6">
      <div className="max-w-screen-lg flex w-full justify-between">
        <button
          type="button"
          onClick={onsubmitReverse}
          disabled={currentPageState === 'personal_details'}
          className={`h-12 w-12 rounded-full bg-[#D3C3CC] p-4 text-red-500 ${
            currentPageState === 'personal_details' ? 'opacity-30' : 'opacity-100'
          }`}
        >
          <FormSubmitLeftArrow className='text-white' />
        </button>
        
        <button
    type="submit"
    disabled={!(formik.isValid && formik.dirty)}
    className={`flex h-12 items-center justify-center gap-2 rounded-md bg-primary p-4 text-white font-open-sans font-semibold tracking-wide 
       ${!(formik.isValid && formik.dirty) ? 'opacity-30' : 'opacity-100'}`}
      // ${!(formik.isValid && formik.dirty) ? 'opacity-30' : 'opacity-100'}
    onClick={handleSubmit}
  >
    {currentPageState === 'authorization' ? <span>Submit</span> : <span>Save & Next</span>}
    <RightArrow />
  </button>

      </div>
    </div>
  </div>
  );
}

export default FormSubmitFooter;