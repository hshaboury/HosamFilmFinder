export default function RatingsDisplay({ movie }) {
  // Extract ratings from the movie object
  const imdbRating = movie.imdbRating !== 'N/A' ? movie.imdbRating : null;
  const imdbVotes = movie.imdbVotes !== 'N/A' ? movie.imdbVotes : null;
  const metascore = movie.Metascore !== 'N/A' ? movie.Metascore : null;
  
  // Find Rotten Tomatoes rating from Ratings array
  const rottenTomatoesRating = movie.Ratings?.find(
    r => r.Source === 'Rotten Tomatoes'
  )?.Value;

  // Get Metacritic color based on score
  const getMetacriticColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 60) return 'text-green-500 bg-green-500/20';
    if (numScore >= 40) return 'text-yellow-500 bg-yellow-500/20';
    return 'text-red-500 bg-red-500/20';
  };

  // Get Rotten Tomatoes icon and color
  const getRottenTomatoesStyle = (rating) => {
    if (!rating) return null;
    const percentage = parseInt(rating);
    const isFresh = percentage >= 60;
    return {
      emoji: isFresh ? '🍅' : '🤢',
      color: isFresh ? 'text-green-500' : 'text-red-500'
    };
  };

  const rtStyle = rottenTomatoesRating ? getRottenTomatoesStyle(rottenTomatoesRating) : null;

  // If no ratings available, return null
  if (!imdbRating && !rottenTomatoesRating && !metascore) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* IMDb Rating */}
      {imdbRating && (
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-3 rounded-lg">
          <span className="text-yellow-500 text-xl">⭐</span>
          <div>
            <div className="font-bold text-lg">{imdbRating}/10</div>
            {imdbVotes && (
              <div className="text-xs text-gray-400">IMDb ({imdbVotes} votes)</div>
            )}
          </div>
        </div>
      )}

      {/* Rotten Tomatoes */}
      {rottenTomatoesRating && rtStyle && (
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-3 rounded-lg">
          <span className="text-2xl">{rtStyle.emoji}</span>
          <div>
            <div className={`font-bold text-lg ${rtStyle.color}`}>{rottenTomatoesRating}</div>
            <div className="text-xs text-gray-400">Rotten Tomatoes</div>
          </div>
        </div>
      )}

      {/* Metacritic */}
      {metascore && (
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-3 rounded-lg">
          <div className={`w-10 h-10 flex items-center justify-center rounded font-bold ${getMetacriticColor(metascore)}`}>
            {metascore}
          </div>
          <div>
            <div className="font-semibold text-sm">Metacritic</div>
            <div className="text-xs text-gray-400">Metascore</div>
          </div>
        </div>
      )}
    </div>
  );
}