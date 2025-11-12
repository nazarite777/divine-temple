# 🚀 Divine Temple - Production Deployment Guide

**Complete step-by-step guide to deploy Divine Temple to production.**

---

## 📋 Pre-Deployment Checklist

Before we begin, ensure you have:
- [ ] GitHub account (for hosting)
- [ ] Firebase account
- [ ] Stripe account
- [ ] OpenAI account
- [ ] Google Cloud account (for OAuth)
- [ ] Spotify Developer account (optional)
- [ ] Domain name (optional but recommended)
- [ ] Credit card for service billing

---

## 🔥 Step 1: Firebase Setup (Required)

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Project name: `divine-temple-production`
4. Enable Google Analytics: **Yes**
5. Choose Analytics account or create new
6. Click "Create Project" (takes ~1 minute)

### 1.2 Register Web App

1. In Firebase Console → Project Settings (⚙️ icon)
2. Under "Your apps" → Click web icon `</>`
3. App nickname: `Divine Temple Web`
4. ✅ Check "Also set up Firebase Hosting"
5. Click "Register app"

### 1.3 Copy Configuration

You'll see your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "divine-temple-prod.firebaseapp.com",
  projectId: "divine-temple-prod",
  storageBucket: "divine-temple-prod.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
};
```

**📝 ACTION: Copy this entire object - you'll need it soon!**

### 1.4 Enable Authentication

1. Firebase Console → Authentication → Get Started
2. Sign-in method tab → Enable these:
   - ✅ **Email/Password** (enable)
   - ✅ **Google** (enable, configure consent screen)
3. Click "Save"

### 1.5 Create Firestore Database

1. Firebase Console → Firestore Database → Create Database
2. Choose: **Start in production mode**
3. Location: Choose closest to your users (e.g., `us-central1`)
4. Click "Enable"

### 1.6 Set Security Rules

1. Firestore Database → Rules tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // User progress
    match /userProgress/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Friends
    match /friends/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Circles (public read, members can write)
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

    // Leaderboards (public read, admin write only)
    match /leaderboards/{doc} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

3. Click "Publish"

### 1.7 Enable Cloud Messaging

1. Firebase Console → Cloud Messaging
2. Project Settings → Cloud Messaging tab
3. Under "Web Push certificates" → Generate key pair
4. **📝 Copy the VAPID key** (starts with `B...`)

### 1.8 Update Your Code

**Edit `js/firebase-config.js`:**

```javascript
// js/firebase-config.js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",                    // ← Paste from Step 1.3
    authDomain: "YOUR_PROJECT.firebaseapp.com", // ← Paste from Step 1.3
    projectId: "YOUR_PROJECT_ID",              // ← Paste from Step 1.3
    storageBucket: "YOUR_PROJECT.firebasestorage.app", // ← Paste from Step 1.3
    messagingSenderId: "YOUR_SENDER_ID",       // ← Paste from Step 1.3
    appId: "YOUR_APP_ID",                      // ← Paste from Step 1.3
    measurementId: "YOUR_MEASUREMENT_ID"       // ← Paste from Step 1.3
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

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

console.log('✅ Firebase initialized successfully');
```

**Edit `js/push-notifications.js`:**

Find this line (around line 10):
```javascript
const vapidPublicKey = 'YOUR_VAPID_KEY';
```

Replace with:
```javascript
const vapidPublicKey = 'BPx...'; // ← Paste VAPID key from Step 1.7
```

---

## 💳 Step 2: Stripe Setup (Required)

### 2.1 Create Stripe Account

1. Go to [Stripe](https://stripe.com/)
2. Sign up for account
3. Complete business verification (may take 1-2 days)

### 2.2 Get API Keys

1. Stripe Dashboard → Developers → API Keys
2. **📝 Copy both keys:**
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

⚠️ **Use TEST keys for testing, LIVE keys for production!**

### 2.3 Create Products

1. Stripe Dashboard → Products → Add Product

**Product 1: Premium Monthly**
- Name: `Divine Temple Premium - Monthly`
- Description: `Full access to all spiritual tools and features`
- Pricing: `$9.99` / month
- Recurring: Monthly
- Click "Save product"
- **📝 Copy the Price ID** (starts with `price_...`)

**Product 2: Premium Yearly**
- Name: `Divine Temple Premium - Yearly`
- Description: `Full access - Save 17% with annual billing`
- Pricing: `$99.99` / year
- Recurring: Yearly
- **📝 Copy the Price ID**

**Product 3: Lifetime Access**
- Name: `Divine Temple Lifetime Access`
- Description: `One-time payment for lifetime access`
- Pricing: `$299.99`
- One-time payment
- **📝 Copy the Price ID**

**Product 4: Chakra Course** (optional)
- Name: `Chakra Mastery Course`
- Pricing: `$49.99`
- One-time
- **📝 Copy the Price ID**

### 2.4 Update Your Code

**Edit `js/in-app-purchases.js`:**

Find line ~10:
```javascript
this.stripe = Stripe('pk_test_...');
```

Replace with:
```javascript
this.stripe = Stripe('pk_live_...');  // ← Your LIVE publishable key
```

Find line ~15-40 (subscription tiers):
```javascript
this.subscriptionTiers = [
    {
        id: 'monthly',
        name: 'Premium Monthly',
        price: 9.99,
        stripePriceId: 'price_...'  // ← Paste Monthly Price ID
    },
    {
        id: 'yearly',
        name: 'Premium Yearly',
        price: 99.99,
        stripePriceId: 'price_...'  // ← Paste Yearly Price ID
    },
    {
        id: 'lifetime',
        name: 'Lifetime Access',
        price: 299.99,
        stripePriceId: 'price_...'  // ← Paste Lifetime Price ID
    }
];
```

### 2.5 Setup Success/Cancel URLs

In `js/in-app-purchases.js`, find the `purchaseSubscription` method:

```javascript
successUrl: window.location.origin + '/success.html',
cancelUrl: window.location.origin + '/members-new.html',
```

Make sure these URLs match your domain!

---

## 🤖 Step 3: OpenAI Setup (Required for AI Chatbot)

### 3.1 Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up for account
3. Add payment method (required for API access)

### 3.2 Get API Key

1. Go to [API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name: `Divine Temple Production`
4. **📝 Copy the key** (starts with `sk-proj-` or `sk-`)
5. ⚠️ **SAVE IT NOW - you can't see it again!**

### 3.3 Set Usage Limits

1. OpenAI Dashboard → Usage limits
2. Set monthly budget: **$50** (adjust as needed)
3. Enable email alerts at 50%, 75%, 90%

### 3.4 Setup Backend Proxy (CRITICAL!)

⚠️ **Never use OpenAI keys in client-side code!**

**Option A: Firebase Functions (Recommended)**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Functions in your project
cd divine-temple
firebase init functions
# Choose: JavaScript
# Choose: Install dependencies - Yes
```

**Create `functions/index.js`:**

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

exports.chatWithAI = functions.https.onCall(async (data, context) => {
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
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
                        content: 'You are a wise and compassionate spiritual guide...'
                    },
                    ...conversationHistory,
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const result = await response.json();
        return {
            success: true,
            message: result.choices[0].message.content
        };

    } catch (error) {
        console.error('OpenAI error:', error);
        throw new functions.https.HttpsError('internal', 'AI service error');
    }
});
```

**Set OpenAI key:**
```bash
firebase functions:config:set openai.key="YOUR_OPENAI_KEY"
```

**Deploy function:**
```bash
firebase deploy --only functions
```

**Update `js/ai-chatbot.js`:**

Find line ~15:
```javascript
this.apiEndpoint = 'YOUR_BACKEND_ENDPOINT';
```

Replace with:
```javascript
this.apiEndpoint = 'https://us-central1-YOUR-PROJECT.cloudfunctions.net/chatWithAI';
```

---

## 🎵 Step 4: OAuth Integrations (Optional)

### 4.1 Spotify Integration (Optional)

1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Create App → Name: `Divine Temple`
3. Redirect URI: `https://yourdomain.com/callback.html`
4. **📝 Copy Client ID**
5. Click "Show Client Secret" → **📝 Copy it**

**Update `js/integrations-system.js`:**
```javascript
const spotifyConfig = {
    clientId: 'YOUR_SPOTIFY_CLIENT_ID',
    redirectUri: 'https://yourdomain.com/callback.html'
};
```

### 4.2 YouTube/Google Calendar (Optional)

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `Divine Temple`
3. Enable APIs:
   - YouTube Data API v3
   - Google Calendar API
4. Create OAuth Credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://yourdomain.com/callback.html`
5. **📝 Copy Client ID and Secret**

**Update `js/integrations-system.js`:**
```javascript
const googleConfig = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: 'https://yourdomain.com/callback.html'
};
```

---

## 🌐 Step 5: Deploy to Hosting

### Option A: Firebase Hosting (Recommended)

```bash
# Initialize hosting
firebase init hosting
# Choose: public directory - Enter '.' (current directory)
# Single-page app: No
# Overwrite index.html: No

# Deploy
firebase deploy --only hosting

# Your site is live at: https://YOUR-PROJECT.firebaseapp.com
```

### Option B: GitHub Pages

```bash
# Create gh-pages branch
git checkout -b gh-pages

# Push to GitHub
git push origin gh-pages

# Enable in GitHub: Settings → Pages → Source: gh-pages
# Your site: https://username.github.io/divine-temple
```

### Option C: Netlify

1. Go to [Netlify](https://netlify.com)
2. "New site from Git"
3. Connect GitHub repo
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
5. Click "Deploy site"

---

## 🧪 Step 6: Test Everything

### 6.1 Run Automated Tests

Open your deployed site, then in browser console:

```javascript
// Load validation script
await validateAllSystems();

// Should see:
// ✅ All systems validated
// 📊 Pass rate: 95%+
```

### 6.2 Manual Testing Checklist

**Authentication:**
- [ ] Register new user works
- [ ] Email/password login works
- [ ] Logout works
- [ ] User persists after refresh

**Freemium:**
- [ ] Free tier shows calendar only
- [ ] Premium tier shows all sections
- [ ] Medium blog link works
- [ ] Tier switching works

**Core Features:**
- [ ] XP awards correctly
- [ ] Level up triggers
- [ ] Achievements unlock
- [ ] Daily quests generate
- [ ] Reward shop works

**Social:**
- [ ] Friend requests work
- [ ] Circles create/join works
- [ ] Chat messages send
- [ ] Leaderboards display

**Content:**
- [ ] Audio player works
- [ ] Video player works
- [ ] Journaling saves
- [ ] Challenge calendar updates

**AI & Integrations:**
- [ ] AI chatbot responds
- [ ] Personalization suggestions show
- [ ] Spotify connects (if enabled)
- [ ] Calendar syncs (if enabled)

**Payments:**
- [ ] Stripe checkout opens
- [ ] Test payment succeeds
- [ ] User upgraded to premium
- [ ] XP awarded for purchase

**PWA:**
- [ ] Install prompt shows
- [ ] App installs on mobile
- [ ] Works offline
- [ ] Push notifications work

---

## 🔒 Step 7: Security Hardening

### 7.1 Environment Variables

Create `.env.local` (DO NOT COMMIT):
```bash
FIREBASE_API_KEY=your_key
STRIPE_PUBLISHABLE_KEY=pk_live_...
OPENAI_API_KEY=sk-proj-...
```

Add to `.gitignore`:
```
.env
.env.local
.env.production
*.key
```

### 7.2 Enable HTTPS

- Firebase Hosting: Automatic ✅
- GitHub Pages: Automatic ✅
- Netlify: Automatic ✅
- Custom domain: Configure SSL certificate

### 7.3 Rate Limiting

Add to Firebase Functions:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each user to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Step 8: Analytics & Monitoring

### 8.1 Verify Firebase Analytics

1. Firebase Console → Analytics → Dashboard
2. Wait 24 hours for data
3. Monitor:
   - Active users
   - Page views
   - Conversions
   - Retention

### 8.2 Setup Error Logging

Add to main JavaScript:
```javascript
window.addEventListener('error', (event) => {
    if (window.FirebaseConfig && window.FirebaseConfig.analytics) {
        FirebaseConfig.analytics.logEvent('exception', {
            description: event.error.message,
            fatal: false
        });
    }
});
```

### 8.3 Monitor Costs

- Firebase: Console → Usage
- Stripe: Dashboard → Balance
- OpenAI: Platform → Usage
- Set up billing alerts!

---

## ✅ Launch Checklist

Before going live:

### Technical
- [ ] All API keys configured
- [ ] Firebase deployed and working
- [ ] Stripe products created
- [ ] OpenAI proxy deployed
- [ ] All tests passing
- [ ] HTTPS enabled
- [ ] Domain configured (if custom)

### Content
- [ ] Medium article published
- [ ] Audio library populated
- [ ] Video library populated
- [ ] Achievement icons uploaded
- [ ] Default avatars available

### Legal & Business
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Refund policy defined
- [ ] Support email configured
- [ ] Business registered (if required)

### Marketing
- [ ] Landing page optimized
- [ ] SEO meta tags added
- [ ] Social media accounts created
- [ ] Email list setup (Mailchimp)
- [ ] Launch announcement prepared

---

## 🚀 GO LIVE!

Once everything is checked:

```bash
# Final commit
git add .
git commit -m "🚀 Launch Divine Temple v17.0 - Production Ready!"
git push origin main

# Deploy
firebase deploy

# Announce!
echo "🎉 Divine Temple is LIVE! ✨"
```

---

## 📞 Post-Launch

### Week 1
- Monitor error logs daily
- Check user feedback
- Fix critical bugs immediately
- Optimize performance

### Month 1
- Analyze conversion rates
- A/B test pricing
- Add requested features
- Scale infrastructure as needed

---

## 🆘 Troubleshooting

**Issue: Firebase connection failed**
- Check API keys are correct
- Verify Firebase project is active
- Check browser console for errors

**Issue: Payments not working**
- Verify Stripe keys (test vs live)
- Check webhook endpoint
- Review Stripe dashboard logs

**Issue: AI chatbot not responding**
- Verify OpenAI proxy is deployed
- Check OpenAI account has credits
- Review function logs

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Divine Temple User Guide](USER_GUIDE.md)
- [Divine Temple API Guide](API_CONFIGURATION_GUIDE.md)

---

**🎉 Congratulations! Divine Temple is now in production! 🚀**

**Support:** support@divinetemple.com
**Version:** 17.0.0
**Status:** 🟢 LIVE

---

**Built with 💜 for spiritual seekers everywhere.**
