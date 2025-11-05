/**
 * 📊 DIVINE TEMPLE - SMART INSIGHTS WIDGET
 *
 * Beautiful UI component that displays personalized insights and recommendations.
 * Shows patterns, trends, and actionable suggestions.
 */

class SmartInsightsWidget {
    constructor(containerId = 'smart-insights-widget') {
        this.containerId = containerId;
        this.insights = null;
        this.init();
    }

    async init() {
        console.log('📊 Initializing Smart Insights Widget...');

        // Wait for insights system
        await this.waitForInsightsSystem();

        // Load insights
        this.loadInsights();

        // Listen for insights updates
        window.addEventListener('insightsUpdated', () => this.refresh());

        // Render widget
        this.render();

        console.log('✅ Smart Insights Widget ready');
    }

    async waitForInsightsSystem() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.smartInsights && window.smartInsights.isInitialized) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    loadInsights() {
        if (window.smartInsights) {
            this.insights = window.smartInsights.getInsights();
        }
    }

    refresh() {
        this.loadInsights();
        this.render();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        if (!this.insights) {
            container.innerHTML = `
                <div class="smart-insights-widget">
                    <div style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.6);">
                        Loading insights...
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            ${this.getStyles()}
            <div class="smart-insights-widget">
                <div class="insights-header">
                    <span class="insights-icon">📊</span>
                    <span>Your Insights</span>
                </div>

                ${this.renderWeeklySummary()}
                ${this.renderPatterns()}
                ${this.renderRecommendations()}
            </div>
        `;
    }

    renderWeeklySummary() {
        const { weeklyGrowth } = this.insights.trends;
        const trendIcon = weeklyGrowth.trend === 'up' ? '📈' : weeklyGrowth.trend === 'down' ? '📉' : '➡️';
        const trendColor = weeklyGrowth.trend === 'up' ? '#66bb6a' : weeklyGrowth.trend === 'down' ? '#ff6b6b' : '#4fc3f7';

        return `
            <div class="insight-card weekly-summary">
                <div class="insight-card-header">
                    <span>📅</span>
                    <span>This Week</span>
                </div>
                <div class="weekly-stats">
                    <div class="weekly-stat">
                        <div class="weekly-stat-value">${weeklyGrowth.thisWeek.toLocaleString()}</div>
                        <div class="weekly-stat-label">XP Earned</div>
                    </div>
                    <div class="weekly-growth" style="color: ${trendColor};">
                        <span class="growth-icon">${trendIcon}</span>
                        <span class="growth-value">${Math.abs(weeklyGrowth.growth)}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderPatterns() {
        const { bestDay, peakTime, streakQuality } = this.insights.patterns;

        return `
            <div class="insight-card patterns-card">
                <div class="insight-card-header">
                    <span>🔍</span>
                    <span>Your Patterns</span>
                </div>
                <div class="patterns-list">
                    <div class="pattern-item">
                        <div class="pattern-label">🔥 Best Day</div>
                        <div class="pattern-value">${bestDay.name}</div>
                    </div>
                    <div class="pattern-item">
                        <div class="pattern-label">⏰ Peak Time</div>
                        <div class="pattern-value">${peakTime.range}</div>
                    </div>
                    <div class="pattern-item">
                        <div class="pattern-label">${streakQuality.emoji} Streak</div>
                        <div class="pattern-value">${streakQuality.quality}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecommendations() {
        if (!this.insights.recommendations || this.insights.recommendations.length === 0) {
            return '';
        }

        const topRecs = this.insights.recommendations.slice(0, 3);

        return `
            <div class="insight-card recommendations-card">
                <div class="insight-card-header">
                    <span>💡</span>
                    <span>Recommendations</span>
                </div>
                <div class="recommendations-list">
                    ${topRecs.map(rec => this.renderRecommendation(rec)).join('')}
                </div>
            </div>
        `;
    }

    renderRecommendation(rec) {
        const priorityClass = rec.priority === 'high' ? 'high-priority' : rec.priority === 'medium' ? 'medium-priority' : 'low-priority';

        return `
            <div class="recommendation-item ${priorityClass}">
                <div class="rec-icon">${rec.icon}</div>
                <div class="rec-content">
                    <div class="rec-title">${rec.title}</div>
                    <div class="rec-message">${rec.message}</div>
                </div>
            </div>
        `;
    }

    getStyles() {
        return `
            <style>
                .smart-insights-widget {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(212, 175, 55, 0.1));
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }

                .insights-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #8B5CF6;
                    margin-bottom: 1.5rem;
                }

                .insights-icon {
                    font-size: 1.8rem;
                }

                .insight-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                }

                .insight-card:last-child {
                    margin-bottom: 0;
                }

                .insight-card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }

                .weekly-summary {
                    background: linear-gradient(135deg, rgba(79, 195, 247, 0.1), rgba(102, 187, 106, 0.1));
                }

                .weekly-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .weekly-stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #4fc3f7;
                    margin-bottom: 0.25rem;
                }

                .weekly-stat-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .weekly-growth {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .growth-icon {
                    font-size: 2rem;
                }

                .patterns-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .pattern-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }

                .pattern-label {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                }

                .pattern-value {
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .recommendations-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .recommendation-item {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    border-left: 4px solid transparent;
                    transition: all 0.3s ease;
                }

                .recommendation-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateX(5px);
                }

                .recommendation-item.high-priority {
                    border-left-color: #ff6b6b;
                }

                .recommendation-item.medium-priority {
                    border-left-color: #feca57;
                }

                .recommendation-item.low-priority {
                    border-left-color: #4fc3f7;
                }

                .rec-icon {
                    font-size: 2rem;
                    flex-shrink: 0;
                }

                .rec-content {
                    flex: 1;
                }

                .rec-title {
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.25rem;
                    font-size: 1rem;
                }

                .rec-message {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                    line-height: 1.4;
                }

                @media (max-width: 768px) {
                    .smart-insights-widget {
                        padding: 1.5rem;
                    }

                    .weekly-stats {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .recommendation-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .rec-icon {
                        font-size: 2.5rem;
                    }
                }
            </style>
        `;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('smart-insights-widget')) {
            window.smartInsightsWidget = new SmartInsightsWidget();
        }
    });
} else {
    if (document.getElementById('smart-insights-widget')) {
        window.smartInsightsWidget = new SmartInsightsWidget();
    }
}

console.log('📊 Smart Insights Widget loaded');
