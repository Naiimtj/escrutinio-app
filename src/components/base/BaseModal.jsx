import BaseIcon from './BaseIcon';

const BaseModal = ({
  visible = false,
  title,
  onClose,
  fullscreen = false,
  fullHeight = false,
  fullWidth = false,
  closeButtonHidden = false,
  children,
  ...props
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      {...props}
    >
      <div
        className={`bg-gray-50 dark:bg-gray-600 rounded-lg shadow-lg relative overflow-y-auto ${
          fullscreen ? 'w-full h-full' : 'max-w-[90%] max-h-[90%]'
        } ${fullHeight ? 'h-full max-w-[90%]' : ''} ${fullWidth ? 'w-full max-h-[90%]' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-50 dark:bg-gray-800">
          {!closeButtonHidden && (
            <BaseIcon
              icon="close"
              onClick={onClose}
              className="sticky z-10 right-2 top-2 ml-auto dark:fill-primary fill-textPrimary dark:hover:fill-textPrimary hover:fill-darkPrimary cursor-pointer"
            />
          )}
          <div className="px-6 pb-6">
            {title && (
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                {title}
              </h2>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
