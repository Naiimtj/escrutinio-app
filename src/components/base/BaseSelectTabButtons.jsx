import React from 'react';
import BaseLabel from './BaseLabel';

const BaseSelectTabButtons = ({
  options = [],
  selected,
  size = 'md',
  label,
  tooltip,
  mandatory = false,
  onSelect,
  ...props
}) => {
  const handleSelect = (value) => {
    if (onSelect) {
      onSelect(value);
    }
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div
      className="flex flex-row items-center w-full justify-between gap-4"
      {...props}
    >
      <BaseLabel label={label} tooltip={tooltip} mandatory={mandatory} />

      <div className="group flex flex-row items-center">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`cursor-pointer bg-white px-4 py-2 shadow-md transition-all hover:font-bold hover:scale-105 ${
              sizeClasses[size]
            } ${
              option.value === selected
                ? 'bg-blue-600 text-white font-bold'
                : 'border border-gray-400'
            } ${
              index === 0
                ? 'rounded-l-md border-r border-gray-400'
                : index === options.length - 1
                ? 'rounded-r-md border-l border-gray-400'
                : 'border-l border-r border-gray-400'
            }`}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BaseSelectTabButtons;
