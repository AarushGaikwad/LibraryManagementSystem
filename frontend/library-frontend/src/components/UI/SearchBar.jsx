// src/components/UI/SearchBar.jsx
import { useState, useCallback } from 'react';
import { FaSearch, FaSpinner, FaTimes } from 'react-icons/fa';
import { booksAPI } from '../../services/api';
import { utils } from '../../utils/constants';

const SearchBar = ({ 
  userRole = 'STUDENT',   // Default role   
  onSearchResults = null,
  onSearchStart = null,
  placeholder = "Search for books, authors, or subjects...",
  compact = true,
  showResults = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    utils.debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const results = await booksAPI.search(query.trim());
        setSearchResults(results);
        setShowDropdown(results.length > 0);
        
        // Call parent callback if provided
        if (onSearchResults) {
          onSearchResults(results, query);
        }
      } catch (error) {
        console.error('Search error:', error);
        setError(utils.formatErrorMessage(error));
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 300),
    [onSearchResults]
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    if (onSearchStart) {
      onSearchStart(searchQuery.trim());
    }

    setLoading(true);
    setError('');

    try {
      const results = await booksAPI.search(searchQuery.trim());
      setSearchResults(results);
      
      if (onSearchResults) {
        onSearchResults(results, searchQuery.trim());
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(utils.formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (error) setError('');
    
    // Trigger debounced search
    if (showResults) {
      debouncedSearch(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError('');
    setShowDropdown(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'from-red-500 to-red-600';
      case 'TEACHER': return 'from-blue-500 to-blue-600';
      case 'STUDENT': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const handleResultClick = (book) => {
    setShowDropdown(false);
    if (onSearchResults) {
      onSearchResults([book], searchQuery, 'select');
    }
  };

  return (
    <div className="relative">
      {/* Search Input Container */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => showResults && searchResults.length > 0 && setShowDropdown(true)}
            className={`
              w-full pl-10 pr-10 bg-gray-700 border border-gray-600 rounded-lg
              text-white placeholder-gray-400 focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${compact ? 'py-2 text-sm' : 'py-3'}
            `}
            disabled={loading}
          />
          
          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <FaSpinner className="animate-spin text-gray-400" />
            </div>
          )}
          
          {/* Clear Button */}
          {searchQuery && !loading && (
            <button
              onClick={clearSearch}
              className="
                absolute right-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 hover:text-white transition-colors p-1
              "
            >
              <FaTimes className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {/* Search Button */}
        {!compact && (
          <button 
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className={`
              px-6 py-3 bg-gradient-to-r ${getRoleColor(userRole)}
              hover:opacity-90 text-white rounded-lg font-medium 
              transition-all duration-200 disabled:opacity-50
              disabled:cursor-not-allowed flex items-center space-x-2
            `}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <FaSearch />
                <span>Search</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showResults && showDropdown && searchResults.length > 0 && (
        <div className="
          absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 
          rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto
        ">
          <div className="p-2">
            <div className="text-xs text-gray-400 p-2 border-b border-gray-700">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </div>
            {searchResults.slice(0, 5).map((book) => (
              <button
                key={book.id}
                onClick={() => handleResultClick(book)}
                className="
                  w-full p-3 text-left hover:bg-gray-700 rounded-lg
                  transition-colors duration-200 border-b border-gray-700 last:border-b-0
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{book.title}</p>
                    <p className="text-gray-400 text-xs">by {book.author}</p>
                  </div>
                  <div className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${book.available 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                    }
                  `}>
                    {book.available ? 'Available' : 'Not Available'}
                  </div>
                </div>
              </button>
            ))}
            {searchResults.length > 5 && (
              <div className="text-center p-2 text-xs text-gray-400">
                and {searchResults.length - 5} more...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-900/50 border border-red-700 rounded-lg z-50">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;