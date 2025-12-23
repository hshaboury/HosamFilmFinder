import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <Link to={`/movie/${movie.imdbID}`} className="block">
      <div className="card h-full">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-[400px] object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">{movie.Title}</h3>
          <p className="text-gray-400 text-sm">{movie.Year}</p>
        </div>
      </div>
    </Link>
  );
}