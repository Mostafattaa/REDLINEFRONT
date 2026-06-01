import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { validateRequired, validateEmail } from '../utils/validators';

export function CheckoutPage({ cart, onClearCart }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.fullName)) newErrors.fullName = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validateRequired(formData.address)) newErrors.address = 'Address is required';
    if (!validateRequired(formData.city)) newErrors.city = 'City is required';
    if (!validateRequired(formData.state)) newErrors.state = 'State is required';
    if (!validateRequired(formData.postalCode)) newErrors.postalCode = 'Postal code is required';
    if (!validateRequired(formData.cardNumber)) newErrors.cardNumber = 'Card number is required';
    if (!validateRequired(formData.expiry)) newErrors.expiry = 'Expiry date is required';
    if (!validateRequired(formData.cvv)) newErrors.cvv = 'CVV is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderError('');
    
    if (!validate()) {
      return;
    }

    if (!cart || cart.length === 0) {
      setOrderError('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Get auth token
      const authData = sessionStorage.getItem('ecommerce_auth');
      const token = authData ? JSON.parse(authData).accessToken : null;
      
      if (!token) {
        throw new Error('Please log in to complete your order');
      }

      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: formData.fullName,
          streetAddress: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethodId: 'pm_mock_' + Date.now() // Mock payment method for now
      };

      // Create order
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Clear cart and redirect to success page
      onClearCart();
      navigate('/success');
    } catch (error) {
      console.error('Order creation error:', error);
      setOrderError(error.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-purple-50/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">Complete your order in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <span className="font-medium text-gray-900">Shipping</span>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <span className="font-medium text-gray-900">Payment</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 rounded"></div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <span className="font-medium text-gray-500">Complete</span>
          </div>
        </div>

        {/* Error Message */}
        {orderError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{orderError}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                <p className="text-gray-600">Where should we deliver your order?</p>
              </div>
            </div>
            <div className="space-y-5">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="John Doe"
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="john@example.com"
              />
              <Input
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="123 Main Street, Apt 4B"
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="New York"
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  placeholder="NY"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                  placeholder="10001"
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
                <p className="text-gray-600">All transactions are secure and encrypted</p>
              </div>
            </div>
            <div className="space-y-5">
              <Input
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                error={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Expiry Date (MM/YY)"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  error={errors.expiry}
                  placeholder="12/25"
                />
                <Input
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  error={errors.cvv}
                  placeholder="123"
                />
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">We accept:</span>
                <div className="flex gap-3">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-700">VISA</div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-700">MC</div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-700">AMEX</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-900 mb-1">Secure Payment</h3>
                <p className="text-green-700 text-sm">Your payment information is encrypted and secure. We never store your card details.</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 hover:shadow-2xl transform hover:scale-105 transition-all rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete Order
                </>
              )}
            </span>
          </Button>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              SSL Encrypted
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Money-back Guarantee
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              24/7 Support
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
