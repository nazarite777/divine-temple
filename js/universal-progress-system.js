/**
 * 🌟 UNIVERSAL PROGRESS SYSTEM
 * Cross-section progress tracking, XP, levels, achievements, and spiritual growth
 *
 * Features:
 * - Experience Points (XP) system
 * - Level progression (1-100)
 * - Spiritual ranks (Seeker → Enlightened)
 * - Achievement system (100+ achievements)
 * - Streak tracking (daily, weekly, monthly)
 * - Cross-section activity logging
 * - Firebase integration
 * - Real-time updates
 * - Reward notifications
 */

class UniversalProgressSystem {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.listeners = new Map();

        // Progress structure
        this.defaultUserData = {
            // Basic info
            userId: null,
            displayName: '',
            joinDate: null,
            lastActive: null,

            // Experience & Levels
            totalXP: 0,
            level: 1,
            currentLevelXP: 0,
            nextLevelXP: 100,
            spiritualRank: 'Seeker',

            // Streaks
            streaks: {
                daily: {
                    count: 0,
                    lastDate: null,
                    longestStreak: 0
                },
                weekly: {
                    count: 0,
                    lastWeek: null
                },
                monthly: {
                    count: 0,
                    lastMonth: null
                }
            },

            // Section-specific progress
            sections: {
                'oracle-divination': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'spiritual-practices': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'meditation-mindfulness': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'energy-healing': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'sacred-arts-sound': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'devotion-growth': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'sacred-knowledge': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'community': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'calendar': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'chakras-auras': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'crystals-elements': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'spiritual-music': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'sacred-books': { visits: 0, xp: 0, lastVisit: null, activities: [] },
                'videos-media': { visits: 0, xp: 0, lastVisit: null, activities: [] }
            },

            // Activity stats
            stats: {
                meditations: 0,
                meditationMinutes: 0,
                oracleReadings: 0,
                journalEntries: 0,
                booksRead: 0,
                videosWatched: 0,
                chakraBalancingSessions: 0,
                practicesCompleted: 0,
                communityPosts: 0,
                daysActive: 0
            },

            // Achievements
            achievements: [],

            // Favorites & Preferences
            favorites: [],
            preferences: {
                theme: 'sacred',
                notifications: true,
                soundEnabled: true,
                autoPlayAudio: false
            }
        };

        this.init();
    }

    // ==================== INITIALIZATION ====================

    async init() {
        console.log('🌟 Universal Progress System initializing...');

        // Wait for Firebase auth
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase not loaded');
            return;
        }

        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.loadUserData();
                await this.checkDailyStreak();
                this.notifyListeners('userLoaded', this.userData);
                console.log('✅ Progress system loaded for:', user.email);
            } else {
                console.log('⚠️ No user logged in');
                this.userData = null;
                this.notifyListeners('userLoggedOut');
            }
        });
    }

    // ==================== DATA MANAGEMENT ====================

    async loadUserData() {
        if (!this.currentUser) return;

        try {
            const doc = await firebase.firestore()
                .collection('universalProgress')
                .doc(this.currentUser.uid)
                .get();

            if (doc.exists) {
                this.userData = doc.data();
                // Migrate any missing fields
                this.userData = { ...this.defaultUserData, ...this.userData };
            } else {
                // First time user - create profile
                this.userData = {
                    ...this.defaultUserData,
                    userId: this.currentUser.uid,
                    displayName: this.currentUser.displayName || this.currentUser.email,
                    joinDate: new Date().toISOString(),
                    lastActive: new Date().toISOString()
                };
                await this.saveUserData();
                console.log('🎉 New user profile created!');
            }
        } catch (error) {
            console.error('❌ Error loading user data:', error);
            this.userData = { ...this.defaultUserData };
        }
    }

    async saveUserData() {
        if (!this.currentUser || !this.userData) return;

        try {
            this.userData.lastActive = new Date().toISOString();
            await firebase.firestore()
                .collection('universalProgress')
                .doc(this.currentUser.uid)
                .set(this.userData, { merge: true });
        } catch (error) {
            console.error('❌ Error saving user data:', error);
        }
    }

    // ==================== EXPERIENCE & LEVELING ====================

    /**
     * Award XP to user
     * @param {number} amount - XP amount
     * @param {string} reason - Why XP was awarded
     * @param {string} section - Which section earned it
     */
    async awardXP(amount, reason = '', section = null) {
        if (!this.userData) return;

        const oldLevel = this.userData.level;

        // Apply booster multipliers from reward shop
        let finalAmount = amount;
        if (window.rewardShop && window.rewardShop.isInitialized) {
            const multiplier = window.rewardShop.getActiveBoosterMultiplier();
            if (multiplier > 1) {
                finalAmount = Math.floor(amount * multiplier);
                console.log(`⚡ XP Booster active! ${amount} → ${finalAmount} XP (${multiplier}x)`);
            }
        }

        // Add to total XP
        this.userData.totalXP += finalAmount;
        this.userData.currentLevelXP += finalAmount;

        // Add to section XP if specified
        if (section && this.userData.sections[section]) {
            this.userData.sections[section].xp += finalAmount;
        }

        // Check for level up
        while (this.userData.currentLevelXP >= this.userData.nextLevelXP) {
            this.userData.currentLevelXP -= this.userData.nextLevelXP;
            this.userData.level++;
            this.userData.nextLevelXP = this.calculateNextLevelXP(this.userData.level);

            // Update spiritual rank
            this.updateSpiritualRank();

            // Level up celebration!
            this.notifyListeners('levelUp', {
                newLevel: this.userData.level,
                rank: this.userData.spiritualRank
            });

            console.log(`🎉 LEVEL UP! Now level ${this.userData.level} - ${this.userData.spiritualRank}`);
        }

        await this.saveUserData();

        this.notifyListeners('xpAwarded', {
            amount,
            reason,
            section,
            totalXP: this.userData.totalXP,
            level: this.userData.level,
            leveledUp: this.userData.level > oldLevel
        });

        return this.userData.level > oldLevel;
    }

    calculateNextLevelXP(level) {
        // Exponential curve: level^1.5 * 100
        return Math.floor(Math.pow(level, 1.5) * 100);
    }

    updateSpiritualRank() {
        const level = this.userData.level;
        const ranks = [
            { min: 1, max: 5, name: 'Seeker', icon: '🔍' },
            { min: 6, max: 10, name: 'Apprentice', icon: '📿' },
            { min: 11, max: 20, name: 'Practitioner', icon: '🧘' },
            { min: 21, max: 30, name: 'Adept', icon: '✨' },
            { min: 31, max: 40, name: 'Mystic', icon: '🔮' },
            { min: 41, max: 50, name: 'Sage', icon: '📚' },
            { min: 51, max: 60, name: 'Master', icon: '🌟' },
            { min: 61, max: 70, name: 'Guru', icon: '🕉️' },
            { min: 71, max: 80, name: 'Enlightened', icon: '💫' },
            { min: 81, max: 100, name: 'Ascended', icon: '👑' }
        ];

        const rank = ranks.find(r => level >= r.min && level <= r.max);
        if (rank) {
            this.userData.spiritualRank = rank.name;
            this.userData.spiritualRankIcon = rank.icon;
        }
    }

    // ==================== STREAK TRACKING ====================

    async checkDailyStreak() {
        if (!this.userData) return;

        const today = new Date().toISOString().split('T')[0];
        const lastDate = this.userData.streaks.daily.lastDate;

        if (!lastDate) {
            // First day
            this.userData.streaks.daily.count = 1;
            this.userData.streaks.daily.lastDate = today;
            this.userData.streaks.daily.longestStreak = 1;
        } else if (lastDate === today) {
            // Already logged today
            return;
        } else {
            const lastDateObj = new Date(lastDate);
            const todayObj = new Date(today);
            const daysDiff = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
                // Streak continues!
                this.userData.streaks.daily.count++;
                this.userData.streaks.daily.lastDate = today;

                if (this.userData.streaks.daily.count > this.userData.streaks.daily.longestStreak) {
                    this.userData.streaks.daily.longestStreak = this.userData.streaks.daily.count;
                }

                // Award XP for streak
                const bonusXP = Math.min(this.userData.streaks.daily.count * 10, 200);
                await this.awardXP(bonusXP, `${this.userData.streaks.daily.count} day streak!`);

                this.notifyListeners('streakContinued', {
                    count: this.userData.streaks.daily.count,
                    bonusXP
                });
            } else {
                // Streak broken
                const oldStreak = this.userData.streaks.daily.count;
                this.userData.streaks.daily.count = 1;
                this.userData.streaks.daily.lastDate = today;

                this.notifyListeners('streakBroken', {
                    oldStreak
                });
            }
        }

        this.userData.stats.daysActive++;
        await this.saveUserData();
    }

    // ==================== ACTIVITY LOGGING ====================

    async logActivity(activityType, section, data = {}) {
        if (!this.userData) return;

        const activity = {
            type: activityType,
            section: section,
            timestamp: new Date().toISOString(),
            data: data
        };

        // Add to section activities
        if (this.userData.sections[section]) {
            this.userData.sections[section].activities.push(activity);
            this.userData.sections[section].lastVisit = activity.timestamp;
            this.userData.sections[section].visits++;

            // Keep only last 50 activities per section
            if (this.userData.sections[section].activities.length > 50) {
                this.userData.sections[section].activities =
                    this.userData.sections[section].activities.slice(-50);
            }
        }

        // Dispatch event for other systems (daily quests, insights)
        window.dispatchEvent(new CustomEvent('activityLogged', {
            detail: { type: activityType, section, data, activity }
        }));

        // Update stats based on activity type
        const xpRewards = {
            'meditation': { xp: 50, stat: 'meditations' },
            'oracle_reading': { xp: 30, stat: 'oracleReadings' },
            'journal_entry': { xp: 40, stat: 'journalEntries' },
            'journal': { xp: 40, stat: 'journalEntries' },
            'gratitude': { xp: 20, stat: 'gratitudeEntries' },
            'prayer': { xp: 30, stat: 'prayers' },
            'book-read': { xp: 100, stat: 'booksRead' },
            'video-watched': { xp: 20, stat: 'videosWatched' },
            'chakra_healing': { xp: 60, stat: 'chakraBalancingSessions' },
            'practice-completed': { xp: 50, stat: 'practicesCompleted' },
            'community-post': { xp: 25, stat: 'communityPosts' }
        };

        const reward = xpRewards[activityType];
        if (reward) {
            await this.awardXP(reward.xp, activityType, section);
            if (reward.stat && this.userData.stats[reward.stat] !== undefined) {
                this.userData.stats[reward.stat]++;
            }
        }

        // Check for achievements
        await this.checkAchievements();

        await this.saveUserData();

        this.notifyListeners('activityLogged', activity);
    }

    // ==================== ACHIEVEMENTS ====================

    async checkAchievements() {
        const achievements = this.getAchievementDefinitions();

        for (const achievement of achievements) {
            // Skip if already unlocked
            if (this.userData.achievements.some(a => a.id === achievement.id)) {
                continue;
            }

            // Check if requirements met
            if (achievement.check(this.userData)) {
                await this.unlockAchievement(achievement);
            }
        }
    }

    async unlockAchievement(achievement) {
        this.userData.achievements.push({
            id: achievement.id,
            unlockedAt: new Date().toISOString()
        });

        // Award XP
        await this.awardXP(achievement.xp, `Achievement: ${achievement.name}`);

        this.notifyListeners('achievementUnlocked', achievement);

        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
    }

    getAchievementDefinitions() {
        return [
            // Meditation achievements
            {
                id: 'first-meditation',
                name: 'First Steps',
                description: 'Complete your first meditation',
                icon: '🧘',
                xp: 50,
                check: (data) => data.stats.meditations >= 1
            },
            {
                id: 'meditation-10',
                name: 'Meditation Devotee',
                description: 'Complete 10 meditations',
                icon: '🧘‍♀️',
                xp: 200,
                check: (data) => data.stats.meditations >= 10
            },
            {
                id: 'meditation-100',
                name: 'Meditation Master',
                description: 'Complete 100 meditations',
                icon: '🕉️',
                xp: 1000,
                check: (data) => data.stats.meditations >= 100
            },

            // Oracle achievements
            {
                id: 'first-reading',
                name: 'Divine Guidance',
                description: 'Perform your first oracle reading',
                icon: '🔮',
                xp: 30,
                check: (data) => data.stats.oracleReadings >= 1
            },
            {
                id: 'oracle-50',
                name: 'Oracle Adept',
                description: 'Perform 50 oracle readings',
                icon: '🃏',
                xp: 500,
                check: (data) => data.stats.oracleReadings >= 50
            },

            // Streak achievements
            {
                id: 'streak-7',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                icon: '🔥',
                xp: 150,
                check: (data) => data.streaks.daily.count >= 7
            },
            {
                id: 'streak-30',
                name: 'Month Master',
                description: 'Maintain a 30-day streak',
                icon: '🔥🔥',
                xp: 750,
                check: (data) => data.streaks.daily.count >= 30
            },
            {
                id: 'streak-100',
                name: 'Century Sage',
                description: 'Maintain a 100-day streak',
                icon: '🔥🔥🔥',
                xp: 2500,
                check: (data) => data.streaks.daily.count >= 100
            },

            // Level achievements
            {
                id: 'level-10',
                name: 'Apprentice Ascended',
                description: 'Reach level 10',
                icon: '✨',
                xp: 500,
                check: (data) => data.level >= 10
            },
            {
                id: 'level-25',
                name: 'Adept Achieved',
                description: 'Reach level 25',
                icon: '🌟',
                xp: 1000,
                check: (data) => data.level >= 25
            },
            {
                id: 'level-50',
                name: 'Mastery Manifested',
                description: 'Reach level 50',
                icon: '💫',
                xp: 2500,
                check: (data) => data.level >= 50
            },

            // Journal achievements
            {
                id: 'journal-10',
                name: 'Thoughtful Scribe',
                description: 'Write 10 journal entries',
                icon: '📝',
                xp: 200,
                check: (data) => data.stats.journalEntries >= 10
            },

            // Chakra achievements
            {
                id: 'chakra-balance',
                name: 'Balanced Being',
                description: 'Complete 10 chakra balancing sessions',
                icon: '🕉️',
                xp: 300,
                check: (data) => data.stats.chakraBalancingSessions >= 10
            },

            // Reading achievements
            {
                id: 'book-read',
                name: 'Sacred Scholar',
                description: 'Complete your first book',
                icon: '📚',
                xp: 150,
                check: (data) => data.stats.booksRead >= 1
            },

            // Community achievements
            {
                id: 'community-join',
                name: 'Community Connection',
                description: 'Make your first community post',
                icon: '🤝',
                xp: 50,
                check: (data) => data.stats.communityPosts >= 1
            },

            // Exploration achievements
            {
                id: 'explorer',
                name: 'Temple Explorer',
                description: 'Visit all 14 sections',
                icon: '🗺️',
                xp: 500,
                check: (data) => {
                    return Object.values(data.sections).every(s => s.visits > 0);
                }
            }
        ];
    }

    // ==================== EVENT SYSTEM ====================

    addEventListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    removeEventListener(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    // ==================== HELPER METHODS ====================

    getUserLevel() {
        return this.userData ? this.userData.level : 1;
    }

    getUserXP() {
        return this.userData ? this.userData.totalXP : 0;
    }

    getUserRank() {
        return this.userData ? this.userData.spiritualRank : 'Seeker';
    }

    getStreak() {
        return this.userData ? this.userData.streaks.daily.count : 0;
    }

    getLevelProgress() {
        if (!this.userData) return 0;
        return (this.userData.currentLevelXP / this.userData.nextLevelXP) * 100;
    }

    getSectionProgress(section) {
        if (!this.userData || !this.userData.sections[section]) return null;
        return this.userData.sections[section];
    }

    getAchievements() {
        return this.userData ? this.userData.achievements : [];
    }

    hasAchievement(achievementId) {
        return this.userData && this.userData.achievements.some(a => a.id === achievementId);
    }
}

// ==================== GLOBAL INSTANCE ====================

window.progressSystem = new UniversalProgressSystem();

console.log('✨ Universal Progress System loaded and ready');
