/**
 * 🏆 Divine Temple Leaderboards System
 *
 * Features:
 * - Global leaderboards (top players by XP, level, achievements)
 * - Weekly leaderboards (reset every Monday)
 * - Section-specific leaderboards
 * - Friend leaderboards
 * - Circle leaderboards
 * - Real-time updates with Firebase
 * - Leaderboard rewards and achievements
 * - Multiple ranking categories
 */

class LeaderboardsSystem {
    constructor() {
        this.currentUser = null;
        this.useLocalStorage = false;
        this.leaderboards = {
            global: [],
            weekly: [],
            friends: [],
            sections: {}
        };
        this.rankingCategories = ['xp', 'level', 'achievements', 'streak', 'activities'];
        this.currentCategory = 'xp';
        this.currentView = 'global';
        this.updateInterval = null;
        this.init();
    }

    async init() {
        console.log('🏆 Leaderboards System initialized');

        // Check if Firebase is available
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('Firebase not available. Leaderboards will use local data only.');
            this.useLocalStorage = true;
            this.loadLocalData();
        } else {
            this.useLocalStorage = false;
            await this.initFirebase();
        }

        // Update leaderboards every 5 minutes
        this.updateInterval = setInterval(() => {
            this.refreshCurrentLeaderboard();
        }, 5 * 60 * 1000);

        // Check and award weekly rewards
        this.checkWeeklyRewards();
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

                    await this.loadGlobalLeaderboard();
                    await this.loadWeeklyLeaderboard();
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
        // For local storage, create mock leaderboard with current user
        this.currentUser = {
            uid: localStorage.getItem('divine_temple_user_id') || 'local_user_' + Date.now(),
            email: 'local@user.com',
            displayName: 'Local User'
        };

        // Create mock leaderboard data
        this.leaderboards.global = this.generateMockLeaderboard(50);
        this.leaderboards.weekly = this.generateMockLeaderboard(30);
    }

    generateMockLeaderboard(count) {
        const names = [
            'Spiritual Seeker', 'Mystic Master', 'Divine Soul', 'Enlightened One',
            'Cosmic Wanderer', 'Sacred Heart', 'Light Worker', 'Crystal Healer',
            'Meditation Guru', 'Zen Master', 'Chakra Aligner', 'Energy Healer'
        ];

        const leaderboard = [];
        for (let i = 0; i < count; i++) {
            leaderboard.push({
                uid: 'mock_' + i,
                displayName: names[i % names.length] + ' ' + (Math.floor(i / names.length) + 1),
                xp: Math.floor(Math.random() * 50000) + 1000,
                level: Math.floor(Math.random() * 50) + 1,
                achievements: Math.floor(Math.random() * 50),
                streak: Math.floor(Math.random() * 100),
                activities: Math.floor(Math.random() * 500)
            });
        }

        // Sort by XP
        leaderboard.sort((a, b) => b.xp - a.xp);
        return leaderboard;
    }

    async loadGlobalLeaderboard(category = 'xp', limit = 100) {
        if (this.useLocalStorage) return;

        try {
            const db = firebase.firestore();

            const snapshot = await db.collection('userProgress')
                .orderBy(category, 'desc')
                .limit(limit)
                .get();

            const leaderboard = [];
            for (const doc of snapshot.docs) {
                const progress = doc.data();

                // Get user profile
                const userDoc = await db.collection('users').doc(doc.id).get();
                const profile = userDoc.exists ? userDoc.data() : {};

                leaderboard.push({
                    uid: doc.id,
                    displayName: profile.displayName || profile.email?.split('@')[0] || 'Anonymous',
                    photoURL: profile.photoURL || null,
                    xp: progress.xp || 0,
                    level: progress.level || 1,
                    rank: progress.rank || 'Beginner',
                    achievements: progress.achievements?.length || 0,
                    streak: progress.streakDays || 0,
                    activities: progress.totalActivities || 0,
                    lastActive: progress.lastActive || null
                });
            }

            this.leaderboards.global = leaderboard;
            console.log(`Loaded global leaderboard: ${leaderboard.length} players`);

            // Dispatch event
            window.dispatchEvent(new CustomEvent('leaderboard-updated', {
                detail: { type: 'global', category }
            }));

        } catch (error) {
            console.error('Error loading global leaderboard:', error);
        }
    }

    async loadWeeklyLeaderboard(category = 'xp', limit = 50) {
        if (this.useLocalStorage) return;

        try {
            const db = firebase.firestore();

            // Get start of current week (Monday)
            const weekStart = this.getWeekStart();

            const snapshot = await db.collection('weeklyProgress')
                .where('weekStart', '==', weekStart.toISOString())
                .orderBy(category, 'desc')
                .limit(limit)
                .get();

            const leaderboard = [];
            for (const doc of snapshot.docs) {
                const progress = doc.data();

                const userDoc = await db.collection('users').doc(progress.userId).get();
                const profile = userDoc.exists ? userDoc.data() : {};

                leaderboard.push({
                    uid: progress.userId,
                    displayName: profile.displayName || 'Anonymous',
                    photoURL: profile.photoURL || null,
                    xp: progress.xp || 0,
                    level: progress.level || 1,
                    achievements: progress.achievements || 0,
                    activities: progress.activities || 0
                });
            }

            this.leaderboards.weekly = leaderboard;
            console.log(`Loaded weekly leaderboard: ${leaderboard.length} players`);

            window.dispatchEvent(new CustomEvent('leaderboard-updated', {
                detail: { type: 'weekly', category }
            }));

        } catch (error) {
            console.error('Error loading weekly leaderboard:', error);
        }
    }

    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        const weekStart = new Date(now.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    }

    async updateWeeklyProgress(xpGained, activitiesCount = 1) {
        if (this.useLocalStorage || !this.currentUser) return;

        try {
            const db = firebase.firestore();
            const weekStart = this.getWeekStart();

            const weeklyDocId = `${this.currentUser.uid}_${weekStart.toISOString()}`;
            const weeklyRef = db.collection('weeklyProgress').doc(weeklyDocId);

            await weeklyRef.set({
                userId: this.currentUser.uid,
                weekStart: weekStart.toISOString(),
                xp: firebase.firestore.FieldValue.increment(xpGained),
                activities: firebase.firestore.FieldValue.increment(activitiesCount),
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

        } catch (error) {
            console.error('Error updating weekly progress:', error);
        }
    }

    async loadFriendsLeaderboard() {
        if (this.useLocalStorage) {
            this.leaderboards.friends = this.generateMockLeaderboard(10);
            return;
        }

        if (!window.friendSystem || !window.friendSystem.friends) {
            this.leaderboards.friends = [];
            return;
        }

        try {
            const db = firebase.firestore();
            const friendIds = window.friendSystem.friends;

            if (friendIds.length === 0) {
                this.leaderboards.friends = [];
                return;
            }

            const leaderboard = [];
            for (const friendId of friendIds) {
                const progressDoc = await db.collection('userProgress').doc(friendId).get();
                const userDoc = await db.collection('users').doc(friendId).get();

                if (progressDoc.exists && userDoc.exists) {
                    const progress = progressDoc.data();
                    const profile = userDoc.data();

                    leaderboard.push({
                        uid: friendId,
                        displayName: profile.displayName || 'Friend',
                        photoURL: profile.photoURL || null,
                        xp: progress.xp || 0,
                        level: progress.level || 1,
                        achievements: progress.achievements?.length || 0,
                        streak: progress.streakDays || 0
                    });
                }
            }

            // Add current user
            if (window.progressSystem) {
                leaderboard.push({
                    uid: this.currentUser.uid,
                    displayName: this.currentUser.displayName,
                    xp: window.progressSystem.xp,
                    level: window.progressSystem.level,
                    achievements: window.progressSystem.achievements.length,
                    streak: window.progressSystem.streakDays
                });
            }

            // Sort by XP
            leaderboard.sort((a, b) => b.xp - a.xp);
            this.leaderboards.friends = leaderboard;

            window.dispatchEvent(new CustomEvent('leaderboard-updated', {
                detail: { type: 'friends' }
            }));

        } catch (error) {
            console.error('Error loading friends leaderboard:', error);
        }
    }

    async loadSectionLeaderboard(section, limit = 50) {
        if (this.useLocalStorage) {
            this.leaderboards.sections[section] = this.generateMockLeaderboard(20);
            return;
        }

        try {
            const db = firebase.firestore();

            const snapshot = await db.collection('userProgress')
                .orderBy(`sectionProgress.${section}.xp`, 'desc')
                .limit(limit)
                .get();

            const leaderboard = [];
            for (const doc of snapshot.docs) {
                const progress = doc.data();
                const sectionData = progress.sectionProgress?.[section] || {};

                const userDoc = await db.collection('users').doc(doc.id).get();
                const profile = userDoc.exists ? userDoc.data() : {};

                leaderboard.push({
                    uid: doc.id,
                    displayName: profile.displayName || 'Anonymous',
                    photoURL: profile.photoURL || null,
                    xp: sectionData.xp || 0,
                    activities: sectionData.activities || 0,
                    lastActive: sectionData.lastActive || null
                });
            }

            this.leaderboards.sections[section] = leaderboard;

            window.dispatchEvent(new CustomEvent('leaderboard-updated', {
                detail: { type: 'section', section }
            }));

        } catch (error) {
            console.error(`Error loading section leaderboard for ${section}:`, error);
        }
    }

    async getMyRank(type = 'global', category = 'xp') {
        if (!this.currentUser) return null;

        const leaderboard = this.leaderboards[type] || [];
        const myIndex = leaderboard.findIndex(player => player.uid === this.currentUser.uid);

        if (myIndex === -1) {
            // User not in leaderboard yet
            return {
                rank: null,
                percentile: null,
                message: 'Keep playing to join the leaderboard!'
            };
        }

        const rank = myIndex + 1;
        const percentile = ((leaderboard.length - myIndex) / leaderboard.length * 100).toFixed(1);

        return {
            rank,
            percentile,
            total: leaderboard.length,
            player: leaderboard[myIndex]
        };
    }

    async checkWeeklyRewards() {
        if (this.useLocalStorage || !this.currentUser) return;

        const lastCheck = localStorage.getItem('last_weekly_reward_check');
        const weekStart = this.getWeekStart().toISOString();

        if (lastCheck === weekStart) return; // Already checked this week

        try {
            const db = firebase.firestore();

            // Get last week's rank
            const lastWeek = new Date(this.getWeekStart());
            lastWeek.setDate(lastWeek.getDate() - 7);

            const lastWeekDoc = await db.collection('weeklyProgress')
                .doc(`${this.currentUser.uid}_${lastWeek.toISOString()}`)
                .get();

            if (lastWeekDoc.exists) {
                const data = lastWeekDoc.data();

                // Get last week's leaderboard to calculate rank
                const lastWeekSnapshot = await db.collection('weeklyProgress')
                    .where('weekStart', '==', lastWeek.toISOString())
                    .orderBy('xp', 'desc')
                    .get();

                let rank = 0;
                lastWeekSnapshot.forEach((doc, index) => {
                    if (doc.data().userId === this.currentUser.uid) {
                        rank = index + 1;
                    }
                });

                // Award rewards based on rank
                if (rank > 0) {
                    const rewards = this.calculateWeeklyRewards(rank, lastWeekSnapshot.size);

                    if (rewards.xp > 0 && window.progressSystem) {
                        window.progressSystem.awardXP(
                            rewards.xp,
                            `Weekly Leaderboard Reward: Rank #${rank}! 🏆`,
                            'leaderboards'
                        );

                        this.showWeeklyRewardNotification(rank, rewards);
                    }
                }
            }

            localStorage.setItem('last_weekly_reward_check', weekStart);

        } catch (error) {
            console.error('Error checking weekly rewards:', error);
        }
    }

    calculateWeeklyRewards(rank, totalPlayers) {
        let xp = 0;
        let badge = null;

        if (rank === 1) {
            xp = 1000;
            badge = '🥇 Weekly Champion';
        } else if (rank === 2) {
            xp = 750;
            badge = '🥈 Weekly Runner-up';
        } else if (rank === 3) {
            xp = 500;
            badge = '🥉 Weekly Bronze';
        } else if (rank <= 10) {
            xp = 300;
            badge = '⭐ Top 10';
        } else if (rank <= 25) {
            xp = 150;
            badge = '✨ Top 25';
        } else if (rank <= 50) {
            xp = 75;
            badge = '💫 Top 50';
        } else if (rank <= totalPlayers * 0.1) {
            xp = 50;
            badge = '🌟 Top 10%';
        }

        return { xp, badge, rank, totalPlayers };
    }

    showWeeklyRewardNotification(rank, rewards) {
        const notification = document.createElement('div');
        notification.className = 'weekly-reward-notification';
        notification.innerHTML = `
            <div class="reward-notification-content">
                <div class="reward-icon">🏆</div>
                <div class="reward-text">
                    <h4>Weekly Leaderboard Reward!</h4>
                    <p>${rewards.badge}</p>
                    <p class="reward-xp">+${rewards.xp} XP</p>
                    <p class="reward-rank">You ranked #${rank} out of ${rewards.totalPlayers} players!</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 8000);
    }

    refreshCurrentLeaderboard() {
        switch(this.currentView) {
            case 'global':
                this.loadGlobalLeaderboard(this.currentCategory);
                break;
            case 'weekly':
                this.loadWeeklyLeaderboard(this.currentCategory);
                break;
            case 'friends':
                this.loadFriendsLeaderboard();
                break;
        }
    }

    openLeaderboardModal() {
        const modal = document.createElement('div');
        modal.className = 'leaderboard-modal';
        modal.id = 'leaderboardModal';

        modal.innerHTML = `
            <div class="leaderboard-modal-content">
                <div class="leaderboard-modal-header">
                    <h2>🏆 Leaderboards</h2>
                    <button onclick="document.getElementById('leaderboardModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="leaderboard-tabs">
                    <button class="leaderboard-tab active" onclick="window.leaderboardsSystem.switchLeaderboardTab('global')">
                        🌍 Global
                    </button>
                    <button class="leaderboard-tab" onclick="window.leaderboardsSystem.switchLeaderboardTab('weekly')">
                        📅 Weekly
                    </button>
                    <button class="leaderboard-tab" onclick="window.leaderboardsSystem.switchLeaderboardTab('friends')">
                        👥 Friends
                    </button>
                </div>

                <div class="leaderboard-categories">
                    ${this.rankingCategories.map(cat => `
                        <button class="category-btn ${cat === this.currentCategory ? 'active' : ''}"
                                onclick="window.leaderboardsSystem.switchCategory('${cat}')">
                            ${this.getCategoryIcon(cat)} ${cat.toUpperCase()}
                        </button>
                    `).join('')}
                </div>

                <div class="my-rank-banner" id="myRankBanner">
                    ${this.renderMyRankBanner()}
                </div>

                <div class="leaderboard-content" id="leaderboardContent">
                    ${this.renderLeaderboardList('global')}
                </div>
            </div>
        `;

        this.addLeaderboardStyles();
        document.body.appendChild(modal);
    }

    async switchLeaderboardTab(tab) {
        this.currentView = tab;

        const tabs = document.querySelectorAll('.leaderboard-tab');
        tabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        const content = document.getElementById('leaderboardContent');
        content.innerHTML = '<p class="loading-text">Loading...</p>';

        // Load data if not cached
        if (tab === 'global' && this.leaderboards.global.length === 0) {
            await this.loadGlobalLeaderboard(this.currentCategory);
        } else if (tab === 'weekly' && this.leaderboards.weekly.length === 0) {
            await this.loadWeeklyLeaderboard(this.currentCategory);
        } else if (tab === 'friends') {
            await this.loadFriendsLeaderboard();
        }

        content.innerHTML = this.renderLeaderboardList(tab);

        // Update my rank banner
        const myRankBanner = document.getElementById('myRankBanner');
        if (myRankBanner) {
            myRankBanner.innerHTML = await this.renderMyRankBanner(tab);
        }
    }

    async switchCategory(category) {
        this.currentCategory = category;

        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Reload leaderboard with new category
        const content = document.getElementById('leaderboardContent');
        content.innerHTML = '<p class="loading-text">Loading...</p>';

        if (this.currentView === 'global') {
            await this.loadGlobalLeaderboard(category);
        } else if (this.currentView === 'weekly') {
            await this.loadWeeklyLeaderboard(category);
        }

        content.innerHTML = this.renderLeaderboardList(this.currentView);
    }

    getCategoryIcon(category) {
        const icons = {
            xp: '⚡',
            level: '🎯',
            achievements: '🏆',
            streak: '🔥',
            activities: '📊'
        };
        return icons[category] || '⭐';
    }

    async renderMyRankBanner(type = 'global') {
        const myRank = await this.getMyRank(type, this.currentCategory);

        if (!myRank || !myRank.rank) {
            return `
                <div class="rank-banner-content">
                    <div class="rank-icon">📊</div>
                    <div class="rank-info">
                        <div class="rank-label">Your Rank</div>
                        <div class="rank-value">Not yet ranked</div>
                        <div class="rank-message">${myRank?.message || 'Keep playing to join!'}</div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="rank-banner-content ${myRank.rank <= 3 ? 'top-rank' : ''}">
                <div class="rank-icon">${this.getRankMedal(myRank.rank)}</div>
                <div class="rank-info">
                    <div class="rank-label">Your Rank</div>
                    <div class="rank-value">#${myRank.rank} <span class="rank-total">/ ${myRank.total}</span></div>
                    <div class="rank-percentile">Top ${myRank.percentile}%</div>
                </div>
                <div class="rank-stats">
                    <div class="stat-item">
                        <div class="stat-value">${myRank.player.xp.toLocaleString()}</div>
                        <div class="stat-label">XP</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${myRank.player.level}</div>
                        <div class="stat-label">Level</div>
                    </div>
                </div>
            </div>
        `;
    }

    getRankMedal(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        if (rank <= 10) return '⭐';
        if (rank <= 25) return '✨';
        return '📊';
    }

    renderLeaderboardList(type) {
        const leaderboard = this.leaderboards[type] || [];

        if (leaderboard.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🏆</div>
                    <h3>No rankings yet</h3>
                    <p>Be the first to join the leaderboard!</p>
                </div>
            `;
        }

        return `
            <div class="leaderboard-list">
                ${leaderboard.slice(0, 100).map((player, index) => this.renderLeaderboardItem(player, index + 1)).join('')}
            </div>
        `;
    }

    renderLeaderboardItem(player, rank) {
        const isCurrentUser = player.uid === this.currentUser?.uid;

        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''} ${rank <= 3 ? 'top-three' : ''}">
                <div class="item-rank">
                    ${rank <= 3 ? this.getRankMedal(rank) : `#${rank}`}
                </div>

                <div class="item-avatar">
                    ${player.photoURL ?
                        `<img src="${player.photoURL}" alt="${player.displayName}">` :
                        `<div class="avatar-placeholder">${(player.displayName || 'U')[0].toUpperCase()}</div>`
                    }
                </div>

                <div class="item-info">
                    <div class="item-name">
                        ${player.displayName}
                        ${isCurrentUser ? '<span class="you-badge">YOU</span>' : ''}
                    </div>
                    <div class="item-stats">
                        ${this.renderPlayerStats(player)}
                    </div>
                </div>

                <div class="item-score">
                    ${this.renderScoreByCategory(player, this.currentCategory)}
                </div>
            </div>
        `;
    }

    renderPlayerStats(player) {
        return `
            <span>Lvl ${player.level || 1}</span>
            ${player.achievements !== undefined ? `<span>• ${player.achievements} 🏆</span>` : ''}
            ${player.streak !== undefined ? `<span>• ${player.streak} 🔥</span>` : ''}
        `;
    }

    renderScoreByCategory(player, category) {
        const value = player[category] || 0;

        switch(category) {
            case 'xp':
                return `
                    <div class="score-value">${value.toLocaleString()}</div>
                    <div class="score-label">XP</div>
                `;
            case 'level':
                return `
                    <div class="score-value">${value}</div>
                    <div class="score-label">Level</div>
                `;
            case 'achievements':
                return `
                    <div class="score-value">${value}</div>
                    <div class="score-label">🏆</div>
                `;
            case 'streak':
                return `
                    <div class="score-value">${value}</div>
                    <div class="score-label">Days 🔥</div>
                `;
            case 'activities':
                return `
                    <div class="score-value">${value}</div>
                    <div class="score-label">Activities</div>
                `;
            default:
                return '';
        }
    }

    addLeaderboardStyles() {
        if (document.getElementById('leaderboardStyles')) return;

        const style = document.createElement('style');
        style.id = 'leaderboardStyles';
        style.textContent = `
            .leaderboard-modal {
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

            .leaderboard-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: slideUp 0.3s ease;
            }

            .leaderboard-modal-header {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 25px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .leaderboard-modal-header h2 {
                margin: 0;
                font-size: 28px;
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

            .leaderboard-tabs {
                display: flex;
                border-bottom: 2px solid #e0e0e0;
                background: #f9f9f9;
            }

            .leaderboard-tab {
                flex: 1;
                padding: 15px;
                border: none;
                background: none;
                cursor: pointer;
                font-weight: 600;
                color: #666;
                transition: all 0.2s;
            }

            .leaderboard-tab.active {
                color: #f5576c;
                background: white;
                border-bottom: 3px solid #f5576c;
            }

            .leaderboard-categories {
                display: flex;
                gap: 8px;
                padding: 15px 20px;
                background: #f9f9f9;
                border-bottom: 1px solid #e0e0e0;
                overflow-x: auto;
            }

            .category-btn {
                padding: 8px 16px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 20px;
                cursor: pointer;
                font-weight: 600;
                font-size: 13px;
                transition: all 0.2s;
                white-space: nowrap;
            }

            .category-btn.active {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                border-color: transparent;
            }

            .my-rank-banner {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                margin: 20px;
                border-radius: 15px;
            }

            .rank-banner-content {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .rank-banner-content.top-rank {
                background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
                padding: 10px;
                border-radius: 12px;
                margin: -10px;
            }

            .rank-icon {
                font-size: 48px;
                flex-shrink: 0;
            }

            .rank-info {
                flex: 1;
            }

            .rank-label {
                font-size: 13px;
                opacity: 0.9;
                margin-bottom: 5px;
            }

            .rank-value {
                font-size: 32px;
                font-weight: bold;
                line-height: 1;
                margin-bottom: 5px;
            }

            .rank-total {
                font-size: 18px;
                opacity: 0.8;
            }

            .rank-percentile, .rank-message {
                font-size: 14px;
                opacity: 0.9;
            }

            .rank-stats {
                display: flex;
                gap: 20px;
            }

            .stat-item {
                text-align: center;
            }

            .stat-value {
                font-size: 24px;
                font-weight: bold;
            }

            .stat-label {
                font-size: 12px;
                opacity: 0.9;
                margin-top: 2px;
            }

            .leaderboard-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
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
                border-radius: 12px;
                transition: all 0.2s;
            }

            .leaderboard-item:hover {
                background: #f0f0f0;
                transform: translateX(5px);
            }

            .leaderboard-item.top-three {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 140, 0, 0.1) 100%);
                border-left: 4px solid #ffd700;
            }

            .leaderboard-item.current-user {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
                border-left: 4px solid #667eea;
                box-shadow: 0 2px 10px rgba(102, 126, 234, 0.2);
            }

            .item-rank {
                font-size: 24px;
                font-weight: bold;
                color: #666;
                min-width: 50px;
                text-align: center;
            }

            .leaderboard-item.top-three .item-rank {
                font-size: 32px;
            }

            .item-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                flex-shrink: 0;
            }

            .item-avatar img {
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

            .item-info {
                flex: 1;
            }

            .item-name {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .you-badge {
                background: #667eea;
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: bold;
            }

            .item-stats {
                font-size: 13px;
                color: #666;
            }

            .item-score {
                text-align: right;
            }

            .score-value {
                font-size: 24px;
                font-weight: bold;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .score-label {
                font-size: 12px;
                color: #999;
                margin-top: 2px;
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

            .loading-text {
                text-align: center;
                padding: 40px;
                color: #999;
            }

            .weekly-reward-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10001;
                background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
                color: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(255, 140, 0, 0.5);
                animation: slideInRight 0.5s ease;
                max-width: 400px;
            }

            .reward-notification-content {
                display: flex;
                gap: 20px;
                align-items: flex-start;
            }

            .reward-icon {
                font-size: 48px;
            }

            .reward-text h4 {
                margin: 0 0 8px 0;
                font-size: 18px;
            }

            .reward-text p {
                margin: 5px 0;
            }

            .reward-xp {
                font-size: 24px;
                font-weight: bold;
            }

            .reward-rank {
                font-size: 13px;
                opacity: 0.95;
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

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize the leaderboards system
if (typeof window !== 'undefined') {
    window.leaderboardsSystem = new LeaderboardsSystem();
    console.log('🏆 Leaderboards System ready!');

    // Listen for XP awards to update weekly progress
    window.addEventListener('xp-awarded', (e) => {
        if (window.leaderboardsSystem) {
            window.leaderboardsSystem.updateWeeklyProgress(e.detail.amount, 1);
        }
    });
}
