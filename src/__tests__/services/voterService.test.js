import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createVoter,
  createVoterList,
  getAllVoters,
  getVoterById,
  getVotersCount,
  updateVoter,
  deleteVoter,
  deleteAllVoters,
  voterListExists,
} from '../../service/voterService';
import { setupLocalStorageMock } from '../helpers/localStorageMock';

describe('voterService', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const VOTER_DATA = {
    name: 'Ana',
    lastName1: 'García',
    lastName2: 'López',
    location: 'Madrid',
  };

  describe('createVoter', () => {
    it('adds a voter and returns it with an id', () => {
      const voter = createVoter(VOTER_DATA);
      expect(voter.id).toBeDefined();
      expect(voter.name).toBe('Ana');
    });

    it('persists to the list', () => {
      createVoter(VOTER_DATA);
      expect(getAllVoters()).toHaveLength(1);
    });
  });

  describe('createVoterList', () => {
    it('replaces the full list', () => {
      createVoter(VOTER_DATA);
      createVoterList([
        { name: 'Luis', lastName1: 'Ruiz', lastName2: '', location: 'Sevilla' },
        {
          name: 'María',
          lastName1: 'Díaz',
          lastName2: 'Gil',
          location: 'Valencia',
        },
      ]);
      expect(getAllVoters()).toHaveLength(2);
    });
  });

  describe('getAllVoters', () => {
    it('returns empty array initially', () => {
      expect(getAllVoters()).toEqual([]);
    });
  });

  describe('getVoterById', () => {
    it('finds a voter by id', () => {
      const voter = createVoter(VOTER_DATA);
      expect(getVoterById(voter.id).name).toBe('Ana');
    });

    it('returns null for unknown id', () => {
      expect(getVoterById('nonexistent')).toBeNull();
    });
  });

  describe('getVotersCount', () => {
    it('returns 0 initially', () => {
      expect(getVotersCount()).toBe(0);
    });

    it('increments with each voter added', () => {
      createVoter(VOTER_DATA);
      createVoter({ ...VOTER_DATA, name: 'Luis' });
      expect(getVotersCount()).toBe(2);
    });
  });

  describe('updateVoter', () => {
    it('updates an existing voter', () => {
      const voter = createVoter(VOTER_DATA);
      updateVoter(voter.id, { location: 'Barcelona' });
      expect(getVoterById(voter.id).location).toBe('Barcelona');
    });
  });

  describe('deleteVoter', () => {
    it('removes one voter', () => {
      const voter = createVoter(VOTER_DATA);
      deleteVoter(voter.id);
      expect(getAllVoters()).toHaveLength(0);
    });
  });

  describe('deleteAllVoters', () => {
    it('clears the list', () => {
      createVoter(VOTER_DATA);
      createVoter(VOTER_DATA);
      deleteAllVoters();
      expect(getAllVoters()).toHaveLength(0);
    });
  });

  describe('voterListExists', () => {
    it('returns false when empty', () => {
      expect(voterListExists()).toBe(false);
    });

    it('returns true when list has voters', () => {
      createVoter(VOTER_DATA);
      expect(voterListExists()).toBe(true);
    });
  });
});
