const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';
const TIMEOUT_MS = 10000; // 10 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000; // Base delay for exponential backoff

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
      const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    throw error;
  }
}

/**
 * Retry logic for failed requests
 */
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchWithTimeout(url, options);
    } catch (error) {
      lastError = error;
      if (i < retries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}

/**
 * Categorize API errors
 */
function categorizeError(errorMessage) {
  const message = errorMessage.toLowerCase();
  
  if (message.includes('movie not found') || message.includes('not found')) {
    return {
      type: 'NO_RESULTS',
      message: 'No movies found matching your search'
    };
  }
  
  if (message.includes('too many results')) {
    return {
      type: 'TOO_MANY_RESULTS',
      message: 'Too many results found. Please be more specific with your search'
    };
  }
  
  if (message.includes('invalid api key') || message.includes('unauthorized')) {
    return {
      type: 'API_ERROR',
      message: 'API configuration error. Please contact support'
    };
  }
  
  if (message.includes('network') || message.includes('timeout') || message.includes('connection')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your internet connection'
    };
  }
  
  return {
    type: 'API_ERROR',
    message: errorMessage || 'An unexpected error occurred'
  };
}

/**
 * Search for movies with pagination support
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Object} Result object with movies, totalResults, and currentPage
 */
export async function searchMovies(query, page = 1) {
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=${page}`;
    const response = await fetchWithRetry(url);
    const data = await response.json();

    if (data.Response === 'False') {
      const error = categorizeError(data.Error);
      return {
        success: false,
        error,
        movies: [],
        totalResults: 0,
        currentPage: page
      };
    }

    return {
      success: true,
      movies: data.Search || [],
      totalResults: parseInt(data.totalResults) || 0,
      currentPage: page
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    const categorizedError = categorizeError(error.message);
    return {
      success: false,
      error: categorizedError,
      movies: [],
      totalResults: 0,
      currentPage: page
    };
  }
}

export async function getMovieDetails(imdbId) {
  try {  
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`;
    const response = await fetchWithRetry(url);
    const data = await response.json();

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }

    return data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
}