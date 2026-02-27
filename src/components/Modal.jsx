import { useTranslation } from 'react-i18next';
import { modalOverlay, modalContent } from '../utils/styles';
import { BaseButton } from './base';

const Modal = ({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={modalOverlay}>
      <div className={modalContent}>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-2">
          <BaseButton
            onClick={onCancel}
            variant="secondary"
            size='large'
          >
            {cancelText || t('modals.cancel')}
          </BaseButton>
          <BaseButton
            onClick={onConfirm}
            variant="primary"
            size='large'
          >
            {confirmText || t('modals.confirm')}
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

export default Modal;
