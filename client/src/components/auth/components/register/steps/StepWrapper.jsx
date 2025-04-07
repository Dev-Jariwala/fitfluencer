import React from 'react';

const StepWrapper = ({ 
  children, 
  title, 
  description, 
  icon, 
  animationDirection,
  stepKey
}) => {
  return (
    <div 
      key={stepKey}
      className={`space-y-6 transition-all duration-300 ${
        animationDirection === 'forward' 
          ? 'animate-slide-in-right' 
          : 'animate-slide-in-left'
      }`}
      style={{ 
        animationDuration: '300ms',
        animationFillMode: 'forwards'
      }}
    >
      <div className="space-y-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-emerald-800">{title}</h3>
            <p className="text-gray-500">{description}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default StepWrapper; 