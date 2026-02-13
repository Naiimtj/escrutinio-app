import React, { useState, useEffect } from 'react';
import BaseLabel from './BaseLabel';

const BaseSlider = ({
  label,
  tooltip,
  mandatory = false,
  value = [0, 100],
  range = { min: 0, max: 100 },
  unit,
  step = 1,
  withInputs = false,
  onUpdate,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (e, index) => {
    const newValue = [...localValue];
    newValue[index] = parseFloat(e.target.value);

    // Ensure min doesn't exceed max
    if (index === 0 && newValue[0] > newValue[1]) {
      newValue[0] = newValue[1];
    }
    if (index === 1 && newValue[1] < newValue[0]) {
      newValue[1] = newValue[0];
    }

    setLocalValue(newValue);
    if (onUpdate) {
      onUpdate(newValue);
    }
  };

  const handleInputChange = (newVal, index) => {
    const numVal = parseFloat(newVal) || range.min || 0;
    const newValue = [...localValue];
    newValue[index] = numVal;

    // Ensure min doesn't exceed max
    if (index === 0 && newValue[0] > newValue[1]) {
      newValue[0] = newValue[1];
    }
    if (index === 1 && newValue[1] < newValue[0]) {
      newValue[1] = newValue[0];
    }

    setLocalValue(newValue);
    if (onUpdate) {
      onUpdate(newValue);
    }
  };

  const roundedValue = [
    Number.isInteger(localValue[0])
      ? localValue[0]
      : parseFloat(localValue[0].toFixed(2)),
    Number.isInteger(localValue[1])
      ? localValue[1]
      : parseFloat(localValue[1].toFixed(2)),
  ];

  const displayedLabel = unit ? `${label} (${unit})` : label;

  return (
    <div className="flex flex-col items-start w-full gap-1">
      <BaseLabel
        label={displayedLabel}
        tooltip={tooltip}
        mandatory={mandatory}
      />

      <div className="flex flex-col gap-0 w-full">
        <span className="text-sm font-medium text-gray-700">
          {roundedValue[0]} - {roundedValue[1]}
        </span>

        <div className="flex flex-row justify-between items-center w-full gap-3 my-2">
          {range.min !== undefined && (
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {range.min?.toFixed() || 0}
            </span>
          )}

          <div className="flex-1">
            <input
              type="range"
              min={range.min}
              max={range.max}
              step={step}
              value={localValue[0]}
              onChange={(e) => handleSliderChange(e, 0)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {range.max !== undefined && (
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {range.max?.toFixed() || 0}
            </span>
          )}
        </div>

        <div className="flex flex-row gap-2 justify-between mt-2">
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={step}
            value={localValue[1]}
            onChange={(e) => handleSliderChange(e, 1)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {withInputs && (
          <div className="flex flex-row gap-2 justify-between mt-3">
            <input
              type="number"
              value={localValue[0]}
              onChange={(e) => handleInputChange(e.target.value, 0)}
              min={range.min || 0}
              max={range.max || 100}
              className="w-20 px-2 py-1 border-2 border-gray-300 rounded-md outline-none focus:border-blue-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={localValue[1]}
              onChange={(e) => handleInputChange(e.target.value, 1)}
              min={range.min || 0}
              max={range.max || 100}
              className="w-20 px-2 py-1 border-2 border-gray-300 rounded-md outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseSlider;
