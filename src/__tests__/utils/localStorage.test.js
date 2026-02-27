import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  STORAGE_KEYS,
} from '../../utils/localStorage';

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
    clear: () => {
      store = {};
    },
  };
};

describe('localStorage utils', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = buildLocalStorageMock();
    vi.stubGlobal('localStorage', mockStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('saveToLocalStorage / getFromLocalStorage', () => {
    it('saves and retrieves data', () => {
      saveToLocalStorage('test-key', { value: 42 });
      expect(getFromLocalStorage('test-key')).toEqual({ value: 42 });
    });

    it('returns null for missing key', () => {
      expect(getFromLocalStorage('nonexistent')).toBeNull();
    });

    it('returns null for expired data', () => {
      saveToLocalStorage('expired-key', 'data', -1000);
      expect(getFromLocalStorage('expired-key')).toBeNull();
    });

    it('returns null when JSON is malformed', () => {
      mockStorage.setItem('bad-json', 'not-json');
      expect(getFromLocalStorage('bad-json')).toBeNull();
    });
  });

  describe('removeFromLocalStorage', () => {
    it('removes existing key', () => {
      saveToLocalStorage('remove-me', 'hello');
      removeFromLocalStorage('remove-me');
      expect(getFromLocalStorage('remove-me')).toBeNull();
    });

    it('does not throw when key does not exist', () => {
      expect(() => removeFromLocalStorage('ghost')).not.toThrow();
    });
  });

  describe('STORAGE_KEYS', () => {
    it('defines expected keys', () => {
      expect(STORAGE_KEYS.VOTER_LIST).toBe('voterList');
      expect(STORAGE_KEYS.CONFIGURATION).toBe('configuration');
      expect(STORAGE_KEYS.BALLOTS).toBe('ballots');
      expect(STORAGE_KEYS.BACKUP).toBe('backup');
    });
  });
});
