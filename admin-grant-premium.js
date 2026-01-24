/**
 * Admin Utility: Manually Grant Premium Access
 *
 * This script allows admins to manually grant premium access to users
 * without requiring payment. Use cases:
 * - Testing the premium features
 * - Promotional access for partners
 * - Gifting premium to specific users
 * - Admin accounts
 *
 * IMPORTANT: This requires admin privileges in Firebase
 */

(async function() {
    'use strict';

    console.log('🔐 Admin Premium Access Utility');
    console.log('================================\n');

    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase not loaded. Please run this in the browser console on a page with Firebase initialized.');
        return;
    }

    // Check if user is authenticated
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
        console.error('❌ Not authenticated. Please log in first.');
        return;
    }

    console.log('Current User:', currentUser.email);
    console.log('User ID:', currentUser.uid);
    console.log('\n');

    /**
     * Grant premium access to a user by email
     */
    window.grantPremiumByEmail = async function(email) {
        try {
            console.log(`🔍 Looking up user with email: ${email}`);

            // Query Firestore for user with this email
            const usersSnapshot = await firebase.firestore()
                .collection('users')
                .where('email', '==', email)
                .limit(1)
                .get();

            if (usersSnapshot.empty) {
                console.error('❌ User not found with email:', email);
                return;
            }

            const userDoc = usersSnapshot.docs[0];
            const userId = userDoc.id;

            console.log('✅ User found:', userId);
            console.log('📝 Granting premium access...');

            // Update user document
            await firebase.firestore().collection('users').doc(userId).update({
                isPremium: true,
                membershipLevel: 'premium',
                manualGrant: true,
                grantedAt: firebase.firestore.FieldValue.serverTimestamp(),
                grantedBy: currentUser.uid,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Premium access granted successfully!');
            console.log(`   User: ${email}`);
            console.log(`   User ID: ${userId}`);
            console.log('   Membership: premium');
            console.log('\n');

        } catch (error) {
            console.error('❌ Error granting premium access:', error);
        }
    };

    /**
     * Grant premium access to a user by user ID
     */
    window.grantPremiumByUserId = async function(userId) {
        try {
            console.log(`📝 Granting premium access to user: ${userId}`);

            // Update user document
            await firebase.firestore().collection('users').doc(userId).update({
                isPremium: true,
                membershipLevel: 'premium',
                manualGrant: true,
                grantedAt: firebase.firestore.FieldValue.serverTimestamp(),
                grantedBy: currentUser.uid,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Premium access granted successfully!');
            console.log(`   User ID: ${userId}`);
            console.log('   Membership: premium');
            console.log('\n');

        } catch (error) {
            console.error('❌ Error granting premium access:', error);
        }
    };

    /**
     * Grant yourself premium access (for testing)
     */
    window.grantMePremium = async function() {
        try {
            const userId = currentUser.uid;
            console.log(`📝 Granting premium access to yourself: ${currentUser.email}`);

            // Update user document
            await firebase.firestore().collection('users').doc(userId).update({
                isPremium: true,
                membershipLevel: 'premium',
                manualGrant: true,
                selfGranted: true,
                grantedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Premium access granted to you!');
            console.log(`   User: ${currentUser.email}`);
            console.log(`   User ID: ${userId}`);
            console.log('   Membership: premium');
            console.log('\n');
            console.log('🔄 Please refresh the page to see the changes.');

        } catch (error) {
            console.error('❌ Error granting premium access:', error);
        }
    };

    /**
     * Revoke premium access from a user by email
     */
    window.revokePremiumByEmail = async function(email) {
        try {
            console.log(`🔍 Looking up user with email: ${email}`);

            // Query Firestore for user with this email
            const usersSnapshot = await firebase.firestore()
                .collection('users')
                .where('email', '==', email)
                .limit(1)
                .get();

            if (usersSnapshot.empty) {
                console.error('❌ User not found with email:', email);
                return;
            }

            const userDoc = usersSnapshot.docs[0];
            const userId = userDoc.id;

            console.log('✅ User found:', userId);
            console.log('📝 Revoking premium access...');

            // Update user document
            await firebase.firestore().collection('users').doc(userId).update({
                isPremium: false,
                membershipLevel: 'free',
                revokedAt: firebase.firestore.FieldValue.serverTimestamp(),
                revokedBy: currentUser.uid,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Premium access revoked successfully!');
            console.log(`   User: ${email}`);
            console.log(`   User ID: ${userId}`);
            console.log('   Membership: free');
            console.log('\n');

        } catch (error) {
            console.error('❌ Error revoking premium access:', error);
        }
    };

    /**
     * Check a user's premium status by email
     */
    window.checkPremiumStatus = async function(email) {
        try {
            console.log(`🔍 Checking premium status for: ${email}`);

            // Query Firestore for user with this email
            const usersSnapshot = await firebase.firestore()
                .collection('users')
                .where('email', '==', email)
                .limit(1)
                .get();

            if (usersSnapshot.empty) {
                console.error('❌ User not found with email:', email);
                return;
            }

            const userDoc = usersSnapshot.docs[0];
            const userData = userDoc.data();

            console.log('\n📊 User Premium Status:');
            console.log('========================');
            console.log('Email:', userData.email);
            console.log('User ID:', userDoc.id);
            console.log('Is Premium:', userData.isPremium || false);
            console.log('Membership Level:', userData.membershipLevel || 'free');
            console.log('Manual Grant:', userData.manualGrant || false);
            console.log('Stripe Customer ID:', userData.stripeCustomerId || 'none');
            console.log('Subscription ID:', userData.subscriptionId || 'none');
            console.log('Created:', userData.createdAt?.toDate() || 'unknown');
            console.log('Updated:', userData.updatedAt?.toDate() || 'unknown');
            console.log('\n');

        } catch (error) {
            console.error('❌ Error checking premium status:', error);
        }
    };

    /**
     * Make a user an admin
     */
    window.makeAdmin = async function(email) {
        try {
            console.log(`🔍 Looking up user with email: ${email}`);

            // Query Firestore for user with this email
            const usersSnapshot = await firebase.firestore()
                .collection('users')
                .where('email', '==', email)
                .limit(1)
                .get();

            if (usersSnapshot.empty) {
                console.error('❌ User not found with email:', email);
                return;
            }

            const userDoc = usersSnapshot.docs[0];
            const userId = userDoc.id;

            console.log('✅ User found:', userId);
            console.log('📝 Making user admin...');

            // Update user document
            await firebase.firestore().collection('users').doc(userId).update({
                isPremium: true,
                membershipLevel: 'admin',
                isAdmin: true,
                adminGrantedAt: firebase.firestore.FieldValue.serverTimestamp(),
                adminGrantedBy: currentUser.uid,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Admin access granted successfully!');
            console.log(`   User: ${email}`);
            console.log(`   User ID: ${userId}`);
            console.log('   Membership: admin');
            console.log('\n');

        } catch (error) {
            console.error('❌ Error granting admin access:', error);
        }
    };

    // Display usage instructions
    console.log('📋 Available Commands:');
    console.log('======================\n');
    console.log('grantPremiumByEmail("user@example.com")');
    console.log('  → Grant premium access to a user by email\n');
    console.log('grantPremiumByUserId("USER_ID")');
    console.log('  → Grant premium access to a user by user ID\n');
    console.log('grantMePremium()');
    console.log('  → Grant premium access to yourself (for testing)\n');
    console.log('revokePremiumByEmail("user@example.com")');
    console.log('  → Revoke premium access from a user\n');
    console.log('checkPremiumStatus("user@example.com")');
    console.log('  → Check a user\'s premium status\n');
    console.log('makeAdmin("user@example.com")');
    console.log('  → Make a user an admin\n');
    console.log('\nExample: grantMePremium()');
    console.log('\n✅ Admin utility loaded successfully!\n');

})();
