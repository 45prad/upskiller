// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Lock } from 'lucide-react';

// export const CategoryCard = ({ category }) => {
//   return (
//     <Link
//       to={`/categories/${category._id}`}
//       className="flex flex-col justify-between rounded-2xl bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out p-5 w-full max-w-sm"
//     >
//       {/* Top section */}
//       <div className="relative flex items-center gap-4 mb-4">
//         <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
//           <img
//             src={category.imageUrl}
//             alt={category.name}
//             className="w-12 h-12 object-contain"
//           />
//         </div>

//         <div className="flex-1">
//           <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
//           <div className="flex items-center text-xs text-gray-500 gap-4 mt-1">
//             <span>🏁 <strong>{category.challengeCount || 0}</strong> Challenges</span>
//             <span>⏱ <strong>{category.hoursRequired || 0}</strong> hrs</span>
//           </div>
//           <div className="mt-1">
//             <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
//               {category.difficulty}
//             </span>
//           </div>
//         </div>

//         {category.locked && (
//           <div className="absolute top-0 right-0">
//             <div className="bg-white p-1 rounded-full shadow-sm">
//               <Lock className="w-4 h-4 text-gray-500" />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Description */}
//       <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
//         {category.description}
//       </p>

//       {/* Bottom section */}
//       <div className="flex justify-end">
//         <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold py-1.5 px-5 rounded-md transition-colors shadow-sm">
//           Explore
//         </button>
//       </div>
//     </Link>
//   );
// };
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/categories/${category._id}`}
      className="flex flex-col justify-between rounded-2xl bg-white shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out p-5 w-full max-w-sm"
    >
      {/* Top section */}
      <div className="relative flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-inner overflow-hidden">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
          <div className="flex items-center text-xs text-gray-500 gap-4 mt-1">
            <span>🏁 <strong>{category.challengeCount || 0}</strong> Challenges</span>
            <span>⏱ <strong>{category.hoursRequired || 0}</strong> hrs</span>
          </div>
          <div className="mt-1">
            <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              {category.difficulty}
            </span>
          </div>
        </div>

        {category.locked && (
          <div className="absolute top-0 right-0">
            <div className="bg-white p-1 rounded-full shadow-sm">
              <Lock className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
        {category.description}
      </p>

      {/* Bottom section */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold py-1.5 px-5 rounded-md transition-colors shadow-sm">
          Explore
        </button>
      </div>
    </Link>
  );
};