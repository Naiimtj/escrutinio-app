// Common button styles
export const buttonStyles = {
  primary:
    'p-4 bg-primary rounded-lg hover:bg-darkPrimary transition text-darkPrimary hover:text-lightPrimary text-lg font-semibold',
  secondary:
    'p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-darkPrimary hover:text-lightPrimary text-lg font-semibold',
  success:
    'p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-darkPrimary hover:text-lightPrimary text-lg font-semibold',
  danger:
    'p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-darkPrimary hover:text-lightPrimary text-lg font-semibold',
  outline:
    'px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primaryLight transition text-darkPrimary hover:text-lightPrimary text-lg font-semibold',
};

// Common input styles
export const inputStyles =
  'w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

// Modal wrapper styles
export const modalOverlay =
  'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
export const modalContent = 'bg-white rounded-lg p-6 max-w-md w-full mx-4';
