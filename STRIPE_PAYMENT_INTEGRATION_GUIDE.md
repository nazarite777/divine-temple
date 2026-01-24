# Stripe Payment Integration - Complete Setup Guide

## Overview
This guide provides complete instructions for setting up automated Stripe payment processing that upgrades users to premium memberships automatically.

---

## ✅ What's Already Implemented

### 1. Cloud Functions (functions/index.js)
The following Stripe integration functions have been added:

- **`createCheckoutSession`** - Creates Stripe checkout for user upgrades
- **`stripeWebhook`** - Handles all Stripe payment events
- **`getSubscriptionStatus`** - Checks user's current subscription
- **`cancelSubscription`** - Allows users to cancel subscriptions

### 2. Webhook Event Handlers
- `checkout.session.completed` → Upgrades user to premium
- `customer.subscription.created` → Tracks subscription creation
- `customer.subscription.updated` → Updates subscription status
- `customer.subscription.deleted` → Downgrades user to free
- `invoice.payment_succeeded` → Confirms payment success
- `invoice.payment_failed` → Handles payment failures

---

## 🚀 Setup Instructions

### Step 1: Create Stripe Products & Prices

1. Go to https://dashboard.stripe.com/products
2. Create 3 products:

**Premium Monthly:**
- Name: Divine Temple Premium
- Price: $29.99/month
- Recurring: Monthly
- Copy the **Price ID** (starts with `price_...`)

**Elite Monthly:**
- Name: Divine Temple Elite
- Price: $99.99/month
- Recurring: Monthly
- Copy the **Price ID**

**Founding Member (Lifetime):**
- Name: Divine Temple Founding Member
- Price: $499
- One-time payment
- Copy the **Price ID**

---

### Step 2: Configure Firebase Functions

1. Set Stripe API keys:
```bash
firebase functions:config:set stripe.secret_key="sk_live_YOUR_SECRET_KEY"
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"
```

2. Set Price IDs:
```bash
firebase functions:config:set stripe.price_premium="price_YOUR_PREMIUM_ID"
firebase functions:config:set stripe.price_elite="price_YOUR_ELITE_ID"
firebase functions:config:set stripe.price_founding="price_YOUR_FOUNDING_ID"
```

3. Update package.json if needed:
```bash
cd functions
npm install stripe
```

---

### Step 3: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

This deploys:
- `createCheckoutSession`
- `stripeWebhook`
- `getSubscriptionStatus`
- `cancelSubscription`

---

### Step 4: Set Up Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. Endpoint URL: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/stripeWebhook`
4. Select events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add it to Firebase config:
```bash
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_SECRET"
```

---

### Step 5: Client-Side Integration

Create `js/payment-integration.js`:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_PUBLISHABLE_KEY';
let stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

async function startCheckout(tier) {
    const createCheckout = firebase.functions().httpsCallable('createCheckoutSession');

    const result = await createCheckout({
        tier: tier, // 'premium', 'elite', or 'founding'
        successUrl: `${window.location.origin}/payment-success.html`,
        cancelUrl: `${window.location.origin}/free-dashboard.html`
    });

    await stripe.redirectToCheckout({ sessionId: result.data.sessionId });
}
```

---

### Step 6: Add Payment Buttons

Update `free-dashboard.html` to include upgrade buttons:

```html
<!-- Load Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>
<script src="js/payment-integration.js"></script>

<!-- Pricing Section -->
<div class="pricing-cards">
    <div class="pricing-card">
        <h3>Premium</h3>
        <div class="price">$29.99/month</div>
        <button onclick="startCheckout('premium')">
            Upgrade to Premium
        </button>
    </div>

    <div class="pricing-card">
        <h3>Elite</h3>
        <div class="price">$99.99/month</div>
        <button onclick="startCheckout('elite')">
            Upgrade to Elite
        </button>
    </div>

    <div class="pricing-card">
        <h3>Founding Member</h3>
        <div class="price">$499 (Lifetime)</div>
        <button onclick="startCheckout('founding')">
            Become a Founding Member
        </button>
    </div>
</div>
```

---

### Step 7: Create Success Page

Create `payment-success.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Payment Successful - Divine Temple</title>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="js/firebase-config.js"></script>
</head>
<body>
    <div class="success-container">
        <div class="success-icon">✅</div>
        <h1>Welcome to Premium!</h1>
        <p>Your payment was successful. Your account has been upgraded.</p>
        <p>Redirecting to members area...</p>
    </div>

    <script>
        // Wait 3 seconds then redirect
        setTimeout(() => {
            window.location.href = '/members-new.html';
        }, 3000);
    </script>
</body>
</html>
```

---

## 🔄 How It Works

### User Upgrade Flow:

1. **User clicks "Upgrade to Premium"**
2. Client calls `createCheckoutSession` Cloud Function
3. Function creates Stripe checkout session
4. User redirected to Stripe Checkout page
5. User enters payment info and completes purchase
6. Stripe sends `checkout.session.completed` webhook
7. Cloud Function receives webhook
8. Function updates Firestore: `membershipLevel: 'premium'`
9. User redirected to success page
10. **Access control automatically grants premium access!**

### What Gets Updated in Firestore:

```javascript
// users/{userId} document gets updated:
{
    membershipLevel: 'premium',      // Enables access
    subscriptionId: 'sub_xxx',       // Stripe subscription ID
    customerId: 'cus_xxx',           // Stripe customer ID
    upgradedAt: Timestamp,           // When upgraded
    paymentStatus: 'paid',           // Payment status
    tier: 'premium'                  // Tier name
}
```

---

## 🧪 Testing

### Test Mode Setup:
1. Use Stripe test keys: `pk_test_...` and `sk_test_...`
2. Test webhook with Stripe CLI:
```bash
stripe listen --forward-to localhost:5001/YOUR_PROJECT/us-central1/stripeWebhook
```

### Test Cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

---

## 📊 Monitoring

### View Logs:
```bash
firebase functions:log
```

### Check Firestore:
1. Go to Firebase Console → Firestore
2. Check `users` collection for `membershipLevel` updates
3. Check `payments` collection for payment records

### Stripe Dashboard:
1. View all payments: https://dashboard.stripe.com/payments
2. View subscriptions: https://dashboard.stripe.com/subscriptions
3. View webhook logs: https://dashboard.stripe.com/webhooks

---

## 🔧 Subscription Management

Users can manage their subscription:

```javascript
// Get subscription status
const getStatus = firebase.functions().httpsCallable('getSubscriptionStatus');
const status = await getStatus();

// Cancel subscription
const cancelSub = firebase.functions().httpsCallable('cancelSubscription');
await cancelSub();
```

---

## 🛡️ Security Features

✅ **User authentication required** - All functions check auth
✅ **Webhook signature verification** - Prevents fake webhooks
✅ **Server-side validation** - Can't bypass client-side
✅ **Firestore rules** - Secure database access
✅ **Automatic downgrades** - Cancelled subscriptions handled

---

## 📧 Email Notifications

The system queues welcome emails in Firestore `mail` collection.

To send emails, install Firebase Email Extension:
```bash
firebase ext:install firebase/firestore-send-email
```

---

## 🚨 Troubleshooting

### "Checkout session failed"
- Check Stripe API keys are set correctly
- Verify Price IDs match your Stripe products
- Check Cloud Function logs

### "User not upgraded after payment"
- Check webhook is receiving events
- Verify webhook secret is correct
- Check Cloud Function logs for errors

### "Access still restricted"
- Clear browser cache
- Re-login to refresh `membershipLevel`
- Check Firestore user document

---

## 📝 Next Steps

1. ✅ Deploy Cloud Functions
2. ✅ Configure Stripe webhook
3. ✅ Add payment buttons to UI
4. ✅ Create success/cancel pages
5. ✅ Test with Stripe test mode
6. ✅ Switch to live keys for production

---

## 🎯 Complete Example: Upgrade Button

```html
<button id="upgradeToPremium" class="upgrade-btn">
    💎 Upgrade to Premium - $29.99/month
</button>

<script>
document.getElementById('upgradeToPremium').addEventListener('click', async () => {
    if (!firebase.auth().currentUser) {
        alert('Please log in first');
        return;
    }

    try {
        const stripe = Stripe('pk_live_YOUR_KEY');
        const createCheckout = firebase.functions().httpsCallable('createCheckoutSession');

        const result = await createCheckout({
            tier: 'premium',
            successUrl: window.location.origin + '/payment-success.html',
            cancelUrl: window.location.origin + '/free-dashboard.html'
        });

        await stripe.redirectToCheckout({
            sessionId: result.data.sessionId
        });

    } catch (error) {
        alert('Error: ' + error.message);
    }
});
</script>
```

---

## 💡 Summary

**The payment flow is now fully automated:**

1. User pays → Stripe processes payment
2. Webhook fires → Cloud Function updates Firestore
3. `membershipLevel` changes → Access control grants access
4. **User gets instant premium access!**

No manual intervention needed. Everything happens automatically! 🎉
