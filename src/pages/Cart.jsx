import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

export const Cart = () => {
  const { cart, removeFromCart, clearCart, checkout, loading } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const res = await checkout();
      // Update user tokens
      updateUser({
        ...user,
        tokens: user.tokens - cart.totalTokens,
        purchasedChallenges: [...user.purchasedChallenges, ...res.data.purchasedChallenges]
      });
      
      navigate('/purchased');
    } catch (err) {
      console.error('Error during checkout:', err);
    }
  };

  const handleRemoveItem = async (challengeId) => {
    try {
      await removeFromCart(challengeId);
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      {cart.items && cart.items.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Challenge
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <tr key={item.challenge._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.challenge.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        item.challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.challenge.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                      {item.challenge.tokenCost} Tokens
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(item.challenge._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear cart
                </button>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">
                  Your token balance: <span className="font-medium">{user.tokens}</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  Total: {cart.totalTokens} Tokens
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {user.tokens < cart.totalTokens ? (
              <div className="flex items-start p-4 mb-4 bg-yellow-50 rounded-md border border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  You don't have enough tokens to purchase these challenges. Your balance: {user.tokens} tokens.
                </div>
              </div>
            ) : (
              <div className="flex items-start p-4 mb-4 bg-green-50 rounded-md border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  You have enough tokens to complete this purchase. Your balance: {user.tokens} tokens.
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleCheckout}
                disabled={user.tokens < cart.totalTokens}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  user.tokens < cart.totalTokens
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Explore our challenges and add some to your cart.
          </p>
          <button
            onClick={() => navigate('/categories')}
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Browse Categories
          </button>
        </div>
      )}
    </div>
  );
};