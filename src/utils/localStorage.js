const EXPIRATION_DAYS = 2;
const DEFAULT_EXPIRATION_MS = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

export const saveToLocalStorage = (
  key,
  data,
  expirationMs = DEFAULT_EXPIRATION_MS,
) => {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + expirationMs);

  const item = {
    data,
    expiration: expirationDate.toISOString(),
  };

  localStorage.setItem(key, JSON.stringify(item));
};

export const getFromLocalStorage = (key) => {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    const expirationDate = new Date(item.expiration);

    // Check if expired
    if (now > expirationDate) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

/**
 * Removes all known storage keys that have already expired.
 * Call this once on app startup to proactively clean up stale data.
 */
export const cleanupExpiredData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    // getFromLocalStorage already removes the item if expired
    getFromLocalStorage(key);
  });
};

export const STORAGE_KEYS = {
  VOTER_LIST: 'voterList',
  CONFIGURATION: 'configuration',
  BALLOTS: 'ballots',
  BACKUP: 'backup',
  TIE_BREAKER: 'tieBreaker',
};
