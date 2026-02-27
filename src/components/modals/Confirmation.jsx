import { useTranslation } from 'react-i18next';
import { BaseButton, BaseModal } from '../base';

const Confirmation = ({
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

  return (
    <BaseModal visible={isOpen} title={title} onClose={onCancel}>
      <div className="mb-6">{children}</div>
      <div className="flex justify-center gap-2">
        <BaseButton onClick={onCancel} variant="secondary" size="large">
          {cancelText || t('modals.cancel')}
        </BaseButton>
        <BaseButton onClick={onConfirm} variant={confirmStyle} size="large">
          {confirmText || t('modals.confirm')}
        </BaseButton>
      </div>
    </BaseModal>
  );
};

export default Confirmation;
