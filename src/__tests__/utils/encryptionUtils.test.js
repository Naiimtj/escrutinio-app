import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  encryptString,
  decryptString,
  encryptPerson,
  decryptPerson,
} from '../../utils/encryptionUtils';

const buildLocalStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
};

describe('encryptionUtils', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', buildLocalStorageMock());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('encryptString / decryptString', () => {
    it('round-trips a plain string', () => {
      const original = 'García López';
      const encrypted = encryptString(original);
      expect(encrypted).not.toBe(original);
      expect(decryptString(encrypted)).toBe(original);
    });

    it('returns null unchanged', () => {
      expect(encryptString(null)).toBeNull();
      expect(decryptString(null)).toBeNull();
    });

    it('encrypted value starts with _enc: prefix', () => {
      expect(encryptString('test')).toMatch(/^_enc:/);
    });

    it('decrypts legacy plaintext (no prefix) as-is', () => {
      expect(decryptString('plaintext')).toBe('plaintext');
    });

    it('round-trips an empty string', () => {
      expect(decryptString(encryptString(''))).toBe('');
    });
  });

  describe('encryptPerson / decryptPerson', () => {
    const person = {
      id: 'abc-123',
      name: 'Ana',
      lastName1: 'Martín',
      lastName2: 'Pérez',
      location: 'Sevilla',
    };

    it('encrypts sensitive fields', () => {
      const encrypted = encryptPerson(person);
      expect(encrypted.name).not.toBe(person.name);
      expect(encrypted.lastName1).not.toBe(person.lastName1);
      expect(encrypted.id).toBe(person.id);
    });

    it('round-trips person object', () => {
      const result = decryptPerson(encryptPerson(person));
      expect(result.name).toBe(person.name);
      expect(result.lastName1).toBe(person.lastName1);
      expect(result.lastName2).toBe(person.lastName2);
      expect(result.location).toBe(person.location);
    });

    it('returns null for null input', () => {
      expect(encryptPerson(null)).toBeNull();
      expect(decryptPerson(null)).toBeNull();
    });

    it('preserves non-sensitive fields', () => {
      const encrypted = encryptPerson(person);
      expect(encrypted.id).toBe('abc-123');
    });
  });
});
