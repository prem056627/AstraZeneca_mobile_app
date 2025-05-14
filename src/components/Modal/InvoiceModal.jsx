// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';

// function InvoiceModal({
//     label,
//     backBtnLabel,
//     labelType = '',
//     show = true,
//     closeModal,
//     backModal,
//     isCloseVisible = false,
//     isBackVisible = false,
//     ModalBody,
//     type = 'side',
//     isScroll = true,
// }) {

//     return (
//         <Transition appear show={show} as={Fragment}>
//             <Dialog
//                 as="div"
//                 className="relative z-50"
//                 onClose={() => {}}
//             >
//                 {/* Background with opacity transition */}
//                 <Transition.Child
//                     as={Fragment}
//                     enter="transition-opacity duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-80"
//                     leave="transition-opacity duration-200"
//                     leaveFrom="opacity-80"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-black px-5" />
//                 </Transition.Child>

//                 {/* Modal Container */}
//                 <div className="fixed inset-0 flex items-center justify-center">
//                     <Transition.Child
//                         as={Fragment}
//                         enter="transition-transform duration-300"
//                         enterFrom="scale-95 opacity-0"
//                         enterTo="scale-100 opacity-100"
//                         leave="transition-transform duration-200"
//                         leaveFrom="scale-100 opacity-100"
//                         leaveTo="scale-95 opacity-0"
//                     >
//                         <Dialog.Panel className="w-full max-w-md mx-4 transform overflow-hidden rounded-[22px] bg-white shadow-xl transition-all">
//                             {/* Header */}
//                             <div className="relative px-6 py-6 border-b bg-[#F6F6F6]">
//                                 <Dialog.Title className="text-[18px] font-open-sans font-bold text-[#3B3B3B]">
//                                     {label}
//                                 </Dialog.Title>

//                                 {isCloseVisible && (
//                                     <button
//                                         onClick={closeModal}
//                                         className="absolute right-6 top-6 text-[#3B3B3B] hover:text-gray-500"
//                                     >
//                                         <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                             <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
//                                         </svg>
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Content */}
//                             <div className="pt-6">
//                                 {ModalBody}
//                             </div>
//                         </Dialog.Panel>
//                     </Transition.Child>
//                 </div>
//             </Dialog>
//         </Transition>
//     );
// }

// export default InvoiceModal;

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ReactComponent as ModalCloseIcon } from "../../assets/images/svg/modal-close-icon.svg";
import { ReactComponent as ModalBackIcon } from "../../../src/assets/images/svg/back.svg";
import { ReactComponent as AstraZenica_logo } from "../../assets/images/svg/astrazenica_logo.svg";

function InvoiceModal({
  label,
  backBtnLabel,
  labelType = "",
  show = true,
  closeModal,
  backModal,
  isCloseVisible = false,
  isBackVisible = false,
  ModalBody,
  type = "side",
  isScroll = true,
  moreZindex,
}) {
  const zIndexClass = moreZindex ? "z-[100]" : "z-50";

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

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className={`relative ${zIndexClass}`} onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className=" h-full "
        >
          <div className="fixed inset-0 bg-black bg-opacity-[.67]" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-100"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-100"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          // className="bg-black"
        >
          <div className="fixed inset-0 overflow-y-auto    ">
            <div
              className={`flex h-full min-h-full grow items-center justify-center text-center   ${
                {
                  side: "md:justify-end",
                  center: "p-[0px]",
                  large: "",
                }[type]
              }`}
            >
              <Dialog.Panel
                className={`relative mx-auto flex h-full min-h-full gap-[0px] w-full  overflow-y-auto  ${
                  {
                    side: "max-w-[498px]",
                    center: "",
                    large: "",
                  }[type]
                }  transform flex-col gap-[32px] overflow-hidden bg-white px-[24px] pb-[40px] pt-[32px] text-left align-middle shadow-xl transition-all md:pl-[32px] md:pr-[72px]`}
              >
                {isBackVisible ? (
                  <div className="flex gap-4 justify-items-center items-center">
                    <div className="flex justify-start md:absolute md:right-0 md:top-0">
                      <button
                        type="button"
                        className="flex justify-end focus:outline-none md:absolute md:right-[16px] md:top-[16px]"
                        onClick={closeModal}
                      >
                        <ModalBackIcon />
                      </button>
                    </div>

                    <div className="flex justify-center items-center h-20 px-6 w-full">
                      {/* <img
           width={90}
           src="/pfizer_logo.svg"
           alt="Pfizer Logo"
           className="cursor-pointer"
         /> */}
                      <AstraZenica_logo width={220} />
                    </div>

                    <h3
                      className={`text-start font-open-sans text-xl font-bold text-[#403939] ${
                        {
                          center: "text-center",
                          start: "text-start",
                        }[labelType]
                      }`}
                    >
                      {backBtnLabel}
                    </h3>
                  </div>
                ) : null}
                {isCloseVisible ? (
                  <div className="flex justify-end md:absolute md:right-0 md:top-0">
                    <button
                      type="button"
                      className="focus:outline-none ml-4"
                      onClick={closeModal}
                    >
                      <ModalCloseIcon />
                    </button>
                  </div>
                ) : null}

                {/* <Dialog.Title as="div" className="flex flex-col gap-2 ">
									
									<div className="flex flex-col gap-[2px]">
										<h3
											className={`text-start font-open-sans text-xl font-bold text-[#403939] ${
												{
													center: 'text-center',
													start: 'text-start',
												}[labelType]
											}`}
										>
											{label}
										</h3>
									</div>
								</Dialog.Title> */}
                {ModalBody}
              </Dialog.Panel>
            </div>

            <div className=" fixed bottom-0  left-0 w-full bg-[#F4F4FF] py-2 ">
              {/* {PoweredByFooter()} */}
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default InvoiceModal;
