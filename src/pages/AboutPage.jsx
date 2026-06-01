import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-purple-50/20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Your trusted destination for quality products and exceptional shopping experience
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              Founded with a passion for bringing quality products to customers worldwide, we've grown from a small startup to a trusted e-commerce platform serving thousands of happy customers.
            </p>
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              Our mission is simple: provide an exceptional shopping experience with carefully curated products, competitive prices, and outstanding customer service.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Every product in our catalog is selected with care, ensuring you get the best value for your money.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-purple-100 rounded-3xl p-12 flex items-center justify-center">
            <svg className="w-64 h-64 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-primary-50/30 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Quality First</h3>
              <p className="text-gray-600 leading-relaxed">
                We carefully select every product to ensure it meets our high standards of quality and value.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-primary-50/30 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your orders quickly with our efficient shipping network and reliable delivery partners.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-primary-50/30 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Customer Satisfaction</h3>
              <p className="text-gray-600 leading-relaxed">
                Your happiness is our priority. We're here to help with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">194+</div>
              <div className="text-primary-100">Products</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">20+</div>
              <div className="text-primary-100">Categories</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.8★</div>
              <div className="text-primary-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Start Shopping?</h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Explore our wide range of products and find exactly what you're looking for.
        </p>
        <Link to="/products">
          <button className="px-10 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
            Browse Products →
          </button>
        </Link>
      </section>
    </div>
  );
}
