import { ProductCard } from './ProductCard';
import { SkeletonCard } from '../ui/SkeletonCard';

export function ProductGrid({ products, cart, onAddToCart, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          isInCart={cart.some(item => item.id === product.id)}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
