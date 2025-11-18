/**
 * 🔥 Firebase Configuration for Divine Temple
 * Sacred Community Project Integration
 * 
 * Services:
 * - Authentication: User login/registration
 * - Firestore: Data storage and management 
 * - Analytics: User behavior tracking
 * - Storage: File uploads and media
 */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOyZPb4gfYE5q_RwmYaKG6cpTvrE-3LxI",
    authDomain: "sacred-community.firebaseapp.com",
    projectId: "sacred-community",
    storageBucket: "sacred-community.firebasestorage.app",
    messagingSenderId: "582271923489",
    appId: "1:582271923489:web:aa46a8bb5ac0859fe83a60",
    measurementId: "G-83D6SSJKMH"
};

// Initialize Firebase services
let app, auth, db, analytics, storage;

function initializeFirebase() {
    try {
        // Initialize Firebase app
        app = firebase.initializeApp(firebaseConfig);
        console.log('🔥 Firebase initialized successfully');
        
        // Initialize services
        auth = firebase.auth();
        db = firebase.firestore();
        
        // Initialize Analytics if available
        if (typeof firebase.analytics === 'function') {
            analytics = firebase.analytics();
            console.log('📊 Firebase Analytics initialized');
        }
        
        // Initialize Storage if available
        if (typeof firebase.storage === 'function') {
            storage = firebase.storage();
            console.log('💾 Firebase Storage initialized');
        }
        
        // Configure Firestore settings
        db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });
        
        // Enable offline persistence
        db.enablePersistence({ synchronizeTabs: true })
            .then(() => console.log('✅ Firestore offline persistence enabled'))
            .catch(err => console.log('⚠️ Offline persistence failed:', err));
            
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
}

// Authentication state management
function onAuthStateChanged(callback) {
    if (!auth) {
        console.error('❌ Firebase Auth not initialized');
        return;
    }
    
    return auth.onAuthStateChanged(callback);
}

// Admin email addresses (no password in code for security)
const ADMIN_EMAILS = [
    'nazir@edenconsciousness.com',
    'nazir@edenconsiousness.com' // Alternative spelling
];

// AUTHORIZED PREMIUM USERS - ONLY these users can access premium content
const AUTHORIZED_PREMIUM_USERS = [
    'cbevvv@gmail.com',
    'nazir23' // Can be email or username
];

// AUTHORIZED ADMIN USERS - Full system access
const AUTHORIZED_ADMIN_USERS = [
    'cbevvv@gmail.com',
    'nazir23'
];

// User management functions
const FirebaseAuth = {
    // Check if email belongs to admin
    isAdminEmail(email) {
        if (!email) return false;
        const lowerEmail = email.toLowerCase();
        return ADMIN_EMAILS.some(adminEmail => lowerEmail === adminEmail.toLowerCase());
    },

    // Check if user is authorized for premium access
    isAuthorizedPremiumUser(email, username) {
        if (!email && !username) return false;
        
        const lowerEmail = email ? email.toLowerCase() : '';
        const lowerUsername = username ? username.toLowerCase() : '';
        
        return AUTHORIZED_PREMIUM_USERS.some(authorizedUser => {
            const lowerAuthorized = authorizedUser.toLowerCase();
            return lowerEmail === lowerAuthorized || lowerUsername === lowerAuthorized;
        });
    },

    // Check if user is authorized admin
    isAuthorizedAdmin(email, username) {
        if (!email && !username) return false;
        
        const lowerEmail = email ? email.toLowerCase() : '';
        const lowerUsername = username ? username.toLowerCase() : '';
        
        return AUTHORIZED_ADMIN_USERS.some(authorizedUser => {
            const lowerAuthorized = authorizedUser.toLowerCase();
            return lowerEmail === lowerAuthorized || lowerUsername === lowerAuthorized;
        });
    },

    // Check if current user is admin (based on email)
    isAdmin() {
        const user = auth.currentUser;
        if (user && this.isAdminEmail(user.email)) {
            return true;
        }
        return false;
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },

    // Sign up new user
    async createUser(email, password, displayName) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update display name
            await user.updateProfile({ displayName });
            
            // Create user document in Firestore
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                displayName: displayName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                membershipLevel: 'basic',
                preferences: {
                    theme: 'sacred',
                    notifications: true
                },
                progress: {
                    sectionsVisited: [],
                    completedActions: [],
                    lastActive: firebase.firestore.FieldValue.serverTimestamp()
                }
            });
            
            console.log('✅ User created successfully:', user.uid);
            return { success: true, user };
        } catch (error) {
            console.error('❌ User creation failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Sign in user
    async signIn(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update last active timestamp
            await db.collection('users').doc(user.uid).update({
                'progress.lastActive': firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ User signed in:', user.uid);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Sign in failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Sign out user
    async signOut() {
        try {
            await auth.signOut();
            console.log('✅ User signed out');
            return { success: true };
        } catch (error) {
            console.error('❌ Sign out failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!auth.currentUser;
    }
};

// Analytics tracking functions
const FirebaseAnalytics = {
    // Track page views
    trackPageView(pageName, pageTitle) {
        if (analytics) {
            analytics.logEvent('page_view', {
                page_title: pageTitle,
                page_location: window.location.href,
                page_path: window.location.pathname,
                custom_page_name: pageName
            });
        }
    },
    
    // Track user actions
    trackEvent(eventName, parameters = {}) {
        if (analytics) {
            analytics.logEvent(eventName, {
                timestamp: new Date().toISOString(),
                user_id: auth.currentUser?.uid || 'anonymous',
                ...parameters
            });
        }
    },
    
    // Track book/audiobook purchases
    trackPurchase(itemName, value, currency = 'USD') {
        if (analytics) {
            analytics.logEvent('purchase', {
                currency: currency,
                value: value,
                items: [{
                    item_id: itemName.toLowerCase().replace(/\s+/g, '_'),
                    item_name: itemName,
                    category: 'spiritual_content',
                    quantity: 1,
                    price: value
                }]
            });
        }
    },
    
    // Track temple section visits
    trackSectionVisit(sectionName) {
        this.trackEvent('section_visit', {
            section_name: sectionName,
            user_authenticated: this.isAuthenticated()
        });
    }
};

// Firestore data management
const FirebaseData = {
    // Save user progress
    async saveProgress(sectionName, actionType, data = {}) {
        if (!auth.currentUser) return;
        
        try {
            const userRef = db.collection('users').doc(auth.currentUser.uid);
            await userRef.update({
                [`progress.${sectionName}`]: {
                    lastVisited: firebase.firestore.FieldValue.serverTimestamp(),
                    actionType: actionType,
                    data: data
                },
                'progress.lastActive': firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('❌ Failed to save progress:', error);
        }
    },
    
    // Get user data
    async getUserData(userId = null) {
        const uid = userId || auth.currentUser?.uid;
        if (!uid) return null;
        
        try {
            const doc = await db.collection('users').doc(uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('❌ Failed to get user data:', error);
            return null;
        }
    },
    
    // Save testimonial/review
    async saveTestimonial(testimonialData) {
        try {
            await db.collection('testimonials').add({
                ...testimonialData,
                userId: auth.currentUser?.uid || null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                approved: false // Requires admin approval
            });
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to save testimonial:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get approved testimonials
    async getTestimonials(limit = 10) {
        try {
            const snapshot = await db.collection('testimonials')
                .where('approved', '==', true)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
                
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Failed to get testimonials:', error);
            return [];
        }
    },
    
    // Save support ticket
    async saveSupportTicket(ticketData) {
        try {
            const ticketId = `SACRED-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            
            const ticket = {
                ...ticketData,
                ticketId: ticketId,
                userId: auth.currentUser?.uid || null,
                userEmail: auth.currentUser?.email || ticketData.email,
                status: 'open',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('support_tickets').doc(ticketId).set(ticket);
            
            return { success: true, ticketId: ticketId };
        } catch (error) {
            console.error('❌ Failed to save support ticket:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get user's support tickets
    async getUserTickets(userId = null) {
        const uid = userId || auth.currentUser?.uid;
        if (!uid) return [];
        
        try {
            const snapshot = await db.collection('support_tickets')
                .where('userId', '==', uid)
                .orderBy('createdAt', 'desc')
                .get();
                
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Failed to get user tickets:', error);
            return [];
        }
    }
};

// Export for global access
window.FirebaseConfig = {
    initialize: initializeFirebase,
    auth: FirebaseAuth,
    analytics: FirebaseAnalytics,
    data: FirebaseData,
    onAuthStateChanged
};

// Auto-initialize if Firebase is loaded
if (typeof firebase !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeFirebase();
    });
}