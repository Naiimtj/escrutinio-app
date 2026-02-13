import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300 p-4">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="bg-white mt-12 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Sistema de Escrutinio - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
