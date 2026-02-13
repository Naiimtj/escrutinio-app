import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import setupLocatorUI from '@locator/runtime';
import './index.css';
import './i18n';
import App from './App.jsx';
import { ToastContextProvider } from './context/toast-context';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

if (import.meta.env.DEV) {
  setupLocatorUI();
}

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <ToastContextProvider>
        <App />
      </ToastContextProvider>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
