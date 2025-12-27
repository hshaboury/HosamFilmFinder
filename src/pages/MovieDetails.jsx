import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import MovieDetailsSkeleton from '../components/MovieDetailsSkeleton';
import RatingsDisplay from '../components/RatingsDisplay';
import GenreTags from '../components/GenreTags';
import MovieInfo from '../components/MovieInfo';
import Error from '../components/Error';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [searchParams] = useSearchParams();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandPlot, setExpandPlot] = useState(false);
  const [heartAnimate, setHeartAnimate] = useState(false);

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
    
    // Trigger heart animation
    setHeartAnimate(true);
    setTimeout(() => setHeartAnimate(false), 600);
    
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

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    getMovieDetails(id)
      .then(data => setMovie(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleBack = () => {
    const q = searchParams.get('q');
    if (window.history.length > 1) {
      navigate(-1);
    } else if (q) {
      navigate({ pathname: '/', search: `?q=${encodeURIComponent(q)}` });
    } else {
      navigate('/');
    }
  };

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (runtime) => {
    if (!runtime || runtime === 'N/A') return null;
    const minutes = parseInt(runtime);
    if (isNaN(minutes)) return runtime;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}min`;
    }
  };

  // Format released date
  const formatReleaseDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) return <MovieDetailsSkeleton />;
  if (error) return <Error message={error} onRetry={handleRetry} />;
  if (!movie) return <Error message="Movie not found" />;

  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
  const plot = movie.Plot !== 'N/A' ? movie.Plot : 'No plot available.';
  const shouldTruncatePlot = plot.length > 300;
  const displayPlot = shouldTruncatePlot && !expandPlot ? plot.substring(0, 300) + '...' : plot;
  const formattedRuntime = formatRuntime(movie.Runtime);
  const formattedReleaseDate = formatReleaseDate(movie.Released);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fadeIn max-w-7xl min-h-screen">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="btn-primary mb-6 flex items-center gap-2 transition-all hover:gap-3 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Search
      </button>

      <div className="flex flex-col md:grid md:grid-cols-5 lg:grid-cols-3 gap-6 md:gap-8 px-2 sm:px-0">
        {/* Poster Section - Stacked on mobile, side-by-side on tablet/desktop */}
        <div className="md:col-span-2 lg:col-span-1">
          <img
            src={posterUrl}
            alt={`${movie.Title} poster`}
            loading="lazy"
            className="w-full rounded-lg shadow-lg aspect-[2/3] object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            }}
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`w-full mt-4 flex items-center justify-center gap-2 transition-all min-h-[44px] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 active:scale-95 ${
              isFavorite(movie.imdbID) 
                ? 'bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4' 
                : 'btn-primary'
            } ${heartAnimate ? 'animate-pulse' : ''}`}
          >
            {isFavorite(movie.imdbID) ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="hidden sm:inline">Remove from Favorites</span>
                <span className="sm:hidden">Remove</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">Add to Favorites</span>
                <span className="sm:hidden">Add</span>
              </>
            )}
          </button>
        </div>

        {/* Movie Details Section */}
        <div className="md:col-span-3 lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
              {movie.Title} {movie.Year !== 'N/A' && <span className="text-gray-400 text-xl sm:text-2xl md:text-3xl">({movie.Year})</span>}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-400 text-sm sm:text-base">
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className="px-2 py-1 border border-gray-500 rounded text-xs sm:text-sm font-semibold">
                  {movie.Rated}
                </span>
              )}
              {formattedRuntime && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>{formattedRuntime}</span>
                </>
              )}
            </div>
          </div>

          {/* Ratings */}
          <RatingsDisplay movie={movie} />

          {/* Genre Tags */}
          {movie.Genre && movie.Genre !== 'N/A' && (
            <div>
              <GenreTags genres={movie.Genre} />
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-700" />

          {/* Plot */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-300">Plot</h2>
            <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{displayPlot}</p>
            {shouldTruncatePlot && (
              <button
                onClick={() => setExpandPlot(!expandPlot)}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 active:scale-95"
              >
                {expandPlot ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Divider */}
          <hr className="border-gray-700" />

          {/* Cast & Crew */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-300">Cast & Crew</h2>
            <MovieInfo 
              director={movie.Director}
              writer={movie.Writer}
              actors={movie.Actors}
            />
          </div>

          {/* Divider */}
          <hr className="border-gray-700" />

          {/* Additional Information */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-300">Additional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              {formattedReleaseDate && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Released</h3>
                  <p className="text-gray-200">{formattedReleaseDate}</p>
                </div>
              )}
              
              {movie.Country && movie.Country !== 'N/A' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Country</h3>
                  <p className="text-gray-200">{movie.Country}</p>
                </div>
              )}
              
              {movie.Language && movie.Language !== 'N/A' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Language</h3>
                  <p className="text-gray-200">{movie.Language}</p>
                </div>
              )}
              
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Box Office</h3>
                  <p className="text-gray-200 font-semibold">{movie.BoxOffice}</p>
                </div>
              )}
              
              {movie.Production && movie.Production !== 'N/A' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Production</h3>
                  <p className="text-gray-200">{movie.Production}</p>
                </div>
              )}
            </div>

            {/* Awards */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                  🏆 Awards
                </h3>
                <p className="text-gray-200 text-sm sm:text-base">{movie.Awards}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}