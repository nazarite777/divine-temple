const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

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
 * Stripe Webhook Handler - Updated to handle payments
 */
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
      success_url: `${data.successUrl || 'https://your-domain.com/success'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.cancelUrl || 'https://your-domain.com/free-dashboard',
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
 * Stripe Webhook Handler - Updated to handle payments
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripeConfig = functions.config().stripe;

  if (!stripeConfig || !stripeConfig.secret || !stripeConfig.webhook_secret) {
    console.error('Stripe configuration is missing');
    return res.status(500).send('Stripe configuration error');
  }

  const stripe = require('stripe')(stripeConfig.secret);
  const sig = req.headers['stripe-signature'];
  const endpointSecret = stripeConfig.webhook_secret;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session);

      // Get user ID from session metadata
      const userId = session.client_reference_id || session.metadata?.userId;

      if (userId) {
        try {
          // Update user to premium
          await admin.firestore().collection('users').doc(userId).update({
            isPremium: true,
            membershipLevel: 'premium',
            subscriptionId: session.subscription || session.id,
            stripeCustomerId: session.customer,
            lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
            paymentAmount: session.amount_total / 100, // Convert cents to dollars
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`User ${userId} upgraded to premium - Payment: $${session.amount_total / 100}`);
        } catch (error) {
          console.error('Error updating user to premium:', error);
        }
      }
      break;

    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      const subscription = event.data.object;
      const customerId = subscription.customer;

      try {
        // Find user by Stripe customer ID
        const usersSnapshot = await admin.firestore()
          .collection('users')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];

          // Downgrade user to free tier on subscription cancellation
          await userDoc.ref.update({
            isPremium: false,
            membershipLevel: 'free',
            subscriptionStatus: 'canceled',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`User ${userDoc.id} downgraded to free - subscription canceled`);
        }
      } catch (error) {
        console.error('Error handling subscription cancellation:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

