import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getRelatedProductsById } from '../services/api';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { formatPrice } from '../utils/formatters';
import { ProductCard } from '../components/product/ProductCard';

export function ProductDetailPage({ cart, onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productData, relatedData] = await Promise.all([
        getProductById(id),
        getRelatedProductsById(id).catch(() => [])
      ]);
      
      setProduct(productData);
      setRelatedProducts(relatedData.slice(0, 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchProduct} />
      </div>
    );
  }

  if (!product) return null;

  const isInCart = cart.some(item => item.id === product.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-purple-50/20">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <span>Home</span>
          <span>›</span>
          <span>Products</span>
          <span>›</span>
          <span className="text-primary-600 font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-3xl overflow-hidden mb-6 shadow-2xl border border-gray-100 group">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-3 transition-all transform hover:scale-105 ${
                    selectedImage === index 
                      ? 'border-primary-600 shadow-lg ring-4 ring-primary-200' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {product.category.name}
              </div>

              <h1 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 font-medium">{product.rating || '4.8'} (128 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                <span className="text-2xl text-gray-400 line-through">{formatPrice(product.price * 1.3)}</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">Save 30%</span>
              </div>

              {/* Description */}
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
                <h3 className="font-bold text-lg mb-3 text-gray-900">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6 text-green-600 font-medium">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Stock - Ready to Ship
              </div>
              
              {/* Add to Cart Button */}
              <Button
                onClick={() => onAddToCart(product)}
                disabled={isInCart}
                className={`w-full py-4 text-lg font-bold rounded-2xl transition-all transform hover:scale-105 ${
                  isInCart 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:shadow-2xl'
                }`}
              >
                {isInCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Already in Cart
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </span>
                )}
              </Button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <div className="text-xs text-gray-600 font-medium">Free Shipping</div>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div className="text-xs text-gray-600 font-medium">Secure Payment</div>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div className="text-xs text-gray-600 font-medium">Easy Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-4xl font-bold text-gray-900">You May Also Like</h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-primary-600 to-transparent rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  isInCart={cart.some(item => item.id === relatedProduct.id)}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
