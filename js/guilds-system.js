/**
 * 🏰 Divine Temple Guilds/Circles System
 *
 * Features:
 * - Create spiritual circles (max 20 members)
 * - Join/leave circles
 * - Circle chat system
 * - Shared goals and challenges
 * - Circle leaderboards
 * - Circle-only resources
 * - XP rewards for participation
 * - Firebase integration for real-time updates
 */

class GuildsSystem {
    constructor() {
        this.circles = [];
        this.myCircles = [];
        this.currentCircle = null;
        this.currentUser = null;
        this.useLocalStorage = false;
        this.init();
    }

    async init() {
        console.log('🏰 Guilds/Circles System initialized');

        // Check if Firebase is available
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('Firebase not available. Circles will use local storage only.');
            this.useLocalStorage = true;
            this.loadLocalData();
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

                    await this.loadMyCircles();
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

    loadLocalData() {
        const saved = localStorage.getItem('divine_temple_circles');
        if (saved) {
            const data = JSON.parse(saved);
            this.myCircles = data.myCircles || [];
            this.circles = data.allCircles || [];
        }

        this.currentUser = {
            uid: localStorage.getItem('divine_temple_user_id') || 'local_user_' + Date.now(),
            email: 'local@user.com',
            displayName: 'Local User'
        };
    }

    saveLocalData() {
        localStorage.setItem('divine_temple_circles', JSON.stringify({
            myCircles: this.myCircles,
            allCircles: this.circles
        }));
    }

    async loadMyCircles() {
        if (this.useLocalStorage) return;

        try {
            const db = firebase.firestore();

            const circlesSnapshot = await db.collection('circles')
                .where('members', 'array-contains', this.currentUser.uid)
                .get();

            this.myCircles = [];
            circlesSnapshot.forEach(doc => {
                this.myCircles.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log('Loaded circles:', this.myCircles.length);

        } catch (error) {
            console.error('Error loading circles:', error);
        }
    }

    async createCircle(data) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Circles require Firebase authentication' };
        }

        if (!this.currentUser) {
            return { success: false, message: 'Please log in first' };
        }

        // Validate data
        if (!data.name || data.name.length < 3) {
            return { success: false, message: 'Circle name must be at least 3 characters' };
        }

        if (!data.description || data.description.length < 10) {
            return { success: false, message: 'Description must be at least 10 characters' };
        }

        try {
            const db = firebase.firestore();

            const circle = {
                name: data.name,
                description: data.description,
                type: data.type || 'general', // general, meditation, healing, manifestation, etc.
                creator: this.currentUser.uid,
                creatorName: this.currentUser.displayName,
                members: [this.currentUser.uid],
                memberCount: 1,
                maxMembers: data.maxMembers || 20,
                isPrivate: data.isPrivate || false,
                tags: data.tags || [],
                rules: data.rules || [],
                goals: [],
                resources: [],
                stats: {
                    totalXP: 0,
                    totalActivities: 0,
                    activeMembers: 1
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('circles').add(circle);

            circle.id = docRef.id;
            this.myCircles.push(circle);

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(100, `Created circle: ${circle.name}`, 'guilds');
                window.progressSystem.logActivity('circle_created', 'guilds', {
                    circleId: circle.id,
                    circleName: circle.name
                });
            }

            return {
                success: true,
                message: 'Circle created successfully! 🏰',
                circle
            };

        } catch (error) {
            console.error('Error creating circle:', error);
            return { success: false, message: 'Failed to create circle: ' + error.message };
        }
    }

    async searchCircles(query = '', filters = {}) {
        if (this.useLocalStorage) {
            return { success: false, circles: [] };
        }

        try {
            const db = firebase.firestore();

            let circlesQuery = db.collection('circles')
                .where('isPrivate', '==', false)
                .limit(50);

            if (filters.type) {
                circlesQuery = circlesQuery.where('type', '==', filters.type);
            }

            const snapshot = await circlesQuery.get();

            let circles = [];
            snapshot.forEach(doc => {
                const circle = { id: doc.id, ...doc.data() };

                // Filter by search query
                if (query) {
                    const lowerQuery = query.toLowerCase();
                    if (circle.name.toLowerCase().includes(lowerQuery) ||
                        circle.description.toLowerCase().includes(lowerQuery) ||
                        (circle.tags && circle.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))) {
                        circles.push(circle);
                    }
                } else {
                    circles.push(circle);
                }
            });

            // Sort by member count
            circles.sort((a, b) => b.memberCount - a.memberCount);

            return { success: true, circles };

        } catch (error) {
            console.error('Error searching circles:', error);
            return { success: false, circles: [] };
        }
    }

    async joinCircle(circleId) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Circles require Firebase' };
        }

        if (!this.currentUser) {
            return { success: false, message: 'Please log in first' };
        }

        try {
            const db = firebase.firestore();
            const circleRef = db.collection('circles').doc(circleId);

            const circleDoc = await circleRef.get();
            if (!circleDoc.exists) {
                return { success: false, message: 'Circle not found' };
            }

            const circle = circleDoc.data();

            // Check if already a member
            if (circle.members.includes(this.currentUser.uid)) {
                return { success: false, message: 'Already a member of this circle' };
            }

            // Check if circle is full
            if (circle.members.length >= circle.maxMembers) {
                return { success: false, message: 'Circle is full' };
            }

            // Add user to circle
            await circleRef.update({
                members: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid),
                memberCount: firebase.firestore.FieldValue.increment(1),
                'stats.activeMembers': firebase.firestore.FieldValue.increment(1)
            });

            // Add welcome message to chat
            await this.sendMessage(circleId, {
                text: `${this.currentUser.displayName} joined the circle! 🎉`,
                type: 'system'
            });

            // Reload circles
            await this.loadMyCircles();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(50, `Joined circle: ${circle.name}`, 'guilds');
            }

            return {
                success: true,
                message: 'Successfully joined the circle! 🎉',
                circle
            };

        } catch (error) {
            console.error('Error joining circle:', error);
            return { success: false, message: 'Failed to join circle' };
        }
    }

    async leaveCircle(circleId) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Circles require Firebase' };
        }

        try {
            const db = firebase.firestore();
            const circleRef = db.collection('circles').doc(circleId);

            const circleDoc = await circleRef.get();
            if (!circleDoc.exists) {
                return { success: false, message: 'Circle not found' };
            }

            const circle = circleDoc.data();

            // Check if user is creator
            if (circle.creator === this.currentUser.uid) {
                return {
                    success: false,
                    message: 'Circle creator cannot leave. Delete the circle instead.'
                };
            }

            // Remove user from circle
            await circleRef.update({
                members: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid),
                memberCount: firebase.firestore.FieldValue.increment(-1),
                'stats.activeMembers': firebase.firestore.FieldValue.increment(-1)
            });

            // Add leave message to chat
            await this.sendMessage(circleId, {
                text: `${this.currentUser.displayName} left the circle`,
                type: 'system'
            });

            // Reload circles
            await this.loadMyCircles();

            return { success: true, message: 'Left the circle' };

        } catch (error) {
            console.error('Error leaving circle:', error);
            return { success: false, message: 'Failed to leave circle' };
        }
    }

    async deleteCircle(circleId) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Circles require Firebase' };
        }

        try {
            const db = firebase.firestore();
            const circleRef = db.collection('circles').doc(circleId);

            const circleDoc = await circleRef.get();
            if (!circleDoc.exists) {
                return { success: false, message: 'Circle not found' };
            }

            const circle = circleDoc.data();

            // Check if user is creator
            if (circle.creator !== this.currentUser.uid) {
                return { success: false, message: 'Only the creator can delete the circle' };
            }

            // Delete circle
            await circleRef.delete();

            // Delete associated chat messages
            const messagesSnapshot = await db.collection('circleMessages')
                .where('circleId', '==', circleId)
                .get();

            const batch = db.batch();
            messagesSnapshot.forEach(doc => batch.delete(doc.ref));
            await batch.commit();

            // Reload circles
            await this.loadMyCircles();

            return { success: true, message: 'Circle deleted' };

        } catch (error) {
            console.error('Error deleting circle:', error);
            return { success: false, message: 'Failed to delete circle' };
        }
    }

    async sendMessage(circleId, messageData) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Chat requires Firebase' };
        }

        try {
            const db = firebase.firestore();

            const message = {
                circleId: circleId,
                userId: this.currentUser.uid,
                userName: this.currentUser.displayName,
                text: messageData.text,
                type: messageData.type || 'user', // user, system, achievement
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('circleMessages').add(message);

            // Update circle stats
            await db.collection('circles').doc(circleId).update({
                'stats.totalActivities': firebase.firestore.FieldValue.increment(1),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // 🎯 AWARD XP for participation
            if (messageData.type === 'user' && window.progressSystem) {
                window.progressSystem.awardXP(5, 'Circle message sent', 'guilds');
            }

            return { success: true };

        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, message: 'Failed to send message' };
        }
    }

    setupCircleChat(circleId, containerId) {
        if (this.useLocalStorage) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        const db = firebase.firestore();

        // Listen for new messages
        db.collection('circleMessages')
            .where('circleId', '==', circleId)
            .orderBy('timestamp', 'desc')
            .limit(50)
            .onSnapshot((snapshot) => {
                const messages = [];
                snapshot.forEach(doc => {
                    messages.push({ id: doc.id, ...doc.data() });
                });

                messages.reverse();
                this.renderChatMessages(containerId, messages);
            });
    }

    renderChatMessages(containerId, messages) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = messages.map(msg => {
            if (msg.type === 'system') {
                return `
                    <div class="system-message">
                        <span>${msg.text}</span>
                    </div>
                `;
            }

            const isCurrentUser = msg.userId === this.currentUser?.uid;
            const time = msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : '';

            return `
                <div class="chat-message ${isCurrentUser ? 'own-message' : ''}">
                    <div class="message-header">
                        <strong>${msg.userName}</strong>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-text">${msg.text}</div>
                </div>
            `;
        }).join('');

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    async createSharedGoal(circleId, goalData) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Shared goals require Firebase' };
        }

        try {
            const db = firebase.firestore();

            const goal = {
                circleId: circleId,
                title: goalData.title,
                description: goalData.description,
                target: goalData.target,
                current: 0,
                type: goalData.type || 'collective', // collective, individual
                xpReward: goalData.xpReward || 500,
                deadline: goalData.deadline || null,
                participants: [],
                progress: {},
                createdBy: this.currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            };

            const docRef = await db.collection('circleGoals').add(goal);

            // Update circle
            await db.collection('circles').doc(circleId).update({
                goals: firebase.firestore.FieldValue.arrayUnion(docRef.id)
            });

            // Send announcement
            await this.sendMessage(circleId, {
                text: `📌 New shared goal: ${goal.title}`,
                type: 'system'
            });

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(30, 'Created shared goal', 'guilds');
            }

            return {
                success: true,
                message: 'Shared goal created! 📌',
                goal: { id: docRef.id, ...goal }
            };

        } catch (error) {
            console.error('Error creating shared goal:', error);
            return { success: false, message: 'Failed to create goal' };
        }
    }

    async contributeToGoal(goalId, amount) {
        if (this.useLocalStorage) {
            return { success: false };
        }

        try {
            const db = firebase.firestore();
            const goalRef = db.collection('circleGoals').doc(goalId);

            const goalDoc = await goalRef.get();
            if (!goalDoc.exists) {
                return { success: false, message: 'Goal not found' };
            }

            const goal = goalDoc.data();

            // Update progress
            await goalRef.update({
                current: firebase.firestore.FieldValue.increment(amount),
                [`progress.${this.currentUser.uid}`]: firebase.firestore.FieldValue.increment(amount)
            });

            // Check if goal completed
            const newCurrent = goal.current + amount;
            if (newCurrent >= goal.target && goal.status === 'active') {
                await this.completeCircleGoal(goalId);
            }

            // 🎯 AWARD XP for contribution
            if (window.progressSystem) {
                window.progressSystem.awardXP(20, 'Contributed to circle goal', 'guilds');
            }

            return {
                success: true,
                message: `Contributed ${amount} to goal!`
            };

        } catch (error) {
            console.error('Error contributing to goal:', error);
            return { success: false };
        }
    }

    async completeCircleGoal(goalId) {
        if (this.useLocalStorage) return;

        try {
            const db = firebase.firestore();
            const goalRef = db.collection('circleGoals').doc(goalId);

            const goalDoc = await goalRef.get();
            const goal = goalDoc.data();

            // Mark as completed
            await goalRef.update({
                status: 'completed',
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Get circle to notify members
            const circleDoc = await db.collection('circles').doc(goal.circleId).get();
            const circle = circleDoc.data();

            // Award XP to all participants
            circle.members.forEach(memberId => {
                // This would need a Cloud Function in production
                // For now, just send notification
            });

            // Send celebration message
            await this.sendMessage(goal.circleId, {
                text: `🎉 Shared goal completed: ${goal.title}! Everyone earns ${goal.xpReward} XP!`,
                type: 'system'
            });

            // 🎯 AWARD XP to current user
            if (window.progressSystem) {
                window.progressSystem.awardXP(goal.xpReward, `Circle goal completed: ${goal.title}`, 'guilds');
            }

        } catch (error) {
            console.error('Error completing goal:', error);
        }
    }

    async getCircleLeaderboard(circleId) {
        if (this.useLocalStorage) {
            return { success: false, members: [] };
        }

        try {
            const db = firebase.firestore();

            // Get circle members
            const circleDoc = await db.collection('circles').doc(circleId).get();
            if (!circleDoc.exists) {
                return { success: false, members: [] };
            }

            const circle = circleDoc.data();

            // Get member progress
            const memberProgress = await Promise.all(
                circle.members.map(async (memberId) => {
                    const progressDoc = await db.collection('userProgress').doc(memberId).get();
                    const userDoc = await db.collection('users').doc(memberId).get();

                    return {
                        uid: memberId,
                        name: userDoc.exists ? userDoc.data().displayName : 'User',
                        xp: progressDoc.exists ? progressDoc.data().xp : 0,
                        level: progressDoc.exists ? progressDoc.data().level : 1,
                        achievements: progressDoc.exists ? progressDoc.data().achievements?.length || 0 : 0
                    };
                })
            );

            // Sort by XP
            memberProgress.sort((a, b) => b.xp - a.xp);

            return {
                success: true,
                members: memberProgress
            };

        } catch (error) {
            console.error('Error getting leaderboard:', error);
            return { success: false, members: [] };
        }
    }

    openCirclesModal() {
        const modal = document.createElement('div');
        modal.className = 'circles-modal';
        modal.id = 'circlesModal';

        modal.innerHTML = `
            <div class="circles-modal-content">
                <div class="circles-modal-header">
                    <h2>🏰 Spiritual Circles</h2>
                    <button onclick="document.getElementById('circlesModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="circles-tabs">
                    <button class="circles-tab active" onclick="window.guildsSystem.switchCircleTab('my-circles')">
                        My Circles (${this.myCircles.length})
                    </button>
                    <button class="circles-tab" onclick="window.guildsSystem.switchCircleTab('discover')">
                        Discover
                    </button>
                    <button class="circles-tab" onclick="window.guildsSystem.switchCircleTab('create')">
                        Create Circle
                    </button>
                </div>

                <div class="circles-content" id="circlesContent">
                    ${this.renderMyCirclesTab()}
                </div>
            </div>
        `;

        this.addCirclesModalStyles();
        document.body.appendChild(modal);
    }

    switchCircleTab(tab) {
        const tabs = document.querySelectorAll('.circles-tab');
        tabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        const content = document.getElementById('circlesContent');

        switch(tab) {
            case 'my-circles':
                content.innerHTML = this.renderMyCirclesTab();
                break;
            case 'discover':
                content.innerHTML = this.renderDiscoverTab();
                this.loadDiscoverCircles();
                break;
            case 'create':
                content.innerHTML = this.renderCreateCircleTab();
                break;
        }
    }

    renderMyCirclesTab() {
        if (this.myCircles.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🏰</div>
                    <h3>No circles yet</h3>
                    <p>Join or create a circle to connect with fellow spiritual seekers!</p>
                </div>
            `;
        }

        return `
            <div class="circles-list">
                ${this.myCircles.map(circle => this.renderCircleCard(circle, true)).join('')}
            </div>
        `;
    }

    renderDiscoverTab() {
        return `
            <div class="discover-section">
                <div class="search-bar">
                    <input type="text" id="circleSearch" placeholder="Search circles..." class="search-input">
                    <button onclick="window.guildsSystem.searchCirclesFromModal()" class="search-btn">🔍</button>
                </div>

                <div class="circle-types">
                    ${['general', 'meditation', 'healing', 'manifestation', 'study', 'support'].map(type => `
                        <button onclick="window.guildsSystem.filterByType('${type}')" class="type-filter-btn">
                            ${this.getCircleTypeIcon(type)} ${type}
                        </button>
                    `).join('')}
                </div>

                <div id="discoverResults" class="circles-list">
                    <p class="loading-text">Loading circles...</p>
                </div>
            </div>
        `;
    }

    async loadDiscoverCircles() {
        const result = await this.searchCircles();
        const container = document.getElementById('discoverResults');

        if (container) {
            if (result.circles.length === 0) {
                container.innerHTML = '<p class="no-results">No circles found. Create the first one!</p>';
            } else {
                container.innerHTML = result.circles
                    .map(circle => this.renderCircleCard(circle, false))
                    .join('');
            }
        }
    }

    async searchCirclesFromModal() {
        const query = document.getElementById('circleSearch').value;
        const result = await this.searchCircles(query);
        const container = document.getElementById('discoverResults');

        if (container) {
            container.innerHTML = result.circles
                .map(circle => this.renderCircleCard(circle, false))
                .join('');
        }
    }

    async filterByType(type) {
        const result = await this.searchCircles('', { type });
        const container = document.getElementById('discoverResults');

        if (container) {
            container.innerHTML = result.circles
                .map(circle => this.renderCircleCard(circle, false))
                .join('');
        }
    }

    getCircleTypeIcon(type) {
        const icons = {
            general: '⭐',
            meditation: '🧘',
            healing: '💚',
            manifestation: '✨',
            study: '📚',
            support: '🤝'
        };
        return icons[type] || '⭐';
    }

    renderCircleCard(circle, isMember) {
        return `
            <div class="circle-card">
                <div class="circle-header">
                    <div class="circle-icon">${this.getCircleTypeIcon(circle.type)}</div>
                    <div class="circle-info">
                        <h3>${circle.name}</h3>
                        <p class="circle-desc">${circle.description}</p>
                    </div>
                </div>

                <div class="circle-stats">
                    <span>👥 ${circle.memberCount}/${circle.maxMembers}</span>
                    <span>⚡ ${circle.stats?.totalXP || 0} XP</span>
                    ${circle.isPrivate ? '<span>🔒 Private</span>' : '<span>🌐 Public</span>'}
                </div>

                ${circle.tags && circle.tags.length > 0 ? `
                    <div class="circle-tags">
                        ${circle.tags.map(tag => `<span class="circle-tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}

                <div class="circle-actions">
                    ${isMember ? `
                        <button onclick="window.guildsSystem.openCircleView('${circle.id}')" class="circle-btn primary">
                            🏰 Enter Circle
                        </button>
                        ${circle.creator === this.currentUser?.uid ? `
                            <button onclick="window.guildsSystem.deleteCircle('${circle.id}')" class="circle-btn danger">
                                Delete
                            </button>
                        ` : `
                            <button onclick="window.guildsSystem.leaveCircle('${circle.id}')" class="circle-btn">
                                Leave
                            </button>
                        `}
                    ` : `
                        <button onclick="window.guildsSystem.joinCircle('${circle.id}')" class="circle-btn primary">
                            Join Circle
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    renderCreateCircleTab() {
        return `
            <div class="create-circle-section">
                <form id="createCircleForm" class="create-circle-form">
                    <div class="form-group">
                        <label>🏰 Circle Name:</label>
                        <input type="text" id="circleName" placeholder="e.g., Meditation Masters" required class="form-input">
                    </div>

                    <div class="form-group">
                        <label>📝 Description:</label>
                        <textarea id="circleDescription" rows="4" placeholder="What is your circle about?" required class="form-textarea"></textarea>
                    </div>

                    <div class="form-group">
                        <label>🎯 Circle Type:</label>
                        <select id="circleType" class="form-select">
                            <option value="general">⭐ General</option>
                            <option value="meditation">🧘 Meditation</option>
                            <option value="healing">💚 Healing</option>
                            <option value="manifestation">✨ Manifestation</option>
                            <option value="study">📚 Study</option>
                            <option value="support">🤝 Support</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>👥 Max Members:</label>
                        <input type="number" id="circleMaxMembers" value="20" min="2" max="50" class="form-input">
                    </div>

                    <div class="form-group">
                        <label>🏷️ Tags (comma-separated):</label>
                        <input type="text" id="circleTags" placeholder="meditation, mindfulness, healing" class="form-input">
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="circlePrivate">
                            🔒 Make this circle private (invite-only)
                        </label>
                    </div>

                    <button type="button" onclick="window.guildsSystem.createCircleFromModal()" class="submit-btn">
                        🏰 Create Circle
                    </button>
                </form>
            </div>
        `;
    }

    async createCircleFromModal() {
        const name = document.getElementById('circleName').value.trim();
        const description = document.getElementById('circleDescription').value.trim();
        const type = document.getElementById('circleType').value;
        const maxMembers = parseInt(document.getElementById('circleMaxMembers').value);
        const tagsInput = document.getElementById('circleTags').value;
        const isPrivate = document.getElementById('circlePrivate').checked;

        const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

        const result = await this.createCircle({
            name,
            description,
            type,
            maxMembers,
            tags,
            isPrivate
        });

        if (result.success) {
            alert(result.message);
            this.switchCircleTab('my-circles');
        } else {
            alert(result.message);
        }
    }

    async openCircleView(circleId) {
        const circle = this.myCircles.find(c => c.id === circleId);
        if (!circle) return;

        const modal = document.createElement('div');
        modal.className = 'circle-view-modal';
        modal.id = 'circleViewModal';

        modal.innerHTML = `
            <div class="circle-view-content">
                <div class="circle-view-header">
                    <div>
                        <div class="circle-type-badge">${this.getCircleTypeIcon(circle.type)} ${circle.type}</div>
                        <h2>${circle.name}</h2>
                        <p>${circle.description}</p>
                    </div>
                    <button onclick="document.getElementById('circleViewModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="circle-view-tabs">
                    <button class="view-tab active" onclick="window.guildsSystem.switchViewTab('chat', '${circleId}')">
                        💬 Chat
                    </button>
                    <button class="view-tab" onclick="window.guildsSystem.switchViewTab('goals', '${circleId}')">
                        📌 Goals
                    </button>
                    <button class="view-tab" onclick="window.guildsSystem.switchViewTab('leaderboard', '${circleId}')">
                        🏆 Leaderboard
                    </button>
                    <button class="view-tab" onclick="window.guildsSystem.switchViewTab('members', '${circleId}')">
                        👥 Members (${circle.memberCount})
                    </button>
                </div>

                <div class="circle-view-body" id="circleViewBody">
                    ${this.renderChatTab(circleId)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup chat listener
        setTimeout(() => {
            this.setupCircleChat(circleId, 'circleChatMessages');
        }, 100);
    }

    switchViewTab(tab, circleId) {
        const tabs = document.querySelectorAll('.view-tab');
        tabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        const body = document.getElementById('circleViewBody');

        switch(tab) {
            case 'chat':
                body.innerHTML = this.renderChatTab(circleId);
                setTimeout(() => {
                    this.setupCircleChat(circleId, 'circleChatMessages');
                }, 100);
                break;
            case 'goals':
                body.innerHTML = this.renderGoalsTab(circleId);
                break;
            case 'leaderboard':
                body.innerHTML = this.renderLeaderboardTab(circleId);
                this.loadCircleLeaderboard(circleId);
                break;
            case 'members':
                body.innerHTML = this.renderMembersTab(circleId);
                break;
        }
    }

    renderChatTab(circleId) {
        return `
            <div class="circle-chat">
                <div class="chat-messages" id="circleChatMessages">
                    <p class="loading-text">Loading messages...</p>
                </div>

                <div class="chat-input-area">
                    <input type="text" id="circleChatInput" placeholder="Type your message..." class="chat-input">
                    <button onclick="window.guildsSystem.sendChatMessage('${circleId}')" class="send-btn">
                        📨 Send
                    </button>
                </div>
            </div>
        `;
    }

    async sendChatMessage(circleId) {
        const input = document.getElementById('circleChatInput');
        const text = input.value.trim();

        if (!text) return;

        const result = await this.sendMessage(circleId, { text, type: 'user' });

        if (result.success) {
            input.value = '';
        }
    }

    renderGoalsTab(circleId) {
        return `
            <div class="circle-goals">
                <button onclick="alert('Create goal feature coming soon!')" class="create-goal-btn">
                    📌 Create Shared Goal
                </button>

                <div id="circleGoalsList" class="goals-list">
                    <p class="empty-text">No active goals yet. Create one to get started!</p>
                </div>
            </div>
        `;
    }

    renderLeaderboardTab(circleId) {
        return `
            <div class="circle-leaderboard" id="circleLeaderboardContent">
                <p class="loading-text">Loading leaderboard...</p>
            </div>
        `;
    }

    async loadCircleLeaderboard(circleId) {
        const result = await this.getCircleLeaderboard(circleId);
        const container = document.getElementById('circleLeaderboardContent');

        if (!container) return;

        if (result.success && result.members.length > 0) {
            container.innerHTML = `
                <div class="leaderboard-list">
                    ${result.members.map((member, index) => `
                        <div class="leaderboard-item ${member.uid === this.currentUser?.uid ? 'own-rank' : ''}">
                            <div class="rank">#${index + 1}</div>
                            <div class="member-info">
                                <strong>${member.name}</strong>
                                <div class="member-stats">
                                    Level ${member.level} • ${member.xp.toLocaleString()} XP • ${member.achievements} achievements
                                </div>
                            </div>
                            ${index < 3 ? `<div class="medal">${['🥇', '🥈', '🥉'][index]}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            container.innerHTML = '<p class="empty-text">No leaderboard data available</p>';
        }
    }

    renderMembersTab(circleId) {
        return `
            <div class="circle-members">
                <p class="empty-text">Member list coming soon!</p>
            </div>
        `;
    }

    addCirclesModalStyles() {
        if (document.getElementById('circlesModalStyles')) return;

        const style = document.createElement('style');
        style.id = 'circlesModalStyles';
        style.textContent = `
            .circles-modal, .circle-view-modal {
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

            .circles-modal-content, .circle-view-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 900px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: slideUp 0.3s ease;
            }

            .circles-modal-header, .circle-view-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }

            .circle-view-header h2 {
                margin: 10px 0 5px 0;
            }

            .circle-view-header p {
                margin: 0;
                opacity: 0.95;
            }

            .circle-type-badge {
                display: inline-block;
                padding: 4px 12px;
                background: rgba(255,255,255,0.2);
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 8px;
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
                flex-shrink: 0;
            }

            .circles-tabs, .circle-view-tabs {
                display: flex;
                border-bottom: 2px solid #e0e0e0;
                background: #f9f9f9;
            }

            .circles-tab, .view-tab {
                flex: 1;
                padding: 15px;
                border: none;
                background: none;
                cursor: pointer;
                font-weight: 600;
                color: #666;
                transition: all 0.2s;
            }

            .circles-tab.active, .view-tab.active {
                color: #667eea;
                background: white;
                border-bottom: 3px solid #667eea;
            }

            .circles-content, .circle-view-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .circles-list {
                display: grid;
                gap: 20px;
            }

            .circle-card {
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 15px;
                padding: 20px;
                transition: all 0.2s;
            }

            .circle-card:hover {
                border-color: #667eea;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
            }

            .circle-header {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }

            .circle-icon {
                font-size: 40px;
                flex-shrink: 0;
            }

            .circle-info h3 {
                margin: 0 0 8px 0;
                font-size: 20px;
            }

            .circle-desc {
                margin: 0;
                color: #666;
                line-height: 1.5;
            }

            .circle-stats {
                display: flex;
                gap: 20px;
                margin: 15px 0;
                font-size: 14px;
                color: #666;
            }

            .circle-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 15px 0;
            }

            .circle-tag {
                padding: 4px 12px;
                background: #f0f0f0;
                color: #667eea;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }

            .circle-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }

            .circle-btn {
                flex: 1;
                padding: 10px 20px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }

            .circle-btn.primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
            }

            .circle-btn.primary:hover {
                transform: translateY(-2px);
            }

            .circle-btn.danger {
                border-color: #ef4444;
                color: #ef4444;
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

            .discover-section {
                max-width: 800px;
                margin: 0 auto;
            }

            .search-bar {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }

            .search-input {
                flex: 1;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 15px;
            }

            .search-btn {
                padding: 12px 24px;
                border: none;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
            }

            .circle-types {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 25px;
            }

            .type-filter-btn {
                padding: 8px 16px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
                text-transform: capitalize;
            }

            .type-filter-btn:hover {
                border-color: #667eea;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .create-circle-section {
                max-width: 600px;
                margin: 0 auto;
            }

            .create-circle-form {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 15px;
            }

            .form-group {
                margin-bottom: 20px;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }

            .form-input, .form-select, .form-textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 15px;
                font-family: inherit;
            }

            .form-textarea {
                resize: vertical;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
            }

            .checkbox-label input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .submit-btn {
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .submit-btn:hover {
                transform: translateY(-2px);
            }

            .circle-chat {
                display: flex;
                flex-direction: column;
                height: 500px;
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 10px;
                margin-bottom: 15px;
            }

            .chat-message {
                margin-bottom: 15px;
                padding: 12px;
                background: white;
                border-radius: 10px;
                max-width: 70%;
            }

            .chat-message.own-message {
                margin-left: auto;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .message-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 13px;
            }

            .message-time {
                opacity: 0.7;
                font-size: 12px;
            }

            .message-text {
                line-height: 1.5;
            }

            .system-message {
                text-align: center;
                padding: 8px;
                margin: 10px 0;
                color: #999;
                font-size: 13px;
                font-style: italic;
            }

            .chat-input-area {
                display: flex;
                gap: 10px;
            }

            .chat-input {
                flex: 1;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 15px;
            }

            .send-btn {
                padding: 12px 24px;
                border: none;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
            }

            .leaderboard-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .leaderboard-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: #f9f9f9;
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }

            .leaderboard-item.own-rank {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                border-left-color: #764ba2;
            }

            .rank {
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
                min-width: 50px;
            }

            .member-info {
                flex: 1;
            }

            .member-info strong {
                display: block;
                margin-bottom: 5px;
            }

            .member-stats {
                font-size: 13px;
                color: #666;
            }

            .medal {
                font-size: 32px;
            }

            .loading-text, .empty-text, .no-results {
                text-align: center;
                padding: 40px;
                color: #999;
            }

            .create-goal-btn {
                width: 100%;
                padding: 14px;
                border: 2px dashed #667eea;
                background: white;
                color: #667eea;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                margin-bottom: 20px;
                transition: all 0.2s;
            }

            .create-goal-btn:hover {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-style: solid;
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

// Initialize the guilds/circles system
if (typeof window !== 'undefined') {
    window.guildsSystem = new GuildsSystem();
    console.log('🏰 Guilds/Circles System ready!');
}
