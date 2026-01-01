import { useState, useEffect } from 'react';

/**
 * Filter controls for movie search results
 * Allows filtering by year range
 */
export default function FilterControls({ yearRange, onFilterChange, totalResults, filteredCount }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [minYear, setMinYear] = useState(yearRange.min || '');
  const [maxYear, setMaxYear] = useState(yearRange.max || '');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMinYear(yearRange.min || '');
    setMaxYear(yearRange.max || '');
  }, [yearRange]);

  const handleApplyFilter = () => {
    setError('');
    
    // Validation
    if (minYear && maxYear) {
      const min = parseInt(minYear);
      const max = parseInt(maxYear);
      
      if (min > max) {
        setError('Min year cannot be greater than max year');
        return;
      }
      
      if (min < 1888) {
        setError('Movies didn\'t exist before 1888');
        return;
      }
      
      if (max > currentYear) {
        setError(`Max year cannot be greater than ${currentYear}`);
        return;
      }
    }
    
    onFilterChange({
      min: minYear ? parseInt(minYear) : null,
      max: maxYear ? parseInt(maxYear) : null
    });
  };

  const handleClearFilter = () => {
    setMinYear('');
    setMaxYear('');
    setError('');
    onFilterChange({ min: null, max: null });
  };

  const hasActiveFilters = yearRange.min || yearRange.max;

  return (
    <div className="mb-6">
      <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl p-4 shadow-lg">
        {/* Filter Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-semibold text-gray-200">
              Filters
              {hasActiveFilters && (
                <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filter Results Display */}
        {hasActiveFilters && !isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white font-semibold">{filteredCount}</span> of{' '}
              <span className="text-white font-semibold">{totalResults}</span> results
              {yearRange.min && yearRange.max && (
                <span> • Years: {yearRange.min}-{yearRange.max}</span>
              )}
              {yearRange.min && !yearRange.max && (
                <span> • From: {yearRange.min}</span>
              )}
              {!yearRange.min && yearRange.max && (
                <span> • Until: {yearRange.max}</span>
              )}
            </p>
          </div>
        )}

        {/* Expanded Filter Controls */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Year Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Year Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Min (e.g., 1990)"
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    min="1888"
                    max={currentYear}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max (e.g., 2024)"
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    min="1888"
                    max={currentYear}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Quick Year Presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => {
                    setMinYear('2020');
                    setMaxYear(currentYear.toString());
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 transition-colors"
                >
                  Recent (2020+)
                </button>
                <button
                  onClick={() => {
                    setMinYear('2010');
                    setMaxYear('2019');
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 transition-colors"
                >
                  2010s
                </button>
                <button
                  onClick={() => {
                    setMinYear('2000');
                    setMaxYear('2009');
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 transition-colors"
                >
                  2000s
                </button>
                <button
                  onClick={() => {
                    setMinYear('1990');
                    setMaxYear('1999');
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 transition-colors"
                >
                  1990s
                </button>
                <button
                  onClick={() => {
                    setMinYear('1980');
                    setMaxYear('1989');
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 transition-colors"
                >
                  1980s
                </button>
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleApplyFilter}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
              >
                Apply Filters
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilter}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 active:scale-95"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Results Display when expanded */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Showing <span className="text-white font-semibold">{filteredCount}</span> of{' '}
                  <span className="text-white font-semibold">{totalResults}</span> results
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
