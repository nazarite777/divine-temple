const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
    admin.initializeApp();
}

// OpenAI Chat Completion Proxy
exports.chatWithAI = functions.https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'User must be authenticated to use AI chat'
        );
    }

    const { message, conversationHistory = [] } = data;

    // Validate input
    if (!message || typeof message !== 'string') {
        throw new functions.https.HttpsError(
            'invalid-argument', 
            'Message is required and must be a string'
        );
    }

    // Rate limiting (prevent abuse)
    const userId = context.auth.uid;
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);

    try {
        // Check rate limit (max 20 messages per hour per user)
        const recentMessages = await admin.firestore()
            .collection('aiChatLogs')
            .where('userId', '==', userId)
            .where('timestamp', '>', new Date(hourAgo))
            .get();

        if (recentMessages.size >= 20) {
            throw new functions.https.HttpsError(
                'resource-exhausted',
                'Rate limit exceeded. Please wait before sending more messages.'
            );
        }

        // Make request to OpenAI
        const fetch = require('node-fetch');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${functions.config().openai.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Cheaper and faster than GPT-4
                messages: [
                    {
                        role: 'system',
                        content: `You are Sophia, a wise and compassionate spiritual guide for Divine Temple, a sacred space for consciousness expansion and spiritual growth. You help seekers on their journey of remembering their divine nature.

Key guidelines:
- Be warm, wise, and encouraging
- Reference spiritual concepts like chakras, meditation, energy healing
- Encourage spiritual practices and self-reflection
- Keep responses focused on spiritual growth and consciousness
- Be inclusive of all spiritual paths
- If asked about non-spiritual topics, gently redirect to spiritual wisdom
- Keep responses concise but meaningful (under 300 words)
- End with an encouraging question or spiritual insight

Your purpose is to guide souls back to their divine essence and support their spiritual awakening journey.`
                    },
                    ...conversationHistory.slice(-8), // Keep last 8 messages for context
                    { role: 'user', content: message }
                ],
                max_tokens: 300,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            throw new functions.https.HttpsError(
                'internal',
                'AI service temporarily unavailable'
            );
        }

        const aiResponse = await response.json();
        const aiMessage = aiResponse.choices[0].message.content;

        // Log the interaction (for rate limiting and analytics)
        await admin.firestore().collection('aiChatLogs').add({
            userId: userId,
            userMessage: message,
            aiResponse: aiMessage,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            tokensUsed: aiResponse.usage?.total_tokens || 0
        });

        // Award XP for using AI chat (10 XP per message, max 100 XP per day)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayChats = await admin.firestore()
            .collection('aiChatLogs')
            .where('userId', '==', userId)
            .where('timestamp', '>=', todayStart)
            .get();

        if (todayChats.size <= 10) { // Max 10 XP rewards per day
            const userProgressRef = admin.firestore()
                .collection('userProgress')
                .doc(userId);
            
            await userProgressRef.set({
                xp: admin.firestore.FieldValue.increment(10),
                lastAIChatXP: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        return {
            success: true,
            message: aiMessage,
            tokensUsed: aiResponse.usage?.total_tokens || 0
        };

    } catch (error) {
        console.error('AI Chat Error:', error);
        
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        
        // Return fallback response for any other errors
        return {
            success: false,
            message: "I'm experiencing some technical difficulties right now. In the meantime, I encourage you to spend a few moments in quiet reflection or meditation. Sometimes the answers we seek come from within when we create space for silence. 🙏✨",
            fallback: true
        };
    }
});

// Health check endpoint
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            firebase: 'operational',
            functions: 'operational'
        }
    });
});

// Update subscriber count (runs every hour)
exports.updateSubscriberCount = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
    try {
        const db = admin.firestore();

        // Count users from userProgress collection (more accurate for active members)
        const userProgressSnapshot = await db.collection('userProgress').count().get();
        const totalMembers = userProgressSnapshot.data().count;

        // Update stats collection
        await db.collection('stats').doc('globalStats').set({
            totalMembers: totalMembers,
            totalSubscribers: totalMembers, // Same as members for now
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`✅ Subscriber count updated: ${totalMembers} members`);
        return null;
    } catch (error) {
        console.error('❌ Error updating subscriber count:', error);
        return null;
    }
});

// Manually trigger subscriber count update (callable function)
exports.refreshSubscriberCount = functions.https.onCall(async (data, context) => {
    try {
        const db = admin.firestore();

        // Count users from userProgress collection
        const userProgressSnapshot = await db.collection('userProgress').count().get();
        const totalMembers = userProgressSnapshot.data().count;

        // Update stats collection
        await db.collection('stats').doc('globalStats').set({
            totalMembers: totalMembers,
            totalSubscribers: totalMembers,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`✅ Subscriber count manually refreshed: ${totalMembers} members`);

        return {
            success: true,
            totalMembers: totalMembers,
            message: `Subscriber count updated: ${totalMembers} members`
        };
    } catch (error) {
        console.error('❌ Error refreshing subscriber count:', error);
        throw new functions.https.HttpsError('internal', 'Failed to refresh subscriber count');
    }
});

// ==================== STRIPE PAYMENT INTEGRATION ====================

const stripe = require('stripe')(functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY);

/**
 * Create Stripe Checkout Session
 * Called from client when user clicks "Upgrade to Premium"
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated to create checkout session'
        );
    }

    const userId = context.auth.uid;
    const { tier, successUrl, cancelUrl } = data;

    // Validate tier
    const validTiers = ['premium', 'elite', 'founding'];
    if (!validTiers.includes(tier)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Invalid membership tier'
        );
    }

    // Get user data
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
        throw new functions.https.HttpsError(
            'not-found',
            'User data not found'
        );
    }

    // Define pricing for each tier (price IDs from Stripe Dashboard)
    const priceIds = {
        premium: functions.config().stripe?.price_premium || process.env.STRIPE_PRICE_PREMIUM || 'price_premium_monthly',
        elite: functions.config().stripe?.price_elite || process.env.STRIPE_PRICE_ELITE || 'price_elite_monthly',
        founding: functions.config().stripe?.price_founding || process.env.STRIPE_PRICE_FOUNDING || 'price_founding_lifetime'
    };

    try {
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: tier === 'founding' ? 'payment' : 'subscription',
            client_reference_id: userId,
            customer_email: userData.email,
            metadata: {
                userId: userId,
                tier: tier,
                displayName: userData.displayName || 'Member'
            },
            line_items: [
                {
                    price: priceIds[tier],
                    quantity: 1
                }
            ],
            success_url: successUrl || `https://your-domain.com/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `https://your-domain.com/free-dashboard.html?payment=cancelled`
        });

        console.log(`Checkout session created for user ${userId}, tier: ${tier}`);
        return { sessionId: session.id };

    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Failed to create checkout session: ' + error.message
        );
    }
});

/**
 * Stripe Webhook Handler
 * Processes payment events from Stripe
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`Received Stripe event: ${event.type}`);

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;

            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Webhook processing failed');
    }
});

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session) {
    const userId = session.client_reference_id || session.metadata.userId;
    const tier = session.metadata.tier;

    if (!userId) {
        console.error('No user ID in checkout session');
        return;
    }

    console.log(`Processing checkout completion for user ${userId}, tier: ${tier}`);

    try {
        // Update user's membership in Firestore
        await admin.firestore().collection('users').doc(userId).update({
            membershipLevel: tier,
            subscriptionId: session.subscription || null,
            customerId: session.customer,
            upgradedAt: admin.firestore.FieldValue.serverTimestamp(),
            paymentStatus: 'paid',
            tier: tier
        });

        // Create payment record
        await admin.firestore().collection('payments').add({
            userId: userId,
            sessionId: session.id,
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency,
            tier: tier,
            status: 'completed',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Send welcome email (if email functions are set up)
        await sendWelcomeEmail(userId, tier);

        console.log(`✅ User ${userId} upgraded to ${tier}`);

    } catch (error) {
        console.error('Error handling checkout completion:', error);
    }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
    const userId = subscription.metadata.userId;

    if (!userId) {
        console.error('No user ID in subscription metadata');
        return;
    }

    console.log(`Subscription created for user ${userId}`);

    try {
        await admin.firestore().collection('users').doc(userId).update({
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        });
    } catch (error) {
        console.error('Error handling subscription created:', error);
    }
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription) {
    const customerId = subscription.customer;

    try {
        // Find user by customer ID
        const usersSnapshot = await admin.firestore()
            .collection('users')
            .where('customerId', '==', customerId)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            console.error('No user found for customer:', customerId);
            return;
        }

        const userDoc = usersSnapshot.docs[0];

        await userDoc.ref.update({
            subscriptionStatus: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        });

        console.log(`Subscription updated for customer ${customerId}`);

    } catch (error) {
        console.error('Error handling subscription updated:', error);
    }
}

/**
 * Handle subscription deleted/cancelled
 */
async function handleSubscriptionDeleted(subscription) {
    const customerId = subscription.customer;

    try {
        // Find user by customer ID
        const usersSnapshot = await admin.firestore()
            .collection('users')
            .where('customerId', '==', customerId)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            console.error('No user found for customer:', customerId);
            return;
        }

        const userDoc = usersSnapshot.docs[0];

        // Downgrade to free tier
        await userDoc.ref.update({
            membershipLevel: 'free',
            subscriptionStatus: 'cancelled',
            subscriptionId: null,
            downgradedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`User downgraded to free tier: customer ${customerId}`);

    } catch (error) {
        console.error('Error handling subscription deleted:', error);
    }
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice) {
    const customerId = invoice.customer;

    try {
        const usersSnapshot = await admin.firestore()
            .collection('users')
            .where('customerId', '==', customerId)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            console.error('No user found for customer:', customerId);
            return;
        }

        const userDoc = usersSnapshot.docs[0];

        await userDoc.ref.update({
            paymentStatus: 'paid',
            lastPaymentDate: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Payment succeeded for customer ${customerId}`);

    } catch (error) {
        console.error('Error handling payment succeeded:', error);
    }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice) {
    const customerId = invoice.customer;

    try {
        const usersSnapshot = await admin.firestore()
            .collection('users')
            .where('customerId', '==', customerId)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            console.error('No user found for customer:', customerId);
            return;
        }

        const userDoc = usersSnapshot.docs[0];

        await userDoc.ref.update({
            paymentStatus: 'failed',
            paymentFailedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Send payment failed notification email
        console.log(`⚠️ Payment failed for customer ${customerId}`);

    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}

/**
 * Send welcome email to new premium member
 */
async function sendWelcomeEmail(userId, tier) {
    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();

        if (!userData || !userData.email) {
            console.log('No email found for user');
            return;
        }

        // Queue email for sending
        await admin.firestore().collection('mail').add({
            to: userData.email,
            template: {
                name: 'premium-welcome',
                data: {
                    displayName: userData.displayName || 'Member',
                    tier: tier,
                    upgradeDate: new Date().toLocaleDateString()
                }
            }
        });

        console.log(`Welcome email queued for ${userData.email}`);

    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}

/**
 * Get user's subscription status
 * Callable function for client to check subscription
 */
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated'
        );
    }

    const userId = context.auth.uid;

    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();

        if (!userData) {
            throw new functions.https.HttpsError('not-found', 'User not found');
        }

        return {
            membershipLevel: userData.membershipLevel || 'free',
            subscriptionStatus: userData.subscriptionStatus || null,
            subscriptionId: userData.subscriptionId || null,
            currentPeriodEnd: userData.currentPeriodEnd || null,
            paymentStatus: userData.paymentStatus || null
        };

    } catch (error) {
        console.error('Error getting subscription status:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

/**
 * Cancel subscription
 * Callable function for users to cancel their subscription
 */
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated'
        );
    }

    const userId = context.auth.uid;

    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();

        if (!userData || !userData.subscriptionId) {
            throw new functions.https.HttpsError(
                'failed-precondition',
                'No active subscription found'
            );
        }

        // Cancel subscription in Stripe
        await stripe.subscriptions.update(userData.subscriptionId, {
            cancel_at_period_end: true
        });

        // Update Firestore
        await admin.firestore().collection('users').doc(userId).update({
            subscriptionStatus: 'cancelling',
            cancelledAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Subscription cancelled for user ${userId}`);
        return { success: true, message: 'Subscription will cancel at period end' };

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});