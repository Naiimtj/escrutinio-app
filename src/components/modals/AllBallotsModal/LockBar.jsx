import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseIcon, BaseButton } from '../../base';

// Handles the locked/unlocked editing state, including tiebreaker unlock confirmation
const LockBar = ({ locked, hasTiebreaker, onUnlockRequest }) => {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClickUnlock = () => {
    if (hasTiebreaker) {
      setShowConfirm(true);
    } else {
      onUnlockRequest?.();
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onUnlockRequest?.();
  };

  if (!locked) {
    return (
      <div className="flex items-center gap-3 justify-center">
        <BaseIcon
          icon="lockOpen"
          size="small"
          className="fill-green-600 dark:fill-green-400"
        />
        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
          {t('step3.tiebreakerLock.unlockedMessage')}
        </span>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
          <BaseIcon
            icon="alert"
            size="small"
            className="fill-amber-600 dark:fill-amber-400"
          />
          <span className="text-sm font-semibold">
            {t('step3.tiebreakerLock.warningTitle')}
          </span>
        </div>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t('step3.tiebreakerLock.warningMessage')}
        </p>
        <div className="flex gap-2 mt-1">
          <BaseButton size="small" variant="danger" onClick={handleConfirm}>
            {t('step3.tiebreakerLock.confirmUnlock')}
          </BaseButton>
          <BaseButton
            size="small"
            variant="secondary"
            onClick={() => setShowConfirm(false)}
          >
            {t('step3.tiebreakerLock.cancelUnlock')}
          </BaseButton>
        </div>
      </div>
    );
  }

  return (
    <BaseButton
      icon="lock"
      iconPosition="left"
      iconClassName="fill-amber-600 dark:fill-amber-400 group-hover:fill-amber-800 dark:group-hover:fill-amber-200 transition-colors"
      text={true}
      className="group w-full justify-start"
      variant="warning"
      onClick={handleClickUnlock}
    >
      <span className="text-sm text-amber-700 dark:text-amber-300 group-hover:text-amber-900 dark:group-hover:text-amber-200 font-medium transition-colors">
        {t('step3.tiebreakerLock.lockedMessage')}
      </span>
      <span className="text-xs text-amber-500 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-200 underline ml-auto transition-colors">
        {t('step3.tiebreakerLock.clickToUnlock')}
      </span>
    </BaseButton>
  );
};

export default LockBar;
