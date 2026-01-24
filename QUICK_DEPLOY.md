# ⚡ Divine Temple - Quick Deploy Checklist

**Fast-track deployment guide. Complete these steps in order.**

---

## 🎯 Phase 1: Get Your API Keys (30 minutes)

### Firebase (Required)
1. ☐ Create Firebase project at https://console.firebase.google.com/
2. ☐ Register web app
3. ☐ Copy config object → Save to `firebase-keys.txt`
4. ☐ Enable Email/Password auth
5. ☐ Create Firestore database (production mode)
6. ☐ Copy security rules from DEPLOYMENT_GUIDE.md
7. ☐ Generate VAPID key → Save to `firebase-keys.txt`

**Your Firebase Keys:**
```
API Key: _______________________
Auth Domain: ___________________
Project ID: ____________________
Storage Bucket: ________________
Messaging Sender ID: ___________
App ID: ________________________
Measurement ID: ________________
VAPID Key: _____________________
```

### Stripe (Required)
1. ☐ Create Stripe account at https://stripe.com/
2. ☐ Complete business verification
3. ☐ Get API keys (Developers → API Keys)
4. ☐ Create 3 products: Monthly ($9.99), Yearly ($99.99), Lifetime ($299.99)
5. ☐ Copy Price IDs → Save to `stripe-keys.txt`

**Your Stripe Keys:**
```
Publishable Key (pk_live_...): _______________________
Secret Key (sk_live_...): _____________________________
Monthly Price ID: ______________________________________
Yearly Price ID: _______________________________________
Lifetime Price ID: _____________________________________
```

### OpenAI (Required)
1. ☐ Create account at https://platform.openai.com/
2. ☐ Add payment method
3. ☐ Create API key → Save to `openai-keys.txt`
4. ☐ Set usage limit ($50/month)

**Your OpenAI Key:**
```
API Key (sk-proj-...): ________________________________
```

### OAuth (Optional - Can Skip)
1. ☐ Spotify: https://developer.spotify.com/dashboard
2. ☐ Google: https://console.cloud.google.com/

---

## 🔧 Phase 2: Update Your Code (10 minutes)

### File 1: `js/firebase-config.js`
```javascript
// Line 1-8: Replace with YOUR Firebase config from Phase 1
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",                    // ← Paste here
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

☐ **Done updating firebase-config.js**

### File 2: `js/push-notifications.js`
```javascript
// Line ~10: Replace with YOUR VAPID key
const vapidPublicKey = 'BPx...'; // ← Paste VAPID key here
```

☐ **Done updating push-notifications.js**

### File 3: `js/in-app-purchases.js`
```javascript
// Line ~10: Replace with YOUR Stripe publishable key
this.stripe = Stripe('pk_live_...'); // ← Paste here

// Line ~20-40: Replace Price IDs
stripePriceId: 'price_...'  // ← Monthly
stripePriceId: 'price_...'  // ← Yearly
stripePriceId: 'price_...'  // ← Lifetime
```

☐ **Done updating in-app-purchases.js**

---

## 🚀 Phase 3: Deploy Backend (Firebase Functions) (15 minutes)

### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Initialize Functions
```bash
cd divine-temple
firebase init functions
# Choose JavaScript
# Install dependencies: Yes
```

### Create Function
Edit `functions/index.js` - Copy from DEPLOYMENT_GUIDE.md Step 3.4

### Set OpenAI Key
```bash
firebase functions:config:set openai.key="YOUR_OPENAI_KEY"
```

### Deploy
```bash
firebase deploy --only functions
```

**Copy your function URL:**
```
Function URL: https://us-central1-YOUR-PROJECT.cloudfunctions.net/chatWithAI
```

### Update ai-chatbot.js
```javascript
// Line ~15
this.apiEndpoint = 'https://us-central1-YOUR-PROJECT.cloudfunctions.net/chatWithAI';
```

☐ **Done deploying Firebase Functions**

---

## 🌐 Phase 4: Deploy Website (5 minutes)

### Option A: Firebase Hosting (Recommended)
```bash
firebase init hosting
# Public directory: . (current directory)
# Single-page app: No

firebase deploy --only hosting
```

**Your site:** `https://YOUR-PROJECT.firebaseapp.com`

☐ **Site deployed to Firebase Hosting**

### Option B: GitHub Pages
```bash
git checkout -b gh-pages
git push origin gh-pages
# Enable in GitHub Settings → Pages
```

☐ **Site deployed to GitHub Pages**

---

## 🧪 Phase 5: Test (15 minutes)

### Open Your Deployed Site

Visit your site URL and test:

**Authentication:**
- ☐ Register new user
- ☐ Login
- ☐ Logout
- ☐ User persists after refresh

**Freemium:**
- ☐ Free tier shows only calendar
- ☐ Premium button shows pricing
- ☐ Medium blog link works

**Core Systems:**
- ☐ XP awards when completing tasks
- ☐ Daily quests generate
- ☐ Achievements unlock
- ☐ Progress saves

**Payments:**
- ☐ Click "Upgrade to Premium"
- ☐ Stripe checkout opens
- ☐ Use test card: `4242 4242 4242 4242`
- ☐ Payment succeeds
- ☐ User upgraded
- ☐ All sections unlock

**AI Chatbot:**
- ☐ Click chatbot icon
- ☐ Send message
- ☐ AI responds (may take 3-5 seconds)

**Push Notifications:**
- ☐ Enable notifications
- ☐ Unlock achievement
- ☐ Notification appears

**PWA:**
- ☐ Install prompt shows (desktop)
- ☐ "Add to Home Screen" works (mobile)
- ☐ App works offline

---

## 🎉 Phase 6: Go Live! (5 minutes)

### Switch Stripe to Live Mode
```javascript
// js/in-app-purchases.js
this.stripe = Stripe('pk_live_...'); // Change from pk_test_ to pk_live_
```

### Update Price IDs to Live
Replace all test Price IDs with live Price IDs

### Final Deploy
```bash
git add .
git commit -m "🚀 Production Launch - Divine Temple v17.0"
git push origin main
firebase deploy
```

### Announce!
- ☐ Post on social media
- ☐ Email announcement
- ☐ Update website
- ☐ Tell friends!

---

## 📋 Quick Reference

### Important URLs
```
Your Site: https://___________________________
Firebase Console: https://console.firebase.google.com/
Stripe Dashboard: https://dashboard.stripe.com/
OpenAI Usage: https://platform.openai.com/usage
```

### Test Cards (Stripe)
```
Success: 4242 4242 4242 4242
Declined: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### Support Resources
```
Firebase Docs: https://firebase.google.com/docs
Stripe Docs: https://stripe.com/docs/api
OpenAI Docs: https://platform.openai.com/docs
Divine Temple Docs: See DEPLOYMENT_GUIDE.md
```

---

## ⏱️ Total Time: ~80 minutes

- Phase 1 (API Keys): 30 min
- Phase 2 (Code Updates): 10 min
- Phase 3 (Backend): 15 min
- Phase 4 (Deploy): 5 min
- Phase 5 (Testing): 15 min
- Phase 6 (Go Live): 5 min

---

## 🆘 Common Issues

**"Firebase error: Permission denied"**
→ Check Firestore security rules are published

**"Stripe error: No such price"**
→ Verify Price IDs are correct (test vs live)

**"AI chatbot not responding"**
→ Check Firebase Function is deployed and OpenAI has credits

**"Can't install PWA"**
→ Requires HTTPS (Firebase/GitHub Pages have it by default)

---

## ✅ You're Done!

**Divine Temple is now LIVE! 🎉**

Monitor your deployment:
- Firebase Console → Analytics
- Stripe Dashboard → Payments
- OpenAI Platform → Usage

---

**Questions?** Check DEPLOYMENT_GUIDE.md for detailed instructions.

**Need Help?** support@divinetemple.com

---

**Status:** 🟢 Ready to Deploy
**Estimated Time:** 80 minutes
**Difficulty:** Intermediate

**Let's launch! 🚀✨**
