# 🚀 QUICK SETUP GUIDE - Divine Temple APIs

Follow these steps to get your Divine Temple fully operational:

## 🔥 Step 1: Firebase (ALREADY DONE ✅)
Your Firebase project "sacred-community" is configured and working!

## 💳 Step 2: Set up Stripe (15 minutes)

### A. Create Stripe Account
1. Go to https://stripe.com and create account
2. Complete business verification

### B. Get API Keys
1. Dashboard → Developers → API Keys
2. Copy your **Publishable key** (pk_test_...)
3. Copy your **Secret key** (sk_test_...)

### C. Create Products (CRITICAL!)
Create these exact products in Stripe Dashboard → Products:

```
1. Divine Temple Premium Monthly
   - Price: $9.99 USD
   - Recurring: Monthly
   - Copy the Price ID (price_xxx)

2. Divine Temple Premium Yearly  
   - Price: $99.99 USD
   - Recurring: Yearly
   - Copy the Price ID (price_xxx)

3. Divine Temple Lifetime Access
   - Price: $299.99 USD
   - One-time payment
   - Copy the Price ID (price_xxx)

4. Chakra Mastery Course
   - Price: $49.99 USD
   - One-time payment
   - Copy the Price ID (price_xxx)

5. Premium Oracle Deck
   - Price: $29.99 USD
   - One-time payment
   - Copy the Price ID (price_xxx)

6. Meditation Pack
   - Price: $19.99 USD
   - One-time payment
   - Copy the Price ID (price_xxx)
```

## 🤖 Step 3: Set up OpenAI Backend (20 minutes)

### A. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new key named "Divine Temple"
3. Copy the key (sk-proj_xxx or sk_xxx)

### B. Deploy Firebase Functions
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Navigate to your project
cd divine-temple

# Initialize Functions (if not done)
firebase init functions
# Select your "sacred-community" project
# Choose JavaScript
# Install dependencies: Yes

# Set your OpenAI API key
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY_HERE"

# Deploy the functions
firebase deploy --only functions
```

### C. Enable Required APIs
1. Go to Firebase Console → Functions
2. You should see: `chatWithAI` and `healthCheck` functions deployed

## 🎵 Step 4: OAuth Setup (OPTIONAL - for advanced features)

### Spotify (Music Integration)
1. Go to https://developer.spotify.com/dashboard
2. Create app: "Divine Temple"
3. Add redirect URI: `https://edenconsciousnesssdt.com/callback.html`
4. Copy Client ID and Secret

### Google (YouTube + Calendar)
1. Go to https://console.cloud.google.com/
2. Create project: "Divine Temple APIs"
3. Enable YouTube Data API v3
4. Enable Google Calendar API
5. Create OAuth credentials
6. Add redirect URI: `https://edenconsciousnesssdt.com/callback.html`

## 🔐 Step 5: Create Environment File

Create `.env` file in your project root:

```bash
# Copy this template and fill in your actual values

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Stripe Price IDs (from products you created)
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_id
STRIPE_YEARLY_PRICE_ID=price_your_yearly_id
STRIPE_LIFETIME_PRICE_ID=price_your_lifetime_id
STRIPE_CHAKRA_COURSE_PRICE_ID=price_your_chakra_id
STRIPE_ORACLE_DECK_PRICE_ID=price_your_oracle_id
STRIPE_MEDITATION_PACK_PRICE_ID=price_your_meditation_id

# OpenAI (set in Firebase Functions)
OPENAI_API_KEY=sk_proj_your_openai_key

# OAuth (optional)
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

## 🧪 Step 6: Test Everything

### Test Firebase
- Open `api-setup.html` in browser
- Click "Test Firebase Connection"
- Should show green success ✅

### Test Authentication
- Go to `members-new.html`
- Try logging in with your admin credentials
- Should work without loops

### Test AI Chatbot
- Open any page with chatbot
- Send message: "Hello, can you guide me?"
- Should get spiritual response (after Firebase Functions deployed)

### Test Payments
- Navigate to subscription page
- Click purchase button
- Should redirect to Stripe checkout

## 🎯 QUICK START CHECKLIST

- [ ] Stripe account created
- [ ] Stripe API keys copied
- [ ] 6 Stripe products created with Price IDs
- [ ] OpenAI API key obtained
- [ ] Firebase Functions deployed
- [ ] OpenAI key set in Firebase config
- [ ] .env file created with all keys
- [ ] Tested Firebase connection
- [ ] Tested authentication flow
- [ ] Tested AI chatbot
- [ ] Tested payment flow

## 🚨 SECURITY REMINDERS

1. **NEVER** commit .env file to Git
2. **NEVER** put API keys in client-side code
3. Use test keys during development
4. Switch to live keys for production
5. Monitor API usage to prevent overcharges

## 📞 Need Help?

If anything doesn't work:
1. Check browser console for errors
2. Check Firebase Functions logs
3. Verify all environment variables are set
4. Test each API individually

## 🎉 PRODUCTION READY?

Once all tests pass:
- Switch Stripe to live keys
- Switch OpenAI to production usage
- Update domain in OAuth apps
- Monitor usage and costs
- Your Divine Temple is LIVE! 🚀

**Total Setup Time: ~1 hour**
**Monthly API Costs: ~$10-50 (depending on usage)**