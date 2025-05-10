import Stripe from 'stripe';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
  maxNetworkRetries: 2,
});

// @desc    Create Stripe checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private


// @desc    Handle Stripe webhook events
// @route   POST /api/payments/webhook
// @access  Public (called by Stripe)
// controllers/paymentController.js
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { priceId, packageId, tokens, amount } = req.body;
    const userId = req.user.id;

    // Create Stripe checkout session first
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.Frontendurl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.Frontendurl}/payment-canceled`,
      metadata: {
        userId: userId.toString(),
        packageId: packageId.toString(),
        tokens: tokens.toString(),
        amount: amount.toString()
      }
    });

    // Now create the transaction record with the session ID
    const transaction = new Transaction({
      user: userId,
      type: 'purchase',
      status: 'pending',
      tokens: parseInt(tokens),
      amount: parseFloat(amount),
      details: `Initiated purchase of token package ${packageId}`,
      packageId: packageId.toString(),
      stripeSessionId: session.id, // Store the session ID
      // Note: We're not setting paymentId here - it will be added when payment completes
      date: new Date()
    });

    await transaction.save();

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    next(err);
  }
};


// controllers/paymentController.js
// controllers/paymentController.js
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  // Get the raw body directly from the request
  const rawBody = req.body; // This is already a Buffer from express.raw()

  try {
    // Verify the event came from Stripe
    const event = stripe.webhooks.constructEvent(
      rawBody,  // Pass the raw Buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`Payment successful for session: ${session.id}`);
        
        // Update your database here
        await processSuccessfulPayment(session);
        break;
      // Add other event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('⚠️ Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

async function processSuccessfulPayment(session) {
  try {
    // Find and update the transaction
    const transaction = await Transaction.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        status: 'completed',
        paymentId: session.payment_intent,
        $setOnInsert: {
          user: session.metadata.userId,
          type: 'purchase',
          tokens: parseInt(session.metadata.tokens),
          amount: parseFloat(session.metadata.amount),
          details: `Purchased package ${session.metadata.packageId}`
        }
      },
      { upsert: false, new: true }
    );

    if (transaction) {
      // Update user balance
      await User.findByIdAndUpdate(
        session.metadata.userId,
        { $inc: { tokens: parseInt(session.metadata.tokens) } }
      );
      console.log(`Updated transaction ${transaction._id} to completed`);
    }
  } catch (err) {
    console.error('Error processing payment:', err);
    // Even if we error here, we've already returned 200 to Stripe
  }
}

// @desc    Verify payment after successful redirect
// @route   GET /api/payments/verify-payment
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { session_id } = req.query;
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Verify this session belongs to the current user
    if (session.metadata.userId !== userId.toString()) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Find the transaction in our database
    const transaction = await Transaction.findOne({
      stripeSessionId: session_id,
      user: userId
    });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    // Return different responses based on payment status
    if (session.payment_status === 'paid') {
      return res.status(200).json({
        success: true,
        paid: true,
        data: {
          tokens: parseInt(session.metadata.tokens),
          amount: parseFloat(session.metadata.amount),
          transactionId: transaction._id
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        paid: false,
        message: 'Payment not yet completed'
      });
    }
  } catch (err) {
    console.error('Payment verification error:', err);
    next(err);
  }
};