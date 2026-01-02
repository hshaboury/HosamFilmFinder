import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import Error from '../components/Error';
import Pagination from '../components/Pagination';
import FilterControls from '../components/FilterControls';
import SortControls from '../components/SortControls';
import { useLocalStorage } from '../hooks/userLocalStorage';
import { useMovieSearch } from '../hooks/useMovieSearch';

const MAX_HISTORY_ITEMS = 5;


export default function Home() {
  const { movies, loading, error, totalResults, currentPage, search, clearResults } = useMovieSearch();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);
  const [lastQuery, setLastQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Sorting and Filtering state
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [yearRange, setYearRange] = useState({ min: null, max: null });
  
  // Popular movies for landing page
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularLoading, setPopularLoading] = useState(false);
  const carouselRef = useRef(null);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Filter and sort movies
  const processedMovies = useMemo(() => {
    let filtered = [...movies];

    // Apply year range filter
    if (yearRange.min || yearRange.max) {
      filtered = filtered.filter((movie) => {
        const year = parseInt(movie.Year);
        if (isNaN(year)) return false;
        if (yearRange.min && year < yearRange.min) return false;
        if (yearRange.max && year > yearRange.max) return false;
        return true;
      });
    }

    // Apply sorting
    if (sortBy === 'title') {
      filtered.sort((a, b) => {
        const comparison = a.Title.localeCompare(b.Title);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    } else if (sortBy === 'year') {
      filtered.sort((a, b) => {
        const yearA = parseInt(a.Year) || 0;
        const yearB = parseInt(b.Year) || 0;
        return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
      });
    }
    // For 'relevance', keep the original order from API

    return filtered;
  }, [movies, sortBy, sortOrder, yearRange]);

  const handleSearch = async (query) => {
    if (!query || query === lastQuery) return;
    setLastQuery(query);
    setHasSearched(true);
    // Reset filters and sorting on new search
    setSortBy('relevance');
    setSortOrder('desc');
    setYearRange({ min: null, max: null });
    setSearchParams({ q: query, page: '1' });
    await search(query, 1);
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    updateURLParams({ sortBy: newSortBy, sortOrder: newOrder });
  };

  const handleFilterChange = (newYearRange) => {
    setYearRange(newYearRange);
    updateURLParams({ 
      yearMin: newYearRange.min?.toString() || null,
      yearMax: newYearRange.max?.toString() || null
    });
  };

  const updateURLParams = (updates) => {
    const params = {
      q: lastQuery,
      page: currentPage.toString(),
      sortBy,
      sortOrder,
      ...(yearRange.min && { yearMin: yearRange.min.toString() }),
      ...(yearRange.max && { yearMax: yearRange.max.toString() }),
      ...updates
    };
    // Remove null/undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = async (page) => {
    if (!lastQuery) return;
    updateURLParams({ page: page.toString() });
    await search(lastQuery, page);
  };

  const handleHistoryClick = (query) => {
    setSearchParams({ q: query });
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
    setSortBy('relevance');
    setSortOrder('desc');
    setYearRange({ min: null, max: null });
    setSearchParams({});
  };

  // Carousel navigation handlers
  const handleScrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setIsManualScrolling(true);
      setTimeout(() => setIsManualScrolling(false), 1000);
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setIsManualScrolling(true);
      setTimeout(() => setIsManualScrolling(false), 1000);
    }
  };

  // Handle infinite scroll loop
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || popularMovies.length === 0) return;

    const handleScroll = () => {
      const scrollWidth = carousel.scrollWidth;
      const scrollLeft = carousel.scrollLeft;
      const clientWidth = carousel.clientWidth;
      
      // Calculate the width of one set of movies
      const oneSetWidth = scrollWidth / 3;
      
      // If we've scrolled past 2 sets, jump back to the start of the second set
      if (scrollLeft >= oneSetWidth * 2) {
        carousel.scrollLeft = scrollLeft - oneSetWidth;
      }
      // If we've scrolled before the first set, jump forward
      else if (scrollLeft <= 0) {
        carousel.scrollLeft = oneSetWidth;
      }
    };

    carousel.addEventListener('scroll', handleScroll);
    // Set initial position to middle set
    carousel.scrollLeft = carousel.scrollWidth / 3;

    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [popularMovies]);

  // Auto-scroll effect
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || popularMovies.length === 0) return;

    let animationFrameId;
    let lastTimestamp = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const autoScroll = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      if (!isHovering && !isManualScrolling && deltaTime > 16) { // ~60fps
        carousel.scrollLeft += scrollSpeed;
        lastTimestamp = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [popularMovies, isHovering, isManualScrolling]);

  // Fetch popular movies on mount
  useEffect(() => {
    const fetchPopularMovies = async () => {
      const popularTitles = ['Inception', 'Interstellar', 'The Dark Knight', 'Avengers', 'The Matrix', 'Titanic', 'Avatar', 'Gladiator'];
      setPopularLoading(true);
      
      try {
        const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
        const movies = [];
        
        for (const title of popularTitles) {
          const result = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
          const data = await result.json();
          if (data.Response === 'True') {
            movies.push(data);
          }
        }
        
        setPopularMovies(movies);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      } finally {
        setPopularLoading(false);
      }
    };
    
    fetchPopularMovies();
  }, []);

  // On mount, check for query param and auto-search
  useEffect(() => {
    const q = searchParams.get('q');
    const page = searchParams.get('page');
    const urlSortBy = searchParams.get('sortBy');
    const urlSortOrder = searchParams.get('sortOrder');
    const urlYearMin = searchParams.get('yearMin');
    const urlYearMax = searchParams.get('yearMax');
    
    if (q) {
      setLastQuery(q);
      setHasSearched(true);
      
      // Restore filters and sorting from URL
      if (urlSortBy) setSortBy(urlSortBy);
      if (urlSortOrder) setSortOrder(urlSortOrder);
      if (urlYearMin || urlYearMax) {
        setYearRange({
          min: urlYearMin ? parseInt(urlYearMin) : null,
          max: urlYearMax ? parseInt(urlYearMax) : null
        });
      }
      
      search(q, page ? parseInt(page) : 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen">
      {/* Welcome Hero Section */}
      {!loading && !error && !hasSearched && (
        <div className="text-center mb-8 sm:mb-12">
          {/* Animated Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <svg className="w-24 h-24 sm:w-32 sm:h-32 animate-bounce" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              {/* Glow effect */}
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse"></div>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            Discover Movies
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 font-light">
            Your gateway to the world of cinema
          </p>
        </div>
      )}
      
      {/* Header for search results */}
      {hasSearched && (
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8  bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradien">Discover Movies</h1>
      )}
      
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Search History */}
      {!hasSearched && searchHistory.length > 0 && (
        <div className="max-w-3xl mx-auto mb-6 sm:mb-8 bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-300">Recent Searches</h3>
            <button
              onClick={handleClearHistory}
              className="text-sm font-medium text-gray-200 bg-gray-900/60 border border-gray-700/40 hover:bg-gray-800/80 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.4)] px-4 py-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 flex items-center gap-1"
            >
              Clear History
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((query, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(query)}
                className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-sm transition-colors min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 border border-gray-700/40"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State with Skeleton Loaders */}
      {loading && (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
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

      {/* Popular Movies Section */}
      {!loading && !error && !hasSearched && (
        <div className="px-2 sm:px-0 mt-12">
          {/* Explore Popular Movies */}
          <div className="max-w-full mx-auto overflow-hidden">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                  {/* <svg className="w-8 h-8 text-yellow-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg> */}
                  Popular Movies
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-yellow-500 via-yellow-500 to-transparent"></div>
              </div>
              <p className="text-gray-400 text-base sm:text-lg">Click on any movie to discover more details</p>
            </div>
            
            {popularLoading ? (
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-48 sm:w-56">
                    <MovieCardSkeleton />
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="relative group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Left Navigation Arrow */}
                <button
                  onClick={handleScrollLeft}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-gray-900/90 hover:bg-gray-800 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 shadow-lg backdrop-blur-sm"
                  aria-label="Scroll left"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Navigation Arrow */}
                <button
                  onClick={handleScrollRight}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-gray-900/90 hover:bg-gray-800 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 shadow-lg backdrop-blur-sm"
                  aria-label="Scroll right"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Gradient overlays for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a23] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a23] to-transparent z-10 pointer-events-none"></div>
                
                {/* Scrolling container */}
                <div 
                  ref={carouselRef} 
                  className="overflow-x-scroll scrollbar-hide scroll-smooth"
                  style={{ scrollBehavior: isManualScrolling ? 'smooth' : 'auto' }}
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* First set of movies */}
                    {popularMovies.map((movie) => (
                      <div key={`first-${movie.imdbID}`} className="flex-shrink-0 w-48 sm:w-56">
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                    {/* Duplicate set for infinite scroll */}
                    {popularMovies.map((movie) => (
                      <div key={`second-${movie.imdbID}`} className="flex-shrink-0 w-48 sm:w-56">
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                    {/* Third set for smoother infinite scroll */}
                    {popularMovies.map((movie) => (
                      <div key={`third-${movie.imdbID}`} className="flex-shrink-0 w-48 sm:w-56">
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results with Total Count */}
      {!loading && !error && hasSearched && (
        <>
          {totalResults > 0 && (
            <div className="text-center mb-6 px-2 sm:px-0">
              <p className="text-lg sm:text-xl">
                Found <span className="text-blue-400 font-bold">{totalResults}</span> movies
                {lastQuery && (
                  <span className="text-gray-400"> for "{lastQuery}"</span>
                )}
              </p>
              <button
                onClick={handleClearSearch}
                className="mt-2 text-m font-medium text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-md transition-all mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
              >
                Clear Search
              </button>
            </div>
          )}
          
          {/* Filter and Sort Controls */}
          {movies.length > 0 && (
            <>
              <FilterControls
                yearRange={yearRange}
                onFilterChange={handleFilterChange}
                totalResults={movies.length}
                filteredCount={processedMovies.length}
              />
              <SortControls
                sortBy={sortBy}
                order={sortOrder}
                onSortChange={handleSortChange}
              />
            </>
          )}
          
          <MovieList movies={processedMovies} totalResults={totalResults} currentPage={currentPage} />
          
          {/* No results after filtering */}
          {movies.length > 0 && processedMovies.length === 0 && (
            <div className="text-center py-12 px-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-gray-300">No movies match your filters</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filter settings</p>
              <button
                onClick={() => setYearRange({ min: null, max: null })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
              >
                Clear Filters
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {totalResults > 10 && (
            <Pagination
              currentPage={currentPage}
              totalResults={totalResults}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}