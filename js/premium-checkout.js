/**
 * Premium Checkout - $9.99 Stripe Integration
 *
 * Handles premium membership purchase flow for non-premium users
 */

(function() {
    'use strict';

    class PremiumCheckout {
        constructor() {
            this.currentUser = null;
            this.isProcessing = false;
            this.init();
        }

        async init() {
            console.log('💳 Premium Checkout System initialized');

            // Wait for Firebase to be ready
            await this.waitForFirebase();

            // Check authentication
            firebase.auth().onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    this.checkPremiumStatus();
                }
            });
        }

        async waitForFirebase() {
            return new Promise((resolve) => {
                const checkFirebase = () => {
                    if (typeof firebase !== 'undefined' && firebase.auth && firebase.functions) {
                        resolve();
                    } else {
                        setTimeout(checkFirebase, 100);
                    }
                };
                checkFirebase();
            });
        }

        /**
         * Check if user already has premium
         */
        async checkPremiumStatus() {
            if (!this.currentUser) return;

            try {
                const verifyFunction = firebase.functions().httpsCallable('verifyPremiumAccess');
                const result = await verifyFunction({});

                if (result.data.hasPremiumAccess) {
                    console.log('✅ User already has premium access');
                    this.hidePremiumButtons();
                } else {
                    console.log('💎 User can upgrade to premium');
                    this.showPremiumButtons();
                }
            } catch (error) {
                console.error('Error checking premium status:', error);
            }
        }

        /**
         * Start the premium upgrade process
         */
        async upgradeToPremium() {
            // Check if user is authenticated
            if (!this.currentUser) {
                this.showMessage('Please log in to upgrade to premium', 'error');
                // Redirect to login
                window.location.href = '/login.html';
                return;
            }

            // Prevent double clicks
            if (this.isProcessing) {
                console.log('Already processing...');
                return;
            }

            this.isProcessing = true;
            this.showLoadingMessage();

            try {
                // Call Cloud Function to create Stripe checkout session
                const createCheckout = firebase.functions().httpsCallable('createCheckoutSession');

                const result = await createCheckout({
                    successUrl: window.location.origin + '/premium-success.html',
                    cancelUrl: window.location.origin + '/free-dashboard.html'
                });

                console.log('Checkout session created:', result.data.sessionId);

                // Redirect to Stripe Checkout
                window.location.href = result.data.url;

            } catch (error) {
                this.isProcessing = false;
                console.error('Error creating checkout:', error);

                let errorMessage = 'Failed to start checkout. Please try again.';

                if (error.code === 'unauthenticated') {
                    errorMessage = 'Please log in to upgrade to premium';
                    window.location.href = '/login.html';
                    return;
                } else if (error.code === 'already-exists') {
                    errorMessage = 'You already have premium access!';
                    this.hidePremiumButtons();
                } else if (error.code === 'failed-precondition') {
                    errorMessage = 'Payment system is not configured. Please contact support.';
                }

                this.showMessage(errorMessage, 'error');
                this.hideLoadingMessage();
            }
        }

        /**
         * Show premium upgrade buttons
         */
        showPremiumButtons() {
            const buttons = document.querySelectorAll('.premium-upgrade-btn, .upgrade-to-premium-btn');
            buttons.forEach(btn => {
                btn.style.display = 'inline-block';
                btn.disabled = false;
            });
        }

        /**
         * Hide premium upgrade buttons (user already has premium)
         */
        hidePremiumButtons() {
            const buttons = document.querySelectorAll('.premium-upgrade-btn, .upgrade-to-premium-btn');
            buttons.forEach(btn => {
                btn.style.display = 'none';
            });
        }

        /**
         * Show loading message
         */
        showLoadingMessage() {
            const overlay = document.createElement('div');
            overlay.id = 'premium-checkout-loading';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: fadeIn 0.3s ease;
            `;

            overlay.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 2px solid #d4af37;
                    border-radius: 20px;
                    padding: 3rem;
                    text-align: center;
                    max-width: 400px;
                ">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">💎</div>
                    <h2 style="color: #d4af37; font-size: 1.8rem; margin-bottom: 1rem;">
                        Preparing Checkout...
                    </h2>
                    <div class="spinner" style="
                        border: 4px solid rgba(212, 175, 55, 0.1);
                        border-top: 4px solid #d4af37;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    "></div>
                    <p style="color: #ffffff; margin-top: 1rem;">
                        Redirecting to secure payment...
                    </p>
                </div>
            `;

            // Add spin animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(overlay);
        }

        /**
         * Hide loading message
         */
        hideLoadingMessage() {
            const loading = document.getElementById('premium-checkout-loading');
            if (loading) {
                loading.remove();
            }
        }

        /**
         * Show message to user
         */
        showMessage(message, type = 'info') {
            const colors = {
                error: { bg: '#DC2626', border: '#EF4444' },
                success: { bg: '#10b981', border: '#059669' },
                info: { bg: '#3B82F6', border: '#2563EB' }
            };

            const color = colors[type] || colors.info;

            const messageBox = document.createElement('div');
            messageBox.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000000;
                background: ${color.bg};
                color: white;
                padding: 1.5rem;
                border-radius: 12px;
                border: 2px solid ${color.border};
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
                max-width: 400px;
            `;

            messageBox.innerHTML = `
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="font-size: 2rem;">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</div>
                    <div>
                        <p style="margin: 0; font-weight: 600;">${message}</p>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 16px;
                    ">×</button>
                </div>
            `;

            const style = document.createElement('style');
            style.textContent = `
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
            `;
            document.head.appendChild(style);

            document.body.appendChild(messageBox);

            // Auto-remove after 5 seconds
            setTimeout(() => messageBox.remove(), 5000);
        }

        /**
         * Show premium upgrade modal
         */
        showUpgradeModal() {
            const modal = document.createElement('div');
            modal.id = 'premium-upgrade-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: fadeIn 0.3s ease;
            `;

            modal.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 2px solid #d4af37;
                    border-radius: 25px;
                    padding: 3rem;
                    max-width: 600px;
                    text-align: center;
                    box-shadow: 0 25px 70px rgba(212, 175, 55, 0.4);
                ">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">💎</div>
                    <h2 style="color: #d4af37; font-size: 2rem; margin-bottom: 1rem; font-family: 'Playfair Display', serif;">
                        Unlock Premium Access
                    </h2>
                    <p style="color: #ffffff; font-size: 1.2rem; margin-bottom: 2rem; line-height: 1.6;">
                        Get full access to all premium features with a <strong>monthly subscription</strong> for just $9.99/month!
                    </p>

                    <div style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 15px; margin: 2rem 0; text-align: left;">
                        <div style="color: #d4af37; font-weight: 600; margin-bottom: 1rem;">Premium Features Include:</div>
                        <div style="color: #ffffff; line-height: 2;">
                            ✓ Full access to all premium content<br>
                            ✓ Advanced spiritual tools & practices<br>
                            ✓ Oracle readings & tarot<br>
                            ✓ Meditation & mindfulness library<br>
                            ✓ Crystal healing & energy work<br>
                            ✓ Sacred knowledge & teachings<br>
                            ✓ Progress tracking & rewards<br>
                            ✓ Priority support
                        </div>
                    </div>

                    <div style="font-size: 3rem; font-weight: 900; color: #d4af37; margin: 1.5rem 0;">
                        $9.99<span style="font-size: 1.5rem;">/mo</span>
                    </div>
                    <div style="color: #8b5cf6; font-size: 1.1rem; margin-bottom: 2rem;">
                        Monthly subscription • Cancel anytime
                    </div>

                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button onclick="window.premiumCheckout.upgradeToPremium()" style="
                            background: linear-gradient(135deg, #d4af37, #f59e0b);
                            border: none;
                            color: white;
                            padding: 1.2rem 2.5rem;
                            border-radius: 15px;
                            font-size: 1.2rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: transform 0.3s ease;
                            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            🚀 Upgrade Now
                        </button>
                        <button onclick="document.getElementById('premium-upgrade-modal').remove()" style="
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            color: white;
                            padding: 1.2rem 2.5rem;
                            border-radius: 15px;
                            font-size: 1.2rem;
                            font-weight: 600;
                            cursor: pointer;
                        ">
                            Maybe Later
                        </button>
                    </div>

                    <p style="color: #8b5cf6; margin-top: 2rem; font-size: 0.9rem;">
                        💳 Secure payment powered by Stripe
                    </p>
                </div>
            `;

            document.body.appendChild(modal);
        }
    }

    // Create global instance
    window.premiumCheckout = new PremiumCheckout();

    // Global function for buttons to call
    window.upgradeToPremium = function() {
        window.premiumCheckout.upgradeToPremium();
    };

    // Global function to show upgrade modal
    window.showPremiumUpgradeModal = function() {
        window.premiumCheckout.showUpgradeModal();
    };

    console.log('💎 Premium Checkout ready!');
})();
