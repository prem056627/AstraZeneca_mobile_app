import React, { useContext, useEffect, useState } from "react";
import FabButton from "../../components/FabButton";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Physicalverification } from "../../assets/images/ProgramCards/physicalverification.svg";
import { ReactComponent as PhysicalverificationSheduled } from "../../assets/images/ProgramCards/PhysicalverificationSheduled.svg";
import { ReactComponent as Ekyc } from "../../assets/images/ProgramCards/ekyc.svg";
import { ReactComponent as NoProgram } from "../../assets/images/ProgramCards/no_program.svg";
import { ReactComponent as Pap } from "../../../src/assets/images/Ekyc/pap.svg";

import { ReactComponent as Info } from "../../../src/assets/images/svg/Info.svg";
import { ReactComponent as UploadImg } from "../../../src/assets/images/svg/upload_img.svg";
import { ReactComponent as RequestImg } from "../../../src/assets/images/svg/request_img.svg";





import {
  selectCurrentView,
  selectInitializeData,
  selectProgramStatus,
  setProgramEnrollmentConsent,
  setProgramEnrollmentSuccess,
  setRequestFocModalOpen,
  setSelectedEnrollProgram,
  setUploadInvoiceModalOpen,
} from "../../slice/patient-detail-form";
// import OrderHistory from "../uploadInvoice/OrderHistory";
import useApi from "../../hooks/useApi";
import { LoaderContext } from "../../context/LoaderContextProvider";
import { cardio } from "ldrs";
// import OrderHistory from "../Notification/OrderHistory";

// Register the cardio component
cardio.register();

const AzProgramDashboard = () => {
  const dispatch = useDispatch();
  const { setLoading, isLoading } = useContext(LoaderContext);
  const programStatus = useSelector(selectProgramStatus);
  // const viewingOrderHistory = useSelector(selectViewingOrderHistory);
  const triggerApi = useApi();
  const initiaData = useSelector(selectInitializeData);
  const currentView = useSelector(selectCurrentView);
  // Individual state for each card's "learn more" toggle
  const [showDetails, setShowDetails] = useState({});
  const [showAllOrders, setShowAllOrders] = useState(false);
  
  const number_of_programs_enrollled =
    initiaData?.program_data?.enrolled_programs;

  const patient_inactive = initiaData?.patient_status;
  const APPLIED_PROGRAMS = initiaData?.program_data?.applied_programs || [];
  const patient_mobile_number = initiaData?.patient_data?.patient_primary_phone;
  const AVAILABLE_PROGRAMS = initiaData?.program_data?.available_programs || [];

  const handleRequest = (program) => {
    dispatch(setSelectedEnrollProgram(program));
    dispatch(setProgramEnrollmentConsent({ program, consent: true }));
    dispatch(setProgramEnrollmentSuccess(false));
  };

  const handleLearnMore = (programId) => {
    setShowDetails(prevState => ({
      ...prevState,
      [programId]: !prevState[programId]
    }));
  };

  const handleTrackOrder = (orderId) => {
    console.log(`Tracking order: ${orderId}`);
    // Implement track order functionality
  };

  const handleKnowMore = () => {
    console.log("Know more clicked");
    // Implement know more functionality
  };

  const uploadInvoice = () => {
    console.log("Upload invoice clicked");
    // Implement upload invoice functionality
    dispatch(setUploadInvoiceModalOpen(true));
  };

  const requestFreeOrder = () => {
    console.log("Request for free order clicked");
      dispatch(setRequestFocModalOpen(true));
    // Implement request for free order functionality
  };

  // If viewing order history, render OrderHistory component instead
  // if (viewingOrderHistory) {
  //   return <OrderHistory />;
  // }

  function NoAvailablePrograms() {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full">
          <NoProgram />
        </div>
        <h2 className="mt-4 text-2xl text-center font-semibold text-gray-700">
          No Available Programs
        </h2>
        <p className="mt-2 text-center text-gray-500">
          "We'll notify you when something arrives!"
        </p>
      </div>
    );
  }

  // Component to render all unactive/unenrolled programs
  const renderAvailablePrograms = () => {
    return isLoading ? (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-100 z-50">
        <l-cardio size="70" stroke="4" speed="2" color="#0101C8"></l-cardio>
      </div>
    ) : (
      <div className="space-y-4 w-full pb-20">
        {AVAILABLE_PROGRAMS.length > 0 ? (
          AVAILABLE_PROGRAMS.map((program) => (
            <div
              key={program.program_id}
              className="w-full bg-white rounded-lg shadow-md border"
            >
              <div className="p-4 flex gap-4">
                <div>
                  <img
                    src={program.program_image}
                    alt={program.program_name}
                    className="w-20 h-20 rounded-[12px]"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-md font-semibold">
                    {program.program_name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    {program.program_type.map((type, index) => (
                      <span
                        key={index}
                        className="bg-orange-200 text-orange-800 px-[8px] rounded-[6px] text-[12px] py-1"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRequest(program)}
                className={`w-full text-[14px] font-sans font-bold py-4 rounded-b-lg bg-primary text-white`}
              >
                ENROL
              </button>
            </div>
          ))
        ) : (
          <>{NoAvailablePrograms()}</>
        )}
      </div>
    );
  };

  const renderOrderCard = (order, orderType) => {
    const isPaid = orderType === "paid";
    return (
      <div key={order.order_id} className=" rounded-lg mb-4  border border-[#FBE2F0]">
        <div className="grid grid-cols-2 gap-[5px] p-3 mb-2">
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-[12px]">Order ID:</p>
            <p className="font-medium  text-[12px]">{order.order_id}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-[12px]">Order Date:</p>
            <p className="font-medium  text-[12px]">{order.order_date}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-[12px]">Order Type:</p>
            <span className={` px-2 py-[1px] text-xs rounded-md ${isPaid ? "bg-[#DDAA85] border text-white border-[#CE8551]" : "bg-[#F5C34D] text-white border border-[#F1AA00]"}`}>
              {isPaid ? "Paid Order" : "Free Order"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-[12px]">Order Status:</p>
            <span className={`text-[12px] text-[#55837F] font-medium font-sans`}>
              {order.order_status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-[12px] text-gray-600 mt-2  p-2 gap-4 rounded-b-lg justify-between bg-[#FFF8FC]">
       <Info className="text-primary w-6 h-6" />
    
          {order.order_status === "Dispatched" ? (
            <p>
              Your order has been successfully dispatched, you can track your order here-
              <button 
                onClick={() => handleTrackOrder(order.order_id)}
                className="text-primary ml-1 font-medium"
              >
                Track Order
              </button>
            </p>
          ) : (
            <p className=" text-start">
              Please send your original invoice copy to so AZCares support center.
              <button 
                onClick={handleKnowMore}
                className="text-primary ml-1 font-medium"
              >
                Know more
              </button>
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderProgramCard = (program) => {
    const isActive = program.program_status === "active";
    const hasOrders = program.orders && 
      ((program.orders.paid_orders && program.orders.paid_orders.length > 0) || 
       (program.orders.foc_orders && program.orders.foc_orders.length > 0));
    
    return (
      <div key={program.program_id} className="w-full mb-6">
        {/* Program Header Card */}
        <div className="bg-gradient-to-b from-[#FFFFFF] to-[#f9def9] rounded-lg p-4 mb-4 shadow-sm">
          <div className={`flex justify-between  ${showDetails[program.program_id] ? 'items-start':'items-end'}`}>
            <div>
              <h3 className="text-[18px] font-semibold">
                {program.program_name}
              </h3>
              <div className="flex items-center mt-2">
                <p className="text-[#767676] text-[16px]">
                  Program Status: 
                </p>
                <span className={`ml-2 px-2 py-[1px] rounded-md text-xs font-medium ${
                  isActive ? "bg-[#78C477] text-white" : "bg-yellow-100 text-yellow-800"
                } border border-[#1EA41D]`}>
                  {program.program_status.charAt(0).toUpperCase() + program.program_status.slice(1)}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleLearnMore(program.program_id)}
              className="flex items-center text-primary  justify-center"
            >
              <span className="mr-1 bg text-[14px] font-sans font-medium ">Learn more</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Additional details when expanded */}
          {showDetails[program.program_id] && (
            <div className="mt-4 space-y-2 text-[#767676] text-[14px]">
              <p>Enrollment Date: {program.program_enrollmentDate}</p>
              <p>Schemes: {program.program_scheme}</p>
              <p>Doctor's Name: {program.doctor_name}</p>
              <p>Patient UID: {program.patient_uid}</p>
            </div>
          )}
        </div>

        {/* Orders Section */}
        {hasOrders && (
          <div className="mb-8">
            <h3 className="text-[20px] font-semibold my-6">Active Orders</h3>
            
            {/* Display first 2 orders */}
            {program.orders.paid_orders && program.orders.paid_orders.slice(0, 1).map(order => 
              renderOrderCard(order, "paid")
            )}
            
            {program.orders.foc_orders && program.orders.foc_orders.slice(0, 1).map(order => 
              renderOrderCard(order, "free")
            )}
            
            {/* Show more orders if available */}
            {((program.orders.paid_orders && program.orders.paid_orders.length > 1) || 
              (program.orders.foc_orders && program.orders.foc_orders.length > 1)) && showAllOrders && (
              <div className="mt-2">
                {program.orders.paid_orders && program.orders.paid_orders.slice(1).map(order => 
                  renderOrderCard(order, "paid")
                )}
                {program.orders.foc_orders && program.orders.foc_orders.slice(1).map(order => 
                  renderOrderCard(order, "free")
                )}
              </div>
            )}
            
            {/* Show more / less button */}
            {((program.orders.paid_orders && program.orders.paid_orders.length > 1) || 
              (program.orders.foc_orders && program.orders.foc_orders.length > 1)) && (
              <button 
                onClick={() => setShowAllOrders(!showAllOrders)}
                className="text-primary font-medium text-sm mt-2"
              >
                {showAllOrders ? "Show less" : "Show more orders"}
              </button>
            )}
          </div>
        )}

        {/* Action Cards */}
        <div className="space-y-4 mb-30">
          {/* Record New Purchase Card */}
          <div className="bg-[#F7F8EB] rounded-lg  bg-gradient-to-b from-[#FCF5E0] to-[#FFFFFF] border border-[#FBEBBB]">
            <div className="flex items-end justify-between">
              <div className="flex-1  py-4 pl-4">
                <h3 className="font-semibold text-[16px] mb-1">Record New Purchase</h3>
                <p className="text-gray-600 text-sm mb-4">Upload the invoice for your recent medicine purchase.</p>
                <button 
                  onClick={uploadInvoice}
                  className="bg-primary text-white rounded-md px-4 py-2 text-[12px] font-medium"
                >
                  Upload Invoice
                </button>
              </div>
              <div className="">
                {/* <img src="/invoice-illustration.svg" alt="Upload Invoice" className="w-full" /> */}
                <UploadImg className="w-40 h-32"/>
              </div>
            </div>
          </div>
          
          {/* Request for Free Order Card */}
          <div className=" rounded-lg border border-[#C5D1A6] bg-gradient-to-b from-[#F1FED1] to-[#FFFFFF]  ">
            <div className="flex items-end justify-between">
              <div className="flex-1 py-4 pl-4">
                <h3 className="font-semibold text-[16px] mb-1">Request for Free Order</h3>
                <p className="text-gray-600 text-sm mb-4">Eligible for a free order? Submit your request here.</p>
                <button 
                  onClick={requestFreeOrder}
                  className="bg-primary text-white rounded-md px-4 py-2 text-[12px] font-medium"
                >
                  Request for Free Order
                </button>
              </div>
              <div className="">
              <RequestImg className="w-40 h-32 "/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActiveProgram = () => (
    <div className="w-full">
      {APPLIED_PROGRAMS.map(program => renderProgramCard(program))}
    </div>
  );

  return (
    <div className="flex flex-col items-center p-4 max-h-screen bg-white relative">
      {/* <h2 className="text-lg font-semibold w-full py-4">Programs</h2> */}

      {(number_of_programs_enrollled ?? 0) > 0
        ? renderActiveProgram()
        : renderAvailablePrograms()}
{/* 
      <div className="fixed bottom-30 z-30 right-0">
        <FabButton />
      </div> */}
    </div>
  );
};

export default AzProgramDashboard;