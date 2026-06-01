import { useEffect, useState } from 'react';
import { getAllProducts, getAllCategories, getProductsByCategory } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Link } from 'react-router-dom';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { Carousel } from '../components/ui/Carousel';

export function HomePage({ cart, onAddToCart }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch featured products and categories
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts({ limit: 8 }),
        getAllCategories()
      ]);
      
      setFeaturedProducts(productsData);
      const limitedCategories = categoriesData.slice(0, 5);
      setCategories(limitedCategories);
      
      // Fetch products for each category
      const categoryProductsData = {};
      for (const category of limitedCategories) {
        try {
          const products = await getProductsByCategory(category.slug, { limit: 4 });
          categoryProductsData[category.slug] = products;
        } catch (err) {
          console.error(`Failed to fetch products for category ${category.slug}:`, err);
          categoryProductsData[category.slug] = [];
        }
      }
      
      setCategoryProducts(categoryProductsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  const getCategoryIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('beauty') || lowerName.includes('skin')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
    }
    if (lowerName.includes('fragrance')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    }
    if (lowerName.includes('furniture') || lowerName.includes('home')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    }
    if (lowerName.includes('groceries') || lowerName.includes('kitchen')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    }
    if (lowerName.includes('laptop') || lowerName.includes('tablet')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    }
    if (lowerName.includes('phone') || lowerName.includes('mobile')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    }
    if (lowerName.includes('shirt') || lowerName.includes('top') || lowerName.includes('dress')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
    }
    if (lowerName.includes('shoe') || lowerName.includes('sport')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    }
    if (lowerName.includes('watch') || lowerName.includes('accessories')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
    if (lowerName.includes('bag') || lowerName.includes('jewellery')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
    }
    if (lowerName.includes('vehicle') || lowerName.includes('motorcycle')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
    }
    if (lowerName.includes('sunglasses')) {
      return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
    }
    return <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-purple-50/20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                ✨ New Arrivals Every Week
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-primary-100 leading-relaxed">
                Shop from thousands of products with unbeatable prices and quality
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products">
                  <button className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-2xl hover:shadow-white/20">
                    Shop Now →
                  </button>
                </Link>
                <Link to="/products">
                  <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
                    Explore Categories
                  </button>
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold">194+</div>
                  <div className="text-primary-100 text-sm">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-primary-100 text-sm">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.8★</div>
                  <div className="text-primary-100 text-sm">Rating</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative h-96">
              <div className="absolute top-0 right-0 w-48 h-64 bg-white rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl p-4 flex items-center justify-center">
                  <svg className="w-24 h-24 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-20 right-32 w-48 h-64 bg-white rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="h-full bg-gradient-to-br from-blue-200 to-cyan-200 rounded-2xl p-4 flex items-center justify-center">
                  <svg className="w-24 h-24 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 right-16 w-48 h-64 bg-white rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="h-full bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl p-4 flex items-center justify-center">
                  <svg className="w-24 h-24 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-primary-600 to-transparent rounded"></div>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map(category => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300 border border-gray-100"
              >
                <div className="text-primary-600 group-hover:text-purple-600 group-hover:scale-110 transition-all">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="font-bold text-base text-gray-800 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all text-center">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <Link to="/products" className="text-primary-600 hover:text-purple-600 font-bold text-lg flex items-center gap-2 group px-6 py-3 bg-white rounded-full shadow-md hover:shadow-xl transition-all">
            View All 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <Carousel>
            {featuredProducts.map(product => (
              <div key={product.id} className="flex-shrink-0 w-72">
                <ProductCard
                  product={product}
                  isInCart={cart.some(item => item.id === product.id)}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </Carousel>
        )}
      </section>

      {/* Category-specific Product Sections */}
      {categories.map(category => (
        <section key={category.slug} className="container mx-auto px-4 py-20">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {category.name}
            </h2>
            <Link 
              to={`/products?category=${category.slug}`} 
              className="text-primary-600 hover:text-purple-600 font-bold text-lg flex items-center gap-2 group px-6 py-3 bg-white rounded-full shadow-md hover:shadow-xl transition-all"
            >
              View All
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : categoryProducts[category.slug] && categoryProducts[category.slug].length > 0 ? (
            <Carousel>
              {categoryProducts[category.slug].map(product => (
                <div key={product.id} className="flex-shrink-0 w-72">
                  <ProductCard
                    product={product}
                    isInCart={cart.some(item => item.id === product.id)}
                    onAddToCart={onAddToCart}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <p className="text-gray-500 text-center py-12 text-lg">No products available in this category</p>
          )}
        </section>
      ))}
    </div>
  );
}
