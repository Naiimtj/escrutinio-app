import { describe, it, expect } from 'vitest';
import {
  ELECTION_TYPES,
  getElectionTypeTranslationKey,
  getElectionTypeLabel,
} from '../../constants/electionTypes';

describe('ELECTION_TYPES', () => {
  it('has at least one entry', () => {
    expect(ELECTION_TYPES.length).toBeGreaterThan(0);
  });

  it('each entry has value and translationKey', () => {
    ELECTION_TYPES.forEach((type) => {
      expect(type).toHaveProperty('value');
      expect(type).toHaveProperty('translationKey');
    });
  });
});

describe('getElectionTypeTranslationKey', () => {
  it('returns the translation key for a known value', () => {
    const key = getElectionTypeTranslationKey('convencion_area');
    expect(key).toBe('step2.form.electionTypes.areaConvention');
  });

  it('returns null for an unknown value', () => {
    expect(getElectionTypeTranslationKey('unknown_type')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(getElectionTypeTranslationKey(undefined)).toBeNull();
  });
});

describe('getElectionTypeLabel', () => {
  it('calls t with the translation key', () => {
    const t = (key) => `translated:${key}`;
    const label = getElectionTypeLabel('convencion_area', t);
    expect(label).toBe('translated:step2.form.electionTypes.areaConvention');
  });

  it('returns the original value when not found', () => {
    const t = (key) => key;
    expect(getElectionTypeLabel('unknown', t)).toBe('unknown');
  });
});
