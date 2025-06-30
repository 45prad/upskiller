// purchasedChallenge.model.js
import mongoose from 'mongoose';

const purchasedChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
  // Removed completed and completionDate fields
});

export default mongoose.model('PurchasedChallenge', purchasedChallengeSchema);