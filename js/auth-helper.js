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
 * Admins automatically have premium access
 * @param {Object} userData - User document data from Firestore
 * @param {Object} user - Firebase auth user object
 * @returns {boolean}
 */
function hasPremiumAccess(userData, user) {
    // Check if admin
    if (isAdmin(user)) {
        return true;
    }

    if (!userData) return false;

    // Check various premium flags
    return (
        userData.premium === true ||
        userData.premium_status === 'active' ||
        userData.membershipLevel === 'premium' ||
        userData.membershipLevel === 'founding' ||
        userData.subscription_type === 'admin_override' ||
        userData.all_features_unlocked === true ||
        userData.journey_access === true
    );
}

/**
 * Grant premium access to a user (Admin only)
 * @param {string} userEmail - Email of user to grant premium access
 * @returns {Promise<Object>} Result object with success status
 */
async function grantPremiumAccess(userEmail) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        return { success: false, error: 'Firebase not initialized' };
    }

    const currentUser = firebase.auth().currentUser;

    // Verify admin access
    if (!currentUser || !isAdmin(currentUser)) {
        return { success: false, error: 'Unauthorized: Admin access required' };
    }

    try {
        const db = firebase.firestore();

        // Find user by email
        const usersQuery = await db.collection('users')
            .where('email', '==', userEmail)
            .get();

        let userDoc;

        if (usersQuery.empty) {
            // User doesn't exist, create new user document
            console.log(`User ${userEmail} not found in Firestore. Creating new document...`);

            // Get user from Firebase Auth
            const authUser = await firebase.auth().getUserByEmail(userEmail)
                .catch(() => null);

            if (!authUser && currentUser.email === userEmail) {
                // Current user is the one being granted premium
                userDoc = db.collection('users').doc(currentUser.uid);
            } else if (authUser) {
                userDoc = db.collection('users').doc(authUser.uid);
            } else {
                return { success: false, error: `User ${userEmail} not found in Firebase Authentication` };
            }
        } else {
            userDoc = usersQuery.docs[0].ref;
        }

        // Premium access data
        const premiumData = {
            email: userEmail,
            premium: true,
            premium_status: 'active',
            subscription_type: isAdmin(userEmail) ? 'admin_override' : 'premium',
            premium_since: firebase.firestore.FieldValue.serverTimestamp(),
            role: isAdmin(userEmail) ? 'admin' : 'premium_user',
            journey_access: true,
            all_features_unlocked: true,
            membershipLevel: 'premium',
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
            updated_by: currentUser.email
        };

        // Update or set the document
        await userDoc.set(premiumData, { merge: true });

        console.log(`✅ Premium access granted to ${userEmail}`);

        return {
            success: true,
            message: `Premium access granted to ${userEmail}`,
            data: premiumData
        };

    } catch (error) {
        console.error('❌ Error granting premium access:', error);
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
        return;
    }

    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) return;

        // Check if user is admin
        if (isAdmin(user)) {
            console.log('🔐 Admin user detected:', user.email);

            try {
                const db = firebase.firestore();
                const userDocRef = db.collection('users').doc(user.uid);
                const userDoc = await userDocRef.get();

                // Check if premium access needs to be granted
                if (!userDoc.exists || !hasPremiumAccess(userDoc.data(), user)) {
                    console.log('⚡ Auto-granting premium access to admin...');
                    await grantPremiumAccess(user.email);
                } else {
                    console.log('✅ Admin already has premium access');
                }
            } catch (error) {
                console.error('❌ Error checking admin premium access:', error);
            }
        }
    });
}

/**
 * Check if current user has access to journey features
 * @returns {Promise<Object>} Access status and user data
 */
async function checkJourneyAccess() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        return { hasAccess: false, reason: 'not_initialized' };
    }

    const user = firebase.auth().currentUser;

    if (!user) {
        return { hasAccess: false, reason: 'not_logged_in' };
    }

    // Admins always have access
    if (isAdmin(user)) {
        return {
            hasAccess: true,
            isAdmin: true,
            user: user
        };
    }

    try {
        const db = firebase.firestore();
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
            return { hasAccess: false, reason: 'user_not_found' };
        }

        const userData = userDoc.data();
        const hasAccess = hasPremiumAccess(userData, user);

        return {
            hasAccess,
            reason: hasAccess ? 'premium_user' : 'not_premium',
            userData,
            user
        };

    } catch (error) {
        console.error('❌ Error checking journey access:', error);
        return { hasAccess: false, reason: 'error', error: error.message };
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
                window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl || window.location.href)}`;
            } else {
                window.location.href = 'index.html#pricing';
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

console.log('🔐 Auth Helper loaded');
