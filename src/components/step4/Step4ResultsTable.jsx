const Step4ResultsTable = ({
  t,
  results,
  stats,
  percentage,
  tiebreakerDelegates,
}) => {
  if (results.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">{t('step4.noResults')}</p>
    );
  }

  // Build a lookup: name → tiebreaker delegate info
  const tbMap = {};
  if (tiebreakerDelegates) {
    tiebreakerDelegates.forEach((d) => {
      tbMap[d.name] = d;
    });
  }

  // When tiebreaker is active, derive delegate list from tbMap instead of stats.delegates
  const hasTiebreakerResult =
    tiebreakerDelegates && tiebreakerDelegates.length > 0;

  // Build the ordered display rows:
  // 1. Elected delegates in position order (from finalDelegates)
  // 2. Non-elected candidates in original vote order
  const votesMap = {};
  results.forEach((r) => {
    votesMap[r.name] = r.votes;
  });

  const displayRows = hasTiebreakerResult
    ? [
        ...[...tiebreakerDelegates]
          .sort((a, b) => a.position - b.position)
          .map((d) => ({ name: d.name, votes: votesMap[d.name] ?? 0 })),
        ...results.filter((r) => !tbMap[r.name]),
      ]
    : results;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {t('step4.name')}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              {t('step4.votes')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              %
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700 divide-gray-200">
          {displayRows.map((result, index) => {
            const tbEntry = tbMap[result.name];
            const isElected = hasTiebreakerResult
              ? Boolean(tbEntry)
              : index < stats.delegates;
            const showTiebreakerBadge = Boolean(tbEntry?.byTiebreaker);

            const isTied =
              !hasTiebreakerResult &&
              stats.hasTie &&
              stats.cutoffVotes !== null &&
              result.votes === stats.cutoffVotes;

            const electedBorderBottomClass =
              !hasTiebreakerResult && stats.hasTie ? '' : 'border-b';
            const electedClass = isElected
              ? `bg-green-50 dark:bg-green-900/20 border-0 border-t border-x border-darkGreen ${
                  hasTiebreakerResult ? 'border-b' : electedBorderBottomClass
                }`
              : '';
            const tieClass = isTied
              ? 'border-l-4! border! border-yellow-400!'
              : '';

            return (
              <tr
                key={result.name}
                className={`${electedClass} ${tieClass} transition-colors duration-300`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {index + 1}
                  {isElected && !isTied && (
                    <span className="ml-2 text-darkGreen dark:text-lightGreen">
                      ✓
                    </span>
                  )}
                </td>
                <td
                  className={`px-6 py-4 text-sm ${
                    isElected && !isTied
                      ? 'font-semibold text-darkGreen dark:text-lightGreen'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {result.name}
                  {showTiebreakerBadge && (
                    <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded px-1.5 py-0.5 font-normal">
                      {t('step4.tiebreaker.byTiebreaker')}
                    </span>
                  )}
                </td>
                <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {result.votes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {percentage(result.votes)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Step4ResultsTable;
