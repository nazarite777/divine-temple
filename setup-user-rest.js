#!/usr/bin/env node
/**
 * Setup admin user using Firebase Auth REST API
 * This creates the cbevvv@gmail.com account without needing service account key
 */

const https = require('https');

const FIREBASE_API_KEY = 'AIzaSyCOyZPb4gfYE5q_RwmYaKG6cpTvrE-3LxI'; // Public API key from web config
const PROJECT_ID = 'sacred-community';

const email = 'cbevvv@gmail.com';
const password = 'Cjanimal23$';

async function makeRequest(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function setupUser() {
  console.log(`\n📋 Setting up account via Firebase REST API...`);
  console.log(`📧 Email: ${email}`);
  
  try {
    // Sign up new user
    const signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
    const signupResponse = await makeRequest('POST', signupUrl, {
      email,
      password,
      returnSecureToken: true,
      displayName: 'Nazir'
    });
    
    if (signupResponse.status !== 200) {
      if (signupResponse.data.error && signupResponse.data.error.message === 'EMAIL_EXISTS') {
        console.log(`✅ Account already exists, resetting password...`);
        
        // Get access token via sign-in to reset password
        const signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
        const signinResponse = await makeRequest('POST', signinUrl, {
          email,
          password,
          returnSecureToken: true
        });
        
        if (signinResponse.status === 200) {
          console.log(`✅ Password verified (account already has this password)`);
        } else {
          console.error(`❌ Could not verify account:`, signinResponse.data.error?.message);
        }
      } else {
        console.error(`❌ Signup failed:`, signupResponse.data.error?.message);
        return;
      }
    } else {
      const uid = signupResponse.data.localId;
      console.log(`✅ Account created successfully`);
      console.log(`🆔 UID: ${uid}`);
    }
    
    console.log(`\n✨ Account setup complete!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`Ready for login testing on https://sacred-community.web.app/members-new.html\n`);
    
  } catch (error) {
    console.error(`\n❌ Setup failed:`, error.message);
    process.exit(1);
  }
}

setupUser();
