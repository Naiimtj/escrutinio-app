import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  STORAGE_KEYS,
} from '../utils/localStorage';
import { encryptPerson, decryptPerson } from '../utils/encryptionUtils';

// ---------------------------------------------------------------------------
// Encryption helpers for tiebreaker ballots
// ---------------------------------------------------------------------------

const encryptBallotData = (ballot) => ({
  ...ballot,
  votes: (ballot.votes || []).map((vote) => ({
    ...vote,
    person: vote.person ? encryptPerson(vote.person) : vote.person,
  })),
});

const decryptBallotData = (ballot) => ({
  ...ballot,
  votes: (ballot.votes || []).map((vote) => ({
    ...vote,
    person: vote.person ? decryptPerson(vote.person) : vote.person,
  })),
});

const encryptTiebreakerData = (data) => ({
  ...data,
  pendingBallots: (data.pendingBallots || []).map(encryptBallotData),
  rounds: (data.rounds || []).map((round) => ({
    ...round,
    ballots: (round.ballots || []).map(encryptBallotData),
  })),
});

const decryptTiebreakerData = (data) => ({
  ...data,
  pendingBallots: (data.pendingBallots || []).map(decryptBallotData),
  rounds: (data.rounds || []).map((round) => ({
    ...round,
    ballots: (round.ballots || []).map(decryptBallotData),
  })),
});

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/**
 * Save the full tiebreaker state to localStorage.
 *
 * Shape:
 * {
 *   confirmedDelegates: [{ name, position, byTiebreaker: false }],
 *   rounds: [
 *     {
 *       roundNumber: 1,
 *       tiedCandidates: ['Name 1', ...],
 *       winnersNeeded: 2,
 *       ballots: [...],          // encrypted on disk
 *       results: [{name, votes}],
 *       clearWinners: ['Name 1'],
 *       stillTied: ['Name 2', 'Name 3'],
 *       nextWinnersNeeded: 1,
 *       completed: true,
 *     }
 *   ],
 *   finalDelegates: [
 *     { name, position, byTiebreaker },
 *   ],
 *   completed: false,
 * }
 */
export const saveTiebreakerData = (data) => {
  saveToLocalStorage(STORAGE_KEYS.TIE_BREAKER, encryptTiebreakerData(data));
};

export const getTiebreakerData = () => {
  const raw = getFromLocalStorage(STORAGE_KEYS.TIE_BREAKER);
  if (!raw) return null;
  return decryptTiebreakerData(raw);
};

export const clearTiebreakerData = () => {
  removeFromLocalStorage(STORAGE_KEYS.TIE_BREAKER);
};

export const tiebreakerExists = () => {
  return getFromLocalStorage(STORAGE_KEYS.TIE_BREAKER) !== null;
};

// ---------------------------------------------------------------------------
// Business logic helpers (pure, no side-effects)
// ---------------------------------------------------------------------------

/**
 * Given a sorted-descending results array and how many winners are needed,
 * compute the outcome of one tiebreaker round.
 *
 * @param {Array<{name: string, votes: number}>} sortedResults
 * @param {number} winnersNeeded
 * @returns {{ clearWinners: string[], stillTied: string[], nextWinnersNeeded: number, isResolved: boolean }}
 */
export const computeTiebreakerRoundOutcome = (sortedResults, winnersNeeded) => {
  if (sortedResults.length === 0) {
    return {
      clearWinners: [],
      stillTied: [],
      nextWinnersNeeded: 0,
      isResolved: true,
    };
  }

  // If everyone participates and there are not more candidates than spots
  if (sortedResults.length <= winnersNeeded) {
    return {
      clearWinners: sortedResults.map((r) => r.name),
      stillTied: [],
      nextWinnersNeeded: 0,
      isResolved: true,
    };
  }

  const cutoffVotes = sortedResults[winnersNeeded - 1].votes;
  const hasBottomTie =
    winnersNeeded < sortedResults.length &&
    sortedResults[winnersNeeded].votes === cutoffVotes;

  if (!hasBottomTie) {
    // Clear resolution: the top `winnersNeeded` candidates are distinct
    return {
      clearWinners: sortedResults.slice(0, winnersNeeded).map((r) => r.name),
      stillTied: [],
      nextWinnersNeeded: 0,
      isResolved: true,
    };
  }

  // There is still a tie at the boundary
  const clearWinners = sortedResults
    .filter((r, i) => i < winnersNeeded && r.votes > cutoffVotes)
    .map((r) => r.name);

  const stillTied = sortedResults
    .filter((r) => r.votes === cutoffVotes)
    .map((r) => r.name);

  const nextWinnersNeeded = winnersNeeded - clearWinners.length;

  return {
    clearWinners,
    stillTied,
    nextWinnersNeeded,
    isResolved: false,
  };
};

/**
 * From main voting results, extract the info needed to start the tiebreaker.
 *
 * @param {Array<{name, votes}>} sortedResults   – full sorted results from main vote
 * @param {number} delegates                     – total desired delegates
 * @returns {{ confirmedDelegates, tiedCandidates, winnersNeeded }}
 */
export const extractInitialTiebreakerInfo = (sortedResults, delegates) => {
  if (sortedResults.length === 0 || delegates === 0) {
    return { confirmedDelegates: [], tiedCandidates: [], winnersNeeded: 0 };
  }

  const cutoffVotes = sortedResults[delegates - 1]?.votes ?? 0;

  const confirmedDelegates = sortedResults
    .filter((r, i) => i < delegates && r.votes > cutoffVotes)
    .map((r, i) => ({ name: r.name, position: i + 1, byTiebreaker: false }));

  const tiedCandidates = sortedResults
    .filter((r) => r.votes === cutoffVotes)
    .map((r) => r.name);

  const winnersNeeded = delegates - confirmedDelegates.length;

  return { confirmedDelegates, tiedCandidates, winnersNeeded };
};
