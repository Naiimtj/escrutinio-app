import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  STORAGE_KEYS,
} from '../utils/localStorage';

/** Backup expires after 12 hours */
const BACKUP_EXPIRATION_MS = 12 * 60 * 60 * 1000;

const ACTIVE_KEYS = [
  STORAGE_KEYS.VOTER_LIST,
  STORAGE_KEYS.CONFIGURATION,
  STORAGE_KEYS.BALLOTS,
  STORAGE_KEYS.TIE_BREAKER,
];

const getActiveData = () => {
  const voters = getFromLocalStorage(STORAGE_KEYS.VOTER_LIST) || [];
  const configuration = getFromLocalStorage(STORAGE_KEYS.CONFIGURATION) || null;
  const ballots = getFromLocalStorage(STORAGE_KEYS.BALLOTS) || [];
  const tieBreaker = getFromLocalStorage(STORAGE_KEYS.TIE_BREAKER) || null;

  return {
    voters,
    configuration,
    ballots,
    tieBreaker,
  };
};

export const hasActiveScrutinyData = () => {
  const { voters, configuration, ballots } = getActiveData();
  return Boolean(voters.length || ballots.length || configuration);
};

export const backupAndClearScrutinyData = () => {
  const payload = {
    ...getActiveData(),
    backupAt: new Date().toISOString(),
  };

  saveToLocalStorage(STORAGE_KEYS.BACKUP, payload, BACKUP_EXPIRATION_MS);
  ACTIVE_KEYS.forEach((key) => removeFromLocalStorage(key));

  return payload;
};

export const getLastBackup = () => {
  return getFromLocalStorage(STORAGE_KEYS.BACKUP);
};

export const backupExists = () => {
  const backup = getLastBackup();
  return Boolean(
    backup &&
    (backup.configuration || backup.voters?.length || backup.ballots?.length),
  );
};

export const restoreLastBackup = () => {
  const backup = getLastBackup();
  if (!backup) {
    return false;
  }

  saveToLocalStorage(STORAGE_KEYS.VOTER_LIST, backup.voters || []);

  if (backup.configuration) {
    saveToLocalStorage(STORAGE_KEYS.CONFIGURATION, backup.configuration);
  } else {
    removeFromLocalStorage(STORAGE_KEYS.CONFIGURATION);
  }

  saveToLocalStorage(STORAGE_KEYS.BALLOTS, backup.ballots || []);

  if (backup.tieBreaker) {
    saveToLocalStorage(STORAGE_KEYS.TIE_BREAKER, backup.tieBreaker);
  } else {
    removeFromLocalStorage(STORAGE_KEYS.TIE_BREAKER);
  }

  return true;
};

export const clearBackup = () => {
  removeFromLocalStorage(STORAGE_KEYS.BACKUP);
};
