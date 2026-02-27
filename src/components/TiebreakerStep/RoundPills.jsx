import { useTranslation } from 'react-i18next';

const RoundPills = ({ rounds, currentRoundNumber, phase }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {rounds.map((r) => (
        <span
          key={r.roundNumber}
          className="text-xs bg-gray-400 dark:bg-gray-700 text-gray-100 dark:text-gray-300 rounded-full px-3 py-1"
        >
          {t('step4.tiebreaker.round')} {r.roundNumber} ✓
        </span>
      ))}
      {phase !== 'completed' && (
        <span className="text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 rounded-full px-3 py-1 font-semibold">
          {t('step4.tiebreaker.round')} {currentRoundNumber}
        </span>
      )}
    </div>
  );
};

export default RoundPills;
