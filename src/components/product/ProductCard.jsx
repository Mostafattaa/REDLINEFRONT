import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function ProductCard({ product, isInCart, onAddToCart }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{product.category.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${product.price}
          </span>
          <Button
            onClick={() => onAddToCart(product)}
            disabled={isInCart}
            className="min-w-[44px] min-h-[44px]"
            aria-label={`Add ${product.title} to cart`}
          >
            {isInCart ? 'In Cart' : 'Add'}
          </Button>
        </div>
      </div>
    </article>
  );
}
