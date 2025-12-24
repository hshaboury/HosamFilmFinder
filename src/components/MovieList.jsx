import MovieCard from './MovieCard';

export default function MovieList({ movies, totalResults }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Results Count Header */}
      {totalResults > 0 && (
        <div className="mb-6">
          <p className="text-gray-400 text-center">
            Showing <span className="text-white font-semibold">{movies.length}</span> of{' '}
            <span className="text-white font-semibold">{totalResults}</span> results
          </p>
        </div>
      )}
      
      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  );
}