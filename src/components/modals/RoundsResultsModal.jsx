import { useTranslation } from 'react-i18next';
import { BaseModal } from '../base';

const RoundsResultsModal = ({ visible, rounds = [], onClose, title }) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      visible={visible}
      title={title ?? t('step4.tiebreaker.allRoundsTitle')}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
        {rounds.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {t('step4.tiebreaker.noRounds') || 'No rounds available'}
          </p>
        ) : (
          rounds.map((r) => (
            <div
              key={r.roundNumber}
              className="rounded-lg p-4 bg-white dark:bg-gray-700 hover:shadow transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {t('step4.tiebreaker.round')} {r.roundNumber}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {r.ballots.length} {t('step3.ballots')}
                </div>
              </div>

              <div className="overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-grayDark">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-600 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left ">
                        #
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t('step4.name')}
                      </th>
                      <th className="px-4 py-2 text-center">
                        {t('step4.votes')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-grayDark divide-gray-200">
                    {r.results.map((res, i) => {
                      const isWinner = (r.clearWinners || []).includes(
                        res.name,
                      );
                      const isStillTied = (r.stillTied || []).includes(
                        res.name,
                      );
                      return (
                        <tr
                          key={res.name}
                          className={
                            isWinner
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : isStillTied
                                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                                : 'bg-white dark:bg-gray-800'
                          }
                        >
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            {i + 1}
                          </td>
                          <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                            {res.name}
                            {isWinner && (
                              <span className="ml-2 text-xs text-green-700 dark:text-green-400">
                                ✓ {t('step4.tiebreaker.elected')}
                              </span>
                            )}
                            {isStillTied && (
                              <span className="ml-2 text-xs text-yellow-700 dark:text-yellow-400">
                                ⚠ {t('step4.tiebreaker.stillTied')}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-center font-semibold text-gray-900 dark:text-gray-100">
                            {res.votes}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>              
            </div>
          ))
        )}
      </div>
    </BaseModal>
  );
};

export default RoundsResultsModal;
