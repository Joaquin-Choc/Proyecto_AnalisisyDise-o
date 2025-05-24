import React from 'react';
import './index.css';

const SearchBar = () => {
  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Buscar talleres..." 
        className="search-input"
      />
      <button className="search-button">
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default SearchBar;