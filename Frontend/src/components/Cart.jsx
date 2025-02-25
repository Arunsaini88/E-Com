// src/components/Cart.jsx
import React from 'react';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { cart, removeFromCart, total } = useCart();

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t">
            <p className="text-lg font-bold">Total: ${total}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;