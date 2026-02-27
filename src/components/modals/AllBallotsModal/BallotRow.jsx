import { useTranslation } from 'react-i18next';
import { BaseIcon } from '../../base';
import { getPersonFullName } from '../../../utils/helpers';

const VoteItem = ({ vote, index }) => (
  <div
    className="text-sm text-gray-700 dark:text-gray-300 truncate"
    title={`${getPersonFullName(vote.person)}${
      vote.person.location && !vote.person.isInvalid
        ? ` (${vote.person.location})`
        : ''
    }`}
  >
    <span className="font-medium text-gray-500 mr-1">{index + 1}.</span>
    {getPersonFullName(vote.person)}
    {vote.person.location && !vote.person.isInvalid && (
      <span className="text-xs text-gray-500 ml-1">
        ({vote.person.location})
      </span>
    )}
  </div>
);

const BallotRow = ({ ballot, index, readOnly, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg p-4 bg-white dark:bg-gray-700 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <h3 className="w-28 text-base flex items-center gap-4 font-semibold text-gray-800 dark:text-white">
          {t('step3.ballot')} #{ballot.number}
        </h3>

        {ballot.votes.length === 0 ? (
          <div className="flex justify-between items-center gap-4 w-full">
            {ballot.isNull && (
              <span className="text-sm text-red-600 font-normal">
                {t('step3.nullBallotLabel')}
              </span>
            )}
            <p className="text-sm text-gray-500 italic">{t('step3.noVotes')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 w-4/5 gap-2 items-center justify-center">
            {ballot.votes.map((vote, voteIndex) => (
              <VoteItem key={voteIndex} vote={vote} index={voteIndex} />
            ))}
          </div>
        )}

        {!readOnly && (
          <div className="flex gap-2">
            <BaseIcon
              icon="edit"
              onClick={() => onEdit(index)}
              className="cursor-pointer stroke-primary hover:stroke-darkPrimary transition-colors"
              tooltip={t('step3.editBallot')}
              tooltipPosition="downleft"
            />
            <BaseIcon
              icon="delete"
              onClick={() => onDelete(ballot)}
              className="relative cursor-pointer stroke-alert hover:stroke-red-800 transition-colors"
              tooltip={t('step3.deleteBallot')}
              tooltipPosition="downleft"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BallotRow;
