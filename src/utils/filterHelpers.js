/**
 * Filter products by category
 */
export function filterByCategory(products, categorySlug) {
  if (!categorySlug) return products;
  return products.filter(product => {
    // Handle both string category and object category formats
    const productCategory = typeof product.category === 'string' 
      ? product.category 
      : product.category?.slug || product.category?.name;
    return productCategory === categorySlug;
  });
}

/**
 * Filter products by price range
 */
export function filterByPriceRange(products, minPrice, maxPrice) {
  return products.filter(product => {
    const price = product.price;
    const meetsMin = minPrice === null || minPrice === undefined || price >= minPrice;
    const meetsMax = maxPrice === null || maxPrice === undefined || price <= maxPrice;
    return meetsMin && meetsMax;
  });
}

/**
 * Filter products by search query (case-insensitive title/category match)
 */
export function filterBySearch(products, query) {
  if (!query || query.trim() === '') return products;
  
  const lowerQuery = query.toLowerCase();
  
  return products.filter(product => {
    const titleMatch = product.title.toLowerCase().includes(lowerQuery);
    // Handle both string category and object category formats
    const categoryValue = typeof product.category === 'string' 
      ? product.category 
      : product.category?.name || '';
    const categoryMatch = categoryValue.toLowerCase().includes(lowerQuery);
    return titleMatch || categoryMatch;
  });
}

/**
 * Apply all filters (combine all filter criteria)
 */
export function applyAllFilters(products, filters) {
  let filtered = products;
  
  // Apply category filter
  if (filters.categorySlug) {
    filtered = filterByCategory(filtered, filters.categorySlug);
  }
  
  // Apply price range filter
  if (filters.minPrice !== null && filters.minPrice !== undefined || 
      filters.maxPrice !== null && filters.maxPrice !== undefined) {
    filtered = filterByPriceRange(filtered, filters.minPrice, filters.maxPrice);
  }
  
  // Apply search filter
  if (filters.searchQuery) {
    filtered = filterBySearch(filtered, filters.searchQuery);
  }
  
  return filtered;
}
