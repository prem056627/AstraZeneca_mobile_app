import React, { useState, useRef, useEffect } from "react";
import { get } from "lodash";
import { X, Upload } from "lucide-react";
import { ReactComponent as Pdf } from "../../assets/images/svg/pdf.svg";
import { ReactComponent as Success } from "../../assets/images/svg/successEnrollment.svg";

function MultiFileUpload({
  formik,
  label = "ID Proof",
  id = "idProof",
  isMultiple = false,
  description = "",
  onFileUpload,
  onFileRemove,
  error,
  value,
  name
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [internalError, setInternalError] = useState(""); // Track errors internally
  const fileInputRef = useRef(null);
  
  // The actual field name to use (fallback to id if name is undefined)
  const fieldName = name || id;

  useEffect(() => {
    // Initialize the status based on whether files exist
    let hasFiles = false;
    
    if (Array.isArray(value) && value.length > 0) {
      hasFiles = true;
    } else if (formik && formik.values) {
      const fieldValue = get(formik.values, fieldName);
      hasFiles = Array.isArray(fieldValue) && fieldValue.length > 0;
    }
    
    // Set to success if files exist (unless already uploading)
    if (uploadStatus !== "uploading") {
      if (hasFiles) {
        setUploadStatus("success");
      } else {
        setUploadStatus("idle");
      }
    }
  }, [value, formik?.values, fieldName, uploadStatus]);

  // Reset internal error when formik error changes
  useEffect(() => {
    if (error) {
      setInternalError(error);
    } else {
      setInternalError("");
    }
  }, [error]);

  useEffect(() => {
    // This simulates the progress bar for demonstration purposes
    if (uploadStatus === "uploading") {
      const timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setUploadStatus("success");
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(timer);
    }
  }, [uploadStatus]);

  // Get current files from either props or formik
  const getCurrentFiles = () => {
    if (Array.isArray(value)) {
      return [...value]; // Return a copy to avoid mutation
    } else if (formik && formik.values) {
      const fieldValue = get(formik.values, fieldName);
      return Array.isArray(fieldValue) ? [...fieldValue] : [];
    }
    return [];
  };

  // Safely update formik value
  const safeSetFieldValue = async (files) => {
    if (!formik || typeof formik.setFieldValue !== 'function') {
      return false;
    }

    try {
      await formik.setFieldValue(fieldName, files);
      
      // Clear any previous errors
      if (typeof formik.setFieldError === 'function') {
        formik.setFieldError(fieldName, undefined);
      }
      setInternalError("");
      
      return true;
    } catch (err) {
      console.warn("Error setting field value:", err);
      return false;
    }
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    try {
      const files = Array.from(e.target.files || []);
       // DEBUG: Log file sizes to console
    files.forEach(file => {
      console.log(`File: ${file.name}, Size: ${file.size} bytes, ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    });
    

      if (!files.length) return;

      // Check file size (5MB limit)
      const oversizedFiles = files.filter((file) => file.size > 5242880);
      if (oversizedFiles.length > 0) {
        const errorMsg = "Maximum size of the document should be 5MB.";
        setInternalError(errorMsg);
        
        if (formik && typeof formik.setFieldError === 'function') {
          formik.setFieldError(fieldName, errorMsg);
        }
        
        e.target.value = "";
        return;
      }

      // Get current files
      const currentFiles = getCurrentFiles();

      // Check for duplicate files
      const newUniqueFiles = files.filter(
        (file) => !currentFiles.some((existingFile) => existingFile.name === file.name)
      );

      if (newUniqueFiles.length === 0) {
        setInternalError("These files have already been uploaded.");
        e.target.value = "";
        return; // All files are duplicates
      }

      // Create updated files array
      const updatedFiles = isMultiple
        ? [...currentFiles, ...newUniqueFiles]
        : newUniqueFiles;

      // Simulate upload process
      setUploadStatus("uploading");
      setUploadProgress(0);

      // Update formik state safely - with proper await
      const success = await safeSetFieldValue(updatedFiles);
      
      if (!success) {
        setUploadStatus("error");
        setInternalError("Failed to process file. Please try again.");
        e.target.value = "";
        return;
      }

      // Call callback if provided
      if (onFileUpload) {
        onFileUpload(updatedFiles);
      }

      // Reset input
      e.target.value = "";
    } catch (error) {
      console.error("Error handling file upload:", error);
      setUploadStatus("error");
      setInternalError("Failed to process file. Please try again.");
      
      if (formik && typeof formik.setFieldError === 'function') {
        formik.setFieldError(fieldName, "Failed to process file. Please try again.");
      }
      
      e.target.value = "";
    }
  };

  // Handle file removal - now works with either a specific file or all files
  const handleFileRemove = async (fileToRemove) => {
    try {
      const currentFiles = getCurrentFiles();

      // If fileToRemove is undefined, remove all files
      const filteredFiles = fileToRemove 
        ? currentFiles.filter(file => file.name !== fileToRemove.name)
        : [];

      // Safe setFieldValue with await
      const success = await safeSetFieldValue(filteredFiles);
      
      if (!success) {
        setInternalError("Failed to remove file. Please try again.");
        return;
      }

      if (filteredFiles.length === 0) {
        setUploadStatus("idle");
      }

      if (onFileRemove) {
        onFileRemove(filteredFiles);
      }
    } catch (error) {
      console.error("Error removing file:", error);
      setInternalError("Failed to remove file. Please try again.");
    }
  };

  // Safely trigger file input
  const triggerFileInput = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to truncate file name if it's too long
  const getTruncatedFileName = (name) => {
    if (!name) return "";
    if (name.length > 25) {
      const extension = name.split(".").pop();
      const baseName = name.substring(0, name.lastIndexOf("."));
      return `${baseName.substring(0, 20)}...${extension ? "." + extension : ""}`;
    }
    return name;
  };

  // Render the upload card based on status
  const renderUploadCard = () => {
    const files = getCurrentFiles();

    // If files exist and we're not uploading, show success state
    if (files.length > 0 && uploadStatus !== "uploading") {
      return (
       <>
        <div className="flex justify-between items-center py-2 px-2 border rounded-lg border-[#F1F5F9] bg-white shadow-sm relative">
          <div className="flex rounded-lg items-center gap-4 justify-center">
            <Pdf className="w-10 h-10" />
            <div className="flex flex-col w-full gap-1">
              <div className="text-[#334155] text-[16px] font-sans font-regular">
                {label}
              </div>
              <div className="text-[#00877B] font-medium text-[12px]">
                File(s) successfully uploaded
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Success className="" width={40} height={35} />
            <button
              type="button"
              onClick={() => handleFileRemove(files[0])}
              className="ml-4 text-[#475569] bg-[#F1F5F9] p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

        </div>

{(internalError || error) && (
  <div className="text-xs text-red-600">{internalError || error}</div>
)}
       </>
      );
    }

    // Show uploading state
    if (uploadStatus === "uploading") {
      return (
        <div className="flex gap-4 px-2 py-3 rounded-lg border border-[#F1F5F9] bg-white shadow-sm">
          <Pdf className="w-10 h-10" />

          <div className="flex flex-col w-full">
            <div className="flex items-center mb-2 ">
              <div className="flex items-center text-red-700 mr-2"></div>
              <div className="text-[#334155] text-[18px] font-sans font-regular">
                {label}
              </div>
              <div className="ml-auto text-[#1E293B] font-sans text-[16px]">
                {uploadProgress}%
              </div>
              <button
                className="ml-4 text-[#475569] bg-[#F1F5F9] p-1 rounded-full"
                onClick={() => setUploadStatus("idle")}
              >
                <X size={20} />
              </button>
            </div>
            <div className="w-full bg-[#F1F5F9] rounded-full h-[4px]">
              <div
                className="bg-[#00877B] h-[4px] rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    // Default/idle state
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">{label}</label>
          <div
            onClick={triggerFileInput}
            className="flex w-full items-center justify-between gap-4 truncate rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500 cursor-pointer"
          >
            <span>
              {files?.length > 0
                ? "Click here to upload more"
                : "Click to Upload"}
            </span>
            <Upload className="flex-shrink-0" size={18} />
          </div>
          {description ? (
            <p className="text-xs italic text-gray-500">{description}</p>
          ) : null}
        </div>

        {(internalError || error) && (
          <div className="text-xs text-red-600">{internalError || error}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {renderUploadCard()}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,application/pdf"
        multiple={isMultiple}
        id={id}
        name={fieldName}
        className="hidden h-0 w-0"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default MultiFileUpload;