// src/components/BookSearch/BookSearch.jsx
import { useState } from 'react';
import { FaSearch, FaBook, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { booksAPI } from '../../services/api';
import { utils } from '../../utils/constants';

const BookSearch = ({ userRole = 'STUDENT' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const results = await booksAPI.search(searchQuery.trim());
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No books found matching your search criteria');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(utils.formatErrorMessage(error));
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError('');
    setHasSearched(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'from-red-500 to-red-600';
      case 'TEACHER': return 'from-blue-500 to-blue-600';
      case 'STUDENT': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {userRole === 'ADMIN' ? 'Search Library Catalog' : 
           userRole === 'TEACHER' ? 'Search Library Catalog' : 
           'Discover New Books'}
        </h3>
        
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for books, authors, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="
                w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg
                text-white placeholder-gray-400 focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:border-transparent
              "
              disabled={loading}
            />
          </div>
          
          <button 
            onClick={handleSearch}
            disabled={loading}
            className={`
              px-6 py-3 bg-gradient-to-r ${getRoleColor(userRole)}
              hover:opacity-90 text-white rounded-lg font-medium 
              transition-all duration-200 btn-hover disabled:opacity-50
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

          {hasSearched && (
            <button
              onClick={clearSearch}
              className="
                px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white 
                rounded-lg font-medium transition-all duration-200
              "
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Search Results
            </h3>
            {searchResults.length > 0 && (
              <span className="text-sm text-gray-400">
                Found {searchResults.length} book{searchResults.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
                <p className="text-gray-400">Searching books...</p>
              </div>
            </div>
          )}

          {/* Search Results List */}
          {!loading && searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  className="
                    p-4 bg-gray-700/50 border border-gray-600 rounded-lg
                    hover:border-gray-500 transition-colors duration-200
                  "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Book Icon */}
                      <div className={`
                        w-12 h-16 bg-gradient-to-br ${getRoleColor(userRole)} 
                        rounded flex items-center justify-center
                      `}>
                        <FaBook className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Book Details */}
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">
                          {book.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-2">
                          by {book.author}
                        </p>
                        
                        {/* Availability Status */}
                        <div className="flex items-center space-x-2">
                          {book.available ? (
                            <>
                              <FaCheckCircle className="text-green-400 text-sm" />
                              <span className="text-green-400 text-sm font-medium">
                                Available
                              </span>
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="text-red-400 text-sm" />
                              <span className="text-red-400 text-sm font-medium">
                                Not Available
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {book.available ? (
                        <button className={`
                          px-4 py-2 bg-gradient-to-r ${getRoleColor(userRole)}
                          hover:opacity-90 text-white rounded-lg text-sm 
                          font-medium transition-all duration-200
                        `}>
                          {userRole === 'ADMIN' ? 'Manage' : 'Borrow'}
                        </button>
                      ) : (
                        <button className="
                          px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white 
                          rounded-lg text-sm font-medium transition-all duration-200
                        ">
                          Reserve
                        </button>
                      )}
                      
                      <button className="
                        px-4 py-2 border border-gray-600 hover:border-gray-500 
                        text-gray-300 hover:text-white rounded-lg text-sm 
                        font-medium transition-all duration-200
                      ">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && hasSearched && searchResults.length === 0 && !error && (
            <div className="text-center py-8">
              <FaBook className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                No books found for "{searchQuery}"
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSearch;