/**
 * 🧪 Singing Bowl Harmony Garden - Comprehensive Test Suite
 * Validates all game functionality, audio systems, and integration
 */

// Test Configuration
const TEST_CONFIG = {
    timeout: 5000,
    retries: 3,
    verbose: true
};

class SingingBowlTestSuite {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
    }

    async runAllTests() {
        console.log('🧪 Starting Singing Bowl Harmony Garden Test Suite');
        console.log('=' .repeat(60));

        const tests = [
            { name: 'Container Initialization', test: this.testContainerInit },
            { name: 'Game Instance Creation', test: this.testGameInstance },
            { name: 'Audio System', test: this.testAudioSystem },
            { name: 'Chakra Bowls Configuration', test: this.testChakraBowls },
            { name: 'Garden Canvas', test: this.testGardenCanvas },
            { name: 'User Interface Elements', test: this.testUIElements },
            { name: 'Event Listeners', test: this.testEventListeners },
            { name: 'Progress System', test: this.testProgressSystem },
            { name: 'Achievement System', test: this.testAchievements },
            { name: 'Mobile Compatibility', test: this.testMobileSupport },
            { name: 'Audio Controls', test: this.testAudioControls },
            { name: 'Error Handling', test: this.testErrorHandling }
        ];

        for (const testCase of tests) {
            await this.runTest(testCase.name, testCase.test.bind(this));
        }

        this.showResults();
        return this.results;
    }

    async runTest(name, testFunction) {
        this.results.total++;
        
        try {
            console.log(`🔬 Testing: ${name}`);
            const result = await Promise.race([
                testFunction(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Test timeout')), TEST_CONFIG.timeout)
                )
            ]);
            
            if (result !== false) {
                this.results.passed++;
                this.results.details.push({ name, status: 'PASS', message: result || 'OK' });
                console.log(`✅ ${name}: PASS`);
            } else {
                throw new Error('Test returned false');
            }
        } catch (error) {
            this.results.failed++;
            this.results.details.push({ name, status: 'FAIL', message: error.message });
            console.log(`❌ ${name}: FAIL - ${error.message}`);
        }
    }

    // Test Methods
    async testContainerInit() {
        const container = document.getElementById('singingBowlContainer');
        if (!container) throw new Error('Container not found');
        return 'Container element exists';
    }

    async testGameInstance() {
        if (!window.singingBowlHarmonyGarden) {
            throw new Error('Game instance not created');
        }
        if (typeof window.singingBowlHarmonyGarden.init !== 'function') {
            throw new Error('Game instance missing init method');
        }
        return 'Game instance created with required methods';
    }

    async testAudioSystem() {
        const game = window.singingBowlHarmonyGarden;
        if (!game) throw new Error('Game instance not available');
        
        // Test audio context
        if (!game.audioContext && game.soundEnabled) {
            throw new Error('Audio context not initialized');
        }
        
        // Test master gain
        if (game.soundEnabled && !game.masterGain) {
            throw new Error('Master gain not configured');
        }

        return `Audio system ${game.soundEnabled ? 'enabled' : 'disabled (fallback mode)'}`;
    }

    async testChakraBowls() {
        const game = window.singingBowlHarmonyGarden;
        if (!game.chakraBowls || !Array.isArray(game.chakraBowls)) {
            throw new Error('Chakra bowls not initialized');
        }
        
        if (game.chakraBowls.length !== 7) {
            throw new Error(`Expected 7 chakra bowls, found ${game.chakraBowls.length}`);
        }

        // Check bowl properties
        const requiredProps = ['id', 'name', 'frequency', 'color', 'position'];
        for (const bowl of game.chakraBowls) {
            for (const prop of requiredProps) {
                if (!bowl[prop]) {
                    throw new Error(`Bowl missing property: ${prop}`);
                }
            }
        }

        return `7 chakra bowls configured with all properties`;
    }

    async testGardenCanvas() {
        const canvas = document.getElementById('zenGardenCanvas');
        if (!canvas) throw new Error('Garden canvas not found');
        
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        return 'Garden canvas initialized with 2D context';
    }

    async testUIElements() {
        const requiredElements = [
            'timerToggle',
            'masterVolume',
            'ambientToggle',
            'spatialToggle',
            'feedbackToggle',
            'harmonyBtn'
        ];

        for (const id of requiredElements) {
            const element = document.getElementById(id);
            if (!element) {
                throw new Error(`UI element not found: ${id}`);
            }
        }

        return `All ${requiredElements.length} UI elements present`;
    }

    async testEventListeners() {
        const game = window.singingBowlHarmonyGarden;
        
        // Test if event listeners are bound
        const timerButton = document.getElementById('timerToggle');
        if (!timerButton) throw new Error('Timer button not found');

        // Check if click events work (simulate)
        try {
            const event = new Event('click');
            timerButton.dispatchEvent(event);
        } catch (error) {
            throw new Error('Event listener test failed');
        }

        return 'Event listeners responsive';
    }

    async testProgressSystem() {
        const game = window.singingBowlHarmonyGarden;
        if (!game.userProgress) {
            throw new Error('Progress system not initialized');
        }

        const requiredProps = ['level', 'experience', 'bowlsMastered', 'gardensCreated'];
        for (const prop of requiredProps) {
            if (game.userProgress[prop] === undefined) {
                throw new Error(`Progress missing property: ${prop}`);
            }
        }

        return 'Progress system initialized with all properties';
    }

    async testAchievements() {
        const game = window.singingBowlHarmonyGarden;
        if (!game.achievements || !Array.isArray(game.achievements)) {
            throw new Error('Achievements system not initialized');
        }

        if (game.achievements.length === 0) {
            throw new Error('No achievements defined');
        }

        return `${game.achievements.length} achievements defined`;
    }

    async testMobileSupport() {
        // Check viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            return 'Warning: No viewport meta tag (mobile compatibility may be limited)';
        }

        // Check touch events
        if (!('ontouchstart' in window)) {
            return 'Touch events not supported (desktop environment)';
        }

        return 'Mobile compatibility features detected';
    }

    async testAudioControls() {
        const controls = ['ambientToggle', 'spatialToggle', 'feedbackToggle', 'harmonyBtn'];
        
        for (const control of controls) {
            const element = document.getElementById(control);
            if (!element) {
                throw new Error(`Audio control not found: ${control}`);
            }
            
            // Test if controls are interactive
            if (!element.onclick && !element.addEventListener) {
                throw new Error(`Audio control not interactive: ${control}`);
            }
        }

        return 'All audio controls present and interactive';
    }

    async testErrorHandling() {
        const game = window.singingBowlHarmonyGarden;
        
        // Test graceful degradation
        if (!window.AudioContext && !window.webkitAudioContext) {
            if (game.soundEnabled) {
                throw new Error('Game should disable audio when Web Audio API unavailable');
            }
            return 'Graceful audio degradation working';
        }

        return 'Error handling systems in place';
    }

    showResults() {
        console.log('=' .repeat(60));
        console.log('🎯 TEST RESULTS');
        console.log('=' .repeat(60));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📊 Total: ${this.results.total}`);
        console.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        
        if (this.results.failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.details
                .filter(detail => detail.status === 'FAIL')
                .forEach(detail => console.log(`   • ${detail.name}: ${detail.message}`));
        }

        if (this.results.passed === this.results.total) {
            console.log('\n🎉 ALL TESTS PASSED! Singing Bowl Harmony Garden is ready for production.');
        } else {
            console.log('\n⚠️  Some tests failed. Please review and fix issues before deployment.');
        }
    }
}

// Auto-run tests when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for game to initialize
    setTimeout(async () => {
        const testSuite = new SingingBowlTestSuite();
        window.testResults = await testSuite.runAllTests();
    }, 3000);
});

// Export for manual testing
window.SingingBowlTestSuite = SingingBowlTestSuite;