/**
 * 🏆 DIVINE TEMPLE - ACHIEVEMENT SYSTEM
 *
 * Tracks player achievements, milestones, and progression
 * Awards badges, titles, and bonus XP for completing challenges
 *
 * Features:
 * - Auto-tracked achievements
 * - Progression milestones
 * - Special unlocks at key levels
 * - Daily/weekly quest system
 */

class AchievementSystem {
    constructor() {
        this.currentUser = null;
        this.achievementData = null;
        this.isInitialized = false;

        // Achievement definitions
        this.achievements = {
            // Trivia Achievements
            trivia_first_steps: {
                id: 'trivia_first_steps',
                name: '🎯 First Steps',
                description: 'Complete your first daily trivia',
                category: 'Trivia',
                xpReward: 50,
                condition: (data) => data.triviaCompleted >= 1
            },
            trivia_perfect_scholar: {
                id: 'trivia_perfect_scholar',
                name: '🏆 Perfect Scholar',
                description: 'Get your first perfect score (5/5)',
                category: 'Trivia',
                xpReward: 100,
                condition: (data) => data.triviaPerfectScores >= 1
            },
            trivia_dedicated_seeker: {
                id: 'trivia_dedicated_seeker',
                name: '🔥 Dedicated Seeker',
                description: 'Maintain a 7-day trivia streak',
                category: 'Trivia',
                xpReward: 200,
                condition: (data) => data.triviaStreak >= 7
            },
            trivia_master: {
                id: 'trivia_master',
                name: '⭐ Trivia Master',
                description: 'Maintain a 30-day trivia streak',
                category: 'Trivia',
                xpReward: 500,
                condition: (data) => data.triviaStreak >= 30
            },
            trivia_legend: {
                id: 'trivia_legend',
                name: '👑 Trivia Legend',
                description: 'Achieve 10 perfect scores',
                category: 'Trivia',
                xpReward: 1000,
                condition: (data) => data.triviaPerfectScores >= 10
            },

            // Matching Game Achievements
            match_first_game: {
                id: 'match_first_game',
                name: '🎮 Memory Awakened',
                description: 'Complete your first matching game',
                category: 'Matching',
                xpReward: 50,
                condition: (data) => data.matchingGamesPlayed >= 1
            },
            match_etymology_master: {
                id: 'match_etymology_master',
                name: '📜 Etymology Master',
                description: 'Complete 10 Biblical Etymology games',
                category: 'Matching',
                xpReward: 300,
                condition: (data) => data.etymologyGames >= 10
            },
            match_names_scholar: {
                id: 'match_names_scholar',
                name: '👑 Names Scholar',
                description: 'Complete 10 Hebrew Names games',
                category: 'Matching',
                xpReward: 300,
                condition: (data) => data.namesGames >= 10
            },
            match_numbers_sage: {
                id: 'match_numbers_sage',
                name: '🔢 Numbers Sage',
                description: 'Complete 10 Sacred Numbers games',
                category: 'Matching',
                xpReward: 300,
                condition: (data) => data.numbersGames >= 10
            },
            match_perfect_hard: {
                id: 'match_perfect_hard',
                name: '💎 Flawless Memory',
                description: 'Perfect score on Hard mode matching',
                category: 'Matching',
                xpReward: 500,
                condition: (data) => data.matchingPerfectHard >= 1
            },

            // Level Milestones
            level_5_seeker: {
                id: 'level_5_seeker',
                name: '🌟 Seeker',
                description: 'Reach Level 5',
                category: 'Progression',
                xpReward: 50,
                condition: (data) => data.level >= 5,
                unlock: 'First knowledge unlock free'
            },
            level_10_scholar: {
                id: 'level_10_scholar',
                name: '📚 Scholar',
                description: 'Reach Level 10',
                category: 'Progression',
                xpReward: 100,
                condition: (data) => data.level >= 10,
                unlock: '1 free knowledge guide'
            },
            level_15_teacher: {
                id: 'level_15_teacher',
                name: '👨‍🏫 Teacher',
                description: 'Reach Level 15',
                category: 'Progression',
                xpReward: 150,
                condition: (data) => data.level >= 15
            },
            level_21_nazarite: {
                id: 'level_21_nazarite',
                name: '🔥 Nazarite',
                description: 'Reach Level 21 (Age of Consecration)',
                category: 'Progression',
                xpReward: 210,
                condition: (data) => data.level >= 21,
                unlock: 'Special Nazarite badge + theme'
            },
            level_30_sage: {
                id: 'level_30_sage',
                name: '🕎 Sage',
                description: 'Reach Level 30',
                category: 'Progression',
                xpReward: 300,
                condition: (data) => data.level >= 30,
                unlock: 'All basic shop items unlocked'
            },
            level_40_elder: {
                id: 'level_40_elder',
                name: '👴 Elder',
                description: 'Reach Level 40 (Completion)',
                category: 'Progression',
                xpReward: 400,
                condition: (data) => data.level >= 40,
                unlock: 'Custom title creation'
            },
            level_50_master: {
                id: 'level_50_master',
                name: '🎓 Master Teacher',
                description: 'Reach Level 50 (Divine Jubilee)',
                category: 'Progression',
                xpReward: 500,
                condition: (data) => data.level >= 50,
                unlock: 'All content unlocked'
            },

            // XP Achievements
            xp_1000: {
                id: 'xp_1000',
                name: '💰 First Thousand',
                description: 'Earn 1,000 total XP',
                category: 'XP',
                xpReward: 100,
                condition: (data) => data.totalXP >= 1000
            },
            xp_5000: {
                id: 'xp_5000',
                name: '💎 Five Thousand',
                description: 'Earn 5,000 total XP',
                category: 'XP',
                xpReward: 500,
                condition: (data) => data.totalXP >= 5000
            },
            xp_10000: {
                id: 'xp_10000',
                name: '👑 Ten Thousand',
                description: 'Earn 10,000 total XP',
                category: 'XP',
                xpReward: 1000,
                condition: (data) => data.totalXP >= 10000
            },

            // Special Achievements
            ya_heard_me: {
                id: 'ya_heard_me',
                name: '⚡ Ya Heard Me',
                description: 'Complete all theological teaching games',
                category: 'Special',
                xpReward: 2000,
                condition: (data) =>
                    data.etymologyGames >= 10 &&
                    data.namesGames >= 10 &&
                    data.numbersGames >= 10 &&
                    data.triviaPerfectScores >= 5
            },
            truth_awakened: {
                id: 'truth_awakened',
                name: '✨ Truth Awakened',
                description: 'Purchase all knowledge unlocks',
                category: 'Special',
                xpReward: 1500,
                condition: (data) => data.knowledgeUnlocked >= 6
            }
        };

        // Daily/Weekly Quest definitions
        this.dailyQuests = [
            {
                id: 'daily_trivia',
                name: 'Daily Wisdom',
                description: 'Complete today\'s trivia with 4/5 correct',
                xpReward: 50,
                condition: (data) => data.todayTriviaScore >= 4
            },
            {
                id: 'daily_match',
                name: 'Memory Practice',
                description: 'Play 1 matching game',
                xpReward: 50,
                condition: (data) => data.todayMatchingGames >= 1
            },
            {
                id: 'daily_explorer',
                name: 'Temple Explorer',
                description: 'Visit 3 different temple sections',
                xpReward: 30,
                condition: (data) => data.todaySectionsVisited >= 3
            },
            {
                id: 'daily_share',
                name: 'Spread the Light',
                description: 'Share your progress on social',
                xpReward: 20,
                condition: (data) => data.todayShared >= 1
            }
        ];

        this.weeklyQuests = [
            {
                id: 'weekly_perfect',
                name: 'Week of Perfection',
                description: 'Get perfect score on Hard mode matching',
                xpReward: 200,
                condition: (data) => data.weekPerfectHard >= 1
            },
            {
                id: 'weekly_streak',
                name: 'Devoted Scholar',
                description: 'Complete 7-day trivia streak',
                xpReward: 300,
                condition: (data) => data.triviaStreak >= 7
            },
            {
                id: 'weekly_themes',
                name: 'Theme Master',
                description: 'Complete all 4 matching themes this week',
                xpReward: 400,
                condition: (data) => data.weekThemesCompleted >= 4
            },
            {
                id: 'weekly_unlock',
                name: 'Knowledge Seeker',
                description: 'Unlock 1 new reward item',
                xpReward: 150,
                condition: (data) => data.weekItemsUnlocked >= 1
            }
        ];

        this.init();
    }

    async init() {
        console.log('🏆 Initializing Achievement System...');

        // Wait for Firebase auth
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged(async (user) => {
                this.currentUser = user;
                if (user) {
                    await this.loadAchievementData();
                } else {
                    this.loadLocalData();
                }
                this.isInitialized = true;
                console.log('✅ Achievement System ready');
            });
        } else {
            this.loadLocalData();
            this.isInitialized = true;
            console.log('✅ Achievement System ready (local mode)');
        }
    }

    // ==================== DATA MANAGEMENT ====================
    async loadAchievementData() {
        if (!this.currentUser) return;

        try {
            const db = firebase.firestore();
            const doc = await db.collection('achievements').doc(this.currentUser.uid).get();

            if (doc.exists) {
                this.achievementData = doc.data();
            } else {
                this.achievementData = this.getDefaultData();
                await this.saveData();
            }
        } catch (error) {
            console.error('Error loading achievement data:', error);
            this.loadLocalData();
        }
    }

    loadLocalData() {
        const saved = localStorage.getItem('achievementData');
        if (saved) {
            this.achievementData = JSON.parse(saved);
        } else {
            this.achievementData = this.getDefaultData();
            this.saveLocalData();
        }
    }

    getDefaultData() {
        return {
            // Unlocked achievements
            unlockedAchievements: [],

            // Progress tracking
            triviaCompleted: 0,
            triviaPerfectScores: 0,
            triviaStreak: 0,
            matchingGamesPlayed: 0,
            etymologyGames: 0,
            namesGames: 0,
            numbersGames: 0,
            matchingPerfectHard: 0,

            // Level and XP
            level: 1,
            totalXP: 0,

            // Knowledge
            knowledgeUnlocked: 0,

            // Daily progress
            todayTriviaScore: 0,
            todayMatchingGames: 0,
            todaySectionsVisited: 0,
            todayShared: 0,

            // Weekly progress
            weekPerfectHard: 0,
            weekThemesCompleted: 0,
            weekItemsUnlocked: 0,

            // Quest tracking
            completedDailyQuests: [],
            completedWeeklyQuests: [],
            lastDailyReset: null,
            lastWeeklyReset: null
        };
    }

    async saveData() {
        if (this.currentUser && typeof firebase !== 'undefined') {
            try {
                const db = firebase.firestore();
                await db.collection('achievements').doc(this.currentUser.uid).set(this.achievementData);
            } catch (error) {
                console.error('Error saving achievement data:', error);
            }
        }
        this.saveLocalData();
    }

    saveLocalData() {
        localStorage.setItem('achievementData', JSON.stringify(this.achievementData));
    }

    // ==================== ACHIEVEMENT CHECKING ====================
    async checkAchievements(stats) {
        if (!this.achievementData) return [];

        const newlyUnlocked = [];

        // Merge stats with existing data
        const combinedData = { ...this.achievementData, ...stats };

        // Check each achievement
        for (const [key, achievement] of Object.entries(this.achievements)) {
            // Skip if already unlocked
            if (this.achievementData.unlockedAchievements.includes(achievement.id)) {
                continue;
            }

            // Check condition
            if (achievement.condition(combinedData)) {
                newlyUnlocked.push(achievement);
                this.achievementData.unlockedAchievements.push(achievement.id);

                // Award XP bonus
                if (window.progressSystem && achievement.xpReward) {
                    await window.progressSystem.awardXP(
                        achievement.xpReward,
                        `Achievement: ${achievement.name}`,
                        'achievement'
                    );
                }
            }
        }

        if (newlyUnlocked.length > 0) {
            await this.saveData();
            this.showAchievementNotifications(newlyUnlocked);
        }

        return newlyUnlocked;
    }

    // ==================== QUEST SYSTEM ====================
    async checkDailyQuests(stats) {
        this.resetDailyQuestsIfNeeded();

        const completed = [];
        const combinedData = { ...this.achievementData, ...stats };

        for (const quest of this.dailyQuests) {
            if (this.achievementData.completedDailyQuests.includes(quest.id)) {
                continue;
            }

            if (quest.condition(combinedData)) {
                completed.push(quest);
                this.achievementData.completedDailyQuests.push(quest.id);

                if (window.progressSystem && quest.xpReward) {
                    await window.progressSystem.awardXP(
                        quest.xpReward,
                        `Daily Quest: ${quest.name}`,
                        'daily_quest'
                    );
                }
            }
        }

        if (completed.length > 0) {
            await this.saveData();
        }

        return completed;
    }

    async checkWeeklyQuests(stats) {
        this.resetWeeklyQuestsIfNeeded();

        const completed = [];
        const combinedData = { ...this.achievementData, ...stats };

        for (const quest of this.weeklyQuests) {
            if (this.achievementData.completedWeeklyQuests.includes(quest.id)) {
                continue;
            }

            if (quest.condition(combinedData)) {
                completed.push(quest);
                this.achievementData.completedWeeklyQuests.push(quest.id);

                if (window.progressSystem && quest.xpReward) {
                    await window.progressSystem.awardXP(
                        quest.xpReward,
                        `Weekly Quest: ${quest.name}`,
                        'weekly_quest'
                    );
                }
            }
        }

        if (completed.length > 0) {
            await this.saveData();
        }

        return completed;
    }

    resetDailyQuestsIfNeeded() {
        const today = new Date().toDateString();
        if (this.achievementData.lastDailyReset !== today) {
            this.achievementData.completedDailyQuests = [];
            this.achievementData.todayTriviaScore = 0;
            this.achievementData.todayMatchingGames = 0;
            this.achievementData.todaySectionsVisited = 0;
            this.achievementData.todayShared = 0;
            this.achievementData.lastDailyReset = today;
        }
    }

    resetWeeklyQuestsIfNeeded() {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekKey = weekStart.toDateString();

        if (this.achievementData.lastWeeklyReset !== weekKey) {
            this.achievementData.completedWeeklyQuests = [];
            this.achievementData.weekPerfectHard = 0;
            this.achievementData.weekThemesCompleted = 0;
            this.achievementData.weekItemsUnlocked = 0;
            this.achievementData.lastWeeklyReset = weekKey;
        }
    }

    // ==================== NOTIFICATIONS ====================
    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showNotification(achievement);
            }, index * 2000); // Stagger notifications
        });
    }

    showNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
            <div class="achievement-content">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-xp">+${achievement.xpReward} XP</div>
            </div>
        `;

        // Add CSS if not already added
        if (!document.getElementById('achievement-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'achievement-notification-styles';
            styles.textContent = `
                .achievement-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #D4AF37, #8B5CF6);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    z-index: 10000;
                    animation: slideIn 0.5s ease, slideOut 0.5s ease 4.5s;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }

                .achievement-icon {
                    font-size: 3rem;
                }

                .achievement-title {
                    font-size: 0.85rem;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .achievement-name {
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-top: 0.25rem;
                }

                .achievement-xp {
                    font-size: 0.95rem;
                    color: #FFD700;
                    margin-top: 0.25rem;
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(notification);

        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Play sound if available
        if (window.audioSystem) {
            window.audioSystem.playSound('achievement');
        }
    }

    // ==================== HELPER METHODS ====================
    getProgress() {
        return this.achievementData;
    }

    getUnlockedAchievements() {
        return this.achievementData?.unlockedAchievements || [];
    }

    getDailyQuestsProgress() {
        this.resetDailyQuestsIfNeeded();
        return {
            quests: this.dailyQuests,
            completed: this.achievementData?.completedDailyQuests || []
        };
    }

    getWeeklyQuestsProgress() {
        this.resetWeeklyQuestsIfNeeded();
        return {
            quests: this.weeklyQuests,
            completed: this.achievementData?.completedWeeklyQuests || []
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏆 Initializing Achievement System...');
    window.achievementSystem = new AchievementSystem();
});
