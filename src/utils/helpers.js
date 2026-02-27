import { v4 as uuidv4 } from 'uuid';

export const createEmptyBallot = (numberOfVotes) =>
  Array.from({ length: numberOfVotes }, () => ({
    id: uuidv4(),
    person: null,
    isNull: false,
  }));

export const getPersonFullName = (person) => {
  if (!person) return '';
  if (person.isInvalid) return person.name;
  return `${person.name} ${person.lastName1} ${person.lastName2}`.trim();
};

export const normalizeText = (text) => {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export const filterVotersByName = (voters, searchTerm, limit = null) => {
  if (!searchTerm) return [];

  const normalizedTerm = normalizeText(searchTerm);

  const matchingVoters = voters.filter((voter) =>
    normalizeText(getPersonFullName(voter)).includes(normalizedTerm),
  );

  const sortedVoters = matchingVoters.sort((a, b) => {
    const nameA = normalizeText(getPersonFullName(a));
    const nameB = normalizeText(getPersonFullName(b));
    const startsWithA = nameA.startsWith(normalizedTerm);
    const startsWithB = nameB.startsWith(normalizedTerm);

    if (startsWithA && !startsWithB) return -1;
    if (!startsWithA && startsWithB) return 1;

    return nameA.localeCompare(nameB);
  });

  return limit ? sortedVoters.slice(0, limit) : sortedVoters;
};

export const isValidExcelFile = (file) => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  return validTypes.includes(file.type);
};

export const processVoterRow = (row, index) => ({
  id: index + 1,
  name: String(row[0] || '').trim(),
  lastName1: String(row[1] || '').trim(),
  lastName2: String(row[2] || '').trim(),
  location: String(row[3] || '').trim(),
});

export const isValidVoter = (voter) => Boolean(voter.name || voter.lastName1);
