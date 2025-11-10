/**
 * 💬 Divine Temple AI Chatbot (OpenAI GPT-4)
 *
 * Features:
 * - Spiritual guidance and wisdom
 * - Question answering
 * - Meditation guidance
 * - Oracle card interpretations
 * - Daily inspiration
 * - Conversation history
 * - Context awareness
 * - Multi-language support
 */

class AIChatbot {
    constructor() {
        // Use Firebase Functions for secure API calls (no API key needed client-side!)
        this.apiEndpoint = null; // Will be set after Firebase loads
        this.conversationHistory = this.loadConversationHistory();
        this.systemPrompt = this.getSystemPrompt();
        this.isTyping = false;
        this.maxHistoryLength = 20;
        this.init();
    }

    init() {
        console.log('💬 AI Chatbot initialized');

        // Greet user if first time
        const hasGreeted = localStorage.getItem('chatbot_greeted');
        if (!hasGreeted) {
            this.addWelcomeMessage();
            localStorage.setItem('chatbot_greeted', 'true');
        }
    }

    getSystemPrompt() {
        return `You are a wise and compassionate spiritual guide for Divine Temple, a platform for spiritual growth and enlightenment. Your purpose is to:

1. Provide spiritual guidance and wisdom
2. Answer questions about meditation, chakras, energy healing, and spiritual practices
3. Offer encouragement and support on the spiritual journey
4. Interpret oracle cards and spiritual symbols
5. Share daily inspiration and affirmations
6. Guide users through meditation practices
7. Explain spiritual concepts in accessible ways

Your personality:
- Warm, compassionate, and non-judgmental
- Wise but not preachy
- Encouraging and supportive
- Respectful of all spiritual traditions
- Clear and accessible in explanations
- Patient and understanding

Guidelines:
- Keep responses concise (2-4 paragraphs)
- Use simple, accessible language
- Avoid being dogmatic or prescriptive
- Respect user's beliefs and experiences
- Offer practical guidance when appropriate
- Use emojis sparingly and meaningfully 🙏✨
- End responses with a thoughtful question when appropriate

Remember: You are a spiritual companion, not a medical or mental health professional. Suggest professional help when needed.`;
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('chatbot_conversation_history');
        return saved ? JSON.parse(saved) : [];
    }

    saveConversationHistory() {
        // Keep only last maxHistoryLength messages
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }

        localStorage.setItem('chatbot_conversation_history', JSON.stringify(this.conversationHistory));
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            role: 'assistant',
            content: '🙏 Welcome to Divine Temple! I\'m your spiritual guide and companion on this sacred journey.\n\nI\'m here to:\n• Answer your spiritual questions\n• Guide you through meditation\n• Offer daily wisdom and inspiration\n• Help interpret oracle cards\n• Provide support and encouragement\n\nWhat can I help you with today?',
            timestamp: Date.now()
        };

        this.conversationHistory.push(welcomeMessage);
        this.saveConversationHistory();
    }

    async sendMessage(userMessage) {
        if (!userMessage || userMessage.trim().length === 0) {
            return { success: false, message: 'Please enter a message' };
        }

        // Add user message to history
        const userMsg = {
            role: 'user',
            content: userMessage.trim(),
            timestamp: Date.now()
        };

        this.conversationHistory.push(userMsg);
        this.saveConversationHistory();

        // 🎯 AWARD XP for first message
        const messageCount = this.conversationHistory.filter(m => m.role === 'user').length;
        if (messageCount === 1 && window.progressSystem) {
            window.progressSystem.awardXP(10, 'Started conversation with AI guide', 'chatbot');
        }

        // Get AI response
        try {
            const response = await this.getAIResponse(userMessage);

            if (response.success) {
                // Add assistant message to history
                const assistantMsg = {
                    role: 'assistant',
                    content: response.message,
                    timestamp: Date.now()
                };

                this.conversationHistory.push(assistantMsg);
                this.saveConversationHistory();

                // Award XP milestones
                if (messageCount === 10 && window.progressSystem) {
                    window.progressSystem.awardXP(50, '10 conversations with AI guide! 🤖', 'chatbot');
                } else if (messageCount === 50 && window.progressSystem) {
                    window.progressSystem.awardXP(100, '50 conversations! Wisdom seeker! 🧠', 'chatbot');
                }

                return {
                    success: true,
                    message: response.message
                };
            }

            return response;

        } catch (error) {
            console.error('Error getting AI response:', error);

            // Fallback response
            const fallbackMsg = {
                role: 'assistant',
                content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment. 🙏',
                timestamp: Date.now()
            };

            this.conversationHistory.push(fallbackMsg);
            this.saveConversationHistory();

            return {
                success: false,
                message: fallbackMsg.content
            };
        }
    }

    async getAIResponse(userMessage) {
        // Check if user is authenticated
        if (!firebase.auth().currentUser) {
            return {
                success: false,
                message: "Please log in to chat with our AI spiritual guide. 🔐✨"
            };
        }

        try {
            // Get recent conversation history for context
            const recentHistory = this.conversationHistory.slice(-8).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Call secure Firebase Function (no API key needed client-side!)
            const chatFunction = firebase.functions().httpsCallable('chatWithAI');
            const response = await chatFunction({
                message: userMessage,
                conversationHistory: recentHistory
            });

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    tokensUsed: response.data.tokensUsed
                };
            } else {
                return {
                    success: false,
                    message: response.data.message
                };
            }

            throw new Error('Invalid API response');

        } catch (error) {
            console.error('OpenAI API error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    getFallbackResponse(userMessage) {
        // Smart fallback responses based on keywords
        const lowerMessage = userMessage.toLowerCase();

        // Meditation requests
        if (lowerMessage.includes('meditat')) {
            return {
                success: true,
                message: 'Meditation is a beautiful practice! 🧘\n\nHere\'s a simple technique to start:\n\n1. Find a quiet space and sit comfortably\n2. Close your eyes and take three deep breaths\n3. Focus on your breath flowing in and out\n4. When thoughts arise, gently return to your breath\n5. Start with 5-10 minutes daily\n\nWould you like guidance on a specific meditation technique?'
            };
        }

        // Chakra questions
        if (lowerMessage.includes('chakra')) {
            return {
                success: true,
                message: 'The chakra system is a powerful framework for understanding energy! 🌈\n\nThere are seven main chakras:\n• Root (Muladhara) - Grounding\n• Sacral (Svadhisthana) - Creativity\n• Solar Plexus (Manipura) - Power\n• Heart (Anahata) - Love\n• Throat (Vishuddha) - Communication\n• Third Eye (Ajna) - Intuition\n• Crown (Sahasrara) - Consciousness\n\nWhich chakra would you like to learn more about?'
            };
        }

        // Oracle/Tarot questions
        if (lowerMessage.includes('oracle') || lowerMessage.includes('tarot') || lowerMessage.includes('card')) {
            return {
                success: true,
                message: 'Oracle and tarot cards are wonderful tools for spiritual insight! ✨\n\nThey work by:\n• Tapping into your intuition\n• Reflecting your subconscious mind\n• Offering guidance and perspective\n• Sparking self-reflection\n\nWould you like to draw a card or learn about a specific spread?'
            };
        }

        // Gratitude/Affirmations
        if (lowerMessage.includes('grateful') || lowerMessage.includes('gratitude') || lowerMessage.includes('affirm')) {
            return {
                success: true,
                message: 'Gratitude is a powerful spiritual practice! 🙏\n\nHere are three simple ways to cultivate it:\n\n1. Morning gratitude: List 3 things you\'re grateful for\n2. Gratitude journal: Write daily appreciations\n3. Gratitude meditation: Feel thankfulness in your heart\n\nWhat are you grateful for today?'
            };
        }

        // Spiritual journey
        if (lowerMessage.includes('journey') || lowerMessage.includes('path') || lowerMessage.includes('start')) {
            return {
                success: true,
                message: 'Every spiritual journey is unique and sacred! ✨\n\nSome foundational practices:\n• Daily meditation (even 5 minutes)\n• Mindful breathing\n• Journaling insights\n• Spending time in nature\n• Practicing gratitude\n• Reading spiritual texts\n\nRemember: There\'s no "right" way. Trust your intuition and take it one step at a time.\n\nWhat aspect of spirituality calls to you most?'
            };
        }

        // General response
        return {
            success: true,
            message: 'Thank you for sharing that with me. 🙏\n\nI\'m here to support you on your spiritual journey. Whether you\'re seeking guidance on meditation, chakras, oracle cards, or any spiritual practice, I\'m happy to help.\n\nI can also offer:\n• Daily inspiration and wisdom\n• Meditation guidance\n• Spiritual insights\n• Encouragement and support\n\nWhat would you like to explore together?'
        };
    }

    getDailyInspiration() {
        const inspirations = [
            'The present moment is all you ever have. Be present, be awake, be here now. 🌅',
            'Your soul knows the way. Trust your inner guidance and follow your light. ✨',
            'Every breath is a gift. Every moment is an opportunity for awakening. 🧘',
            'You are not a drop in the ocean. You are the entire ocean in a drop. 🌊',
            'The universe is not outside of you. Look inside yourself; everything you want, you already are. ⭐',
            'Let go of what weighs you down. You are meant to soar. 🕊️',
            'Your spiritual journey is unique and perfect for you. Honor your path. 🌟',
            'In stillness, wisdom speaks. In silence, truth reveals itself. 🙏',
            'You are a divine being having a human experience. Remember your light. 💫',
            'Gratitude transforms what we have into enough. Give thanks for this moment. 🌸'
        ];

        return inspirations[Math.floor(Math.random() * inspirations.length)];
    }

    clearHistory() {
        this.conversationHistory = [];
        this.saveConversationHistory();

        // Reset greeted flag
        localStorage.removeItem('chatbot_greeted');

        return { success: true, message: 'Conversation history cleared' };
    }

    getConversationHistory() {
        return this.conversationHistory;
    }

    openChatModal() {
        const modal = document.createElement('div');
        modal.className = 'chatbot-modal';
        modal.id = 'chatbotModal';

        modal.innerHTML = `
            <div class="chatbot-modal-content">
                <div class="chatbot-modal-header">
                    <h2>💬 Spiritual Guide</h2>
                    <div class="chatbot-header-actions">
                        <button onclick="window.aiChatbot.clearHistory(); location.reload();" class="clear-btn" title="Clear History">
                            🔄
                        </button>
                        <button onclick="document.getElementById('chatbotModal').remove()" class="modal-close">✕</button>
                    </div>
                </div>

                <div class="chatbot-messages" id="chatbotMessages">
                    ${this.renderMessages()}
                </div>

                <div class="chatbot-input-area">
                    <input type="text" id="chatbotInput" placeholder="Ask me anything about spirituality..."
                           class="chatbot-input" onkeypress="if(event.key==='Enter') window.aiChatbot.sendMessageFromUI()">
                    <button onclick="window.aiChatbot.sendMessageFromUI()" class="chatbot-send-btn">
                        📨 Send
                    </button>
                </div>

                <div class="chatbot-quick-actions">
                    <button onclick="window.aiChatbot.sendQuickMessage('How do I meditate?')" class="quick-action-btn">
                        🧘 Meditation Guide
                    </button>
                    <button onclick="window.aiChatbot.sendQuickMessage('Tell me about chakras')" class="quick-action-btn">
                        🌈 Chakras
                    </button>
                    <button onclick="window.aiChatbot.sendQuickMessage('Give me daily inspiration')" class="quick-action-btn">
                        ✨ Daily Inspiration
                    </button>
                </div>
            </div>
        `;

        this.addChatbotStyles();
        document.body.appendChild(modal);

        // Auto-scroll to bottom
        setTimeout(() => {
            const messagesDiv = document.getElementById('chatbotMessages');
            if (messagesDiv) {
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }

            // Focus input
            document.getElementById('chatbotInput')?.focus();
        }, 100);
    }

    renderMessages() {
        if (this.conversationHistory.length === 0) {
            return '<p class="no-messages">Start a conversation with your spiritual guide!</p>';
        }

        return this.conversationHistory.map(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString();
            const isUser = msg.role === 'user';

            return `
                <div class="chat-message ${isUser ? 'user-message' : 'assistant-message'}">
                    <div class="message-content">
                        ${msg.content.replace(/\n/g, '<br>')}
                    </div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }).join('');
    }

    async sendMessageFromUI() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        // Clear input
        input.value = '';

        // Add user message to UI immediately
        this.addMessageToUI('user', message);

        // Show typing indicator
        this.showTypingIndicator();

        // Get AI response
        const response = await this.sendMessage(message);

        // Remove typing indicator
        this.hideTypingIndicator();

        // Add AI response to UI
        if (response.success) {
            this.addMessageToUI('assistant', response.message);
        }
    }

    async sendQuickMessage(message) {
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.value = message;
            await this.sendMessageFromUI();
        }
    }

    addMessageToUI(role, content) {
        const messagesDiv = document.getElementById('chatbotMessages');
        if (!messagesDiv) return;

        const time = new Date().toLocaleTimeString();
        const isUser = role === 'user';

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${isUser ? 'user-message' : 'assistant-message'}`;
        messageElement.innerHTML = `
            <div class="message-content">
                ${content.replace(/\n/g, '<br>')}
            </div>
            <div class="message-time">${time}</div>
        `;

        messagesDiv.appendChild(messageElement);

        // Auto-scroll
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    showTypingIndicator() {
        const messagesDiv = document.getElementById('chatbotMessages');
        if (!messagesDiv) return;

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        messagesDiv.appendChild(indicator);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    addChatbotStyles() {
        if (document.getElementById('chatbotStyles')) return;

        const style = document.createElement('style');
        style.id = 'chatbotStyles';
        style.textContent = `
            .chatbot-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .chatbot-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 700px;
                height: 80vh;
                max-height: 700px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .chatbot-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chatbot-modal-header h2 {
                margin: 0;
            }

            .chatbot-header-actions {
                display: flex;
                gap: 10px;
            }

            .clear-btn, .modal-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            }

            .clear-btn:hover, .modal-close:hover {
                background: rgba(255,255,255,0.3);
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f9f9f9;
            }

            .no-messages {
                text-align: center;
                color: #999;
                padding: 40px 20px;
            }

            .chat-message {
                margin-bottom: 15px;
                animation: slideIn 0.3s ease;
            }

            .user-message {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            .user-message .message-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                border-radius: 18px 18px 0 18px;
                max-width: 70%;
                word-wrap: break-word;
            }

            .assistant-message {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .assistant-message .message-content {
                background: white;
                color: #333;
                padding: 12px 16px;
                border-radius: 18px 18px 18px 0;
                max-width: 70%;
                word-wrap: break-word;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .message-time {
                font-size: 11px;
                color: #999;
                margin-top: 4px;
                padding: 0 8px;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }

            .typing-dots {
                background: white;
                padding: 12px 16px;
                border-radius: 18px 18px 18px 0;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                display: flex;
                gap: 4px;
            }

            .typing-dots span {
                width: 8px;
                height: 8px;
                background: #667eea;
                border-radius: 50%;
                animation: typingDot 1.4s infinite;
            }

            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typingDot {
                0%, 60%, 100% {
                    opacity: 0.3;
                    transform: scale(0.8);
                }
                30% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .chatbot-input-area {
                display: flex;
                gap: 10px;
                padding: 20px;
                background: white;
                border-top: 1px solid #e0e0e0;
            }

            .chatbot-input {
                flex: 1;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 25px;
                font-size: 15px;
                outline: none;
                transition: border-color 0.2s;
            }

            .chatbot-input:focus {
                border-color: #667eea;
            }

            .chatbot-send-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .chatbot-send-btn:hover {
                transform: scale(1.05);
            }

            .chatbot-quick-actions {
                display: flex;
                gap: 10px;
                padding: 0 20px 20px 20px;
                flex-wrap: wrap;
            }

            .quick-action-btn {
                padding: 8px 16px;
                border: 2px solid #667eea;
                background: white;
                color: #667eea;
                border-radius: 20px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                transition: all 0.2s;
            }

            .quick-action-btn:hover {
                background: #667eea;
                color: white;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 768px) {
                .chatbot-modal-content {
                    width: 100%;
                    height: 100vh;
                    max-height: none;
                    border-radius: 0;
                }

                .user-message .message-content,
                .assistant-message .message-content {
                    max-width: 85%;
                }
            }
        `;

        document.head.appendChild(style);
    }

    getStats() {
        return {
            totalMessages: this.conversationHistory.filter(m => m.role === 'user').length,
            totalConversations: this.conversationHistory.length,
            hasConversation: this.conversationHistory.length > 0
        };
    }
}

// Initialize the AI chatbot
if (typeof window !== 'undefined') {
    window.aiChatbot = new AIChatbot();
    console.log('💬 AI Chatbot ready!');
}
