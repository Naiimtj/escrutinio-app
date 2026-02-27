import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseIcon } from '../components/base';

const StepsLayout = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const isTiebreaker = location.pathname.includes('tiebreaker');

  // Determine current step from the route
  const getCurrentStep = () => {
    if (location.pathname.includes('step1')) return 1;
    if (location.pathname.includes('step2')) return 2;
    if (location.pathname.includes('step3')) return 3;
    if (isTiebreaker) return 3.5;
    if (location.pathname.includes('step4')) return 4;
    return 0;
  };

  const currentStep = getCurrentStep();

  // Get step indicator style for standard 1-4 steps
  const getStepStyle = (step) => {
    if (currentStep === step) {
      return 'bg-primary text-black';
    }
    if (currentStep > step) {
      return 'bg-darkPrimary text-white';
    }
    return 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  };

  // Connector after step 3: dark if we're past step 3 (tiebreaker or step4)
  const connectorAfter3Active = currentStep >= 3.5;
  // Connector between tiebreaker and step4
  const connectorAfterTBActive = currentStep >= 4;

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Progress Indicator */}
      {currentStep > 0 && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 transition-colors duration-300">
          <div className="relative flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              {/* Steps 1–3 */}
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${getStepStyle(step)}`}
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
                  {/* Connector after each step */}
                  <div
                    className={`w-8 md:w-16 h-1 transition-all duration-300 ${
                      index === 2
                        ? connectorAfter3Active
                          ? 'bg-darkPrimary'
                          : 'bg-gray-300 dark:bg-gray-700'
                        : currentStep > step
                          ? 'bg-darkPrimary'
                          : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                </div>
              ))}

              {/* Tiebreaker bubble — only visible when on tiebreaker route */}
              {isTiebreaker && (
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-xs border-2 border-dashed ${
                      isTiebreaker
                        ? 'bg-warning text-black border-warning'
                        : currentStep > 3.5
                          ? 'bg-darkPrimary text-white border-darkPrimary'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600'
                    }`}
                    title={t('step4.tiebreaker.stepLabel')}
                  >
                    {currentStep > 3.5 ? (
                      <svg
                        className="w-5 h-5"
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
                      <BaseIcon
                        icon="balance"
                        className="w-5 h-5"
                        color="white"
                      />
                    )}
                  </div>
                  <div
                    className={`w-8 md:w-16 h-1 transition-all duration-300 ${
                      connectorAfterTBActive
                        ? 'bg-darkPrimary'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                </div>
              )}

              {/* Step 4 */}
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${getStepStyle(4)}`}
                >
                  {currentStep > 4 ? (
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
                    4
                  )}
                </div>
              </div>
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
