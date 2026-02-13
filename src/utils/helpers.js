import { v4 as uuidv4 } from 'uuid';

/**
 * Creates an empty ballot with the specified number of votes
 */
export const createEmptyBallot = (numberOfVotes) =>
  Array.from({ length: numberOfVotes }, () => ({
    id: uuidv4(),
    person: null,
    isNull: false,
  }));

/**
 * Gets full name display for a person
 */
export const getPersonFullName = (person) => {
  if (!person) return '';
  if (person.isInvalid) return person.name;
  return `${person.name} ${person.lastName1} ${person.lastName2}`.trim();
};

/**
 * Filters voters by search term
 */
export const filterVotersByName = (voters, searchTerm, limit = 5) => {
  if (!searchTerm) return [];

  const term = searchTerm.toLowerCase();
  return voters
    .filter((voter) => getPersonFullName(voter).toLowerCase().includes(term))
    .slice(0, limit);
};

/**
 * Validates Excel file type
 */
export const isValidExcelFile = (file) => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  return validTypes.includes(file.type);
};

/**
 * Processes Excel row data into voter object
 * @param {Array} row - Array with 4 values [name, lastName1, lastName2, location]
 * @param {number} index - Row index
 */
export const processVoterRow = (row, index) => ({
  id: index + 1,
  name: String(row[0] || '').trim(),
  lastName1: String(row[1] || '').trim(),
  lastName2: String(row[2] || '').trim(),
  location: String(row[3] || '').trim(),
});

/**
 * Checks if voter row has valid data
 */
export const isValidVoter = (voter) => Boolean(voter.name || voter.lastName1);
