import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/assets/redline.png" alt="E-Commerce Platform" className="h-10 mb-4 brightness-0 invert" />
            <p className="text-gray-400">
              Your trusted online shopping destination
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white">All Products</Link></li>
              <li><Link to="/products?category=laptops" className="text-gray-400 hover:text-white">Laptops</Link></li>
              <li><Link to="/products?category=smartphones" className="text-gray-400 hover:text-white">SmartPhones</Link></li>
              <li><Link to="/products?category=vehicle" className="text-gray-400 hover:text-white">Vehicles</Link></li>
              <li><Link to="/products?category=furniture" className="text-gray-400 hover:text-white">Furniture</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Redline</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe for updates</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2026 Redline. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
