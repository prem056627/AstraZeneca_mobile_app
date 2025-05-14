import React from "react";
import { ReactComponent as Relax } from "../../../src/assets/images/physicalVerify/relax.svg";
import { ReactComponent as Pap } from "../../../src/assets/images/physicalVerify/pap.svg";
import { ReactComponent as Tick } from "../../../src/assets/images/physicalVerify/tick.svg";

function CustomToast({ date, time, closeToast }) {
  return (
    <div className="custom-toast-container flex flex-col pt-[20px]">
      <div className="custom-toast-content">
        {/* Left Image */}
        {/* <img src="/your-image-path.png" alt="illustration" className="toast-image" /> */}
        <Relax className="w-28 h-16 " />

        {/* Text Content */}
        <div className=" mx-2text-center">
          <p className="text-gray-700 text-[14px] font-medium font-sans mx-6">
          Your  <strong className="text-primary">physical verification</strong>{" "}
      request  has been submitted to Our Team !!  <Tick className="ml-1 inline" />
          </p>
        </div>
      </div>
      <div className="bg-[#208376] w-full flex py-[2px] justify-center items-center">
      <Pap className="w-8 h-8 mx-2" />
        <p className="text-[13px] text-white  w-full">
          Our Team will soon reach out for verification.
        </p>
      </div>
      {/* Close Button */}
      {/* <button className="close-btn" onClick={closeToast}>✖</button> */}
    </div>
  );
}

export default CustomToast;
