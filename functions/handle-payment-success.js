/**
 * Premium Access Handler Module
 * Manages granting premium access after successful Stripe payments
 */

const admin = require('firebase-admin');

// Lazy initialization of Firestore to avoid initialization errors during deployment analysis
let db;
function getDb() {
  if (!db) {
    db = admin.firestore();
  }
  return db;
}

/**
 * Grant premium access after successful payment
 * Sets all necessary Firestore fields for comprehensive premium access
 * 
 * @param {string} userId - The user's Firebase UID
 * @param {string} customerId - Stripe customer ID (optional)
 * @param {string} subscriptionId - Stripe subscription ID (optional)
 * @returns {Promise<Object>} Updated user data
 */
async function grantPremiumAccessAfterPayment(userId, customerId, subscriptionId) {
  if (!userId) {
    throw new Error('userId is required');
  }

  console.log(`💳 Granting premium access to user: ${userId}`);

  try {
    // Prepare comprehensive premium access data
    const updateData = {
      // Primary premium flags (checked by different systems)
      premium: true,
      isPremium: true,
      is_premium: true,

      // Membership designation
      membershipLevel: 'premium',
      membership: 'premium',

      // Premium status indicators
      premium_status: 'active',
      subscription_type: 'stripe_subscription',

      // Feature access flags
      all_features_unlocked: true,
      journey_access: true,
      meditation_access: true,

      // Stripe identifiers (for subscription management)
      stripe_customer_id: customerId || null,
      stripe_subscription_id: subscriptionId || null,
      stripe_payment_method: 'card',

      // Subscription status
      subscriptionStatus: 'active',

      // Timestamps for audit trail
      premium_since: admin.firestore.FieldValue.serverTimestamp(),
      premium_granted_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),

      // Payment info
      has_made_payment: true,
      payment_status: 'completed'
    };

    // Update user document with merge to preserve other fields
    const userRef = getDb().collection('users').doc(userId);
    await userRef.update(updateData, { merge: true });

    console.log(`✅ Premium access granted successfully for user: ${userId}`);

    // Log the change
    console.log('   Premium flags set:');
    console.log(`   - premium: true`);
    console.log(`   - membershipLevel: premium`);
    console.log(`   - premium_status: active`);
    if (customerId) {
      console.log(`   - stripe_customer_id: ${customerId}`);
    }
    if (subscriptionId) {
      console.log(`   - stripe_subscription_id: ${subscriptionId}`);
    }

    // Return updated user data for confirmation
    const updatedDoc = await userRef.get();
    return {
      success: true,
      userId: userId,
      userData: updatedDoc.data()
    };

  } catch (error) {
    console.error(`❌ Error granting premium access to user ${userId}:`, error);
    throw error;
  }
}

/**
 * Find user by Stripe customer ID
 * 
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<Object|null>} User document with uid and data, or null if not found
 */
async function findUserByCustomerId(customerId) {
  if (!customerId) {
    return null;
  }

  try {
    const query = await getDb().collection('users')
      .where('stripe_customer_id', '==', customerId)
      .limit(1)
      .get();

    if (query.empty) {
      console.warn(`⚠️ No user found for Stripe customer ID: ${customerId}`);
      return null;
    }

    const doc = query.docs[0];
    return {
      uid: doc.id,
      ref: doc.ref,
      data: doc.data()
    };
  } catch (error) {
    console.error('Error finding user by customer ID:', error);
    return null;
  }
}

/**
 * Find user by email address
 * 
 * @param {string} email - User email address
 * @returns {Promise<Object|null>} User document with uid and data, or null if not found
 */
async function findUserByEmail(email) {
  if (!email) {
    return null;
  }

  try {
    const query = await getDb().collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (query.empty) {
      console.warn(`⚠️ No user found for email: ${email}`);
      return null;
    }

    const doc = query.docs[0];
    return {
      uid: doc.id,
      ref: doc.ref,
      data: doc.data()
    };
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

/**
 * Find user by Stripe subscription ID
 * 
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<Object|null>} User document with uid and data, or null if not found
 */
async function findUserBySubscriptionId(subscriptionId) {
  if (!subscriptionId) {
    return null;
  }

  try {
    const query = await getDb().collection('users')
      .where('stripe_subscription_id', '==', subscriptionId)
      .limit(1)
      .get();

    if (query.empty) {
      console.warn(`⚠️ No user found for Stripe subscription ID: ${subscriptionId}`);
      return null;
    }

    const doc = query.docs[0];
    return {
      uid: doc.id,
      ref: doc.ref,
      data: doc.data()
    };
  } catch (error) {
    console.error('Error finding user by subscription ID:', error);
    return null;
  }
}

/**
 * Revoke premium access (used when subscription is cancelled)
 * 
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Object>} Updated user data
 */
async function revokePremiumAccess(userId) {
  if (!userId) {
    throw new Error('userId is required');
  }

  console.log(`❌ Revoking premium access for user: ${userId}`);

  try {
    const updateData = {
      premium: false,
      isPremium: false,
      is_premium: false,
      membershipLevel: 'free',
      membership: 'free',
      premium_status: 'inactive',
      subscription_type: 'free',
      subscriptionStatus: 'cancelled',
      all_features_unlocked: false,
      journey_access: false,
      meditation_access: false,
      premium_revoked_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const userRef = getDb().collection('users').doc(userId);
    await userRef.update(updateData, { merge: true });

    console.log(`✅ Premium access revoked for user: ${userId}`);

    const updatedDoc = await userRef.get();
    return {
      success: true,
      userId: userId,
      userData: updatedDoc.data()
    };
  } catch (error) {
    console.error(`❌ Error revoking premium access for user ${userId}:`, error);
    throw error;
  }
}

module.exports = {
  grantPremiumAccessAfterPayment,
  findUserByCustomerId,
  findUserByEmail,
  findUserBySubscriptionId,
  revokePremiumAccess
};
