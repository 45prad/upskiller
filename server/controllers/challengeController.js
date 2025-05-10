import Challenge from '../models/Challenge.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';

// @desc    Create new challenge
// @route   POST /api/challenges
// @access  Private/Admin
export const createChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.create(req.body);
    await Category.findByIdAndUpdate(challenge.category, {
      $inc: { challengeCount: 1 }
    });
    res.status(201).json({
      success: true,
      data: challenge
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
export const getAllChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find().populate('category', 'name');
    
    res.status(200).json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (err) {
    next(err);
  }
};

export const getChallengesCount = async (req, res, next) => {
  try {
    const count = await Challenge.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        count
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get challenges by category
// @route   GET /api/challenges/category/:categoryId
// @access  Public
export const getChallengesByCategory = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ category: req.params.categoryId })
      .populate('category', 'name')
      .select('-content'); // Exclude the content field;
    
    res.status(200).json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Public
// export const getChallengeById = async (req, res, next) => {
//   try {
//     const challenge = await Challenge.findById(req.params.id).populate('category');
    
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         error: 'Challenge not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: challenge
//     });
//   } catch (err) {
//     next(err);
//   }
// };
export const getChallengeDetails = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate('category');
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    // Exclude `content` field
    const { content, ...challengeDetails } = challenge.toObject();

    res.status(200).json({
      success: true,
      data: challengeDetails,
    });
  } catch (err) {
    next(err);
  }
};



// export const getChallengeContent = async (req, res, next) => {
//   try {
//     const challenge = await Challenge.findById(req.params.id);

//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         error: 'Challenge not found',
//       });
//     }

//     const user = await User.findById(req.user.id);

//     // Verify if the user has purchased the challenge
//     if (!user.purchasedChallenges.includes(challenge._id)) {
//       return res.status(403).json({
//         success: false,
//         error: 'You have not purchased this challenge',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: { content: challenge.content },
//     });
//   } catch (err) {
//     next(err);
//   }
// };







// @desc    Update challenge
// @route   PUT /api/challenges/:id
// @access  Private/Admin

export const getChallengeContent = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    const user = await User.findById(req.user.id);

    // Allow access if user is admin or has purchased the challenge
    if (user.role !== 'admin' && !user.purchasedChallenges.includes(challenge._id)) {
      return res.status(403).json({
        success: false,
        error: 'You have not purchased this challenge',
      });
    }

    res.status(200).json({
      success: true,
      data: { content: challenge.content },
    });
  } catch (err) {
    next(err);
  }
};

export const updateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: challenge
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private/Admin
export const deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Decrement challengeCount in the related category
    await Category.findByIdAndUpdate(challenge.category, {
      $inc: { challengeCount: -1 }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Purchase a challenge
// @route   POST /api/challenges/:id/purchase
// @access  Private
// export const purchaseChallenge = async (req, res, next) => {
//   try {
//     const challenge = await Challenge.findById(req.params.id);
    
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         error: 'Challenge not found'
//       });
//     }
    
//     const user = await User.findById(req.user.id);
    
//     // Check if user already purchased this challenge
//     if (user.purchasedChallenges.includes(challenge._id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'You have already purchased this challenge'
//       });
//     }
    
//     // Check if user has enough tokens
//     if (user.tokens < challenge.tokenCost) {
//       return res.status(400).json({
//         success: false,
//         error: 'You do not have enough tokens to purchase this challenge'
//       });
//     }
    
//     // Deduct tokens and add challenge to purchased
//     user.tokens -= challenge.tokenCost;
//     user.purchasedChallenges.push(challenge._id);
//     await user.save();
    
//     res.status(200).json({
//       success: true,
//       data: {
//         challenge,
//         tokensRemaining: user.tokens
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const purchaseChallenge = async (req, res, next) => {
//   try {
//     const challenge = await Challenge.findById(req.params.id);
    
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         error: 'Challenge not found'
//       });
//     }
    
//     const user = await User.findById(req.user.id);
    
//     // Check if user already purchased this challenge
//     if (user.purchasedChallenges.includes(challenge._id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'You have already purchased this challenge'
//       });
//     }
    
//     // Check if user has enough tokens
//     if (user.tokens < challenge.tokenCost) {
//       return res.status(400).json({
//         success: false,
//         error: 'You do not have enough tokens to purchase this challenge'
//       });
//     }
    
//     // Deduct tokens and add challenge to purchased
//     user.tokens -= challenge.tokenCost;
//     user.purchasedChallenges.push(challenge._id);
//     await user.save();

//     // Remove the challenge from the cart
//     const cart = await Cart.findOne({ user: req.user.id });
//     if (cart) {
//       cart.items = cart.items.filter(item => !item.challenge.equals(challenge._id));
//       cart.totalTokens = cart.items.reduce((sum, item) => sum + item.challenge.tokenCost, 0);
//       cart.updatedAt = new Date();
//       await cart.save();
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         challenge,
//         tokensRemaining: user.tokens
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };
import Transaction from '../models/Transaction.js';

export const purchaseChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if user already purchased this challenge
    if (user.purchasedChallenges.includes(challenge._id)) {
      return res.status(400).json({
        success: false,
        error: 'You have already purchased this challenge'
      });
    }
    
    // Check if user has enough tokens
    if (user.tokens < challenge.tokenCost) {
      return res.status(400).json({
        success: false,
        error: 'You do not have enough tokens to purchase this challenge'
      });
    }
    
    // Deduct tokens and add challenge to purchased
    user.tokens -= challenge.tokenCost;
    user.purchasedChallenges.push(challenge._id);
    await user.save();

    // Remove the challenge from the cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = cart.items.filter(item => !item.challenge.equals(challenge._id));
      cart.totalTokens = cart.items.reduce((sum, item) => sum + item.challenge.tokenCost, 0);
      cart.updatedAt = new Date();
      await cart.save();
    }
    res.status(200).json({
      success: true,
      data: {
        challenge,
        tokensRemaining: user.tokens,
      }
    });
  } catch (err) {
    next(err);
  }
};