/**
 * Sort products by various criteria
 */
export function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'name-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'name-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    
    default:
      return sorted;
  }
}
