/**
 * Stripe Webhook Handler for Eden Consciousness Premium Subscriptions
 * Deploy as Cloud Function: functions/stripeWebhook
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();

admin.initializeApp();
const db = admin.firestore();

// Middleware
app.use(express.raw({type: 'application/json'}));

// Stripe Webhook Endpoint
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({error: error.message});
  }
});

// Handle successful checkout
async function handleCheckoutSessionCompleted(session) {
  console.log('✅ Checkout completed:', session.id);

  try {
    const customerId = session.customer;
    const customer = await stripe.customers.retrieve(customerId);
    
    // Find Firebase user by email
    const userRecord = await admin.auth().getUserByEmail(customer.email);
    
    // Update user document with premium status
    await db.collection('users').doc(userRecord.uid).set({
      premium: true,
      premiumStartDate: new Date(),
      premiumStatus: 'active',
      stripeCustomerId: customerId,
      subscriptionId: session.subscription,
      lastPaymentDate: new Date()
    }, { merge: true });

    // Set custom claim for premium
    await admin.auth().setCustomUserClaims(userRecord.uid, { premium: true });

    console.log(`✅ User ${userRecord.uid} upgraded to premium`);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Subscription updated:', subscription.id);

  try {
    const customerId = subscription.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const userRecord = await admin.auth().getUserByEmail(customer.email);

    const status = subscription.status === 'active' ? 'active' : 'inactive';

    await db.collection('users').doc(userRecord.uid).update({
      premiumStatus: status,
      subscriptionId: subscription.id
    });

    console.log(`✅ User ${userRecord.uid} subscription updated to ${status}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Subscription deleted:', subscription.id);

  try {
    const customerId = subscription.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const userRecord = await admin.auth().getUserByEmail(customer.email);

    await db.collection('users').doc(userRecord.uid).update({
      premium: false,
      premiumStatus: 'cancelled',
      premiumEndDate: new Date()
    });

    // Remove premium custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { premium: false });

    console.log(`❌ User ${userRecord.uid} premium access revoked`);
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice) {
  console.log('💰 Invoice paid:', invoice.id);

  try {
    const customerId = invoice.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const userRecord = await admin.auth().getUserByEmail(customer.email);

    await db.collection('users').doc(userRecord.uid).update({
      lastPaymentDate: new Date(),
      lastPaymentAmount: invoice.amount_paid / 100,
      paymentStatus: 'succeeded'
    });

    // Track payment in analytics
    console.log(`✅ Payment processed for ${customer.email}`);
  } catch (error) {
    console.error('Error handling invoice payment:', error);
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice) {
  console.log('⚠️ Invoice payment failed:', invoice.id);

  try {
    const customerId = invoice.customer;
    const customer = await stripe.customers.retrieve(customerId);
    const userRecord = await admin.auth().getUserByEmail(customer.email);

    await db.collection('users').doc(userRecord.uid).update({
      paymentStatus: 'failed',
      failedPaymentDate: new Date()
    });

    console.log(`⚠️ Payment failed for ${customer.email}`);
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
  }
}

// Export the Express app
exports.stripeWebhook = functions.https.onRequest(app);

// Helper function to check user premium status
exports.checkPremium = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  try {
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    return {
      premium: userDoc.data()?.premium || false,
      premiumStatus: userDoc.data()?.premiumStatus || 'free'
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

console.log('Stripe webhook handler initialized');
