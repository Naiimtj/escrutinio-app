import React, { useState } from 'react';
import BaseIcon from './BaseIcon';

const BaseHorizontalExpandCollapse = ({
  title,
  styleClass = 'flex flex-col gap-2 items-start',
  iconOpen = 'pi-chevron-down',
  iconClose = 'pi-chevron-right',
  isOnlyIcon = false,
  noTitleClose = false,
  noTitleOpen = false,
  tooltip,
  isInitiallyOpen = false,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const toggleOpening = () => {
    setIsOpen(!isOpen);
  };

  const dynamicClass = isOpen
    ? 'relative bg-white flex flex-col items-end gap-2'
    : 'relative bg-white w-auto';

  const buttonClass = isOnlyIcon
    ? 'cursor-pointer p-1 hover:text-blue-600 transition-colors'
    : 'flex flex-row items-center gap-1 cursor-pointer p-1 hover:text-blue-600 transition-colors justify-end';

  const buttonPosition = isOpen ? 'absolute' : '';

  const showTitle = (isOpen && !noTitleOpen) || (!isOpen && !noTitleClose);

  return (
    <div className={dynamicClass} {...props}>
      <div
        className={`${buttonPosition} ${buttonClass}`}
        onClick={toggleOpening}
      >
        {!isOnlyIcon ? (
          <>
            <i className={`pi ${isOpen ? iconOpen : iconClose}`} />
            {showTitle && (
              <span className="text-base group-hover:text-blue-600 transition-colors">
                {title}
              </span>
            )}
          </>
        ) : (
          <BaseIcon
            icon={isOpen ? iconOpen : iconClose}
            tooltip={tooltip}
            size="md"
          />
        )}
      </div>

      {isOpen && <div className={`pb-6 w-full ${styleClass}`}>{children}</div>}
    </div>
  );
};

export default BaseHorizontalExpandCollapse;
