/**
 * 💬 Divine Temple Member Chat System
 *
 * Features:
 * - 1-to-1 direct messaging between members
 * - Real-time message updates
 * - Conversation list with unread indicators
 * - Member search and discovery
 * - Message notifications
 * - Firebase integration for persistence
 */

class MemberChatSystem {
    constructor() {
        this.conversations = [];
        this.activeConversation = null;
        this.currentUser = null;
        this.useLocalStorage = false;
        this.messageListeners = [];
        this.init();
    }

    async init() {
        console.log('💬 Member Chat System initialized');

        // Check if Firebase is available
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('Firebase not available. Chat will use local storage only.');
            this.useLocalStorage = true;
        } else {
            this.useLocalStorage = false;
            await this.initFirebase();
        }
    }

    async initFirebase() {
        try {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0]
                    };

                    // Load user's conversations
                    await this.loadConversations();
                } else {
                    this.currentUser = null;
                    this.conversations = [];
                }
            });
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.useLocalStorage = true;
        }
    }

    async loadConversations() {
        if (this.useLocalStorage || !this.currentUser) return;

        try {
            const db = firebase.firestore();

            // Listen for conversations where user is a participant
            db.collection('conversations')
                .where('participants', 'array-contains', this.currentUser.uid)
                .orderBy('lastMessageAt', 'desc')
                .onSnapshot((snapshot) => {
                    this.conversations = [];
                    snapshot.forEach(doc => {
                        this.conversations.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });

                    // Update UI if conversation list is visible
                    this.renderConversationList();
                });

        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }

    async searchMembers(query = '') {
        if (this.useLocalStorage) {
            return { success: false, members: [] };
        }

        try {
            const db = firebase.firestore();

            // Get all users (limit to 50)
            const usersSnapshot = await db.collection('users')
                .limit(50)
                .get();

            let members = [];
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                // Don't include current user
                if (doc.id !== this.currentUser.uid) {
                    members.push({
                        uid: doc.id,
                        displayName: userData.displayName || userData.email?.split('@')[0] || 'User',
                        email: userData.email,
                        spiritualPath: userData.spiritualPath || 'Seeker',
                        photoURL: userData.photoURL || null
                    });
                }
            });

            // Filter by query if provided
            if (query) {
                const lowerQuery = query.toLowerCase();
                members = members.filter(m =>
                    m.displayName.toLowerCase().includes(lowerQuery) ||
                    (m.email && m.email.toLowerCase().includes(lowerQuery))
                );
            }

            return { success: true, members };

        } catch (error) {
            console.error('Error searching members:', error);
            return { success: false, members: [] };
        }
    }

    async getOrCreateConversation(otherUserId, otherUserName) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Chat requires Firebase' };
        }

        try {
            const db = firebase.firestore();

            // Generate consistent conversation ID (alphabetically sorted UIDs)
            const conversationId = [this.currentUser.uid, otherUserId].sort().join('_');

            // Check if conversation exists
            const convRef = db.collection('conversations').doc(conversationId);
            const convDoc = await convRef.get();

            if (!convDoc.exists) {
                // Create new conversation
                await convRef.set({
                    participants: [this.currentUser.uid, otherUserId],
                    participantNames: {
                        [this.currentUser.uid]: this.currentUser.displayName,
                        [otherUserId]: otherUserName
                    },
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastMessage: '',
                    unreadCount: {
                        [this.currentUser.uid]: 0,
                        [otherUserId]: 0
                    }
                });
            }

            return {
                success: true,
                conversationId,
                otherUserId,
                otherUserName
            };

        } catch (error) {
            console.error('Error creating conversation:', error);
            return { success: false, message: 'Failed to create conversation' };
        }
    }

    async sendMessage(conversationId, otherUserId, text) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Chat requires Firebase' };
        }

        if (!text || !text.trim()) {
            return { success: false, message: 'Message cannot be empty' };
        }

        try {
            const db = firebase.firestore();

            const message = {
                conversationId: conversationId,
                senderId: this.currentUser.uid,
                senderName: this.currentUser.displayName,
                receiverId: otherUserId,
                text: text.trim(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                read: false
            };

            // Add message to directMessages collection
            await db.collection('directMessages').add(message);

            // Update conversation metadata
            const convRef = db.collection('conversations').doc(conversationId);
            await convRef.update({
                lastMessage: text.trim().substring(0, 100),
                lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
                [`unreadCount.${otherUserId}`]: firebase.firestore.FieldValue.increment(1)
            });

            // Award XP for engagement
            if (window.progressSystem) {
                window.progressSystem.awardXP(3, 'Sent a message', 'community');
            }

            return { success: true };

        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, message: 'Failed to send message' };
        }
    }

    async markConversationAsRead(conversationId) {
        if (this.useLocalStorage || !this.currentUser) return;

        try {
            const db = firebase.firestore();
            const convRef = db.collection('conversations').doc(conversationId);

            await convRef.update({
                [`unreadCount.${this.currentUser.uid}`]: 0
            });

            // Mark all unread messages as read
            const messagesSnapshot = await db.collection('directMessages')
                .where('conversationId', '==', conversationId)
                .where('receiverId', '==', this.currentUser.uid)
                .where('read', '==', false)
                .get();

            const batch = db.batch();
            messagesSnapshot.forEach(doc => {
                batch.update(doc.ref, { read: true });
            });
            await batch.commit();

        } catch (error) {
            console.error('Error marking conversation as read:', error);
        }
    }

    setupMessageListener(conversationId, containerId) {
        if (this.useLocalStorage) return;

        const db = firebase.firestore();

        // Remove previous listener if exists
        this.clearMessageListeners();

        // Listen for new messages in this conversation
        const unsubscribe = db.collection('directMessages')
            .where('conversationId', '==', conversationId)
            .orderBy('timestamp', 'asc')
            .limit(100)
            .onSnapshot((snapshot) => {
                const messages = [];
                snapshot.forEach(doc => {
                    messages.push({ id: doc.id, ...doc.data() });
                });

                this.renderMessages(containerId, messages);
            });

        this.messageListeners.push(unsubscribe);
    }

    clearMessageListeners() {
        this.messageListeners.forEach(unsubscribe => unsubscribe());
        this.messageListeners = [];
    }

    renderMessages(containerId, messages) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (messages.length === 0) {
            container.innerHTML = `
                <div class="empty-chat">
                    <div class="empty-chat-icon">💬</div>
                    <p>No messages yet. Start the conversation!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = messages.map(msg => {
            const isCurrentUser = msg.senderId === this.currentUser?.uid;
            const time = msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            return `
                <div class="chat-message ${isCurrentUser ? 'own-message' : 'other-message'}">
                    <div class="message-bubble">
                        ${!isCurrentUser ? `<div class="message-sender">${msg.senderName}</div>` : ''}
                        <div class="message-text">${this.escapeHtml(msg.text)}</div>
                        <div class="message-time">${time}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    renderConversationList() {
        const container = document.getElementById('conversationsList');
        if (!container) return;

        if (this.conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-conversations">
                    <div class="empty-icon">💬</div>
                    <p>No conversations yet</p>
                    <p class="empty-hint">Search for members to start chatting!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.conversations.map(conv => {
            const otherUserId = conv.participants.find(id => id !== this.currentUser.uid);
            const otherUserName = conv.participantNames[otherUserId] || 'Unknown';
            const unreadCount = conv.unreadCount?.[this.currentUser.uid] || 0;
            const lastMessageTime = conv.lastMessageAt ?
                this.formatTimestamp(conv.lastMessageAt.toDate()) : '';

            return `
                <div class="conversation-item ${unreadCount > 0 ? 'unread' : ''}"
                     onclick="window.memberChatSystem.openConversation('${conv.id}', '${otherUserId}', '${this.escapeHtml(otherUserName)}')">
                    <div class="conversation-avatar">
                        ${otherUserName.charAt(0).toUpperCase()}
                    </div>
                    <div class="conversation-info">
                        <div class="conversation-header">
                            <strong>${this.escapeHtml(otherUserName)}</strong>
                            <span class="conversation-time">${lastMessageTime}</span>
                        </div>
                        <div class="conversation-preview">
                            ${this.escapeHtml(conv.lastMessage || 'Start a conversation...')}
                        </div>
                    </div>
                    ${unreadCount > 0 ? `<div class="unread-badge">${unreadCount}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    async openConversation(conversationId, otherUserId, otherUserName) {
        this.activeConversation = { conversationId, otherUserId, otherUserName };

        // Mark as read
        await this.markConversationAsRead(conversationId);

        // Update UI to show chat view
        const chatContainer = document.getElementById('memberChatContainer');
        if (chatContainer) {
            chatContainer.innerHTML = this.renderChatView(otherUserName);
            this.setupMessageListener(conversationId, 'messagesList');
        }
    }

    renderChatView(otherUserName) {
        return `
            <div class="chat-view">
                <div class="chat-header">
                    <button onclick="window.memberChatSystem.closeChatView()" class="back-btn">
                        ← Back
                    </button>
                    <div class="chat-header-info">
                        <div class="chat-avatar">${otherUserName.charAt(0).toUpperCase()}</div>
                        <strong>${this.escapeHtml(otherUserName)}</strong>
                    </div>
                </div>

                <div class="messages-container" id="messagesList">
                    <p class="loading-text">Loading messages...</p>
                </div>

                <div class="message-input-area">
                    <input type="text"
                           id="messageInput"
                           placeholder="Type your message..."
                           class="message-input"
                           onkeypress="if(event.key === 'Enter') window.memberChatSystem.sendCurrentMessage()">
                    <button onclick="window.memberChatSystem.sendCurrentMessage()" class="send-message-btn">
                        📨 Send
                    </button>
                </div>
            </div>
        `;
    }

    async sendCurrentMessage() {
        const input = document.getElementById('messageInput');
        if (!input) return;

        const text = input.value.trim();
        if (!text || !this.activeConversation) return;

        const result = await this.sendMessage(
            this.activeConversation.conversationId,
            this.activeConversation.otherUserId,
            text
        );

        if (result.success) {
            input.value = '';
        } else {
            alert(result.message || 'Failed to send message');
        }
    }

    closeChatView() {
        this.clearMessageListeners();
        this.activeConversation = null;

        const chatContainer = document.getElementById('memberChatContainer');
        if (chatContainer) {
            chatContainer.innerHTML = this.renderConversationsView();
        }
    }

    renderConversationsView() {
        return `
            <div class="conversations-view">
                <div class="conversations-header">
                    <h3>💬 Messages</h3>
                    <button onclick="window.memberChatSystem.openMemberSearch()" class="new-message-btn">
                        ✉️ New Message
                    </button>
                </div>
                <div id="conversationsList" class="conversations-list">
                    <p class="loading-text">Loading conversations...</p>
                </div>
            </div>
        `;
    }

    async openMemberSearch() {
        const modal = document.createElement('div');
        modal.className = 'member-search-modal';
        modal.id = 'memberSearchModal';

        modal.innerHTML = `
            <div class="member-search-content">
                <div class="member-search-header">
                    <h3>Start a Conversation</h3>
                    <button onclick="document.getElementById('memberSearchModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="search-input-wrapper">
                    <input type="text"
                           id="memberSearchInput"
                           placeholder="Search members by name or email..."
                           class="member-search-input"
                           oninput="window.memberChatSystem.searchMembersFromModal()">
                </div>

                <div id="memberSearchResults" class="member-search-results">
                    <p class="loading-text">Loading members...</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Load initial members
        await this.loadMemberSearchResults();
    }

    async searchMembersFromModal() {
        const query = document.getElementById('memberSearchInput')?.value || '';
        await this.loadMemberSearchResults(query);
    }

    async loadMemberSearchResults(query = '') {
        const result = await this.searchMembers(query);
        const container = document.getElementById('memberSearchResults');

        if (!container) return;

        if (result.members.length === 0) {
            container.innerHTML = '<p class="no-results">No members found</p>';
            return;
        }

        container.innerHTML = result.members.map(member => `
            <div class="member-result-item" onclick="window.memberChatSystem.startConversationWith('${member.uid}', '${this.escapeHtml(member.displayName)}')">
                <div class="member-result-avatar">
                    ${member.displayName.charAt(0).toUpperCase()}
                </div>
                <div class="member-result-info">
                    <strong>${this.escapeHtml(member.displayName)}</strong>
                    <div class="member-result-path">${member.spiritualPath}</div>
                </div>
            </div>
        `).join('');
    }

    async startConversationWith(otherUserId, otherUserName) {
        // Close the search modal
        const modal = document.getElementById('memberSearchModal');
        if (modal) modal.remove();

        // Get or create conversation
        const result = await this.getOrCreateConversation(otherUserId, otherUserName);

        if (result.success) {
            // Open the conversation
            await this.openConversation(result.conversationId, otherUserId, otherUserName);
        } else {
            alert(result.message || 'Failed to start conversation');
        }
    }

    openChatModal() {
        const modal = document.createElement('div');
        modal.className = 'member-chat-modal';
        modal.id = 'memberChatModal';

        modal.innerHTML = `
            <div class="member-chat-modal-content">
                <div class="member-chat-modal-header">
                    <h2>💬 Member Chat</h2>
                    <button onclick="document.getElementById('memberChatModal').remove(); window.memberChatSystem.clearMessageListeners();" class="modal-close">✕</button>
                </div>

                <div id="memberChatContainer" class="member-chat-container">
                    ${this.renderConversationsView()}
                </div>
            </div>
        `;

        this.addChatStyles();
        document.body.appendChild(modal);

        // Load conversations
        setTimeout(() => this.renderConversationList(), 100);
    }

    formatTimestamp(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) {
            return date.toLocaleDateString();
        } else if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return 'Just now';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addChatStyles() {
        if (document.getElementById('memberChatStyles')) return;

        const style = document.createElement('style');
        style.id = 'memberChatStyles';
        style.textContent = `
            .member-chat-modal, .member-search-modal {
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

            .member-chat-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 800px;
                height: 80vh;
                max-height: 700px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: slideUp 0.3s ease;
            }

            .member-search-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 500px;
                max-height: 600px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: slideUp 0.3s ease;
            }

            .member-chat-modal-header, .member-search-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 25px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .member-chat-modal-header h2, .member-search-header h3 {
                margin: 0;
            }

            .modal-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
            }

            .member-chat-container {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .conversations-view {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .conversations-header {
                padding: 20px;
                border-bottom: 2px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .conversations-header h3 {
                margin: 0;
            }

            .new-message-btn {
                padding: 8px 16px;
                border: none;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: transform 0.2s;
            }

            .new-message-btn:hover {
                transform: translateY(-2px);
            }

            .conversations-list {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }

            .conversation-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 8px;
            }

            .conversation-item:hover {
                background: #f5f5f5;
            }

            .conversation-item.unread {
                background: #f0f4ff;
            }

            .conversation-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                font-weight: bold;
                flex-shrink: 0;
            }

            .conversation-info {
                flex: 1;
                min-width: 0;
            }

            .conversation-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }

            .conversation-time {
                font-size: 12px;
                color: #999;
            }

            .conversation-preview {
                color: #666;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .unread-badge {
                background: #667eea;
                color: white;
                border-radius: 12px;
                padding: 4px 8px;
                font-size: 12px;
                font-weight: bold;
                min-width: 20px;
                text-align: center;
            }

            .chat-view {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .chat-header {
                padding: 15px 20px;
                border-bottom: 2px solid #e0e0e0;
                display: flex;
                align-items: center;
                gap: 15px;
                background: #f9f9f9;
            }

            .back-btn {
                padding: 8px 16px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            }

            .chat-header-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chat-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: bold;
            }

            .messages-container {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f9f9f9;
            }

            .chat-message {
                margin-bottom: 15px;
                display: flex;
            }

            .chat-message.own-message {
                justify-content: flex-end;
            }

            .message-bubble {
                max-width: 70%;
                padding: 12px 16px;
                border-radius: 12px;
            }

            .own-message .message-bubble {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-bottom-right-radius: 4px;
            }

            .other-message .message-bubble {
                background: white;
                border: 1px solid #e0e0e0;
                border-bottom-left-radius: 4px;
            }

            .message-sender {
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 4px;
                color: #667eea;
            }

            .message-text {
                line-height: 1.5;
                word-wrap: break-word;
            }

            .message-time {
                font-size: 11px;
                margin-top: 6px;
                opacity: 0.7;
            }

            .message-input-area {
                padding: 15px 20px;
                border-top: 2px solid #e0e0e0;
                display: flex;
                gap: 10px;
                background: white;
            }

            .message-input {
                flex: 1;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 15px;
            }

            .send-message-btn {
                padding: 12px 24px;
                border: none;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: transform 0.2s;
            }

            .send-message-btn:hover {
                transform: translateY(-2px);
            }

            .search-input-wrapper {
                padding: 20px;
                border-bottom: 2px solid #e0e0e0;
            }

            .member-search-input {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 15px;
            }

            .member-search-results {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }

            .member-result-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 8px;
            }

            .member-result-item:hover {
                background: #f5f5f5;
            }

            .member-result-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                font-weight: bold;
            }

            .member-result-info strong {
                display: block;
                margin-bottom: 4px;
            }

            .member-result-path {
                font-size: 13px;
                color: #666;
            }

            .empty-conversations, .empty-chat {
                text-align: center;
                padding: 60px 20px;
                color: #999;
            }

            .empty-icon, .empty-chat-icon {
                font-size: 64px;
                margin-bottom: 15px;
            }

            .empty-hint {
                font-size: 13px;
                margin-top: 8px;
            }

            .loading-text, .no-results {
                text-align: center;
                padding: 40px;
                color: #999;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Initialize the member chat system
if (typeof window !== 'undefined') {
    window.memberChatSystem = new MemberChatSystem();
    console.log('💬 Member Chat System ready!');
}
