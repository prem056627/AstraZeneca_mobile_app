

import React from 'react';
// import RequestOrderModalForm from './RequestOrderForm';
import Modal from '../../../components/Modal/Modal';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectIsProfilePageOpen, closeRequestOrderModal, isRequestOrderClose, isProfilePageOpen } from '../../slice';
// import RequestOrderModalForm from './RequestOrderModalForm';
// import RequestCallBackForm from '../RequestCallback/RequestCallBackForm';
// import ProfileModalForm from './ProfileModalForm';
import PatientConsent from './PatientConsent';
import { useDispatch, useSelector } from 'react-redux';
import { selectProgramEnrollmentConsent, setCurrentView, setProgramEnrollmentConsent } from '../../../slice/patient-detail-form';

function PatientConsentModal() {
    // const profilePageOpen = useSelector(selectIsProfilePageOpen); 
    const dispatch = useDispatch(); 

    function closeModal() {
    //    dispatch(setProgramEnrollmentConsent(false));
        dispatch(setProgramEnrollmentConsent({  consent: false }));
    //    dispatch(setCurrentView("home"));
        console.log("Modal closed");
    }
const enrollmentConsent =  useSelector(selectProgramEnrollmentConsent);
// console.log('enrollmentConsent:',enrollmentConsent.consent
// );

    return (
        <Modal
            // label={'Profile'}
            labelType="center"
            show={enrollmentConsent?.consent}
            closeModal={closeModal}
            ModalBody={<PatientConsent />}
            // ModalBody={< RequestCallBackForm />}
            // isScroll = false"
            type="center"
            isCloseVisible={true}
            moreZindex={true}
        />
    );
}

export default PatientConsentModal;
