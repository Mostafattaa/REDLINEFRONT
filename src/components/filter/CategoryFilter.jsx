import { useState } from 'react';

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full font-semibold mb-3 text-lg text-gray-900 hover:text-primary-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
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
        <div className="space-y-3">
          {/* Search Input */}
          {categories.length > 5 && (
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}

          {/* All Categories Button */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-lg transition-all ${
              selectedCategory === null 
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700'
            }`}
          >
            <span className="font-medium">All Categories</span>
            {selectedCategory === null && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Category List */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <button
                  key={category.slug}
                  onClick={() => onSelectCategory(category.slug)}
                  className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-lg transition-all group ${
                    selectedCategory === category.slug 
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md' 
                      : 'bg-white hover:bg-primary-50 border border-gray-200 text-gray-700 hover:border-primary-300'
                  }`}
                >
                  <span className={`font-medium ${selectedCategory === category.slug ? '' : 'group-hover:text-primary-600'}`}>
                    {category.name}
                  </span>
                  {selectedCategory === category.slug && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No categories found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
