import React from "react";
// import Modal from "../../../components/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../../../components/Modal/Modal";
import AddCaregiverForm from "./AddCaregiverForm";
import { selectIsAddCaregiverFormOpen, setIsAddCaregiverFormOpen } from "../../../../slice/patient-detail-form";

function AddCaregiverModal() {
  const dispatch = useDispatch();

  function closeModal() {
    dispatch(setIsAddCaregiverFormOpen(false));
    // console.log("Modal closed");
  }
  const isAddCaregiverOpen = useSelector(selectIsAddCaregiverFormOpen);

  return (
    <Modal
      // label={'Profile'}
      labelType="center"
      show={isAddCaregiverOpen}
      closeModal={closeModal}
      ModalBody={<AddCaregiverForm/>}
      // ModalBody={< RequestCallBackForm />}
      // isScroll = false"
      type="center"
      isCloseVisible={true}
    />
  );
}

export default AddCaregiverModal;
