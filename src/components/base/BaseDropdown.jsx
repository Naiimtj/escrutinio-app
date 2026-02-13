import React, { useState } from 'react';

const BaseDropdown = ({
  options = [],
  placeholder = 'Select',
  disabled = false,
  onSelect,
  multiple = false,
  value = multiple ? [] : null,
  optionLabel = 'label',
  optionValue = 'value',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    if (onSelect) {
      onSelect(option[optionValue]);
    }
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    const selected = options.find((opt) => opt[optionValue] === value);
    return selected ? selected[optionLabel] : placeholder;
  };

  return (
    <div className={`relative w-full ${className}`} {...props}>
      <button
        onClick={handleToggle}
        disabled={disabled}
        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md bg-white text-left flex justify-between items-center hover:border-gray-400 focus:border-blue-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {getDisplayValue()}
        </span>
        <i
          className={`pi pi-chevron-down transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg z-50">
          {options && options.length > 0 ? (
            options.map((option) => (
              <button
                key={option[optionValue]}
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                {option[optionLabel]}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BaseDropdown;
