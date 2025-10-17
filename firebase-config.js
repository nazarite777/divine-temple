/**
 * Firebase Configuration Module
 * Initializes Firebase app with configuration
 */

// Firebase configuration - Replace with your actual Firebase config
// In production, use environment variables or a secure config management system
const firebaseConfig = {
    apiKey: "AIzaSyDEXAMPLE-REPLACE-WITH-YOUR-API-KEY",
    authDomain: "divine-temple-example.firebaseapp.com",
    projectId: "divine-temple-example",
    storageBucket: "divine-temple-example.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
    // Initialize Firebase App
    app = firebase.initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication
    auth = firebase.auth();
    
    // Initialize Firestore
    db = firebase.firestore();
    
    // Enable offline persistence
    db.enablePersistence({ synchronizeTabs: true })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('The current browser does not support offline persistence');
            }
        });
    
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Export Firebase instances
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;
