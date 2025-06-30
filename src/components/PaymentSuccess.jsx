import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/payments/verify-payment?session_id=${sessionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        await refreshUser();
      } catch (error) {
        console.error('Payment verification failed:', error);
        navigate('/tokenmanagement');
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      navigate('/tokenmanagement');
    }
  }, [sessionId, navigate, refreshUser]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase. Your tokens have been added to your account.
        </p>
        <button
          onClick={() => navigate('/token-management')}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
        >
          Back to Token Management
        </button>
      </div>
    </div>
  );
};