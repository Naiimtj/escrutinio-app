import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExcelJS from 'exceljs';
import {
  getFromLocalStorage,
  saveToLocalStorage,
  STORAGE_KEYS,
} from '../utils/localStorage';
import {
  isValidExcelFile,
  processVoterRow,
  isValidVoter,
} from '../utils/helpers';
import { buttonStyles } from '../utils/styles';
import { BaseButton, BaseIcon } from './base';

const DEMO_DATA = [
  {
    Nombre: 'Juan',
    'Primer apellido': 'García',
    'Segundo apellido': 'López',
    'Localidad de residencia': 'Madrid',
  },
  {
    Nombre: 'María',
    'Primer apellido': 'Rodríguez',
    'Segundo apellido': 'Martínez',
    'Localidad de residencia': 'Barcelona',
  },
  {
    Nombre: 'Pedro',
    'Primer apellido': 'Sánchez',
    'Segundo apellido': 'Fernández',
    'Localidad de residencia': 'Valencia',
  },
  {
    Nombre: 'Ana',
    'Primer apellido': 'Martín',
    'Segundo apellido': 'Pérez',
    'Localidad de residencia': 'Sevilla',
  },
  {
    Nombre: 'Luis',
    'Primer apellido': 'González',
    'Segundo apellido': 'Ruiz',
    'Localidad de residencia': 'Zaragoza',
  },
];

const Step1 = ({ onNext }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [totalPeople, setTotalPeople] = useState(0);
  const [error, setError] = useState('');
  const [showPasswordInstructions, setShowPasswordInstructions] =
    useState(false);

  const generateDemoFile = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Votantes');

    // Add headers
    worksheet.columns = [
      { header: 'Nombre', key: 'Nombre', width: 15 },
      { header: 'Primer apellido', key: 'Primer apellido', width: 15 },
      { header: 'Segundo apellido', key: 'Segundo apellido', width: 15 },
      {
        header: 'Localidad de residencia',
        key: 'Localidad de residencia',
        width: 20,
      },
    ];

    // Add rows
    worksheet.addRows(DEMO_DATA);

    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = globalThis.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ejemplo_lista_votantes.xlsx';
    link.click();
    globalThis.URL.revokeObjectURL(url);
  };

  const processExcelFile = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();

    // Load workbook
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    const jsonData = [];

    // Validate that the worksheet has at least 4 columns
    const firstRow = worksheet.getRow(1);
    const columnCount = firstRow.cellCount;

    if (columnCount < 4) {
      throw new Error('El archivo debe tener al menos 4 columnas');
    }

    // Process rows (skip header row)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      // Extract only the first 4 columns
      const rowData = [
        row.getCell(1).value || '',
        row.getCell(2).value || '',
        row.getCell(3).value || '',
        row.getCell(4).value || '',
      ];
      jsonData.push(rowData);
    });

    return jsonData
      .map((row, idx) => processVoterRow(row, idx))
      .filter(isValidVoter);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!isValidExcelFile(file)) {
      setError(t('step1.errors.invalidFile'));
      return;
    }

    setUploading(true);
    setError('');

    try {
      const voterList = await processExcelFile(file);
      saveToLocalStorage(STORAGE_KEYS.VOTER_LIST, voterList);

      setTotalPeople(voterList.length);
      setUploadSuccess(true);
      setUploading(false);

      setTimeout(() => onNext(), 2000);
    } catch (err) {
      console.error('Error processing file:', err);

      // Check if error is due to password protection
      const errorMessage = err.message || '';
      if (
        errorMessage.includes('central directory') ||
        errorMessage.includes('zip file') ||
        errorMessage.includes('encrypted') ||
        errorMessage.includes('password')
      ) {
        // File is likely password protected
        setShowPasswordInstructions(true);
        setError(t('step1.errors.passwordProtected'));
      } else {
        setError(t('step1.errors.processing'));
      }

      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleCloseInstructions = () => {
    setShowPasswordInstructions(false);
    setError('');
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
              {t('navigation.next')}...
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
                      variant='secondary'
                    >
                      {t('step1.tryAgain')}
                    </BaseButton>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`${buttonStyles.primary} ${uploading ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer'}`}
                  >
                    <BaseIcon name="upload" className="w-5 h-5 mr-2" />
                    {uploading ? `${t('step1.upload')}...` : t('step1.upload')}
                  </label>
                  {error && !showPasswordInstructions && (
                    <div className="mt-4 text-red-600 text-sm">{error}</div>
                  )}
                </div>

                <div className="text-center">
                  <BaseButton onClick={generateDemoFile} size="small" outlined>
                    {t('step1.download')}
                  </BaseButton>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600  mb-2">
                    {t('step1.columns.required')}
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>{t('step1.columns.name')}</li>
                    <li>{t('step1.columns.lastName1')}</li>
                    <li>{t('step1.columns.lastName2')}</li>
                    <li>{t('step1.columns.location')}</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
        {!uploadSuccess && getFromLocalStorage('voterList') && (
          <div className="flex flex-col items-center justify-end pt-4 gap-2">
            <p className="text-white ">{t('step1.haveList')}</p>
            <BaseButton variant="primary" size="large" onClick={onNext}>
              {t('navigation.next')}
            </BaseButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1;
