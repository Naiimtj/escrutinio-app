import { extractInitialTiebreakerInfo, getAllBallots } from '../../service';
import { getPersonFullName } from '../../utils/helpers';

export const buildMainResults = () => {
  const ballots = getAllBallots();
  const voteCounts = {};

  ballots.forEach((ballot) => {
    if (!ballot.isNull && ballot.votes) {
      ballot.votes.forEach((vote) => {
        if (vote.person && !vote.person.isInvalid) {
          const key = getPersonFullName(vote.person);
          voteCounts[key] = (voteCounts[key] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(voteCounts)
    .map(([name, votes]) => ({ name, votes }))
    .sort((a, b) => b.votes - a.votes);
};

export const buildInitialState = (mainResults, delegates) => {
  const { confirmedDelegates, tiedCandidates, winnersNeeded } =
    extractInitialTiebreakerInfo(mainResults, delegates);
  return {
    confirmedDelegates,
    rounds: [],
    finalDelegates: null,
    completed: false,
    currentTiedCandidates: tiedCandidates,
    currentWinnersNeeded: winnersNeeded,
  };
};
