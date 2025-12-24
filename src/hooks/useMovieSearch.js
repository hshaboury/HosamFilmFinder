import { useState } from 'react';
import { searchMovies } from '../services/api';

/**
 * Custom hook that encapsulates movie search logic
 * @returns {Object} Search state and functions
 */
export function useMovieSearch() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const search = async (query, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const result = await searchMovies(query, page);
      
      if (result.success) {
        setMovies(result.movies);
        setTotalResults(result.totalResults);
      } else {
        setError(result.error);
        setMovies([]);
        setTotalResults(0);
      }
    } catch (err) {
      setError({
        type: 'NETWORK_ERROR',
        message: err.message || 'An unexpected error occurred'
      });
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setMovies([]);
    setError(null);
    setTotalResults(0);
  };

  return {
    movies,
    loading,
    error,
    totalResults,
    search,
    clearResults
  };
}