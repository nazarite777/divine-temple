/**
 * 🤖 Divine Temple Personalization AI
 *
 * Features:
 * - ML-based content recommendations
 * - User behavior analysis
 * - Personalized daily routines
 * - Smart quest generation
 * - Adaptive difficulty
 * - Pattern recognition
 * - Preference learning
 * - Activity predictions
 */

class PersonalizationAI {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.behaviorData = this.loadBehaviorData();
        this.preferences = this.loadPreferences();
        this.recommendations = [];
        this.init();
    }

    init() {
        console.log('🤖 Personalization AI initialized');

        // Listen for user activities
        this.setupActivityListeners();

        // Generate daily recommendations
        this.generateDailyRecommendations();

        // Update recommendations every hour
        setInterval(() => {
            this.generateDailyRecommendations();
        }, 60 * 60 * 1000);
    }

    loadUserProfile() {
        const saved = localStorage.getItem('ai_user_profile');
        return saved ? JSON.parse(saved) : {
            level: 1,
            interests: [],
            activityHistory: [],
            completedContent: [],
            timeOfDay: null,
            sessionDuration: 30,
            preferredCategories: {},
            streak: 0
        };
    }

    saveUserProfile() {
        localStorage.setItem('ai_user_profile', JSON.stringify(this.userProfile));
    }

    loadBehaviorData() {
        const saved = localStorage.getItem('ai_behavior_data');
        return saved ? JSON.parse(saved) : {
            loginTimes: [],
            sessionLengths: [],
            completionRates: {},
            categoryTimeSpent: {},
            interactionPatterns: [],
            abandonmentPoints: []
        };
    }

    saveBehaviorData() {
        localStorage.setItem('ai_behavior_data', JSON.stringify(this.behaviorData));
    }

    loadPreferences() {
        const saved = localStorage.getItem('ai_preferences');
        return saved ? JSON.parse(saved) : {
            contentTypes: {
                video: 0.5,
                audio: 0.5,
                text: 0.5,
                interactive: 0.5
            },
            difficulty: 'medium',
            duration: 'medium',
            themes: {}
        };
    }

    savePreferences() {
        localStorage.setItem('ai_preferences', JSON.stringify(this.preferences));
    }

    setupActivityListeners() {
        // Listen for XP awards to track activities
        window.addEventListener('xp-awarded', (e) => {
            this.trackActivity({
                type: 'xp_earned',
                section: e.detail.section,
                amount: e.detail.amount,
                reason: e.detail.reason,
                timestamp: Date.now()
            });
        });

        // Listen for section visits
        window.addEventListener('section-visited', (e) => {
            this.trackActivity({
                type: 'section_visit',
                section: e.detail.section,
                timestamp: Date.now()
            });
        });

        // Listen for content completions
        window.addEventListener('content-completed', (e) => {
            this.trackCompletion(e.detail);
        });

        // Track session start
        this.trackSessionStart();

        // Track session end
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
        });
    }

    trackActivity(activity) {
        this.behaviorData.interactionPatterns.push(activity);

        // Keep only last 1000 activities
        if (this.behaviorData.interactionPatterns.length > 1000) {
            this.behaviorData.interactionPatterns = this.behaviorData.interactionPatterns.slice(-1000);
        }

        // Update category time spent
        if (activity.section) {
            this.behaviorData.categoryTimeSpent[activity.section] =
                (this.behaviorData.categoryTimeSpent[activity.section] || 0) + 1;
        }

        this.saveBehaviorData();

        // Update recommendations based on new activity
        this.updateRecommendations();
    }

    trackCompletion(data) {
        const { contentId, contentType, section, difficulty } = data;

        // Track completion rate by category
        if (section) {
            if (!this.behaviorData.completionRates[section]) {
                this.behaviorData.completionRates[section] = {
                    completed: 0,
                    attempted: 0
                };
            }

            this.behaviorData.completionRates[section].completed++;
            this.behaviorData.completionRates[section].attempted++;
        }

        // Update user profile
        this.userProfile.completedContent.push({
            contentId,
            contentType,
            section,
            difficulty,
            completedAt: Date.now()
        });

        // Update preferences based on completion
        if (contentType && this.preferences.contentTypes[contentType] !== undefined) {
            this.preferences.contentTypes[contentType] =
                Math.min(1.0, this.preferences.contentTypes[contentType] + 0.05);
        }

        this.saveUserProfile();
        this.savePreferences();
    }

    trackSessionStart() {
        const now = new Date();
        this.behaviorData.loginTimes.push({
            timestamp: now.getTime(),
            hour: now.getHours(),
            dayOfWeek: now.getDay()
        });

        this.sessionStartTime = Date.now();

        // Keep only last 100 login times
        if (this.behaviorData.loginTimes.length > 100) {
            this.behaviorData.loginTimes = this.behaviorData.loginTimes.slice(-100);
        }

        this.saveBehaviorData();
    }

    trackSessionEnd() {
        if (this.sessionStartTime) {
            const duration = (Date.now() - this.sessionStartTime) / 1000 / 60; // minutes
            this.behaviorData.sessionLengths.push(duration);

            // Keep only last 100 session lengths
            if (this.behaviorData.sessionLengths.length > 100) {
                this.behaviorData.sessionLengths = this.behaviorData.sessionLengths.slice(-100);
            }

            this.saveBehaviorData();
        }
    }

    // ========== RECOMMENDATION ENGINE ==========

    generateDailyRecommendations() {
        this.recommendations = [];

        // 1. Recommend based on interests
        this.recommendations.push(...this.getInterestBasedRecommendations());

        // 2. Recommend based on completion patterns
        this.recommendations.push(...this.getPatternBasedRecommendations());

        // 3. Recommend based on time of day
        this.recommendations.push(...this.getTimeBasedRecommendations());

        // 4. Recommend trending content
        this.recommendations.push(...this.getTrendingRecommendations());

        // 5. Recommend personalized challenges
        this.recommendations.push(...this.getChallengeRecommendations());

        // Sort by relevance score and remove duplicates
        this.recommendations = this.deduplicate(
            this.recommendations.sort((a, b) => b.score - a.score)
        );

        console.log('Generated recommendations:', this.recommendations.length);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('recommendations-updated', {
            detail: { recommendations: this.recommendations }
        }));
    }

    getInterestBasedRecommendations() {
        const recommendations = [];

        // Analyze most visited sections
        const sectionScores = {};
        for (const [section, count] of Object.entries(this.behaviorData.categoryTimeSpent)) {
            sectionScores[section] = count;
        }

        // Get top 3 sections
        const topSections = Object.entries(sectionScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([section]) => section);

        // Recommend content from these sections
        topSections.forEach(section => {
            recommendations.push({
                type: 'content',
                section: section,
                title: `Explore more ${section}`,
                description: `Based on your interest in ${section}`,
                score: 0.9,
                reason: 'interest'
            });
        });

        return recommendations;
    }

    getPatternBasedRecommendations() {
        const recommendations = [];

        // Find incomplete patterns (started but not finished)
        const incompleteSections = [];
        for (const [section, rates] of Object.entries(this.behaviorData.completionRates)) {
            if (rates.attempted > rates.completed) {
                const completionRate = rates.completed / rates.attempted;
                if (completionRate < 0.7) {
                    incompleteSections.push({
                        section,
                        completionRate
                    });
                }
            }
        }

        // Recommend to complete these sections
        incompleteSections.forEach(item => {
            recommendations.push({
                type: 'completion',
                section: item.section,
                title: `Complete your ${item.section} journey`,
                description: `You're ${Math.round(item.completionRate * 100)}% done!`,
                score: 0.8,
                reason: 'completion'
            });
        });

        return recommendations;
    }

    getTimeBasedRecommendations() {
        const recommendations = [];
        const hour = new Date().getHours();

        // Morning (5-11): Energizing practices
        if (hour >= 5 && hour < 12) {
            recommendations.push({
                type: 'routine',
                title: 'Morning Meditation',
                description: 'Start your day with mindful awareness',
                score: 0.85,
                reason: 'time_of_day',
                content: 'meditation'
            });

            recommendations.push({
                type: 'routine',
                title: 'Yoga Sun Salutation',
                description: 'Energize your body with yoga',
                score: 0.82,
                reason: 'time_of_day',
                content: 'yoga'
            });
        }

        // Afternoon (12-17): Learning and growth
        else if (hour >= 12 && hour < 17) {
            recommendations.push({
                type: 'routine',
                title: 'Spiritual Study',
                description: 'Expand your knowledge with sacred texts',
                score: 0.78,
                reason: 'time_of_day',
                content: 'study'
            });
        }

        // Evening (17-22): Reflection and relaxation
        else if (hour >= 17 && hour < 22) {
            recommendations.push({
                type: 'routine',
                title: 'Evening Journaling',
                description: 'Reflect on your day and insights',
                score: 0.83,
                reason: 'time_of_day',
                content: 'journal'
            });

            recommendations.push({
                type: 'routine',
                title: 'Gratitude Practice',
                description: 'Count your blessings before sleep',
                score: 0.81,
                reason: 'time_of_day',
                content: 'gratitude'
            });
        }

        // Night (22-5): Sleep preparation
        else {
            recommendations.push({
                type: 'routine',
                title: 'Sleep Meditation',
                description: 'Prepare for restful sleep',
                score: 0.86,
                reason: 'time_of_day',
                content: 'sleep'
            });
        }

        return recommendations;
    }

    getTrendingRecommendations() {
        // In production, this would fetch from server
        return [
            {
                type: 'trending',
                title: 'Full Moon Ceremony',
                description: 'Join the community for tonight\'s full moon ritual',
                score: 0.75,
                reason: 'trending'
            }
        ];
    }

    getChallengeRecommendations() {
        const recommendations = [];

        // Analyze user level and suggest appropriate challenges
        const userLevel = window.progressSystem ? window.progressSystem.level : 1;

        if (userLevel >= 5 && userLevel < 15) {
            recommendations.push({
                type: 'challenge',
                title: '7-Day Meditation Challenge',
                description: 'Build a consistent meditation practice',
                score: 0.77,
                reason: 'challenge',
                difficulty: 'beginner'
            });
        } else if (userLevel >= 15) {
            recommendations.push({
                type: 'challenge',
                title: '30-Day Transformation Challenge',
                description: 'Deep spiritual transformation',
                score: 0.79,
                reason: 'challenge',
                difficulty: 'advanced'
            });
        }

        return recommendations;
    }

    deduplicate(recommendations) {
        const seen = new Set();
        return recommendations.filter(rec => {
            const key = `${rec.type}-${rec.title}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    updateRecommendations() {
        // Throttle updates to every 5 minutes
        if (this.lastUpdate && Date.now() - this.lastUpdate < 5 * 60 * 1000) {
            return;
        }

        this.lastUpdate = Date.now();
        this.generateDailyRecommendations();
    }

    // ========== ADAPTIVE DIFFICULTY ==========

    getAdaptiveDifficulty(section) {
        const rates = this.behaviorData.completionRates[section];

        if (!rates || rates.attempted < 5) {
            return 'medium'; // Default for new users
        }

        const completionRate = rates.completed / rates.attempted;

        if (completionRate > 0.85) {
            return 'hard'; // User is doing well, increase difficulty
        } else if (completionRate < 0.5) {
            return 'easy'; // User is struggling, decrease difficulty
        } else {
            return 'medium';
        }
    }

    // ========== PERSONALIZED QUEST GENERATION ==========

    generatePersonalizedQuests() {
        const quests = [];

        // Analyze weak areas
        const weakAreas = this.identifyWeakAreas();

        weakAreas.forEach(area => {
            quests.push({
                title: `Strengthen your ${area} practice`,
                description: `Complete activities in ${area} to improve`,
                xpReward: 100,
                category: area,
                type: 'improvement'
            });
        });

        // Suggest new content
        const unexplored = this.findUnexploredContent();

        unexplored.forEach(content => {
            quests.push({
                title: `Discover ${content}`,
                description: `Try something new for your growth`,
                xpReward: 75,
                category: content,
                type: 'exploration'
            });
        });

        return quests;
    }

    identifyWeakAreas() {
        const weakAreas = [];

        for (const [section, rates] of Object.entries(this.behaviorData.completionRates)) {
            const completionRate = rates.completed / rates.attempted;

            if (completionRate < 0.6) {
                weakAreas.push(section);
            }
        }

        return weakAreas;
    }

    findUnexploredContent() {
        const allSections = [
            'meditation',
            'energy-healing',
            'chakras',
            'crystals',
            'tarot',
            'astrology',
            'manifestation',
            'yoga',
            'breathwork'
        ];

        const explored = Object.keys(this.behaviorData.categoryTimeSpent);

        return allSections.filter(section => !explored.includes(section));
    }

    // ========== INSIGHTS & PREDICTIONS ==========

    generateInsights() {
        const insights = [];

        // Most active time
        const mostActiveHour = this.getMostActiveHour();
        if (mostActiveHour !== null) {
            insights.push({
                type: 'time',
                title: 'Peak Performance Time',
                message: `You're most active around ${mostActiveHour}:00. Schedule important practices then!`
            });
        }

        // Favorite category
        const favoriteCategory = this.getFavoriteCategory();
        if (favoriteCategory) {
            insights.push({
                type: 'interest',
                title: 'Your Spiritual Path',
                message: `You're deeply connected to ${favoriteCategory}. Continue exploring this path!`
            });
        }

        // Consistency check
        const consistency = this.getConsistencyScore();
        if (consistency < 0.5) {
            insights.push({
                type: 'improvement',
                title: 'Build Consistency',
                message: 'Try practicing at the same time daily to build a strong habit.'
            });
        } else if (consistency > 0.8) {
            insights.push({
                type: 'achievement',
                title: 'Excellent Consistency!',
                message: 'Your dedication is inspiring! Keep up the amazing work.'
            });
        }

        return insights;
    }

    getMostActiveHour() {
        if (this.behaviorData.loginTimes.length === 0) return null;

        const hourCounts = {};
        this.behaviorData.loginTimes.forEach(login => {
            hourCounts[login.hour] = (hourCounts[login.hour] || 0) + 1;
        });

        return parseInt(
            Object.entries(hourCounts)
                .sort((a, b) => b[1] - a[1])[0][0]
        );
    }

    getFavoriteCategory() {
        const scores = this.behaviorData.categoryTimeSpent;
        if (Object.keys(scores).length === 0) return null;

        return Object.entries(scores)
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    getConsistencyScore() {
        const loginTimes = this.behaviorData.loginTimes;

        if (loginTimes.length < 7) return 0;

        // Check if user logs in consistently (similar hours)
        const hours = loginTimes.slice(-7).map(l => l.hour);
        const avgHour = hours.reduce((a, b) => a + b, 0) / hours.length;
        const variance = hours.reduce((sum, h) => sum + Math.pow(h - avgHour, 2), 0) / hours.length;

        // Lower variance = more consistent
        return Math.max(0, 1 - variance / 100);
    }

    // Public API
    getRecommendations(limit = 10) {
        return this.recommendations.slice(0, limit);
    }

    getInsights() {
        return this.generateInsights();
    }

    getUserStats() {
        return {
            totalActivities: this.behaviorData.interactionPatterns.length,
            avgSessionLength: this.getAverageSessionLength(),
            mostActiveHour: this.getMostActiveHour(),
            favoriteCategory: this.getFavoriteCategory(),
            consistencyScore: this.getConsistencyScore(),
            completedContent: this.userProfile.completedContent.length
        };
    }

    getAverageSessionLength() {
        const lengths = this.behaviorData.sessionLengths;
        if (lengths.length === 0) return 0;

        return lengths.reduce((a, b) => a + b, 0) / lengths.length;
    }
}

// Initialize the personalization AI
if (typeof window !== 'undefined') {
    window.personalizationAI = new PersonalizationAI();
    console.log('🤖 Personalization AI ready!');
}
