import React, { useState } from 'react';
import BaseIcon from './BaseIcon';

const BaseExpandableSection = ({
  title,
  disabledHighlight = false,
  styleClass = 'flex flex-col gap-2 items-start',
  withoutContentPadding = false,
  isOpenInitially = false,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  const toggleOpening = () => {
    setIsOpen(!isOpen);
  };

  const dynamicClass = disabledHighlight
    ? 'flex flex-col items-start w-full'
    : `flex flex-col items-start w-full rounded-sm border-solid shadow-md hover:shadow-lg ${
        isOpen
          ? 'border-[1.5px] border-textPrimary'
          : 'border border-gray-300 hover:border-textPrimary'
      }`;

  return (
    <div className={dynamicClass} {...props}>
      <div
        className="cursor-pointer p-4 flex flex-row items-center hover:text-textPrimary w-full justify-start gap-4 rounded-sm hover:bg-gray-50 transition-colors group"
        onClick={toggleOpening}
      >
        <BaseIcon
          icon={isOpen ? 'arrowDown' : 'arrowRight'}
          className="group-hover:stroke-textPrimary"
        />
        <span className="text-2xl font-medium">{title}</span>
      </div>

      {isOpen && (
        <div
          className={`w-full ${
            withoutContentPadding ? '' : 'px-4 pb-6'
          } ${styleClass}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default BaseExpandableSection;
