import { useState } from 'react';

export function SortDropdown({ sortBy, onSortChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const sortOptions = [
    { 
      value: '', 
      label: 'Default',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      value: 'price-asc', 
      label: 'Price: Low to High',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      )
    },
    { 
      value: 'price-desc', 
      label: 'Price: High to Low',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      )
    },
    { 
      value: 'name-asc', 
      label: 'Name: A-Z',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
        </svg>
      )
    },
    { 
      value: 'name-desc', 
      label: 'Name: Z-A',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      )
    }
  ];

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full font-semibold mb-3 text-lg text-gray-900 hover:text-primary-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Sort By
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
        <div className="space-y-1.5">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center justify-between group ${
                sortBy === option.value
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                  : 'bg-white hover:bg-primary-50 border border-gray-200 text-gray-700 hover:border-primary-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={sortBy === option.value ? 'text-white' : 'text-primary-600 group-hover:text-primary-700'}>
                  {option.icon}
                </span>
                <span className={`font-medium ${sortBy === option.value ? '' : 'group-hover:text-primary-600'}`}>
                  {option.label}
                </span>
              </span>
              {sortBy === option.value && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
