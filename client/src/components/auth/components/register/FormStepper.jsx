import React from 'react';
import { UserIcon, MapPinIcon, MoveIcon, CheckCircle2, KeyIcon } from 'lucide-react';

const FormStepper = ({ steps, currentStep, setCurrentStep, isStepComplete }) => {
  // Map step ids to their corresponding icons
  const getStepIcon = (id) => {
    const icons = {
      'account': <KeyIcon className="w-5 h-5" />,
      'personal': <UserIcon className="w-5 h-5" />,
      'physical': <MoveIcon className="w-5 h-5" />,
      'address': <MapPinIcon className="w-5 h-5" />
    };
    return icons[id] || null;
  };

  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center relative">
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div 
              className="absolute left-1/2 top-4 w-full h-0.5 bg-emerald-200" 
              style={{ transform: 'translateX(50%)' }}
            >
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: currentStep > index ? '100%' : '0%' }}
              ></div>
            </div>
          )}

          {/* Step indicator */}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
              currentStep === index
                ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                : currentStep > index || isStepComplete(index)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-100 text-emerald-500'
            }`}
            onClick={() => {
              // Only allow clicking on completed steps or current step
              if (currentStep > index || isStepComplete(index)) {
                setCurrentStep(index);
              }
            }}
          >
            {currentStep > index || isStepComplete(index) ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </button>

          {/* Step title */}
          <div className="flex items-center mt-2 space-x-1">
            <span className="hidden md:block">{getStepIcon(step.id)}</span>
            <span className={`text-sm font-medium ${
              currentStep === index ? 'text-emerald-700' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormStepper; 