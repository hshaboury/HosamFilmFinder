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
          <p className="text-gray-400 text-center text-sm sm:text-base">
            Showing <span className="text-white font-semibold">{movies.length}</span> of{' '}
            <span className="text-white font-semibold">{totalResults}</span> results
          </p>
        </div>
      )}
      
      {/* Movie Grid - Responsive: 2 cols (mobile), 3 cols (tablet), 4-5 cols (desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  );
}