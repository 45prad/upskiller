// controllers/transactionController.js
import Transaction from '../models/Transaction.js';
import User from '../models/User.js'

// @desc    Get transactions for current user
// @route   GET /api/transactions/my
// @access  Private
export const getUserTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all transactions (admin only)
// @route   GET /api/transactions
// @access  Private/Admin
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get transactions by user ID (admin only)
// @route   GET /api/transactions/user/:userId
// @access  Private/Admin
export const getTransactionsByUserId = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId })
      .sort({ date: -1 });

    if (!transactions) {
      return next(`No transactions found for user with id `, 404);
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
// export const createTransaction = async (req, res, next) => {
//   try {
//     const { type, tokens, details } = req.body;
//     const userId = req.user.id;

//     // Validate input
//     if (!type || !tokens) {
//       return next(new ErrorResponse('Type and tokens are required', 400));
//     }

//     const transaction = new Transaction({
//       user: userId,
//       type,
//       tokens,
//       details,
//       date: new Date()
//     });

//     await transaction.save();

//     // Update user's token balance if this is a purchase
//     if (type === 'purchase') {
//       await User.findByIdAndUpdate(userId, {
//         $inc: { tokens: tokens }
//       });
//     }

//     res.status(201).json({
//       success: true,
//       data: transaction
//     });
//   } catch (err) {
//     next(err);
//   }
// };