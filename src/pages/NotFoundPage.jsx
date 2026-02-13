import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-primary">
            404
          </h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('notFound.title')}
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('notFound.description')}
        </p>

        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-primary rounded-lg hover:bg-blue-700 dark:hover:bg-darkPrimary focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-primary/50 transition-all shadow-md hover:shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
