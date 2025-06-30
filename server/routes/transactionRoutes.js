// routes/transactionRoutes.js
import express from 'express';
import { 
  getUserTransactions,
  getAllTransactions,
  getTransactionsByUserId,
} from '../controllers/transactionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (logged in users)
router.use(protect);

// router.post('/', createTransaction); 

// Get current user's transactions
router.get('/my', getUserTransactions);

// Admin only routes
router.use(authorize('admin'));
router.get('/', getAllTransactions);
router.get('/user/:userId', getTransactionsByUserId);

export default router;