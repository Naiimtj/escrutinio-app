import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  STORAGE_KEYS,
} from '../utils/localStorage';
import { encryptPerson, decryptPerson } from '../utils/encryptionUtils';

const saveEncryptedVoters = (voters) =>
  saveToLocalStorage(STORAGE_KEYS.VOTER_LIST, voters.map(encryptPerson));

const loadDecryptedVoters = () =>
  (getFromLocalStorage(STORAGE_KEYS.VOTER_LIST) || []).map(decryptPerson);

export const createVoter = (voter) => {
  const voterList = loadDecryptedVoters();
  const newVoter = {
    id: crypto.randomUUID(),
    name: voter.name,
    lastName1: voter.lastName1,
    lastName2: voter.lastName2,
    location: voter.location,
  };
  saveEncryptedVoters([...voterList, newVoter]);
  return newVoter;
};

export const createVoterList = (voterList) => {
  const voters = voterList.map((voter) => ({
    id: crypto.randomUUID(),
    name: voter.name,
    lastName1: voter.lastName1,
    lastName2: voter.lastName2,
    location: voter.location,
  }));
  saveEncryptedVoters(voters);
  return voters;
};

export const getAllVoters = () => loadDecryptedVoters();

export const getVoterById = (id) => {
  const voterList = loadDecryptedVoters();
  return voterList.find((voter) => voter.id === id) || null;
};

export const getVotersCount = () => {
  const raw = getFromLocalStorage(STORAGE_KEYS.VOTER_LIST) || [];
  return raw.length;
};

export const updateVoter = (id, updatedData) => {
  const voterList = loadDecryptedVoters();
  const updatedList = voterList.map((voter) =>
    voter.id === id ? { ...voter, ...updatedData } : voter,
  );
  saveEncryptedVoters(updatedList);
  return updatedList.find((voter) => voter.id === id);
};

export const deleteVoter = (id) => {
  const voterList = loadDecryptedVoters();
  const updatedList = voterList.filter((voter) => voter.id !== id);
  saveEncryptedVoters(updatedList);
  return true;
};

export const deleteAllVoters = () => {
  removeFromLocalStorage(STORAGE_KEYS.VOTER_LIST);
  return true;
};

export const voterListExists = () => {
  const voterList = getFromLocalStorage(STORAGE_KEYS.VOTER_LIST);
  return voterList !== null && voterList.length > 0;
};
