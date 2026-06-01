import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/formatters';

export function CartPage({ cart, onUpdateQuantity, onRemove, subtotal, shipping, total, calculateSubtotal }) {
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-purple-50/20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-8 relative">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-24 h-24 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 text-xl mb-10">Discover amazing products and start shopping!</p>
          <Link to="/products">
            <Button className="px-10 py-4 text-lg bg-gradient-to-r from-primary-600 to-purple-600 hover:shadow-2xl transform hover:scale-105 transition-all">
              Start Shopping →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-purple-50/20 py-6 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-base md:text-lg">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-primary-600 font-bold text-xl md:text-2xl">{formatPrice(item.price)}</p>
                    </div>

                    {/* Quantity Controls and Remove - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                      <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-xl p-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all font-bold shadow-sm active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-3 md:px-4 font-bold text-base md:text-lg min-w-[2.5rem] md:min-w-[3rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all font-bold shadow-sm active:scale-95"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onRemove(item.id)}
                        className="flex items-center justify-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-red-50 active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Item Total - Hidden on mobile, shown on larger screens */}
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <div className="text-xs md:text-sm text-gray-500 mb-1">Item Total</div>
                    <div className="font-bold text-xl md:text-2xl text-gray-900">
                      {formatPrice(calculateSubtotal(item.price, item.quantity))}
                    </div>
                  </div>

                  {/* Item Total - Mobile Only */}
                  <div className="sm:hidden flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                    <span className="text-sm text-gray-600 font-medium">Item Total:</span>
                    <span className="font-bold text-xl text-gray-900">
                      {formatPrice(calculateSubtotal(item.price, item.quantity))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-100">
                  <span className="text-gray-600 text-sm md:text-base">Subtotal</span>
                  <span className="font-bold text-base md:text-lg text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-100">
                  <span className="text-gray-600 text-sm md:text-base">Shipping</span>
                  <span className="font-bold text-base md:text-lg text-green-600">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 md:py-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl px-3 md:px-4">
                  <span className="font-bold text-base md:text-lg text-gray-900">Total</span>
                  <span className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/checkout')} 
                className="w-full py-3 md:py-4 text-base md:text-lg font-bold bg-gradient-to-r from-primary-600 to-purple-600 hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all rounded-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200 space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure checkout
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free shipping on all orders
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  30-day return policy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
