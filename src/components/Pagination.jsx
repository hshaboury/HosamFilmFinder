/**
 * Pagination component for navigating through pages of movie results
 * @param {number} currentPage - Current active page
 * @param {number} totalResults - Total number of results
 * @param {number} resultsPerPage - Number of results per page (default: 10 from OMDb API)
 * @param {function} onPageChange - Callback when page changes
 */
export default function Pagination({ currentPage, totalResults, resultsPerPage = 10, onPageChange }) {
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Don't show pagination if there's only one page or no results
  if (totalPages <= 1) return null;

  // Calculate the page range to show
  const getPageRange = () => {
    const delta = 2; // Pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Calculate the range around current page
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Always include last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots where there are gaps
    let prev = 0;
    for (const page of range) {
      if (page - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  const pageRange = getPageRange();

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top smoothly when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 my-8 px-2">
      {/* Page Info */}
      <div className="text-sm text-gray-400">
        Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
        <span className="text-white font-semibold">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg font-medium transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            currentPage === 1
              ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-95'
          }`}
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        {pageRange.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                page === currentPage
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-95'
              }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg font-medium transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            currentPage === totalPages
              ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-95'
          }`}
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Quick Jump Buttons for mobile */}
      <div className="flex items-center gap-2 sm:hidden">
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-all min-h-[44px] ${
            currentPage === 1
              ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-95'
          }`}
        >
          First
        </button>
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-all min-h-[44px] ${
            currentPage === totalPages
              ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-95'
          }`}
        >
          Last
        </button>
      </div>
    </div>
  );
}
