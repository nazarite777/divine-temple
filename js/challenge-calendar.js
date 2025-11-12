/**
 * Divine Temple - Challenge Calendar System
 *
 * Features:
 * - 7-day, 30-day, 90-day challenges
 * - Challenge completion tracking
 * - Special milestone rewards
 * - Challenge history
 * - Themed monthly challenges
 */

class ChallengeCalendarSystem {
    constructor() {
        this.challenges = this.loadChallenges();
        this.activeChallenge = this.loadActiveChallenge();
        this.challengeHistory = this.loadChallengeHistory();
        this.init();
    }

    init() {
        console.log('⚡ Challenge Calendar System initialized');
        this.checkDailyProgress();
    }

    // Load all available challenges
    loadChallenges() {
        return {
            '7-day-meditation': {
                id: '7-day-meditation',
                name: '7-Day Meditation Challenge',
                description: 'Meditate for at least 10 minutes every day for 7 consecutive days',
                duration: 7,
                type: 'meditation',
                icon: '🧘',
                xpReward: 500,
                milestones: [
                    { day: 3, reward: 100, message: 'Halfway there! Keep going!' },
                    { day: 5, reward: 150, message: 'Amazing progress!' },
                    { day: 7, reward: 250, message: 'Challenge complete! 🎉' }
                ]
            },
            '30-day-gratitude': {
                id: '30-day-gratitude',
                name: '30-Day Gratitude Challenge',
                description: 'Write 3 things you\'re grateful for every day for 30 days',
                duration: 30,
                type: 'gratitude',
                icon: '🙏',
                xpReward: 2000,
                milestones: [
                    { day: 7, reward: 200, message: 'One week of gratitude!' },
                    { day: 14, reward: 300, message: 'Two weeks strong!' },
                    { day: 21, reward: 400, message: 'Three weeks! Amazing!' },
                    { day: 30, reward: 1100, message: 'Challenge complete! 🌟' }
                ]
            },
            '90-day-transformation': {
                id: '90-day-transformation',
                name: '90-Day Transformation Challenge',
                description: 'Complete daily spiritual practice for 90 consecutive days',
                duration: 90,
                type: 'transformation',
                icon: '✨',
                xpReward: 10000,
                milestones: [
                    { day: 7, reward: 500, message: 'First week complete!' },
                    { day: 30, reward: 1500, message: 'One month down!' },
                    { day: 60, reward: 2500, message: 'Two months! Incredible!' },
                    { day: 90, reward: 5500, message: 'TRANSFORMATION COMPLETE! 🎊' }
                ]
            },
            '21-day-chakra': {
                id: '21-day-chakra',
                name: '21-Day Chakra Balance Challenge',
                description: 'Work on balancing all 7 chakras over 21 days',
                duration: 21,
                type: 'chakra',
                icon: '⚡',
                xpReward: 1500,
                milestones: [
                    { day: 7, reward: 300, message: 'One week of chakra work!' },
                    { day: 14, reward: 450, message: 'Two weeks of balance!' },
                    { day: 21, reward: 750, message: 'All chakras balanced! 🌈' }
                ]
            },
            '14-day-crystal': {
                id: '14-day-crystal',
                name: '14-Day Crystal Healing Challenge',
                description: 'Work with a different crystal each day for 14 days',
                duration: 14,
                type: 'crystal',
                icon: '💎',
                xpReward: 1000,
                milestones: [
                    { day: 7, reward: 250, message: 'Halfway through crystal healing!' },
                    { day: 14, reward: 750, message: 'Crystal master! 💎' }
                ]
            }
        };
    }

    // Load active challenge
    loadActiveChallenge() {
        return JSON.parse(localStorage.getItem('divineTemple_activeChallenge') || 'null');
    }

    // Save active challenge
    saveActiveChallenge() {
        localStorage.setItem('divineTemple_activeChallenge', JSON.stringify(this.activeChallenge));
    }

    // Load challenge history
    loadChallengeHistory() {
        return JSON.parse(localStorage.getItem('divineTemple_challengeHistory') || '[]');
    }

    // Save challenge history
    saveChallengeHistory() {
        localStorage.setItem('divineTemple_challengeHistory', JSON.stringify(this.challengeHistory));
    }

    // Start a challenge
    startChallenge(challengeId) {
        if (this.activeChallenge) {
            return {
                success: false,
                message: 'You already have an active challenge! Complete or abandon it first.'
            };
        }

        const challenge = this.challenges[challengeId];
        if (!challenge) {
            return { success: false, message: 'Challenge not found' };
        }

        this.activeChallenge = {
            ...challenge,
            startDate: new Date().toISOString(),
            currentDay: 0,
            completedDays: [],
            missedDays: 0,
            milestonesClaimed: [],
            status: 'active'
        };

        this.saveActiveChallenge();

        // Award XP for starting
        if (window.progressSystem) {
            window.progressSystem.awardXP(50, `Started ${challenge.name}`, 'challenges');
            window.progressSystem.logActivity('challenge_start', 'challenges', {
                challengeId,
                challengeName: challenge.name
            });
        }

        return {
            success: true,
            message: `🎯 ${challenge.name} started! Good luck!`,
            challenge: this.activeChallenge
        };
    }

    // Check daily progress
    checkDailyProgress() {
        if (!this.activeChallenge) return;

        const today = new Date().toISOString().split('T')[0];
        const lastCompleted = this.activeChallenge.completedDays[this.activeChallenge.completedDays.length - 1];

        // Check if already completed today
        if (lastCompleted === today) {
            console.log('✅ Challenge already completed today');
            return;
        }

        // Check for missed days
        if (lastCompleted) {
            const lastDate = new Date(lastCompleted);
            const todayDate = new Date(today);
            const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

            if (daysDiff > 1) {
                // Missed days detected
                this.activeChallenge.missedDays += (daysDiff - 1);
                console.log(`⚠️ Missed ${daysDiff - 1} days`);

                // Too many missed days = failed challenge
                if (this.activeChallenge.missedDays >= 3) {
                    this.failChallenge();
                    return;
                }
            }
        }
    }

    // Mark today as complete
    completeTodayProgress() {
        if (!this.activeChallenge) {
            return { success: false, message: 'No active challenge' };
        }

        const today = new Date().toISOString().split('T')[0];

        // Check if already completed
        if (this.activeChallenge.completedDays.includes(today)) {
            return { success: false, message: 'Already completed today!' };
        }

        // Add today to completed days
        this.activeChallenge.completedDays.push(today);
        this.activeChallenge.currentDay++;

        // Check for milestone rewards
        const milestone = this.checkMilestones();

        // Check if challenge is complete
        if (this.activeChallenge.currentDay >= this.activeChallenge.duration) {
            return this.completeChallenge();
        }

        this.saveActiveChallenge();

        return {
            success: true,
            message: `Day ${this.activeChallenge.currentDay}/${this.activeChallenge.duration} complete!`,
            milestone
        };
    }

    // Check for milestone rewards
    checkMilestones() {
        const currentDay = this.activeChallenge.currentDay;
        const milestone = this.activeChallenge.milestones.find(
            m => m.day === currentDay && !this.activeChallenge.milestonesClaimed.includes(m.day)
        );

        if (milestone) {
            this.activeChallenge.milestonesClaimed.push(milestone.day);

            // Award milestone XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(milestone.reward, milestone.message, 'challenges');
            }

            return milestone;
        }

        return null;
    }

    // Complete challenge
    completeChallenge() {
        const completedChallenge = {
            ...this.activeChallenge,
            completedDate: new Date().toISOString(),
            status: 'completed'
        };

        // Add to history
        this.challengeHistory.unshift(completedChallenge);
        this.saveChallengeHistory();

        // Award final XP
        if (window.progressSystem) {
            window.progressSystem.awardXP(
                this.activeChallenge.xpReward,
                `Completed ${this.activeChallenge.name}!`,
                'challenges'
            );

            window.progressSystem.logActivity('challenge_complete', 'challenges', {
                challengeId: this.activeChallenge.id,
                challengeName: this.activeChallenge.name,
                duration: this.activeChallenge.duration
            });
        }

        // Clear active challenge
        this.activeChallenge = null;
        this.saveActiveChallenge();

        return {
            success: true,
            message: `🎊 ${completedChallenge.name} COMPLETE! You earned ${completedChallenge.xpReward} XP!`,
            challenge: completedChallenge
        };
    }

    // Fail challenge
    failChallenge() {
        const failedChallenge = {
            ...this.activeChallenge,
            failedDate: new Date().toISOString(),
            status: 'failed'
        };

        // Add to history
        this.challengeHistory.unshift(failedChallenge);
        this.saveChallengeHistory();

        // Clear active challenge
        this.activeChallenge = null;
        this.saveActiveChallenge();

        if (typeof window.showNotification === 'function') {
            window.showNotification(
                `Challenge failed due to ${failedChallenge.missedDays} missed days. Try again!`,
                'warning'
            );
        }
    }

    // Abandon challenge
    abandonChallenge() {
        if (!this.activeChallenge) {
            return { success: false, message: 'No active challenge' };
        }

        const abandonedChallenge = {
            ...this.activeChallenge,
            abandonedDate: new Date().toISOString(),
            status: 'abandoned'
        };

        this.challengeHistory.unshift(abandonedChallenge);
        this.saveChallengeHistory();

        this.activeChallenge = null;
        this.saveActiveChallenge();

        return { success: true, message: 'Challenge abandoned. You can start a new one!' };
    }

    // Get challenge stats
    getChallengeStats() {
        const completed = this.challengeHistory.filter(c => c.status === 'completed').length;
        const failed = this.challengeHistory.filter(c => c.status === 'failed').length;
        const abandoned = this.challengeHistory.filter(c => c.status === 'abandoned').length;
        const totalXP = this.challengeHistory
            .filter(c => c.status === 'completed')
            .reduce((sum, c) => sum + c.xpReward, 0);

        return {
            completed,
            failed,
            abandoned,
            total: this.challengeHistory.length,
            totalXP,
            activeChallenge: this.activeChallenge
        };
    }

    // Render challenge calendar UI
    renderChallengeCalendar(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stats = this.getChallengeStats();

        container.innerHTML = `
            <div class="challenge-calendar">
                <h2 class="challenge-header">⚡ Challenge Calendar</h2>

                <!-- Stats Overview -->
                <div class="challenge-stats">
                    <div class="stat-card">
                        <div class="stat-number">${stats.completed}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalXP.toLocaleString()}</div>
                        <div class="stat-label">Total XP</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.total}</div>
                        <div class="stat-label">Total Attempts</div>
                    </div>
                </div>

                <!-- Active Challenge -->
                ${this.activeChallenge ? `
                    <div class="active-challenge">
                        <h3>${this.activeChallenge.icon} ${this.activeChallenge.name}</h3>
                        <p>${this.activeChallenge.description}</p>
                        <div class="challenge-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(this.activeChallenge.currentDay / this.activeChallenge.duration * 100)}%"></div>
                            </div>
                            <div class="progress-text">Day ${this.activeChallenge.currentDay} / ${this.activeChallenge.duration}</div>
                        </div>
                        <div class="challenge-actions">
                            <button class="btn-complete" onclick="challengeCalendar.completeTodayProgress()">
                                ✅ Complete Today
                            </button>
                            <button class="btn-abandon" onclick="challengeCalendar.abandonChallenge()">
                                ❌ Abandon
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="no-challenge">
                        <p>No active challenge. Choose one to start!</p>
                    </div>
                `}

                <!-- Available Challenges -->
                <h3 class="section-title">Available Challenges</h3>
                <div class="challenges-grid">
                    ${Object.values(this.challenges).map(challenge => `
                        <div class="challenge-card ${this.activeChallenge ? 'disabled' : ''}">
                            <div class="challenge-icon">${challenge.icon}</div>
                            <h4>${challenge.name}</h4>
                            <p>${challenge.description}</p>
                            <div class="challenge-info">
                                <span>⏰ ${challenge.duration} days</span>
                                <span>⭐ ${challenge.xpReward} XP</span>
                            </div>
                            <button
                                class="btn-start-challenge"
                                onclick="challengeCalendar.startChallenge('${challenge.id}')"
                                ${this.activeChallenge ? 'disabled' : ''}
                            >
                                Start Challenge
                            </button>
                        </div>
                    `).join('')}
                </div>

                <style>
                    .challenge-calendar {
                        padding: 2rem;
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
                        border-radius: 20px;
                        margin: 1rem 0;
                    }
                    .challenge-header {
                        text-align: center;
                        font-size: 2.5rem;
                        margin-bottom: 2rem;
                        background: linear-gradient(135deg, #d4af37, #8b5cf6);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .challenge-stats {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1rem;
                        margin-bottom: 2rem;
                    }
                    .stat-card {
                        text-align: center;
                        padding: 1.5rem;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 15px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    .stat-number {
                        font-size: 2.5rem;
                        font-weight: 700;
                        color: #d4af37;
                    }
                    .stat-label {
                        color: rgba(255, 255, 255, 0.7);
                        margin-top: 0.5rem;
                    }
                    .active-challenge {
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
                        border: 2px solid #8b5cf6;
                        border-radius: 20px;
                        padding: 2rem;
                        margin: 2rem 0;
                    }
                    .active-challenge h3 {
                        font-size: 1.8rem;
                        margin-bottom: 0.5rem;
                    }
                    .challenge-progress {
                        margin: 1.5rem 0;
                    }
                    .progress-bar {
                        height: 20px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                        overflow: hidden;
                        margin-bottom: 0.5rem;
                    }
                    .progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #10b981, #059669);
                        transition: width 0.3s;
                    }
                    .progress-text {
                        text-align: center;
                        font-weight: 600;
                        color: #10b981;
                    }
                    .challenge-actions {
                        display: flex;
                        gap: 1rem;
                        margin-top: 1.5rem;
                    }
                    .btn-complete, .btn-abandon {
                        flex: 1;
                        padding: 1rem;
                        border: none;
                        border-radius: 12px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    .btn-complete {
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: white;
                    }
                    .btn-abandon {
                        background: rgba(239, 68, 68, 0.2);
                        color: #fca5a5;
                        border: 1px solid rgba(239, 68, 68, 0.3);
                    }
                    .btn-complete:hover, .btn-abandon:hover {
                        transform: translateY(-2px);
                    }
                    .no-challenge {
                        text-align: center;
                        padding: 3rem;
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 1.1rem;
                    }
                    .section-title {
                        font-size: 1.8rem;
                        margin: 2rem 0 1rem;
                        text-align: center;
                    }
                    .challenges-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 1.5rem;
                    }
                    .challenge-card {
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 15px;
                        padding: 1.5rem;
                        transition: all 0.3s;
                    }
                    .challenge-card:not(.disabled):hover {
                        transform: translateY(-5px);
                        border-color: #8b5cf6;
                        box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
                    }
                    .challenge-card.disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    .challenge-icon {
                        font-size: 3rem;
                        text-align: center;
                        margin-bottom: 1rem;
                    }
                    .challenge-card h4 {
                        font-size: 1.3rem;
                        margin-bottom: 0.5rem;
                        text-align: center;
                    }
                    .challenge-card p {
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 0.9rem;
                        text-align: center;
                        margin-bottom: 1rem;
                    }
                    .challenge-info {
                        display: flex;
                        justify-content: space-around;
                        margin: 1rem 0;
                        padding: 0.75rem;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 10px;
                    }
                    .challenge-info span {
                        font-size: 0.9rem;
                        color: #d4af37;
                    }
                    .btn-start-challenge {
                        width: 100%;
                        padding: 1rem;
                        background: linear-gradient(135deg, #8b5cf6, #6366f1);
                        border: none;
                        border-radius: 12px;
                        color: white;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    .btn-start-challenge:not(:disabled):hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
                    }
                    .btn-start-challenge:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    @media (max-width: 768px) {
                        .challenge-stats {
                            grid-template-columns: 1fr;
                        }
                        .challenges-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            </div>
        `;
    }
}

// Initialize and make globally available
window.challengeCalendar = new ChallengeCalendarSystem();
window.ChallengeCalendarSystem = ChallengeCalendarSystem;
