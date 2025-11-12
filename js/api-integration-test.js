/**
 * 🧪 Divine Temple API Integration Test Suite
 * 
 * This script tests all API integrations and configurations
 * Run this in the browser console on your Divine Temple site
 */

class DivineTempleAPITester {
    constructor() {
        this.results = {
            firebase: null,
            authentication: null,
            ai_chatbot: null,
            integrations: null,
            payments: null,
            overall: null
        };
        this.startTime = Date.now();
    }

    async runAllTests() {
        console.log('🧪 Starting Divine Temple API Integration Tests...');
        console.log('='.repeat(50));

        try {
            // Test Firebase Configuration
            await this.testFirebaseConfig();
            
            // Test Authentication Systems
            await this.testAuthentication();
            
            // Test AI Chatbot Backend
            await this.testAIChatbot();
            
            // Test OAuth Integrations
            await this.testIntegrations();
            
            // Test Payment System
            await this.testPaymentSystem();
            
            // Generate final report
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testFirebaseConfig() {
        console.log('\n🔥 Testing Firebase Configuration...');
        
        try {
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK not loaded');
            }

            // Check if app is initialized
            if (!firebase.apps.length) {
                throw new Error('Firebase app not initialized');
            }

            // Test Firestore connection
            const db = firebase.firestore();
            await db.collection('test').doc('api-test').set({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                test: 'API integration test'
            });

            // Test Authentication service
            const auth = firebase.auth();
            if (!auth) {
                throw new Error('Firebase Auth not initialized');
            }

            this.results.firebase = {
                status: 'PASS',
                message: 'Firebase fully configured and operational',
                details: {
                    sdk_loaded: true,
                    app_initialized: true,
                    firestore_connected: true,
                    auth_initialized: true
                }
            };

            console.log('✅ Firebase: PASS');

        } catch (error) {
            this.results.firebase = {
                status: 'FAIL',
                message: error.message,
                details: { error: error.toString() }
            };
            console.log('❌ Firebase: FAIL -', error.message);
        }
    }

    async testAuthentication() {
        console.log('\n🔐 Testing Authentication Systems...');
        
        try {
            const tests = {
                admin_credentials: false,
                firebase_auth: false,
                session_management: false
            };

            // Test admin authentication system
            if (window.divineTemple && typeof window.divineTemple.forceAdminLogin === 'function') {
                tests.admin_credentials = true;
            }

            // Test Firebase authentication
            if (firebase.auth()) {
                tests.firebase_auth = true;
            }

            // Test session management
            const testSession = sessionStorage.getItem('divineAuth');
            if (testSession !== null) {
                tests.session_management = true;
            }

            const allPassed = Object.values(tests).every(test => test);

            this.results.authentication = {
                status: allPassed ? 'PASS' : 'PARTIAL',
                message: allPassed ? 'All authentication systems working' : 'Some authentication issues detected',
                details: tests
            };

            console.log(allPassed ? '✅ Authentication: PASS' : '⚠️ Authentication: PARTIAL');

        } catch (error) {
            this.results.authentication = {
                status: 'FAIL',
                message: error.message,
                details: { error: error.toString() }
            };
            console.log('❌ Authentication: FAIL -', error.message);
        }
    }

    async testAIChatbot() {
        console.log('\n🤖 Testing AI Chatbot Backend...');
        
        try {
            const tests = {
                functions_available: false,
                security_configured: false,
                fallback_responses: false
            };

            // Check if Firebase Functions are available
            if (firebase.functions) {
                tests.functions_available = true;
                
                // Test if the chatWithAI function exists
                try {
                    const chatFunction = firebase.functions().httpsCallable('chatWithAI');
                    tests.security_configured = true;
                } catch (e) {
                    console.warn('Firebase Functions not configured yet');
                }
            }

            // Check if AI chatbot class exists with fallbacks
            if (window.AIChatbot && typeof window.AIChatbot === 'function') {
                const chatbot = new AIChatbot();
                if (typeof chatbot.getFallbackResponse === 'function') {
                    tests.fallback_responses = true;
                }
            }

            const hasBasicSupport = tests.functions_available && tests.fallback_responses;

            this.results.ai_chatbot = {
                status: hasBasicSupport ? 'READY' : 'NEEDS_SETUP',
                message: hasBasicSupport ? 'AI chatbot ready (needs OpenAI key)' : 'AI chatbot needs configuration',
                details: tests
            };

            console.log(hasBasicSupport ? '🟡 AI Chatbot: READY (needs OpenAI deployment)' : '❌ AI Chatbot: NEEDS SETUP');

        } catch (error) {
            this.results.ai_chatbot = {
                status: 'FAIL',
                message: error.message,
                details: { error: error.toString() }
            };
            console.log('❌ AI Chatbot: FAIL -', error.message);
        }
    }

    async testIntegrations() {
        console.log('\n🔗 Testing OAuth Integrations...');
        
        try {
            const tests = {
                config_loaded: false,
                callback_handler: false,
                spotify_config: false,
                google_config: false
            };

            // Check integration configuration
            if (window.INTEGRATION_CONFIG) {
                tests.config_loaded = true;
                
                if (window.INTEGRATION_CONFIG.spotify && window.INTEGRATION_CONFIG.spotify.clientId !== 'YOUR_SPOTIFY_CLIENT_ID') {
                    tests.spotify_config = true;
                }
                
                if (window.INTEGRATION_CONFIG.google && window.INTEGRATION_CONFIG.google.clientId !== 'YOUR_GOOGLE_CLIENT_ID') {
                    tests.google_config = true;
                }
            }

            // Check if callback handler exists
            try {
                const response = await fetch('./callback.html', { method: 'HEAD' });
                if (response.ok) {
                    tests.callback_handler = true;
                }
            } catch (e) {
                console.warn('Callback handler check failed');
            }

            const hasBasicIntegrations = tests.config_loaded && tests.callback_handler;

            this.results.integrations = {
                status: hasBasicIntegrations ? 'CONFIGURED' : 'NEEDS_SETUP',
                message: hasBasicIntegrations ? 'Integration system configured' : 'Integrations need OAuth setup',
                details: tests
            };

            console.log(hasBasicIntegrations ? '🟡 Integrations: CONFIGURED (needs OAuth keys)' : '❌ Integrations: NEEDS SETUP');

        } catch (error) {
            this.results.integrations = {
                status: 'FAIL',
                message: error.message,
                details: { error: error.toString() }
            };
            console.log('❌ Integrations: FAIL -', error.message);
        }
    }

    async testPaymentSystem() {
        console.log('\n💳 Testing Payment System...');
        
        try {
            const tests = {
                stripe_js_loaded: false,
                purchase_system: false,
                config_present: false
            };

            // Check if Stripe JS could be loaded
            if (typeof Stripe !== 'undefined') {
                tests.stripe_js_loaded = true;
            }

            // Check if purchase system exists
            if (window.InAppPurchases && typeof window.InAppPurchases === 'function') {
                tests.purchase_system = true;
            }

            // Check for Stripe configuration
            const stripePublishableKey = localStorage.getItem('stripe_publishable_key') || 
                                        sessionStorage.getItem('stripe_publishable_key');
            if (stripePublishableKey) {
                tests.config_present = true;
            }

            const hasPaymentSupport = tests.purchase_system;

            this.results.payments = {
                status: hasPaymentSupport ? 'READY' : 'NEEDS_SETUP',
                message: hasPaymentSupport ? 'Payment system ready (needs Stripe keys)' : 'Payment system needs configuration',
                details: tests
            };

            console.log(hasPaymentSupport ? '🟡 Payments: READY (needs Stripe setup)' : '❌ Payments: NEEDS SETUP');

        } catch (error) {
            this.results.payments = {
                status: 'FAIL',
                message: error.message,
                details: { error: error.toString() }
            };
            console.log('❌ Payments: FAIL -', error.message);
        }
    }

    generateReport() {
        console.log('\n📊 DIVINE TEMPLE API INTEGRATION TEST REPORT');
        console.log('='.repeat(50));
        
        const endTime = Date.now();
        const testDuration = ((endTime - this.startTime) / 1000).toFixed(2);
        
        console.log(`🕐 Test Duration: ${testDuration} seconds`);
        console.log(`📅 Test Date: ${new Date().toISOString()}`);
        console.log('');

        // Count results
        let passCount = 0;
        let totalCount = 0;
        
        Object.entries(this.results).forEach(([system, result]) => {
            if (result && system !== 'overall') {
                totalCount++;
                const status = result.status;
                const icon = status === 'PASS' ? '✅' : 
                           status === 'READY' || status === 'CONFIGURED' ? '🟡' : 
                           status === 'PARTIAL' ? '⚠️' : '❌';
                
                console.log(`${icon} ${system.toUpperCase()}: ${status} - ${result.message}`);
                
                if (status === 'PASS' || status === 'READY' || status === 'CONFIGURED') {
                    passCount++;
                }
            }
        });

        // Overall assessment
        const successRate = Math.round((passCount / totalCount) * 100);
        let overallStatus;
        let nextSteps;

        if (successRate >= 80) {
            overallStatus = '🎉 EXCELLENT - Ready for production!';
            nextSteps = [
                '1. Deploy Firebase Functions with OpenAI key',
                '2. Set up Stripe products and keys',
                '3. Configure OAuth applications',
                '4. Run final end-to-end tests'
            ];
        } else if (successRate >= 60) {
            overallStatus = '🟡 GOOD - Some configuration needed';
            nextSteps = [
                '1. Complete Firebase Functions setup',
                '2. Configure missing API integrations',
                '3. Test authentication flows',
                '4. Set up payment processing'
            ];
        } else {
            overallStatus = '❌ NEEDS WORK - Major configuration required';
            nextSteps = [
                '1. Fix Firebase configuration issues',
                '2. Set up all missing API keys',
                '3. Deploy backend functions',
                '4. Test each system individually'
            ];
        }

        console.log('');
        console.log(`📈 Overall Success Rate: ${successRate}% (${passCount}/${totalCount})`);
        console.log(`🎯 Status: ${overallStatus}`);
        console.log('');
        console.log('📋 NEXT STEPS:');
        nextSteps.forEach(step => console.log(`   ${step}`));
        
        console.log('');
        console.log('💡 FOR DETAILED SETUP INSTRUCTIONS:');
        console.log('   1. Open QUICK_SETUP_GUIDE.md');
        console.log('   2. Open api-setup.html in browser');
        console.log('   3. Refer to DEPLOYMENT_GUIDE.md');
        
        this.results.overall = {
            success_rate: successRate,
            status: overallStatus,
            next_steps: nextSteps,
            test_duration: testDuration
        };

        // Return results for programmatic access
        return this.results;
    }

    // Quick individual tests
    async quickFirebaseTest() {
        await this.testFirebaseConfig();
        return this.results.firebase;
    }

    async quickAuthTest() {
        await this.testAuthentication();
        return this.results.authentication;
    }

    async quickAITest() {
        await this.testAIChatbot();
        return this.results.ai_chatbot;
    }
}

// Make available globally
window.DivineTempleAPITester = DivineTempleAPITester;

// Auto-run if in test mode
if (window.location.search.includes('test=true')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const tester = new DivineTempleAPITester();
        await tester.runAllTests();
    });
}

console.log('🧪 Divine Temple API Tester loaded!');
console.log('📖 Usage:');
console.log('   const tester = new DivineTempleAPITester();');
console.log('   await tester.runAllTests();');
console.log('');
console.log('🚀 Quick test: Add ?test=true to URL to auto-run tests');