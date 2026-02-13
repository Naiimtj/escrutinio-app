import React, { useState } from 'react';
import BaseTextInput from './BaseTextInput';

const BaseSearchBarNoIcon = ({
  placeholder = 'Search',
  onSearch,
  ...props
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (value) => {
    setSearchInput(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <BaseTextInput
      className="min-w-[300px] bg-white"
      value={searchInput}
      placeholder={placeholder}
      hideDetails={true}
      onChange={handleChange}
      {...props}
    />
  );
};

export default BaseSearchBarNoIcon;
