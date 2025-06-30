import User from '../models/User.js';
import PurchasedChallenge from '../models/purchasedChallenge.js'; 
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};
export const getUsersCount = async (req, res, next) => {
  try {
    const count = await User.countDocuments({ role: 'user' });
    
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
// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign tokens to user
// @route   POST /api/users/:id/assign-tokens
// @access  Private/Admin
export const assignTokens = async (req, res, next) => {
  try {
    const { tokens } = req.body;
    
    if (!tokens || tokens < 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid number of tokens'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.tokens += parseInt(tokens);
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user purchased challenges
// @route   GET /api/users/purchased-challenges
// @access  Private
// export const getPurchasedChallenges = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).populate('purchasedChallenges');
    
//     res.status(200).json({
//       success: true,
//       data: user.purchasedChallenges
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getUserPurchasedChallenges= async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.userId).populate('purchasedChallenges');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: user.purchasedChallenges
//     });
//   } catch (err) {
//     next(err);
//   }
// };



export const getPurchasedChallenges = async (req, res, next) => {
  try {
    const purchasedChallenges = await PurchasedChallenge.find({ user: req.user.id })
      .populate('challenge');
    
    res.status(200).json({
      success: true,
      data: purchasedChallenges.map(pc => pc.challenge)
    });
  } catch (err) {
    next(err);
  }
};

export const getUserPurchasedChallenges = async (req, res, next) => {
  try {
    const purchasedChallenges = await PurchasedChallenge.find({ user: req.params.userId })
      .populate('challenge');
    
    if (!purchasedChallenges) {
      return res.status(404).json({
        success: false,
        error: 'No purchased challenges found for this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: purchasedChallenges.map(pc => pc.challenge)
    });
  } catch (err) {
    next(err);
  }
};



