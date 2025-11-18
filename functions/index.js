const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// ==================== AUTHORIZED USERS LIST ====================
// This list defines which users have premium access
const AUTHORIZED_PREMIUM_USERS = [
  'cbevvv@gmail.com',
  'nazir23'
];

// ==================== HELPER FUNCTIONS ====================
/**
 * Check if user has premium access
 */
async function checkPremiumAccess(userId) {
  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return false;
    }

    const userData = userDoc.data();

    // Check if user is authorized
    if (userData.isAuthorized === true) {
      return true;
    }

    // Check if user has premium membership
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

/**
 * Check if email is in authorized users list
 */
function isEmailAuthorized(email) {
  if (!email) return false;
  const lowerEmail = email.toLowerCase();
  return AUTHORIZED_PREMIUM_USERS.some(auth => auth.toLowerCase() === lowerEmail);
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
 * Sets up initial user data including authorization status
 */
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const email = user.email;
    const isAuthorized = isEmailAuthorized(email);

    const userData = {
      email: email,
      displayName: user.displayName || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isAuthorized: isAuthorized,
      isPremium: isAuthorized, // Authorized users automatically get premium
      membershipLevel: isAuthorized ? 'authorized' : 'free',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore().collection('users').doc(user.uid).set(userData, { merge: true });

    console.log(`User ${email} created with authorization: ${isAuthorized}`);
  } catch (error) {
    console.error('Error creating user document:', error);
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
            subscriptionId: session.subscription,
            lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`User ${userId} upgraded to premium`);
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

          // Don't downgrade authorized users
          const userData = userDoc.data();
          if (!userData.isAuthorized) {
            await userDoc.ref.update({
              isPremium: false,
              membershipLevel: 'free',
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`User ${userDoc.id} downgraded to free`);
          }
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

