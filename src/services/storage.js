const CART_KEY = 'ecommerce_cart';
const AUTH_KEY = 'ecommerce_auth';

/**
 * Save cart to localStorage
 */
export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded. Clearing old data...');
      // Clear cart and try again
      localStorage.removeItem(CART_KEY);
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
      } catch (retryError) {
        console.error('Failed to save cart after clearing:', retryError);
      }
    } else {
      console.error('Failed to save cart:', error);
    }
  }
}

/**
 * Load cart from localStorage
 */
export function loadCart() {
  try {
    const cartData = localStorage.getItem(CART_KEY);
    if (!cartData) {
      return [];
    }
    
    const cart = JSON.parse(cartData);
    
    // Validate cart structure
    if (!Array.isArray(cart)) {
      console.warn('Cart data was corrupted and has been reset');
      localStorage.removeItem(CART_KEY);
      return [];
    }
    
    return cart;
  } catch (error) {
    console.error('Failed to load cart. Cart data was corrupted and has been reset:', error);
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

/**
 * Save auth state to sessionStorage
 */
export function saveAuth(user) {
  try {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
}

/**
 * Load auth state from sessionStorage
 */
export function loadAuth() {
  try {
    const authData = sessionStorage.getItem(AUTH_KEY);
    if (!authData) {
      return null;
    }
    
    return JSON.parse(authData);
  } catch (error) {
    console.error('Failed to load auth state:', error);
    sessionStorage.removeItem(AUTH_KEY);
    return null;
  }
}

/**
 * Clear auth state from sessionStorage
 */
export function clearAuth() {
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Failed to clear auth state:', error);
  }
}

/**
 * Clear cart from localStorage
 */
export function clearCart() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
}
