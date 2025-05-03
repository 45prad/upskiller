import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a challenge title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tokenCost: {
    type: Number,
    required: [true, 'Please specify token cost'],
    min: [0, 'Token cost must be a positive number']
  },
  content: {
    type: String,
    required: [true, 'Please provide challenge content']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Challenge', challengeSchema);