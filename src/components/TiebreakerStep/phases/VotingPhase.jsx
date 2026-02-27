import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BaseButton } from '../../base';
import VoteInput from '../../VoteInput';

const VotingPhase = ({
  tiedCandidates,
  winnersNeeded,
  rounds,
  roundBallots,
  currentBallot,
  searchTerms,
  tiedVoters,
  isBallotFilledEnough,
  onPersonSelect,
  onNullVote,
  onSearchChange,
  onSaveBallot,
  onComputeResults,
  onShowRoundsModal,
  onShowBallotsModal,
  onRestart,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      {/* Tie info + restart */}
      <div className="flex flex-row gap-4 justify-between items-center bg-gray-200/15 dark:bg-gray-100/10 border border-darkPrimary dark:border-white rounded-lg p-4 text-sm text-black dark:text-white">
        <div>
          <p className="font-semibold mb-1">
            {t('step4.tiebreaker.tiedCandidates')}
          </p>
          <p className="mb-2">{tiedCandidates.join(' • ')}</p>
          <p>
            {t('step4.tiebreaker.winnersNeededInfo', { count: winnersNeeded })}
          </p>
        </div>
        {(rounds.length > 0 || roundBallots.length > 0) && (
          <BaseButton onClick={onRestart} variant="danger">
            {t('step4.tiebreaker.restartAll')}
          </BaseButton>
        )}
      </div>

      {/* Ballot counter + view buttons */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t('step4.tiebreaker.ballotsEntered', { count: roundBallots.length })}
        </span>
        <div className="flex items-center gap-2">
          {rounds.length > 0 && (
            <BaseButton onClick={onShowRoundsModal} variant="warning" outlined>
              {t('step4.tiebreaker.viewAllRoundsResult')}
            </BaseButton>
          )}
          {roundBallots.length > 0 && (
            <BaseButton onClick={onShowBallotsModal} variant="help">
              {t('step3.viewAllBallotsCurrentRound')}
            </BaseButton>
          )}
        </div>
      </div>

      {/* Vote inputs */}
      <div className="flex flex-col gap-3">
        {currentBallot.map((vote, i) => (
          <VoteInput
            key={vote.id}
            index={i}
            vote={vote}
            searchTerm={searchTerms[i]}
            voters={tiedVoters}
            currentBallot={currentBallot}
            onPersonSelect={onPersonSelect}
            onNullVote={onNullVote}
            onSearchChange={onSearchChange}
          />
        ))}
      </div>

      {/* Save ballot */}
      <div className="flex gap-3 items-center justify-end">
        <BaseButton
          onClick={onSaveBallot}
          variant="primary"
          disabled={!isBallotFilledEnough}
        >
          {t('step4.tiebreaker.saveBallot')}
        </BaseButton>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
        <BaseButton outlined onClick={() => navigate('/step4')}>
          {t('step4.tiebreaker.backToStep4')}
        </BaseButton>
        {roundBallots.length > 0 && (
          <BaseButton onClick={onComputeResults} variant="warning" icon="check">
            {t('step4.tiebreaker.computeResults', {
              count: roundBallots.length,
            })}
          </BaseButton>
        )}
      </div>
    </div>
  );
};

export default VotingPhase;
