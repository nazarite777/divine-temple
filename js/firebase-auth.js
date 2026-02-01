/**
 * Firebase Authentication Module for Eden Consciousness
 * Handles signup, login, password reset, and session management
 */

// Initialize Firebase Auth
const auth = firebase.auth();
const db = firebase.firestore();

// UI Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const passwordResetForm = document.getElementById('password-reset-form');
const rememberMeCheckbox = document.getElementById('remember-me');

// Track auth state
let currentUser = null;

// Monitor auth state changes
auth.onAuthStateChanged(async (user) => {
  currentUser = user;
  
  if (user) {
    console.log('✅ User logged in:', user.email);
    
    // Create/update user document
    await ensureUserDocument(user);
    
    // Check premium status
    const isPremium = await checkUserPremiumStatus(user.uid);
    
    // Redirect based on context
    redirectAfterAuth(isPremium);
  } else {
    console.log('❌ User logged out');
    currentUser = null;
    // Clear stored data
    localStorage.removeItem('userEmail');
    localStorage.removeItem('premiumStatus');
  }
});

// Sign Up Function
async function signUp(email, password, displayName = '') {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Create user account
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (displayName) {
      await user.updateProfile({ displayName });
    }

    // Create user document in Firestore
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: email,
      displayName: displayName || 'Sacred Seeker',
      createdAt: new Date(),
      premium: false,
      premiumStatus: 'free',
      xp: 0,
      meditationCount: 0,
      journalEntries: 0,
      achievements: []
    });

    // Track signup
    gtag('event', 'sign_up', {'method': 'email'});

    // Send verification email
    await user.sendEmailVerification();
    showMessage('✅ Signup successful! Check your email to verify your account.', 'success');

    // Auto-login with remember me
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('rememberMe', 'true');
    }

    return user;
  } catch (error) {
    showMessage('❌ Signup failed: ' + error.message, 'error');
    console.error('Signup error:', error);
    throw error;
  }
}

// Login Function
async function login(email, password) {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Sign in user
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Check if email is verified
    await user.reload();
    if (!user.emailVerified) {
      showMessage('⚠️ Please verify your email before logging in', 'warning');
      await auth.signOut();
      return null;
    }

    // Store data if remember me checked
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }

    // Track login
    gtag('event', 'login', {'method': 'email'});
    
    showMessage('✅ Welcome back!', 'success');
    return user;
  } catch (error) {
    showMessage('❌ Login failed: ' + error.message, 'error');
    console.error('Login error:', error);
    throw error;
  }
}

// Password Reset Function
async function requestPasswordReset(email) {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    await auth.sendPasswordResetEmail(email);
    showMessage('✅ Password reset email sent! Check your inbox.', 'success');
    
    // Hide form and show confirmation
    if (passwordResetForm) {
      passwordResetForm.style.display = 'none';
    }
    
    return true;
  } catch (error) {
    showMessage('❌ Password reset failed: ' + error.message, 'error');
    console.error('Password reset error:', error);
    throw error;
  }
}

// Logout Function
async function logout() {
  try {
    await auth.signOut();
    localStorage.removeItem('userEmail');
    localStorage.removeItem('premiumStatus');
    showMessage('✅ Logged out successfully', 'success');
    
    // Redirect to login
    setTimeout(() => {
      window.location.href = 'members-new.html';
    }, 1500);
  } catch (error) {
    showMessage('❌ Logout failed: ' + error.message, 'error');
    console.error('Logout error:', error);
  }
}

// Get Current User
function getCurrentUser() {
  return currentUser;
}

// Check if user is logged in
function isLoggedIn() {
  return currentUser !== null;
}

// Ensure user document exists in Firestore
async function ensureUserDocument(user) {
  try {
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists) {
      // Create new user document
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Sacred Seeker',
        createdAt: new Date(),
        premium: false,
        premiumStatus: 'free',
        xp: 0,
        meditationCount: 0,
        journalEntries: 0,
        achievements: [],
        lastLoginAt: new Date()
      });
    } else {
      // Update last login
      await db.collection('users').doc(user.uid).update({
        lastLoginAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error ensuring user document:', error);
  }
}

// Check premium status
async function checkUserPremiumStatus(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const isPremium = userDoc.data()?.premium || false;
    
    // Store in localStorage for quick access
    localStorage.setItem('premiumStatus', isPremium ? 'premium' : 'free');
    
    return isPremium;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

// Redirect after successful auth
function redirectAfterAuth(isPremium) {
  const returnTo = sessionStorage.getItem('returnAfterAuth') || 'dashboard.html';
  sessionStorage.removeItem('returnAfterAuth');
  
  // Give auth a moment to fully process
  setTimeout(() => {
    window.location.href = returnTo;
  }, 500);
}

// Message display helper
function showMessage(message, type = 'info') {
  const messageDiv = document.getElementById('auth-message') || createMessageDiv();
  messageDiv.textContent = message;
  messageDiv.className = 'auth-message ' + type;
  messageDiv.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

// Create message div if it doesn't exist
function createMessageDiv() {
  const div = document.createElement('div');
  div.id = 'auth-message';
  div.style.cssText = `
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    display: none;
  `;
  document.body.insertBefore(div, document.body.firstChild);
  return div;
}

// Add CSS for messages
const style = document.createElement('style');
style.textContent = `
  .auth-message {
    padding: 1rem !important;
    margin-bottom: 1rem !important;
    border-radius: 8px !important;
    text-align: center !important;
    font-weight: 600 !important;
    animation: slideDown 0.3s ease-out;
  }
  
  .auth-message.success {
    background: rgba(74, 222, 128, 0.1) !important;
    color: #4ade80 !important;
    border: 1px solid #4ade80 !important;
  }
  
  .auth-message.error {
    background: rgba(239, 68, 68, 0.1) !important;
    color: #ef4444 !important;
    border: 1px solid #ef4444 !important;
  }
  
  .auth-message.warning {
    background: rgba(251, 191, 36, 0.1) !important;
    color: #fbbf24 !important;
    border: 1px solid #fbbf24 !important;
  }
  
  .auth-message.info {
    background: rgba(59, 130, 246, 0.1) !important;
    color: #3b82f6 !important;
    border: 1px solid #3b82f6 !important;
  }
  
  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(style);

// Auto-fill remember-me email
window.addEventListener('load', () => {
  if (localStorage.getItem('rememberMe') === 'true') {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.value = localStorage.getItem('userEmail') || '';
      if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }
  }
});

// Export functions for use
window.AuthModule = {
  signUp,
  login,
  logout,
  requestPasswordReset,
  getCurrentUser,
  isLoggedIn,
  checkUserPremiumStatus,
  showMessage
};

console.log('✅ Firebase Auth module loaded');
