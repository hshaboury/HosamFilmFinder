import { useFavorites } from '../context/FavoritesContext';
import MovieList from '../components/MovieList';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <svg className="w-20 h-20 animate-pulse" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 58s-20-12.8-20-28A12 12 0 0 1 32 18a12 12 0 0 1 20 12c0 15.2-20 28-20 28z" fill="#EF4444" stroke="#DC2626" strokeWidth="3" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-400">Start adding movies to your favorites list</p>
        </div>
      ) : (
        <MovieList movies={favorites} />
      )}
    </div>
  );
}