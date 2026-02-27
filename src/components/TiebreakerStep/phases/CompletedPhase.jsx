import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BaseButton, BaseIcon } from '../../base';

const CompletedPhase = ({
  finalDelegates,
  rounds,
  allRoundsBallots,
  onRestart,
  onShowRoundsModal,
  onShowBallotsModal,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-5">
        <h2 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2 text-lg">
          <BaseIcon
            icon="check"
            className="h-5 w-5 stroke-green-700 dark:stroke-green-300"
          />
          {t('step4.tiebreaker.resolvedTitle')}
        </h2>
        <ol className="space-y-2">
          {finalDelegates.map((d) => (
            <li
              key={d.name}
              className="flex items-center gap-3 text-sm text-green-800 dark:text-green-200"
            >
              <span className="font-bold w-6 text-right shrink-0">
                {d.position}.
              </span>
              <span className="font-medium">{d.name}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* View history actions */}
      <div className="flex flex-col gap-2 items-end">
        {rounds.length > 0 && (
          <BaseButton onClick={onShowRoundsModal} variant="warning" outlined>
            {t('step4.tiebreaker.viewAllRoundsResult')}
          </BaseButton>
        )}
        {allRoundsBallots.length > 0 && (
          <BaseButton onClick={onShowBallotsModal} variant="help">
            {t('step3.viewAllBallots')}
          </BaseButton>
        )}
      </div>

      <div className="flex gap-3 justify-between">
        <BaseButton variant="danger" outlined onClick={onRestart}>
          {t('step4.tiebreaker.restartAll')}
        </BaseButton>
        <BaseButton variant="primary" onClick={() => navigate('/step4')}>
          {t('step4.tiebreaker.goToResults')}
        </BaseButton>
      </div>
    </div>
  );
};

export default CompletedPhase;
