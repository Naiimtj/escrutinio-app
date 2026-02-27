import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  backupAndClearScrutinyData,
  restoreLastBackup,
  backupExists,
  hasActiveScrutinyData,
  getLastBackup,
  clearBackup,
} from '../../service/backupService';
import { createVoter } from '../../service/voterService';
import { saveConfiguration } from '../../service/configurationService';
import { createBallot } from '../../service/ballotService';
import { setupLocalStorageMock } from '../helpers/localStorageMock';

const BASE_CONFIG = {
  electoral_area: 'Zona Centro',
  election_date: '2026-05-10',
  election_type: 'eleccion_ael',
  total_ballots: 20,
  ballots_person: 15,
  ballots_postal: 5,
  delegates: 3,
  total_voters_posible: 60,
  scrutineers: 1,
  scrutineersNames: ['Carlos Ruiz'],
};

const PERSON = {
  id: 'p1',
  name: 'María',
  lastName1: 'Torres',
  lastName2: 'Gil',
  location: 'Bilbao',
};

describe('backupService', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('hasActiveScrutinyData', () => {
    it('returns false when storage is empty', () => {
      expect(hasActiveScrutinyData()).toBe(false);
    });

    it('returns true when there are voters', () => {
      createVoter(PERSON);
      expect(hasActiveScrutinyData()).toBe(true);
    });

    it('returns true when there is a configuration', () => {
      saveConfiguration(BASE_CONFIG);
      expect(hasActiveScrutinyData()).toBe(true);
    });
  });

  describe('backupAndClearScrutinyData', () => {
    it('stores a backup and clears active data', () => {
      createVoter(PERSON);
      saveConfiguration(BASE_CONFIG);

      backupAndClearScrutinyData();

      expect(hasActiveScrutinyData()).toBe(false);
      expect(backupExists()).toBe(true);
    });

    it('backup contains voters and configuration', () => {
      createVoter(PERSON);
      saveConfiguration(BASE_CONFIG);
      backupAndClearScrutinyData();

      const backup = getLastBackup();
      expect(backup.voters).toHaveLength(1);
      expect(backup.configuration.electoral_area).toBe('Zona Centro');
    });
  });

  describe('restoreLastBackup', () => {
    it('returns false when no backup exists', () => {
      expect(restoreLastBackup()).toBe(false);
    });

    it('restores voters and configuration', () => {
      createVoter(PERSON);
      saveConfiguration(BASE_CONFIG);
      backupAndClearScrutinyData();

      const restored = restoreLastBackup();

      expect(restored).toBe(true);
      expect(hasActiveScrutinyData()).toBe(true);
    });
  });

  describe('backupExists', () => {
    it('returns false before any backup', () => {
      expect(backupExists()).toBe(false);
    });

    it('returns true after backup is created', () => {
      createVoter(PERSON);
      backupAndClearScrutinyData();
      expect(backupExists()).toBe(true);
    });
  });

  describe('clearBackup', () => {
    it('removes the backup', () => {
      createVoter(PERSON);
      backupAndClearScrutinyData();
      clearBackup();
      expect(backupExists()).toBe(false);
    });
  });

  describe('getLastBackup', () => {
    it('returns null when no backup', () => {
      expect(getLastBackup()).toBeNull();
    });

    it('returns backup data after creation', () => {
      createBallot({ number: 1, votes: [], isNull: true });
      backupAndClearScrutinyData();

      const backup = getLastBackup();
      expect(backup).not.toBeNull();
      expect(backup.backupAt).toBeDefined();
    });
  });
});
