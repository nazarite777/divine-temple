# Stripe Payment Integration - $9.99 Premium Membership

## Overview

This system allows free members to upgrade to premium for a **one-time payment of $9.99**, granting them **lifetime access** to all premium features.

## How It Works

### Payment Flow

1. **User clicks "Upgrade to Premium" button** on free dashboard
2. **Modal appears** showing premium features and $9.99 price
3. **User clicks "Upgrade Now"**
4. **Cloud Function creates Stripe Checkout Session**
5. **User redirects to Stripe** for secure payment
6. **After payment, user redirects to success page**
7. **Stripe webhook updates user to premium** in Firestore
8. **User now has lifetime premium access**

### Security Integration

This payment system integrates with the multi-layer security system:

- **Cloud Function** validates user is authenticated
- **Firestore webhook** sets `isPremium: true` on user document
- **Firestore rules** enforce premium access at database level
- **Premium access control** verifies via server on every page load

---

## 🚀 Deployment Steps

### 1. Set Up Stripe Account

If you haven't already:

1. Go to [https://stripe.com](https://stripe.com)
2. Create an account
3. Get your API keys from Dashboard → Developers → API keys
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### 2. Configure Firebase Cloud Functions

Set your Stripe keys in Firebase Functions config:

```bash
# Set Stripe secret key
firebase functions:config:set stripe.secret="sk_test_YOUR_SECRET_KEY_HERE"

# Set Stripe webhook secret (we'll get this in step 4)
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"
```

To view your current config:
```bash
firebase functions:config:get
```

### 3. Deploy Cloud Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific functions only
firebase deploy --only functions:createCheckoutSession,functions:stripeWebhook
```

After deployment, you'll get URLs like:
```
Function URL (createCheckoutSession): https://us-central1-YOUR-PROJECT.cloudfunctions.net/createCheckoutSession
Function URL (stripeWebhook): https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook
```

### 4. Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL:
   ```
   https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook
   ```
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.deleted` (for future subscription support)
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Update Firebase config with webhook secret:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"
   ```
8. Redeploy functions:
   ```bash
   firebase deploy --only functions:stripeWebhook
   ```

### 5. Deploy Frontend Files

Deploy the updated frontend files:

```bash
# Deploy hosting
firebase deploy --only hosting

# Or deploy everything at once
firebase deploy
```

### 6. Test the Payment Flow

#### Test in Stripe Test Mode

Use Stripe test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

#### Testing Steps

1. **Log in as a free user** (not in authorized list)
2. **Go to free dashboard**: `/free-dashboard.html`
3. **Click "Upgrade to Premium - $9.99"**
4. **Verify modal appears** with premium features
5. **Click "Upgrade Now"**
6. **Verify redirect to Stripe Checkout**
7. **Enter test card**: `4242 4242 4242 4242`
8. **Complete payment**
9. **Verify redirect to success page**: `/premium-success.html`
10. **Check Firestore** - user document should have `isPremium: true`
11. **Try accessing premium page** - should now work!

#### Verify in Stripe Dashboard

1. Go to Stripe Dashboard → Payments
2. See the $9.99 payment
3. Click on it to view details
4. Verify metadata includes user ID

#### Verify in Firebase

1. Go to Firestore → `users` collection
2. Find the user document
3. Should have:
   ```javascript
   {
     isPremium: true,
     membershipLevel: "premium",
     stripeCustomerId: "cus_...",
     lastPaymentDate: <timestamp>,
     paymentAmount: 9.99
   }
   ```

---

## 📁 Files Modified/Created

### Cloud Functions
- **`functions/index.js`**
  - Added `createCheckoutSession` - Creates Stripe checkout
  - Updated `stripeWebhook` - Handles payment completion

### Client-Side JavaScript
- **`js/premium-checkout.js`** ✨ NEW
  - Handles checkout button clicks
  - Calls Cloud Function
  - Shows loading states
  - Error handling

### HTML Pages
- **`free-dashboard.html`** - Updated upgrade button
- **`premium-success.html`** ✨ NEW - Payment success page

### Documentation
- **`SECURITY-FIX-README.md`** - Security system docs
- **`STRIPE-PAYMENT-SETUP.md`** - This file

---

## 🔧 Configuration Options

### Change Price

To change the price from $9.99 to something else:

1. Open `functions/index.js`
2. Find line ~156:
   ```javascript
   unit_amount: 999, // $9.99 in cents
   ```
3. Change to your desired price in cents (e.g., `1999` for $19.99)
4. Redeploy functions:
   ```bash
   firebase deploy --only functions:createCheckoutSession
   ```
5. Update the button text in `free-dashboard.html` to match

### Change Product Name/Description

In `functions/index.js` around line 149-154:
```javascript
product_data: {
  name: 'Divine Temple Premium Membership',
  description: 'Lifetime access to all premium features',
  images: ['https://i.imgur.com/divine-temple-logo.png']
},
```

### Change Success/Cancel URLs

The URLs are set dynamically based on your domain. To customize:

In `functions/index.js` around line 161-162:
```javascript
success_url: `${data.successUrl || 'https://your-domain.com/success'}?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: data.cancelUrl || 'https://your-domain.com/free-dashboard',
```

---

## 🐛 Troubleshooting

### "Stripe configuration is missing"

**Problem**: Cloud Functions can't find Stripe keys

**Solution**:
```bash
# Verify config
firebase functions:config:get

# Set keys if missing
firebase functions:config:set stripe.secret="sk_test_..."
firebase deploy --only functions
```

### "Payment succeeded but user still not premium"

**Problem**: Webhook not processing correctly

**Solutions**:
1. Check Stripe Dashboard → Developers → Webhooks
2. Click on your webhook
3. Click "Send test webhook" → `checkout.session.completed`
4. Check Firebase Functions logs:
   ```bash
   firebase functions:log
   ```
5. Verify webhook secret is correct:
   ```bash
   firebase functions:config:get
   ```

### "checkout.session.completed sent but no user ID"

**Problem**: Session doesn't have user metadata

**Solution**: Check that `client_reference_id` is being set in `createCheckoutSession` function

### Button doesn't appear or is disabled

**Problem**: Premium checkout script not loading or user already premium

**Solutions**:
1. Check browser console for errors
2. Verify `js/premium-checkout.js` is loaded
3. Check if user already has premium access
4. Clear browser cache and try again

### Webhook signature verification failed

**Problem**: Webhook secret doesn't match

**Solution**:
1. Get the correct webhook secret from Stripe Dashboard
2. Update Firebase config:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_..."
   firebase deploy --only functions:stripeWebhook
   ```

---

## 💳 Going Live (Production)

### Before Going Live

1. **Get Production Stripe Keys**
   - Go to Stripe Dashboard
   - Toggle from "Test mode" to "Live mode"
   - Get new API keys (start with `pk_live_` and `sk_live_`)

2. **Update Firebase Config with Live Keys**
   ```bash
   firebase functions:config:set stripe.secret="sk_live_YOUR_LIVE_SECRET"
   ```

3. **Create New Live Webhook**
   - In Stripe Dashboard (Live mode) → Webhooks
   - Add endpoint with your production URL
   - Get new webhook secret (starts with `whsec_`)
   - Update config:
     ```bash
     firebase functions:config:set stripe.webhook_secret="whsec_LIVE_SECRET"
     ```

4. **Redeploy Functions**
   ```bash
   firebase deploy --only functions
   ```

5. **Test with Real Card** (small amount first!)
   - Use your own card
   - Test the full flow
   - Verify everything works

### Security Checklist

- [ ] Stripe webhook endpoint uses HTTPS
- [ ] Webhook signature verification is working
- [ ] User authentication is enforced
- [ ] Firestore rules prevent unauthorized access
- [ ] Cloud Functions validate user before creating session
- [ ] Success page only accessible after payment
- [ ] Authorized users in hardcoded list can't purchase (already have access)

---

## 📊 Monitoring

### View Payments in Stripe

1. Stripe Dashboard → Payments
2. See all transactions
3. Filter by status, amount, date, etc.

### View Premium Users in Firestore

1. Firebase Console → Firestore
2. `users` collection
3. Filter by `isPremium == true`

### Monitor Cloud Functions

```bash
# View logs
firebase functions:log

# View logs for specific function
firebase functions:log --only createCheckoutSession

# Real-time logs
firebase functions:log --follow
```

### Check Webhook Events

1. Stripe Dashboard → Developers → Webhooks
2. Click on your webhook
3. View all events and their responses

---

## 🎯 User Experience

### For Free Users

1. See upgrade button on dashboard
2. Click to see modal with features and price
3. Click "Upgrade Now"
4. Redirect to Stripe (secure, professional)
5. Enter card details
6. Redirect back to success page
7. Immediately have premium access

### For Premium Users

- Upgrade button is hidden
- No need to see payment options
- Full access to all features

### For Authorized Users

- Already have premium (from hardcoded list)
- Cannot purchase (would error)
- Upgrade button hidden

---

## 🔮 Future Enhancements

### Subscription Model

Current: One-time $9.99 payment
Future: Monthly/Yearly subscriptions

To implement:
1. Change `mode: 'payment'` to `mode: 'subscription'`
2. Create Stripe Products and Prices
3. Update webhook to handle recurring payments
4. Add cancellation flow

### Multiple Tiers

- Basic: $4.99
- Premium: $9.99
- Elite: $19.99

### Promo Codes

Add Stripe coupon support in checkout session

### Refunds

Implement refund flow via Stripe API

---

## 📞 Support

### For Developers

- Check Firebase Functions logs
- Check Stripe webhook logs
- Review Firestore rules
- Test with Stripe test cards

### For Users

If payment fails:
1. Check card details are correct
2. Try different card
3. Contact your bank
4. Contact support: edenconsciousnesssdt@gmail.com

---

**Last Updated**: 2025-11-18
**Status**: ✅ Ready for Testing
**Next Step**: Deploy and test with Stripe test mode
