export default function GenreTags({ genres }) {
  // Parse genres string into array
  const genreArray = genres && genres !== 'N/A' 
    ? genres.split(',').map(g => g.trim()) 
    : [];

  if (genreArray.length === 0) return null;

  // Define genre colors
  const getGenreColor = (genre) => {
    const colors = {
      'Action': 'bg-red-500/20 text-red-400',
      'Adventure': 'bg-orange-500/20 text-orange-400',
      'Comedy': 'bg-yellow-500/20 text-yellow-400',
      'Drama': 'bg-purple-500/20 text-purple-400',
      'Horror': 'bg-gray-700 text-gray-300',
      'Thriller': 'bg-pink-500/20 text-pink-400',
      'Sci-Fi': 'bg-cyan-500/20 text-cyan-400',
      'Fantasy': 'bg-indigo-500/20 text-indigo-400',
      'Romance': 'bg-rose-500/20 text-rose-400',
      'Mystery': 'bg-violet-500/20 text-violet-400',
      'Crime': 'bg-red-700/20 text-red-300',
      'Animation': 'bg-green-500/20 text-green-400',
      'Family': 'bg-blue-500/20 text-blue-400',
      'Biography': 'bg-amber-500/20 text-amber-400',
      'History': 'bg-stone-500/20 text-stone-400',
      'War': 'bg-slate-600/20 text-slate-300',
      'Western': 'bg-orange-700/20 text-orange-300',
      'Music': 'bg-fuchsia-500/20 text-fuchsia-400',
      'Sport': 'bg-emerald-500/20 text-emerald-400',
    };
    return colors[genre] || 'bg-gray-600/20 text-gray-400';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {genreArray.map((genre, index) => (
        <span
          key={index}
          className={`px-3 py-1 rounded-full text-sm font-medium ${getGenreColor(genre)}`}
        >
          {genre}
        </span>
      ))}
    </div>
  );
}