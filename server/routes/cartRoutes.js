import express from 'express';
import { 
  addToCart, 
  getCart, 
  removeFromCart, 
  clearCart,
  checkout
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.get('/', getCart);
router.post('/add/:challengeId', addToCart);
router.delete('/remove/:challengeId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/checkout', checkout);

export default router;