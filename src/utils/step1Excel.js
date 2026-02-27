import ExcelJS from 'exceljs';
import { processVoterRow, isValidVoter } from './helpers';

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

export const generateDemoVoterFile = async ({
  sheetName,
  fileName,
  headers,
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = [
    { header: headers.name, key: 'Nombre', width: 15 },
    { header: headers.lastName1, key: 'Primer apellido', width: 15 },
    { header: headers.lastName2, key: 'Segundo apellido', width: 15 },
    {
      header: headers.location,
      key: 'Localidad de residencia',
      width: 20,
    },
  ];

  worksheet.addRows(DEMO_DATA);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = globalThis.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  globalThis.URL.revokeObjectURL(url);
};

export const parseVotersExcelFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  const jsonData = [];

  const firstRow = worksheet.getRow(1);
  const columnCount = firstRow.cellCount;

  if (columnCount < 4) {
    throw new Error('STEP1_MIN_COLUMNS');
  }

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

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
