/**
 * ⭐ DIVINE TEMPLE - DAILY QUESTS SYSTEM
 *
 * Generates personalized daily missions to boost engagement and habit building.
 * Integrates with Universal Progress System for XP awards and tracking.
 *
 * Features:
 * - 3 daily quests generated based on user patterns
 * - Progress tracking for each quest
 * - Bonus XP for completing all quests
 * - Auto-reset at midnight
 * - Beautiful UI notifications
 */

class DailyQuestsSystem {
    constructor() {
        this.currentUser = null;
        this.quests = [];
        this.questsData = null;
        this.isInitialized = false;

        // Quest templates organized by difficulty
        this.questTemplates = {
            easy: [
                { id: 'meditate_5', type: 'meditation', target: 5, xp: 50, icon: '🧘', name: 'Quick Meditation', desc: 'Meditate for 5 minutes' },
                { id: 'gratitude_1', type: 'gratitude', target: 1, xp: 40, icon: '🙏', name: 'Practice Gratitude', desc: 'Write 1 gratitude entry' },
                { id: 'oracle_1', type: 'oracle_reading', target: 1, xp: 50, icon: '🔮', name: 'Seek Guidance', desc: 'Draw 1 oracle card' },
                { id: 'visit_3', type: 'visit', target: 3, xp: 40, icon: '🚪', name: 'Explorer', desc: 'Visit 3 different sections' },
                { id: 'affirmation_1', type: 'affirmation', target: 1, xp: 30, icon: '✨', name: 'Positive Affirmation', desc: 'Read 1 affirmation' }
            ],
            medium: [
                { id: 'meditate_10', type: 'meditation', target: 10, xp: 100, icon: '🧘', name: 'Deep Meditation', desc: 'Meditate for 10 minutes' },
                { id: 'oracle_3', type: 'oracle_reading', target: 3, xp: 90, icon: '🔮', name: 'Triple Reading', desc: 'Draw 3 oracle cards' },
                { id: 'chakra_2', type: 'chakra_healing', target: 2, xp: 100, icon: '💎', name: 'Chakra Alignment', desc: 'Balance 2 chakras' },
                { id: 'journal_1', type: 'journal_entry', target: 1, xp: 80, icon: '📝', name: 'Sacred Journal', desc: 'Write 1 journal entry' },
                { id: 'prayer_1', type: 'prayer', target: 1, xp: 70, icon: '🙌', name: 'Divine Prayer', desc: 'Write 1 prayer' }
            ],
            hard: [
                { id: 'meditate_20', type: 'meditation', target: 20, xp: 200, icon: '🧘', name: 'Extended Practice', desc: 'Meditate for 20 minutes' },
                { id: 'complete_5', type: 'activities', target: 5, xp: 150, icon: '⚡', name: 'Power User', desc: 'Complete 5 activities' },
                { id: 'chakra_all', type: 'chakra_healing', target: 7, xp: 280, icon: '💎', name: 'Full Alignment', desc: 'Balance all 7 chakras' },
                { id: 'gratitude_3', type: 'gratitude', target: 3, xp: 120, icon: '🙏', name: 'Gratitude Master', desc: 'Write 3 gratitude entries' },
                { id: 'visit_7', type: 'visit', target: 7, xp: 140, icon: '🌟', name: 'Temple Master', desc: 'Visit 7 different sections' }
            ]
        };

        this.init();
    }

    async init() {
        console.log('⭐ Initializing Daily Quests System...');

        // Wait for Firebase auth
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged(async (user) => {
                this.currentUser = user;
                if (user) {
                    await this.loadQuestsData();
                } else {
                    this.loadLocalQuestsData();
                }
                this.checkAndGenerateQuests();
                this.isInitialized = true;
                console.log('✅ Daily Quests System ready');
            });
        } else {
            // No Firebase, use local storage
            this.loadLocalQuestsData();
            this.checkAndGenerateQuests();
            this.isInitialized = true;
            console.log('✅ Daily Quests System ready (local mode)');
        }

        // Listen to progress system events
        if (window.progressSystem) {
            window.addEventListener('activityLogged', (e) => this.handleActivity(e.detail));
        }
    }

    // ==================== DATA MANAGEMENT ====================
    async loadQuestsData() {
        if (!this.currentUser) return;

        try {
            const db = firebase.firestore();
            const doc = await db.collection('dailyQuests').doc(this.currentUser.uid).get();

            if (doc.exists) {
                this.questsData = doc.data();
            } else {
                this.questsData = this.getDefaultQuestsData();
                await this.saveQuestsData();
            }
        } catch (error) {
            console.error('Error loading quests data:', error);
            this.loadLocalQuestsData();
        }
    }

    loadLocalQuestsData() {
        const saved = localStorage.getItem('dailyQuestsData');
        if (saved) {
            this.questsData = JSON.parse(saved);
        } else {
            this.questsData = this.getDefaultQuestsData();
            this.saveLocalQuestsData();
        }
    }

    getDefaultQuestsData() {
        return {
            currentDate: new Date().toDateString(),
            quests: [],
            completedToday: [],
            stats: {
                totalQuestsCompleted: 0,
                perfectDays: 0,
                currentStreak: 0,
                longestStreak: 0
            }
        };
    }

    async saveQuestsData() {
        if (this.currentUser && typeof firebase !== 'undefined') {
            try {
                const db = firebase.firestore();
                await db.collection('dailyQuests').doc(this.currentUser.uid).set(this.questsData);
            } catch (error) {
                console.error('Error saving quests data:', error);
            }
        }
        this.saveLocalQuestsData();
    }

    saveLocalQuestsData() {
        localStorage.setItem('dailyQuestsData', JSON.stringify(this.questsData));
    }

    // ==================== QUEST GENERATION ====================
    checkAndGenerateQuests() {
        const today = new Date().toDateString();

        if (this.questsData.currentDate !== today) {
            // New day! Generate new quests
            this.generateDailyQuests();
            this.questsData.currentDate = today;
            this.saveQuestsData();
        } else {
            // Same day, load existing quests
            this.quests = this.questsData.quests || [];
        }
    }

    generateDailyQuests() {
        console.log('🌅 Generating new daily quests...');

        // Get user's activity patterns from progress system
        const userLevel = window.progressSystem?.userData?.level || 1;

        // Select 3 quests: 1 easy, 1 medium, 1 hard (adjusted by level)
        const selectedQuests = [];

        // Easy quest (always included)
        const easyQuest = this.getRandomQuest('easy');
        selectedQuests.push({ ...easyQuest, progress: 0, completed: false });

        // Medium quest
        const mediumQuest = this.getRandomQuest('medium');
        selectedQuests.push({ ...mediumQuest, progress: 0, completed: false });

        // Hard quest (scale with level)
        let hardQuest = this.getRandomQuest('hard');
        if (userLevel < 5) {
            // Lower levels get easier hard quests
            hardQuest = { ...hardQuest, target: Math.ceil(hardQuest.target * 0.5), xp: Math.ceil(hardQuest.xp * 0.7) };
        }
        selectedQuests.push({ ...hardQuest, progress: 0, completed: false });

        this.quests = selectedQuests;
        this.questsData.quests = selectedQuests;
        this.questsData.completedToday = [];

        console.log('✅ Daily quests generated:', this.quests);
    }

    getRandomQuest(difficulty) {
        const templates = this.questTemplates[difficulty];
        return { ...templates[Math.floor(Math.random() * templates.length)] };
    }

    // ==================== QUEST TRACKING ====================
    handleActivity(activity) {
        if (!this.quests || this.quests.length === 0) return;

        const { type, data } = activity;

        this.quests.forEach((quest, index) => {
            if (quest.completed) return;

            // Check if activity matches quest type
            if (this.activityMatchesQuest(type, quest, data)) {
                this.updateQuestProgress(index, quest, data);
            }
        });
    }

    activityMatchesQuest(activityType, quest, data) {
        // Map activity types to quest types
        const typeMap = {
            'meditation': 'meditation',
            'oracle_reading': 'oracle_reading',
            'chakra_healing': 'chakra_healing',
            'journal_entry': 'journal_entry',
            'journal': 'journal_entry',
            'gratitude': 'gratitude',
            'prayer': 'prayer',
            'affirmation': 'affirmation'
        };

        if (quest.type === 'visit') {
            // Track section visits
            return true; // All activities count as visits
        }

        if (quest.type === 'activities') {
            // Track any activity
            return true;
        }

        return typeMap[activityType] === quest.type;
    }

    updateQuestProgress(index, quest, data) {
        let increment = 1;

        // Special handling for meditation (minutes)
        if (quest.type === 'meditation' && data?.duration) {
            increment = data.duration;
        }

        quest.progress += increment;

        // Check if quest is completed
        if (quest.progress >= quest.target && !quest.completed) {
            this.completeQuest(index, quest);
        }

        this.saveQuestsData();
        this.notifyQuestsUpdate();
    }

    async completeQuest(index, quest) {
        quest.completed = true;
        quest.progress = quest.target;

        console.log(`✅ Quest completed: ${quest.name}`);

        // Award XP
        if (window.progressSystem) {
            await window.progressSystem.awardXP(quest.xp, `Quest: ${quest.name}`, 'daily-quests');
        }

        // Update stats
        this.questsData.completedToday.push(quest.id);
        this.questsData.stats.totalQuestsCompleted++;

        // Check if all quests completed
        const allCompleted = this.quests.every(q => q.completed);
        if (allCompleted) {
            this.completePerfectDay();
        }

        this.saveQuestsData();
        this.showQuestCompletionNotification(quest);
        this.notifyQuestsUpdate();
    }

    async completePerfectDay() {
        console.log('🎉 PERFECT DAY! All quests completed!');

        // Award massive bonus XP
        const bonusXP = 300;
        if (window.progressSystem) {
            await window.progressSystem.awardXP(bonusXP, '🌟 Perfect Day Bonus!', 'daily-quests');
        }

        // Update stats
        this.questsData.stats.perfectDays++;
        this.questsData.stats.currentStreak++;
        if (this.questsData.stats.currentStreak > this.questsData.stats.longestStreak) {
            this.questsData.stats.longestStreak = this.questsData.stats.currentStreak;
        }

        this.showPerfectDayNotification();
    }

    // ==================== UI NOTIFICATIONS ====================
    showQuestCompletionNotification(quest) {
        const notification = document.createElement('div');
        notification.className = 'quest-completion-notification';
        notification.innerHTML = `
            <div class="quest-notification-content">
                <div class="quest-notification-icon">${quest.icon}</div>
                <div class="quest-notification-text">
                    <div class="quest-notification-title">Quest Complete!</div>
                    <div class="quest-notification-name">${quest.name}</div>
                    <div class="quest-notification-xp">+${quest.xp} XP</div>
                </div>
            </div>
            <style>
                .quest-completion-notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: linear-gradient(135deg, rgba(79, 195, 247, 0.95), rgba(102, 187, 106, 0.95));
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 40px rgba(79, 195, 247, 0.5);
                    z-index: 99999;
                    animation: slideInRight 0.5s ease;
                    max-width: 350px;
                }

                .quest-notification-content {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    color: white;
                }

                .quest-notification-icon {
                    font-size: 3rem;
                }

                .quest-notification-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0.25rem;
                }

                .quest-notification-name {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }

                .quest-notification-xp {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #FFD700;
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
            </style>
        `;

        document.body.appendChild(notification);

        // Play sound
        if (window.divineAudio) {
            window.divineAudio.playBell(528, 2);
        }

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    showPerfectDayNotification() {
        const notification = document.createElement('div');
        notification.className = 'perfect-day-notification';
        notification.innerHTML = `
            <div class="perfect-day-content">
                <div class="perfect-day-icon">🌟</div>
                <div class="perfect-day-title">PERFECT DAY!</div>
                <div class="perfect-day-subtitle">All Quests Completed!</div>
                <div class="perfect-day-bonus">+300 BONUS XP</div>
            </div>
            <style>
                .perfect-day-notification {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.98), rgba(255, 215, 0, 0.98));
                    backdrop-filter: blur(20px);
                    border-radius: 30px;
                    padding: 3rem;
                    box-shadow: 0 20px 60px rgba(212, 175, 55, 0.7);
                    z-index: 999999;
                    animation: perfectDayZoom 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    text-align: center;
                    min-width: 300px;
                }

                .perfect-day-icon {
                    font-size: 5rem;
                    margin-bottom: 1rem;
                    animation: perfectDaySpin 1s ease;
                }

                .perfect-day-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #0F0F23;
                    margin-bottom: 0.5rem;
                }

                .perfect-day-subtitle {
                    font-size: 1.2rem;
                    color: #0F0F23;
                    margin-bottom: 1rem;
                    opacity: 0.9;
                }

                .perfect-day-bonus {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #8B5CF6;
                }

                @keyframes perfectDayZoom {
                    from {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }

                @keyframes perfectDaySpin {
                    from { transform: rotate(0deg) scale(0.5); }
                    to { transform: rotate(360deg) scale(1); }
                }
            </style>
        `;

        document.body.appendChild(notification);

        // Play celebration sounds
        if (window.divineAudio) {
            window.divineAudio.playBell(528, 3);
            setTimeout(() => window.divineAudio.playBell(639, 3), 300);
            setTimeout(() => window.divineAudio.playBell(741, 3), 600);
            setTimeout(() => window.divineAudio.playBell(852, 3), 900);
        }

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    notifyQuestsUpdate() {
        // Dispatch event for UI components to update
        window.dispatchEvent(new CustomEvent('questsUpdated', {
            detail: { quests: this.quests }
        }));
    }

    // ==================== PUBLIC API ====================
    getQuests() {
        return this.quests;
    }

    getQuestsProgress() {
        const completed = this.quests.filter(q => q.completed).length;
        const total = this.quests.length;
        return { completed, total, percentage: (completed / total) * 100 };
    }

    getStats() {
        return this.questsData?.stats || {};
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dailyQuests = new DailyQuestsSystem();
    });
} else {
    window.dailyQuests = new DailyQuestsSystem();
}

console.log('⭐ Daily Quests System loaded');
