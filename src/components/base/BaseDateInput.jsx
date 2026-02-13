import React, { useState } from 'react';
import BaseLabel from './BaseLabel';

const BaseDateInput = ({
  label,
  value,
  tooltip,
  mandatory = false,
  disabled = false,
  clearable = false,
  range = false,
  onChange,
}) => {
  const [date, setDate] = useState(
    value || (range ? [new Date(), new Date()] : new Date())
  );

  const handleDateChange = (e) => {
    const inputValue = e.target.value;
    setDate(inputValue);
    if (onChange) {
      onChange(inputValue);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    if (Array.isArray(date)) {
      return date.map((d) => {
        if (typeof d === 'string') return d;
        return new Date(d).toISOString().split('T')[0];
      });
    }
    if (typeof date === 'string') return date;
    return new Date(date).toISOString().split('T')[0];
  };

  const dateValue = formatDateForInput(date);

  return (
    <div className="flex flex-col items-start w-full gap-1">
      <BaseLabel label={label} tooltip={tooltip} mandatory={mandatory} />

      {range ? (
        <div className="flex gap-2 w-full">
          <input
            type="date"
            value={Array.isArray(dateValue) ? dateValue[0] : ''}
            onChange={handleDateChange}
            disabled={disabled}
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={Array.isArray(dateValue) ? dateValue[1] : ''}
            onChange={handleDateChange}
            disabled={disabled}
            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      ) : (
        <input
          type="date"
          value={typeof dateValue === 'string' ? dateValue : ''}
          onChange={handleDateChange}
          disabled={disabled}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        />
      )}

      {clearable && date && (
        <button
          onClick={() => {
            setDate(range ? [new Date(), new Date()] : new Date());
            if (onChange) {
              onChange(null);
            }
          }}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default BaseDateInput;
