// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { CategoryCard } from '../components/CategoryCard';
// import { ArrowRight } from 'lucide-react';

// export const Home = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
//         setCategories(res.data.data);
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div>
//       {/* Hero section */}
//       <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//               Level Up Your Tech Skills with Interactive Challenges
//             </h1>
//             <p className="text-xl mb-8 max-w-3xl mx-auto">
//               Access hands-on learning experiences in cybersecurity, programming, and more. Solve real-world problems and build your portfolio.
//             </p>
//             <Link
//               to="/categories"
//               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 shadow-md"
//             >
//               Explore Challenges
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Featured categories */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Challenge Categories</h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Browse our most popular categories and start learning today.
//           </p>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {categories.slice(0, 6).map(category => (
//               <CategoryCard key={category._id} category={category} />
//             ))}
//           </div>
//         )}

//         <div className="text-center mt-12">
//           <Link
//             to="/categories"
//             className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//           >
//             View All Categories
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Link>
//         </div>
//       </section>

//       {/* How it works */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
//             <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//               Simple steps to get started with our challenge platform.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Step 1 */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
//                 1
//               </div>
//               <h3 className="text-xl font-semibold text-center mb-2">Browse Categories</h3>
//               <p className="text-gray-600 text-center">
//                 Explore our diverse range of challenge categories and find the ones that interest you.
//               </p>
//             </div>

//             {/* Step 2 */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
//                 2
//               </div>
//               <h3 className="text-xl font-semibold text-center mb-2">Purchase with Tokens</h3>
//               <p className="text-gray-600 text-center">
//                 Use your tokens to purchase challenges that match your skill level and learning goals.
//               </p>
//             </div>

//             {/* Step 3 */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
//                 3
//               </div>
//               <h3 className="text-xl font-semibold text-center mb-2">Solve & Learn</h3>
//               <p className="text-gray-600 text-center">
//                 Complete challenges at your own pace, build your portfolio, and enhance your skills.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CategoryCard } from '../components/CategoryCard';
import { ArrowRight, Rocket, Code, Shield, Zap } from 'lucide-react';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(res.data.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const scrollToHowItWorks = () => {
    const element = document.getElementById('working');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-900 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
              <Rocket className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">New challenges added weekly</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
              Master Tech Skills Through <span className="text-blue-300">Hands-On</span> Challenges
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Solve real-world problems, build your portfolio, and advance your career with our interactive learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-indigo-700 bg-white hover:bg-gray-50 shadow-lg transform transition-all hover:scale-105"
              >
                Explore Challenges
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-lg font-semibold rounded-lg text-white bg-transparent hover:bg-white/10 shadow-lg transform transition-all hover:scale-105"
              >
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Challenges</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
            LEARN BY DOING
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Challenge Categories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hands-on learning in the most in-demand tech domains
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, index) => (
              <CategoryCard 
                key={category._id} 
                category={category} 
                className="transform transition-all hover:scale-105 hover:shadow-lg"
                delay={index * 100} // for staggered animations
              />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            to="/categories"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transform transition-all hover:scale-105"
          >
            Browse All Categories
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <div id='working'>
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
              GET STARTED
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start learning in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl mb-6 mx-auto">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4">Explore Challenges</h3>
              <p className="text-gray-600 text-center text-lg">
                Browse our extensive library of challenges across various tech domains and difficulty levels.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl mb-6 mx-auto">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4">Use Your Tokens</h3>
              <p className="text-gray-600 text-center text-lg">
                Unlock challenges with your tokens and get immediate access to the learning materials.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl mb-6 mx-auto">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4">Solve & Build</h3>
              <p className="text-gray-600 text-center text-lg">
                Complete challenges, get feedback, and add projects to your professional portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* CTA section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Level Up Your Skills?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join thousands of developers and tech professionals who are advancing their careers with our challenges.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-indigo-700 bg-white hover:bg-gray-50 shadow-lg transform transition-all hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};