import { useState, useEffect, useCallback, useRef } from 'react';
import { searchMovies } from '../services/api';

/**
 * Custom hook for autocomplete functionality
 * Fetches movie suggestions as user types
 */
export function useAutocomplete(minChars = 2) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchSuggestions = useCallback(async (query) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query || query.length < minChars) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const result = await searchMovies(query, 1);
      
      if (result.success && result.movies.length > 0) {
        // Limit to top 5 suggestions
        setSuggestions(result.movies.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } finally {
      setLoading(false);
    }
  }, [minChars]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    setLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const hideSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    suggestions,
    loading,
    showSuggestions,
    fetchSuggestions,
    clearSuggestions,
    hideSuggestions
  };
}
