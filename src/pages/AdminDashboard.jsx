import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminGetUsers, adminUpdateUserRole, adminDeactivateUser,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetOrders, adminUpdateOrderStatus, adminGetCategories,
} from '../services/adminApi';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (n) => `$${Number(n || 0).toFixed(2)}`;
const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar({ value, onChange, onSearch, placeholder }) {
  return (
    <div className="flex gap-2 max-w-md w-full mb-6">
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        />
        {value && (
          <button
            onClick={() => { onChange(''); onSearch(''); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-lg"
          >
            &times;
          </button>
        )}
      </div>
      <button
        onClick={() => onSearch()}
        className="px-5 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-medium shadow hover:shadow-md transition-all text-sm h-[38px] shrink-0"
      >
        Search
      </button>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ meta, limit = 10, onPageChange }) {
  const { total, page } = meta;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white">
      <div className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-950">{Math.min((page - 1) * limit + 1, total)}</span> to{' '}
        <span className="font-semibold text-gray-950">{Math.min(page * limit, total)}</span> of{' '}
        <span className="font-semibold text-gray-950">{total}</span> results
      </div>
      <div className="flex items-center gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-xs font-semibold text-gray-600"
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === p
                    ? 'bg-gradient-to-br from-primary-600 to-purple-600 text-white shadow'
                    : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                {p}
              </button>
            );
          } else if (p === 2 || p === totalPages - 1) {
            return (
              <span key={p} className="text-gray-400 px-0.5 text-xs font-bold">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-xs font-semibold text-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  paid:       'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-emerald-100 text-emerald-800',
  cancelled:  'bg-red-100 text-red-800',
  failed:     'bg-gray-100 text-gray-800',
};

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Confirm Action</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Form Modal ───────────────────────────────────────────────────────
function ProductModal({ product, categories, onSave, onClose }) {
  const isEdit = !!product?._id;
  const [form, setForm] = useState({
    title:       product?.title       || '',
    price:       product?.price       || '',
    description: product?.description || '',
    stock:       product?.stock       ?? '',
    category:    product?.category?._id || product?.category || '',
    images:      (product?.images || []).join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title:       form.title.trim(),
        price:       parseFloat(form.price),
        description: form.description.trim(),
        stock:       parseInt(form.stock, 10),
        category:    form.category,
        images:      form.images.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input name="price" type="number" step="0.01" min="0.01" value={form.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
            <input name="images" value={form.images} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center gap-4`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl ${color}`}>{icon}</div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  // Search terms
  const [usersSearch, setUsersSearch] = useState('');
  const [productsSearch, setProductsSearch] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [usersMeta, setUsersMeta] = useState({ total: 0, page: 1 });
  const [usersLoading, setUsersLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsMeta, setProductsMeta] = useState({ total: 0, page: 1 });
  const [productsLoading, setProductsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productModal, setProductModal] = useState(null); // null | 'new' | product object

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersMeta, setOrdersMeta] = useState({ total: 0, page: 1 });
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Confirm modal
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const loadUsers = useCallback(async (page = 1, search = '') => {
    setUsersLoading(true);
    try {
      const limit = tab === 'overview' ? 1000 : 10;
      const res = await adminGetUsers(page, limit, search);
      setUsers(res.data || []);
      setUsersMeta({ total: res.meta?.total || 0, page });
    } catch (e) { console.error(e); }
    finally { setUsersLoading(false); }
  }, [tab]);

  const loadProducts = useCallback(async (page = 1, search = '') => {
    setProductsLoading(true);
    try {
      const limit = tab === 'overview' ? 1000 : 10;
      const res = await adminGetProducts(page, limit, search);
      setProducts(Array.isArray(res.data) ? res.data : []);
      setProductsMeta({ total: res.meta?.total || 0, page });
    } catch (e) { console.error(e); }
    finally { setProductsLoading(false); }
  }, [tab]);

  const loadOrders = useCallback(async (page = 1, search = '') => {
    setOrdersLoading(true);
    try {
      const limit = tab === 'overview' ? 1000 : 10;
      const res = await adminGetOrders(page, limit, search);
      setOrders(res.data || []);
      setOrdersMeta({ total: res.meta?.total || 0, page });
    } catch (e) { console.error(e); }
    finally { setOrdersLoading(false); }
  }, [tab]);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await adminGetCategories();
      setCategories(cats);
    } catch (e) { console.error(e); }
  }, []);

  // Load data on tab change
  useEffect(() => {
    if (tab === 'users' || tab === 'overview') loadUsers(1, usersSearch);
    if (tab === 'products' || tab === 'overview') loadProducts(1, productsSearch);
    if (tab === 'orders' || tab === 'overview') loadOrders(1, ordersSearch);
    if (tab === 'products') loadCategories();
  }, [tab, loadUsers, loadProducts, loadOrders, loadCategories]);

  // ── User actions ──
  const handleRoleChange = async (userId, role) => {
    try { await adminUpdateUserRole(userId, role); loadUsers(usersMeta.page); }
    catch (e) { alert(e.message); }
  };

  const handleDeactivateUser = (userId) => {
    setConfirm({
      message: 'Deactivate this user account?',
      onConfirm: async () => {
        setConfirm(null);
        try { await adminDeactivateUser(userId); loadUsers(usersMeta.page); }
        catch (e) { alert(e.message); }
      },
    });
  };

  // ── Product actions ──
  const handleSaveProduct = async (data) => {
    if (productModal?._id) {
      await adminUpdateProduct(productModal._id, data);
    } else {
      await adminCreateProduct(data);
    }
    loadProducts(productsMeta.page);
  };

  const handleDeleteProduct = (id) => {
    setConfirm({
      message: 'Delete this product permanently?',
      onConfirm: async () => {
        setConfirm(null);
        try { await adminDeleteProduct(id); loadProducts(productsMeta.page); }
        catch (e) { alert(e.message); }
      },
    });
  };

  // ── Order actions ──
  const handleOrderStatus = async (orderId, status) => {
    try { await adminUpdateOrderStatus(orderId, status); loadOrders(ordersMeta.page); }
    catch (e) { alert(e.message); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users',    label: 'Users',    icon: '👥' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders',   label: 'Orders',   icon: '🛒' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-100 mt-1">Welcome back, {user?.username || 'Admin'}</p>
            </div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-medium transition-colors">
              ← Back to Store
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  tab === t.id ? 'bg-white text-primary-700 shadow-lg' : 'text-white/80 hover:bg-white/20'
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Users"    value={usersMeta.total}    icon="👥" color="bg-blue-500" />
              <StatCard label="Total Products" value={productsMeta.total} icon="📦" color="bg-purple-500" />
              <StatCard label="Total Orders"   value={ordersMeta.total}   icon="🛒" color="bg-green-500" />
              <StatCard label="Revenue"
                value={formatPrice(orders.reduce((s, o) => s + (o.totalAmount || 0), 0))}
                icon="💰" color="bg-orange-500" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <button onClick={() => setTab('orders')} className="text-primary-600 hover:text-purple-600 font-medium text-sm">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{o._id?.slice(-8)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{o.user?.name || o.user?.email || '—'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(o.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(o.createdAt)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className="space-y-6">
            <SearchBar
              value={usersSearch}
              onChange={setUsersSearch}
              onSearch={() => loadUsers(1, usersSearch)}
              placeholder="Search users by name or email..."
            />
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Users <span className="text-gray-400 font-normal text-base">({usersMeta.total})</span></h2>
              </div>
              {usersLoading ? (
                <div className="p-12 text-center text-gray-400">Loading users...</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {u.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                            <td className="px-6 py-4">
                              {u.isActive && (
                                <button
                                  onClick={() => handleDeactivateUser(u._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Deactivate
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination meta={usersMeta} limit={10} onPageChange={(p) => loadUsers(p, usersSearch)} />
                </>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <SearchBar
                value={productsSearch}
                onChange={setProductsSearch}
                onSearch={() => loadProducts(1, productsSearch)}
                placeholder="Search products by title..."
              />
              <button
                onClick={() => { loadCategories(); setProductModal('new'); }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all md:mb-6"
              >
                + Add Product
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Products <span className="text-gray-400 font-normal text-base">({productsMeta.total})</span></h2>
              </div>
              {productsLoading ? (
                <div className="p-12 text-center text-gray-400">Loading products...</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Image', 'Title', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.map((p) => (
                          <tr key={p._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <img
                                src={p.images?.[0] || p.thumbnail || 'https://via.placeholder.com/48'}
                                alt={p.title}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{p.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{p.category?.name || p.category || '—'}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(p.price)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => { loadCategories(); setProductModal(p); }}
                                  className="text-primary-600 hover:text-purple-600 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No products in database. Products are served from DummyJSON for browsing.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination meta={productsMeta} limit={10} onPageChange={(p) => loadProducts(p, productsSearch)} />
                </>
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="space-y-6">
            <SearchBar
              value={ordersSearch}
              onChange={setOrdersSearch}
              onSearch={() => loadOrders(1, ordersSearch)}
              placeholder="Search orders by customer, status, intent, or ID..."
            />
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Orders <span className="text-gray-400 font-normal text-base">({ordersMeta.total})</span></h2>
              </div>
              {ordersLoading ? (
                <div className="p-12 text-center text-gray-400">Loading orders...</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update Status'].map((h) => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((o) => (
                          <tr key={o._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-mono text-gray-600">{o._id?.slice(-8)}</td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{o.user?.name || '—'}</div>
                              <div className="text-xs text-gray-500">{o.user?.email || ''}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{o.items?.length || 0} item(s)</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(o.totalAmount)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{formatDate(o.createdAt)}</td>
                            <td className="px-6 py-4">
                              <select
                                value={o.status}
                                onChange={(e) => handleOrderStatus(o._id, e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                {['pending','paid','processing','shipped','delivered','cancelled'].map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination meta={ordersMeta} limit={10} onPageChange={(p) => loadOrders(p, ordersSearch)} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {productModal && (
        <ProductModal
          product={productModal === 'new' ? null : productModal}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => setProductModal(null)}
        />
      )}
    </div>
  );
}
