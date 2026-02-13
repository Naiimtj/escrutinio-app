import BaseIcon from './BaseIcon';

const BaseModal = ({
  visible = false,
  title,
  onClose,
  fullscreen = false,
  closeButtonHidden = false,
  children,
  ...props
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      {...props}
    >
      <div
        className={`bg-white rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto ${
          fullscreen ? 'w-full h-full' : 'w-[90%] max-w-2xl'
        }`}
      >
        {!closeButtonHidden && (
          <BaseIcon
            icon="close"
            onClick={onClose}
            className="absolute z-10 right-0 top-0 m-1 fill-darkPrimary hover:fill-textPrimary cursor-pointer"
          />
        )}

        <div className="bg-gray-50 p-6">
          {title && (
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
