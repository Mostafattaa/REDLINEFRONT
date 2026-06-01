import { useState, useEffect } from 'react';
import { saveCart, loadCart, clearCart as clearCartStorage } from '../services/storage';
import {
  addToCart as addToCartHelper,
  updateCartItemQuantity as updateQuantityHelper,
  removeFromCart as removeFromCartHelper,
  getCartCount,
  calculateTotal,
  calculateSubtotal,
  calculateShipping,
} from '../utils/cartHelpers';
import { loadAuth } from '../services/storage';
import { fetchCart, addCartItem, updateCartItem, removeCartItem, clearCartApi } from '../services/api';

function isLoggedIn() {
  try {
    const auth = loadAuth();
    return !!(auth?.accessToken);
  } catch {
    return false;
  }
}

// Normalize a backend cart item to the local product shape
function normalizeCartItem(item) {
  const p = item.product || item;
  return {
    id: p._id || p.id,
    _id: p._id || p.id,
    title: p.title,
    price: p.price,
    images: p.images || [],
    thumbnail: p.thumbnail || p.images?.[0] || '',
    category: p.category,
    stock: p.stock,
    quantity: item.quantity || 1,
  };
}

export function useCart() {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart on mount
  useEffect(() => {
    const initCart = async () => {
      if (isLoggedIn()) {
        try {
          const serverCart = await fetchCart();
          const items = (serverCart?.items || []).map(normalizeCartItem);
          setCart(items);
          setCartCount(getCartCount(items));
          saveCart(items);
          return;
        } catch {
          // fall through to localStorage
        }
      }
      const saved = loadCart();
      setCart(saved);
      setCartCount(getCartCount(saved));
    };
    initCart();
  }, []);

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    saveCart(cart);
    setCartCount(getCartCount(cart));
  }, [cart]);

  const addToCart = async (product) => {
    if (isLoggedIn()) {
      try {
        const productId = product._id || product.id;
        const serverCart = await addCartItem(productId, 1);
        const items = (serverCart?.items || []).map(normalizeCartItem);
        setCart(items);
        return;
      } catch {
        // fall through to local
      }
    }
    setCart((prev) => addToCartHelper(prev, product));
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeItem(productId);
    }
    if (isLoggedIn()) {
      try {
        const serverCart = await updateCartItem(productId, newQuantity);
        const items = (serverCart?.items || []).map(normalizeCartItem);
        setCart(items);
        return;
      } catch {
        // fall through
      }
    }
    setCart((prev) => updateQuantityHelper(prev, productId, newQuantity));
  };

  const removeItem = async (productId) => {
    if (isLoggedIn()) {
      try {
        const serverCart = await removeCartItem(productId);
        const items = (serverCart?.items || []).map(normalizeCartItem);
        setCart(items);
        return;
      } catch {
        // fall through
      }
    }
    setCart((prev) => removeFromCartHelper(prev, productId));
  };

  const clearCart = async () => {
    if (isLoggedIn()) {
      try {
        await clearCartApi();
      } catch {
        // ignore
      }
    }
    setCart([]);
    clearCartStorage();
  };

  const subtotal = calculateTotal(cart);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return {
    cart,
    cartCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shipping,
    total,
    calculateSubtotal,
  };
}
