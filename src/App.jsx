import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';

function AppContent() {
  const navigate = useNavigate();
  const { 
    cart, 
    cartCount, 
    addToCart, 
    updateQuantity, 
    removeItem, 
    clearCart,
    subtotal,
    shipping,
    total,
    calculateSubtotal
  } = useCart();
  
  const { user, logout, login } = useAuth();

  const handleSearch = useCallback((query) => {
    if (query) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/products');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        user={user}
        onLogout={logout}
        onSearch={handleSearch}
      />
      
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage cart={cart} onAddToCart={addToCart} />} 
          />
          <Route 
            path="/products" 
            element={<ProductListingPage cart={cart} onAddToCart={addToCart} />} 
          />
          <Route 
            path="/products/:id" 
            element={<ProductDetailPage cart={cart} onAddToCart={addToCart} />} 
          />
          <Route 
            path="/cart" 
            element={
              <CartPage 
                cart={cart} 
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                calculateSubtotal={calculateSubtotal}
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={<CheckoutPage cart={cart} onClearCart={clearCart} />} 
          />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login" element={<LoginPage onLogin={login} />} />
          <Route path="/signup" element={<SignupPage onLogin={login} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/profile"
            element={
              user ? <ProfilePage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <DashboardPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin"
            element={
              user?.role === 'admin'
                ? <AdminDashboard user={user} />
                : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
