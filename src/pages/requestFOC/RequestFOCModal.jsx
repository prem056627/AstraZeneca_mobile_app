

import React from 'react';
import Modal from '../../components/Modal/Modal';
// import UploadInvoiceForm from './UploadInvoiceForm';
import InvoiceModal from '../../components/Modal/InvoiceModal';
import { selectRequestFocModalOpen, setRequestFocModalOpen,  } from '../../slice/patient-detail-form';
import { useDispatch, useSelector } from 'react-redux';
import RequestFOCForm from './RequestFOCForm';
// import RequestOrderModalForm from './RequestOrderForm';
// import Modal from '../../../components/Modal/Modal';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectIsProfilePageOpen, closeRequestOrderModal, isRequestOrderClose, isProfilePageOpen } from '../../slice';
// import RequestOrderModalForm from './RequestOrderModalForm';
// import RequestCallBackForm from '../RequestCallback/RequestCallBackForm';
// import ProfileModalForm from './ProfileModalForm';
// import PatientConsent from './PatientConsent';

function RequestFOCModal() {
    const RequestFocOpen = useSelector(selectRequestFocModalOpen); 
    const dispatch = useDispatch(); 

    function closeModal() {
        dispatch(setRequestFocModalOpen(false)); // Dispatch the close action

    }

    return (
        <InvoiceModal
            label={'Prescription '}
            labelType="center"
            show={RequestFocOpen}
            closeModal={closeModal}
            ModalBody={<RequestFOCForm />}
            // ModalBody={< RequestCallBackForm />}
            // isScroll = false"
            type="center"
            isCloseVisible={false}
            isBackVisible={true}
           
        />
    );
}

export default RequestFOCModal;
