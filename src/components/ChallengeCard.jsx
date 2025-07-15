
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ShoppingCart, CheckCircle } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import { useCart } from '../contexts/CartContext';

// export const ChallengeCard = ({ challenge, isPurchased }) => {
//   const { user } = useAuth();
//   const { addToCart, isInCart } = useCart();

//   const isAdmin = user?.role === 'admin';
//   const inCart = isInCart(challenge._id);

//   const getDifficultyColor = (difficulty) => {
//     switch(difficulty) {
//       case 'Easy': return 'bg-green-100 text-green-800';
//       case 'Medium': return 'bg-yellow-100 text-yellow-800';
//       case 'Hard': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (user) {
//       addToCart(challenge._id);
//     } else {
//       window.location.href = '/login';
//     }
//   };

//   return (
//     <Link 
//       to={`/challenges/${challenge._id}`}
//       className="block rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
//     >
//       <div className="p-5">
//         <div className="flex justify-between items-start mb-3">
//           <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
//           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
//             {challenge.difficulty}
//           </span>
//         </div>

//         <p className="text-gray-600 text-sm line-clamp-3 mb-4">{challenge.description}</p>

//         <div className="flex justify-between items-center">
//           <div className="text-lg font-bold text-gray-800">
//             {challenge.tokenCost === 0 ? (
//               <span className="text-green-500">Free</span>
//             ) : (
//               <span>{challenge.tokenCost} Tokens</span>
//             )}
//           </div>

//           {isAdmin ? (
//             <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500">
//               Explore
//             </button>
//           ) : isPurchased ? (
//             <span className="inline-flex items-center text-green-600">
//               <CheckCircle className="h-5 w-5 mr-1" />
//               <span className="text-sm font-medium">Purchased</span>
//             </span>
//           ) : (
//             <button
//               onClick={handleAddToCart}
//               disabled={inCart || !user || (user.tokens < challenge.tokenCost)}
//               className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
//                 inCart || !user || (user.tokens < challenge.tokenCost)
//                   ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
//                   : 'bg-blue-600 text-white hover:bg-blue-500'
//               }`}
//             >
//               <ShoppingCart className="h-4 w-4 mr-1" />
//               {inCart 
//                 ? 'In Cart' 
//                 : (!user || (user.tokens < challenge.tokenCost)) 
//                   ? 'Not Enough Tokens' 
//                   : 'Add to Cart'}
//             </button>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// };


import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const ChallengeCard = ({ 
  challenge, 
  isPurchased,
  isSelected,
  onSelect,
  showCheckbox = false
}) => {
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();

  const isAdmin = user?.role === 'admin';
  const inCart = isInCart(challenge._id);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      addToCart(challenge._id);
    } else {
      window.location.href = '/login';
    }
  };

  const handleSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect && onSelect(challenge._id);
  };

  return (
    <Link 
      to={`/challenges/${challenge._id}`}
      className={`block rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {showCheckbox && !isPurchased && (
        <div 
          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${
            isSelected ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'
          }`}
          onClick={handleSelect}
        >
          {isSelected && <Check className="h-4 w-4" />}
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{challenge.description}</p>

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-gray-800">
            {challenge.tokenCost === 0 ? (
              <span className="text-green-500">Free</span>
            ) : (
              <span>{challenge.tokenCost} Tokens</span>
            )}
          </div>

          {isAdmin ? (
            <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500">
              Explore
            </button>
          ) : isPurchased ? (
            <span className="inline-flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Purchased</span>
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={inCart || !user || (user.tokens < challenge.tokenCost)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                inCart || !user || (user.tokens < challenge.tokenCost)
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {inCart 
                ? 'In Cart' 
                : (!user || (user.tokens < challenge.tokenCost)) 
                  ? 'Not Enough Tokens' 
                  : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};