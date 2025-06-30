
import React, { useState, useEffect } from 'react';
import { ArrowRight, Coins, History, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const TokenManagement = () => {
  const { user, refreshUser } = useAuth();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Token packages available for purchase
  const tokenPackages = [
    { id: 1, tokens: 50, price: 4.99, bonus: 0, stripePriceId: 'price_1RN5bPDEBDGtWMY2K1nqFOLp' },
    { id: 2, tokens: 100, price: 9.99, bonus: 10, stripePriceId: 'price_1RN5bQDEBDGtWMY2qEo5fBgW' },
    { id: 3, tokens: 250, price: 19.99, bonus: 50, stripePriceId: 'price_1RN5bQDEBDGtWMY2SgcV7qO5' },
    { id: 4, tokens: 500, price: 34.99, bonus: 100, stripePriceId: 'price_1RN5bRDEBDGtWMY24hy8WlBU' },
    { id: 5, tokens: 1000, price: 59.99, bonus: 250, stripePriceId: 'price_1RN5bSDEBDGtWMY2TTaZqfMh' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await refreshUser();
        setTokenBalance(user?.tokens || 0);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions/my`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTransactions(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    try {
      setLoading(true);
      
      // Create a Stripe checkout session
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-checkout-session`,
        {
          priceId: selectedPackage.stripePriceId,
          packageId: selectedPackage.id,
          tokens: selectedPackage.tokens + selectedPackage.bonus,
          amount: selectedPackage.price
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const sessionId = response.data.sessionId;
      const stripe = await stripePromise;
      
      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Token balance and purchase */}
        <div className="md:w-2/3 space-y-8">
          {/* Token balance card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium mb-1">Your Token Balance</h2>
                <div className="flex items-end">
                  <span className="text-4xl font-bold mr-2">{tokenBalance}</span>
                  <Coins className="h-8 w-8 mb-1" />
                </div>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Active
              </div>
            </div>
            <p className="mt-4 text-blue-100">
              Tokens never expire. Use them to unlock challenges and premium content.
            </p>
          </div>

          {/* Purchase tokens section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Coins className="h-6 w-6 mr-2 text-blue-600" />
              Purchase Tokens
            </h2>
            
            {/* Token packages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {tokenPackages.map(pkg => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{pkg.tokens} Tokens</h3>
                      {pkg.bonus > 0 && (
                        <span className="text-sm text-blue-600 font-medium">
                          + {pkg.bonus} bonus
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold">${pkg.price.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    ${(pkg.price / (pkg.tokens + pkg.bonus)).toFixed(2)} per token
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase button */}
            <button
              onClick={handlePurchase}
              disabled={!selectedPackage || loading}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center ${
                selectedPackage && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                'Processing...'
              ) : selectedPackage ? (
                <>
                  Purchase {selectedPackage.tokens + selectedPackage.bonus} Tokens
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                'Select a package to continue'
              )}
            </button>
          </div>
        </div>

        {/* Right column - Transaction history */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <History className="h-6 w-6 mr-2 text-blue-600" />
              Transaction History
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map(tx => (
                  <div key={tx._id} className="flex items-start justify-between border-b pb-4">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {tx.type === 'purchase' ? 'Token Purchase' : 
                         tx.type === 'challenge' ? 'Challenge Unlocked' : 
                         tx.type === 'referral' ? 'Referral Bonus' : 'Transaction'}
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(tx.date)}</div>
                      {tx.details && (
                        <div className="text-sm text-gray-600 mt-1">{tx.details}</div>
                      )}
                      {tx.amount && (
                        <div className="text-sm text-gray-600 mt-1">
                          Amount: ${tx.amount.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className={`font-medium ${
                      tx.tokens > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.tokens > 0 ? '+' : ''}{tx.tokens}
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No transactions found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="mt-16 bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Token FAQs</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">What are tokens used for?</h3>
            <p className="text-gray-600 mt-1">
              Tokens are used to unlock premium challenges and content on our platform. 
              Each challenge has a token cost that will be deducted from your balance when you start it.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">Do tokens expire?</h3>
            <p className="text-gray-600 mt-1">
              No, your tokens never expire. You can accumulate them over time and use them whenever you're ready.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900">Can I get free tokens?</h3>
            <p className="text-gray-600 mt-1">
              Yes! You can earn free tokens by completing certain achievements, referring friends, 
              or participating in our community events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};