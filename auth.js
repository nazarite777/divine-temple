/**
 * Authentication Module
 * Handles user authentication with Firebase
 */

// Current user state
let currentUser = null;

// Auth state change listener
firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
        console.log('✅ User authenticated:', user.email);
        onUserAuthenticated(user);
    } else {
        console.log('👤 User signed out');
        onUserSignedOut();
    }
});

/**
 * Sign up with email and password
 */
async function signUpWithEmail(email, password, displayName) {
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update display name
        if (displayName) {
            await user.updateProfile({ displayName });
        }
        
        // Create user document in Firestore
        await createUserDocument(user.uid, {
            email: user.email,
            displayName: displayName || '',
            membershipType: 'free',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ User signed up successfully');
        return { success: true, user };
    } catch (error) {
        console.error('❌ Sign up error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign in with email and password
 */
async function signInWithEmail(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        
        // Update last login
        await firebase.firestore()
            .collection('users')
            .doc(userCredential.user.uid)
            .update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        console.log('✅ User signed in successfully');
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('❌ Sign in error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign in with Google
 */
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        
        // Check if user document exists, create if not
        const userDoc = await firebase.firestore()
            .collection('users')
            .doc(user.uid)
            .get();
        
        if (!userDoc.exists) {
            await createUserDocument(user.uid, {
                email: user.email,
                displayName: user.displayName || '',
                membershipType: 'free',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // Update last login
            await firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
        }
        
        console.log('✅ Google sign in successful');
        return { success: true, user };
    } catch (error) {
        console.error('❌ Google sign in error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Sign out
 */
async function signOut() {
    try {
        await firebase.auth().signOut();
        console.log('✅ User signed out successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Sign out error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send password reset email
 */
async function sendPasswordReset(email) {
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        console.log('✅ Password reset email sent');
        return { success: true };
    } catch (error) {
        console.error('❌ Password reset error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current user
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return currentUser !== null;
}

/**
 * Create user document in Firestore
 */
async function createUserDocument(userId, userData) {
    try {
        await firebase.firestore()
            .collection('users')
            .doc(userId)
            .set(userData);
        console.log('✅ User document created');
        return { success: true };
    } catch (error) {
        console.error('❌ Error creating user document:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Called when user authenticates
 */
function onUserAuthenticated(user) {
    // Update UI
    updateAuthUI(true, user);
    
    // Load user data
    loadUserData();
    
    // Check if migration is needed
    checkAndPromptMigration();
}

/**
 * Called when user signs out
 */
function onUserSignedOut() {
    // Update UI
    updateAuthUI(false, null);
    
    // Clear user data from memory (but keep localStorage as backup)
    // state object will be reset or cleared as needed
}

/**
 * Update authentication UI
 */
function updateAuthUI(isAuthenticated, user) {
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    
    if (isAuthenticated && user) {
        // Hide auth buttons, show user profile
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            if (userName) userName.textContent = user.displayName || 'Temple Member';
            if (userEmail) userEmail.textContent = user.email;
        }
    } else {
        // Show auth buttons, hide user profile
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
}
