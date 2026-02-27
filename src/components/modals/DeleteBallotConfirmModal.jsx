import { useTranslation } from 'react-i18next';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const DeleteBallotConfirmModal = ({ isOpen, ballot, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      title={t('step3.confirmDelete')}
      message={
        ballot && t('step3.confirmDeleteMessage', { number: ballot.number })
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={t('step3.deleteBallot')}
    />
  );
};

export default DeleteBallotConfirmModal;
