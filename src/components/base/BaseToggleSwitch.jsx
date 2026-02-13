import React from 'react';

const BaseToggleSwitch = ({
  value = false,
  disabled = false,
  onChange,
  trueValue = true,
  falseValue = false,
  ...props
}) => {
  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(value ? falseValue : trueValue);
    }
  };

  return (
    <button
      onClick={handleChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
        value ? 'bg-green-600' : 'bg-gray-300'
      } ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:opacity-80'
      }`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-1 ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default BaseToggleSwitch;
