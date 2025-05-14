import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MultiFileUpload from '../../components/Form/MultiFileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedProgram, setIsInitalDataLoad, setUploadInvoiceModalOpen, setViewingOrderHistory } from '../../slice/patient-detail-form';
import { toast } from 'react-toastify';
import { ReactComponent as Tick } from "../../../src/assets/images/physicalVerify/tick_1.svg";
import useApi from '../../hooks/useApi';
import { transformToFormData } from '../../utils/forms';
import { LoaderContext } from '../../context/LoaderContextProvider';

function UploadInvoiceForm() {
    const dispatch = useDispatch();
    const triggerApi = useApi();
    const { setLoading, isLoading } = useContext(LoaderContext);
    const program = useSelector(selectSelectedProgram);

    const initialValues = {
        current_step: "place_paid_order",
        program_id: program?.program_id,
        order_file: [],
        extra_doc:[],
    };


    const validationSchema = Yup.object({
        order_file: Yup.array()
            .min(1, 'Please upload at least one file')
            .max(1, 'You can upload a maximum of 1 files')
            .test('fileSize', 'File size must be less than 2MB', (files) => {
                if (!files) return true;
                return files.every(file => file.size <= 5 * 1024 * 1024); // 2MB limit
            })
            .test('fileType', 'Only jpg, png, and pdf files are allowed', (files) => {
                if (!files) return true;
                const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                return files.every(file => validTypes.includes(file.type));
            })
            .required('File upload is required'),


            extra_doc: Yup.array()
            // .min(1, 'Please upload at least one file')
            .max(1, 'You can upload a maximum of 1 files')
            .test('fileSize', 'File size must be less than 2MB', (files) => {
                if (!files) return true;
                return files.every(file => file.size <= 5 * 1024 * 1024); // 2MB limit
            })
            .test('fileType', 'Only jpg, png, and pdf files are allowed', (files) => {
                if (!files) return true;
                const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                return files.every(file => validTypes.includes(file.type));
            })
            // .required('File upload is required'),
    });

    const notify = () =>
        toast('You have successfully uploaded your invoice documents.', {
            duration: 6000,
            position: 'top-right',
            style: {
                borderBottom: '1.5px solid #86C4B6',
                fontFamily: 'open sans',
                fontSize: '14px',
                padding: '16px',
                fontWeight: '800',
                color: '#156352',
                background: '#E6FAF3',
                width: '100%',
            },
            progressStyle: { background: '#B4E3D5' },
            icon: <Tick className="w-16 h-12 " />,
            ariaProps: {
                role: 'status',
                'aria-live': 'polite',
            },
        });

    // Simple Base64 approach without extra structure
    const makeApiCall = async (values) => {
        try {
            setLoading(true);
            const formData = transformToFormData(values);
            // formData.append('current_step', values.current_step);
            // formData.append('program_id', values.program_id);
            
            // // Ensure unique filenames by appending a timestamp
            // if (values.order_file && values.order_file.length > 0) {
            //     values.order_file.forEach((file, index) => {
            //         const uniqueName = `${Date.now()}_${file.name}`;
            //         const renamedFile = new File([file], uniqueName, { type: file.type });
            //         formData.append(`order_file[${index}]`, renamedFile);
            //     });
            // }

            const { response, success } = await triggerApi({
                url: `/patient_dashboard/?current_step=place_paid_order`,
                type: "POST",
                payload: formData,
                loader: true,
            });

            return success ? { success: true, data: response } : { success: false, error: "API call failed" };
        } catch (error) {
            console.error("Error in makeApiCall:", error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values, { setSubmitting, setFieldError }) => {
     
        try {
            const result = await makeApiCall(values);
            
            if (result.success) {
   
                dispatch(setUploadInvoiceModalOpen(false));
                
                // Show success toast
                notify();

                // setTimeout(() => {
                //     // dispatch(setProgramEnrollmentSuccess(false));
                //     window.location.reload();
                // }, 2000);

                 dispatch(setViewingOrderHistory(false));

                  setTimeout(() => {
                                             dispatch(setIsInitalDataLoad(true));
                                          }, 500);


                
              
            } else {
                // Handle API error
                setFieldError('order_file', 'Failed to upload files. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setFieldError('order_file', 'An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };



//     useEffect(()=>{
//         dispatch(setIsInitalDataLoad(false));
// console.log("hi");
//     },[])


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
        <Formik 
            initialValues={initialValues} 
            validationSchema={validationSchema} 
            onSubmit={onSubmit}
        >
            {(formik) => {
                const isFileUploaded = formik.values.order_file.length > 0;
                const hasErrors = Object.keys(formik.errors).length > 0 && formik.touched.order_file;

                return (
                    <Form className="complete-hidden-scroll-style flex flex-grow flex-col gap-4 overflow-y-auto  h-fit mt-10 ">
                       <div className=" border border-[#ECECEC] rounded-2xl p-4 ">
                       <div className=" flex flex-col gap-4 ">

                        <h1 className="text-[20px] font-bold font-open-sans">Upload Invoice</h1>
                            <MultiFileUpload
                                isMultiple={true}
                                formik={formik}
                                id="order_file"
                                name="order_file"
                                label="Invoice *"
                                description="The file must be in jpg/pdf/png format. Maximum size of the document should be 5MB. You can upload up to 5 files."
                            />
                        
                        </div>

                        <div className="flex flex-col py-4 pt-6">
                            <button
                                type="submit"
                                disabled={!isFileUploaded || hasErrors || formik.isSubmitting || isLoading}
                                className={`flex  w-full items-center justify-center rounded-[8px] bg-primary py-4 font-lato text-[18px] font-bold leading-[20px] text-white transition-opacity duration-300 ${
                                    isFileUploaded && !hasErrors && !formik.isSubmitting && !isLoading ? 'opacity-100' : 'opacity-30'
                                }`}
                            >
                                <span>{isLoading ? 'Uploading...' : 'Submit'}</span>
                            </button>
                        </div>
                       </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default UploadInvoiceForm;