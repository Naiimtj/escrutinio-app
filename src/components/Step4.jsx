import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import { getFromLocalStorage, STORAGE_KEYS } from '../utils/localStorage';
import { getPersonFullName } from '../utils/helpers';
import { buttonStyles } from '../utils/styles';
import StatCard from './StatCard';

const Step4 = ({ onBack }) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState({});
  const [results, setResults] = useState([]);

  useEffect(() => {
    calculateResults();
  }, []);

  const calculateResults = () => {
    const configuration = getFromLocalStorage(STORAGE_KEYS.CONFIGURATION);
    const voters = getFromLocalStorage(STORAGE_KEYS.VOTER_LIST) || [];
    const ballots = getFromLocalStorage(STORAGE_KEYS.BALLOTS) || [];

    setConfig(configuration);

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
      validBallots.length * (configuration?.votes || 0);
    const validVotes = Object.values(voteCounts).reduce(
      (sum, count) => sum + count,
      0,
    );

    setStats({
      totalVoters: voters.length,
      totalBallots: ballots.length,
      nullBallots: ballots.length - validBallots.length,
      validBallots: validBallots.length,
      invalidNames: invalidNamesCount,
      totalPossibleVotes,
      validVotes,
    });

    setResults(sortedResults);
  };

  const generatePDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = 20;

    const checkPageBreak = (needed = 20) => {
      if (y > pageHeight - needed) {
        pdf.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    // Title
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text(t('step4.title'), pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Configuration
    if (config) {
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      const configLines = [
        `${t('step2.form.areaName')}: ${config.areaName}`,
        `${t('step2.form.delegates')}: ${config.delegates}`,
        `${t('step2.form.scrutineers')}: ${config.scrutineers}`,
        `${t('step2.form.scrutineersNames')}: ${config.scrutineersNames}`,
      ];
      configLines.forEach((line) => {
        pdf.text(line, 20, y);
        y += 7;
      });
      y += 5;
    }

    // Statistics
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Estadísticas', 20, y);
    y += 7;

    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    const statLines = [
      `${t('step4.statistics.totalVoters')}: ${stats.totalVoters}`,
      `${t('step4.statistics.totalBallots')}: ${stats.totalBallots}`,
      `${t('step4.statistics.validBallots')}: ${stats.validBallots}`,
      `${t('step4.statistics.nullBallots')}: ${stats.nullBallots}`,
      `${t('step4.statistics.invalidNames')}: ${stats.invalidNames}`,
      `${t('step4.statistics.totalPossibleVotes')}: ${stats.totalPossibleVotes}`,
      `${t('step4.statistics.validVotes')}: ${stats.validVotes}`,
    ];

    statLines.forEach((line) => {
      checkPageBreak();
      pdf.text(line, 20, y);
      y += 6;
    });

    y += 10;

    // Results
    checkPageBreak(40);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(t('step4.results'), 20, y);
    y += 10;

    // Table header
    const drawTableHeader = () => {
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.text('#', 20, y);
      pdf.text(t('step4.name'), 35, y);
      pdf.text(t('step4.votes'), pageWidth - 40, y);
      y += 7;
      pdf.setFont(undefined, 'normal');
    };

    drawTableHeader();

    // Table rows
    results.forEach((result, index) => {
      if (checkPageBreak(15)) {
        drawTableHeader();
      }

      pdf.text((index + 1).toString(), 20, y);
      const nameLines = pdf.splitTextToSize(result.name, pageWidth - 70);
      pdf.text(nameLines, 35, y);
      pdf.text(result.votes.toString(), pageWidth - 40, y);
      y += Math.max(7, nameLines.length * 5);
    });

    // Footer
    pdf.setFontSize(8);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, pageHeight - 10);

    pdf.save(`escrutinio_${config?.areaName || 'results'}_${Date.now()}.pdf`);
  };

  const percentage = useMemo(() => {
    return stats.validVotes > 0
      ? (number) => ((number / stats.validVotes) * 100).toFixed(2)
      : () => '0.00';
  }, [stats.validVotes]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t('step4.title')}
        </h1>
        <button
          onClick={generatePDF}
          className={`${buttonStyles.primary} flex items-center gap-2`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {t('step4.downloadPDF')}
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Estadísticas / Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label={t('step4.statistics.totalVoters')}
            value={stats.totalVoters}
            color="blue"
          />
          <StatCard
            label={t('step4.statistics.totalBallots')}
            value={stats.totalBallots}
            color="green"
          />
          <StatCard
            label={t('step4.statistics.validBallots')}
            value={stats.validBallots}
            color="yellow"
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
          <StatCard
            label={t('step4.statistics.totalPossibleVotes')}
            value={stats.totalPossibleVotes}
            color="purple"
          />
          <StatCard
            label={t('step4.statistics.validVotes')}
            value={stats.validVotes}
            color="indigo"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {t('step4.results')}
        </h2>

        {results.length > 0 ? (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('step4.votes')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result, index) => (
                  <tr
                    key={result.name}
                    className={index < 3 ? 'bg-yellow-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {result.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {result.votes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {percentage(result.votes)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No hay resultados disponibles
          </p>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button onClick={onBack} className={buttonStyles.secondary}>
          {t('step4.backToVoting')}
        </button>
      </div>
    </div>
  );
};

export default Step4;
