// Stripe Integration Module for Eden Consciousness Premium
// Initialize Stripe with publishable key
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');

// Stripe Payment Configuration
const STRIPE_CONFIG = {
  priceId: 'price_YOUR_MONTHLY_PRICE_ID', // $9.99/month
  productName: 'Eden Consciousness Premium',
  productDescription: 'Unlimited access to 4-phase transformation journey',
  successUrl: 'https://sacred-community.web.app/premium-success.html',
  cancelUrl: 'https://sacred-community.web.app/pricing.html',
  currency: 'usd',
  amount: 999, // $9.99 in cents
};

// Initialize Stripe Elements
const elements = stripe.elements();
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#D4AF37',
      '::placeholder': {
        color: '#999'
      }
    }
  }
});

// Mount card element (if form exists)
if (document.getElementById('card-element')) {
  cardElement.mount('#card-element');
}

// Handle card errors
if (cardElement) {
  cardElement.addEventListener('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
}

// Redirect to Stripe Checkout for subscription
async function startPremiumCheckout() {
  try {
    // Show loading state
    const button = document.querySelector('.premium-checkout-btn');
    if (button) button.disabled = true;

    // Create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: STRIPE_CONFIG.priceId,
        successUrl: STRIPE_CONFIG.successUrl,
        cancelUrl: STRIPE_CONFIG.cancelUrl
      })
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      alert('Payment error: ' + result.error.message);
      if (button) button.disabled = false;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Payment processing failed. Please try again.');
  }
}

// Process card payment (for one-time payments)
async function processCardPayment() {
  try {
    const form = document.getElementById('payment-form');
    if (!form) return;

    const button = form.querySelector('button');
    button.disabled = true;

    const { token } = await stripe.createToken(cardElement);

    if (token.error) {
      document.getElementById('card-errors').textContent = token.error.message;
      button.disabled = false;
      return;
    }

    // Send token to backend for processing
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token.id,
        amount: STRIPE_CONFIG.amount,
        currency: STRIPE_CONFIG.currency,
        description: STRIPE_CONFIG.productDescription
      })
    });

    const result = await response.json();

    if (result.success) {
      // Payment successful
      gtag('event', 'purchase', {
        'value': STRIPE_CONFIG.amount / 100,
        'currency': STRIPE_CONFIG.currency
      });
      window.location.href = STRIPE_CONFIG.successUrl;
    } else {
      document.getElementById('card-errors').textContent = result.error;
      button.disabled = false;
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    document.getElementById('card-errors').textContent = 'Payment failed. Please try again.';
  }
}

// Verify premium subscription status
async function checkPremiumStatus() {
  try {
    const user = firebase.auth().currentUser;
    if (!user) return false;

    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    return userDoc.data()?.premium || false;
  } catch (error) {
    console.error('Premium check error:', error);
    return false;
  }
}

// Set up premium user in Firestore after successful payment
async function markUserAsPremium(userId) {
  try {
    await firebase.firestore().collection('users').doc(userId).update({
      premium: true,
      premiumStartDate: new Date(),
      premiumStatus: 'active'
    });
    console.log('User marked as premium');
  } catch (error) {
    console.error('Error marking user as premium:', error);
  }
}

// Handle webhook for payment confirmation (backend)
// POST /api/webhook
// Listen for checkout.session.completed event
// Verify payment status and update Firestore

// Upgrade user to premium from modal
function showPremiumUpgradeModal() {
  const modal = document.createElement('div');
  modal.id = 'premium-upgrade-modal';
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
      <div style="background: #2D1B4E; padding: 2rem; border-radius: 12px; border: 1px solid #D4AF37; max-width: 500px; text-align: center;">
        <h2 style="color: #D4AF37; margin-bottom: 1rem;">Unlock Premium Access</h2>
        <p style="color: #bbb; margin-bottom: 1.5rem;">Join 1000+ members experiencing the full consciousness transformation</p>
        <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <p style="color: #D4AF37; font-size: 2rem; font-weight: bold; margin: 0;">$9.99<span style="font-size: 1rem;">/month</span></p>
          <p style="color: #999; margin: 0.5rem 0 0 0;">Cancel anytime • No commitment</p>
        </div>
        <button onclick="startPremiumCheckout()" style="background: #D4AF37; color: #2D1B4E; border: none; padding: 1rem 2rem; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; margin-bottom: 1rem; font-size: 1rem;">Start Premium Access</button>
        <button onclick="document.getElementById('premium-upgrade-modal').remove()" style="background: transparent; color: #D4AF37; border: 1px solid #D4AF37; padding: 0.75rem 2rem; border-radius: 8px; cursor: pointer; width: 100%; font-size: 0.95rem;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Auto-show upgrade prompt for free users trying premium features
function checkFeatureAccess(feature) {
  const user = firebase.auth().currentUser;
  if (!user) {
    window.location.href = 'members-new.html';
    return false;
  }

  checkPremiumStatus().then(isPremium => {
    if (!isPremium && ['quests', 'meditation', 'ai-guide', 'study-groups'].includes(feature)) {
      showPremiumUpgradeModal();
      return false;
    }
  });

  return true;
}

console.log('Stripe integration loaded');
