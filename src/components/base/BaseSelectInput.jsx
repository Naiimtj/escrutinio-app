import { useState, useRef, useEffect } from 'react';

const BaseSelectInput = ({
  options = [],
  label,
  selectedValue = '',
  placeholder,
  mandatory = false,
  disabled = false,
  noDataText = 'No data available',
  warningMessages = [],
  errorMessages = [],
  error = null, // React Hook Form error object
  loading = false,
  onSelect,
  enableSearch = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const displayLabel = label || placeholder || 'Select';

  // Determine if there's an error from either errorMessages array or error object
  const hasError = errorMessages?.length > 0 || !!error;

  // Get the error message
  const errorMessage = error?.message || errorMessages?.[0] || '';

  // Sort options alphabetically
  const sortedOptions = [...options].sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  // Find the selected option object
  const selectedOption =
    sortedOptions.find((opt) => opt.value === selectedValue) || null;

  // Filter options based on search term
  const filteredOptions = enableSearch
    ? sortedOptions.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : sortedOptions;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (onSelect) {
      onSelect(option.value);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    if (onSelect) {
      onSelect('');
    }
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && enableSearch && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  const inputClasses = `
    w-full px-3 py-2 text-sm border rounded-md pr-10
    focus:outline-none focus:ring-2 focus:ring-offset-0
    ${
      hasError
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white cursor-pointer'}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {displayLabel}
          {mandatory && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          {enableSearch && isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder || 'Search...'}
              disabled={disabled}
              className={inputClasses}
            />
          ) : (
            <div onClick={toggleDropdown} className={inputClasses}>
              {selectedOption ? (
                <span className="text-gray-900">{selectedOption.label}</span>
              ) : (
                <span className="text-gray-400">
                  {placeholder || 'Select...'}
                </span>
              )}
            </div>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
          {selectedOption && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute inset-y-0 right-8 flex items-center pr-2 hover:text-gray-700 text-gray-400"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                    option.value === selectedValue
                      ? 'bg-blue-100 font-medium'
                      : ''
                  }`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {noDataText}
              </div>
            )}
          </div>
        )}
      </div>

      {hasError && <p className="mt-1 text-xs text-red-600">{errorMessage}</p>}
      {warningMessages?.length > 0 && (
        <p className="mt-1 text-xs text-yellow-600">
          {warningMessages.map((message, index) => (
            <span key={index}>{message}</span>
          ))}
        </p>
      )}
    </div>
  );
};

export default BaseSelectInput;
