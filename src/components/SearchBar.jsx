import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search for movies...', loading = false }) {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    setValidationError('');
    
    if (!query.trim()) {
      setValidationError('Please enter a search term');
      return;
    }
    
    if (query.trim().length < 3) {
      setValidationError('Please enter at least 3 characters');
      return;
    }
    
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    setValidationError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex flex-col gap-2">
        <div className="relative flex gap-2">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setValidationError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 pl-12 pr-12 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search for movies"
            disabled={loading}
          />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-[7.5rem] top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
              disabled={loading}
            >
              <svg
                className="w-5 h-5"
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
          
          {/* Search Button */}
          <button
            type="submit"
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            aria-label="Search"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Searching...
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>
        
        {/* Validation Error */}
        {validationError && (
          <p className="text-red-400 text-sm pl-4">{validationError}</p>
        )}
      </div>
    </form>
  );
}