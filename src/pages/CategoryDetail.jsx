// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ChallengeCard } from '../components/ChallengeCard';
// import { useAuth } from '../contexts/AuthContext';

// export const CategoryDetail = () => {
//   const { id } = useParams();
//   const { user, refreshUser } = useAuth();
//   const [category, setCategory] = useState(null);
//   const [challenges, setChallenges] = useState([]);
//   const [purchasedChallenges, setPurchasedChallenges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDifficulty, setSelectedDifficulty] = useState('All');
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCategoryAndChallenges = async () => {
//       try {
//         await refreshUser();
//         setLoading(true);
//         setError(null);
        
//         // Fetch category details
//         const categoryRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${id}`);
//         setCategory(categoryRes.data.data);
        
//         // Fetch challenges in this category
//         const challengesRes = await axios.get(`${import.meta.env.VITE_API_URL}/challenges/category/${id}`);
//         setChallenges(challengesRes.data.data);
        
//         // Fetch purchased challenges if user is logged in
//         if (user) {
//           try {
//             const purchasedRes = await axios.get(
//               `${import.meta.env.VITE_API_URL}/users/purchased-challenges`,
//               {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//               }
//             );
//             setPurchasedChallenges(purchasedRes.data.data);
//           } catch (purchaseError) {
//             console.error('Error fetching purchased challenges:', purchaseError);
//             // Continue even if purchased challenges fail to load
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load category data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategoryAndChallenges();
//   }, []);

//   // Filter challenges by difficulty
//   const filteredChallenges = challenges.filter(challenge => 
//     selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty
//   );

//   // Check if user has purchased a challenge
//   const isPurchased = (challengeId) => {
//     return purchasedChallenges.some(pc => pc._id === challengeId);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
//         <h1 className="text-2xl font-semibold text-gray-900">{error}</h1>
//         <button 
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!category) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
//         <h1 className="text-2xl font-semibold text-gray-900">Category not found</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Category header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 mb-8 text-white">
//         <div className="md:flex md:items-center md:justify-between">
//           <div className="md:flex-1">
//             <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
//             <div className="flex items-center mb-4">
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800 mr-2">
//                 {category.difficulty}
//               </span>
//               <span className="text-sm opacity-80">{challenges.length} Challenges</span>
//               {category.hoursRequired && (
//                 <span className="text-sm opacity-80 ml-4">{category.hoursRequired}h</span>
//               )}
//             </div>
//             <p className="text-lg opacity-90 mb-4 max-w-3xl">{category.description}</p>
//           </div>
//           <div className="mt-4 md:mt-0 md:ml-6">
//             <img 
//               src={category.imageUrl} 
//               alt={category.name}
//               className="w-24 h-24 object-contain bg-white bg-opacity-20 p-4 rounded-lg"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Filter controls */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Challenges</h2>
//           <select
//             className="block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             value={selectedDifficulty}
//             onChange={(e) => setSelectedDifficulty(e.target.value)}
//           >
//             <option value="All">All Difficulties</option>
//             <option value="Easy">Easy</option>
//             <option value="Medium">Medium</option>
//             <option value="Hard">Hard</option>
//           </select>
//         </div>
//       </div>

//       {/* Challenges grid */}
//       {filteredChallenges.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredChallenges.map(challenge => (
//             <ChallengeCard 
//               key={challenge._id} 
//               challenge={challenge}
//               isPurchased={isPurchased(challenge._id)}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <p className="text-lg text-gray-600">
//             No challenges found matching the selected difficulty.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChallengeCard } from '../components/ChallengeCard';
import { useAuth } from '../contexts/AuthContext';

export const CategoryDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [category, setCategory] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [purchasedChallenges, setPurchasedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [error, setError] = useState(null);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const fetchCategoryAndChallenges = async () => {
      try {
        await refreshUser();
        setLoading(true);
        setError(null);
        
        const categoryRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${id}`);
        setCategory(categoryRes.data.data);
        
        const challengesRes = await axios.get(`${import.meta.env.VITE_API_URL}/challenges/category/${id}`);
        setChallenges(challengesRes.data.data);
        
        if (user) {
          const purchasedRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/purchased-challenges`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
          );
          setPurchasedChallenges(purchasedRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load category data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndChallenges();
  }, []);

  // Toggle challenge selection
  const toggleChallengeSelection = (challengeId) => {
    setSelectedChallenges(prev => 
      prev.includes(challengeId)
        ? prev.filter(id => id !== challengeId)
        : [...prev, challengeId]
    );
  };

  // Select all visible challenges
  const selectAllChallenges = () => {
    const unpurchased = filteredChallenges
      .filter(c => !isPurchased(c._id))
      .map(c => c._id);
    
    if (selectedChallenges.length === unpurchased.length) {
      setSelectedChallenges([]);
    } else {
      setSelectedChallenges(unpurchased);
    }
  };

  // Calculate total cost of selected challenges
  const totalCost = selectedChallenges.reduce((sum, challengeId) => {
    const challenge = challenges.find(c => c._id === challengeId);
    return sum + (challenge?.tokenCost || 0);
  }, 0);

  // Handle bulk purchase
  const handleBulkPurchase = async () => {
    if (selectedChallenges.length === 0) return;
    
    setIsPurchasing(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/challenges/bulk-purchase`,
        { challengeIds: selectedChallenges },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );

      if (response.data.success) {
        alert(`Successfully purchased ${selectedChallenges.length} challenges!`);
        await refreshUser();
        setSelectedChallenges([]);
        
        // Refresh purchased challenges
        const purchasedRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/purchased-challenges`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
        );
        setPurchasedChallenges(purchasedRes.data.data);
      }
    } catch (err) {
      console.error('Purchase error:', err);
      alert(err.response?.data?.error || 'Failed to purchase challenges');
    } finally {
      setIsPurchasing(false);
    }
  };

  // Filter challenges by difficulty
  const filteredChallenges = challenges.filter(challenge => 
    selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty
  );

  // Check if user has purchased a challenge
  const isPurchased = (challengeId) => {
    return purchasedChallenges.some(pc => pc._id === challengeId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">{error}</h1>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:flex-1">
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800 mr-2">
                {category.difficulty}
              </span>
              <span className="text-sm opacity-80">{challenges.length} Challenges</span>
              {category.hoursRequired && (
                <span className="text-sm opacity-80 ml-4">{category.hoursRequired}h</span>
              )}
            </div>
            <p className="text-lg opacity-90 mb-4 max-w-3xl">{category.description}</p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <img 
              src={category.imageUrl} 
              alt={category.name}
              className="w-24 h-24 object-contain bg-white bg-opacity-20 p-4 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Filter and bulk purchase controls */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Challenges</h2>
          <div className="flex items-center gap-4">
            <select
              className="block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {filteredChallenges.some(c => !isPurchased(c._id)) && (
              <button
                onClick={selectAllChallenges}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {selectedChallenges.length === filteredChallenges.filter(c => !isPurchased(c._id)).length 
                  ? 'Deselect All' 
                  : 'Select All'}
              </button>
            )}

            {selectedChallenges.length > 0 && (
              <button
                onClick={handleBulkPurchase}
                disabled={isPurchasing || (user?.tokens < totalCost)}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  user?.tokens >= totalCost 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isPurchasing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Purchasing...
                  </>
                ) : (
                  `Purchase ${selectedChallenges.length} (${totalCost} Tokens)`
                )}
              </button>
            )}
          </div>
        </div>

        {selectedChallenges.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            {!user ? (
              <span className="text-red-600">Please login to purchase challenges</span>
            ) : user.tokens < totalCost ? (
              <span className="text-red-600">
                You need {totalCost - user.tokens} more tokens to purchase these challenges
              </span>
            ) : (
              <span>You have enough tokens to purchase these challenges</span>
            )}
          </div>
        )}
      </div>

      {/* Challenges grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <ChallengeCard 
              key={challenge._id} 
              challenge={challenge}
              isPurchased={isPurchased(challenge._id)}
              isSelected={selectedChallenges.includes(challenge._id)}
              onSelect={toggleChallengeSelection}
              showCheckbox={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">
            No challenges found matching the selected difficulty.
          </p>
        </div>
      )}
    </div>
  );
};