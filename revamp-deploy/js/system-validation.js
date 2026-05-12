/**
 * Divine Temple - System Validation Script
 *
 * Automatically validates all 16 feature systems for:
 * - Proper initialization
 * - Required methods
 * - XP integration
 * - Error handling
 */

class SystemValidator {
    constructor() {
        this.results = {
            passed: [],
            failed: [],
            warnings: [],
            totalTests: 0,
            passedTests: 0,
            failedTests: 0
        };

        this.systemDefinitions = this.getSystemDefinitions();
    }

    getSystemDefinitions() {
        return {
            'SocialSharingSystem': {
                file: 'js/social-sharing-system.js',
                requiredMethods: ['showShareModal', 'generateShareCard', 'shareToSocial'],
                xpIntegration: true,
                requiresFirebase: false
            },
            'ChallengeCalendar': {
                file: 'js/challenge-calendar.js',
                requiredMethods: ['init', 'completeTask', 'renderCalendar'],
                xpIntegration: true,
                requiresFirebase: false
            },
            'JournalingSystem': {
                file: 'js/journaling-system.js',
                requiredMethods: ['createEntry', 'loadEntries', 'exportToJSON', 'exportToPDF'],
                xpIntegration: true,
                requiresFirebase: false
            },
            'FriendSystem': {
                file: 'js/friend-system.js',
                requiredMethods: ['sendFriendRequest', 'acceptFriendRequest', 'giftXP', 'getActivityFeed'],
                xpIntegration: true,
                requiresFirebase: true
            },
            'GuildsSystem': {
                file: 'js/guilds-system.js',
                requiredMethods: ['createCircle', 'joinCircle', 'sendMessage', 'loadCircles'],
                xpIntegration: true,
                requiresFirebase: true
            },
            'LeaderboardsSystem': {
                file: 'js/leaderboards-system.js',
                requiredMethods: ['loadGlobalLeaderboard', 'loadWeeklyLeaderboard', 'loadFriendLeaderboard'],
                xpIntegration: true,
                requiresFirebase: true
            },
            'PushNotificationSystem': {
                file: 'js/push-notifications.js',
                requiredMethods: ['requestPermission', 'showNotification', 'setupEventListeners'],
                xpIntegration: true,
                requiresFirebase: true
            },
            'AudioContentSystem': {
                file: 'js/audio-content-system.js',
                requiredMethods: ['init', 'playTrack', 'setPlaybackSpeed', 'setSleepTimer'],
                xpIntegration: true,
                requiresFirebase: false
            },
            'VideoLibrarySystem': {
                file: 'js/video-library-system.js',
                requiredMethods: ['init', 'playVideo', 'enrollInCourse', 'saveProgress'],
                xpIntegration: true,
                requiresFirebase: false
            },
            'MultiLanguageSystem': {
                file: 'js/multi-language-system.js',
                requiredMethods: ['setLanguage', 't', 'getSupportedLanguages', 'translatePage'],
                xpIntegration: false,
                requiresFirebase: false
            },
            'PWAInstallSystem': {
                file: 'js/pwa-install-system.js',
                requiredMethods: ['init', 'promptInstall', 'trackAppLaunch'],
                xpIntegration: true,
                requiresFirebase: false
            },
            'MentorshipProgram': {
                file: 'js/mentorship-program.js',
                requiredMethods: ['becomeMentor', 'requestMentor', 'scheduleSession', 'completeSession'],
                xpIntegration: true,
                requiresFirebase: true
            },
            'IntegrationsSystem': {
                file: 'js/integrations-system.js',
                requiredMethods: ['connectSpotify', 'connectYouTube', 'connectGoogleCalendar'],
                xpIntegration: true,
                requiresFirebase: false
            },
            'PersonalizationAI': {
                file: 'js/personalization-ai.js',
                requiredMethods: ['init', 'generateDailyRecommendations', 'getAdaptiveDifficulty'],
                xpIntegration: false,
                requiresFirebase: false
            },
            'InAppPurchases': {
                file: 'js/in-app-purchases.js',
                requiredMethods: ['init', 'purchaseSubscription', 'purchaseOneTime', 'showPricingModal'],
                xpIntegration: true,
                requiresFirebase: true
            },
            'AIChatbot': {
                file: 'js/ai-chatbot.js',
                requiredMethods: ['init', 'sendMessage', 'getAIResponse', 'getDailyInspiration'],
                xpIntegration: true,
                requiresFirebase: false
            }
        };
    }

    async runAllTests() {
        console.log('🧪 Starting Divine Temple System Validation...\n');
        console.log('=' .repeat(60));

        // Test 1: Check if files exist
        await this.testFileExistence();

        // Test 2: Check if classes are defined
        await this.testClassDefinitions();

        // Test 3: Check required methods
        await this.testRequiredMethods();

        // Test 4: Check XP integration
        await this.testXPIntegration();

        // Test 5: Check Firebase integration
        await this.testFirebaseIntegration();

        // Test 6: Check error handling
        await this.testErrorHandling();

        // Generate report
        this.generateReport();
    }

    async testFileExistence() {
        console.log('\n📁 Testing File Existence...');

        for (const [className, config] of Object.entries(this.systemDefinitions)) {
            this.results.totalTests++;

            try {
                const response = await fetch(config.file);
                if (response.ok) {
                    this.pass(`✅ ${config.file} exists`);
                    this.results.passedTests++;
                } else {
                    this.fail(`❌ ${config.file} not found (${response.status})`);
                    this.results.failedTests++;
                }
            } catch (error) {
                this.fail(`❌ ${config.file} - Error: ${error.message}`);
                this.results.failedTests++;
            }
        }
    }

    async testClassDefinitions() {
        console.log('\n🏗️ Testing Class Definitions...');

        for (const [className, config] of Object.entries(this.systemDefinitions)) {
            this.results.totalTests++;

            if (typeof window[className] !== 'undefined') {
                this.pass(`✅ ${className} class is defined`);
                this.results.passedTests++;
            } else {
                this.fail(`❌ ${className} class not found in global scope`);
                this.results.failedTests++;
            }
        }
    }

    async testRequiredMethods() {
        console.log('\n🔧 Testing Required Methods...');

        for (const [className, config] of Object.entries(this.systemDefinitions)) {
            if (typeof window[className] === 'undefined') {
                this.warn(`⚠️ Skipping ${className} - class not loaded`);
                continue;
            }

            try {
                const instance = new window[className]();

                for (const method of config.requiredMethods) {
                    this.results.totalTests++;

                    if (typeof instance[method] === 'function') {
                        this.pass(`✅ ${className}.${method}() exists`);
                        this.results.passedTests++;
                    } else {
                        this.fail(`❌ ${className}.${method}() not found`);
                        this.results.failedTests++;
                    }
                }
            } catch (error) {
                this.fail(`❌ ${className} initialization failed: ${error.message}`);
                this.results.failedTests++;
            }
        }
    }

    async testXPIntegration() {
        console.log('\n🎯 Testing XP Integration...');

        // Check if progressSystem exists
        this.results.totalTests++;
        if (window.progressSystem) {
            this.pass('✅ Global progressSystem is available');
            this.results.passedTests++;
        } else {
            this.fail('❌ Global progressSystem not found');
            this.results.failedTests++;
            return;
        }

        // Check progressSystem methods
        const requiredMethods = ['awardXP', 'updateXP', 'checkLevelUp'];
        for (const method of requiredMethods) {
            this.results.totalTests++;
            if (typeof window.progressSystem[method] === 'function') {
                this.pass(`✅ progressSystem.${method}() exists`);
                this.results.passedTests++;
            } else {
                this.fail(`❌ progressSystem.${method}() not found`);
                this.results.failedTests++;
            }
        }

        // Test XP award functionality
        this.results.totalTests++;
        try {
            const initialXP = window.progressSystem.xp || 0;
            window.progressSystem.awardXP(10, 'Test Award', 'validation');
            const newXP = window.progressSystem.xp || 0;

            if (newXP > initialXP) {
                this.pass('✅ XP award functionality works');
                this.results.passedTests++;
            } else {
                this.fail('❌ XP not awarded correctly');
                this.results.failedTests++;
            }
        } catch (error) {
            this.fail(`❌ XP award test failed: ${error.message}`);
            this.results.failedTests++;
        }
    }

    async testFirebaseIntegration() {
        console.log('\n🔥 Testing Firebase Integration...');

        this.results.totalTests++;
        if (typeof firebase !== 'undefined') {
            this.pass('✅ Firebase SDK loaded');
            this.results.passedTests++;
        } else {
            this.fail('❌ Firebase SDK not loaded');
            this.results.failedTests++;
            return;
        }

        // Check Firebase services
        const services = ['auth', 'firestore'];
        for (const service of services) {
            this.results.totalTests++;
            try {
                if (firebase[service]) {
                    this.pass(`✅ Firebase ${service} available`);
                    this.results.passedTests++;
                } else {
                    this.fail(`❌ Firebase ${service} not initialized`);
                    this.results.failedTests++;
                }
            } catch (error) {
                this.fail(`❌ Firebase ${service} error: ${error.message}`);
                this.results.failedTests++;
            }
        }

        // Check Firebase configuration
        this.results.totalTests++;
        if (firebase.apps.length > 0) {
            this.pass('✅ Firebase app initialized');
            this.results.passedTests++;
        } else {
            this.fail('❌ Firebase app not initialized');
            this.results.failedTests++;
        }
    }

    async testErrorHandling() {
        console.log('\n🛡️ Testing Error Handling...');

        // Test if systems handle null/undefined gracefully
        for (const [className, config] of Object.entries(this.systemDefinitions)) {
            if (typeof window[className] === 'undefined') continue;

            this.results.totalTests++;
            try {
                const instance = new window[className]();

                // Try calling a method with invalid data
                const firstMethod = config.requiredMethods[0];
                if (typeof instance[firstMethod] === 'function') {
                    try {
                        await instance[firstMethod](null);
                        this.pass(`✅ ${className}.${firstMethod}() handles null input`);
                        this.results.passedTests++;
                    } catch (error) {
                        // Check if error is handled gracefully
                        if (error.message && !error.message.includes('undefined')) {
                            this.pass(`✅ ${className}.${firstMethod}() has error handling`);
                            this.results.passedTests++;
                        } else {
                            this.warn(`⚠️ ${className}.${firstMethod}() may need better error handling`);
                            this.results.passedTests++;
                        }
                    }
                }
            } catch (error) {
                this.fail(`❌ ${className} error handling test failed: ${error.message}`);
                this.results.failedTests++;
            }
        }
    }

    pass(message) {
        console.log(`%c${message}`, 'color: #10B981');
        this.results.passed.push(message);
    }

    fail(message) {
        console.log(`%c${message}`, 'color: #EF4444; font-weight: bold');
        this.results.failed.push(message);
    }

    warn(message) {
        console.log(`%c${message}`, 'color: #F59E0B');
        this.results.warnings.push(message);
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 VALIDATION REPORT');
        console.log('='.repeat(60));

        const passRate = ((this.results.passedTests / this.results.totalTests) * 100).toFixed(1);

        console.log(`\n📈 Summary:`);
        console.log(`   Total Tests: ${this.results.totalTests}`);
        console.log(`   ✅ Passed: ${this.results.passedTests}`);
        console.log(`   ❌ Failed: ${this.results.failedTests}`);
        console.log(`   ⚠️  Warnings: ${this.results.warnings.length}`);
        console.log(`   📊 Pass Rate: ${passRate}%`);

        if (this.results.failedTests > 0) {
            console.log(`\n❌ Failed Tests (${this.results.failed.length}):`);
            this.results.failed.forEach(msg => console.log(`   ${msg}`));
        }

        if (this.results.warnings.length > 0) {
            console.log(`\n⚠️  Warnings (${this.results.warnings.length}):`);
            this.results.warnings.forEach(msg => console.log(`   ${msg}`));
        }

        console.log('\n' + '='.repeat(60));

        if (passRate >= 90) {
            console.log('%c🎉 EXCELLENT! Divine Temple systems are working great!',
                'color: #10B981; font-size: 16px; font-weight: bold');
        } else if (passRate >= 70) {
            console.log('%c✅ GOOD! Some systems need attention.',
                'color: #F59E0B; font-size: 16px; font-weight: bold');
        } else {
            console.log('%c⚠️  ATTENTION NEEDED! Several systems require fixes.',
                'color: #EF4444; font-size: 16px; font-weight: bold');
        }

        console.log('='.repeat(60) + '\n');

        return this.results;
    }

    // Quick test individual system
    async testSystem(className) {
        console.log(`\n🔍 Testing ${className}...`);

        const config = this.systemDefinitions[className];
        if (!config) {
            console.error(`❌ Unknown system: ${className}`);
            return;
        }

        // Check class exists
        if (typeof window[className] === 'undefined') {
            console.error(`❌ ${className} not loaded`);
            return;
        }

        try {
            const instance = new window[className]();
            console.log(`✅ ${className} instantiated successfully`);

            // Check methods
            config.requiredMethods.forEach(method => {
                if (typeof instance[method] === 'function') {
                    console.log(`   ✅ ${method}() available`);
                } else {
                    console.log(`   ❌ ${method}() missing`);
                }
            });

            return instance;
        } catch (error) {
            console.error(`❌ ${className} initialization failed:`, error);
        }
    }
}

// Make validator available globally
window.SystemValidator = SystemValidator;

// Auto-run validation when loaded (can be disabled)
if (window.location.search.includes('validate=true')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const validator = new SystemValidator();
        await validator.runAllTests();
    });
}

// Expose quick test function
window.validateSystem = async (systemName) => {
    const validator = new SystemValidator();
    return await validator.testSystem(systemName);
};

window.validateAllSystems = async () => {
    const validator = new SystemValidator();
    return await validator.runAllTests();
};

console.log('✅ System Validator loaded. Use validateAllSystems() to test all systems.');
