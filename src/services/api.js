// ─── API Base URLs ────────────────────────────────────────────────────────────
const DUMMY_BASE = 'https://dummyjson.com';
const BACKEND_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const CACHE_DURATION = 5 * 60 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// ─── Simple in-memory cache ───────────────────────────────────────────────────
const cache = new Map();

function getCacheKey(endpoint, params) {
  return `${endpoint}${params ? JSON.stringify(params) : ''}`;
}
function isCacheValid(entry) {
  return entry && Date.now() - entry.timestamp < CACHE_DURATION;
}
function getFromCache(key) {
  const entry = cache.get(key);
  if (isCacheValid(entry)) return entry.data;
  cache.delete(key);
  return null;
}
function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache() { cache.clear(); }
export function clearCacheEntry(endpoint, params = null) { cache.delete(getCacheKey(endpoint, params)); }
export function getCacheStats() { return { size: cache.size, entries: Array.from(cache.keys()) }; }

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export function getAccessToken() {
  try { return JSON.parse(sessionStorage.getItem('ecommerce_auth'))?.accessToken || null; }
  catch { return null; }
}
function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Query string builder ─────────────────────────────────────────────────────
export function buildQueryString(params) {
  if (!params || Object.keys(params).length === 0) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

// ─── Sleep / retry ────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function fetchWithRetry(url, options = {}, retryCount = 0) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    if (!res.ok) {
      if (res.status === 404) throw new Error('Resource not found');
      if (res.status === 500) throw new Error('Server error, please try again later');
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      error.message = 'Network error, please check your connection';
    }
    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY * Math.pow(2, retryCount));
      return fetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
}

// ─── DummyJSON GET with cache ─────────────────────────────────────────────────
async function dummyGet(endpoint, params = null, useCache = true) {
  const cacheKey = getCacheKey(endpoint, params);
  if (useCache) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }
  const url = `${DUMMY_BASE}${endpoint}${buildQueryString(params)}`;
  const data = await fetchWithRetry(url);
  if (useCache) setCache(cacheKey, data);
  return data;
}

// ─── Backend request (auth + cart + orders) ───────────────────────────────────
async function backendRequest(path, options = {}) {
  const res = await fetch(`${BACKEND_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error?.message || `HTTP ${res.status}`);
  }
  return json;
}

// ─── Product normalizer ───────────────────────────────────────────────────────
function normalizeProduct(product) {
  if (!product) return null;
  const id = product._id || product.id;
  return {
    ...product,
    id: id,
    _id: id,
    category: typeof product.category === 'string'
      ? { name: product.category, slug: product.category }
      : product.category,
    images: product.images || [product.thumbnail],
    thumbnail: product.thumbnail || product.images?.[0] || '',
  };
}
function normalizeProducts(products) {
  return products.map(normalizeProduct).filter(Boolean);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS — Real Backend
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAllProducts({ limit = 30, skip = 0 } = {}) {
  const page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
  const qs = buildQueryString({ page, limit });
  const json = await backendRequest(`/products${qs}`);
  return normalizeProducts(json.data || []);
}

export async function getProductById(id) {
  const json = await backendRequest(`/products/${id}`);
  return normalizeProduct(json.data);
}

export async function searchProducts(query, { limit = 30, skip = 0 } = {}) {
  const page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
  const qs = buildQueryString({ search: query, page, limit });
  const json = await backendRequest(`/products${qs}`);
  return normalizeProducts(json.data || []);
}

export async function getProductsSorted({ sortBy, order = 'asc', limit = 30, skip = 0 } = {}) {
  const page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
  const qs = buildQueryString({ sortBy, page, limit });
  const json = await backendRequest(`/products${qs}`);
  return normalizeProducts(json.data || []);
}

export async function getAllCategories() {
  const json = await backendRequest('/categories');
  return json.data || [];
}

export async function getCategoryList() {
  const json = await backendRequest('/categories');
  return (json.data || []).map(c => c.slug);
}

export async function getProductsByCategory(category, { limit = 30, skip = 0 } = {}) {
  const page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
  const qs = buildQueryString({ category, page, limit });
  const json = await backendRequest(`/products${qs}`);
  return normalizeProducts(json.data || []);
}

export async function filterProducts(filters = {}) {
  const limit = filters.limit !== undefined ? filters.limit : 0;
  const skip = filters.skip || 0;
  const page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
  const qs = buildQueryString({ page, limit });
  const json = await backendRequest(`/products${qs}`);
  return normalizeProducts(json.data || []);
}

export async function getRelatedProductsById(id) {
  try {
    const product = await getProductById(id);
    const categorySlug = product.category?.slug || product.category?.name || product.category;
    const categoryProducts = await getProductsByCategory(categorySlug, { limit: 10 });
    return categoryProducts.filter((p) => p.id !== id).slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH — Real Backend
// ═══════════════════════════════════════════════════════════════════════════════

export async function registerUser(name, email, password) {
  const json = await backendRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return json.data;
}

export async function loginUser(email, password) {
  const json = await backendRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return json.data; // { accessToken, refreshToken, user }
}

export async function logoutUser(refreshToken) {
  await backendRequest('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CART — Real Backend
// ═══════════════════════════════════════════════════════════════════════════════

export async function fetchCart() {
  const json = await backendRequest('/cart');
  return json.data;
}

export async function addCartItem(productId, quantity) {
  const json = await backendRequest('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
  return json.data;
}

export async function updateCartItem(productId, quantity) {
  const json = await backendRequest(`/cart/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
  return json.data;
}

export async function removeCartItem(productId) {
  const json = await backendRequest(`/cart/items/${productId}`, { method: 'DELETE' });
  return json.data;
}

export async function clearCartApi() {
  const json = await backendRequest('/cart', { method: 'DELETE' });
  return json.data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS — Real Backend
// ═══════════════════════════════════════════════════════════════════════════════

export async function createOrder(shippingAddress, paymentMethodId) {
  const json = await backendRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({ shippingAddress, paymentMethodId }),
  });
  return json.data;
}

export async function getUserOrders({ page = 1, limit = 10 } = {}) {
  const qs = buildQueryString({ page, limit });
  const json = await backendRequest(`/orders${qs}`);
  return json.data;
}
