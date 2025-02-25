// src/components/Navbar.jsx
import React from 'react';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">E-Commerce Store</span>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center space-x-4">
              <div className="relative">
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
                <span className="text-gray-600">Cart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;