import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
          setUser(res.data.data);
        } catch (err) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Register user
  const register = async (email, password, role) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
      email,
      password,
      role
    });
    
    // if (res.data.success) {
    //   localStorage.setItem('token', res.data.token);
    //   axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    //   setUser(res.data.user);
    // }
    
    return res.data;
  };

  // Login user
  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email,
      password
    });
    
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
    }
    
    return res.data;
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update user information
  const updateUser = (userData) => {
    setUser(userData);
  };

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      logout();
      return null;
    }
  };
  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};