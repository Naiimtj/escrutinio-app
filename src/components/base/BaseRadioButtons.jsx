import React, { useState } from 'react';
import BaseLabel from './BaseLabel';

const BaseRadioButtons = ({
  options = [],
  selectedValue,
  onChange,
  ...props
}) => {
  const [localSelected, setLocalSelected] = useState(selectedValue);

  const handleChange = (value) => {
    setLocalSelected(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-row items-center gap-4" {...props}>
      {options.map((option) => (
        <div key={option.value.toString()} className="flex items-center">
          <input
            id={option.value.toString()}
            type="radio"
            name="radio-group"
            value={option.value}
            checked={localSelected === option.value}
            onChange={() => handleChange(option.value)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <BaseLabel
            htmlFor={option.value.toString()}
            label={option.label}
            className="ml-2 cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
};

export default BaseRadioButtons;
