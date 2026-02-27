import { useTranslation } from 'react-i18next';
import { BaseCheckbox, BaseIcon } from './base';
import { getPersonFullName, filterVotersByName } from '../utils/helpers';

const VoteInput = ({
  index,
  vote,
  searchTerm,
  voters,
  currentBallot,
  onPersonSelect,
  onNullVote,
  onSearchChange,
}) => {
  const { t } = useTranslation();

  // Get IDs of already selected voters in this ballot (excluding current vote and null votes)
  const selectedVoterIds = currentBallot
    .map((v, i) => {
      if (i === index || !v.person || v.person.isInvalid) return null;
      return v.person.id;
    })
    .filter(Boolean);

  // Filter voters by search term and exclude already selected ones
  const filteredVoters = filterVotersByName(voters, searchTerm).filter(
    (voter) => !selectedVoterIds.includes(voter.id),
  );

  return (
    <div className="border border-gray-400 dark:border-gray-200 rounded-lg p-4 bg-gray-100/50 dark:bg-gray-700/50">
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-24">
          <span className="font-medium text-darkPrimary dark:text-lightPrimary">
            {t('step3.vote')} {index + 1}
          </span>
        </div>

        <div className="grow relative">
          {vote.person ? (
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-lightPrimary rounded-lg">
              <div
                className={
                  vote.person.isInvalid ? 'text-red-600' : 'text-gray-800'
                }
              >
                {getPersonFullName(vote.person)}{' '}
                {!vote.person.isInvalid && (
                  <span className="text-xs">({vote.person.location})</span>
                )}
              </div>
              {!vote.isNull && (
                <BaseIcon
                  icon="close"
                  size="md"
                  color="#dc2626"
                  className="hover:opacity-80 cursor-pointer"
                  onClick={() => onPersonSelect(index, null)}
                />
              )}
            </div>
          ) : (
            <>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(index, e.target.value)}
                placeholder={t('step3.searchPerson')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:text-gray-200! "
              />
              {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto ">
                  {filteredVoters.length > 0 ? (
                    filteredVoters.map((voter) => (
                      <button
                        key={voter.id}
                        onClick={() => onPersonSelect(index, voter)}
                        className="w-full text-left px-4 py-2 hover:bg-lightPrimary cursor-pointer transition "
                      >
                        {getPersonFullName(voter)}
                        <span className="text-sm text-gray-500 ml-2 ">
                          ({voter.location})
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500 italic">
                      {filterVotersByName(voters, searchTerm).length > 0
                        ? t('step3.alreadySelected')
                        : t('step3.noResults')}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="shrink-0">
          <BaseCheckbox
            checked={vote.isNull}
            onChange={(isChecked) => onNullVote(index, isChecked)}
            label={t('step3.nullVote')}
          />
        </div>
      </div>
    </div>
  );
};

export default VoteInput;
