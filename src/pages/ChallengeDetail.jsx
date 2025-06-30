

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../contexts/AuthContext';
// import { useCart } from '../contexts/CartContext';
// import { ShoppingCart, Lock, Check } from 'lucide-react';

// export const ChallengeDetail = () => {
//   const { id } = useParams();
//   // const { user } = useAuth();
//   const { refreshCart } = useCart();
//   const { user, updateUser } = useAuth();
//   const { addToCart, isInCart } = useCart();
//   const navigate = useNavigate();

//   const [challenge, setChallenge] = useState(null);
//   const [category, setCategory] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isPurchased, setIsPurchased] = useState(false);

  
//   useEffect(() => {
//     const fetchChallengeDetails = async () => {
//       try {
//         setLoading(true);
  
//         // Fetch public challenge details
//         const res = await axios.get(`${import.meta.env.VITE_API_URL}/challenges/${id}/details`);
//         setChallenge(res.data.data);
//         setCategory(res.data.data.category);
  
//         if (user) {
//           // If user is admin, directly fetch and show content
//           if (user.role === 'admin') {
//             setIsPurchased(true);
//             const contentRes = await axios.get(`${import.meta.env.VITE_API_URL}/challenges/${id}/content`);
//             setChallenge((prev) => ({ ...prev, content: contentRes.data.data.content }));
//           } else {
//             // For regular users, check if they've purchased the challenge
//             const purchasedRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/purchased-challenges`);
//             const isPurchased = purchasedRes.data.data.some((ch) => ch._id === id);
//             setIsPurchased(isPurchased);
  
//             // Fetch content if purchased
//             if (isPurchased) {
//               const contentRes = await axios.get(`${import.meta.env.VITE_API_URL}/challenges/${id}/content`);
//               setChallenge((prev) => ({ ...prev, content: contentRes.data.data.content }));
//             }
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching challenge details:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchChallengeDetails();
//   }, [id, user]);
  
//   const handleAddToCart = async () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     try {
//       await addToCart(challenge._id);
//     } catch (err) {
//       console.error('Error adding to cart:', err);
//     }
//   };

//   const handlePurchase = async () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     try {
//       await axios.post(`${import.meta.env.VITE_API_URL}/challenges/${id}/purchase`);
//       setIsPurchased(true);

//       // Fetch content after purchase
//       const contentRes = await axios.get(`${import.meta.env.VITE_API_URL}/challenges/${id}/content`);
//       setChallenge((prev) => ({ ...prev, content: contentRes.data.data.content }));
//       refreshCart();
//       const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
//       updateUser(userRes.data.data); // Update user context with the new token count
//     } catch (err) {
//       console.error('Error purchasing challenge:', err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!challenge) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
//         <h1 className="text-2xl font-semibold text-gray-900">Challenge not found</h1>
//       </div>
//     );
//   }

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'Easy':
//         return 'bg-green-100 text-green-800';
//       case 'Medium':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'Hard':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const inCart = isInCart(challenge._id);
//   const canBuyDirectly = user && user.tokens >= challenge.tokenCost;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         {/* Challenge Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
//               <div className="flex items-center mb-4">
//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
//                     challenge.difficulty
//                   )}`}
//                 >
//                   {challenge.difficulty}
//                 </span>
//                 {category && (
//                   <span className="ml-2 text-sm opacity-90">
//                     Category: {category.name}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="text-xl font-bold bg-white text-blue-700 px-4 py-2 rounded-lg shadow">
//               {challenge.tokenCost === 0 ? 'Free' : `${challenge.tokenCost} Tokens`}
//             </div>
//           </div>
//         </div>

//         {/* Challenge Content */}
//         <div className="p-8">
//           <div className="prose max-w-none mb-8">
//             <h2 className="text-2xl font-bold mb-4">Description</h2>
//             <p className="text-lg text-gray-700 mb-6">{challenge.description}</p>

//             {isPurchased ? (
//               <div>
//                 <h2 className="text-2xl font-bold mb-4">Challenge Content</h2>
//                 <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                   <p className="text-gray-800">{challenge.content}</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
//                 <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-700 mb-2">Challenge Content Locked</h3>
//                 <p className="text-gray-600 mb-6">
//                   Purchase this challenge to unlock its content and start learning.
//                 </p>

//                 <div className="flex flex-col sm:flex-row justify-center gap-4">
//                   {!inCart && (
//                     <button
//                       onClick={handleAddToCart}
//                       disabled={inCart || !user || (user && user.tokens < challenge.tokenCost)}
//                       className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center ${
//                         !user || (user && user.tokens < challenge.tokenCost)
//                           ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                           : 'bg-blue-600 text-white hover:bg-blue-500'
//                       }`}
//                     >
//                       <ShoppingCart className="h-4 w-4 mr-2" />
//                       {inCart ? 'In Cart' : 'Add to Cart'}
//                     </button>
//                   )}

//                   {canBuyDirectly && (
//                     <button
//                       onClick={handlePurchase}
//                       className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 flex items-center justify-center"
//                     >
//                       <Check className="h-4 w-4 mr-2" />
//                       Buy Now ({challenge.tokenCost} Tokens)
//                     </button>
//                   )}
//                 </div>

//                 {!user && (
//                   <p className="mt-4 text-sm text-gray-500">
//                     Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to purchase this challenge.
//                   </p>
//                 )}

//                 {user && user.tokens < challenge.tokenCost && (
//                   <p className="mt-4 text-sm text-gray-500">
//                     You don't have enough tokens to purchase this challenge.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Lock, Check } from 'lucide-react';

export const ChallengeDetail = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const { addToCart, isInCart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/challenges/${id}/details`);
        setChallenge(res.data.data);
        setCategory(res.data.data.category);

        if (user) {
          // If user is admin, mark as purchased
          if (user.role === 'admin') {
            setIsPurchased(true);
          } else {
            // For regular users, check if they've purchased the challenge
            const purchasedRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/purchased-challenges`);
            const purchased = purchasedRes.data.data.some((ch) => ch._id === id);
            setIsPurchased(purchased);
          }
        }
      } catch (err) {
        console.error('Error fetching challenge details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeDetails();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(challenge._id);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/challenges/${id}/purchase`);
      setIsPurchased(true);
      refreshCart();
      const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
      updateUser(userRes.data.data);
    } catch (err) {
      console.error('Error purchasing challenge:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Challenge not found</h1>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const inCart = isInCart(challenge._id);
  const canBuyDirectly = user && user.tokens >= challenge.tokenCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Challenge Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
              <div className="flex items-center mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                    challenge.difficulty
                  )}`}
                >
                  {challenge.difficulty}
                </span>
                {category && (
                  <span className="ml-2 text-sm opacity-90">
                    Category: {category.name}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xl font-bold bg-white text-blue-700 px-4 py-2 rounded-lg shadow">
              {challenge.tokenCost === 0 ? 'Free' : `${challenge.tokenCost} Tokens`}
            </div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="p-8">
          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-lg text-gray-700 mb-6">{challenge.description}</p>

            <div>
              <h2 className="text-2xl font-bold mb-4">Challenge Content</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <p className="text-gray-800">{challenge.content}</p>
              </div>
            </div>

            {!isPurchased && challenge.tokenCost > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Ready to take on this challenge?
                </h3>
                <p className="text-blue-600 mb-6">
                  Purchase this challenge to unlock its content and start learning.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {!inCart && (
                    <button
                      onClick={handleAddToCart}
                      disabled={inCart || !user || (user && user.tokens < challenge.tokenCost)}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center ${
                        !user || (user && user.tokens < challenge.tokenCost)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {inCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                  )}

                  {canBuyDirectly && (
                    <button
                      onClick={handlePurchase}
                      className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Buy Now ({challenge.tokenCost} Tokens)
                    </button>
                  )}
                </div>

                {!user && (
                  <p className="mt-4 text-sm text-blue-600">
                    Please <a href="/login" className="text-blue-700 hover:underline font-medium">log in</a> to purchase this challenge.
                  </p>
                )}

                {user && user.tokens < challenge.tokenCost && (
                  <p className="mt-4 text-sm text-blue-600">
                    You don't have enough tokens to purchase this challenge.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};