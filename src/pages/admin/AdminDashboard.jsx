import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, FolderTree, BarChart2, Plus } from 'lucide-react';
import axios from 'axios';

export const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    categories: 0,
    challenges: 0
  });
  
  // Category form data
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    difficulty: 'Intermediate',
    hoursRequired: 0
  });

  // Challenge form data
  const [challengeFormData, setChallengeFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Medium',
    tokenCost: 0,
    content: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      const [categoriesRes, usersCountRes, challengesCountRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/categories/getCategoriesCount`),
        axios.get(`${import.meta.env.VITE_API_URL}/users/getUsersCount`),
        axios.get(`${import.meta.env.VITE_API_URL}/challenges/getChallengesCount`)
      ]);
      setCounts({
        users: usersCountRes.data.data.count,
        categories: categoriesRes.data.data.count,
        challenges: challengesCountRes.data.data.count
      });
      setCategories(res.data.data);
      // Set default category for challenge form
      if (res.data.data.length > 0) {
        setChallengeFormData(prev => ({
          ...prev,
          category: res.data.data[0]._id
        }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Category modal handlers
  const handleOpenCategoryModal = () => {
    setShowCategoryModal(true);
    setCategoryFormData({
      name: '',
      description: '',
      imageUrl: '',
      difficulty: 'Intermediate',
      hoursRequired: 0
    });
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/categories`, categoryFormData);
      handleCloseCategoryModal();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
    }
  };

  // Challenge modal handlers
  const handleOpenChallengeModal = () => {
    setShowChallengeModal(true);
    setChallengeFormData({
      title: '',
      description: '',
      category: categories.length > 0 ? categories[0]._id : '',
      difficulty: 'Medium',
      tokenCost: 0,
      content: ''
    });
  };

  const handleCloseChallengeModal = () => {
    setShowChallengeModal(false);
  };

  const handleChallengeChange = (e) => {
    const { name, value } = e.target;
    setChallengeFormData(prev => ({
      ...prev,
      [name]: name === 'tokenCost' ? parseInt(value) : value
    }));
  };

  const handleChallengeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/challenges`, challengeFormData);
      handleCloseChallengeModal();
    } catch (err) {
      console.error('Error saving challenge:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Users card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{counts.users}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/users" className="text-sm text-blue-600 hover:underline">
              View details →
            </Link>
          </div>
        </div>
        
        {/* Categories card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{counts.categories}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FolderTree className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/categories" className="text-sm text-purple-600 hover:underline">
              Manage categories →
            </Link>
          </div>
        </div>
        
        {/* Challenges card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Challenges</p>
              <p className="text-3xl font-bold text-gray-900">{counts.challenges}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/challenges" className="text-sm text-green-600 hover:underline">
              Manage challenges →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleOpenCategoryModal}
              className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <FolderTree className="mr-2 h-5 w-5" />
              Add New Category
            </button>
            <button
              onClick={handleOpenChallengeModal}
              className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Add New Challenge
            </button>
            <Link
              to="/admin/users"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Users className="mr-2 h-5 w-5" />
              Manage Users
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <BarChart2 className="mr-2 h-5 w-5" />
              View Reports
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent activity
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
        </div>
        <div className="px-6 py-4">
          <ul className="divide-y divide-gray-200">
            <li className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">New user registered</h3>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Challenge purchased</h3>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                  <p className="text-sm text-gray-500">Web Exploitation: SQL Injection</p>
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">New category added</h3>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                  <p className="text-sm text-gray-500">Mobile Security</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div> */}

      {/* Modal for adding new category */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCategorySubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Add New Category
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={categoryFormData.name}
                        onChange={handleCategoryChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={categoryFormData.description}
                        onChange={handleCategoryChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        id="imageUrl"
                        value={categoryFormData.imageUrl}
                        onChange={handleCategoryChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="mt-1 text-xs text-gray-500">Leave empty for default image</p>
                    </div>
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        id="difficulty"
                        value={categoryFormData.difficulty}
                        onChange={handleCategoryChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="hoursRequired" className="block text-sm font-medium text-gray-700">
                        Hours Required
                      </label>
                      <input
                        type="number"
                        name="hoursRequired"
                        id="hoursRequired"
                        value={categoryFormData.hoursRequired}
                        onChange={handleCategoryChange}
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseCategoryModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding new challenge */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleChallengeSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Add New Challenge
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={challengeFormData.title}
                        onChange={handleChallengeChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={challengeFormData.description}
                        onChange={handleChallengeChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        name="category"
                        id="category"
                        value={challengeFormData.category}
                        onChange={handleChallengeChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        id="difficulty"
                        value={challengeFormData.difficulty}
                        onChange={handleChallengeChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="tokenCost" className="block text-sm font-medium text-gray-700">
                        Token Cost
                      </label>
                      <input
                        type="number"
                        name="tokenCost"
                        id="tokenCost"
                        value={challengeFormData.tokenCost}
                        onChange={handleChallengeChange}
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Challenge Content
                      </label>
                      <textarea
                        name="content"
                        id="content"
                        rows="6"
                        value={challengeFormData.content}
                        onChange={handleChallengeChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter the challenge content here..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseChallengeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};