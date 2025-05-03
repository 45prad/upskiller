import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">ChallengeLab</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:text-white">
                Home
              </Link>
              <Link to="/categories" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:text-white">
                Categories
              </Link>
              {user && user.role === 'user' && (
                <Link to="/purchased" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:text-white">
                  My Challenges
                </Link>
              )}
              {user && user.role === 'user' && (
                <Link to="/tokenmanagement" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:text-white">
                  Token Management
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:text-white">
                  Admin
                </Link>
              )}
               {user && user.role === 'admin' && (
                <Link to="/admin/transactions" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 hover:text-white">
                  Transactions
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <div className="px-3 py-2 rounded-md text-sm font-medium">
                  <span className="mr-1">Tokens:</span>
                  <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded-full font-bold">
                    {user.tokens}
                  </span>
                </div>
                <Link to="/cart" className="relative p-2 rounded-full hover:bg-blue-600">
                  <ShoppingCart className="h-6 w-6" />
                  {cart.items && cart.items.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {cart.items.length}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="p-2 rounded-full hover:bg-blue-600">
                  <User className="h-6 w-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-blue-600"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 font-medium rounded-md bg-blue-600 hover:bg-blue-500"
                >
                  Log in
                </Link>

                {user && user.role === 'admin' && (
                <Link
                  to="/register"
                  className="px-4 py-2 font-medium rounded-md bg-white text-blue-600 hover:bg-gray-100"
                >
                  Add user
                </Link>
                )}
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            {user && (
              <Link
                to="/purchased"
                className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                My Challenges
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            {user ? (
              <div className="px-2 space-y-1">
                <div className="block px-3 py-2 rounded-md text-white font-medium">
                  <span>Tokens: </span>
                  <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded-full font-bold">
                    {user.tokens}
                  </span>
                </div>
                <Link
                  to="/cart"
                  className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart {cart.items && cart.items.length > 0 && `(${cart.items.length})`}
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};