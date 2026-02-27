import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createVoterList,
  voterListExists,
  backupExists,
  restoreLastBackup,
  clearBackup,
  configurationExists,
  deleteConfiguration,
  deleteAllBallots,
  ballotsExist,
} from '../service';
import {
  generateDemoVoterFile,
  parseVotersExcelFile,
} from '../utils/step1Excel';
import { BaseButton, BaseIcon, BaseModal, BaseDropFile } from './base';
import Confirmation from './modals/Confirmation';
import MultipleFilesModal from './modals/MultipleFilesModal';

const Step1 = ({ onNext }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [totalPeople, setTotalPeople] = useState(0);
  const [error, setError] = useState('');
  const [showPasswordInstructions, setShowPasswordInstructions] =
    useState(false);
  const [showNoBackupModal, setShowNoBackupModal] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [showOldDataModal, setShowOldDataModal] = useState(false);
  const [showMultipleFilesModal, setShowMultipleFilesModal] = useState(false);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [pendingFile, setPendingFile] = useState(null);
  const hasBackup = backupExists();

  const handleGenerateDemoFile = async () => {
    await generateDemoVoterFile({
      sheetName: t('step1.demo.sheetName'),
      fileName: t('step1.demo.fileName'),
      headers: {
        name: t('step1.demo.columns.name'),
        lastName1: t('step1.demo.columns.lastName1'),
        lastName2: t('step1.demo.columns.lastName2'),
        location: t('step1.demo.columns.location'),
      },
    });
  };

  const handleFilesAdded = async (addedFiles) => {
    if (!addedFiles || addedFiles.length === 0) return;

    setError('');

    // If more than one file was added, let the user pick which one
    if (addedFiles.length > 1) {
      setMultipleFiles(addedFiles);
      setShowMultipleFilesModal(true);
      return;
    }

    const file = addedFiles[0];

    // If existing config or ballots exist, ask user what to do first
    if (configurationExists() || ballotsExist()) {
      setPendingFile(file);
      setShowOldDataModal(true);
      return;
    }

    await processFile(file);
  };

  const handleMultipleFilesConfirm = async (selectedFile) => {
    setShowMultipleFilesModal(false);
    setMultipleFiles([]);

    if (configurationExists() || ballotsExist()) {
      setPendingFile(selectedFile);
      setShowOldDataModal(true);
      return;
    }

    await processFile(selectedFile);
  };

  const handleMultipleFilesCancel = () => {
    setShowMultipleFilesModal(false);
    setMultipleFiles([]);
  };

  const processFile = async (file) => {
    setUploading(true);
    setError('');

    try {
      const voterList = await parseVotersExcelFile(file);
      createVoterList(voterList);

      setTotalPeople(voterList.length);
      setUploadSuccess(true);
      setUploading(false);

      setTimeout(() => onNext(), 2000);
    } catch (err) {
      const errorMessage = err.message || '';
      const isPasswordError =
        errorMessage.includes('central directory') ||
        errorMessage.includes('zip file') ||
        errorMessage.includes('encrypted') ||
        errorMessage.includes('password');

      if (isPasswordError) {
        setShowPasswordInstructions(true);
        setError(t('step1.errors.passwordProtected'));
      } else if (errorMessage === 'STEP1_MIN_COLUMNS') {
        setError(t('step1.errors.minColumns', { count: 4 }));
      } else {
        setError(t('step1.errors.processing'));
      }

      setUploading(false);
    }
  };

  const handleContinueUpload = async () => {
    const file = pendingFile;
    setPendingFile(null);
    setShowOldDataModal(false);
    await processFile(file);
  };

  const handleResetAndUpload = async () => {
    deleteConfiguration();
    deleteAllBallots();
    const file = pendingFile;
    setPendingFile(null);
    setShowOldDataModal(false);
    await processFile(file);
  };

  const handleCancelOldDataModal = () => {
    setShowOldDataModal(false);
    setPendingFile(null);
  };

  const handleCloseInstructions = () => {
    setShowPasswordInstructions(false);
    setError('');
  };

  const handleRestoreBackup = () => {
    if (!backupExists()) {
      setShowNoBackupModal(true);
      return;
    }

    setShowOverwriteModal(true);
  };

  const confirmRestore = () => {
    const restored = restoreLastBackup();
    if (!restored) {
      setShowOverwriteModal(false);
      setShowNoBackupModal(true);
      return;
    }

    clearBackup();
    setShowOverwriteModal(false);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        {t('step1.title')}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
        {uploadSuccess ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-green-600 mt-4 mb-2">
              {t('step1.uploadSuccess')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('step1.totalPeople')}:{' '}
              <span className="font-bold">{totalPeople}</span>
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t('navigation.loading')}...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {showPasswordInstructions ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-6">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-yellow-600 mr-3 shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="flex flex-col">
                    {error && (
                      <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
                        {error}
                      </h3>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      {t('step1.passwordInstructions')}
                    </p>
                    <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mb-4 ml-4 list-decimal">
                      <li>{t('step1.file-password-step1')}</li>
                      <li>{t('step1.file-password-step2')}</li>
                      <li>{t('step1.file-password-step3')}</li>
                      <li>{t('step1.file-password-step4')}</li>
                      <li>{t('step1.file-password-step5')}</li>
                    </ol>
                    <BaseButton
                      onClick={handleCloseInstructions}
                      size="md"
                      variant="secondary"
                    >
                      {t('step1.tryAgain')}
                    </BaseButton>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className=" flex justify-between items-center p-4 bg-gray-50 border dark:border-grayLight dark:bg-grayMedium rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 mb-2 font-bold">
                      {t('step1.columns.required')}
                    </div>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>{t('step1.columns.name')}</li>
                      <li>{t('step1.columns.lastName1')}</li>
                      <li>{t('step1.columns.lastName2')}</li>
                      <li>{t('step1.columns.location')}</li>
                    </ul>
                  </div>
                  <>
                    <BaseButton onClick={handleGenerateDemoFile} size="small">
                      {t('step1.download')}
                    </BaseButton>
                  </>
                </div>
                <BaseDropFile
                  label={
                    uploading ? `${t('step1.upload')}...` : t('step1.upload')
                  }
                  buttonLabel={t('step1.upload')}
                  labelDragAndDrop={t('step1.dragAndDrop')}
                  labelFormat={t('step1.columns.required')}
                  labelLimit={t('step1.fileLimits')}
                  labelMaxFile={t('step1.maxFile')}
                  formats={['xlsx', 'xls']}
                  limitNumberFiles={1}
                  limitSizeFile="10"
                  files={[]}
                  disabled={uploading}
                  onAddFiles={handleFilesAdded}
                  onExceedLimit={handleFilesAdded}
                  onDeleteFile={() => {}}
                />
                {error && !showPasswordInstructions && (
                  <div className="mt-4 text-alert text-sm text-center">
                    {error}
                  </div>
                )}
                
                <div className="text-center">
                  <BaseIcon
                    name="download"
                    className="w-4 h-4 text-gray-600 dark:text-gray-300"
                  />
                </div>
              </>
            )}
          </div>
        )}
        {!uploadSuccess && (voterListExists() || hasBackup) && (
          <div className="flex flex-col items-center justify-end pt-4 gap-2">
            {voterListExists() && (
              <>
                <p className="dark:text-white text-grayDark">
                  {t('step1.haveList')}
                </p>
                <BaseButton variant="primary" size="large" onClick={onNext}>
                  {t('navigation.next')}
                </BaseButton>
              </>
            )}
            {hasBackup && (
              <div className="w-full">
                <BaseButton
                  variant="secondary"
                  icon="restore"
                  onClick={handleRestoreBackup}
                >
                  {t('step1.restore.button')}
                </BaseButton>
              </div>
            )}
          </div>
        )}

        <BaseModal
          visible={showNoBackupModal}
          title={t('step1.restore.button')}
          onClose={() => setShowNoBackupModal(false)}
        >
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-6">
            {t('step1.restore.notFound')}
          </p>
          <div className="flex justify-end">
            <BaseButton onClick={() => setShowNoBackupModal(false)}>
              {t('modals.accept')}
            </BaseButton>
          </div>
        </BaseModal>

        <Confirmation
          isOpen={showOverwriteModal}
          title={t('step1.restore.button')}
          onCancel={() => setShowOverwriteModal(false)}
          onConfirm={confirmRestore}
          confirmText={t('modals.confirm')}
          cancelText={t('modals.cancel')}
        >
          <>
            <p className="text-gray-700 dark:text-gray-200">
              {t('step1.restore.overwriteConfirm')}
            </p>
            <p className="text-gray-700 dark:text-gray-200 text-center">
              {t('step1.restore.overwriteConfirm2')}
            </p>
          </>
        </Confirmation>

        <MultipleFilesModal
          isOpen={showMultipleFilesModal}
          files={multipleFiles}
          onConfirm={handleMultipleFilesConfirm}
          onCancel={handleMultipleFilesCancel}
        />

        <BaseModal
          visible={showOldDataModal}
          title={t('step1.oldDataModal.title')}
          onClose={handleCancelOldDataModal}
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {t('step1.oldDataModal.message')}
            </p>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <BaseIcon
                name="alert"
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
              />
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-semibold">
                {t('step1.oldDataModal.warning')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <BaseButton
                onClick={handleCancelOldDataModal}
                outlined
                size="large"
              >
                {t('modals.cancel')}
              </BaseButton>
              <BaseButton
                onClick={handleContinueUpload}
                variant="secondary"
                size="large"
              >
                {t('step1.oldDataModal.continue')}
              </BaseButton>
              <BaseButton
                onClick={handleResetAndUpload}
                variant="danger"
                size="large"
              >
                {t('step1.oldDataModal.reset')}
              </BaseButton>
            </div>
          </div>
        </BaseModal>
      </div>
    </div>
  );
};

export default Step1;
