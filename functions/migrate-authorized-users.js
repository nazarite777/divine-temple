/**
 * Migration Script - Set isAuthorized for existing users
 *
 * This script updates the user documents in Firestore to set the isAuthorized
 * flag for users who are in the AUTHORIZED_PREMIUM_USERS list.
 *
 * Run this once after deploying the new Cloud Functions to ensure existing
 * users have the correct authorization status.
 *
 * Usage:
 *   node migrate-authorized-users.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (if not already initialized)
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
} catch (error) {
  console.log('Firebase already initialized or error:', error.message);
}

// AUTHORIZED PREMIUM USERS - Must match the list in index.js
const AUTHORIZED_PREMIUM_USERS = [
  'cbevvv@gmail.com',
  'nazir23'
];

/**
 * Check if email is in authorized users list
 */
function isEmailAuthorized(email) {
  if (!email) return false;
  const lowerEmail = email.toLowerCase();
  return AUTHORIZED_PREMIUM_USERS.some(auth => auth.toLowerCase() === lowerEmail);
}

/**
 * Main migration function
 */
async function migrateUsers() {
  console.log('🔄 Starting user migration...\n');

  try {
    // Get all users from Firestore
    const usersSnapshot = await admin.firestore().collection('users').get();

    console.log(`📊 Found ${usersSnapshot.size} users in database\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const email = userData.email || '';

      try {
        // Check if user should be authorized
        const shouldBeAuthorized = isEmailAuthorized(email);

        // Check current status
        const currentlyAuthorized = userData.isAuthorized === true;

        if (shouldBeAuthorized && !currentlyAuthorized) {
          // Update user to authorized
          await userDoc.ref.update({
            isAuthorized: true,
            isPremium: true,
            membershipLevel: 'authorized',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`✅ Updated: ${email} → AUTHORIZED`);
          updatedCount++;

        } else if (!shouldBeAuthorized && currentlyAuthorized) {
          // Remove authorization (user was removed from list)
          await userDoc.ref.update({
            isAuthorized: false,
            isPremium: false,
            membershipLevel: 'free',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`❌ Revoked: ${email} → FREE`);
          updatedCount++;

        } else if (shouldBeAuthorized && currentlyAuthorized) {
          console.log(`⏭️  Skipped: ${email} (already authorized)`);
          skippedCount++;

        } else {
          // Not authorized and shouldn't be - skip
          skippedCount++;
        }

      } catch (error) {
        console.error(`❌ Error updating ${email}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors:  ${errorCount}`);
    console.log('\n✨ Migration complete!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run migration
migrateUsers();
