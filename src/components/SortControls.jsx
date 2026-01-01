import { useState } from 'react';

export default function SortControls({ sortBy, order, onSortChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', orders: ['desc'], orderLabels: ['Best Match'] },
    { value: 'title', label: 'Title', orders: ['asc', 'desc'], orderLabels: ['A-Z', 'Z-A'] },
    { value: 'year', label: 'Year', orders: ['desc', 'asc'], orderLabels: ['Newest', 'Oldest'] },
  ];

  const currentOption = sortOptions.find((opt) => opt.value === sortBy) || sortOptions[0];
  const currentOrderIndex = currentOption.orders.indexOf(order);
  const currentOrderLabel = currentOption.orderLabels[currentOrderIndex] || currentOption.orderLabels[0];

  const handleSortSelect = (value, newOrder) => {
    onSortChange(value, newOrder);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <span className="text-gray-400 font-medium">Sort by:</span>

      {/* Desktop: Button Group */}
      <div className="hidden md:flex gap-2">
        {sortOptions.map((option) => {
          const isActive = sortBy === option.value;
          const activeOrderIndex = isActive ? currentOrderIndex : 0;

          return (
            <button
              key={option.value}
              onClick={() => {
                if (isActive) {
                  // Toggle order if already selected
                  const newOrderIndex = (activeOrderIndex + 1) % option.orders.length;
                  handleSortSelect(option.value, option.orders[newOrderIndex]);
                } else {
                  // Select with default order
                  handleSortSelect(option.value, option.orders[0]);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.label}
              {isActive && (
                <span className="ml-2 text-sm">
                  ({option.orderLabels[activeOrderIndex]})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: Dropdown */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-gray-700 text-gray-300 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {currentOption.label} ({currentOrderLabel})
          <svg
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10 min-w-[200px]">
            {sortOptions.map((option) =>
              option.orders.map((orderValue, idx) => {
                const isActive = sortBy === option.value && order === orderValue;
                return (
                  <button
                    key={`${option.value}-${orderValue}`}
                    onClick={() => handleSortSelect(option.value, orderValue)}
                    className={`block w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    {option.label} - {option.orderLabels[idx]}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}