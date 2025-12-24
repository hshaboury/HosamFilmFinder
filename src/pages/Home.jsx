import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import Error from '../components/Error';
import { useLocalStorage } from '../hooks/userLocalStorage';
import { useMovieSearch } from '../hooks/useMovieSearch';

const MAX_HISTORY_ITEMS = 5;

export default function Home() {
  const { movies, loading, error, totalResults, search, clearResults } = useMovieSearch();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);
  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = async (query) => {
    if (!query || query === lastQuery) return;
    
    setLastQuery(query);
    setHasSearched(true);
    await search(query);
    
    // Add to search history
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const handleHistoryClick = (query) => {
    handleSearch(query);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleSearch(lastQuery);
    }
  };

  const handleClearSearch = () => {
    clearResults();
    setHasSearched(false);
    setLastQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Discover Movies</h1>
      
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Search History */}
      {!hasSearched && searchHistory.length > 0 && (
        <div className="max-w-3xl mx-auto mb-8 bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-400">Recent Searches</h3>
            <button
              onClick={handleClearHistory}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear History
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((query, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(query)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State with Skeleton Loaders */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <Error 
          message={error.message} 
          error={error}
          onRetry={handleRetry}
        />
      )}

      {/* Welcome State */}
      {!loading && !error && !hasSearched && (
        <div className="text-center py-12">

          <div className="mb-4 flex justify-center">
              <svg className="w-20 h-20 animate-bounce" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="24" width="48" height="28" rx="4" fill="#6366F1" />
                <rect x="8" y="16" width="48" height="12" rx="2" fill="#A5B4FC" />
                <rect x="12" y="18" width="8" height="8" rx="1" fill="#6366F1" />
                <rect x="24" y="18" width="8" height="8" rx="1" fill="#6366F1" />
                <rect x="36" y="18" width="8" height="8" rx="1" fill="#6366F1" />
                <rect x="48" y="18" width="8" height="8" rx="1" fill="#6366F1" />
                <rect x="16" y="32" width="32" height="12" rx="2" fill="#fff" />
                <rect x="20" y="36" width="6" height="4" rx="1" fill="#6366F1" />
                <rect x="30" y="36" width="6" height="4" rx="1" fill="#6366F1" />
                <rect x="40" y="36" width="6" height="4" rx="1" fill="#6366F1" />
              </svg>
          </div>

          <h2 className="text-2xl font-semibold mb-2">Welcome to MovieSearch</h2>
          <p className="text-gray-400 mb-4">
            Search for your favorite movies above to get started
          </p>
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-400 mb-2">💡 Tips:</p>
            <ul className="text-sm text-gray-400 text-left space-y-1">
              <li>• Enter at least 3 characters to search</li>
              <li>• Try searching for "Batman", "Avengers", or "Star Wars"</li>
              <li>• Click on any movie to see full details</li>
              <li>• Add movies to your favorites for quick access</li>
            </ul>
          </div>
        </div>
      )}

      {/* Results with Total Count */}
      {!loading && !error && hasSearched && (
        <>
          {totalResults > 0 && (
            <div className="text-center mb-6">
              <p className="text-xl">
                Found <span className="text-blue-400 font-bold">{totalResults}</span> movies
                {lastQuery && (
                  <span className="text-gray-400"> for "{lastQuery}"</span>
                )}
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
          <MovieList movies={movies} totalResults={totalResults} />
        </>
      )}
    </div>
  );
}