import React from "react";
import { ReactComponent as SuccessLogo } from "../../assets/images/svg/successEnrollment.svg";
import { ReactComponent as ProgramSucess } from "../../assets/images/ProgramCards/successEnrollment.svg";
import { ReactComponent as Refresh } from "../../assets/images/ProgramCards/refresh.svg";

function ProgramEnrollSucess() {

  const handleRefresh = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="flex flex-col items-center justify-between  gap-6   h-screen  ">
      {/* <div className=" h-20 w-full flex justify-center items-center">
        <div className="flex justify-center items-center">
          <img
            width={100}
            src="/pfizer_logo.svg"
            alt="Pfizer Logo"
            className="cursor-pointer"
          />
        </div>
      </div> */}

      <div className=" flex flex-col items-center justify-between gap-10">


      <div className="flex flex-col items-center justify-center gap-4 px-6 pt-20 ">
        <div className="animate-enter">
          <SuccessLogo />
        </div>

       


        <div className="flex flex-col items-center gap-2 text-center ">
          <h2 className="text-[18px] font-open-sans font-semibold text-[#595454] text-center ">
            {" "}
            You have <span className="text-[#208376]">successfully submitted</span> your <span className="text-[#208376]">program details</span>.
          </h2>
          {/* <h4 className="text-md text-[36px]  font-open-sans font-extralight text-[#707070] text-center">
            {" "}
            Redirecting..!
          </h4> */}
          {/* <p className="text-[22px] font-open-sans font-extralight italic text-[#C4C4C4] max-w-[568px] text-center ">
          while we verify your submitted documents.
          </p> */}
        </div>
      </div>

      <div className="flex justify-center items-center w-full px-6 ">
        <ProgramSucess />
      </div>
      <button
      onClick={handleRefresh}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:[#040494] transition mt-5"
    >
      <Refresh/> Refresh
    </button>
      </div>
      
    </div>
  );
}

export default ProgramEnrollSucess;
