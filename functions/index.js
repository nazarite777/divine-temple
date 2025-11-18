const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  // Get Stripe configuration
  const stripeConfig = functions.config().stripe;
  
  if (!stripeConfig || !stripeConfig.secret || !stripeConfig.webhook_secret) {
    console.error('Stripe configuration is missing');
    return res.status(500).send('Stripe configuration error');
  }
  
  const stripe = require('stripe')(stripeConfig.secret);
  const sig = req.headers['stripe-signature'];
  const endpointSecret = stripeConfig.webhook_secret;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({received: true});
});
