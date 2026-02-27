import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveConfiguration,
  getConfiguration,
  configurationExists,
  deleteConfiguration,
  updateConfigurationField,
  updateConfigurationFields,
} from '../../service/configurationService';
import { setupLocalStorageMock } from '../helpers/localStorageMock';

const BASE_CONFIG = {
  electoral_area: 'Zona Norte',
  election_date: '2026-03-15',
  election_type: 'convencion_area',
  total_ballots: 50,
  ballots_person: 40,
  ballots_postal: 10,
  delegates: 5,
  total_voters_posible: 250,
  scrutineers: 2,
  scrutineersNames: ['Pedro Gómez', 'Laura Torres'],
};

describe('configurationService', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('saveConfiguration / getConfiguration', () => {
    it('persists and retrieves configuration', () => {
      saveConfiguration(BASE_CONFIG);
      const config = getConfiguration();
      expect(config.electoral_area).toBe('Zona Norte');
      expect(config.delegates).toBe(5);
    });

    it('adds createdAt and updatedAt timestamps', () => {
      saveConfiguration(BASE_CONFIG);
      const config = getConfiguration();
      expect(config.createdAt).toBeDefined();
      expect(config.updatedAt).toBeDefined();
    });

    it('returns null when no config saved', () => {
      expect(getConfiguration()).toBeNull();
    });
  });

  describe('configurationExists', () => {
    it('returns false when no config', () => {
      expect(configurationExists()).toBe(false);
    });

    it('returns true after saving', () => {
      saveConfiguration(BASE_CONFIG);
      expect(configurationExists()).toBe(true);
    });
  });

  describe('deleteConfiguration', () => {
    it('removes the configuration', () => {
      saveConfiguration(BASE_CONFIG);
      deleteConfiguration();
      expect(getConfiguration()).toBeNull();
    });
  });

  describe('updateConfigurationField', () => {
    it('updates a single field', () => {
      saveConfiguration(BASE_CONFIG);
      updateConfigurationField('electoral_area', 'Zona Sur');
      expect(getConfiguration().electoral_area).toBe('Zona Sur');
    });

    it('returns null when no config exists', () => {
      expect(updateConfigurationField('delegates', 3)).toBeNull();
    });
  });

  describe('updateConfigurationFields', () => {
    it('updates multiple fields at once', () => {
      saveConfiguration(BASE_CONFIG);
      updateConfigurationFields({ delegates: 7, scrutineers: 3 });
      const config = getConfiguration();
      expect(config.delegates).toBe(7);
      expect(config.scrutineers).toBe(3);
    });

    it('preserves unchanged fields', () => {
      saveConfiguration(BASE_CONFIG);
      updateConfigurationFields({ delegates: 7 });
      expect(getConfiguration().electoral_area).toBe('Zona Norte');
    });
  });
});
