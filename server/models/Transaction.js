// // models/Transaction.js
// import mongoose from 'mongoose';

// const transactionSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   challenge: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Challenge',
//     required: false // Not required for token purchases
//   },
//   type: {
//     type: String,
//     enum: ['purchase', 'challenge', 'referral', 'reward'],
//     required: true
//   },
//   tokens: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   details: {
//     type: String,
//     required: false
//   }
// });

// export default mongoose.model('Transaction', transactionSchema);


// models/Transaction.js
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  tokens: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true 
  },
  details: {
    type: String
  },
  packageId: {
    type: String
  },
  stripeSessionId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String, // Changed from required to optional
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Transaction', TransactionSchema);