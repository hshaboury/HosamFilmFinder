import { useState, useRef, useEffect } from 'react';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { useDebounce } from '../hooks/useDebounce';
import HighlightText from './HighlightText';

export default function SearchBar({ onSearch, placeholder = 'Search for movies...', loading = false }) {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  const { suggestions, showSuggestions, fetchSuggestions, clearSuggestions, hideSuggestions } = useAutocomplete(2);
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery, fetchSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        hideSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = (searchQuery = null) => {
    const searchTerm = searchQuery || query;
    setValidationError('');
    
    if (!searchTerm.trim()) {
      setValidationError('Please enter a search term');
      return;
    }
    
    if (searchTerm.trim().length < 3) {
      setValidationError('Please enter at least 3 characters');
      return;
    }
    
    clearSuggestions();
    setSelectedIndex(-1);
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setQuery('');
    setValidationError('');
    clearSuggestions();
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (movie) => {
    setQuery(movie.Title);
    performSearch(movie.Title);
  };

  const handleKeyDown = (e) => {
    // If suggestions are showing, handle keyboard navigation
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            const selectedMovie = suggestions[selectedIndex];
            setQuery(selectedMovie.Title);
            performSearch(selectedMovie.Title);
          } else {
            performSearch();
          }
          break;
        
        case 'Escape':
          hideSuggestions();
          setSelectedIndex(-1);
          break;
        
        default:
          break;
      }
    } else if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-6 sm:mb-8">
      <div className="flex flex-col gap-2 relative">
        <div className="relative flex flex-col sm:flex-row gap-2">
          {/* Search Icon */}
          <div className="absolute left-4 top-3 sm:top-1/2 sm:-translate-y-1/2 text-gray-400 pointer-events-none z-10">
            <svg
              className="w-5 h-5 sm:w-5 sm:h-5"
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setValidationError('');
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.length >= 2 && suggestions.length > 0) {
                fetchSuggestions(query);
              }
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 sm:py-3 text-base sm:text-base bg-gray-900/70 backdrop-blur-md text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 min-h-[44px] border border-gray-800 shadow-lg"
            aria-label="Search for movies"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showSuggestions}
            disabled={loading}
          />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 sm:right-[7.5rem] sm:top-1/2 sm:-translate-y-1/2 text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded active:scale-95"
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
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 active:scale-95 transition-transform"
            disabled={loading}
            aria-label="Search"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
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
                <span className="hidden sm:inline">Searching...</span>
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>
        
        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            id="search-suggestions"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
          >
            {suggestions.map((movie, index) => (
              <button
                key={movie.imdbID}
                type="button"
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => handleSuggestionClick(movie)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-800/80 transition-colors text-left border-b border-gray-800 last:border-b-0 ${
                  index === selectedIndex ? 'bg-gray-800/80' : ''
                }`}
              >
                {/* Movie Poster Thumbnail */}
                <div className="flex-shrink-0 w-12 h-16 bg-gray-800 rounded overflow-hidden">
                  {movie.Poster && movie.Poster !== 'N/A' ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">
                    <HighlightText text={movie.Title} query={query} />
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    {movie.Year && <span>{movie.Year}</span>}
                    {movie.Type && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{movie.Type}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Validation Error */}
        {validationError && (
          <p className="text-red-400 text-sm pl-4">{validationError}</p>
        )}
      </div>
    </form>
  );
}