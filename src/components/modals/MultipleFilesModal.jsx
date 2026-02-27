import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton, BaseModal } from '../base';

const MultipleFilesModal = ({ isOpen, files = [], onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleConfirm = () => {
    const selected = files[selectedIndex];
    if (selected) {
      onConfirm(selected);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <BaseModal
      visible={isOpen}
      title={t('step1.multipleFilesModal.title')}
      onClose={onCancel}
    >
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          {t('step1.multipleFilesModal.message', { count: files.length })}
        </p>

        <div className="space-y-2">
          {files.map((file, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedIndex === index
                  ? 'border-primary bg-primary/10 dark:bg-primary/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-primary/50 dark:hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="file-select"
                value={index}
                checked={selectedIndex === index}
                onChange={() => setSelectedIndex(index)}
                className="accent-primary"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </span>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <BaseButton onClick={onCancel} outlined size="large">
            {t('modals.cancel')}
          </BaseButton>
          <BaseButton onClick={handleConfirm} variant="primary" size="large">
            {t('modals.confirm')}
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  );
};

export default MultipleFilesModal;
