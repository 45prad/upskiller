// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: false // Not required for token purchases
  },
  type: {
    type: String,
    enum: ['purchase', 'challenge', 'referral', 'reward'],
    required: true
  },
  tokens: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String,
    required: false
  }
});

export default mongoose.model('Transaction', transactionSchema);