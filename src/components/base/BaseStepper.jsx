import React from 'react';

const BaseStepper = ({
  steps = [],
  activeStep = 1,
  onNavigateToStep,
  ...props
}) => {
  const getCircleClasses = (step) => {
    if (step.number === activeStep) {
      return 'bg-blue-100 text-blue-600 border-2 border-blue-600';
    }
    if (step.disabled) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300';
    }
    return 'text-gray-500 hover:bg-gray-100 border border-gray-500';
  };

  const getLabelContainerClasses = (step) => {
    return step.disabled ? 'cursor-not-allowed opacity-50' : '';
  };

  const getLabelTextClasses = (step) => {
    if (step.number === activeStep) {
      return 'font-bold text-gray-900';
    }
    if (step.disabled) {
      return 'text-gray-400';
    }
    return 'text-gray-700 hover:text-black';
  };

  const handleClick = (step) => {
    if (!step.disabled && onNavigateToStep) {
      onNavigateToStep(step.number);
    }
  };

  return (
    <div className="flex flex-row items-start justify-center gap-16" {...props}>
      {steps.map((step, index) => (
        <div
          key={step.number}
          className="flex flex-col items-center gap-2 relative"
        >
          {/* Circle */}
          <button
            onClick={() => handleClick(step)}
            className={`flex items-center justify-center w-8 h-8 rounded-full leading-none cursor-pointer hover:scale-110 transition-transform z-10 bg-white ${getCircleClasses(
              step
            )}`}
            title={step.displayNameKey}
            disabled={step.disabled}
          >
            {step.number}
          </button>

          {/* Horizontal line to next step */}
          {index < steps.length - 1 && (
            <div
              className="absolute top-4 h-px bg-gray-300"
              style={{
                left: 'calc(50% + 1rem)',
                width: 'calc(5rem + 50%)',
              }}
            ></div>
          )}

          {/* Label */}
          <div
            className={`text-center px-2 cursor-pointer ${getLabelContainerClasses(
              step
            )}`}
            onClick={() => handleClick(step)}
          >
            <div
              className={`text-sm sm:text-base md:text-lg whitespace-nowrap ${getLabelTextClasses(
                step
              )}`}
            >
              {step.displayNameKey}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BaseStepper;
