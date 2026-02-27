import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createBallot,
  getAllBallots,
  getBallotById,
  getBallotByNumber,
  getBallotsCount,
  getNextBallotNumber,
  getValidBallots,
  getNullBallots,
  updateBallot,
  deleteBallot,
  deleteAllBallots,
  replaceAllBallots,
  ballotsExist,
} from '../../service/ballotService';
import { setupLocalStorageMock } from '../helpers/localStorageMock';

const PERSON = {
  id: 'p1',
  name: 'Ana',
  lastName1: 'García',
  lastName2: 'López',
  location: 'Madrid',
};

const makeBallot = (number = 1, isNull = false) => ({
  number,
  isNull,
  votes: isNull ? [] : [{ id: 'v1', person: PERSON, isNull: false }],
});

describe('ballotService', () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('createBallot / getAllBallots', () => {
    it('creates a ballot and retrieves it', () => {
      createBallot(makeBallot(1));
      const ballots = getAllBallots();
      expect(ballots).toHaveLength(1);
    });

    it('returns empty array initially', () => {
      expect(getAllBallots()).toEqual([]);
    });

    it('assigns an id when none provided', () => {
      const ballot = createBallot(makeBallot(1));
      expect(ballot.id).toBeDefined();
    });

    it('preserves provided id', () => {
      const ballot = createBallot({ ...makeBallot(1), id: 'custom-id' });
      expect(ballot.id).toBe('custom-id');
    });
  });

  describe('getBallotById', () => {
    it('finds a ballot by id', () => {
      const ballot = createBallot(makeBallot(1));
      expect(getBallotById(ballot.id)).not.toBeNull();
    });

    it('returns null for unknown id', () => {
      expect(getBallotById('missing')).toBeNull();
    });
  });

  describe('getBallotByNumber', () => {
    it('finds by number', () => {
      createBallot(makeBallot(5));
      expect(getBallotByNumber(5)).not.toBeNull();
    });

    it('returns null for unknown number', () => {
      expect(getBallotByNumber(99)).toBeNull();
    });
  });

  describe('getBallotsCount / getNextBallotNumber', () => {
    it('returns 0 initially', () => {
      expect(getBallotsCount()).toBe(0);
    });

    it('next ballot number is count + 1', () => {
      createBallot(makeBallot(1));
      createBallot(makeBallot(2));
      expect(getNextBallotNumber()).toBe(3);
    });
  });

  describe('getValidBallots / getNullBallots', () => {
    it('separates valid and null ballots', () => {
      createBallot(makeBallot(1, false));
      createBallot(makeBallot(2, true));
      createBallot(makeBallot(3, false));

      expect(getValidBallots()).toHaveLength(2);
      expect(getNullBallots()).toHaveLength(1);
    });
  });

  describe('updateBallot', () => {
    it('updates an existing ballot', () => {
      const ballot = createBallot(makeBallot(1));
      updateBallot(ballot.id, { isNull: true });
      expect(getBallotById(ballot.id).isNull).toBe(true);
    });
  });

  describe('deleteBallot', () => {
    it('removes a ballot by id', () => {
      const ballot = createBallot(makeBallot(1));
      deleteBallot(ballot.id);
      expect(getAllBallots()).toHaveLength(0);
    });
  });

  describe('deleteAllBallots', () => {
    it('clears all ballots', () => {
      createBallot(makeBallot(1));
      createBallot(makeBallot(2));
      deleteAllBallots();
      expect(getAllBallots()).toHaveLength(0);
    });
  });

  describe('replaceAllBallots', () => {
    it('replaces the ballot list entirely', () => {
      createBallot(makeBallot(1));
      const newBallots = [
        { ...makeBallot(1), id: 'id-a' },
        { ...makeBallot(2), id: 'id-b' },
        { ...makeBallot(3), id: 'id-c' },
      ];
      replaceAllBallots(newBallots);
      expect(getAllBallots()).toHaveLength(3);
    });
  });

  describe('ballotsExist', () => {
    it('returns false initially', () => {
      expect(ballotsExist()).toBe(false);
    });

    it('returns true after creating a ballot', () => {
      createBallot(makeBallot(1));
      expect(ballotsExist()).toBe(true);
    });
  });
});
