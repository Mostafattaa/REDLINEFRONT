import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterProducts, getAllCategories } from '../services/api';
import { ProductGrid } from '../components/product/ProductGrid';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { sortProducts } from '../utils/sortHelpers';
import { applyAllFilters } from '../utils/filterHelpers';
import { CategoryFilter } from '../components/filter/CategoryFilter';
import { PriceRangeFilter } from '../components/filter/PriceRangeFilter';
import { SortDropdown } from '../components/filter/SortDropdown';

export function ProductListingPage({ cart, onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const productsPerPage = 30;

  const searchQuery = searchParams.get('q');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all products (194 total) by setting limit to 0
      const [productsData, categoriesData] = await Promise.all([
        filterProducts({ limit: 0 }),
        getAllCategories()
      ]);
      
      setProducts(productsData);
      setTotalProducts(productsData.length);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let result = [...products];
    
    // Apply filters
    const filters = {
      categorySlug: selectedCategory,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      searchQuery: searchQuery || ''
    };
    
    result = applyAllFilters(result, filters);
    
    // Apply sorting
    if (sortBy) {
      result = sortProducts(result, sortBy);
    }
    
    setFilteredProducts(result);
    setTotalProducts(result.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, sortBy, minPrice, maxPrice, searchQuery, selectedCategory]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
  };

  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleClearAllFilters = () => {
    setSelectedCategory(null);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || minPrice || maxPrice || sortBy;

  // Pagination logic
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-purple-50/30">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-16 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-5xl font-bold mb-3">Explore Products</h1>
              <p className="text-primary-100 text-lg">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Discover amazing deals on quality products'}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <div className="text-sm text-primary-100">Products Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <span className="bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">
                Active
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              {/* Filters Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <h2 className="text-xl font-bold">Filters</h2>
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearAllFilters}
                        className="text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                  />
                  
                  <PriceRangeFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={handlePriceChange}
                  />
                  
                  <SortDropdown
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Shopping Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-100">Total Products</span>
                    <span className="font-bold text-xl">{totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-100">Categories</span>
                    <span className="font-bold text-xl">{categories.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-100">Current Page</span>
                    <span className="font-bold text-xl">{currentPage}/{totalPages}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Bar */}
            <div className="mb-8 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                      <span className="text-gray-600 font-medium">Loading products...</span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {startIndex + 1}-{Math.min(endIndex, totalProducts)} <span className="text-gray-400">of</span> {totalProducts}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Products found</div>
                    </div>
                  )}
                </div>
                
                {/* Active Filters Display */}
                {(selectedCategory || minPrice || maxPrice || sortBy) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        {categories.find(c => c.slug === selectedCategory)?.name}
                        <button onClick={() => handleCategorySelect(null)} className="hover:text-primary-900">×</button>
                      </span>
                    )}
                    {(minPrice || maxPrice) && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        ${minPrice || '0'} - ${maxPrice || '∞'}
                        <button onClick={() => handlePriceChange('', '')} className="hover:text-purple-900">×</button>
                      </span>
                    )}
                    {sortBy && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                        Sorted
                        <button onClick={() => setSortBy('')} className="hover:text-pink-900">×</button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <ProductGrid
              products={paginatedProducts}
              cart={cart}
              onAddToCart={onAddToCart}
              loading={loading}
            />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  <div className="flex gap-2 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-12 h-12 rounded-xl font-bold transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg scale-110'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-2 text-gray-400 flex items-center">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
