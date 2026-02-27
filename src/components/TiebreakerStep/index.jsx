import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  saveTiebreakerData,
  getTiebreakerData,
  computeTiebreakerRoundOutcome,
  getAllVoters,
  getConfiguration,
} from '../../service';
import { createEmptyBallot, getPersonFullName } from '../../utils/helpers';
import {
  AllBallotsModal,
  DeleteConfirmationModal,
  RoundsResultsModal,
} from '../modals';
import { buildMainResults, buildInitialState } from './utils';
import RoundPills from './RoundPills';
import CompletedPhase from './phases/CompletedPhase';
import ResultsPhase from './phases/ResultsPhase';
import VotingPhase from './phases/VotingPhase';

const TiebreakerStep = () => {
  const { t } = useTranslation();

  const config = getConfiguration();
  const allVoters = getAllVoters();
  const delegates = config?.delegates || 0;
  const mainResults = buildMainResults();

  // ── Persistent tiebreaker state ──────────────────────────────────────────
  const [tbState, setTbState] = useState(
    () => getTiebreakerData() ?? buildInitialState(mainResults, delegates),
  );

  const currentRoundNumber = tbState.rounds.length + 1;
  const tiedCandidates = useMemo(
    () => tbState.currentTiedCandidates ?? [],
    [tbState.currentTiedCandidates],
  );
  const winnersNeeded = tbState.currentWinnersNeeded ?? 0;

  const tiedVoters = useMemo(
    () =>
      allVoters.filter((v) => tiedCandidates.includes(getPersonFullName(v))),
    [allVoters, tiedCandidates],
  );

  // ── Round ballot entry state ─────────────────────────────────────────────
  const buildEmptyBallot = useCallback(
    (n) => createEmptyBallot(n ?? winnersNeeded),
    [winnersNeeded],
  );

  const [currentBallot, setCurrentBallot] = useState(() =>
    buildEmptyBallot(winnersNeeded),
  );
  const [searchTerms, setSearchTerms] = useState(() =>
    new Array(winnersNeeded).fill(''),
  );
  const [roundBallots, setRoundBallots] = useState(
    () => getTiebreakerData()?.pendingBallots ?? [],
  );
  const [phase, setPhase] = useState(
    tbState.completed ? 'completed' : 'voting',
  );
  const [roundResults, setRoundResults] = useState(null);

  // ── Modal visibility state ───────────────────────────────────────────────
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showBallotsModal, setShowBallotsModal] = useState(false);
  const [ballotsModalReadOnly, setBallotsModalReadOnly] = useState(false);
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [showBackToVotingModal, setShowBackToVotingModal] = useState(false);
  const [deletingBallot, setDeletingBallot] = useState(null);

  const allRoundsBallots = useMemo(
    () => tbState.rounds.flatMap((r) => r.ballots ?? []),
    [tbState.rounds],
  );

  // ── Persistence helpers ──────────────────────────────────────────────────
  const persist = useCallback((newState) => {
    setTbState(newState);
    saveTiebreakerData(newState);
  }, []);

  const persistCurrentBallots = useCallback(
    (ballots) => saveTiebreakerData({ ...tbState, pendingBallots: ballots }),
    [tbState],
  );

  // ── Ballot input handlers ────────────────────────────────────────────────
  const handlePersonSelect = useCallback((index, person) => {
    setCurrentBallot((prev) =>
      prev.map((v, i) => (i === index ? { ...v, person, isNull: false } : v)),
    );
    setSearchTerms((prev) => prev.map((s, i) => (i === index ? '' : s)));
  }, []);

  const handleNullVote = useCallback(
    (index, isChecked) => {
      const person = isChecked
        ? { name: t('step3.invalidName'), isInvalid: true }
        : null;
      setCurrentBallot((prev) =>
        prev.map((v, i) =>
          i === index ? { ...v, person, isNull: isChecked } : v,
        ),
      );
    },
    [t],
  );

  const handleSearchChange = useCallback((index, value) => {
    setSearchTerms((prev) => prev.map((s, i) => (i === index ? value : s)));
  }, []);

  const resetBallotEntry = useCallback(
    (size) => {
      const n = size ?? winnersNeeded;
      setCurrentBallot(buildEmptyBallot(n));
      setSearchTerms(new Array(n).fill(''));
    },
    [winnersNeeded, buildEmptyBallot],
  );

  const isBallotFilledEnough = useMemo(
    () => currentBallot.every((v) => v.person !== null),
    [currentBallot],
  );

  const handleSaveBallot = useCallback(() => {
    if (!isBallotFilledEnough) return;
    const ballot = {
      id: crypto.randomUUID(),
      number: roundBallots.length + 1,
      votes: currentBallot,
      isNull: false,
      timestamp: new Date().toISOString(),
    };
    const newBallots = [...roundBallots, ballot];
    setRoundBallots(newBallots);
    persistCurrentBallots(newBallots);
    resetBallotEntry();
  }, [
    isBallotFilledEnough,
    currentBallot,
    roundBallots,
    resetBallotEntry,
    persistCurrentBallots,
  ]);

  // ── Compute round outcome ────────────────────────────────────────────────
  const handleComputeResults = useCallback(() => {
    if (roundBallots.length === 0) return;

    const voteCounts = Object.fromEntries(
      tiedCandidates.map((name) => [name, 0]),
    );
    roundBallots.forEach((ballot) => {
      ballot.votes.forEach((vote) => {
        if (vote.person && !vote.isNull && !vote.person.isInvalid) {
          const name = getPersonFullName(vote.person);
          if (name in voteCounts) voteCounts[name] += 1;
        }
      });
    });

    const sorted = Object.entries(voteCounts)
      .map(([name, votes]) => ({ name, votes }))
      .sort((a, b) => b.votes - a.votes);

    setRoundResults({
      sorted,
      outcome: computeTiebreakerRoundOutcome(sorted, winnersNeeded),
    });
    setPhase('results');
  }, [roundBallots, tiedCandidates, winnersNeeded]);

  // ── Advance after results ────────────────────────────────────────────────
  const handleFinishRound = useCallback(() => {
    if (!roundResults) return;
    const { sorted, outcome } = roundResults;

    const roundData = {
      roundNumber: currentRoundNumber,
      tiedCandidates,
      winnersNeeded,
      ballots: roundBallots,
      results: sorted,
      clearWinners: outcome.clearWinners,
      stillTied: outcome.stillTied,
      nextWinnersNeeded: outcome.nextWinnersNeeded,
      completed: outcome.isResolved,
    };

    const newState = { ...tbState, rounds: [...tbState.rounds, roundData] };

    if (outcome.isResolved) {
      const winners = [
        ...outcome.clearWinners,
        ...(outcome.stillTied || []),
      ].slice(0, winnersNeeded);
      newState.finalDelegates = [
        ...tbState.confirmedDelegates,
        ...winners.map((name, i) => ({
          name,
          position: tbState.confirmedDelegates.length + i + 1,
          byTiebreaker: true,
        })),
      ];
      newState.completed = true;
      newState.currentTiedCandidates = [];
      newState.currentWinnersNeeded = 0;
      persist(newState);
      setPhase('completed');
    } else {
      if (outcome.clearWinners.length > 0) {
        newState.confirmedDelegates = [
          ...tbState.confirmedDelegates,
          ...outcome.clearWinners.map((name, i) => ({
            name,
            position: tbState.confirmedDelegates.length + i + 1,
            byTiebreaker: true,
          })),
        ];
      }
      newState.currentTiedCandidates = outcome.stillTied;
      newState.currentWinnersNeeded = outcome.nextWinnersNeeded;
      persist(newState);
      setRoundBallots([]);
      setRoundResults(null);
      resetBallotEntry(outcome.nextWinnersNeeded);
      setPhase('voting');
    }
  }, [
    roundResults,
    currentRoundNumber,
    tiedCandidates,
    winnersNeeded,
    roundBallots,
    tbState,
    persist,
    resetBallotEntry,
  ]);

  // ── Back to voting ────────────────────────────────────────────────────────
  const handleConfirmBackToVoting = useCallback(() => {
    setRoundBallots([]);
    persistCurrentBallots([]);
    setRoundResults(null);
    setShowBackToVotingModal(false);
    setPhase('voting');
  }, [persistCurrentBallots]);

  // ── Restart ──────────────────────────────────────────────────────────────
  const handleRestart = useCallback(() => {
    const fresh = buildInitialState(mainResults, delegates);
    persist(fresh);
    setRoundBallots([]);
    setRoundResults(null);
    resetBallotEntry(fresh.currentWinnersNeeded);
    setPhase('voting');
    setShowRestartModal(false);
  }, [mainResults, delegates, persist, resetBallotEntry]);

  // ── Edit / delete ballot ──────────────────────────────────────────────────
  const handleEditBallot = useCallback(
    (index) => {
      const ballot = roundBallots[index];
      setCurrentBallot(ballot.votes);
      setSearchTerms(
        ballot.votes.map((v) =>
          v.person && !v.person.isInvalid ? getPersonFullName(v.person) : '',
        ),
      );
      const newBallots = roundBallots.filter((_, i) => i !== index);
      setRoundBallots(newBallots);
      persistCurrentBallots(newBallots);
      setShowBallotsModal(false);
    },
    [roundBallots, persistCurrentBallots],
  );

  const handleConfirmDeleteBallot = useCallback(() => {
    if (!deletingBallot) return;
    const newBallots = roundBallots.filter((b) => b.id !== deletingBallot.id);
    setRoundBallots(newBallots);
    persistCurrentBallots(newBallots);
    setDeletingBallot(null);
  }, [deletingBallot, roundBallots, persistCurrentBallots]);

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="max-w-3xl mx-auto md:p-6 flex flex-col gap-6 rounded-2xl bg-warning/15">
      {/* Header */}
      <div className="flex md:flex-row flex-col items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t('step4.tiebreaker.pageTitle')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('step4.tiebreaker.pageSubtitle')}
          </p>
        </div>
      </div>

      <RoundPills
        rounds={tbState.rounds}
        currentRoundNumber={currentRoundNumber}
        phase={phase}
      />

      {phase === 'completed' && tbState.finalDelegates && (
        <CompletedPhase
          finalDelegates={tbState.finalDelegates}
          rounds={tbState.rounds}
          allRoundsBallots={allRoundsBallots}
          onRestart={() => setShowRestartModal(true)}
          onShowRoundsModal={() => setShowRoundsModal(true)}
          onShowBallotsModal={() => {
            setBallotsModalReadOnly(true);
            setShowBallotsModal(true);
          }}
        />
      )}

      {phase === 'results' && roundResults && (
        <ResultsPhase
          roundResults={roundResults}
          currentRoundNumber={currentRoundNumber}
          onBackToVoting={() => setShowBackToVotingModal(true)}
          onFinishRound={handleFinishRound}
        />
      )}

      {phase === 'voting' && (
        <VotingPhase
          tiedCandidates={tiedCandidates}
          winnersNeeded={winnersNeeded}
          rounds={tbState.rounds}
          roundBallots={roundBallots}
          currentBallot={currentBallot}
          searchTerms={searchTerms}
          tiedVoters={tiedVoters}
          isBallotFilledEnough={isBallotFilledEnough}
          onPersonSelect={handlePersonSelect}
          onNullVote={handleNullVote}
          onSearchChange={handleSearchChange}
          onSaveBallot={handleSaveBallot}
          onComputeResults={handleComputeResults}
          onShowRoundsModal={() => setShowRoundsModal(true)}
          onShowBallotsModal={() => {
            setBallotsModalReadOnly(false);
            setShowBallotsModal(true);
          }}
          onRestart={() => setShowRestartModal(true)}
        />
      )}

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={showRestartModal}
        title={t('step4.tiebreaker.restartConfirmTitle')}
        message={t('step4.tiebreaker.restartConfirmMessage')}
        onConfirm={handleRestart}
        onCancel={() => setShowRestartModal(false)}
        confirmText={t('step4.tiebreaker.restartAll')}
      />

      <AllBallotsModal
        visible={showBallotsModal}
        ballots={ballotsModalReadOnly ? allRoundsBallots : roundBallots}
        rounds={ballotsModalReadOnly ? tbState.rounds : undefined}
        onClose={() => setShowBallotsModal(false)}
        onEdit={handleEditBallot}
        onDelete={(ballot) => setDeletingBallot(ballot)}
        title={t('step4.tiebreaker.allBallotsTitle')}
        readOnly={ballotsModalReadOnly}
      />

      <RoundsResultsModal
        visible={showRoundsModal}
        rounds={tbState.rounds}
        onClose={() => setShowRoundsModal(false)}
        title={t('step4.tiebreaker.allRoundsTitle')}
      />

      <DeleteConfirmationModal
        isOpen={showBackToVotingModal}
        title={t('step4.tiebreaker.backToVotingConfirmTitle')}
        message={t('step4.tiebreaker.backToVotingConfirmMessage')}
        onConfirm={handleConfirmBackToVoting}
        onCancel={() => setShowBackToVotingModal(false)}
        confirmText={t('step4.tiebreaker.backToVotingConfirm')}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingBallot}
        title={t('step4.tiebreaker.deleteBallotTitle')}
        message={
          deletingBallot &&
          t('step4.tiebreaker.deleteBallotMessage', {
            number: deletingBallot.number,
          })
        }
        onConfirm={handleConfirmDeleteBallot}
        onCancel={() => setDeletingBallot(null)}
        confirmText={t('step4.tiebreaker.deleteBallotConfirm')}
      />
    </div>
  );
};

export default TiebreakerStep;
