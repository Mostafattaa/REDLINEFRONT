const BACKEND_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAccessToken() {
  try { return JSON.parse(sessionStorage.getItem('ecommerce_auth'))?.accessToken || null; }
  catch { return null; }
}

async function adminRequest(path, options = {}) {
  const token = getAccessToken();
  const res = await fetch(`${BACKEND_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `HTTP ${res.status}`);
  return json;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function adminGetUsers(page = 1, limit = 20, search = '') {
  const json = await adminRequest(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  return json;
}

export async function adminUpdateUserRole(userId, role) {
  const json = await adminRequest(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
  return json.data;
}

export async function adminDeactivateUser(userId) {
  const json = await adminRequest(`/admin/users/${userId}`, { method: 'DELETE' });
  return json.data;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function adminGetProducts(page = 1, limit = 20, search = '') {
  const json = await adminRequest(`/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  return json;
}

export async function adminCreateProduct(data) {
  const json = await adminRequest('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return json.data;
}

export async function adminUpdateProduct(id, data) {
  const json = await adminRequest(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return json.data;
}

export async function adminDeleteProduct(id) {
  const json = await adminRequest(`/admin/products/${id}`, { method: 'DELETE' });
  return json.data;
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function adminGetOrders(page = 1, limit = 20, search = '') {
  const json = await adminRequest(`/admin/orders?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  return json;
}

export async function adminUpdateOrderStatus(orderId, status) {
  const json = await adminRequest(`/admin/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return json.data;
}

// ─── Categories ───────────────────────────────────────────────────────────────
export async function adminGetCategories() {
  const json = await adminRequest('/categories');
  return Array.isArray(json.data) ? json.data : [];
}
