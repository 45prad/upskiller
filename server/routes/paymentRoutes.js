import express from 'express';
import { protect } from '../middleware/auth.js';

import bodyParser from 'body-parser';

import {
  createCheckoutSession,
  handleStripeWebhook,
  verifyPayment
} from '../controllers/paymentController.js';

const router = express.Router();


router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }), // This is crucial
  handleStripeWebhook
);
// Protected routes
router.use(express.json());
router.use(protect);

// Create Stripe checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Stripe webhook (must be raw body)


router.get('/verify-payment', verifyPayment);

export default router;