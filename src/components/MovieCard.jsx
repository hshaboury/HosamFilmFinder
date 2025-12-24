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
    <Link to={`/movie/${movie.imdbID}`} className="block group">
      <div className="card h-full relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Favorite Heart Icon Overlay */}
        {isInFavorites && (
          <div className="absolute top-2 right-2 z-10 bg-red-500 rounded-full p-2 shadow-lg">
            <svg
              className="w-5 h-5 text-white"
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
          <div className="w-full h-[400px] bg-gray-700 animate-pulse" />
        )}
        
        {/* Movie Poster */}
        <img
          src={posterUrl}
          alt={movie.Title}
          className={`w-full h-[400px] object-cover transition-opacity duration-300 ${
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
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {movie.Title}
          </h3>
          <p className="text-gray-400 text-sm">{movie.Year}</p>
        </div>
      </div>
    </Link>
  );
}