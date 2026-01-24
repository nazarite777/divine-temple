# 🚀 Deployment Steps - Security Fixes

**Status:** ✅ Code changes complete, ready to deploy
**Branch:** `claude/repo-audit-O7ceS`
**Commit:** Security fixes committed and pushed

---

## Quick Deploy (3 Commands)

```bash
# 1. Authenticate with Firebase (one-time setup)
npx firebase-tools login

# 2. Run deployment script
./DEPLOY.sh

# 3. Done! Test your changes
```

---

## Manual Deploy (Step-by-Step)

If you prefer to deploy manually:

### Step 1: Authenticate with Firebase

```bash
npx firebase-tools login
# This will open a browser window
# Log in with your Firebase/Google account
```

### Step 2: Verify Project

```bash
npx firebase-tools projects:list
# Should show: sacred-community
```

### Step 3: Deploy Cloud Functions

```bash
npx firebase-tools deploy --only functions
# Deploys:
# - checkPremiumAccess() [updated]
# - onUserCreate() [updated]
# - createCheckoutSession() [existing]
# - stripeWebhook() [updated]
# - grantPremiumAccess() [NEW]
```

### Step 4: Deploy Firestore Rules

```bash
npx firebase-tools deploy --only firestore:rules
# Deploys simplified security rules
```

### Step 5: Deploy Frontend

```bash
npx firebase-tools deploy --only hosting
# Deploys updated client-side code
```

---

## After Deployment - Testing

### Test 1: Verify Your Own Access

```bash
# 1. Go to: https://edenconsciousnesssdt.com
# 2. Log in with your account
# 3. Open browser console (F12)
# 4. Load admin script:

const script = document.createElement('script');
script.src = '/admin-grant-premium.js';
document.head.appendChild(script);

# 5. Wait 2 seconds, then run:
grantMePremium()

# 6. Refresh page - you should have premium access
```

### Test 2: Test Payment Flow (Stripe Test Mode)

```bash
# 1. Create a new test account
# 2. Click "Upgrade to Premium"
# 3. Use test card: 4242 4242 4242 4242
# 4. Complete payment
# 5. Verify premium access granted automatically
```

### Test 3: Check Cloud Functions Logs

```bash
npx firebase-tools functions:log

# Look for:
# ✅ "User created with free tier"
# ✅ "Premium access granted"
# ✅ "Stripe webhook received"
```

---

## Troubleshooting

### Issue: "Not authenticated"

```bash
# Solution:
npx firebase-tools login
# Then try deployment again
```

### Issue: "Permission denied"

```bash
# Check you're deploying to the right project:
npx firebase-tools use sacred-community

# Then try again:
./DEPLOY.sh
```

### Issue: Functions deployment fails

```bash
# Check functions dependencies:
cd functions
npm install
cd ..

# Try deploying again:
npx firebase-tools deploy --only functions
```

### Issue: Stripe webhooks not working

```bash
# After deployment, update Stripe webhook URL to:
# https://us-central1-sacred-community.cloudfunctions.net/stripeWebhook

# In Stripe Dashboard:
# 1. Go to Developers → Webhooks
# 2. Update endpoint URL
# 3. Ensure these events are selected:
#    - checkout.session.completed
#    - customer.subscription.deleted
```

---

## Rollback (If Needed)

If something goes wrong:

```bash
# View deployment history
npx firebase-tools hosting:rollback

# Rollback to previous version
npx firebase-tools hosting:rollback <deployment-id>
```

---

## Success Checklist

After deployment, verify:

- [ ] Cloud Functions deployed (5 functions)
- [ ] Firestore rules deployed (no errors)
- [ ] Frontend deployed (hosting updated)
- [ ] Can log in to site
- [ ] Can grant yourself premium with admin script
- [ ] Can access premium content after grant
- [ ] Stripe test payment works
- [ ] Premium access granted after payment

---

## Need Help?

- **Firebase Console:** https://console.firebase.google.com/project/sacred-community
- **Functions Logs:** `npx firebase-tools functions:log`
- **Stripe Dashboard:** https://dashboard.stripe.com/test/webhooks
- **Migration Guide:** See SECURITY_FIX_MIGRATION.md

---

**Ready to deploy?** Run: `./DEPLOY.sh`
