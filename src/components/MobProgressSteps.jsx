import React from 'react';

const MobProgressSteps = ({ currentStep }) => {
  // Total number of steps is 4
  const totalSteps = 4;
  
  return (
    <div className="flex items-center w-full">
      {/* Generate dots and connecting lines dynamically */}
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {/* Dot */}
          <div className={`flex items-center justify-center w-4 h-4 rounded-full border 
            ${currentStep > index ? 'border-primary' : index === currentStep - 1 ? 'border-primary' : 'border-gray-300'}`}>
            <span className={`block w-2 h-2 rounded-full 
              ${currentStep > index ? 'bg-primary' : index === currentStep - 1 ? 'bg-primary' : 'bg-gray-300'}`} />
          </div>
          
          {/* Connecting Line (only if not the last dot) */}
          {index < totalSteps - 1 && (
            <div className={`flex-1 h-1 mx-2 rounded 
              ${currentStep > index + 1 ? 'bg-primary' : 'bg-gray-300'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MobProgressSteps;