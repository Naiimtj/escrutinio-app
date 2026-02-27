import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getConfiguration,
  getAllVoters,
  getAllBallots,
  backupAndClearScrutinyData,
  updateConfigurationField,
  getTiebreakerData,
} from '../service';
import { getPersonFullName } from '../utils/helpers';
import { generateStep4Pdf } from '../utils/step4Pdf';
import { buttonStyles } from '../utils/styles';
import StatCard from './StatCard';
import { BaseButton, BaseIcon, BaseTextarea } from './base';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import Step4ResultsTable from './step4/Step4ResultsTable';
import { useNavigate } from 'react-router-dom';

const Step4 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState({});
  const [results, setResults] = useState([]);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [tiebreakerDelegates, setTiebreakerDelegates] = useState(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    calculateResults();
    // Restore any previously completed tiebreaker
    const saved = getTiebreakerData();
    if (saved && saved.completed && saved.finalDelegates) {
      setTiebreakerDelegates(saved.finalDelegates);
    }
  }, []);

  const calculateResults = () => {
    const configuration = getConfiguration();
    const voterList = getAllVoters();
    const ballots = getAllBallots();

    setConfig(configuration);
    setComments(configuration?.comments || '');

    const validBallots = ballots.filter((b) => !b.isNull);
    const voteCounts = {};
    let invalidNamesCount = 0;

    ballots.forEach((ballot) => {
      if (!ballot.isNull && ballot.votes) {
        ballot.votes.forEach((vote) => {
          if (vote.person) {
            if (vote.person.isInvalid) {
              invalidNamesCount++;
            } else {
              const key = getPersonFullName(vote.person);
              voteCounts[key] = (voteCounts[key] || 0) + 1;
            }
          }
        });
      }
    });

    const sortedResults = Object.entries(voteCounts)
      .map(([name, votes]) => ({ name, votes }))
      .sort((a, b) => b.votes - a.votes);

    const totalPossibleVotes =
      validBallots.length * (configuration?.delegates || 0);
    const validVotes = Object.values(voteCounts).reduce(
      (sum, count) => sum + count,
      0,
    );

    const delegates = configuration?.delegates || 0;
    const hasTie =
      sortedResults.length > delegates &&
      sortedResults[delegates - 1]?.votes === sortedResults[delegates]?.votes;

    const cutoffVotes =
      delegates > 0 && sortedResults[delegates - 1]
        ? sortedResults[delegates - 1].votes
        : null;

    setStats({
      totalVoters: voterList.length,
      totalBallots: ballots.length,
      nullBallots: ballots.length - validBallots.length,
      validBallots: validBallots.length,
      invalidNames: invalidNamesCount,
      totalPossibleVotes,
      validVotes,
      delegates,
      hasTie,
      cutoffVotes,
    });

    setResults(sortedResults);
  };

  const generatePDF = () => {
    generateStep4Pdf({
      t,
      config,
      stats,
      results,
      comments,
      tiebreakerDelegates,
      voters: getAllVoters(),
      ballots: getAllBallots(),
      tiebreakerData: getTiebreakerData(),
    });
  };

  const percentage = useMemo(() => {
    return stats.validVotes > 0
      ? (number) => ((number / stats.validVotes) * 100).toFixed(2)
      : () => '0.00';
  }, [stats.validVotes]);

  const handleClearData = () => {
    setShowClearDataModal(true);
  };

  const handleCommentsBlur = () => {
    updateConfigurationField('comments', comments);
    setConfig((prevConfig) =>
      prevConfig
        ? {
            ...prevConfig,
            comments,
          }
        : prevConfig,
    );
  };

  const confirmClearData = () => {
    backupAndClearScrutinyData();
    setShowClearDataModal(false);
    navigate('/step1');
  };

  const handleOpenTiebreaker = () => {
    navigate('/tiebreaker');
  };

  return (
    <div className="max-w-6xl mx-auto md:p-6">
      <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center md:text-left">
          {t('step4.title')}
        </h1>
        <div className="flex gap-2">
          <BaseButton
            onClick={generatePDF}
            className={`${buttonStyles.primary} flex items-center gap-2`}
            icon="download"
          >
            {t('step4.downloadPDF')}
          </BaseButton>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {t('step4.statistics.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <StatCard
            label={t('step4.statistics.totalVoters')}
            value={stats.totalVoters}
            color="black"
          />

          <StatCard
            label={t('step4.statistics.totalPossibleVotes')}
            value={stats.totalPossibleVotes}
            color="black"
          />
          <StatCard
            label={t('step4.statistics.delegatesToElect')}
            value={stats.delegates}
            color="black"
          />
          <StatCard
            label={t('step4.statistics.totalBallots')}
            value={stats.totalBallots}
            color="black"
          />
          <StatCard
            label={t('step4.statistics.validVotes')}
            value={stats.validVotes}
            color="black"
          />
          <div className="hidden md:block"></div>
          <StatCard
            label={t('step4.statistics.validBallots')}
            value={stats.validBallots}
            color="green"
          />
          <StatCard
            label={t('step4.statistics.nullBallots')}
            value={stats.nullBallots}
            color="red"
          />
          <StatCard
            label={t('step4.statistics.invalidNames')}
            value={stats.invalidNames}
            color="orange"
          />
        </div>
      </div>

      {stats.hasTie && (
        <div
          className={`bg-yellow-50 dark:bg-yellow-900/20 border-l-4 p-4 mb-6 rounded ${tiebreakerDelegates ? 'border-green-400' : 'border-yellow-400'}`}
        >
          <div className="flex justify-between items-center">
            <div className="shrink-0">
              {tiebreakerDelegates ? (
                <BaseIcon
                  icon="check"
                  className="h-10 w-10 dark:stroke-green-400 stroke-green-700 "
                />
              ) : (
                <BaseIcon
                  icon="alert"
                  className="h-10 w-10 dark:stroke-yellow-400 stroke-yellow-700 "
                />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3
                className={`text-sm font-medium ${tiebreakerDelegates ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}
              >
                {tiebreakerDelegates
                  ? t('step4.tiebreaker.resolvedTitle')
                  : t('step4.tieWarning')}
              </h3>
              <p
                className={`mt-2 text-sm ${tiebreakerDelegates ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}
              >
                {tiebreakerDelegates
                  ? t('step4.tiebreaker.resolvedSubtitle')
                  : t('step4.tieWarningMessage')}
              </p>
            </div>
            <BaseButton
              onClick={handleOpenTiebreaker}
              variant="warning"
              icon="groupUsers"
            >
              {tiebreakerDelegates
                ? t('step4.tiebreaker.viewResultsButton')
                : t('step4.tiebreaker.startButton')}
            </BaseButton>
          </div>
        </div>
      )}
      <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300">
        <BaseTextarea
          label={t('step4.comments.title')}
          id="step4-comments"
          rows={4}
          value={comments}
          onChange={setComments}
          onBlur={handleCommentsBlur}
          placeholder={t('step4.comments.placeholder')}
        />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {t('step4.results')}
        </h2>

        <Step4ResultsTable
          t={t}
          results={results}
          stats={stats}
          percentage={percentage}
          tiebreakerDelegates={tiebreakerDelegates}
        />
      </div>

      <div className="flex gap-4 mt-6 justify-center md:justify-between">
        <BaseButton onClick={() => navigate('/step2')}>
          {t('step4.backToStep2')}
        </BaseButton>
        <BaseButton
          onClick={handleClearData}
          variant="danger"
          icon="delete"
          tooltip={t('step4.clearDataTooltip')}
          outlined
          iconSize="small"
        >
          {t('step4.clearData')}
        </BaseButton>
      </div>

      <DeleteConfirmationModal
        isOpen={showClearDataModal}
        title={t('step4.clearData')}
        onCancel={() => setShowClearDataModal(false)}
        onConfirm={confirmClearData}
        confirmText={t('modals.confirm')}
        cancelText={t('modals.cancel')}
      >
        <div className="text-center text-grayDark dark:text-grayMedium flex flex-col gap-2">
          <p>{t('step4.clearDataConfirm')}</p>
        </div>
      </DeleteConfirmationModal>
    </div>
  );
};

export default Step4;
