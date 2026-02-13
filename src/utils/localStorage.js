const EXPIRATION_DAYS = 2;

/**
 * Save data to localStorage with expiration
 */
export const saveToLocalStorage = (key, data) => {
  const now = new Date();
  const expirationDate = new Date(
    now.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
  );

  const item = {
    data,
    expiration: expirationDate.toISOString(),
  };

  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get data from localStorage and check if it's expired
 */
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

/**
 * Remove data from localStorage
 */
export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

/**
 * Clear all application data from localStorage
 */
export const clearAllData = () => {
  const keys = ['voterList', 'configuration', 'ballots'];
  keys.forEach((key) => localStorage.removeItem(key));
};

// Storage keys
export const STORAGE_KEYS = {
  VOTER_LIST: 'voterList',
  CONFIGURATION: 'configuration',
  BALLOTS: 'ballots',
};
