import React, { useState } from 'react';

const BaseTableInput = ({
  type = 'string',
  value,
  disabled = false,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (newValue) => {
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'date':
        return (
          <input
            type="date"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-500"
          />
        );
      case 'single':
      case 'multiple':
        return (
          <select
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-500"
          >
            <option value="">Select...</option>
          </select>
        );
      case 'switch':
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(inputValue)}
            onChange={(e) => handleChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 border border-gray-300 rounded accent-blue-600"
          />
        );
      case 'number':
      case 'float':
        return (
          <input
            type="number"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            step={type === 'float' ? '0.01' : '1'}
            className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-500"
          />
        );
      case 'json':
        return (
          <textarea
            value={
              typeof inputValue === 'string'
                ? inputValue
                : JSON.stringify(inputValue, null, 2)
            }
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-500 font-mono text-xs"
            rows="3"
          />
        );
      case 'text':
      default:
        return (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-500"
          />
        );
    }
  };

  return (
    <div className="table-input w-full" {...props}>
      {renderInput()}
    </div>
  );
};

export default BaseTableInput;
