const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Import the payment success handler
const { grantPremiumAccessAfterPayment, findUserByCustomerId, findUserByEmail, findUserBySubscriptionId } = require('./handle-payment-success');

admin.initializeApp();
const db = admin.firestore();

// ==================== HELPER FUNCTIONS ====================
/**
 * Check if user has premium access
 * Now uses ONLY database flags - no hardcoded lists
 */
async function checkPremiumAccess(userId) {
  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return false;
    }

    const userData = userDoc.data();

    // Check if user has premium membership (set by Stripe webhook)
    if (userData.isPremium === true) {
      return true;
    }

    // Check membership level
    const premiumLevels = ['premium', 'elite', 'admin', 'founding'];
    if (userData.membershipLevel && premiumLevels.includes(userData.membershipLevel)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
}

// ==================== CLOUD FUNCTIONS ====================

/**
 * Verify Premium Access - HTTP callable function
 * Returns whether the user has premium access
 */
exports.verifyPremiumAccess = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const hasPremium = await checkPremiumAccess(userId);

  return {
    hasPremiumAccess: hasPremium,
    userId: userId
  };
});

/**
 * Initialize User on Sign Up - Firestore trigger
 * Sets up initial user data with free tier by default
 */
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const email = user.email;

    const userData = {
      email: email,
      displayName: user.displayName || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isPremium: false, // Default to free - will be set to true after payment
      membership: 'free',
      membershipLevel: 'free',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore().collection('users').doc(user.uid).set(userData, { merge: true });

    console.log(`User ${email} created with free tier - can upgrade via payment`);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});

/**
 * Admin Function - Manually Grant Premium Access
 * Use this for: promotions, gifts, special cases, admin accounts
 *
 * Usage from Firebase Console:
 * firebase functions:call grantPremiumAccess --data '{"userId":"USER_ID","reason":"promotion"}'
 */
exports.grantPremiumAccess = functions.https.onCall(async (data, context) => {
  // Only allow authenticated requests
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  // Get calling user's data to verify admin status
  const callingUserDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  const callingUserData = callingUserDoc.data();

  // Only allow admins to grant access
  if (callingUserData?.membershipLevel !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can grant premium access');
  }

  const { userId, reason } = data;

  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'userId is required');
  }

  try {
    await admin.firestore().collection('users').doc(userId).update({
      isPremium: true,
      membership: 'premium',
      membershipLevel: 'premium',
      grantedBy: context.auth.uid,
      grantReason: reason || 'manual_grant',
      grantedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Premium access granted to ${userId} by ${context.auth.uid}. Reason: ${reason}`);

    return { success: true, message: 'Premium access granted' };
  } catch (error) {
    console.error('Error granting premium access:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Create Stripe Checkout Session - $9.99/month Premium Membership
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const userEmail = context.auth.token.email;

  // Check if user already has premium
  const hasPremium = await checkPremiumAccess(userId);
  if (hasPremium) {
    throw new functions.https.HttpsError('already-exists', 'User already has premium access');
  }

  try {
    const stripeConfig = functions.config().stripe;

    if (!stripeConfig || !stripeConfig.secret) {
      throw new functions.https.HttpsError('failed-precondition', 'Stripe configuration is missing');
    }

    const stripe = require('stripe')(stripeConfig.secret);

    // Create Stripe Checkout Session for SUBSCRIPTION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription', // MONTHLY RECURRING SUBSCRIPTION
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        productType: 'premium_membership'
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Divine Temple Premium Membership',
              description: 'Monthly subscription with full access to all premium features',
            },
            unit_amount: 999, // $9.99 in cents
            recurring: {
              interval: 'month', // Monthly billing
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${data.successUrl || 'https://edenconsciousnesssdt.com/members-new.html'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.cancelUrl || 'https://edenconsciousnesssdt.com/free-dashboard.html',
    });

    console.log(`Checkout session created for user ${userId}: ${session.id}`);

    return {
      sessionId: session.id,
      url: session.url
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Stripe Webhook Handler
 * Listens for Stripe events and updates user membership status in Firestore
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const stripeConfig = functions.config().stripe;

  // Check if Stripe is configured
  if (!stripeConfig || !stripeConfig.secret || !stripeConfig.webhook_secret) {
    console.error('❌ Stripe configuration is missing');
    console.error('Run: firebase functions:config:set stripe.secret="sk_xxx" stripe.webhook_secret="whsec_xxx"');
    return res.status(500).send('Stripe configuration error');
  }

  const stripe = require('stripe')(stripeConfig.secret);
  const sig = req.headers['stripe-signature'];

  let event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeConfig.webhook_secret);
    console.log('✅ Webhook signature verified. Event type:', event.type);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    // Still return 200 to acknowledge receipt (prevents Stripe retries)
    return res.status(200).json({ received: true, error: error.message });
  }

  res.status(200).json({ received: true });
});

/**
 * Handle successful checkout session
 */
async function handleCheckoutComplete(session) {
  const customerEmail = session.customer_email || session.customer_details?.email;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  console.log('💳 Checkout completed for:', customerEmail);
  console.log('   Customer ID:', customerId);
  console.log('   Subscription ID:', subscriptionId);

  if (!customerEmail) {
    console.error('❌ No customer email found in session');
    return;
  }

  try {
    // Find user by email and grant premium access
    const userDoc = await findUserByEmail(customerEmail);

    if (userDoc) {
      // Use the new payment success handler to grant premium
      await grantPremiumAccessAfterPayment(userDoc.uid, customerId, subscriptionId);
      console.log(`✅ Premium access granted to ${customerEmail} via checkout completion`);
    } else {
      console.warn(`⚠️ User not found for email: ${customerEmail}`);
      // Optionally create user document with premium access
    }
  } catch (error) {
    console.error('❌ Error handling checkout completion:', error);
    throw error;
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdate(subscription) {
  const subscriptionId = subscription.id;
  const status = subscription.status; // active, past_due, canceled, etc.

  console.log('🔄 Subscription update:', subscriptionId, 'Status:', status);

  const userDoc = await findUserBySubscriptionId(subscriptionId);

  if (userDoc) {
    const isPremium = ['active', 'trialing'].includes(status);

    await userDoc.ref.update({
      isPremium: isPremium,
      membership: isPremium ? 'premium' : 'free',
      membershipLevel: isPremium ? 'premium' : 'free',
      subscriptionStatus: status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Subscription status updated to:', status);
  } else {
    console.error('❌ No user found for subscription:', subscriptionId);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(subscription) {
  const subscriptionId = subscription.id;

  console.log('❌ Subscription cancelled:', subscriptionId);

  const userDoc = await findUserBySubscriptionId(subscriptionId);

  if (userDoc) {
    await userDoc.ref.update({
      isPremium: false,
      membership: 'free',
      membershipLevel: 'free',
      subscriptionStatus: 'cancelled',
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ User downgraded to FREE');
  } else {
    console.error('❌ No user found for subscription:', subscriptionId);
  }
}

/**
 * Handle successful invoice payment (recurring)
 */
async function handlePaymentSucceeded(invoice) {
  const customerEmail = invoice.customer_email;
  const subscriptionId = invoice.subscription;

  console.log('💰 Payment succeeded for:', customerEmail);

  if (!subscriptionId) return; // One-time payment, not subscription

  const userDoc = await findUserByEmail(customerEmail) ||
                  await findUserBySubscriptionId(subscriptionId);

  if (userDoc) {
    await userDoc.ref.update({
      isPremium: true,
      membership: 'premium',
      membershipLevel: 'premium',
      subscriptionStatus: 'active',
      lastPaymentAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Recurring payment recorded');
  }
}

/**
 * Handle failed invoice payment
 */
async function handlePaymentFailed(invoice) {
  const customerEmail = invoice.customer_email;
  const subscriptionId = invoice.subscription;

  console.log('⚠️ Payment failed for:', customerEmail);

  const userDoc = await findUserByEmail(customerEmail) ||
                  await findUserBySubscriptionId(subscriptionId);

  if (userDoc) {
    await userDoc.ref.update({
      subscriptionStatus: 'past_due',
      paymentFailedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('⚠️ User marked as past_due');
  }
}
