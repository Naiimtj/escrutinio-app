export {
  createVoter,
  createVoterList,
  getAllVoters,
  getVoterById,
  getVotersCount,
  updateVoter,
  deleteVoter,
  deleteAllVoters,
  voterListExists,
} from './voterService';

export {
  saveConfiguration,
  getConfiguration,
  configurationExists,
  deleteConfiguration,
  updateConfigurationField,
  updateConfigurationFields,
} from './configurationService';

export {
  createBallot,
  getAllBallots,
  getBallotById,
  getBallotByNumber,
  getBallotsCount,
  getNextBallotNumber,
  getValidBallots,
  getNullBallots,
  updateBallot,
  updateBallotByIndex,
  deleteBallot,
  deleteBallotByIndex,
  deleteAllBallots,
  replaceAllBallots,
  ballotsExist,
} from './ballotService';

export {
  backupAndClearScrutinyData,
  restoreLastBackup,
  backupExists,
  hasActiveScrutinyData,
  getLastBackup,
  clearBackup,
} from './backupService';

export {
  saveTiebreakerData,
  getTiebreakerData,
  clearTiebreakerData,
  tiebreakerExists,
  computeTiebreakerRoundOutcome,
  extractInitialTiebreakerInfo,
} from './tiebreakerService';
