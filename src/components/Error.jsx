export default function Error({ message, error, onRetry }) {
  // Determine error type and icon
  const getErrorDisplay = () => {
    if (error?.type === 'NO_RESULTS') {
      return {
        icon: '🔍',
        title: 'No Results Found',
        suggestions: [
          'Check your spelling',
          'Try different keywords',
          'Use more general terms'
        ]
      };
    }
    
    if (error?.type === 'TOO_MANY_RESULTS') {
      return {
        icon: '📝',
        title: 'Too Many Results',
        suggestions: [
          'Be more specific with your search',
          'Add the year or actor name',
          'Try using the full movie title'
        ]
      };
    }
    
    if (error?.type === 'NETWORK_ERROR') {
      return {
        icon: '🔌',
        title: 'Network Error',
        suggestions: [
          'Check your internet connection',
          'Try again in a moment'
        ],
        canRetry: true
      };
    }
    
    if (error?.type === 'API_ERROR') {
      return {
        icon: '⚠️',
        title: 'API Error',
        suggestions: [
          'The service might be temporarily unavailable',
          'Please try again later'
        ],
        canRetry: true
      };
    }
    
    // Default error
    return {
      icon: '⚠️',
      title: 'Something Went Wrong',
      suggestions: ['Please try again'],
      canRetry: true
    };
  };

  const errorDisplay = getErrorDisplay();
  const errorMessage = error?.message || message || 'An unexpected error occurred';

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center px-4">
      <div className="text-5xl sm:text-6xl mb-4">
        {errorDisplay.icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold mb-2">{errorDisplay.title}</h3>
      <p className="text-gray-400 max-w-md mb-4 text-sm sm:text-base">{errorMessage}</p>
      
      {errorDisplay.suggestions && errorDisplay.suggestions.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 max-w-md mb-4">
          <p className="text-sm font-semibold mb-2">Suggestions:</p>
          <ul className="text-sm text-gray-400 text-left list-disc list-inside">
            {errorDisplay.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      
      {errorDisplay.canRetry && onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary px-6 py-3 mt-4 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 transition-transform"
        >
          Try Again
        </button>
      )}
    </div>
  );
}