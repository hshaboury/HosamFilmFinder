/**
 * Component to highlight matching text in autocomplete suggestions
 * @param {string} text - The full text to display
 * @param {string} query - The search query to highlight
 */
export default function HighlightText({ text, query }) {
  if (!query || !text) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();
        return (
          <span
            key={index}
            className={isMatch ? 'font-bold text-blue-400' : ''}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}
