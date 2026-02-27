import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  STORAGE_KEYS,
} from '../utils/localStorage';

export const saveConfiguration = (configData) => {
  const existingConfiguration = getConfiguration();
  const configuration = {
    electoral_area: configData.electoral_area,
    election_date: configData.election_date,
    election_type: configData.election_type || '',
    total_ballots: configData.total_ballots,
    ballots_person: configData.ballots_person,
    ballots_postal: configData.ballots_postal,
    delegates: configData.delegates,
    total_voters_posible: configData.total_voters_posible,
    scrutineers: configData.scrutineers,
    scrutineersNames: configData.scrutineersNames || [],
    comments: configData.comments ?? existingConfiguration?.comments ?? '',
    createdAt: configData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveToLocalStorage(STORAGE_KEYS.CONFIGURATION, configuration);
  return configuration;
};

export const getConfiguration = () => {
  return getFromLocalStorage(STORAGE_KEYS.CONFIGURATION) || null;
};

export const configurationExists = () => {
  const config = getFromLocalStorage(STORAGE_KEYS.CONFIGURATION);
  return config !== null;
};

export const deleteConfiguration = () => {
  removeFromLocalStorage(STORAGE_KEYS.CONFIGURATION);
  return true;
};

export const updateConfigurationField = (field, value) => {
  const config = getConfiguration();
  if (!config) return null;

  const updatedConfig = {
    ...config,
    [field]: value,
    updatedAt: new Date().toISOString(),
  };
  saveToLocalStorage(STORAGE_KEYS.CONFIGURATION, updatedConfig);
  return updatedConfig;
};

export const updateConfigurationFields = (updates) => {
  const config = getConfiguration();
  if (!config) return null;

  const updatedConfig = {
    ...config,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveToLocalStorage(STORAGE_KEYS.CONFIGURATION, updatedConfig);
  return updatedConfig;
};
