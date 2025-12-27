import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import EmptyFavorites from '../components/EmptyFavorites';
import SortControls from '../components/SortControls';
import ConfirmModal from '../components/ConfirmModal';

const REMOVE_ANIMATION_DURATION = 300; // milliseconds - matches CSS animation

export default function Favorites() {
  const { favorites, removeFavorite, clearAllFavorites, getFavoritesSorted } = useFavorites();
  
  // State for sorting
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem('favoritesSortBy') || 'dateAdded';
  });
  const [order, setOrder] = useState(() => {
    return localStorage.getItem('favoritesSortOrder') || 'desc';
  });
  
  // State for modals and animations
  const [clearAllModalOpen, setClearAllModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState(null);
  const [removingMovies, setRemovingMovies] = useState(new Set());

  // Get sorted favorites
  const sortedFavorites = getFavoritesSorted(sortBy, order);

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    localStorage.setItem('favoritesSortBy', newSortBy);
    localStorage.setItem('favoritesSortOrder', newOrder);
  };

  const handleRemoveClick = (movie, event) => {
    event.preventDefault();
    event.stopPropagation();
    setMovieToRemove(movie);
    setRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (movieToRemove) {
      // Add to removing set for animation
      setRemovingMovies((prev) => new Set(prev).add(movieToRemove.imdbID));
      
      // Wait for animation before removing
      setTimeout(() => {
        removeFavorite(movieToRemove.imdbID);
        setRemovingMovies((prev) => {
          const newSet = new Set(prev);
          newSet.delete(movieToRemove.imdbID);
          return newSet;
        });
      }, REMOVE_ANIMATION_DURATION);
    }
    setRemoveModalOpen(false);
    setMovieToRemove(null);
  };

  const handleCancelRemove = () => {
    setRemoveModalOpen(false);
    setMovieToRemove(null);
  };

  const handleClearAllClick = () => {
    setClearAllModalOpen(true);
  };

  const handleConfirmClearAll = () => {
    clearAllFavorites();
    setClearAllModalOpen(false);
  };

  const handleCancelClearAll = () => {
    setClearAllModalOpen(false);
  };

  // Empty state
  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <EmptyFavorites />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 flex flex-wrap items-center gap-3">
          My Favorites
          <span className="bg-blue-600 text-white text-lg sm:text-xl font-semibold px-3 py-1 rounded-full">
            {favorites.length}
          </span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base">
          {favorites.length === 1 ? '1 movie' : `${favorites.length} movies`} in your collection
        </p>
      </div>

      {/* Divider */}
      <hr className="border-gray-700 mb-4 sm:mb-6" />

      {/* Sort Controls and Clear All Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 px-2 sm:px-0">
        <SortControls sortBy={sortBy} order={order} onSortChange={handleSortChange} />
        
        <button
          onClick={handleClearAllClick}
          disabled={favorites.length === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
        >
          Clear All Favorites
        </button>
      </div>

      {/* Divider */}
      <hr className="border-gray-700 mb-6 sm:mb-8" />

      {/* Movie Grid - Responsive: 2 cols (mobile), 3 cols (tablet), 4-5 cols (desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 animate-fadeIn">
        {sortedFavorites.map((movie) => (
          <div
            key={movie.imdbID}
            className={`relative transition-all duration-300 ${
              removingMovies.has(movie.imdbID) ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            <Link to={`/movie/${movie.imdbID}`} className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
              <div className="card h-full relative overflow-hidden bg-gradient-to-br from-[#1a0b2e]/80 to-[#020617]/90 border border-purple-500/20 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-[1.02]">
                {/* Movie Poster */}
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster'}
                  alt={movie.Title}
                  loading="lazy"
                  className="w-full aspect-[2/3] object-cover"
                />
                
                {/* Movie Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                    {movie.Title}
                  </h3>
                  <p className="text-gray-400 text-sm">{movie.Year}</p>
                </div>
              </div>
            </Link>
            
            {/* Remove Button */}
            <button
              onClick={(e) => handleRemoveClick(movie, e)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10 min-w-[32px] min-h-[32px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
              aria-label={`Remove ${movie.Title} from favorites`}
              title="Remove from favorites"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Remove Confirmation Modal */}
      <ConfirmModal
        isOpen={removeModalOpen}
        title="Remove from Favorites?"
        message={movieToRemove ? `Are you sure you want to remove "${movieToRemove.Title}" from your favorites?` : ''}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        variant="danger"
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmModal
        isOpen={clearAllModalOpen}
        title="Clear All Favorites?"
        message={`Are you sure you want to remove all ${favorites.length} ${favorites.length === 1 ? 'movie' : 'movies'} from your favorites? This action cannot be undone.`}
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={handleConfirmClearAll}
        onCancel={handleCancelClearAll}
        variant="danger"
      />
    </div>
  );
}