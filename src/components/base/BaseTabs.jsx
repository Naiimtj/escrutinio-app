import React from 'react';

const BaseTabs = ({ options = [], size = 'md', onSelectTab, ...props }) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const handleSelectTab = (key) => {
    if (onSelectTab) {
      onSelectTab(key);
    }
  };

  return (
    <div
      className="flex flex-row items-center justify-between border-b border-gray-200"
      {...props}
    >
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => handleSelectTab(option.key)}
          className={`relative py-2 px-6 text-center cursor-pointer transition-colors duration-200 ${
            sizeClasses[size] || sizeClasses.md
          } ${
            option.isSelected
              ? 'font-bold text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="block">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BaseTabs;
