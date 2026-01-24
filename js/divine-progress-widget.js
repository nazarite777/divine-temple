/**
 * 🌟 DIVINE PROGRESS WIDGET
 * Reusable progress display component for all sections
 *
 * Usage:
 * 1. Include this script after universal-progress-system.js
 * 2. Add <div id="divine-progress-widget"></div> where you want the widget
 * 3. Widget auto-initializes and updates
 */

class DivineProgressWidget {
    constructor(containerId = 'divine-progress-widget') {
        this.containerId = containerId;
        this.sectionName = this.detectSectionName();
        this.init();
    }

    detectSectionName() {
        const path = window.location.pathname;
        const sectionMap = {
            'meditation-mindfulness': 'meditation-mindfulness',
            'oracle-divination': 'oracle-divination',
            'spiritual-practices': 'spiritual-practices',
            'chakras-auras': 'chakras-auras',
            'calendar': 'calendar',
            'energy-healing': 'energy-healing',
            'sacred-arts-sound': 'sacred-arts-sound',
            'devotion-growth': 'devotion-growth',
            'sacred-knowledge': 'sacred-knowledge',
            'community': 'community',
            'crystals-elements': 'crystals-elements',
            'spiritual-music': 'spiritual-music',
            'sacred-books': 'sacred-books',
            'videos-media': 'videos-media'
        };

        for (const [key, value] of Object.entries(sectionMap)) {
            if (path.includes(key)) {
                return value;
            }
        }
        return null;
    }

    async init() {
        // Wait for progress system to be ready
        if (typeof progressSystem === 'undefined') {
            console.warn('⚠️ Progress system not loaded yet, retrying...');
            setTimeout(() => this.init(), 500);
            return;
        }

        // Wait for user data
        progressSystem.addEventListener('userLoaded', () => this.render());

        // Listen for updates
        progressSystem.addEventListener('xpAwarded', () => this.render());
        progressSystem.addEventListener('levelUp', (data) => this.showLevelUpCelebration(data));
        progressSystem.addEventListener('achievementUnlocked', (data) => this.showAchievementPopup(data));
        progressSystem.addEventListener('streakContinued', () => this.render());

        // Initial render if user already loaded
        if (progressSystem.userData) {
            this.render();
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const userData = progressSystem.userData;
        if (!userData) {
            container.innerHTML = this.getLoadingHTML();
            return;
        }

        container.innerHTML = this.getWidgetHTML(userData);
        this.attachEventListeners();
    }

    getWidgetHTML(userData) {
        const levelProgress = progressSystem.getLevelProgress();
        const sectionProgress = this.sectionName ? progressSystem.getSectionProgress(this.sectionName) : null;
        const recentAchievements = userData.achievements.slice(-3).reverse();

        return `
            <div class="divine-progress-widget">
                <!-- Compact Header -->
                <div class="progress-widget-header">
                    <div class="user-level-badge">
                        <div class="level-circle">
                            <span class="level-number">${userData.level}</span>
                        </div>
                        <div class="rank-info">
                            <div class="rank-icon">${userData.spiritualRankIcon || '🔍'}</div>
                            <div class="rank-name">${userData.spiritualRank}</div>
                        </div>
                    </div>

                    <div class="streak-badge">
                        <div class="streak-icon">🔥</div>
                        <div class="streak-info">
                            <div class="streak-number">${userData.streaks.daily.count}</div>
                            <div class="streak-label">Day Streak</div>
                        </div>
                    </div>
                </div>

                <!-- XP Progress Bar -->
                <div class="xp-progress-section">
                    <div class="xp-label">
                        <span>Level ${userData.level}</span>
                        <span>${userData.currentLevelXP} / ${userData.nextLevelXP} XP</span>
                    </div>
                    <div class="xp-bar">
                        <div class="xp-fill" style="width: ${levelProgress}%">
                            <div class="xp-shimmer"></div>
                        </div>
                    </div>
                    <div class="xp-next-level">
                        ${Math.ceil(levelProgress)}% to Level ${userData.level + 1}
                    </div>
                </div>

                ${sectionProgress ? this.getSectionProgressHTML(sectionProgress) : ''}

                ${recentAchievements.length > 0 ? this.getAchievementsHTML(recentAchievements) : ''}

                <!-- Quick Stats -->
                <div class="quick-stats">
                    <div class="stat-item">
                        <span class="stat-icon">🧘</span>
                        <span class="stat-value">${userData.stats.meditations}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🔮</span>
                        <span class="stat-value">${userData.stats.oracleReadings}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">📝</span>
                        <span class="stat-value">${userData.stats.journalEntries}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🏆</span>
                        <span class="stat-value">${userData.achievements.length}</span>
                    </div>
                </div>

                <!-- View Full Progress -->
                <button class="view-progress-btn" onclick="window.divineProgressWidget.openProgressDashboard()">
                    View Full Progress →
                </button>
            </div>

            <style>
                .divine-progress-widget {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(212, 175, 55, 0.1));
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(212, 175, 55, 0.3);
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .progress-widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    gap: 1rem;
                }

                .user-level-badge {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .level-circle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #D4AF37, #FFD700);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
                    position: relative;
                }

                .level-circle::after {
                    content: '';
                    position: absolute;
                    top: -3px;
                    left: -3px;
                    right: -3px;
                    bottom: -3px;
                    border-radius: 50%;
                    border: 2px solid rgba(212, 175, 55, 0.3);
                    animation: pulse-ring 2s ease-in-out infinite;
                }

                @keyframes pulse-ring {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }

                .level-number {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #0F0F23;
                }

                .rank-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }

                .rank-icon {
                    font-size: 1.5rem;
                }

                .rank-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #D4AF37;
                }

                .streak-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255, 107, 53, 0.2);
                    padding: 0.75rem 1rem;
                    border-radius: 15px;
                    border: 2px solid rgba(255, 107, 53, 0.3);
                }

                .streak-icon {
                    font-size: 2rem;
                    animation: flicker 1.5s ease-in-out infinite;
                }

                @keyframes flicker {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }

                .streak-info {
                    text-align: left;
                }

                .streak-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #FF6B35;
                }

                .streak-label {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .xp-progress-section {
                    margin-bottom: 1.5rem;
                }

                .xp-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                }

                .xp-bar {
                    height: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                }

                .xp-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #8B5CF6, #D4AF37);
                    border-radius: 10px;
                    transition: width 0.5s ease-out;
                    position: relative;
                    overflow: hidden;
                }

                .xp-shimmer {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.3),
                        transparent
                    );
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    to { left: 100%; }
                }

                .xp-next-level {
                    text-align: center;
                    margin-top: 0.5rem;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .section-progress {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 1rem;
                }

                .section-progress-title {
                    font-size: 0.9rem;
                    color: #D4AF37;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                }

                .section-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 0.75rem;
                }

                .section-stat {
                    text-align: center;
                }

                .section-stat-value {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #8B5CF6;
                }

                .section-stat-label {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .recent-achievements {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 1rem;
                }

                .achievements-title {
                    font-size: 0.9rem;
                    color: #D4AF37;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .achievement-badges {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .achievement-badge {
                    background: rgba(212, 175, 55, 0.2);
                    border: 1px solid rgba(212, 175, 55, 0.4);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: help;
                }

                .quick-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .stat-item {
                    text-align: center;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }

                .stat-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                .stat-icon {
                    font-size: 1.5rem;
                    display: block;
                    margin-bottom: 0.25rem;
                }

                .stat-value {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #D4AF37;
                }

                .view-progress-btn {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, #8B5CF6, #D4AF37);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .view-progress-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
                }

                @media (max-width: 768px) {
                    .progress-widget-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .streak-badge {
                        justify-content: center;
                    }

                    .quick-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            </style>
        `;
    }

    getSectionProgressHTML(sectionProgress) {
        return `
            <div class="section-progress">
                <div class="section-progress-title">📊 This Section</div>
                <div class="section-stats">
                    <div class="section-stat">
                        <div class="section-stat-value">${sectionProgress.visits}</div>
                        <div class="section-stat-label">Visits</div>
                    </div>
                    <div class="section-stat">
                        <div class="section-stat-value">${sectionProgress.xp}</div>
                        <div class="section-stat-label">XP Earned</div>
                    </div>
                    <div class="section-stat">
                        <div class="section-stat-value">${sectionProgress.activities.length}</div>
                        <div class="section-stat-label">Activities</div>
                    </div>
                </div>
            </div>
        `;
    }

    getAchievementsHTML(achievements) {
        const achievementDefs = progressSystem.getAchievementDefinitions();

        const badges = achievements.map(ach => {
            const def = achievementDefs.find(d => d.id === ach.id);
            if (!def) return '';

            return `
                <div class="achievement-badge" title="${def.description}">
                    <span>${def.icon}</span>
                    <span>${def.name}</span>
                </div>
            `;
        }).join('');

        return `
            <div class="recent-achievements">
                <div class="achievements-title">
                    <span>🏆</span>
                    <span>Recent Achievements</span>
                </div>
                <div class="achievement-badges">
                    ${badges}
                </div>
            </div>
        `;
    }

    getLoadingHTML() {
        return `
            <div class="divine-progress-widget" style="text-align: center; padding: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">✨</div>
                <div>Loading your progress...</div>
            </div>
        `;
    }

    attachEventListeners() {
        // Event listeners can be added here if needed
    }

    showLevelUpCelebration(data) {
        const celebration = document.createElement('div');
        celebration.className = 'level-up-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <div class="celebration-title">LEVEL UP!</div>
                <div class="celebration-level">Level ${data.newLevel}</div>
                <div class="celebration-rank">${data.rank}</div>
            </div>
            <style>
                .level-up-celebration {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    animation: fadeIn 0.3s ease;
                }

                .celebration-content {
                    text-align: center;
                    animation: zoomIn 0.5s ease;
                }

                .celebration-icon {
                    font-size: 5rem;
                    margin-bottom: 1rem;
                    animation: bounce 1s ease infinite;
                }

                .celebration-title {
                    font-size: 3rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #D4AF37, #FFD700);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 1rem;
                }

                .celebration-level {
                    font-size: 4rem;
                    font-weight: 700;
                    color: #D4AF37;
                    margin-bottom: 0.5rem;
                }

                .celebration-rank {
                    font-size: 2rem;
                    color: #8B5CF6;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes zoomIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            </style>
        `;

        document.body.appendChild(celebration);

        // ✨ CREATE PARTICLE EFFECTS
        this.createParticleExplosion(celebration);

        // Play celebration sound if available
        if (window.divineAudio) {
            divineAudio.playBell(528, 3);
            setTimeout(() => divineAudio.playBell(639, 3), 500);
            setTimeout(() => divineAudio.playBell(741, 3), 1000);
        }

        setTimeout(() => {
            celebration.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => celebration.remove(), 500);
        }, 4000);
    }

    showAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-content">
                <div class="achievement-popup-icon">${achievement.icon}</div>
                <div class="achievement-popup-title">Achievement Unlocked!</div>
                <div class="achievement-popup-name">${achievement.name}</div>
                <div class="achievement-popup-desc">${achievement.description}</div>
                <div class="achievement-popup-xp">+${achievement.xp} XP</div>
            </div>
            <style>
                .achievement-popup {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(255, 215, 0, 0.95));
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 40px rgba(212, 175, 55, 0.5);
                    z-index: 99999;
                    animation: slideInRight 0.5s ease;
                    max-width: 350px;
                }

                .achievement-popup-content {
                    text-align: center;
                    color: #0F0F23;
                }

                .achievement-popup-icon {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                }

                .achievement-popup-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0.5rem;
                }

                .achievement-popup-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .achievement-popup-desc {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin-bottom: 0.75rem;
                }

                .achievement-popup-xp {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #8B5CF6;
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

        document.body.appendChild(popup);

        // Play achievement sound
        if (window.divineAudio) {
            divineAudio.playBell(639, 2);
        }

        setTimeout(() => {
            popup.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => popup.remove(), 500);
        }, 5000);
    }

    createParticleExplosion(container) {
        const particles = 50;
        const colors = ['#D4AF37', '#FFD700', '#8B5CF6', '#4fc3f7', '#66bb6a', '#ff6b6b'];
        const symbols = ['✨', '🌟', '⭐', '💫', '✴️', '🔆'];

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            const isSymbol = Math.random() > 0.5;

            particle.style.position = 'fixed';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '999998';

            if (isSymbol) {
                particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
            } else {
                particle.style.width = (Math.random() * 8 + 4) + 'px';
                particle.style.height = particle.style.width;
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.borderRadius = '50%';
            }

            const angle = (Math.PI * 2 * i) / particles;
            const velocity = Math.random() * 300 + 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: Math.random() * 1000 + 1500,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            });

            container.appendChild(particle);

            setTimeout(() => particle.remove(), 2500);
        }
    }

    openProgressDashboard() {
        // TODO: Navigate to full progress dashboard
        alert('Full Progress Dashboard coming soon! 📊');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.divineProgressWidget = new DivineProgressWidget();
    });
} else {
    window.divineProgressWidget = new DivineProgressWidget();
}

console.log('✨ Divine Progress Widget loaded');
