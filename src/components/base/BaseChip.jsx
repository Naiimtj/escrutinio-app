import React from 'react';

const BaseChip = ({
  label,
  icon,
  onRemove,
  disabled = false,
  color = 'blue',
  variant = 'filled',
  className = '',
  ...props
}) => {
  const colorClasses = {
    blue: {
      filled: 'bg-blue-100 text-blue-800 border-blue-200',
      outlined: 'border-2 border-blue-600 text-blue-600 bg-transparent',
    },
    red: {
      filled: 'bg-red-100 text-red-800 border-red-200',
      outlined: 'border-2 border-red-600 text-red-600 bg-transparent',
    },
    green: {
      filled: 'bg-green-100 text-green-800 border-green-200',
      outlined: 'border-2 border-green-600 text-green-600 bg-transparent',
    },
    gray: {
      filled: 'bg-gray-100 text-gray-800 border-gray-200',
      outlined: 'border-2 border-gray-600 text-gray-600 bg-transparent',
    },
  };

  const colorStyle = colorClasses[color]?.[variant] || colorClasses.blue.filled;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${colorStyle} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {icon && <i className={`${icon}`} />}
      <span>{label}</span>
      {onRemove && !disabled && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <i className="pi pi-times text-xs" />
        </button>
      )}
    </div>
  );
};

export default BaseChip;
