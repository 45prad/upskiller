import Cart from '../models/Cart.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import PurchasedChallenge from '../models/purchasedChallenge.js'; 

// @desc    Add challenge to cart
// @route   POST /api/cart/add/:challengeId
// @access  Private
// export const addToCart = async (req, res, next) => {
//   try {
//     const challengeId = req.params.challengeId;
//     const userId = req.user.id;
    
//     // Check if challenge exists
//     const challenge = await Challenge.findById(challengeId);
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         error: 'Challenge not found'
//       });
//     }
    
//     // Check if user already purchased this challenge
//     const user = await User.findById(userId);
//     if (user.purchasedChallenges.includes(challengeId)) {
//       return res.status(400).json({
//         success: false,
//         error: 'You have already purchased this challenge'
//       });
//     }
    
//     // Find or create cart
//     let cart = await Cart.findOne({ user: userId });
    
//     if (!cart) {
//       cart = await Cart.create({
//         user: userId,
//         items: [{ challenge: challengeId }],
//         totalTokens: challenge.tokenCost
//       });
//     } else {
//       // Check if challenge already in cart
//       const itemExists = cart.items.find(
//         item => item.challenge.toString() === challengeId
//       );
      
//       if (itemExists) {
//         return res.status(400).json({
//           success: false,
//           error: 'Challenge already in cart'
//         });
//       }
      
//       // Add to cart
//       cart.items.push({ challenge: challengeId });
//       cart.totalTokens += challenge.tokenCost;
//       cart.updatedAt = Date.now();
//       await cart.save();
//     }
    
//     // Populate challenge details
//     const populatedCart = await Cart.findById(cart._id).populate({
//       path: 'items.challenge',
//       select: 'title description tokenCost difficulty'
//     });
    
//     res.status(200).json({
//       success: true,
//       data: populatedCart
//     });
//   } catch (err) {
//     next(err);
//   }
// };


export const addToCart = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    const userId = req.user.id;
    
    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }
    
    // Check if user already purchased this challenge (using new PurchasedChallenge model)
    const alreadyPurchased = await PurchasedChallenge.findOne({
      user: userId,
      challenge: challengeId
    });
    
    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        error: 'You have already purchased this challenge'
      });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ challenge: challengeId }],
        totalTokens: challenge.tokenCost
      });
    } else {
      // Check if challenge already in cart
      const itemExists = cart.items.find(
        item => item.challenge.toString() === challengeId
      );
      
      if (itemExists) {
        return res.status(400).json({
          success: false,
          error: 'Challenge already in cart'
        });
      }
      
      // Add to cart
      cart.items.push({ challenge: challengeId });
      cart.totalTokens += challenge.tokenCost;
      cart.updatedAt = Date.now();
      await cart.save();
    }
    
    // Populate challenge details
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.challenge',
      select: 'title description tokenCost difficulty category',
      populate: {
        path: 'category',
        select: 'name'
      }
    });
    
    res.status(200).json({
      success: true,
      data: populatedCart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.challenge',
      select: 'title description tokenCost difficulty'
    });
    
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalTokens: 0
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove challenge from cart
// @route   DELETE /api/cart/remove/:challengeId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    // Find challenge in cart
    const itemIndex = cart.items.findIndex(
      item => item.challenge.toString() === challengeId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found in cart'
      });
    }
    
    // Get token cost
    const challenge = await Challenge.findById(challengeId);
    
    // Remove from cart
    cart.items.splice(itemIndex, 1);
    cart.totalTokens -= challenge.tokenCost;
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    cart.items = [];
    cart.totalTokens = 0;
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Checkout cart
// @route   POST /api/cart/checkout
// @access  Private
// export const checkout = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
    
//     // Find cart
//     const cart = await Cart.findOne({ user: userId });
    
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Your cart is empty'
//       });
//     }
    
//     // Get user
//     const user = await User.findById(userId);
    
//     // Check if user has enough tokens
//     if (user.tokens < cart.totalTokens) {
//       return res.status(400).json({
//         success: false,
//         error: 'You do not have enough tokens'
//       });
//     }
    
//     // Process purchase
//     user.tokens -= cart.totalTokens;
    
//     // Add challenges to user's purchased list
//     const challengeIds = cart.items.map(item => item.challenge);
//     user.purchasedChallenges.push(...challengeIds);
    
//     await user.save();
    
//     // Clear cart
//     cart.items = [];
//     cart.totalTokens = 0;
//     cart.updatedAt = Date.now();
//     await cart.save();
    
//     res.status(200).json({
//       success: true,
//       data: {
//         purchasedChallenges: challengeIds,
//         tokensRemaining: user.tokens
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };


export const checkout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find cart
    const cart = await Cart.findOne({ user: userId }).populate('items.challenge');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Your cart is empty'
      });
    }
    
    // Get user
    const user = await User.findById(userId);
    
    // Check if user has enough tokens
    if (user.tokens < cart.totalTokens) {
      return res.status(400).json({
        success: false,
        error: 'You do not have enough tokens'
      });
    }
    
    // Check for already purchased challenges
    const challengeIds = cart.items.map(item => item.challenge._id);
    const existingPurchases = await PurchasedChallenge.find({
      user: userId,
      challenge: { $in: challengeIds }
    });
    
    if (existingPurchases.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'You already own some challenges in your cart',
        data: existingPurchases.map(p => p.challenge)
      });
    }
    
    // Process purchase
    user.tokens -= cart.totalTokens;
    await user.save();
    
    // Create purchased challenge records
    const purchasePromises = cart.items.map(item => 
      PurchasedChallenge.create({
        user: userId,
        challenge: item.challenge._id
      })
    );
    await Promise.all(purchasePromises);
    
    // Clear cart
    cart.items = [];
    cart.totalTokens = 0;
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: {
        purchasedChallenges: challengeIds,
        tokensRemaining: user.tokens
      }
    });
  } catch (err) {
    next(err);
  }
};