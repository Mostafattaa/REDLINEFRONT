/**
 * Format price with $ symbol and 2 decimal places
 */
export function formatPrice(price) {
  return `${Number(price).toFixed(2)}`;
}
