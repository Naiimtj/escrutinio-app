import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  STORAGE_KEYS,
} from '../utils/localStorage';
import { encryptPerson, decryptPerson } from '../utils/encryptionUtils';

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

const saveEncryptedBallots = (ballots) =>
  saveToLocalStorage(STORAGE_KEYS.BALLOTS, ballots.map(encryptBallotData));

const loadDecryptedBallots = () =>
  (getFromLocalStorage(STORAGE_KEYS.BALLOTS) || []).map(decryptBallotData);

export const createBallot = (ballotData) => {
  const ballots = loadDecryptedBallots();
  const newBallot = {
    id: ballotData.id || crypto.randomUUID(),
    number: ballotData.number,
    votes: ballotData.votes || [],
    isNull: ballotData.isNull || false,
    timestamp: new Date().toISOString(),
  };
  saveEncryptedBallots([...ballots, newBallot]);
  return newBallot;
};

export const getAllBallots = () => loadDecryptedBallots();

export const getBallotById = (id) => {
  const ballots = loadDecryptedBallots();
  return ballots.find((ballot) => ballot.id === id) || null;
};

export const getBallotByNumber = (number) => {
  const ballots = loadDecryptedBallots();
  return ballots.find((ballot) => ballot.number === number) || null;
};

export const getBallotsCount = () => {
  const raw = getFromLocalStorage(STORAGE_KEYS.BALLOTS) || [];
  return raw.length;
};

export const getNextBallotNumber = () => {
  const raw = getFromLocalStorage(STORAGE_KEYS.BALLOTS) || [];
  return raw.length + 1;
};

export const getValidBallots = () =>
  loadDecryptedBallots().filter((b) => !b.isNull);

export const getNullBallots = () =>
  loadDecryptedBallots().filter((b) => b.isNull);

export const updateBallot = (id, updatedData) => {
  const ballots = loadDecryptedBallots();
  const updatedBallots = ballots.map((ballot) =>
    ballot.id === id
      ? { ...ballot, ...updatedData, timestamp: new Date().toISOString() }
      : ballot,
  );
  saveEncryptedBallots(updatedBallots);
  return updatedBallots.find((ballot) => ballot.id === id);
};

export const updateBallotByIndex = (index, updatedData) => {
  const ballots = loadDecryptedBallots();
  if (index < 0 || index >= ballots.length) return null;

  const updatedBallots = ballots.map((ballot, i) =>
    i === index
      ? { ...ballot, ...updatedData, timestamp: new Date().toISOString() }
      : ballot,
  );
  saveEncryptedBallots(updatedBallots);
  return updatedBallots[index];
};

export const deleteBallot = (id) => {
  const ballots = loadDecryptedBallots();
  const updatedBallots = ballots.filter((ballot) => ballot.id !== id);
  saveEncryptedBallots(updatedBallots);
  return true;
};

export const deleteBallotByIndex = (index) => {
  const ballots = loadDecryptedBallots();
  if (index < 0 || index >= ballots.length) return false;

  const updatedBallots = ballots.filter((_, i) => i !== index);
  saveEncryptedBallots(updatedBallots);
  return true;
};

export const deleteAllBallots = () => {
  removeFromLocalStorage(STORAGE_KEYS.BALLOTS);
  return true;
};

export const replaceAllBallots = (newBallots) => {
  saveEncryptedBallots(newBallots);
  return newBallots;
};

export const ballotsExist = () => {
  const ballots = getFromLocalStorage(STORAGE_KEYS.BALLOTS);
  return ballots !== null && ballots.length > 0;
};
