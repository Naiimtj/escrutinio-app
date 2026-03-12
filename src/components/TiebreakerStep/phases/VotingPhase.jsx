import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BaseButton } from '../../base';
import { Confirmation } from '../../modals';
import VoteInput from '../../VoteInput';

const VotingPhase = ({
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
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showComputeConfirm, setShowComputeConfirm] = useState(false);

  return (
    <div className="flex flex-col md:gap-4 gap-2">
      {/* Ballot counter + view buttons */}
      <div className="flex md:flex-row flex-col gap-2 md:gap-0 md:items-center justify-between mt-2">
        <h2 className="text-xl font-semibold text-warning">
          {t('step3.ballot')} #{roundBallots.length + 1}
        </h2>
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
            <BaseButton onClick={onShowBallotsModal} variant="help" outlined>
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

      {/* Navigation */}
      <div className="flex md:flex-row flex-col gap-3 justify-between md:mt-6 mt-4">
        <BaseButton
          outlined
          onClick={() => navigate('/step4')}
          variant="warning"
          icon="arrowLeft"
          iconClassName="w-5 h-5"
        >
          {t('step4.tiebreaker.backToStep4')}
        </BaseButton>
        {roundBallots.length > 0 && (
          <BaseButton
            onClick={() => setShowComputeConfirm(true)}
            variant="warning"
          >
            {t('step4.tiebreaker.computeResults')}
          </BaseButton>
        )}
        {/* Save ballot */}
        <BaseButton
          onClick={onSaveBallot}
          variant="primary"
          disabled={!isBallotFilledEnough}
          className="w-full md:w-auto"
          size="large"
        >
          {t('common.save')}
        </BaseButton>
      </div>
      <Confirmation
        isOpen={showComputeConfirm}
        title={t('step4.tiebreaker.computeResults')}
        onConfirm={() => {
          setShowComputeConfirm(false);
          onComputeResults();
        }}
        onCancel={() => setShowComputeConfirm(false)}
        confirmStyle="warning"
      >
        <p className="text-gray-600 dark:text-gray-300">
          {t('step4.tiebreaker.ballotsEntered', { count: roundBallots.length })}
        </p>
      </Confirmation>
    </div>
  );
};

export default VotingPhase;
