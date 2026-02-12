/**
 * Authentication Helper Functions
 * Admin checks, premium verification, and user management
 */

// Admin email addresses
const ADMIN_EMAILS = [
    'cbevvv@gmail.com',
    'nazir@edenconsciousness.com',
    'nazir@edenconsiousness.com'
];

/**
 * Check if user is an admin
 * @param {Object|string} user - Firebase user object or email string
 * @returns {boolean}
 */
function isAdmin(user) {
    if (!user) return false;

    const email = typeof user === 'string' ? user : user.email;
    if (!email) return false;

    return ADMIN_EMAILS.some(adminEmail =>
        email.toLowerCase() === adminEmail.toLowerCase()
    );
}

/**
 * Check if user has premium access
 * Checks in order: whitelist â†’ admin status â†’ Firestore flags
 * @param {Object} userData - User document data from Firestore
 * @param {Object} user - Firebase auth user object
 * @returns {boolean}
 */
function hasPremiumAccess(userData, user) {
    // FIRST: Check hardcoded whitelist in firebase-config.js (highest priority)
    if (typeof window.FirebaseConfig !== 'undefined' &&
        window.FirebaseConfig.auth &&
        typeof window.FirebaseConfig.auth.isAuthorizedPremiumUser === 'function') {

        const email = user?.email || userData?.email;
        const displayName = user?.displayName || userData?.displayName;

        if (window.FirebaseConfig.auth.isAuthorizedPremiumUser(email, displayName)) {
            console.log('ðŸ‘‘ User in premium whitelist:', email);
            return true;
        }
    }

    // SECOND: Check if admin (always has premium access)
    if (isAdmin(user)) {
        return true;
    }

    if (!userData) return false;

    // THIRD: Check various premium flags from Firestore (any one of these grants access)
    return (
        userData.premium === true ||
        userData.premium_status === 'active' ||
        userData.membership === 'premium' ||  // Check membership field (set by webhook)
        userData.membershipLevel === 'premium' ||
        userData.membershipLevel === 'founding' ||
        userData.membershipLevel === 'admin' ||  // Admin membership level
        userData.subscription_type === 'admin_override' ||
        userData.subscription_type === 'stripe_subscription' ||  // Stripe paid users
        userData.all_features_unlocked === true ||
        userData.journey_access === true ||
        userData.role === 'admin'  // Admin role
    );
}

/**
 * Grant premium access to a user (Admin only or self-grant for admins)
 * @param {string} userEmail - Email of user to grant premium access
 * @returns {Promise<Object>} Result object with success status
 */
async function grantPremiumAccess(userEmail) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        return { success: false, error: 'Firebase not initialized' };
    }

    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        return { success: false, error: 'No user logged in' };
    }

    // Allow if current user is admin OR granting to themselves (for admin self-grant)
    const isSelfGrant = currentUser.email.toLowerCase() === userEmail.toLowerCase();
    const isAdminUser = isAdmin(currentUser);

    if (!isAdminUser && !isSelfGrant) {
        console.error('âŒ Unauthorized: User is not admin and not granting to self');
        return { success: false, error: 'Unauthorized: Admin access required' };
    }

    console.log(`ðŸ” Granting premium access to ${userEmail}...`);
    console.log(`   Requester: ${currentUser.email}`);
    console.log(`   Is self-grant: ${isSelfGrant}`);
    console.log(`   Is admin: ${isAdminUser}`);

    try {
        const db = firebase.firestore();

        // Find user by email (case-insensitive)
        const usersQuery = await db.collection('users')
            .where('email', '==', userEmail.toLowerCase())
            .get();

        let userDoc;
        let userUid;

        if (usersQuery.empty) {
            // User doesn't exist in Firestore
            console.log(`âš ï¸ User ${userEmail} not found in Firestore`);

            // If it's the current user, use their UID
            if (isSelfGrant) {
                console.log('âœ… Self-grant detected - using current user UID');
                userUid = currentUser.uid;
                userDoc = db.collection('users').doc(userUid);
            } else {
                // Try to find by email case-insensitively
                const allUsersQuery = await db.collection('users').get();
                const matchingUser = allUsersQuery.docs.find(doc =>
                    doc.data().email?.toLowerCase() === userEmail.toLowerCase()
                );

                if (matchingUser) {
                    console.log('âœ… Found user with different email case');
                    userDoc = matchingUser.ref;
                    userUid = matchingUser.id;
                } else {
                    console.error(`âŒ User ${userEmail} not found in Firestore at all`);
                    return {
                        success: false,
                        error: `User ${userEmail} not found. Please log in first to create user document.`
                    };
                }
            }
        } else {
            userDoc = usersQuery.docs[0].ref;
            userUid = usersQuery.docs[0].id;
            console.log(`âœ… Found user document: ${userUid}`);
        }

        // Determine if target user is admin
        const isTargetAdmin = isAdmin(userEmail);

        // Premium access data
        const premiumData = {
            email: userEmail.toLowerCase(),
            premium: true,
            premium_status: 'active',
            subscription_type: isTargetAdmin ? 'admin_override' : 'premium',
            premium_since: firebase.firestore.FieldValue.serverTimestamp(),
            role: isTargetAdmin ? 'admin' : 'premium_user',
            journey_access: true,
            all_features_unlocked: true,
            membershipLevel: isTargetAdmin ? 'admin' : 'premium',
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            updated_by: currentUser.email,
            last_login: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log('ðŸ“ Premium data to be set:', premiumData);

        // Update or set the document
        await userDoc.set(premiumData, { merge: true });

        console.log(`âœ… Premium access granted to ${userEmail}`);
        console.log(`   Document ID: ${userUid}`);
        console.log(`   Role: ${premiumData.role}`);
        console.log(`   Membership Level: ${premiumData.membershipLevel}`);

        return {
            success: true,
            message: `Premium access granted to ${userEmail}`,
            data: premiumData,
            uid: userUid
        };

    } catch (error) {
        console.error('âŒ Error granting premium access:', error);
        console.error('   Error code:', error.code);
        console.error('   Error message:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Initialize premium access for admin users on login
 * This runs automatically when an admin logs in
 */
async function initAdminPremiumAccess() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.warn('âš ï¸ Firebase not initialized, skipping admin auto-grant setup');
        return;
    }

    console.log('ðŸ” Setting up admin auto-grant listener...');

    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
            console.log('ðŸ‘¤ No user logged in');
            return;
        }

        console.log('ðŸ” Auth state changed - User:', user.email);

        // Check if user is admin
        if (isAdmin(user)) {
            console.log('ðŸ‘‘ Admin user detected:', user.email);

            try {
                const db = firebase.firestore();
                const userDocRef = db.collection('users').doc(user.uid);
                const userDoc = await userDocRef.get();

                if (!userDoc.exists) {
                    console.log('âš¡ Admin user document does not exist - creating with premium access...');
                    await grantPremiumAccess(user.email);
                    return;
                }

                const userData = userDoc.data();
                console.log('ðŸ“Š Current user data:', {
                    email: userData.email,
                    premium: userData.premium,
                    premium_status: userData.premium_status,
                    membershipLevel: userData.membershipLevel,
                    role: userData.role,
                    journey_access: userData.journey_access
                });

                // Check if premium access needs to be granted
                if (!hasPremiumAccess(userData, user)) {
                    console.log('âš¡ Admin missing premium access - auto-granting now...');
                    await grantPremiumAccess(user.email);
                } else {
                    console.log('âœ… Admin already has premium access');
                }
            } catch (error) {
                console.error('âŒ Error checking admin premium access:', error);
                console.error('   Error details:', error.message);
            }
        } else {
            console.log('ðŸ‘¤ Regular user (not admin):', user.email);
        }
    });
}

/**
 * Check if current user has access to journey features
 * @returns {Promise<Object>} Access status and user data
 */
async function checkJourneyAccess() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.warn('⚠️ Firebase not initialized');
        return { hasAccess: false, reason: 'not_initialized' };
    }

    const user = firebase.auth().currentUser;

    if (!user) {
        console.log('ℹ️ User not logged in - no access');
        return { hasAccess: false, reason: 'not_logged_in' };
    }

    console.log('🔍 Checking journey access for:', user.email);

    // Admins always have access
    if (isAdmin(user)) {
        console.log('✅ Admin user - granting journey access');
        return {
            hasAccess: true,
            isAdmin: true,
            user: user
        };
    }

    try {
        const db = firebase.firestore();
        
        // Add timeout wrapper for Firestore operations (especially important on mobile with slow connections)
        const firestoreTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout - taking too long')), 8000)
        );

        const firestoreOperation = async () => {
            console.log('📊 Fetching user data from Firestore...');
            const userDoc = await db.collection('users').doc(user.uid).get();

            if (!userDoc.exists) {
                console.warn('⚠️ User document not found in Firestore');
                return { hasAccess: false, reason: 'user_not_found' };
            }

            const userData = userDoc.data();
            console.log('✅ User document retrieved:', {
                email: userData.email,
                membershipLevel: userData.membershipLevel,
                premium: userData.premium,
                premium_status: userData.premium_status,
                journey_access: userData.journey_access
            });

            const hasAccess = hasPremiumAccess(userData, user);

            return {
                hasAccess,
                reason: hasAccess ? 'premium_user' : 'not_premium',
                userData,
                user
            };
        };

        // Race between Firestore operation and timeout
        const result = await Promise.race([firestoreOperation(), firestoreTimeout]);
        return result;

    } catch (error) {
        console.error('❌ Error checking journey access:', error);
        console.error('   Error message:', error.message);
        
        // On timeout or network error, deny access to prevent infinite loading
        return { 
            hasAccess: false, 
            reason: 'error', 
            error: error.message 
        };
    }
}
/**
 * Verify premium access for protected pages
 * Redirects to upgrade page if user doesn't have access
 * @param {string} redirectUrl - URL to redirect back to after upgrading
 */
async function verifyPremiumAccess(redirectUrl = null) {
    const accessCheck = await checkJourneyAccess();

    if (!accessCheck.hasAccess) {
        // Store intended destination
        if (redirectUrl) {
            sessionStorage.setItem('premiumRedirect', redirectUrl);
        }

        // Show premium gate modal or redirect
        if (typeof showPremiumUpgradeModal === 'function') {
            showPremiumUpgradeModal(accessCheck.reason);
        } else {
            // Fallback: redirect to login or upgrade page
            if (accessCheck.reason === 'not_logged_in') {
                window.location.href = `members-new.html?redirect=${encodeURIComponent(redirectUrl || window.location.href)}`;
            } else {
                window.location.href = 'pricing.html';
            }
        }

        return false;
    }

    return true;
}

// Export functions for global use
window.AuthHelper = {
    isAdmin,
    hasPremiumAccess,
    grantPremiumAccess,
    checkJourneyAccess,
    verifyPremiumAccess,
    initAdminPremiumAccess,
    ADMIN_EMAILS
};

// Auto-initialize admin premium access on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initAdminPremiumAccess);
}

console.log('ðŸ” Auth Helper loaded');

