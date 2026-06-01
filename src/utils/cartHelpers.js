/**
 * Calculate subtotal for a cart item (price * quantity)
 */
export function calculateSubtotal(price, quantity) {
  return price * quantity;
}

/**
 * Calculate total for entire cart (sum of all subtotals)
 */
export function calculateTotal(cartItems) {
  return cartItems.reduce((sum, item) => {
    return sum + calculateSubtotal(item.price, item.quantity);
  }, 0);
}

/**
 * Calculate shipping cost (free over $100, else $10)
 */
export function calculateShipping(subtotal) {
  return subtotal > 100 ? 0 : 10;
}

/**
 * Add product to cart (new item or increment quantity)
 */
export function addToCart(cart, product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    // Increment quantity
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    // Add new item with quantity 1
    return [...cart, { ...product, quantity: 1 }];
  }
}

/**
 * Update cart item quantity with validation (1-99 range)
 */
export function updateCartItemQuantity(cart, productId, newQuantity) {
  // Validate quantity
  const validQuantity = Math.max(1, Math.min(99, Math.round(newQuantity)));
  
  return cart.map(item =>
    item.id === productId
      ? { ...item, quantity: validQuantity }
      : item
  );
}

/**
 * Remove item from cart
 */
export function removeFromCart(cart, productId) {
  return cart.filter(item => item.id !== productId);
}

/**
 * Get total quantity of items in cart
 */
export function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Check if product is in cart
 */
export function isProductInCart(cart, productId) {
  return cart.some(item => item.id === productId);
}

/**
 * Clear all items from cart
 */
export function clearCart() {
  return [];
}
