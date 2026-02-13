import { useState } from 'react';
import { SearchIcon } from './icons';

const BaseSearchBar = ({
  placeholder = 'Search...',
  iconPosition = 'left',
  disabled = false,
  disableIcon = false,
  onSearch,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="flex items-center w-full px-3 py-2 border border-gray-400 hover:border-primary rounded-md focus-within:border-2 focus-within:border-textPrimary transition-colors">
      {!disableIcon && iconPosition === 'left' && (
        <SearchIcon className="text-gray-400 mr-2" />
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={searchInput}
        onChange={handleChange}
        className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
        disabled={disabled}
      />
      {!disableIcon && iconPosition === 'right' && (
        <SearchIcon className="text-gray-400 ml-2" />
      )}
    </div>
  );
};

export default BaseSearchBar;
