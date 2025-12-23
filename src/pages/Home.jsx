import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { searchMovies } from '../services/api';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Discover Movies</h1>
      
      <SearchBar onSearch={handleSearch} />

      {loading && <Loader />}

      {error && <Error message={error} />}

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
          <p className="text-gray-400">Search for your favorite movies above to get started</p>
        </div>
      )}

      {!loading && !error && hasSearched && <MovieList movies={movies} />}
    </div>
  );
}