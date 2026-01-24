# 🔑 Divine Temple - API Configuration Guide

Complete setup guide for all external services and API integrations.

---

## 📋 Table of Contents

1. [Firebase Configuration](#firebase-configuration)
2. [Stripe Payment Configuration](#stripe-payment-configuration)
3. [OpenAI API Configuration](#openai-api-configuration)
4. [OAuth Integrations](#oauth-integrations)
   - [Spotify](#spotify-oauth)
   - [YouTube](#youtube-oauth)
   - [Google Calendar](#google-calendar-oauth)
5. [Environment Variables](#environment-variables)
6. [Security Best Practices](#security-best-practices)

---

## 🔥 Firebase Configuration

Firebase powers authentication, real-time database, cloud messaging, and analytics.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `divine-temple-production`
4. Enable Google Analytics (recommended)
5. Click "Create Project"

### Step 2: Register Web App

1. In Firebase Console → Project Settings → Your Apps
2. Click the web icon (</>) to add a web app
3. Register app name: `Divine Temple`
4. Enable "Firebase Hosting" (optional)
5. Click "Register App"

### Step 3: Get Configuration Keys

Firebase will provide your configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBl3r7LQ-pdz8KVP-7QnCuCJfOvEpzF-7M",
  authDomain: "divine-temple-b7dcf.firebaseapp.com",
  projectId: "divine-temple-b7dcf",
  storageBucket: "divine-temple-b7dcf.firebasestorage.app",
  messagingSenderId: "467831209971",
  appId: "1:467831209971:web:d52e36ca71e3c72bca8870",
  measurementId: "G-XXXXXXXXXX" // If Analytics enabled
};
```

### Step 4: Update `js/firebase-config.js`

Replace the configuration in your `js/firebase-config.js` file:

```javascript
// js/firebase-config.js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Export for use in other files
window.FirebaseConfig = {
    auth,
    db,
    analytics,
    trackPageView: (pageName, pageTitle) => {
        analytics.logEvent('page_view', {
            page_name: pageName,
            page_title: pageTitle
        });
    },
    trackEvent: (eventName, params) => {
        analytics.logEvent(eventName, params);
    }
};
```

### Step 5: Enable Authentication Methods

1. Firebase Console → Authentication → Sign-in method
2. Enable:
   - ✅ Email/Password
   - ✅ Google (optional but recommended)
   - ✅ Anonymous (for testing)

### Step 6: Setup Firestore Database

1. Firebase Console → Firestore Database → Create Database
2. Choose:
   - **Production mode** (recommended)
   - Location: Choose closest to your users

3. Set up security rules:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // User progress (XP, levels, achievements)
    match /userProgress/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Friends
    match /friends/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // Circles/Guilds
    match /circles/{circleId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if resource.data.creator == request.auth.uid
                              || request.auth.uid in resource.data.members;
    }

    // Circle messages
    match /circleMessages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }

    // Mentorships
    match /mentorships/{mentorshipId} {
      allow read: if request.auth.uid == resource.data.mentorId
                   || request.auth.uid == resource.data.menteeId;
      allow write: if request.auth.uid == resource.data.mentorId
                    || request.auth.uid == resource.data.menteeId;
    }

    // Leaderboards (public read)
    match /leaderboards/{doc} {
      allow read: if true;
      allow write: if false; // Only server-side updates
    }
  }
}
```

### Step 7: Setup Cloud Messaging (Push Notifications)

1. Firebase Console → Cloud Messaging
2. Generate VAPID key for web push:
   - Go to Project Settings → Cloud Messaging → Web Push certificates
   - Click "Generate key pair"
   - Copy the VAPID public key

3. Update `js/push-notifications.js`:

```javascript
const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';
```

### Step 8: Create Firestore Indexes

For optimal query performance, create these composite indexes:

1. Firebase Console → Firestore → Indexes → Composite
2. Add indexes:

```
Collection: userProgress
Fields: xp (Descending), timestamp (Descending)

Collection: circles
Fields: type (Ascending), memberCount (Descending)

Collection: circleMessages
Fields: circleId (Ascending), timestamp (Descending)
```

---

## 💳 Stripe Payment Configuration

Stripe handles all subscription and one-time purchases.

### Step 1: Create Stripe Account

1. Go to [Stripe](https://stripe.com/)
2. Create account or sign in
3. Verify your business details

### Step 2: Get API Keys

1. Stripe Dashboard → Developers → API Keys
2. Copy:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

**⚠️ IMPORTANT:** Never expose secret keys in client-side code!

### Step 3: Create Products & Prices

Create these subscription tiers in Stripe:

1. Stripe Dashboard → Products → Add Product

**Product 1: Premium Monthly**
- Name: `Divine Temple Premium - Monthly`
- Price: `$9.99/month`
- Recurring: Monthly
- Copy the **Price ID** (e.g., `price_1OxxxxxxxxxxxxxxxxxxxxM`)

**Product 2: Premium Yearly**
- Name: `Divine Temple Premium - Yearly`
- Price: `$99.99/year`
- Recurring: Yearly
- Copy the **Price ID**

**Product 3: Lifetime Access**
- Name: `Divine Temple Lifetime Access`
- Price: `$299.99`
- One-time payment
- Copy the **Price ID**

**One-Time Products:**
- Chakra Mastery Course - $49.99
- Premium Oracle Deck - $29.99
- Meditation Pack - $19.99

### Step 4: Setup Checkout Integration

#### Option A: Client-Only (Redirect to Checkout)

Update `js/in-app-purchases.js`:

```javascript
class InAppPurchases {
    constructor() {
        this.stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // pk_test_xxx or pk_live_xxx
        this.subscriptionTiers = [
            {
                id: 'monthly',
                stripePriceId: 'price_1OxxxxxxxxxxxxM', // Your actual Price ID
                name: 'Premium Monthly',
                price: 9.99
            },
            {
                id: 'yearly',
                stripePriceId: 'price_1OxxxxxxxxxxxxY',
                name: 'Premium Yearly',
                price: 99.99
            },
            {
                id: 'lifetime',
                stripePriceId: 'price_1OxxxxxxxxxxxxL',
                name: 'Lifetime Access',
                price: 299.99
            }
        ];
    }

    async purchaseSubscription(tierId) {
        const tier = this.subscriptionTiers.find(t => t.id === tierId);

        // Redirect to Stripe Checkout
        const { error } = await this.stripe.redirectToCheckout({
            lineItems: [{ price: tier.stripePriceId, quantity: 1 }],
            mode: 'subscription',
            successUrl: window.location.origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancelUrl: window.location.origin + '/members-new.html',
            customerEmail: firebase.auth().currentUser.email
        });

        if (error) {
            console.error('Stripe error:', error);
        }
    }
}
```

#### Option B: Server-Side (More Secure - Recommended for Production)

**Backend Setup (Node.js + Firebase Functions):**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase Functions
firebase init functions
```

**functions/index.js:**

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('YOUR_SECRET_KEY'); // sk_test_xxx or sk_live_xxx

admin.initializeApp();

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { priceId, mode } = data;
    const userId = context.auth.uid;
    const userEmail = context.auth.token.email;

    try {
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1
            }],
            mode: mode, // 'subscription' or 'payment'
            success_url: `https://yourdomain.com/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://yourdomain.com/members-new.html`,
            customer_email: userEmail,
            client_reference_id: userId,
            metadata: {
                userId: userId
            }
        });

        return { sessionId: session.id };
    } catch (error) {
        console.error('Stripe error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// Webhook to handle successful payments
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'YOUR_WEBHOOK_SECRET';

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const userId = session.client_reference_id;

            // Update user's subscription status in Firestore
            await admin.firestore().collection('users').doc(userId).update({
                subscriptionStatus: 'active',
                subscriptionId: session.subscription,
                subscriptionTier: 'premium',
                subscriptionStartDate: admin.firestore.FieldValue.serverTimestamp()
            });

            // Award XP
            await admin.firestore().collection('userProgress').doc(userId).update({
                xp: admin.firestore.FieldValue.increment(100)
            });

            break;

        case 'customer.subscription.deleted':
            // Handle subscription cancellation
            const subscription = event.data.object;
            // Find user by subscription ID and update status
            break;
    }

    res.json({ received: true });
});
```

**Deploy Functions:**

```bash
firebase deploy --only functions
```

### Step 5: Setup Webhook (for server-side)

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-cloud-function-url/stripeWebhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Webhook Secret** and add to your function

### Step 6: Create Success Page

Create `success.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Payment Successful - Divine Temple</title>
</head>
<body>
    <div class="success-container">
        <h1>🎉 Welcome to Divine Temple Premium!</h1>
        <p>Your payment was successful. You now have access to all premium features!</p>
        <a href="members-new.html">Enter Divine Temple →</a>
    </div>

    <script>
        // Verify session and update user tier
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (sessionId) {
            // Update localStorage
            localStorage.setItem('userTier', 'premium');
            localStorage.setItem('subscriptionStatus', 'active');

            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'members-new.html';
            }, 3000);
        }
    </script>
</body>
</html>
```

---

## 🤖 OpenAI API Configuration

OpenAI powers the AI Chatbot feature.

### Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or sign in
3. Verify your email

### Step 2: Get API Key

1. Go to [API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name it: `Divine Temple Chatbot`
4. Copy the key (starts with `sk-proj-` or `sk-`)

**⚠️ CRITICAL:** Never expose OpenAI API keys in client-side code!

### Step 3: Setup Backend Proxy (Required for Security)

You **MUST** create a backend endpoint to proxy OpenAI requests:

**Option A: Firebase Functions**

```javascript
// functions/index.js
const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.chatWithAI = functions.https.onCall(async (data, context) => {
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { message, conversationHistory } = data;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${functions.config().openai.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `You are a wise spiritual guide for Divine Temple...`
                    },
                    ...conversationHistory,
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return {
            success: true,
            message: data.choices[0].message.content
        };

    } catch (error) {
        console.error('OpenAI error:', error);
        throw new functions.https.HttpsError('internal', 'AI service error');
    }
});
```

**Set OpenAI key in Firebase:**

```bash
firebase functions:config:set openai.key="YOUR_OPENAI_KEY"
firebase deploy --only functions
```

**Option B: Vercel Serverless Function**

Create `api/chat.js`:

```javascript
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, conversationHistory } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a wise spiritual guide...' },
                    ...conversationHistory,
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.status(200).json({
            success: true,
            message: data.choices[0].message.content
        });

    } catch (error) {
        console.error('OpenAI error:', error);
        res.status(500).json({ error: 'AI service error' });
    }
}
```

### Step 4: Update Client-Side Code

Update `js/ai-chatbot.js`:

```javascript
class AIChatbot {
    constructor() {
        this.apiEndpoint = 'YOUR_BACKEND_ENDPOINT'; // Firebase Function or Vercel API
        this.conversationHistory = [];
    }

    async getAIResponse(userMessage) {
        try {
            // Call YOUR backend (not OpenAI directly!)
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: this.conversationHistory.slice(-10)
                })
            });

            const data = await response.json();
            return data.message;

        } catch (error) {
            console.error('AI error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }
}
```

### Step 5: Set Usage Limits

To prevent API cost overruns:

1. OpenAI Dashboard → Usage Limits
2. Set monthly budget: $50 (recommended for small projects)
3. Enable email notifications at 50%, 75%, 100%

### Step 6: Monitor Usage

Track your OpenAI API usage:
- OpenAI Dashboard → Usage
- Review daily token consumption
- Optimize prompts to reduce costs

**Cost Optimization Tips:**
- Use GPT-3.5-turbo instead of GPT-4 (10x cheaper)
- Limit `max_tokens` to 500
- Cache common responses
- Implement rate limiting (max 10 messages per user per hour)

---

## 🎵 OAuth Integrations

### Spotify OAuth

**Step 1: Create Spotify App**

1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Log in with Spotify account
3. Click "Create App"
4. Fill in:
   - App Name: `Divine Temple`
   - App Description: `Spiritual platform with music integration`
   - Redirect URI: `https://yourdomain.com/callback.html`
   - Check "Web API"
5. Click "Save"

**Step 2: Get Credentials**

1. Click on your app
2. Copy:
   - **Client ID**
   - **Client Secret** (click "Show Client Secret")

**Step 3: Configure Redirect URI**

Add these redirect URIs:
- `https://yourdomain.com/callback.html`
- `http://localhost:8080/callback.html` (for local testing)

**Step 4: Update Code**

```javascript
// js/integrations-system.js
const spotifyConfig = {
    clientId: 'YOUR_SPOTIFY_CLIENT_ID',
    redirectUri: 'https://yourdomain.com/callback.html',
    scopes: [
        'user-read-private',
        'playlist-modify-public',
        'user-library-modify'
    ]
};
```

---

### YouTube OAuth

**Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `Divine Temple`
3. Enable YouTube Data API v3

**Step 2: Create OAuth Credentials**

1. APIs & Services → Credentials → Create Credentials → OAuth client ID
2. Application type: Web application
3. Add authorized redirect URIs:
   - `https://yourdomain.com/callback.html`
4. Copy:
   - **Client ID**
   - **Client Secret**

**Step 3: Update Code**

```javascript
const youtubeConfig = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: 'https://yourdomain.com/callback.html',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly']
};
```

---

### Google Calendar OAuth

**Step 1: Use Same Google Cloud Project**

(If you already created one for YouTube, use that)

**Step 2: Enable Google Calendar API**

1. Google Cloud Console → APIs & Services → Library
2. Search "Google Calendar API"
3. Click "Enable"

**Step 3: Update OAuth Scopes**

Add Calendar scope to your OAuth consent screen:
- `https://www.googleapis.com/auth/calendar.events`

**Step 4: Update Code**

```javascript
const calendarConfig = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: 'https://yourdomain.com/callback.html',
    scopes: ['https://www.googleapis.com/auth/calendar.events']
};
```

---

## 🔐 Environment Variables

For production, use environment variables instead of hardcoding keys.

### Create `.env` file (DO NOT COMMIT!)

```bash
# .env (add to .gitignore!)

# Firebase
FIREBASE_API_KEY=your_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
FIREBASE_MEASUREMENT_ID=G-ABC123

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# OpenAI
OPENAI_API_KEY=sk-proj-xxxx

# Spotify
SPOTIFY_CLIENT_ID=xxxx
SPOTIFY_CLIENT_SECRET=xxxx

# Google OAuth
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx

# VAPID (Push Notifications)
VAPID_PUBLIC_KEY=xxxx
VAPID_PRIVATE_KEY=xxxx
```

### Add to .gitignore

```bash
# .gitignore
.env
.env.local
.env.production
*.key
config/secrets.js
```

---

## 🛡️ Security Best Practices

### ✅ DO:
- Store API keys in environment variables
- Use Firebase Functions or backend proxy for sensitive operations
- Implement rate limiting
- Validate all user inputs
- Use HTTPS only
- Enable Firebase security rules
- Rotate keys regularly
- Monitor API usage

### ❌ DON'T:
- Hardcode API keys in client-side code
- Commit `.env` files to Git
- Expose secret keys in public repos
- Call OpenAI directly from client
- Skip input validation
- Disable CORS without security review
- Use test keys in production

---

## 🚀 Quick Start Checklist

- [ ] Firebase project created and configured
- [ ] Firebase config updated in `js/firebase-config.js`
- [ ] Firestore security rules set
- [ ] Firebase Authentication methods enabled
- [ ] VAPID keys generated for push notifications
- [ ] Stripe account created
- [ ] Stripe products and prices created
- [ ] Stripe keys added to code
- [ ] Stripe webhook configured (if using server-side)
- [ ] OpenAI API key obtained
- [ ] OpenAI backend proxy created
- [ ] Spotify app created and configured
- [ ] YouTube/Google Cloud project created
- [ ] Google Calendar API enabled
- [ ] OAuth redirect URIs configured
- [ ] `.env` file created and added to `.gitignore`
- [ ] All keys tested in development
- [ ] Production keys ready for deployment

---

## 📞 Support Resources

- **Firebase:** [Firebase Documentation](https://firebase.google.com/docs)
- **Stripe:** [Stripe API Docs](https://stripe.com/docs/api)
- **OpenAI:** [OpenAI API Docs](https://platform.openai.com/docs)
- **Spotify:** [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- **Google APIs:** [Google API Documentation](https://developers.google.com/)

---

**Last Updated:** 2025-11-05
**Version:** 1.0.0
