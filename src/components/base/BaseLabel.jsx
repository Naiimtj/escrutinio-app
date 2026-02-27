import React, { useState } from 'react';

const BaseLabel = ({
  label,
  tooltip,
  mandatory = false,
  htmlFor,
  className = '',
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!label) return null;

  return (
    <div
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 dark:text-grayLight ${className}`}
      {...props}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {mandatory && <span className="text-alert">*</span>}
        {tooltip && (
          <div className="relative inline-block group">
            <i
              className="pi pi-question-circle text-gray-400 cursor-help text-xs"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseLabel;
