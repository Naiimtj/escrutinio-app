import { useTranslation } from 'react-i18next';
import { BaseButton, BaseModal, BaseIcon } from '../base';

const DeleteConfirmationModal = ({
  isOpen,
  title,
  message,
  warningMessage,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <BaseModal visible={isOpen} title={title} onClose={onCancel}>
      <div className="space-y-4">
        {/* Mensaje principal */}
        {message && (
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        )}

        {/* Contenido personalizado */}
        {children}

        {/* Mensaje de advertencia */}
        {warningMessage && (
          <div className="flex items-center justify-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <BaseIcon
              icon="alert"
              size="large"
              color="currentColor"
              className="text-red-600 dark:text-red-400 shrink-0 mt-0.5 "
            />
            <p className="text-red-700 dark:text-red-300 font-semibold">
              {warningMessage}
            </p>
          </div>
        )}           

        {/* Botones de acción */}
        <div className="flex justify-center gap-3 pt-2">
          <BaseButton onClick={onCancel} outlined size="large">
            {cancelText || t('modals.cancel')}
          </BaseButton>
          <BaseButton
            onClick={onConfirm}
            variant="danger"
            size="large"
          >
            {confirmText || t('modals.confirm')}
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteConfirmationModal;
