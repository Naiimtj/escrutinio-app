import React from 'react';

const BaseCounter = ({
  count = 0,
  limitMin,
  limitMax,
  onIncrement,
  onDecrement,
  onChange,
  ...props
}) => {
  const isAtMaxLimit = limitMax !== undefined && count === limitMax;
  const isAtMinLimit = limitMin !== undefined && count === limitMin;

  const handleIncrement = () => {
    if (!isAtMaxLimit && onIncrement) {
      onIncrement();
    }
  };

  const handleDecrement = () => {
    if (!isAtMinLimit && onDecrement) {
      onDecrement();
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (
      (limitMin === undefined || value >= limitMin) &&
      (limitMax === undefined || value <= limitMax)
    ) {
      if (onChange) {
        onChange(value);
      }
    }
  };

  return (
    <div
      className="flex flex-row items-center text-lg outline outline-gray-300 w-fit rounded-sm"
      {...props}
    >
      <button
        onClick={handleDecrement}
        disabled={isAtMinLimit}
        className="bg-gray-100 h-10 w-10 px-4 py-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <input
        type="number"
        value={count}
        onChange={handleInputChange}
        className="w-16 text-center bg-white outline-none"
        style={{
          borderRadius: 0,
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'textfield',
        }}
      />
      <button
        onClick={handleIncrement}
        disabled={isAtMaxLimit}
        className="bg-gray-100 h-10 w-10 m-auto px-4 py-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default BaseCounter;
