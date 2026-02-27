import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BaseButton, BaseIcon } from '../components/base';
import BaseExpandableSection from '../components/base/BaseExpandableSection';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 w-full justify-center items-center flex flex-col md:gap-6">
      <img src="/logo.svg" alt="Escrutinio Logo" className="w-44 h-44" />
      {/* Hero Section */}
      <div className="text-center mb-16 flex flex-col items-center gap-4 ">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          {t('home.welcome')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          {t('home.description')}
        </p>
        <BaseButton
          onClick={() => navigate('/step1')}
          size="large"
          variant="primary"
          icon="arrowRight"
        >
          {t('home.startButton')}
        </BaseButton>
      </div>

      <div className="flex flex-row gap-8 w-full justify-center">
        {/* Features Grid */}
        <div className="flex flex-col gap-4 ">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-900/30 rounded-lg flex items-center justify-center mb-4">
              <BaseIcon
                icon="documentExcel"
                size="large"
                className="fill-black dark:fill-white"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.step1Title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t('home.features.step1Description')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-900/30 rounded-lg flex items-center justify-center mb-4">
              <BaseIcon
                icon="settings"
                size="large"
                className="fill-black dark:fill-white"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.step2Title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t('home.features.step2Description')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-900/30 rounded-lg flex items-center justify-center mb-4">
              <BaseIcon
                icon="logs"
                size="large"
                className="fill-black dark:fill-white dark:stroke-white"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.features.step3Title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t('home.features.step3Description')}
            </p>
          </div>
        </div>

        {/* Process Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 md:w-1/2 justify-center items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t('home.processTitle')}
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center font-semibold text-sm">
                  {step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t(`home.steps.step${step}Title`)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t(`home.steps.step${step}Description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Important Information Section */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <BaseExpandableSection
          title={
            <div className="flex items-center gap-3">
              <BaseIcon
                icon="alert"
                size="large"
                className="fill-yellow-600 dark:fill-yellow-500"
              />
              <span className="text-yellow-900 dark:text-yellow-200">
                {t('home.importantInfo.title')}
              </span>
            </div>
          }
          isOpenInitially={false}
          styleClass="flex flex-col gap-4"
          className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-xl shadow-lg"
        >
          <div className="px-2">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Storage Info */}
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700/50">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <BaseIcon
                    icon="store"
                    size="small"
                    className="stroke-yellow-700 dark:stroke-yellow-400"
                  />
                  {t('home.importantInfo.storage.title')}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('home.importantInfo.storage.description')}
                </p>
              </div>

              {/* Privacy Info */}
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700/50">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <BaseIcon
                    icon="check"
                    size="small"
                    className="stroke-yellow-700 dark:stroke-yellow-400"
                  />
                  {t('home.importantInfo.privacy.title')}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('home.importantInfo.privacy.description')}
                </p>
              </div>

              {/* Security Info */}
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700/50">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <BaseIcon
                    icon="settings"
                    size="small"
                    className="fill-yellow-700 dark:fill-yellow-400"
                  />
                  {t('home.importantInfo.security.title')}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('home.importantInfo.security.description')}
                </p>
              </div>

              {/* Deletion Info */}
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700/50">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <BaseIcon
                    icon="delete"
                    size="small"
                    className="stroke-yellow-700 dark:stroke-yellow-400"
                  />
                  {t('home.importantInfo.deletion.title')}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('home.importantInfo.deletion.description')}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700/50">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                <BaseIcon
                  icon="info"
                  size="small"
                  className="stroke-yellow-700 dark:stroke-yellow-400"
                />
                {t('home.importantInfo.recommendations.title')}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold shrink-0">
                    •
                  </span>
                  <span>
                    {t('home.importantInfo.recommendations.items.backup')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold shrink-0">
                    •
                  </span>
                  <span>
                    {t('home.importantInfo.recommendations.items.browser')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold shrink-0">
                    •
                  </span>
                  <span>
                    {t('home.importantInfo.recommendations.items.singleDevice')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </BaseExpandableSection>
      </div>
    </div>
  );
};

export default HomePage;
