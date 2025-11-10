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