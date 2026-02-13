import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  STORAGE_KEYS,
} from '../utils/localStorage';
import {
  createEmptyBallot,
  getPersonFullName,
  filterVotersByName,
} from '../utils/helpers';
import { buttonStyles } from '../utils/styles';
import Modal from './Modal';
import { BaseButton, BaseCheckbox, BaseIcon } from './base';

const Step3 = ({ onNext, onBack }) => {
  const { t } = useTranslation();

  // Load initial data from localStorage
  const loadInitialData = () => {
    const configuration = getFromLocalStorage(STORAGE_KEYS.CONFIGURATION);
    const voterList = getFromLocalStorage(STORAGE_KEYS.VOTER_LIST) || [];
    const savedBallots = getFromLocalStorage(STORAGE_KEYS.BALLOTS) || [];
    const ballotNumber = savedBallots.length + 1;
    const initialBallot = configuration
      ? createEmptyBallot(configuration.votes)
      : [];
    const initialSearchTerms = configuration
      ? new Array(configuration.votes).fill('')
      : [];

    return {
      configuration,
      voterList,
      savedBallots,
      ballotNumber,
      initialBallot,
      initialSearchTerms,
    };
  };

  // Initialize all state with lazy initialization
  const initialData = useMemo(() => loadInitialData(), []);

  const [config] = useState(initialData.configuration);
  const [voters] = useState(initialData.voterList);
  const [ballots, setBallots] = useState(initialData.savedBallots);
  const [currentBallot, setCurrentBallot] = useState(initialData.initialBallot);
  const [ballotNumber, setBallotNumber] = useState(initialData.ballotNumber);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerms, setSearchTerms] = useState(
    initialData.initialSearchTerms,
  );

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNullModal, setShowNullModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Reset ballot to empty state
  const resetBallot = useCallback(() => {
    if (!config) return;
    setCurrentBallot(createEmptyBallot(config.votes));
    setSearchTerms(new Array(config.votes).fill(''));
  }, [config]);

  // Vote handlers
  const updateVote = useCallback((index, updates) => {
    setCurrentBallot((prev) => {
      const newBallot = [...prev];
      newBallot[index] = { ...newBallot[index], ...updates };
      return newBallot;
    });
  }, []);

  const handlePersonSelect = useCallback(
    (index, person) => {
      updateVote(index, { person, isNull: false });
      setSearchTerms((prev) => {
        const newTerms = [...prev];
        newTerms[index] = '';
        return newTerms;
      });
    },
    [updateVote],
  );

  const handleNullVote = useCallback(
    (index, isChecked) => {
      const person = isChecked
        ? { name: t('step3.invalidName'), isInvalid: true }
        : null;
      updateVote(index, { person, isNull: isChecked });
    },
    [t, updateVote],
  );

  const handleSearchChange = useCallback((index, value) => {
    setSearchTerms((prev) => {
      const newTerms = [...prev];
      newTerms[index] = value;
      return newTerms;
    });
  }, []);

  // Ballot actions
  const saveBallot = useCallback(() => {
    const ballot = {
      id: crypto.randomUUID(),
      number: editingIndex === null ? ballotNumber : editingIndex + 1,
      votes: currentBallot.filter((vote) => vote.person !== null),
      timestamp: new Date().toISOString(),
    };

    const newBallots =
      editingIndex === null
        ? [...ballots, ballot]
        : ballots.map((b, i) => (i === editingIndex ? ballot : b));

    setBallots(newBallots);
    saveToLocalStorage(STORAGE_KEYS.BALLOTS, newBallots);

    if (editingIndex === null) {
      setBallotNumber((prev) => prev + 1);
    }

    setEditingIndex(null);
    resetBallot();
    setShowConfirmModal(false);
  }, [currentBallot, ballotNumber, editingIndex, ballots, resetBallot]);

  const saveNullBallot = useCallback(() => {
    const ballot = {
      id: crypto.randomUUID(),
      number: ballotNumber,
      votes: [],
      isNull: true,
      timestamp: new Date().toISOString(),
    };

    const newBallots = [...ballots, ballot];
    setBallots(newBallots);
    saveToLocalStorage(STORAGE_KEYS.BALLOTS, newBallots);
    setBallotNumber((prev) => prev + 1);
    resetBallot();
    setShowNullModal(false);
  }, [ballotNumber, ballots, resetBallot]);

  const editPreviousBallot = useCallback(() => {
    if (ballots.length === 0 || !config) return;

    const lastBallot = ballots.at(-1);
    const ballotVotes = createEmptyBallot(config.votes).map(
      (emptyVote, index) => lastBallot.votes[index] || emptyVote,
    );

    setCurrentBallot(ballotVotes);
    setEditingIndex(ballots.length - 1);
    setSearchTerms(new Array(config.votes).fill(''));
  }, [ballots, config]);

  // Computed values
  const isEditing = editingIndex !== null;
  const currentBallotDisplay = isEditing ? editingIndex + 1 : ballotNumber;
  const validBallotCount = useMemo(
    () => ballots.filter((b) => !b.isNull).length,
    [ballots],
  );
  const nullBallotCount = useMemo(
    () => ballots.filter((b) => b.isNull).length,
    [ballots],
  );

  if (!config) return <div className="p-6">Cargando...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t('step3.title')}
        </h1>
        <BaseButton
          onClick={() => setShowFinishModal(true)}
          size="large"
          variant="success"
        >
          {t('navigation.finish')}
        </BaseButton>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Ballot Number */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-darkPrimary">
            {t('step3.ballot')} #{currentBallotDisplay}
            {isEditing && (
              <span className="ml-2 text-sm text-orange-600">
                ({t('step3.editMode')})
              </span>
            )}
          </h2>
        </div>

        {/* Votes */}
        <div className="space-y-4 mb-6">
          {currentBallot.map((vote, index) => (
            <VoteInput
              key={vote.id}
              index={index}
              vote={vote}
              searchTerm={searchTerms[index]}
              voters={voters}
              onPersonSelect={handlePersonSelect}
              onNullVote={handleNullVote}
              onSearchChange={handleSearchChange}
              t={t}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <button onClick={onBack} className={buttonStyles.secondary}>
              {t('navigation.back')}
            </button>
            <button
              onClick={() => setShowNullModal(true)}
              className={buttonStyles.danger}
            >
              {t('step3.nullBallot')}
            </button>
          </div>

          <div className="flex gap-2">
            {ballots.length > 0 && !isEditing && (
              <button
                onClick={editPreviousBallot}
                className={buttonStyles.outline}
              >
                {t('step3.previousBallot')}
              </button>
            )}
            <button
              onClick={() => setShowConfirmModal(true)}
              className={buttonStyles.primary}
            >
              {isEditing ? t('step3.confirm') : t('step3.nextBallot')}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showConfirmModal}
        title={t('step3.confirmBallot')}
        onConfirm={saveBallot}
        onCancel={() => setShowConfirmModal(false)}
      >
        <div className="space-y-2">
          {currentBallot
            .filter((v) => v.person)
            .map((vote) => (
              <div key={vote.id} className="text-sm text-gray-600">
                • {getPersonFullName(vote.person)}
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        isOpen={showNullModal}
        title={t('step3.nullBallotReasons')}
        onConfirm={saveNullBallot}
        onCancel={() => setShowNullModal(false)}
        confirmStyle="danger"
      >
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• {t('step3.reasons.repeated')}</li>
          <li>• {t('step3.reasons.less')}</li>
          <li>• {t('step3.reasons.more')}</li>
        </ul>
      </Modal>

      <Modal
        isOpen={showFinishModal}
        title={t('navigation.finish')}
        onConfirm={onNext}
        onCancel={() => setShowFinishModal(false)}
        confirmStyle="success"
      >
        <div>
          <p className="text-gray-600 mb-2">
            {t('step3.ballot')}: {ballots.length}
          </p>
          <p className="text-sm text-gray-500">
            {t('step4.statistics.validBallots')}: {validBallotCount}
          </p>
          <p className="text-sm text-gray-500">
            {t('step4.statistics.nullBallots')}: {nullBallotCount}
          </p>
        </div>
      </Modal>
    </div>
  );
};

// Vote Input Component
const VoteInput = ({
  index,
  vote,
  searchTerm,
  voters,
  onPersonSelect,
  onNullVote,
  onSearchChange,
  t,
}) => {
  const filteredVoters = filterVotersByName(voters, searchTerm);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-24">
          <span className="font-medium text-darkPrimary">
            {t('step3.vote')} {index + 1}
          </span>
        </div>

        <div className="grow relative">
          {vote.person ? (
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-lightPrimary rounded-lg">
              <div
                className={
                  vote.person.isInvalid ? 'text-red-600' : 'text-gray-800'
                }
              >
                {getPersonFullName(vote.person)}{' '}
                {!vote.person.isInvalid && (
                  <span className="text-xs">({vote.person.location})</span>
                )}
              </div>
              {!vote.isNull && (
                <button
                  onClick={() => onPersonSelect(index, null)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              )}
              <BaseIcon
                name="close"
                className="text-red-600 hover:text-red-800 cursor-pointer"
                onClick={() => onPersonSelect(index, null)}
              />
            </div>
          ) : (
            <>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(index, e.target.value)}
                placeholder={t('step3.searchPerson')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && filteredVoters.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredVoters.map((voter) => (
                    <button
                      key={voter.id}
                      onClick={() => onPersonSelect(index, voter)}
                      className="w-full text-left px-4 py-2 hover:bg-lightPrimary cursor-pointer transition"
                    >
                      {getPersonFullName(voter)}
                      <span className="text-sm text-gray-500 ml-2">
                        ({voter.location})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="shrink-0">
          <BaseCheckbox
            checked={vote.isNull}
            onChange={(isChecked) => onNullVote(index, isChecked)}
            label={t('step3.nullVote')}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3;
