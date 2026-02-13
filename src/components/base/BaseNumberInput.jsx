/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';

const BaseNumberInput = React.forwardRef(
  (
    {
      label,
      value,
      placeholder,
      hideDetails = false,
      mandatory = false,
      disabled = false,
      hint,
      helperText,
      error = false,
      errorMessages = [],
      warningMessages = [],
      onChange,
      onBlur,
      field,
      formatSeparator,
      formatEvery = 3,
      maxDigits,
      className = '',
      ...props
    },
    ref,
  ) => {
    const [localError, setLocalError] = useState('');
    const currentValue = field?.value ?? value ?? '';

    const formatWithSeparator = (numString, separator, every) => {
      if (!separator || !numString) return numString;
      const cleaned = numString.replace(/[.\-]/g, '');
      if (!cleaned) return '';

      const groups = [];
      for (let i = 0; i < cleaned.length; i += every) {
        groups.push(cleaned.slice(i, i + every));
      }
      return groups.join(separator);
    };

    const removeFormat = (str) => (str ? str.replace(/[.\-]/g, '') : '');

    useEffect(() => {
      if (formatSeparator && currentValue) {
        const cleaned = removeFormat(String(currentValue));
        if (/^\d+$/.test(cleaned)) {
          const formatted = formatWithSeparator(
            cleaned,
            formatSeparator,
            formatEvery,
          );
          if (formatted !== String(currentValue)) {
            if (field) field.onChange(formatted);
            else if (onChange) onChange(formatted);
          }
        }
      }
    }, [currentValue, formatSeparator]);

    const handleChange = (e) => {
      const inputValue = e.target.value;

      if (inputValue === '') {
        setLocalError('');
        if (field) field.onChange('');
        else if (onChange) onChange('');
        return;
      }

      const cleanValue = removeFormat(inputValue);

      if (!/^\d*$/.test(cleanValue)) return;
      if (maxDigits && cleanValue.length > maxDigits) return;

      const formattedValue = formatSeparator
        ? formatWithSeparator(cleanValue, formatSeparator, formatEvery)
        : cleanValue;

      setLocalError('');
      if (field) field.onChange(formattedValue);
      else if (onChange) onChange(formattedValue);
    };

    const handleBlur = (e) => {
      if (mandatory && !e.target.value) {
        setLocalError('Este campo es obligatorio');
      }
      if (field) field.onBlur();
      if (onBlur) onBlur(e);
    };

    const displayError = error || !!localError || errorMessages.length > 0;
    const displayHelperText =
      localError ||
      errorMessages[0] ||
      warningMessages[0] ||
      helperText ||
      hint;
    const displayLabel = mandatory && label ? `${label} *` : label;

    const inputClasses = `
      w-full px-3 py-2 text-sm border rounded-md
      focus:outline-none focus:ring-2 focus:ring-offset-0
      ${
        displayError
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      }
      ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
      ${className}
    `;

    return (
      <div className="w-full">
        {displayLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {displayLabel}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          type="text"
          inputMode="numeric"
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={mandatory}
          className={inputClasses}
        />
        {!hideDetails && displayHelperText && (
          <p
            className={`mt-1 text-xs ${
              displayError
                ? 'text-red-600'
                : warningMessages.length > 0
                  ? 'text-yellow-600'
                  : 'text-gray-500'
            }`}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  },
);

BaseNumberInput.displayName = 'BaseNumberInput';

export default BaseNumberInput;
