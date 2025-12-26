import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';

export default function MovieCard({ movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isFavorite } = useFavorites();
  const isInFavorites = isFavorite(movie.imdbID);
  
  const posterUrl = movie.Poster !== 'N/A' && !imageError
    ? movie.Poster
    : 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';

  return (
    <Link to={`/movie/${movie.imdbID}`} className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
      <div className="card h-full relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-[1.02]">
        {/* Favorite Heart Icon Overlay */}
        {isInFavorites && (
          <div className="absolute top-2 right-2 z-10 bg-red-500 rounded-full p-2 shadow-lg min-w-[32px] min-h-[32px] flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        
        {/* Image Loading State */}
        {!imageLoaded && !imageError && (
          <div className="w-full aspect-[2/3] bg-gray-700 animate-pulse" />
        )}
        
        {/* Movie Poster */}
        <img
          src={posterUrl}
          alt={movie.Title}
          loading="lazy"
          className={`w-full aspect-[2/3] object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          style={!imageLoaded ? { position: 'absolute' } : {}}
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
  );
}