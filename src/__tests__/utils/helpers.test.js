import { describe, it, expect } from 'vitest';
import {
  createEmptyBallot,
  filterVotersByName,
  getPersonFullName,
  isValidExcelFile,
  isValidVoter,
  normalizeText,
  processVoterRow,
} from '../../utils/helpers';

const VOTERS = [
  {
    id: '1',
    name: 'Ana',
    lastName1: 'García',
    lastName2: 'López',
    location: 'Madrid',
  },
  {
    id: '2',
    name: 'Luis',
    lastName1: 'Pérez',
    lastName2: 'Ruiz',
    location: 'Sevilla',
  },
  {
    id: '3',
    name: 'María',
    lastName1: 'Sánchez',
    lastName2: 'Díaz',
    location: 'Valencia',
  },
];

describe('createEmptyBallot', () => {
  it('creates the correct number of vote slots', () => {
    const ballot = createEmptyBallot(3);
    expect(ballot).toHaveLength(3);
  });

  it('each slot has person=null and isNull=false', () => {
    const [slot] = createEmptyBallot(1);
    expect(slot.person).toBeNull();
    expect(slot.isNull).toBe(false);
  });

  it('each slot has a unique id', () => {
    const ballot = createEmptyBallot(5);
    const ids = ballot.map((s) => s.id);
    expect(new Set(ids).size).toBe(5);
  });

  it('returns empty array for 0', () => {
    expect(createEmptyBallot(0)).toEqual([]);
  });
});

describe('getPersonFullName', () => {
  it('returns full name joined', () => {
    const person = { name: 'Ana', lastName1: 'García', lastName2: 'López' };
    expect(getPersonFullName(person)).toBe('Ana García López');
  });

  it('returns person.name when isInvalid', () => {
    const person = { name: 'Voto nulo', isInvalid: true };
    expect(getPersonFullName(person)).toBe('Voto nulo');
  });

  it('returns empty string for null', () => {
    expect(getPersonFullName(null)).toBe('');
  });

  it('trims extra spaces if lastName2 is empty', () => {
    const person = { name: 'Luis', lastName1: 'Ruiz', lastName2: '' };
    expect(getPersonFullName(person)).toBe('Luis Ruiz');
  });
});

describe('normalizeText', () => {
  it('lowercases text', () => {
    expect(normalizeText('HOLA')).toBe('hola');
  });

  it('removes accents', () => {
    expect(normalizeText('García')).toBe('garcia');
    expect(normalizeText('Pérez')).toBe('perez');
  });

  it('returns empty string for falsy input', () => {
    expect(normalizeText('')).toBe('');
    expect(normalizeText(null)).toBe('');
  });
});

describe('filterVotersByName', () => {
  it('returns empty array for empty search term', () => {
    expect(filterVotersByName(VOTERS, '')).toEqual([]);
  });

  it('matches by first name', () => {
    const result = filterVotersByName(VOTERS, 'ana');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Ana');
  });

  it('matches ignoring accents', () => {
    const result = filterVotersByName(VOTERS, 'garcia');
    expect(result).toHaveLength(1);
    expect(result[0].lastName1).toBe('García');
  });

  it('respects limit parameter', () => {
    const result = filterVotersByName(VOTERS, 'a', 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('returns empty for no matches', () => {
    expect(filterVotersByName(VOTERS, 'zzznomatch')).toEqual([]);
  });
});

describe('isValidExcelFile', () => {
  it('accepts .xlsx MIME type', () => {
    const file = {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    expect(isValidExcelFile(file)).toBe(true);
  });

  it('accepts .xls MIME type', () => {
    const file = { type: 'application/vnd.ms-excel' };
    expect(isValidExcelFile(file)).toBe(true);
  });

  it('rejects PDF', () => {
    const file = { type: 'application/pdf' };
    expect(isValidExcelFile(file)).toBe(false);
  });

  it('rejects plain text', () => {
    const file = { type: 'text/plain' };
    expect(isValidExcelFile(file)).toBe(false);
  });
});

describe('processVoterRow', () => {
  it('maps row array to voter object', () => {
    const row = ['Juan', 'García', 'López', 'Madrid'];
    const voter = processVoterRow(row, 0);
    expect(voter).toEqual({
      id: 1,
      name: 'Juan',
      lastName1: 'García',
      lastName2: 'López',
      location: 'Madrid',
    });
  });

  it('trims whitespace from values', () => {
    const row = ['  Ana  ', ' Ruiz ', ' ', 'Sevilla'];
    const voter = processVoterRow(row, 2);
    expect(voter.name).toBe('Ana');
    expect(voter.lastName1).toBe('Ruiz');
  });

  it('id is row index + 1', () => {
    const voter = processVoterRow(['a', 'b', 'c', 'd'], 4);
    expect(voter.id).toBe(5);
  });

  it('handles empty cells as empty strings', () => {
    const voter = processVoterRow([null, undefined, '', 'City'], 0);
    expect(voter.name).toBe('');
    expect(voter.lastName1).toBe('');
  });
});

describe('isValidVoter', () => {
  it('valid when has name', () => {
    expect(isValidVoter({ name: 'Ana', lastName1: '' })).toBe(true);
  });

  it('valid when has lastName1', () => {
    expect(isValidVoter({ name: '', lastName1: 'García' })).toBe(true);
  });

  it('invalid when both are empty', () => {
    expect(isValidVoter({ name: '', lastName1: '' })).toBe(false);
  });
});
