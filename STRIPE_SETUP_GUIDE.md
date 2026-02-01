# Stripe Integration Setup for Eden Consciousness

## Prerequisites
- Stripe Account (https://stripe.com)
- Firebase Project with Cloud Functions enabled
- Node.js and Firebase CLI

## Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Publishable Key** (starts with `pk_`)
3. Copy **Secret Key** (starts with `sk_`) - KEEP SECRET!
4. Create a Price ID for $9.99/month subscription

## Step 2: Set Up Firebase Environment Variables

```bash
firebase functions:config:set stripe.secret="sk_YOUR_SECRET_KEY" stripe.webhook="whsec_YOUR_WEBHOOK_SECRET"
```

## Step 3: Deploy Cloud Functions

```bash
cd functions
npm install stripe
firebase deploy --only functions
```

## Step 4: Update Frontend Code

Replace placeholders in `js/stripe-integration.js`:
- `pk_test_YOUR_PUBLISHABLE_KEY` → Your Stripe Publishable Key
- `price_YOUR_MONTHLY_PRICE_ID` → Your $9.99/month Price ID

## Step 5: Configure Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://YOUR_FIREBASE_PROJECT.cloudfunctions.net/stripeWebhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy Webhook Secret and set in Firebase Functions config

## Step 6: Update Firestore Security Rules

```javascript
// Allow premium users to access premium features
match /premium-content/{document=**} {
  allow read: if request.auth.token.premium == true;
}

// Allow users to read their own data
match /users/{userId} {
  allow read: if request.auth.uid == userId;
  allow update: if request.auth.uid == userId;
}
```

## Step 7: Add Stripe.js to Pages

Add to `<head>` of any page using Stripe:
```html
<script src="https://js.stripe.com/v3/"></script>
<script src="/js/stripe-integration.js"></script>
```

## Testing

### Test Card Numbers
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Email
- Use any email (won't receive real emails)

## Deployment Checklist

- [ ] Stripe API keys configured in Firebase
- [ ] Cloud Functions deployed
- [ ] Webhook endpoint configured
- [ ] Frontend code updated with real keys
- [ ] Firestore security rules updated
- [ ] Testing completed with test cards
- [ ] Production keys configured (when ready)

## Key Files

- `js/stripe-integration.js` - Frontend payment handling
- `functions/stripe-webhook.js` - Backend payment processing
- `pricing.html` - Pricing page with checkout buttons

## Success Flow

1. User clicks "Start Premium Trial"
2. Redirects to Stripe Checkout
3. User enters payment info
4. Checkout confirms payment
5. Webhook fires and marks user as premium
6. User redirected to `premium-success.html`
7. User now has access to all premium features

## Troubleshooting

**Webhook not firing?**
- Verify endpoint URL is correct
- Check Firebase logs for errors
- Ensure webhook secret is correct

**User not marked premium?**
- Check Firestore document was created
- Verify email matches user record
- Check Cloud Function logs

**Payment button not working?**
- Verify Stripe key is correct
- Check browser console for errors
- Ensure Stripe.js is loaded

## Support

For Stripe help: https://support.stripe.com
For Firebase help: https://firebase.google.com/support
