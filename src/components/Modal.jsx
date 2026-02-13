import { useTranslation } from 'react-i18next';
import { buttonStyles, modalOverlay, modalContent } from '../utils/styles';

const Modal = ({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmStyle = 'primary',
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={modalOverlay}>
      <div className={modalContent}>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className={buttonStyles.secondary}>
            {cancelText || t('modals.cancel')}
          </button>
          <button onClick={onConfirm} className={buttonStyles[confirmStyle]}>
            {confirmText || t('modals.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
