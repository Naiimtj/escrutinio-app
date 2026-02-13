import React from 'react';
import BaseCheckbox from './BaseCheckbox';

const BaseBoxSelector = ({
  title,
  options = [],
  selectedValue = null,
  disabled = false,
  cardClasses = '',
  onSelect,
  ...props
}) => {
  const handleSelection = (key) => {
    if (!disabled && onSelect) {
      onSelect(key);
    }
  };

  return (
    <div className="rounded-sm flex flex-col gap-4" {...props}>
      <div className="flex flex-row items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="flex flex-wrap gap-4 w-full max-w-full">
        {options.map((option) => (
          <div
            key={option.key}
            onClick={() => handleSelection(option.key)}
            className={`border border-gray-300 bg-gray-50 hover:bg-gray-100 p-4 rounded-sm flex flex-row items-start gap-8 w-full cursor-pointer shadow-md max-w-fit transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${cardClasses}`}
          >
            <div className="flex flex-col items-start gap-2">
              <span className="text-lg truncate text-gray-900 font-medium">
                {option.label}
              </span>
              {option.description && (
                <span className="text-sm text-gray-600">
                  {option.description}
                </span>
              )}
            </div>
            <BaseCheckbox
              value={selectedValue === option.key}
              id={option.key}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseBoxSelector;
