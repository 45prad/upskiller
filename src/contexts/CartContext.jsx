import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalTokens: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch cart when user is logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`);
          setCart(res.data.data || { items: [], totalTokens: 0 });
        } catch (err) {
          console.error('Error fetching cart:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setCart({ items: [], totalTokens: 0 });
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Add to cart
  const addToCart = async (challengeId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/add/${challengeId}`);
      setCart(res.data.data);
      return res.data;
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  // Remove from cart
  const removeFromCart = async (challengeId) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/remove/${challengeId}`);
      setCart(res.data.data);
      return res.data;
    } catch (err) {
      console.error('Error removing from cart:', err);
      throw err;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`);
      setCart({ items: [], totalTokens: 0 });
      return res.data;
    } catch (err) {
      console.error('Error clearing cart:', err);
      throw err;
    }
  };

  // Checkout
  const checkout = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/checkout`);
      setCart({ items: [], totalTokens: 0 });
      return res.data;
    } catch (err) {
      console.error('Error checking out:', err);
      throw err;
    }
  };

  // Add a function to refresh the cart
const refreshCart = async () => {
  if (user) {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`);
      setCart(res.data.data || { items: [], totalTokens: 0 });
    } catch (err) {
      console.error('Error refreshing cart:', err);
    }
  }
};

  // Check if challenge is in cart
  const isInCart = (challengeId) => {
    return cart.items.some(item => item.challenge._id === challengeId || item.challenge === challengeId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        isInCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};