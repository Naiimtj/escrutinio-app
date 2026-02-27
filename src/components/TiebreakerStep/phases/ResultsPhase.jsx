import { useTranslation } from 'react-i18next';
import { BaseButton } from '../../base';

const ResultsPhase = ({
  roundResults,
  currentRoundNumber,
  onBackToVoting,
  onFinishRound,
}) => {
  const { t } = useTranslation();
  const { sorted, outcome } = roundResults;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {t('step4.tiebreaker.roundResultsTitle', { round: currentRoundNumber })}
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {t('step4.name')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                {t('step4.votes')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700 divide-gray-200">
            {sorted.map((r, i) => {
              const isWinner = outcome.clearWinners.includes(r.name);
              const isStillTied = outcome.stillTied.includes(r.name);
              return (
                <tr
                  key={r.name}
                  className={
                    isWinner
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : isStillTied
                        ? 'bg-yellow-50 dark:bg-yellow-900/20'
                        : 'bg-white dark:bg-gray-800'
                  }
                >
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {r.name}
                    {isWinner && (
                      <span className="ml-2 text-xs text-green-700 dark:text-green-400">
                        ✓ {t('step4.tiebreaker.winner')}
                      </span>
                    )}
                    {isStillTied && (
                      <span className="ml-2 text-xs text-yellow-700 dark:text-yellow-400">
                        ⚠ {t('step4.tiebreaker.stillTied')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-100">
                    {r.votes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {outcome.isResolved ? (
        <div className="rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-800 dark:text-green-200 text-center">
          {t('step4.tiebreaker.tieResolved')}
        </div>
      ) : (
        <div className="rounded-lg border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 p-3 text-sm text-yellow-800 dark:text-yellow-200 text-center">
          {t('step4.tiebreaker.tieStillExists', {
            names: outcome.stillTied.join(', '),
            needed: outcome.nextWinnersNeeded,
          })}
        </div>
      )}

      <div className="flex gap-3 justify-between">
        <BaseButton outlined onClick={onBackToVoting}>
          {t('step4.tiebreaker.backToVoting')}
        </BaseButton>
        <BaseButton onClick={onFinishRound} variant="primary">
          {outcome.isResolved
            ? t('step4.tiebreaker.confirmResult')
            : t('step4.tiebreaker.startNextRound')}
        </BaseButton>
      </div>
    </div>
  );
};

export default ResultsPhase;
