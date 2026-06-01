import { useState } from 'react';

export function PriceRangeFilter({ minPrice, maxPrice, onPriceChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Predefined price ranges
  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: '' }
  ];

  const handleQuickSelect = (min, max) => {
    onPriceChange(min.toString(), max.toString());
  };

  const handleClear = () => {
    onPriceChange('', '');
  };

  const isRangeActive = (range) => {
    const currentMin = minPrice ? parseFloat(minPrice) : 0;
    const currentMax = maxPrice ? parseFloat(maxPrice) : Infinity;
    const rangeMin = range.min;
    const rangeMax = range.max === '' ? Infinity : range.max;
    
    return currentMin === rangeMin && currentMax === rangeMax;
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full font-semibold mb-3 text-lg text-gray-900 hover:text-primary-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Price Range
        </span>
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {/* Quick Select Buttons */}
          <div className="space-y-1.5">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(range.min, range.max)}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center justify-between group ${
                  isRangeActive(range)
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                    : 'bg-white hover:bg-primary-50 border border-gray-200 text-gray-700 hover:border-primary-300'
                }`}
              >
                <span className={`font-medium ${isRangeActive(range) ? '' : 'group-hover:text-primary-600'}`}>
                  {range.label}
                </span>
                {isRangeActive(range) && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Custom Range */}
          <div className="bg-gradient-to-br from-gray-50 to-primary-50/30 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Custom Range</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="min-price" className="block text-xs mb-1.5 text-gray-600 font-medium">
                  Min ($)
                </label>
                <input
                  id="min-price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="block text-xs mb-1.5 text-gray-600 font-medium">
                  Max ($)
                </label>
                <input
                  id="max-price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => onPriceChange(minPrice, e.target.value)}
                  placeholder="∞"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                />
              </div>
            </div>

            {/* Clear Button */}
            {(minPrice || maxPrice) && (
              <button
                onClick={handleClear}
                className="mt-3 w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Range
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
