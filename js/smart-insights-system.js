/**
 * 📊 DIVINE TEMPLE - SMART INSIGHTS SYSTEM
 *
 * Analyzes user behavior patterns and generates personalized insights and recommendations.
 * Tracks activity patterns, identifies trends, and suggests optimal practices.
 *
 * Features:
 * - Activity pattern analysis (time of day, day of week)
 * - Progress trend tracking (weekly, monthly)
 * - Personalized recommendations
 * - Streak analysis
 * - Section affinity detection
 */

class SmartInsightsSystem {
    constructor() {
        this.currentUser = null;
        this.insightsData = null;
        this.isInitialized = false;

        this.init();
    }

    async init() {
        console.log('📊 Initializing Smart Insights System...');

        // Wait for progress system to initialize
        if (window.progressSystem) {
            await this.waitForProgressSystem();
            this.analyzeUserData();
            this.isInitialized = true;
            console.log('✅ Smart Insights System ready');
        } else {
            setTimeout(() => this.init(), 1000);
        }
    }

    async waitForProgressSystem() {
        return new Promise((resolve) => {
            if (window.progressSystem && window.progressSystem.isInitialized) {
                resolve();
            } else {
                setTimeout(() => this.waitForProgressSystem().then(resolve), 500);
            }
        });
    }

    // ==================== DATA ANALYSIS ====================
    analyzeUserData() {
        if (!window.progressSystem || !window.progressSystem.userData) {
            console.warn('No user data available for analysis');
            return;
        }

        const userData = window.progressSystem.userData;

        this.insightsData = {
            patterns: this.analyzePatterns(userData),
            trends: this.analyzeTrends(userData),
            recommendations: this.generateRecommendations(userData),
            stats: this.generateStats(userData),
            achievements: this.analyzeAchievements(userData),
            updatedAt: new Date().toISOString()
        };

        console.log('📊 Insights generated:', this.insightsData);
    }

    analyzePatterns(userData) {
        const patterns = {
            bestDay: this.findBestDay(userData),
            peakTime: this.findPeakTime(userData),
            favoriteSections: this.findFavoriteSections(userData),
            activityFrequency: this.calculateActivityFrequency(userData),
            streakQuality: this.analyzeStreakQuality(userData)
        };

        return patterns;
    }

    findBestDay(userData) {
        // Analyze activity by day of week
        const dayMap = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
        const dayActivity = {};

        Object.values(userData.sections).forEach(section => {
            section.activities.forEach(activity => {
                const day = new Date(activity.timestamp).getDay();
                dayActivity[day] = (dayActivity[day] || 0) + 1;
            });
        });

        let maxDay = 0;
        let maxCount = 0;
        Object.entries(dayActivity).forEach(([day, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxDay = parseInt(day);
            }
        });

        return {
            name: dayMap[maxDay] || 'Not enough data',
            count: maxCount
        };
    }

    findPeakTime(userData) {
        // Analyze activity by hour of day
        const hourActivity = {};

        Object.values(userData.sections).forEach(section => {
            section.activities.forEach(activity => {
                const hour = new Date(activity.timestamp).getHours();
                hourActivity[hour] = (hourActivity[hour] || 0) + 1;
            });
        });

        let peakHour = 0;
        let maxCount = 0;
        Object.entries(hourActivity).forEach(([hour, count]) => {
            if (count > maxCount) {
                maxCount = count;
                peakHour = parseInt(hour);
            }
        });

        // Format time range
        let timeRange = 'Not enough data';
        if (maxCount > 0) {
            const endHour = (peakHour + 2) % 24;
            timeRange = `${this.formatHour(peakHour)}-${this.formatHour(endHour)}`;
        }

        return {
            range: timeRange,
            hour: peakHour,
            count: maxCount
        };
    }

    formatHour(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}${period}`;
    }

    findFavoriteSections(userData) {
        const sections = Object.entries(userData.sections)
            .map(([id, data]) => ({
                id,
                xp: data.xp,
                visits: data.visits,
                activities: data.activities.length
            }))
            .filter(s => s.xp > 0)
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 3);

        return sections;
    }

    calculateActivityFrequency(userData) {
        const allActivities = Object.values(userData.sections)
            .flatMap(s => s.activities)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (allActivities.length < 2) {
            return { frequency: 'New user', avgPerWeek: 0 };
        }

        const firstActivity = new Date(allActivities[allActivities.length - 1].timestamp);
        const lastActivity = new Date(allActivities[0].timestamp);
        const weeksDiff = Math.max(1, (lastActivity - firstActivity) / (1000 * 60 * 60 * 24 * 7));
        const avgPerWeek = Math.round(allActivities.length / weeksDiff);

        let frequency = 'Occasional';
        if (avgPerWeek >= 20) frequency = 'Very Active';
        else if (avgPerWeek >= 10) frequency = 'Active';
        else if (avgPerWeek >= 5) frequency = 'Regular';

        return { frequency, avgPerWeek };
    }

    analyzeStreakQuality(userData) {
        const currentStreak = userData.streaks.daily.count;
        const longestStreak = userData.streaks.daily.longestStreak;

        let quality = 'Building';
        let emoji = '🌱';

        if (currentStreak >= 30) {
            quality = 'Legendary';
            emoji = '👑';
        } else if (currentStreak >= 14) {
            quality = 'Excellent';
            emoji = '🔥';
        } else if (currentStreak >= 7) {
            quality = 'Strong';
            emoji = '⭐';
        } else if (currentStreak >= 3) {
            quality = 'Growing';
            emoji = '🌟';
        }

        return {
            quality,
            emoji,
            current: currentStreak,
            longest: longestStreak
        };
    }

    analyzeTrends(userData) {
        const trends = {
            weeklyGrowth: this.calculateWeeklyGrowth(userData),
            levelProgress: this.analyzeLevelProgress(userData),
            sectionDiversity: this.calculateSectionDiversity(userData),
            consistencyScore: this.calculateConsistencyScore(userData)
        };

        return trends;
    }

    calculateWeeklyGrowth(userData) {
        const now = Date.now();
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);

        let thisWeekXP = 0;
        let lastWeekXP = 0;

        Object.values(userData.sections).forEach(section => {
            section.activities.forEach(activity => {
                const timestamp = new Date(activity.timestamp).getTime();
                if (timestamp >= oneWeekAgo) {
                    thisWeekXP += activity.xp || 0;
                } else if (timestamp >= twoWeeksAgo) {
                    lastWeekXP += activity.xp || 0;
                }
            });
        });

        const growth = lastWeekXP > 0 ? ((thisWeekXP - lastWeekXP) / lastWeekXP) * 100 : 0;

        return {
            thisWeek: thisWeekXP,
            lastWeek: lastWeekXP,
            growth: Math.round(growth),
            trend: growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable'
        };
    }

    analyzeLevelProgress(userData) {
        const xpToNext = userData.nextLevelXP - userData.currentLevelXP;
        const progressPercent = (userData.currentLevelXP / userData.nextLevelXP) * 100;

        let estimate = 'Unknown';
        const avgXpPerDay = this.calculateAverageXpPerDay(userData);
        if (avgXpPerDay > 0) {
            const daysToLevel = Math.ceil(xpToNext / avgXpPerDay);
            estimate = daysToLevel === 1 ? 'Tomorrow!' : `${daysToLevel} days`;
        }

        return {
            currentLevel: userData.level,
            progress: Math.round(progressPercent),
            xpNeeded: xpToNext,
            estimate
        };
    }

    calculateAverageXpPerDay(userData) {
        const allActivities = Object.values(userData.sections)
            .flatMap(s => s.activities);

        if (allActivities.length === 0) return 0;

        const firstActivity = new Date(allActivities[allActivities.length - 1].timestamp);
        const now = new Date();
        const daysDiff = Math.max(1, (now - firstActivity) / (1000 * 60 * 60 * 24));

        return Math.round(userData.totalXP / daysDiff);
    }

    calculateSectionDiversity(userData) {
        const sectionsVisited = Object.values(userData.sections)
            .filter(s => s.visits > 0).length;
        const totalSections = Object.keys(userData.sections).length;

        const percentage = (sectionsVisited / totalSections) * 100;

        let diversity = 'Explorer';
        if (percentage >= 90) diversity = 'Master of All';
        else if (percentage >= 70) diversity = 'Well-Rounded';
        else if (percentage >= 50) diversity = 'Diverse';
        else if (percentage >= 30) diversity = 'Focused';

        return {
            diversity,
            visited: sectionsVisited,
            total: totalSections,
            percentage: Math.round(percentage)
        };
    }

    calculateConsistencyScore(userData) {
        const streak = userData.streaks.daily.count;
        const longestStreak = userData.streaks.daily.longestStreak;

        let score = 0;
        if (streak >= 30) score = 100;
        else if (streak >= 21) score = 90;
        else if (streak >= 14) score = 80;
        else if (streak >= 7) score = 70;
        else if (streak >= 3) score = 60;
        else score = Math.min(50, streak * 15);

        return {
            score,
            currentStreak: streak,
            longestStreak: longestStreak
        };
    }

    generateRecommendations(userData) {
        const recommendations = [];

        // Based on streak
        const streak = userData.streaks.daily.count;
        if (streak === 0) {
            recommendations.push({
                type: 'streak',
                priority: 'high',
                icon: '🔥',
                title: 'Start Your Streak!',
                message: 'Complete one activity today to begin building your daily streak.',
                action: 'Meditate Now'
            });
        } else if (streak >= 1 && streak < 7) {
            recommendations.push({
                type: 'streak',
                priority: 'medium',
                icon: '⭐',
                title: 'Keep It Going!',
                message: `You're at ${streak} days. Reach 7 days for the Week Warrior achievement!`,
                action: 'Continue Streak'
            });
        }

        // Based on level progress
        const progressPercent = (userData.currentLevelXP / userData.nextLevelXP) * 100;
        if (progressPercent >= 80) {
            recommendations.push({
                type: 'level',
                priority: 'high',
                icon: '⚡',
                title: 'Almost There!',
                message: `Only ${userData.nextLevelXP - userData.currentLevelXP} XP until Level ${userData.level + 1}!`,
                action: 'Earn More XP'
            });
        }

        // Based on section diversity
        const sectionsVisited = Object.values(userData.sections).filter(s => s.visits > 0).length;
        const totalSections = Object.keys(userData.sections).length;
        if (sectionsVisited < totalSections * 0.5) {
            const unvisited = this.getUnvisitedSections(userData);
            if (unvisited.length > 0) {
                recommendations.push({
                    type: 'explore',
                    priority: 'low',
                    icon: '🗺️',
                    title: 'Explore New Sections',
                    message: `Try ${unvisited[0]} to diversify your spiritual practice!`,
                    action: `Visit ${unvisited[0]}`
                });
            }
        }

        // Based on time patterns
        const patterns = this.analyzePatterns(userData);
        if (patterns.peakTime.count > 0) {
            const currentHour = new Date().getHours();
            const peakHour = patterns.peakTime.hour;
            if (Math.abs(currentHour - peakHour) <= 1) {
                recommendations.push({
                    type: 'timing',
                    priority: 'medium',
                    icon: '⏰',
                    title: 'Perfect Timing!',
                    message: `This is your peak practice time (${patterns.peakTime.range}). Make the most of it!`,
                    action: 'Start Practice'
                });
            }
        }

        // Based on achievements
        const nearAchievements = this.findNearAchievements(userData);
        if (nearAchievements.length > 0) {
            const achievement = nearAchievements[0];
            recommendations.push({
                type: 'achievement',
                priority: 'medium',
                icon: '🏆',
                title: 'Achievement Close!',
                message: achievement.message,
                action: 'View Achievements'
            });
        }

        return recommendations.slice(0, 4); // Return top 4
    }

    getUnvisitedSections(userData) {
        const sectionNames = {
            'energy-healing': 'Energy Healing',
            'sacred-arts-sound': 'Sacred Arts',
            'devotion-growth': 'Devotion & Growth',
            'crystals-elements': 'Crystals & Elements',
            'community': 'Community'
        };

        const unvisited = [];
        Object.entries(userData.sections).forEach(([id, data]) => {
            if (data.visits === 0 && sectionNames[id]) {
                unvisited.push(sectionNames[id]);
            }
        });

        return unvisited;
    }

    findNearAchievements(userData) {
        const near = [];

        // Check meditation achievements
        const meditationCount = userData.stats.meditations || 0;
        if (meditationCount >= 5 && meditationCount < 10) {
            near.push({ message: `${10 - meditationCount} more meditations for Meditation Devotee!` });
        }

        // Check streak achievements
        const streak = userData.streaks.daily.count;
        if (streak >= 5 && streak < 7) {
            near.push({ message: `${7 - streak} more days for Week Warrior!` });
        } else if (streak >= 25 && streak < 30) {
            near.push({ message: `${30 - streak} more days for Month Master!` });
        }

        return near;
    }

    generateStats(userData) {
        return {
            totalXP: userData.totalXP,
            level: userData.level,
            rank: userData.spiritualRank,
            achievements: userData.achievements.length,
            streak: userData.streaks.daily.count,
            activitiesThisWeek: this.countRecentActivities(userData, 7),
            sectionsActive: Object.values(userData.sections).filter(s => s.visits > 0).length
        };
    }

    countRecentActivities(userData, days) {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        let count = 0;

        Object.values(userData.sections).forEach(section => {
            section.activities.forEach(activity => {
                if (new Date(activity.timestamp).getTime() >= cutoff) {
                    count++;
                }
            });
        });

        return count;
    }

    analyzeAchievements(userData) {
        const total = window.progressSystem?.getAchievementDefinitions().length || 0;
        const unlocked = userData.achievements.length;
        const percentage = (unlocked / total) * 100;

        return {
            unlocked,
            total,
            percentage: Math.round(percentage),
            recent: userData.achievements.slice(0, 3)
        };
    }

    // ==================== PUBLIC API ====================
    getInsights() {
        return this.insightsData;
    }

    getWeeklySummary() {
        if (!this.insightsData) return null;

        return {
            xpGrowth: this.insightsData.trends.weeklyGrowth,
            bestDay: this.insightsData.patterns.bestDay,
            peakTime: this.insightsData.patterns.peakTime,
            recommendations: this.insightsData.recommendations.slice(0, 2)
        };
    }

    refreshInsights() {
        this.analyzeUserData();
        window.dispatchEvent(new CustomEvent('insightsUpdated', {
            detail: { insights: this.insightsData }
        }));
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.smartInsights = new SmartInsightsSystem();
    });
} else {
    window.smartInsights = new SmartInsightsSystem();
}

console.log('📊 Smart Insights System loaded');
