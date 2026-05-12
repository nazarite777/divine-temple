#!/usr/bin/env node
/**
 * Setup admin user account in Firebase
 * This script creates or updates the cbevvv@gmail.com account
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
  path.join(__dirname, 'sacred-community-firebase-adminsdk.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'sacred-community'
  });
} catch (error) {
  console.error('❌ Failed to load Firebase service account:', error.message);
  process.exit(1);
}

const auth = admin.auth();
const db = admin.firestore();

async function setupAdminUser() {
  const email = 'cbevvv@gmail.com';
  const password = 'Cjanimal23$';
  const username = 'nazir23';
  
  try {
    console.log(`\n📋 Setting up account for: ${email}`);
    
    // Try to get existing user
    let uid;
    try {
      const existingUser = await auth.getUserByEmail(email);
      uid = existingUser.uid;
      console.log(`✅ User exists with UID: ${uid}`);
      console.log(`🔄 Updating password...`);
      await auth.updateUser(uid, { password });
      console.log(`✅ Password updated`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`👤 Creating new user...`);
        const newUser = await auth.createUser({
          email,
          password,
          displayName: 'Nazir'
        });
        uid = newUser.uid;
        console.log(`✅ User created with UID: ${uid}`);
      } else {
        throw error;
      }
    }
    
    // Setup/update Firestore document
    console.log(`💾 Setting up Firestore document...`);
    const userDocRef = db.collection('users').doc(uid);
    
    const now = new Date().toISOString();
    const userData = {
      email,
      displayName: 'Nazir',
      username,
      usernameLower: username.toLowerCase(),
      membershipLevel: 'premium',
      phase1: {
        divisionIntroViewed: false,
        lessonsCompleted: [],
        currentLesson: 'lesson-01-what-is-programming',
        completedAt: null,
        updatedAt: now
      },
      createdAt: now,
      updatedAt: now
    };
    
    await userDocRef.set(userData, { merge: true });
    console.log(`✅ Firestore document updated`);
    
    console.log(`\n✨ Setup complete!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Username: ${username}`);
    console.log(`🆔 UID: ${uid}\n`);
    
  } catch (error) {
    console.error(`\n❌ Setup failed:`, error.message);
    process.exit(1);
  } finally {
    admin.app().delete();
  }
}

setupAdminUser();
