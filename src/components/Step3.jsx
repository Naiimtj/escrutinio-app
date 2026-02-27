import { useState, useCallback, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getConfiguration,
  getAllVoters,
  getAllBallots,
  getNextBallotNumber,
  replaceAllBallots,
  deleteAllBallots,
  tiebreakerExists,
  getTiebreakerData,
  clearTiebreakerData,
  extractInitialTiebreakerInfo,
} from '../service';
import { createEmptyBallot, getPersonFullName } from '../utils/helpers';
import { BaseButton, BaseIcon } from './base';
import {
  AllBallotsModal,
  Confirmation,
  DeleteBallotConfirmModal,
  DeleteConfirmationModal,
} from './modals';
import VoteInput from './VoteInput';
import { ToastContext } from '../context/ToastContext';

const Step3 = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { showToast } = useContext(ToastContext);

  const loadInitialData = () => {
    const configuration = getConfiguration();
    const voterList = getAllVoters();
    const savedBallots = getAllBallots();
    const ballotNumber = getNextBallotNumber();
    const initialBallot = configuration
      ? createEmptyBallot(configuration.delegates)
      : [];
    const initialSearchTerms = configuration
      ? new Array(configuration.delegates).fill('')
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNullModal, setShowNullModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showAllBallotsModal, setShowAllBallotsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showResetAllBallotsModal, setShowResetAllBallotsModal] =
    useState(false);
  const [ballotToDelete, setBallotToDelete] = useState(null);

  // Tiebreaker lock: if a tiebreaker already existed when step3 was opened,
  // the AllBallotsModal will be locked until the user explicitly unlocks it.
  const [hasTiebreaker, setHasTiebreaker] = useState(() => tiebreakerExists());
  const [isBallotLocked, setIsBallotLocked] = useState(true);

  /**
   * After any ballot modification, re-evaluate whether the existing tiebreaker
   * is still valid. If the tie situation has changed, clear it.
   */
  const checkTiebreakerImpact = useCallback(
    (updatedBallots) => {
      const tiebreakerData = getTiebreakerData();
      if (!tiebreakerData) return;

      // Original set of tied candidates from the first tiebreaker round
      const originalTiedCandidates =
        tiebreakerData.rounds?.[0]?.tiedCandidates ?? [];

      // Recompute vote counts from the updated main ballots
      const voteCounts = {};
      updatedBallots.forEach((ballot) => {
        if (!ballot.isNull && ballot.votes) {
          ballot.votes.forEach((vote) => {
            if (vote.person && !vote.person.isInvalid) {
              const key = getPersonFullName(vote.person);
              voteCounts[key] = (voteCounts[key] || 0) + 1;
            }
          });
        }
      });

      const sortedResults = Object.entries(voteCounts)
        .map(([name, votes]) => ({ name, votes }))
        .sort((a, b) => b.votes - a.votes);

      const { tiedCandidates: newTiedCandidates } =
        extractInitialTiebreakerInfo(sortedResults, config.delegates);

      const oldSet = new Set(originalTiedCandidates);
      const newSet = new Set(newTiedCandidates);
      const sameSet =
        oldSet.size === newSet.size && [...oldSet].every((c) => newSet.has(c));

      if (!sameSet) {
        clearTiebreakerData();
        setHasTiebreaker(false);
        setIsBallotLocked(false);
        showToast(t('step3.tiebreakerLock.tiebreakerCleared'), 'warning');
      }
    },
    [config, showToast, t],
  );

  /** Close the AllBallotsModal and re-lock for next open */
  const handleCloseAllBallots = useCallback(() => {
    setShowAllBallotsModal(false);
    setIsBallotLocked(true);
  }, []);

  const resetBallot = useCallback(() => {
    if (!config) return;
    setCurrentBallot(createEmptyBallot(config.delegates));
    setSearchTerms(new Array(config.delegates).fill(''));
  }, [config]);

  const handleResetAllBallots = useCallback(() => {
    deleteAllBallots();
    setBallots([]);
    setBallotNumber(1);
    setEditingIndex(null);
    resetBallot();
    setShowResetAllBallotsModal(false);
  }, [resetBallot]);

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
    replaceAllBallots(newBallots);

    if (editingIndex === null) {
      setBallotNumber((prev) => prev + 1);
    } else if (hasTiebreaker) {
      checkTiebreakerImpact(newBallots);
    }

    setEditingIndex(null);
    resetBallot();
    setShowConfirmModal(false);
  }, [
    currentBallot,
    ballotNumber,
    editingIndex,
    ballots,
    resetBallot,
    hasTiebreaker,
    checkTiebreakerImpact,
  ]);

  const saveNullBallot = useCallback(() => {
    const ballot = {
      id:
        editingIndex === null ? crypto.randomUUID() : ballots[editingIndex].id,
      number: editingIndex === null ? ballotNumber : editingIndex + 1,
      votes: [],
      isNull: true,
      timestamp: new Date().toISOString(),
    };

    const newBallots =
      editingIndex === null
        ? [...ballots, ballot]
        : ballots.map((b, i) => (i === editingIndex ? ballot : b));

    setBallots(newBallots);
    replaceAllBallots(newBallots);

    if (editingIndex === null) {
      setBallotNumber((prev) => prev + 1);
    } else if (hasTiebreaker) {
      checkTiebreakerImpact(newBallots);
    }

    setEditingIndex(null);
    resetBallot();
    setShowNullModal(false);
  }, [
    ballotNumber,
    ballots,
    editingIndex,
    resetBallot,
    hasTiebreaker,
    checkTiebreakerImpact,
  ]);

  const editPreviousBallot = useCallback(() => {
    if (ballots.length === 0 || !config) return;

    const lastBallot = ballots.at(-1);
    const ballotVotes = createEmptyBallot(config.delegates).map(
      (emptyVote, index) => lastBallot.votes[index] || emptyVote,
    );

    setCurrentBallot(ballotVotes);
    setEditingIndex(ballots.length - 1);
    setSearchTerms(new Array(config.delegates).fill(''));
  }, [ballots, config]);

  const editBallotFromList = useCallback(
    (index) => {
      if (!config) return;

      const ballot = ballots[index];
      const ballotVotes = createEmptyBallot(config.delegates).map(
        (emptyVote, i) => ballot.votes[i] || emptyVote,
      );

      setCurrentBallot(ballotVotes);
      setEditingIndex(index);
      setSearchTerms(new Array(config.delegates).fill(''));
      handleCloseAllBallots();
    },
    [ballots, config, handleCloseAllBallots],
  );

  const confirmDeleteBallot = useCallback((ballot) => {
    setBallotToDelete(ballot);
    setShowDeleteConfirmModal(true);
  }, []);

  const deleteBallot = useCallback(() => {
    if (!ballotToDelete) return;

    const ballotIndex = ballots.findIndex((b) => b.id === ballotToDelete.id);
    if (ballotIndex === -1) return;

    const newBallots = ballots
      .filter((b) => b.id !== ballotToDelete.id)
      .map((b, index) => ({
        ...b,
        number: index + 1,
      }));

    setBallots(newBallots);
    replaceAllBallots(newBallots);

    if (ballotNumber > newBallots.length + 1) {
      setBallotNumber(newBallots.length + 1);
    }

    if (editingIndex === ballotIndex) {
      setEditingIndex(null);
      resetBallot();
    } else if (editingIndex > ballotIndex) {
      setEditingIndex(editingIndex - 1);
    }

    if (hasTiebreaker) {
      checkTiebreakerImpact(newBallots);
    }

    setShowDeleteConfirmModal(false);
    setBallotToDelete(null);
  }, [
    ballotToDelete,
    ballots,
    editingIndex,
    ballotNumber,
    resetBallot,
    hasTiebreaker,
    checkTiebreakerImpact,
  ]);

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
  const hasReachedLimit = !isEditing && ballots.length >= config.total_ballots;

  const isCurrentBallotComplete = useMemo(
    () => currentBallot.every((vote) => vote.person !== null),
    [currentBallot],
  );

  if (!config) return <div className="p-6">Cargando...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t('step3.title')}
        </h1>
      </div>

      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <BaseIcon
          onClick={() => setShowResetAllBallotsModal(true)}
          icon="restart"
          size="large"
          disabled={ballots.length === 0}
          className="absolute top-2 right-2 cursor-pointer fill-red-500 hover:fill-red-700 dark:fill-red-400 dark:hover:fill-red-200 transition-colors duration-300"
          tooltip={t('step2.resetModal.button')}
        />
        {hasReachedLimit ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {t('step3.noMoreBallots')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('step3.noMoreBallotsMessage')}
                <a
                  className="text-textPrimary hover:underline cursor-pointer"
                  onClick={onBack}
                >
                  {t('step3.updateBallotNumber')}
                </a>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t('step3.totalBallots')}: {ballots.length} /{' '}
                {config.total_ballots}
              </p>
            </div>
            <div className="flex justify-center items-center gap-4">
              <BaseButton
                onClick={() => setShowAllBallotsModal(true)}
                variant="help"
              >
                {t('step3.viewAllBallots')}
              </BaseButton>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <BaseButton
                onClick={() => setShowFinishModal(true)}
                size="large"
                variant="primary"
              >
                {t('navigation.next')}
              </BaseButton>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              {t('step3.hint')}
            </p>
          </div>
        ) : (
          <>
            {/* Ballot Number */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-darkPrimary">
                {t('step3.ballot')} #{currentBallotDisplay}
                {isEditing && (
                  <span className="ml-2 text-sm text-orange-600">
                    ({t('step3.editMode')})
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                {ballots.length} / {config.total_ballots}{' '}
                {t('step3.ballotsRegistered')}
              </p>

              <BaseButton
                onClick={() => setShowAllBallotsModal(true)}
                variant="outline"
              >
                {t('step3.viewAllBallots')}
              </BaseButton>
            </div>

            <div className="space-y-4 mb-6">
              {currentBallot.map((vote, index) => (
                <VoteInput
                  key={vote.id}
                  index={index}
                  vote={vote}
                  searchTerm={searchTerms[index]}
                  voters={voters}
                  currentBallot={currentBallot}
                  onPersonSelect={handlePersonSelect}
                  onNullVote={handleNullVote}
                  onSearchChange={handleSearchChange}
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                <BaseButton onClick={onBack} variant="secondary">
                  {t('navigation.back')}
                </BaseButton>
                <BaseButton
                  onClick={() => setShowNullModal(true)}
                  variant="danger"
                  outlined
                >
                  {t('step3.nullBallot')}
                </BaseButton>
              </div>

              <div className="flex gap-2">
                {ballots.length > 0 && !isEditing && (
                  <BaseButton onClick={editPreviousBallot} outlined>
                    {t('step3.previousBallot')}
                  </BaseButton>
                )}
                <BaseButton
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!isCurrentBallotComplete}
                  variant="primary"
                >
                  {isEditing ? t('step3.confirm') : t('step3.nextBallot')}
                </BaseButton>
              </div>
            </div>
          </>
        )}
      </div>

      <Confirmation
        isOpen={showConfirmModal}
        title={t('step3.confirmBallot')}
        onConfirm={saveBallot}
        onCancel={() => setShowConfirmModal(false)}
      >
        <div className="space-y-2">
          {currentBallot
            .filter((v) => v.person)
            .map((vote) => (
              <div
                key={vote.id}
                className="text-sm text-gray-600 dark:text-gray-300"
              >
                • {getPersonFullName(vote.person)}
              </div>
            ))}
        </div>
      </Confirmation>

      <Confirmation
        isOpen={showNullModal}
        title={t('step3.nullBallotReasons')}
        onConfirm={saveNullBallot}
        onCancel={() => setShowNullModal(false)}
        confirmStyle="danger"
      >
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li>• {t('step3.reasons.repeated')}</li>
          <li>• {t('step3.reasons.less')}</li>
          <li>• {t('step3.reasons.more')}</li>
        </ul>
      </Confirmation>

      <Confirmation
        isOpen={showFinishModal}
        title={t('navigation.summary')}
        onConfirm={onNext}
        onCancel={() => setShowFinishModal(false)}
        confirmStyle="success"
        confirmText={t('navigation.next')}
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center font-bold">
            {t('step3.totalBallots')}: {ballots.length}
          </p>
          <p className="text-sm text-darkGreen dark:text-darkGreen">
            {t('step4.statistics.validBallots')}: {validBallotCount}
          </p>
          <p className="text-sm text-red-800 dark:text-alert">
            {t('step4.statistics.nullBallots')}: {nullBallotCount}
          </p>
        </div>
      </Confirmation>

      <AllBallotsModal
        visible={showAllBallotsModal}
        ballots={ballots}
        onClose={handleCloseAllBallots}
        onEdit={editBallotFromList}
        onDelete={confirmDeleteBallot}
        hasTiebreaker={hasTiebreaker}
        locked={isBallotLocked}
        onUnlockRequest={() => setIsBallotLocked(false)}
      />

      <DeleteBallotConfirmModal
        isOpen={showDeleteConfirmModal}
        ballot={ballotToDelete}
        onConfirm={deleteBallot}
        onCancel={() => {
          setShowDeleteConfirmModal(false);
          setBallotToDelete(null);
        }}
      />

      <DeleteConfirmationModal
        isOpen={showResetAllBallotsModal}
        title={t('step3.resetModal.title')}
        message={t('step3.resetModal.message')}
        warningMessage={t('step3.resetModal.warning')}
        onConfirm={handleResetAllBallots}
        onCancel={() => setShowResetAllBallotsModal(false)}
        confirmText={t('step3.resetModal.button')}
      />
    </div>
  );
};

export default Step3;
