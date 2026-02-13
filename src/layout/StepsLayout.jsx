import { useLocation } from 'react-router-dom';

const StepsLayout = ({ children }) => {
  const location = useLocation();

  // Determine current step from the route
  const getCurrentStep = () => {
    if (location.pathname.includes('step1')) return 1;
    if (location.pathname.includes('step2')) return 2;
    if (location.pathname.includes('step3')) return 3;
    if (location.pathname.includes('step4')) return 4;
    return 0;
  };

  const currentStep = getCurrentStep();

  // Get step indicator style
  const getStepStyle = (step) => {
    if (currentStep === step) {
      return 'bg-primary text-white';
    }
    if (currentStep > step) {
      return 'bg-darkPrimary text-white';
    }
    return 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Progress Indicator */}
      {currentStep > 0 && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 transition-colors duration-300">
          <div className="relative flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${getStepStyle(
                      step,
                    )}`}
                  >
                    {currentStep > step ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-16 md:w-32 h-1 transition-all duration-300 ${
                        currentStep > step
                          ? 'bg-darkPrimary'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 py-6 overflow-auto">{children}</main>
    </div>
  );
};

export default StepsLayout;
