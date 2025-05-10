import React from 'react';
import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Canceled</h1>
        <p className="text-gray-600 mt-2">
          Your payment was not completed. No charges have been made to your account.
        </p>
        <button
          onClick={() => navigate('/tokenmanagement')}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
        >
          Back to Token Management
        </button>
      </div>
    </div>
  );
};