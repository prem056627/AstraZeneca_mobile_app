
// export default AppNavigation;

import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "../pages/Home";
import PatientDetailForm from "../pages/patient-detail-form";
import UploadInvoiceModal from "../pages/uploadInvoice/UploadInvoiceModal";
import PhysicalVerificationModal from "../pages/physicalVerification/PhysicalVerificationModal";
import MenuScreen from "../pages/Menu/MenuScreen";
import Notifications from "../pages/Notification/OrderHistory";
import useApi from "../hooks/useApi";
import { selectCurrentPageState, selectCurrentView, selectInitializeData, selectDocUploadStatus, setInitializeData, setCurrentPageState, setProgramStatus, selectIsInitalDataLoad, setIsInitalDataLoad, setIsProgramEnrollDocDuplicateFound, setProgramEnrollmentSuccess } from "../slice/patient-detail-form";
import ProgramEnrollSuccessModal from "../pages/PfizerProgramDashBoard/ProgramEnrolllmentSuccessModal/ProgramEnrollSuccessModal";
import ShortFallDoc from "../pages/PfizerProgramDashBoard/ShortFallDoc";
import RequestFOCModal from "../pages/requestFOC/RequestFOCModal";
import PatientEnrollmentSuccessModal from "../pages/patient-detail-form/patientErollmentSuccess/PatientEnrollmentSuccessModal";
import FabButtonModal from "../pages/FabButton/FabButtonModal";
import ProfileModal from "../pages/Menu/Profile/ProfileModal";
import MoreProgramModal from "../pages/Menu/MorePrograms/MoreProgramModal";
import { ToastContainer } from 'react-toastify';
import EkyModal from "../pages/Ekyc/EkyModal";
import KycHistoryModal from "../pages/Menu/KycHistory/KycHistoryModal";
import CompleteKycModal from "../pages/Menu/completedKyc/CompleteKycModal";
import AddCaregiverModal from "../pages/Menu/Profile/addCaregiver/AddCaregiverModal";
import CaregiverConcentModal from "../pages/patient-detail-form/caregiverConcent/CaregiverConcentModal";
import CareTakerPrivacyModal from "../pages/patient-detail-form/caregiverConcent/CareTakerPrivacy/CareTakerPrivacyModal";
import { LoaderContext } from "../context/LoaderContextProvider";
import PatientConsentModal from "../pages/PfizerProgramDashBoard/ProgramConsent/PatientConsentModal";
import DemoAdharModal from "../pages/PfizerProgramDashBoard/MaskedAdharModal";
import ProgramEnrollDocDuplicateFoundModal from "../pages/PfizerProgramDashBoard/ProgramEnrollDocDuplicateFound/ProgramEnrollDocDuplicateFoundModal";
import AzProgramDashboard from "../pages/AzProgramDashboard/AzProgramDashboard";
import OrderHistory from "../pages/Notification/OrderHistory";

const AppNavigation = () => {

  const currentView = useSelector(selectCurrentView);
  

  const isInitalDataLoad = useSelector(selectIsInitalDataLoad)
  const { setLoading,isLoading } = useContext(LoaderContext);
  
  // Get data from Redux
  const dispatch = useDispatch();
  const initialData = useSelector(selectInitializeData);
  const current_page_state = useSelector(selectCurrentPageState);
  const doc_upload_status = useSelector(selectDocUploadStatus);
  const triggerApi = useApi();

  const current_role = localStorage.getItem('role');

  const makeApiCall = async () => {

    try {
      setLoading(true);
      const url = `/patient_dashboard/?current_step=initialize`;
      const { response, success } = await triggerApi({
        url: url,
        type: "GET",
        loader: true,
      });
  
      if (success && response) {
        dispatch(setInitializeData(response));
        dispatch(setCurrentPageState(response.current_step)); 
      } else {
        console.error("API call failed or returned no data.");
      }
    } catch (error) {
      console.error("Error in makeApiCall:", error);
    } finally {
      // setLoading(false);
    }
  };


   

  useEffect(() => {
    if (isInitalDataLoad) {
      // console.log('isInitalDataLoad',isInitalDataLoad)
      makeApiCall();
    } else if (currentView === 'home') {
      makeApiCall();
    }
  }, [isInitalDataLoad, currentView]);
  


  // Render content based on current view and app state
  const renderContent = () => {
    if (currentView === "menu") {
      return <MenuScreen  />;
    } else if (currentView === "order_history") {
      return <OrderHistory  />;
    }

   

    if (current_page_state === 'personal_details') {
      return <PatientDetailForm    />;
    }
    else if (current_page_state === 'caregiver_details') {
      return <PatientDetailForm    />;
    }
    else if (current_page_state === 'upload_documents') {
      return <PatientDetailForm    />;
    }
    else if (current_page_state === 'authorization') {
      return <PatientDetailForm    />;
    }
    else if (current_page_state === 'program_enrolment') {
      return <AzProgramDashboard    />;
    }

  };


  // Determine if footer should be hidden
  const hideFooter =  current_page_state === 'program_enrolmnt'  || 
                     current_page_state === 'personal_details' ||  current_page_state === '' ;
              
                     const hideLogo =  current_page_state === '' ;
  // Return the Home layout with the content
  return (
    <Home 
      hideFooter={hideFooter} 
      hideLogo = {hideLogo}
    >
        <ToastContainer />
      {renderContent()}
      {/* <ProgramEnrollSuccessModal/>
      <PatientEnrollmentSuccessModal/>
     

      <PhysicalVerificationModal/> 
     
      <ProfileModal/>
      <MoreProgramModal/>
      <EkyModal/>
      <KycHistoryModal/>
      <CompleteKycModal/>
      <AddCaregiverModal/>
      <CaregiverConcentModal/>
      <CareTakerPrivacyModal/>
      <PatientConsentModal />
      <DemoAdharModal/>
      <ProgramEnrollDocDuplicateFoundModal/> */}
       {/* <FabButtonModal/> */}
       <UploadInvoiceModal/>
       <RequestFOCModal/>
    </Home>
  );
};

export default AppNavigation;