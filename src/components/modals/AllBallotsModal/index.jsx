import { useTranslation } from 'react-i18next';
import { BaseModal, BaseExpandableSection } from '../../base';
import BallotRow from './BallotRow';
import LockBar from './LockBar';

const AllBallotsModal = ({
  visible,
  ballots,
  rounds,
  onClose,
  onEdit,
  onDelete,
  title,
  readOnly = false,
  hasTiebreaker = false,
  locked = false,
  onUnlockRequest,
}) => {
  const { t } = useTranslation();

  const effectiveReadOnly = readOnly || locked;
  const showGrouped = readOnly && rounds?.length > 0;

  return (
    <BaseModal
      visible={visible}
      title={title ?? t('step3.allBallotsTitle')}
      onClose={onClose}
      fullWidth={true}
    >
      {!readOnly && (
        <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-4 py-3">
          <LockBar
            locked={locked}
            hasTiebreaker={hasTiebreaker}
            onUnlockRequest={onUnlockRequest}
          />
        </div>
      )}

      <div className="flex flex-col gap-2 overflow-y-auto">
        {showGrouped ? (
          rounds.map((round) => (
            <BaseExpandableSection
              key={round.roundNumber}
              title={`${t('step4.tiebreaker.round')} ${round.roundNumber} — ${round.ballots?.length ?? 0} ${t('step4.tiebreaker.ballotCount', { count: round.ballots?.length ?? 0 })}`}
              styleClass="flex flex-col gap-1"
              withoutContentPadding={false}
            >
              {(round.ballots ?? []).length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {t('step3.noMoreBallots')}
                </p>
              ) : (
                (round.ballots ?? []).map((ballot, index) => (
                  <BallotRow
                    key={ballot.id}
                    ballot={ballot}
                    index={index}
                    readOnly
                  />
                ))
              )}
            </BaseExpandableSection>
          ))
        ) : ballots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {t('step3.noMoreBallots')}
          </p>
        ) : (
          ballots.map((ballot, index) => (
            <BallotRow
              key={ballot.id}
              ballot={ballot}
              index={index}
              readOnly={effectiveReadOnly}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </BaseModal>
  );
};

export default AllBallotsModal;
