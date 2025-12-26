import { useNavigate } from 'react-router-dom';

export default function EmptyFavorites() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20 animate-fadeIn">
      {/* Large empty heart icon */}
      <svg
        className="w-24 h-24 mx-auto mb-6 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      {/* Message */}
      <h2 className="text-3xl font-bold mb-3 text-gray-300">No favorites yet!</h2>
      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
        Start exploring movies and add your favorites to see them here.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/')}
        className="btn-primary text-lg flex items-center gap-2 mx-auto"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Browse Movies
      </button>
    </div>
  );
}