/**
 * 👥 Divine Temple Friend System
 *
 * Features:
 * - Add/remove friends
 * - Friend requests and acceptance
 * - Activity feed of friends' progress
 * - Compare stats with friends
 * - Gift XP to friends
 * - Friend leaderboards
 * - Firebase integration for real-time updates
 */

class FriendSystem {
    constructor() {
        this.friends = [];
        this.friendRequests = [];
        this.sentRequests = [];
        this.currentUser = null;
        this.activityFeed = [];
        this.init();
    }

    async init() {
        console.log('👥 Friend System initialized');

        // Check if Firebase is available
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('Firebase not available. Friend system will use local storage only.');
            this.useLocalStorage = true;
            this.loadLocalData();
        } else {
            this.useLocalStorage = false;
            await this.initFirebase();
        }

        // Listen for friend activity events
        window.addEventListener('xp-awarded', (e) => {
            this.broadcastActivity('xp_earned', {
                amount: e.detail.amount,
                reason: e.detail.reason
            });
        });

        window.addEventListener('achievement-unlocked', (e) => {
            this.broadcastActivity('achievement', {
                name: e.detail.name,
                icon: e.detail.icon
            });
        });
    }

    async initFirebase() {
        try {
            // Get current user
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0]
                    };

                    await this.loadFriendsFromFirebase();
                    this.setupRealtimeListeners();
                } else {
                    this.currentUser = null;
                }
            });
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.useLocalStorage = true;
            this.loadLocalData();
        }
    }

    async loadFriendsFromFirebase() {
        if (!this.currentUser) return;

        try {
            const db = firebase.firestore();

            // Load friends list
            const friendsDoc = await db.collection('friends')
                .doc(this.currentUser.uid)
                .get();

            if (friendsDoc.exists) {
                const data = friendsDoc.data();
                this.friends = data.friends || [];
                this.friendRequests = data.requests || [];
                this.sentRequests = data.sentRequests || [];
            }

            // Load friend profiles
            await this.loadFriendProfiles();

        } catch (error) {
            console.error('Error loading friends:', error);
        }
    }

    async loadFriendProfiles() {
        if (this.friends.length === 0) return;

        try {
            const db = firebase.firestore();
            const profiles = await Promise.all(
                this.friends.map(async (friendId) => {
                    const userDoc = await db.collection('users').doc(friendId).get();
                    const progressDoc = await db.collection('userProgress').doc(friendId).get();

                    return {
                        uid: friendId,
                        profile: userDoc.exists ? userDoc.data() : {},
                        progress: progressDoc.exists ? progressDoc.data() : {}
                    };
                })
            );

            this.friendProfiles = profiles;
        } catch (error) {
            console.error('Error loading friend profiles:', error);
        }
    }

    setupRealtimeListeners() {
        if (!this.currentUser) return;

        const db = firebase.firestore();

        // Listen for friend requests
        db.collection('friends')
            .doc(this.currentUser.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const newRequests = data.requests || [];

                    // Check for new requests
                    if (newRequests.length > this.friendRequests.length) {
                        this.showNewRequestNotification();
                    }

                    this.friendRequests = newRequests;
                    this.sentRequests = data.sentRequests || [];

                    // Refresh UI if needed
                    window.dispatchEvent(new CustomEvent('friends-updated'));
                }
            });

        // Listen for friend activity
        this.friends.forEach(friendId => {
            db.collection('userActivity')
                .where('userId', '==', friendId)
                .orderBy('timestamp', 'desc')
                .limit(10)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const activity = change.doc.data();
                            this.addToActivityFeed(activity);
                        }
                    });
                });
        });
    }

    loadLocalData() {
        const saved = localStorage.getItem('divine_temple_friends');
        if (saved) {
            const data = JSON.parse(saved);
            this.friends = data.friends || [];
            this.friendRequests = data.requests || [];
            this.sentRequests = data.sentRequests || [];
        }

        // For local storage, create a mock user ID
        this.currentUser = {
            uid: localStorage.getItem('divine_temple_user_id') || 'local_user_' + Date.now(),
            email: 'local@user.com',
            displayName: 'Local User'
        };

        localStorage.setItem('divine_temple_user_id', this.currentUser.uid);
    }

    saveLocalData() {
        localStorage.setItem('divine_temple_friends', JSON.stringify({
            friends: this.friends,
            requests: this.friendRequests,
            sentRequests: this.sentRequests
        }));
    }

    async sendFriendRequest(friendEmail) {
        if (this.useLocalStorage) {
            return {
                success: false,
                message: 'Friend system requires Firebase authentication. Please log in.'
            };
        }

        if (!this.currentUser) {
            return { success: false, message: 'Please log in first' };
        }

        if (friendEmail === this.currentUser.email) {
            return { success: false, message: 'You cannot add yourself as a friend' };
        }

        try {
            const db = firebase.firestore();

            // Find user by email
            const usersSnapshot = await db.collection('users')
                .where('email', '==', friendEmail)
                .get();

            if (usersSnapshot.empty) {
                return { success: false, message: 'User not found with that email' };
            }

            const friendDoc = usersSnapshot.docs[0];
            const friendId = friendDoc.id;

            // Check if already friends
            if (this.friends.includes(friendId)) {
                return { success: false, message: 'Already friends with this user' };
            }

            // Check if request already sent
            if (this.sentRequests.includes(friendId)) {
                return { success: false, message: 'Friend request already sent' };
            }

            // Add to sent requests
            await db.collection('friends')
                .doc(this.currentUser.uid)
                .set({
                    sentRequests: firebase.firestore.FieldValue.arrayUnion(friendId)
                }, { merge: true });

            // Add to their incoming requests
            await db.collection('friends')
                .doc(friendId)
                .set({
                    requests: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
                }, { merge: true });

            this.sentRequests.push(friendId);

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(20, 'Sent friend request', 'social');
            }

            return {
                success: true,
                message: 'Friend request sent!',
                friendId
            };

        } catch (error) {
            console.error('Error sending friend request:', error);
            return { success: false, message: 'Failed to send request: ' + error.message };
        }
    }

    async acceptFriendRequest(friendId) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Friend system requires Firebase authentication' };
        }

        try {
            const db = firebase.firestore();

            // Add to both friends lists
            await db.collection('friends')
                .doc(this.currentUser.uid)
                .set({
                    friends: firebase.firestore.FieldValue.arrayUnion(friendId),
                    requests: firebase.firestore.FieldValue.arrayRemove(friendId)
                }, { merge: true });

            await db.collection('friends')
                .doc(friendId)
                .set({
                    friends: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid),
                    sentRequests: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
                }, { merge: true });

            this.friends.push(friendId);
            this.friendRequests = this.friendRequests.filter(id => id !== friendId);

            // Reload friend profiles
            await this.loadFriendProfiles();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(50, 'New friend added! 🎉', 'social');
            }

            return { success: true, message: 'Friend request accepted!' };

        } catch (error) {
            console.error('Error accepting friend request:', error);
            return { success: false, message: 'Failed to accept request' };
        }
    }

    async rejectFriendRequest(friendId) {
        if (this.useLocalStorage) return { success: false };

        try {
            const db = firebase.firestore();

            await db.collection('friends')
                .doc(this.currentUser.uid)
                .set({
                    requests: firebase.firestore.FieldValue.arrayRemove(friendId)
                }, { merge: true });

            await db.collection('friends')
                .doc(friendId)
                .set({
                    sentRequests: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
                }, { merge: true });

            this.friendRequests = this.friendRequests.filter(id => id !== friendId);

            return { success: true };

        } catch (error) {
            console.error('Error rejecting friend request:', error);
            return { success: false };
        }
    }

    async removeFriend(friendId) {
        if (this.useLocalStorage) {
            this.friends = this.friends.filter(id => id !== friendId);
            this.saveLocalData();
            return { success: true };
        }

        try {
            const db = firebase.firestore();

            // Remove from both friends lists
            await db.collection('friends')
                .doc(this.currentUser.uid)
                .set({
                    friends: firebase.firestore.FieldValue.arrayRemove(friendId)
                }, { merge: true });

            await db.collection('friends')
                .doc(friendId)
                .set({
                    friends: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
                }, { merge: true });

            this.friends = this.friends.filter(id => id !== friendId);
            await this.loadFriendProfiles();

            return { success: true, message: 'Friend removed' };

        } catch (error) {
            console.error('Error removing friend:', error);
            return { success: false };
        }
    }

    async giftXP(friendId, amount, message = '') {
        if (this.useLocalStorage) {
            return { success: false, message: 'XP gifting requires Firebase' };
        }

        if (!this.friends.includes(friendId)) {
            return { success: false, message: 'Can only gift XP to friends' };
        }

        // Check gift cooldown (max 1 gift per friend per day)
        const cooldownKey = `xp_gift_cooldown_${friendId}`;
        const lastGift = localStorage.getItem(cooldownKey);
        const today = new Date().toISOString().split('T')[0];

        if (lastGift === today) {
            return { success: false, message: 'You can only gift XP once per day to each friend' };
        }

        // Check if user has enough XP to gift
        const currentXP = window.progressSystem ? window.progressSystem.xp : 0;
        if (currentXP < amount) {
            return { success: false, message: 'Not enough XP to gift' };
        }

        try {
            const db = firebase.firestore();

            // Create gift notification
            await db.collection('xpGifts').add({
                from: this.currentUser.uid,
                to: friendId,
                amount: amount,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'sent'
            });

            // Deduct XP from sender
            if (window.progressSystem) {
                window.progressSystem.xp -= amount;
                window.progressSystem.saveProgress();
            }

            // Set cooldown
            localStorage.setItem(cooldownKey, today);

            // 🎯 AWARD KARMA XP (get 10% back for being generous)
            if (window.progressSystem) {
                const karmaXP = Math.floor(amount * 0.1);
                window.progressSystem.awardXP(karmaXP, 'Karma for gifting XP 💝', 'social');
            }

            return {
                success: true,
                message: `Sent ${amount} XP to your friend! 💝`,
                karmaXP: Math.floor(amount * 0.1)
            };

        } catch (error) {
            console.error('Error gifting XP:', error);
            return { success: false, message: 'Failed to send gift' };
        }
    }

    async checkXPGifts() {
        if (this.useLocalStorage || !this.currentUser) return;

        try {
            const db = firebase.firestore();

            const giftsSnapshot = await db.collection('xpGifts')
                .where('to', '==', this.currentUser.uid)
                .where('status', '==', 'sent')
                .get();

            for (const doc of giftsSnapshot.docs) {
                const gift = doc.data();

                // Award XP
                if (window.progressSystem) {
                    const senderName = gift.from; // You'd fetch the actual name
                    window.progressSystem.awardXP(
                        gift.amount,
                        `XP gift from friend! ${gift.message ? '💝 ' + gift.message : ''}`,
                        'social'
                    );
                }

                // Mark as received
                await doc.ref.update({ status: 'received' });

                // Show notification
                this.showGiftNotification(gift);
            }

        } catch (error) {
            console.error('Error checking XP gifts:', error);
        }
    }

    showGiftNotification(gift) {
        const notification = document.createElement('div');
        notification.className = 'xp-gift-notification';
        notification.innerHTML = `
            <div class="gift-notification-content">
                <div class="gift-icon">🎁</div>
                <div class="gift-text">
                    <h4>XP Gift Received!</h4>
                    <p>+${gift.amount} XP from a friend</p>
                    ${gift.message ? `<p class="gift-message">"${gift.message}"</p>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 5000);
    }

    async broadcastActivity(type, data) {
        if (this.useLocalStorage || !this.currentUser) return;

        try {
            const db = firebase.firestore();

            await db.collection('userActivity').add({
                userId: this.currentUser.uid,
                userName: this.currentUser.displayName,
                type: type,
                data: data,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

        } catch (error) {
            console.error('Error broadcasting activity:', error);
        }
    }

    addToActivityFeed(activity) {
        this.activityFeed.unshift(activity);

        // Keep only last 50 activities
        if (this.activityFeed.length > 50) {
            this.activityFeed = this.activityFeed.slice(0, 50);
        }

        // Dispatch event for UI update
        window.dispatchEvent(new CustomEvent('friend-activity-added', { detail: activity }));
    }

    getActivityFeed(limit = 20) {
        return this.activityFeed.slice(0, limit);
    }

    async compareFriend(friendId) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Comparison requires Firebase' };
        }

        try {
            const db = firebase.firestore();

            // Get friend's progress
            const friendProgressDoc = await db.collection('userProgress').doc(friendId).get();
            const friendProgress = friendProgressDoc.exists ? friendProgressDoc.data() : {};

            // Get your progress
            const myProgress = window.progressSystem ? {
                xp: window.progressSystem.xp,
                level: window.progressSystem.level,
                achievements: window.progressSystem.achievements.length,
                streak: window.progressSystem.streakDays
            } : {};

            return {
                success: true,
                myProgress,
                friendProgress,
                comparison: this.calculateComparison(myProgress, friendProgress)
            };

        } catch (error) {
            console.error('Error comparing with friend:', error);
            return { success: false };
        }
    }

    calculateComparison(my, friend) {
        return {
            xpDiff: my.xp - (friend.xp || 0),
            levelDiff: my.level - (friend.level || 0),
            achievementDiff: my.achievements - (friend.achievements || 0),
            streakDiff: my.streak - (friend.streak || 0)
        };
    }

    showNewRequestNotification() {
        const notification = document.createElement('div');
        notification.className = 'friend-request-notification';
        notification.innerHTML = `
            <div class="request-notification-content">
                <div class="request-icon">👥</div>
                <div class="request-text">
                    <h4>New Friend Request!</h4>
                    <p>Someone wants to connect with you</p>
                </div>
                <button onclick="window.friendSystem.openFriendsModal()" class="view-request-btn">
                    View
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 5000);
    }

    openFriendsModal() {
        const modal = document.createElement('div');
        modal.className = 'friends-modal';
        modal.id = 'friendsModal';

        modal.innerHTML = `
            <div class="friends-modal-content">
                <div class="friends-modal-header">
                    <h2>👥 Friends</h2>
                    <button onclick="document.getElementById('friendsModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="friends-tabs">
                    <button class="friends-tab active" onclick="window.friendSystem.switchTab('friends')">
                        My Friends (${this.friends.length})
                    </button>
                    <button class="friends-tab" onclick="window.friendSystem.switchTab('requests')">
                        Requests (${this.friendRequests.length})
                    </button>
                    <button class="friends-tab" onclick="window.friendSystem.switchTab('add')">
                        Add Friend
                    </button>
                    <button class="friends-tab" onclick="window.friendSystem.switchTab('activity')">
                        Activity
                    </button>
                </div>

                <div class="friends-content" id="friendsContent">
                    ${this.renderFriendsTab()}
                </div>
            </div>
        `;

        this.addFriendsModalStyles();
        document.body.appendChild(modal);
    }

    switchTab(tab) {
        const tabs = document.querySelectorAll('.friends-tab');
        tabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        const content = document.getElementById('friendsContent');

        switch(tab) {
            case 'friends':
                content.innerHTML = this.renderFriendsTab();
                break;
            case 'requests':
                content.innerHTML = this.renderRequestsTab();
                break;
            case 'add':
                content.innerHTML = this.renderAddFriendTab();
                break;
            case 'activity':
                content.innerHTML = this.renderActivityTab();
                break;
        }
    }

    renderFriendsTab() {
        if (this.friends.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <h3>No friends yet</h3>
                    <p>Add friends to see their progress and share your journey!</p>
                </div>
            `;
        }

        return `
            <div class="friends-list">
                ${this.friends.map(friendId => this.renderFriendCard(friendId)).join('')}
            </div>
        `;
    }

    renderFriendCard(friendId) {
        const friend = this.friendProfiles?.find(f => f.uid === friendId);
        if (!friend) return '';

        const profile = friend.profile || {};
        const progress = friend.progress || {};

        return `
            <div class="friend-card">
                <div class="friend-avatar">
                    ${profile.photoURL ?
                        `<img src="${profile.photoURL}" alt="${profile.displayName}">` :
                        `<div class="avatar-placeholder">${(profile.displayName || 'U')[0].toUpperCase()}</div>`
                    }
                </div>
                <div class="friend-info">
                    <h4>${profile.displayName || profile.email || 'Friend'}</h4>
                    <div class="friend-stats">
                        <span>Level ${progress.level || 1}</span>
                        <span>•</span>
                        <span>${(progress.xp || 0).toLocaleString()} XP</span>
                    </div>
                </div>
                <div class="friend-actions">
                    <button onclick="window.friendSystem.showGiftXPModal('${friendId}')" class="gift-btn" title="Gift XP">
                        🎁
                    </button>
                    <button onclick="window.friendSystem.showCompareModal('${friendId}')" class="compare-btn" title="Compare Progress">
                        📊
                    </button>
                    <button onclick="window.friendSystem.removeFriend('${friendId}')" class="remove-btn" title="Remove Friend">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }

    renderRequestsTab() {
        if (this.friendRequests.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📬</div>
                    <h3>No pending requests</h3>
                    <p>Friend requests will appear here</p>
                </div>
            `;
        }

        return `
            <div class="requests-list">
                ${this.friendRequests.map(friendId => `
                    <div class="request-card">
                        <div class="request-info">
                            <h4>Friend Request</h4>
                            <p>User ID: ${friendId.substring(0, 8)}...</p>
                        </div>
                        <div class="request-actions">
                            <button onclick="window.friendSystem.acceptFriendRequest('${friendId}')" class="accept-btn">
                                ✓ Accept
                            </button>
                            <button onclick="window.friendSystem.rejectFriendRequest('${friendId}')" class="reject-btn">
                                ✕ Reject
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderAddFriendTab() {
        return `
            <div class="add-friend-section">
                <div class="add-friend-form">
                    <h3>Add Friend by Email</h3>
                    <input type="email" id="friendEmail" placeholder="friend@example.com" class="friend-email-input">
                    <button onclick="window.friendSystem.sendFriendRequestFromModal()" class="send-request-btn">
                        📨 Send Friend Request
                    </button>
                </div>

                <div class="friend-code-section">
                    <h3>Your Friend Code</h3>
                    <div class="friend-code">
                        ${this.currentUser?.email || 'Not logged in'}
                    </div>
                    <button onclick="navigator.clipboard.writeText('${this.currentUser?.email || ''}'); alert('Copied!');"
                            class="copy-code-btn">
                        📋 Copy Email
                    </button>
                </div>
            </div>
        `;
    }

    renderActivityTab() {
        const activities = this.getActivityFeed();

        if (activities.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📰</div>
                    <h3>No activity yet</h3>
                    <p>Your friends' activities will appear here</p>
                </div>
            `;
        }

        return `
            <div class="activity-feed">
                ${activities.map(activity => this.renderActivityItem(activity)).join('')}
            </div>
        `;
    }

    renderActivityItem(activity) {
        let icon = '⭐';
        let text = '';

        if (activity.type === 'xp_earned') {
            icon = '⚡';
            text = `earned ${activity.data.amount} XP for ${activity.data.reason}`;
        } else if (activity.type === 'achievement') {
            icon = activity.data.icon || '🏆';
            text = `unlocked "${activity.data.name}"`;
        } else if (activity.type === 'level_up') {
            icon = '🎉';
            text = `reached Level ${activity.data.level}!`;
        }

        const timeAgo = this.getTimeAgo(activity.timestamp);

        return `
            <div class="activity-item">
                <div class="activity-icon">${icon}</div>
                <div class="activity-text">
                    <strong>${activity.userName}</strong> ${text}
                    <span class="activity-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        if (!timestamp) return 'Just now';

        const now = new Date();
        const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diff = Math.floor((now - time) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    async sendFriendRequestFromModal() {
        const email = document.getElementById('friendEmail').value.trim();

        if (!email) {
            alert('Please enter an email address');
            return;
        }

        const result = await this.sendFriendRequest(email);
        alert(result.message);

        if (result.success) {
            document.getElementById('friendEmail').value = '';
        }
    }

    showGiftXPModal(friendId) {
        const modal = document.createElement('div');
        modal.className = 'gift-xp-modal';
        modal.innerHTML = `
            <div class="gift-modal-content">
                <h3>🎁 Gift XP</h3>
                <p>Send XP to your friend!</p>
                <input type="number" id="giftAmount" placeholder="Amount" min="10" max="500" class="gift-input">
                <textarea id="giftMessage" placeholder="Optional message..." class="gift-message"></textarea>
                <div class="gift-modal-actions">
                    <button onclick="window.friendSystem.sendGift('${friendId}')" class="send-gift-btn">
                        💝 Send Gift
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="cancel-btn">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    async sendGift(friendId) {
        const amount = parseInt(document.getElementById('giftAmount').value);
        const message = document.getElementById('giftMessage').value.trim();

        if (!amount || amount < 10) {
            alert('Please enter at least 10 XP');
            return;
        }

        const result = await this.giftXP(friendId, amount, message);
        alert(result.message);

        if (result.success) {
            document.querySelector('.gift-xp-modal').remove();
        }
    }

    showCompareModal(friendId) {
        // TODO: Implement comparison modal
        alert('Comparison feature coming soon!');
    }

    addFriendsModalStyles() {
        if (document.getElementById('friendsModalStyles')) return;

        const style = document.createElement('style');
        style.id = 'friendsModalStyles';
        style.textContent = `
            .friends-modal {
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
            }

            .friends-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .friends-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .friends-modal-header h2 {
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

            .friends-tabs {
                display: flex;
                border-bottom: 2px solid #e0e0e0;
                background: #f9f9f9;
            }

            .friends-tab {
                flex: 1;
                padding: 15px;
                border: none;
                background: none;
                cursor: pointer;
                font-weight: 600;
                color: #666;
                transition: all 0.2s;
            }

            .friends-tab.active {
                color: #667eea;
                background: white;
                border-bottom: 3px solid #667eea;
            }

            .friends-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .friends-list, .requests-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .friend-card, .request-card {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: #f9f9f9;
                border-radius: 12px;
                transition: background 0.2s;
            }

            .friend-card:hover {
                background: #f0f0f0;
            }

            .friend-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
            }

            .friend-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .avatar-placeholder {
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
            }

            .friend-info {
                flex: 1;
            }

            .friend-info h4 {
                margin: 0 0 5px 0;
            }

            .friend-stats {
                font-size: 13px;
                color: #666;
            }

            .friend-actions {
                display: flex;
                gap: 8px;
            }

            .friend-actions button {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.2s;
            }

            .friend-actions button:hover {
                transform: scale(1.1);
            }

            .gift-btn {
                background: #ffd700;
            }

            .compare-btn {
                background: #3b82f6;
                color: white;
            }

            .remove-btn {
                background: #ef4444;
                color: white;
            }

            .empty-state {
                text-align: center;
                padding: 60px 20px;
                color: #999;
            }

            .empty-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }

            .empty-state h3 {
                margin: 0 0 10px 0;
                color: #666;
            }

            .add-friend-section {
                max-width: 500px;
                margin: 0 auto;
            }

            .add-friend-form, .friend-code-section {
                background: #f9f9f9;
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 20px;
            }

            .add-friend-form h3, .friend-code-section h3 {
                margin-top: 0;
            }

            .friend-email-input, .gift-input {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 15px;
                margin-bottom: 15px;
            }

            .send-request-btn, .copy-code-btn, .send-gift-btn {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .send-request-btn:hover, .copy-code-btn:hover, .send-gift-btn:hover {
                transform: translateY(-2px);
            }

            .friend-code {
                background: white;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                font-family: monospace;
                font-size: 16px;
                margin: 15px 0;
                border: 2px dashed #667eea;
            }

            .activity-feed {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .activity-item {
                display: flex;
                gap: 12px;
                padding: 12px;
                background: #f9f9f9;
                border-radius: 8px;
                border-left: 3px solid #667eea;
            }

            .activity-icon {
                font-size: 24px;
            }

            .activity-text {
                flex: 1;
                line-height: 1.5;
            }

            .activity-time {
                display: block;
                font-size: 12px;
                color: #999;
                margin-top: 3px;
            }

            .request-actions {
                display: flex;
                gap: 8px;
            }

            .accept-btn, .reject-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            }

            .accept-btn {
                background: #10b981;
                color: white;
            }

            .reject-btn {
                background: #ef4444;
                color: white;
            }

            .gift-xp-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            }

            .gift-modal-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
            }

            .gift-message {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-family: inherit;
                margin-bottom: 15px;
                resize: vertical;
            }

            .gift-modal-actions {
                display: flex;
                gap: 10px;
            }

            .cancel-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                background: #e0e0e0;
                cursor: pointer;
            }

            .xp-gift-notification, .friend-request-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
            }

            .gift-notification-content, .request-notification-content {
                display: flex;
                gap: 15px;
                align-items: center;
            }

            .gift-icon, .request-icon {
                font-size: 32px;
            }

            .gift-text h4, .request-text h4 {
                margin: 0 0 5px 0;
            }

            .gift-text p, .request-text p {
                margin: 0;
                opacity: 0.95;
            }

            .gift-message {
                font-style: italic;
                font-size: 13px;
                margin-top: 8px;
            }

            .view-request-btn {
                padding: 8px 16px;
                border: 2px solid white;
                background: rgba(255,255,255,0.2);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Initialize the friend system
if (typeof window !== 'undefined') {
    window.friendSystem = new FriendSystem();
    console.log('👥 Friend System ready!');

    // Check for XP gifts on load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.friendSystem) {
                window.friendSystem.checkXPGifts();
            }
        }, 2000);
    });
}
