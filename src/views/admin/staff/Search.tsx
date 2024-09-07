import React, { ChangeEvent } from 'react';

type SearchBarProps = {
  query: string;
  setQuery: (query: string) => void;
  placeholder: string;
  width: number;
};

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, placeholder, width }) => {
  const handleInputChange = ( e: ChangeEvent<HTMLInputElement> ) => {
    setQuery(e.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder={placeholder}
      style={{ width: `${width}px` }}
      className="border rounded-md p-2"
    />
  );
};

export default SearchBar;
