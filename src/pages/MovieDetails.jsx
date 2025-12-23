import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import Loader from '../components/Loader';
import Error from '../components/Error';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
      });
    }
  };

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!movie) return <Error message="Movie not found" />;

  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="btn-secondary mb-6 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="md:col-span-1">
          <img
            src={posterUrl}
            alt={movie.Title}
            className="w-full rounded-lg shadow-lg"
          />
          <button
            onClick={handleToggleFavorite}
            className={`w-full mt-4 ${
              isFavorite(movie.imdbID) ? 'btn-secondary' : 'btn-primary'
            } flex items-center justify-center gap-2`}
          >
            {isFavorite(movie.imdbID) ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                Remove from Favorites
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to Favorites
              </>
            )}
          </button>
        </div>

        {/* Movie Info */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6 text-gray-400">
            <span>{movie.Year}</span>
            <span>•</span>
            <span>{movie.Runtime}</span>
            <span>•</span>
            <span>{movie.Rated}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Genre</h2>
            <p className="text-gray-300">{movie.Genre}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Plot</h2>
            <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Director</h2>
              <p className="text-gray-300">{movie.Director}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Actors</h2>
              <p className="text-gray-300">{movie.Actors}</p>
            </div>
          </div>

          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Ratings</h2>
              <div className="flex flex-wrap gap-4">
                {movie.Ratings.map((rating, index) => (
                  <div key={index} className="bg-gray-800 px-4 py-2 rounded-lg">
                    <div className="text-sm text-gray-400">{rating.Source}</div>
                    <div className="font-semibold">{rating.Value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Box Office</h2>
              <p className="text-gray-300">{movie.BoxOffice}</p>
            </div>
          )}

          {movie.Awards && movie.Awards !== 'N/A' && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Awards</h2>
              <p className="text-gray-300">{movie.Awards}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}