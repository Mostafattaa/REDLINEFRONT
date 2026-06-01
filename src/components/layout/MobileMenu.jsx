import { useState } from 'react';
import { Link } from 'react-router-dom';

export function MobileMenu({ user, onLogout, onClose, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
      onClose();
    }
  };

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>

        <div className="flex flex-col gap-4">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-primary font-medium py-2"
            onClick={onClose}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className="text-gray-700 hover:text-primary font-medium py-2"
            onClick={onClose}
          >
            Products
          </Link>
          <Link 
            to="/about" 
            className="text-gray-700 hover:text-primary font-medium py-2"
            onClick={onClose}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-700 hover:text-primary font-medium py-2"
            onClick={onClose}
          >
            Contact
          </Link>
          <Link 
            to="/cart" 
            className="text-gray-700 hover:text-primary font-medium py-2"
            onClick={onClose}
          >
            Cart
          </Link>
          
          <div className="border-t border-gray-200 pt-4">
            {user ? (
              <>
                <p className="text-gray-700 mb-2 font-medium">Hello, {user.username}</p>
                <Link
                  to="/profile"
                  className="block mb-2 text-gray-700 hover:text-primary font-medium"
                  onClick={onClose}
                >
                  👤 My Profile
                </Link>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="block mb-2 text-purple-600 hover:text-primary-600 font-semibold"
                    onClick={onClose}
                  >
                    🛠 Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="block mb-2 text-primary-600 hover:text-purple-600 font-semibold"
                    onClick={onClose}
                  >
                    📊 My Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="text-gray-700 hover:text-primary font-medium mt-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-primary font-medium"
                onClick={onClose}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
