import { useState, useRef, useEffect, useCallback } from 'react';
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
  inputRef,
}) => {
  const { t } = useTranslation();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listRef = useRef(null);

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

  // Reset highlighted index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-voter-item]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!searchTerm || filteredVoters.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredVoters.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredVoters.length - 1,
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        onPersonSelect(index, filteredVoters[highlightedIndex]);
      }
    },
    [searchTerm, filteredVoters, highlightedIndex, onPersonSelect, index],
  );

  return (
    <div className="border border-gray-400 dark:border-gray-200 rounded-lg md:p-4 p-2 bg-gray-100/50 dark:bg-gray-700/50">
      <div className="flex md:flex-row flex-col items-center gap-4">
        <div className="shrink-0 md:w-24">
          <span className="font-medium text-darkPrimary dark:text-lightPrimary">
            {t('step3.vote')} {index + 1}
          </span>
        </div>

        <div className="grow relative w-full">
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
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(index, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('step3.searchPerson')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:text-gray-200! dark:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              {searchTerm && (
                <div
                  ref={listRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {filteredVoters.length > 0 ? (
                    filteredVoters.map((voter, i) => (
                      <button
                        key={voter.id}
                        data-voter-item
                        onClick={() => onPersonSelect(index, voter)}
                        onMouseEnter={() => setHighlightedIndex(i)}
                        className={`w-full text-left px-4 py-2 cursor-pointer transition ${
                          i === highlightedIndex
                            ? 'bg-lightPrimary'
                            : 'hover:bg-lightPrimary'
                        }`}
                      >
                        {getPersonFullName(voter)}
                        <span className="text-sm text-gray-500 ml-2">
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
