/**
 * ⭐ DIVINE TEMPLE - DAILY QUESTS WIDGET
 *
 * Beautiful UI component that displays daily quests with progress tracking.
 * Can be embedded anywhere on the site.
 */

class DailyQuestsWidget {
    constructor(containerId = 'daily-quests-widget') {
        this.containerId = containerId;
        this.quests = [];
        this.init();
    }

    async init() {
        console.log('⭐ Initializing Daily Quests Widget...');

        // Wait for daily quests system
        await this.waitForQuestsSystem();

        // Load quests
        this.loadQuests();

        // Listen for quest updates
        window.addEventListener('questsUpdated', () => this.refresh());

        // Render widget
        this.render();

        console.log('✅ Daily Quests Widget ready');
    }

    async waitForQuestsSystem() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.dailyQuests && window.dailyQuests.isInitialized) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    loadQuests() {
        if (window.dailyQuests) {
            this.quests = window.dailyQuests.getQuests();
        }
    }

    refresh() {
        this.loadQuests();
        this.render();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const progress = window.dailyQuests?.getQuestsProgress() || { completed: 0, total: 3, percentage: 0 };
        const stats = window.dailyQuests?.getStats() || {};

        container.innerHTML = `
            ${this.getStyles()}
            <div class="daily-quests-widget">
                <div class="quests-header">
                    <div class="quests-title">
                        <span class="quests-icon">⭐</span>
                        <span>Daily Quests</span>
                    </div>
                    <div class="quests-count">${progress.completed}/${progress.total}</div>
                </div>

                <div class="quests-progress-bar">
                    <div class="quests-progress-fill" style="width: ${progress.percentage}%"></div>
                </div>

                <div class="quests-list">
                    ${this.quests.map(quest => this.renderQuest(quest)).join('')}
                </div>

                ${progress.completed === progress.total ? `
                    <div class="perfect-day-banner">
                        🌟 Perfect Day! +300 Bonus XP!
                    </div>
                ` : ''}

                <div class="quests-stats">
                    <div class="quest-stat">
                        <div class="quest-stat-value">${stats.totalQuestsCompleted || 0}</div>
                        <div class="quest-stat-label">Total Completed</div>
                    </div>
                    <div class="quest-stat">
                        <div class="quest-stat-value">${stats.perfectDays || 0}</div>
                        <div class="quest-stat-label">Perfect Days</div>
                    </div>
                    <div class="quest-stat">
                        <div class="quest-stat-value">${stats.currentStreak || 0}</div>
                        <div class="quest-stat-label">Quest Streak</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderQuest(quest) {
        const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);
        const isComplete = quest.completed;

        return `
            <div class="quest-item ${isComplete ? 'completed' : ''}">
                <div class="quest-checkbox">
                    ${isComplete ? '✓' : ''}
                </div>
                <div class="quest-content">
                    <div class="quest-header">
                        <div class="quest-name">
                            <span class="quest-emoji">${quest.icon}</span>
                            <span>${quest.name}</span>
                        </div>
                        <div class="quest-xp">+${quest.xp} XP</div>
                    </div>
                    <div class="quest-desc">${quest.desc}</div>
                    <div class="quest-progress-container">
                        <div class="quest-progress-bar-mini">
                            <div class="quest-progress-fill-mini" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="quest-progress-text">${quest.progress}/${quest.target}</div>
                    </div>
                </div>
            </div>
        `;
    }

    getStyles() {
        return `
            <style>
                .daily-quests-widget {
                    background: linear-gradient(135deg, rgba(79, 195, 247, 0.1), rgba(102, 187, 106, 0.1));
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }

                .quests-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .quests-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #4fc3f7;
                }

                .quests-icon {
                    font-size: 1.8rem;
                }

                .quests-count {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #FFD700;
                }

                .quests-progress-bar {
                    height: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                }

                .quests-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4fc3f7, #66bb6a);
                    border-radius: 10px;
                    transition: width 0.5s ease;
                }

                .quests-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .quest-item {
                    display: flex;
                    gap: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 1rem;
                    transition: all 0.3s ease;
                }

                .quest-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateX(5px);
                }

                .quest-item.completed {
                    opacity: 0.7;
                    border-color: #66bb6a;
                }

                .quest-checkbox {
                    width: 32px;
                    height: 32px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: #66bb6a;
                    flex-shrink: 0;
                }

                .quest-item.completed .quest-checkbox {
                    background: #66bb6a;
                    border-color: #66bb6a;
                    color: white;
                }

                .quest-content {
                    flex: 1;
                }

                .quest-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .quest-name {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    color: white;
                }

                .quest-emoji {
                    font-size: 1.2rem;
                }

                .quest-xp {
                    font-weight: 700;
                    color: #FFD700;
                    font-size: 0.9rem;
                }

                .quest-desc {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                    margin-bottom: 0.75rem;
                }

                .quest-progress-container {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .quest-progress-bar-mini {
                    flex: 1;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .quest-progress-fill-mini {
                    height: 100%;
                    background: linear-gradient(90deg, #4fc3f7, #66bb6a);
                    border-radius: 3px;
                    transition: width 0.5s ease;
                }

                .quest-progress-text {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                    min-width: 50px;
                    text-align: right;
                }

                .perfect-day-banner {
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.2));
                    border: 2px solid #FFD700;
                    border-radius: 12px;
                    padding: 1rem;
                    text-align: center;
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #FFD700;
                    margin-bottom: 1.5rem;
                    animation: perfectDayPulse 2s ease-in-out infinite;
                }

                @keyframes perfectDayPulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
                    50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
                }

                .quests-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .quest-stat {
                    text-align: center;
                }

                .quest-stat-value {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #4fc3f7;
                    margin-bottom: 0.25rem;
                }

                .quest-stat-label {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                @media (max-width: 768px) {
                    .daily-quests-widget {
                        padding: 1.5rem;
                    }

                    .quests-stats {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 0.75rem;
                    }

                    .quest-stat-value {
                        font-size: 1.5rem;
                    }

                    .quest-stat-label {
                        font-size: 0.7rem;
                    }
                }
            </style>
        `;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('daily-quests-widget')) {
            window.dailyQuestsWidget = new DailyQuestsWidget();
        }
    });
} else {
    if (document.getElementById('daily-quests-widget')) {
        window.dailyQuestsWidget = new DailyQuestsWidget();
    }
}

console.log('⭐ Daily Quests Widget loaded');
