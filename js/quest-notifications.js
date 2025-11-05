/**
 * 🔔 DIVINE TEMPLE - QUEST PROGRESS NOTIFICATIONS
 *
 * Shows floating notifications when users make progress on daily quests.
 * Provides real-time feedback without being intrusive.
 */

class QuestNotifications {
    constructor() {
        this.lastProgress = {};
        this.init();
    }

    init() {
        console.log('🔔 Initializing Quest Notifications...');

        // Wait for quests system
        this.waitForQuestsSystem().then(() => {
            // Listen for quest updates
            window.addEventListener('questsUpdated', (e) => this.handleQuestUpdate(e.detail));
            console.log('✅ Quest Notifications ready');
        });
    }

    async waitForQuestsSystem() {
        return new Promise(resolve => {
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

    handleQuestUpdate(detail) {
        const quests = detail.quests;

        quests.forEach(quest => {
            const lastProgress = this.lastProgress[quest.id] || 0;
            const currentProgress = quest.progress;

            // Check if progress increased
            if (currentProgress > lastProgress && !quest.completed) {
                this.showProgressNotification(quest, currentProgress - lastProgress);
            }

            // Update last progress
            this.lastProgress[quest.id] = currentProgress;
        });
    }

    showProgressNotification(quest, increment) {
        const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);
        const remaining = quest.target - quest.progress;

        const notification = document.createElement('div');
        notification.className = 'quest-progress-notification';
        notification.innerHTML = `
            <style>
                .quest-progress-notification {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background: linear-gradient(135deg, rgba(79, 195, 247, 0.95), rgba(102, 187, 106, 0.95));
                    backdrop-filter: blur(20px);
                    border-radius: 15px;
                    padding: 1rem 1.5rem;
                    box-shadow: 0 10px 30px rgba(79, 195, 247, 0.4);
                    z-index: 99999;
                    animation: slideInUp 0.4s ease, slideOutDown 0.4s ease 2.6s;
                    min-width: 320px;
                    max-width: 400px;
                }

                .quest-notif-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: white;
                }

                .quest-notif-icon {
                    font-size: 2rem;
                    flex-shrink: 0;
                }

                .quest-notif-text {
                    flex: 1;
                }

                .quest-notif-title {
                    font-weight: 700;
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .quest-notif-progress {
                    font-size: 0.85rem;
                    opacity: 0.9;
                }

                .quest-notif-bar {
                    height: 4px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                    margin-top: 0.5rem;
                    overflow: hidden;
                }

                .quest-notif-bar-fill {
                    height: 100%;
                    background: white;
                    border-radius: 2px;
                    transition: width 0.5s ease;
                }

                @keyframes slideInUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutDown {
                    from {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                }

                @media (max-width: 768px) {
                    .quest-progress-notification {
                        bottom: 1rem;
                        right: 1rem;
                        left: 1rem;
                        min-width: auto;
                    }
                }
            </style>
            <div class="quest-notif-content">
                <div class="quest-notif-icon">${quest.icon}</div>
                <div class="quest-notif-text">
                    <div class="quest-notif-title">
                        <span>Quest Progress</span>
                        <span style="color: #FFD700;">+${increment}</span>
                    </div>
                    <div class="quest-notif-progress">
                        ${quest.name}: ${quest.progress}/${quest.target}
                        ${remaining > 0 ? `(${remaining} more!)` : ''}
                    </div>
                    <div class="quest-notif-bar">
                        <div class="quest-notif-bar-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Play sound
        if (window.divineAudio) {
            window.divineAudio.playBell(528, 1);
        }

        // Remove after animation
        setTimeout(() => notification.remove(), 3000);
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.questNotifications = new QuestNotifications();
    });
} else {
    window.questNotifications = new QuestNotifications();
}

console.log('🔔 Quest Notifications loaded');
