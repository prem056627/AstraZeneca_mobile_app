

import React from 'react';
import Modal from '../../components/Modal/Modal';
import UploadInvoiceForm from './UploadInvoiceForm';
import InvoiceModal from '../../components/Modal/InvoiceModal';
import { selectUploadInvoiceModalOpen, setUploadInvoiceModalOpen } from '../../slice/patient-detail-form';
import { useDispatch, useSelector } from 'react-redux';
// import RequestOrderModalForm from './RequestOrderForm';
// import Modal from '../../../components/Modal/Modal';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectIsProfilePageOpen, closeRequestOrderModal, isRequestOrderClose, isProfilePageOpen } from '../../slice';
// import RequestOrderModalForm from './RequestOrderModalForm';
// import RequestCallBackForm from '../RequestCallback/RequestCallBackForm';
// import ProfileModalForm from './ProfileModalForm';
// import PatientConsent from './PatientConsent';

function UploadInvoiceModal() {
    const profilePageOpen = useSelector(selectUploadInvoiceModalOpen); 
    const dispatch = useDispatch(); 

    function closeModal() {
        dispatch(setUploadInvoiceModalOpen(false)); // Dispatch the close action
       
    }

    return (
        <InvoiceModal
            label={'Upload Invoice'}
            labelType="center"
            show={profilePageOpen}
            closeModal={closeModal}
            ModalBody={<UploadInvoiceForm />}
            // ModalBody={< RequestCallBackForm />}
            // isScroll = false"
            type="center"
            isCloseVisible={false}
            isBackVisible={true}
        />
    );
}

export default UploadInvoiceModal;
