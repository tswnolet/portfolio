import React from 'react';

const SearchBar = ({ query, setQuery, searchMovie }) => {
    return (
        <div className="search-bar">
            <input 
                type='text' 
                placeholder="Enter movie title"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type='button' onClick={searchMovie}>Search</button>
        </div>
    );
};

export default SearchBar;