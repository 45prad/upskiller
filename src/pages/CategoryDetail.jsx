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
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    const fetchCategoryAndChallenges = async () => {
      try {
        await refreshUser();
        setLoading(true);
        // Fetch category details
        const categoryRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${id}`);
        setCategory(categoryRes.data.data);
        
        // Fetch challenges in this category
        const challengesRes = await axios.get(`${import.meta.env.VITE_API_URL}/challenges/category/${id}`);
        setChallenges(challengesRes.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndChallenges();
  }, [id]);

  // Filter challenges by difficulty
  const filteredChallenges = challenges.filter(challenge => 
    selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty
  );

  // Check if user has purchased a challenge
  const isPurchased = (challengeId) => {
    return user?.purchasedChallenges?.includes(challengeId) || false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

      {/* Filter controls */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Challenges</h2>
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
        </div>
      </div>

      {/* Challenges grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <ChallengeCard 
              key={challenge._id} 
              challenge={challenge}
              isPurchased={isPurchased(challenge._id)}
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