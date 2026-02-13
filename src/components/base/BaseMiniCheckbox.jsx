import React from 'react';
import { v4 as uuid } from 'uuid';
import BaseLabel from './BaseLabel';

const BaseMiniCheckbox = ({
  label,
  value = false,
  id,
  labelPosition = 'right',
  disabled = false,
  onChange,
  children,
}) => {
  const checkboxId = id || uuid();

  const handleChange = () => {
    if (onChange) {
      onChange({
        value: !value,
        id,
      });
    }
  };

  return (
    <div className="flex flex-row items-center gap-4">
      {label && labelPosition === 'left' && (
        <BaseLabel
          label={label}
          htmlFor={checkboxId}
          className="cursor-pointer text-base font-semibold"
        />
      )}

      <input
        id={checkboxId}
        type="checkbox"
        checked={value}
        onChange={handleChange}
        disabled={disabled}
        className="cursor-pointer accent-blue-600"
        style={{ width: '1rem', height: '1rem' }}
      />

      {label && labelPosition === 'right' && (
        <BaseLabel
          htmlFor={checkboxId}
          label={label}
          className="cursor-pointer text-base font-semibold"
        />
      )}

      {children}
    </div>
  );
};

export default BaseMiniCheckbox;
