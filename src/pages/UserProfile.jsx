import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ShoppingBag } from 'lucide-react';

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-12 text-white text-center">
            <div className="inline-block p-4 rounded-full bg-white/20 mb-4">
              <User className="h-16 w-16" />
            </div>
            <h1 className="text-3xl font-bold">{user.email}</h1>
            <p className="mt-2 text-blue-100 capitalize">
              {user.role}
            </p>
          </div>
          
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="bg-yellow-100 text-yellow-800 px-6 py-4 rounded-lg flex items-center">
                <div className="text-4xl font-bold mr-4">{user.tokens}</div>
                <div className="text-sm">
                  <p className="font-semibold">Available Tokens</p>
                  <p>Use them to purchase challenges</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/purchased')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Purchased Challenges
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            </div>
            
            {user.role === 'admin' && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h2>
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Go to Admin Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};