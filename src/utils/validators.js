/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate required field (non-empty)
 */
export function validateRequired(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}
