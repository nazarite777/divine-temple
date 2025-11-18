/**
 * Premium Access Control System
 * Prevents unauthorized access to premium content
 *
 * This module provides secure server-validated access control
 * for premium features and content.
 */

(function() {
    'use strict';

    // AUTHORIZED PREMIUM USERS - ONLY these users can access premium content
    const AUTHORIZED_PREMIUM_USERS = [
        'cbevvv@gmail.com',
        'nazir23'
    ];

    // Premium membership tiers that have full access (DEPRECATED - using authorized users list)
    const PREMIUM_TIERS = ['premium', 'elite', 'admin', 'founding'];

    // Basic/free tiers with limited access
    const FREE_TIERS = ['free', 'basic'];

    // Sections that require premium access
    const PREMIUM_SECTIONS = [
        'daily-trivia-PREMIUM.html',
        'chakras-auras.html',
        'meditation-mindfulness.html',
        'oracle-divination.html',
        'tarot.html',
        'crystal-oracle.html',
        'energy-healing.html',
        'sacred-knowledge.html',
        'spiritual-practices.html',
        'personal-growth.html',
        'devotion-growth.html',
        'videos-media.html',
        'spiritual-music.html',
        'sacred-arts-sound.html',
        'singing-bowl-garden.html',
        'spiritual-tools.html',
        'sacred-books.html',
        'reward-shop.html',
        'progress-dashboard.html',
        'calendar.html'
    ];

    // Free sections accessible to all authenticated users
    const FREE_SECTIONS = [
        'daily-trivia-FREE.html',
        'community.html',
        'chakra-memory-match.html',
        'crystal-memory-game.html',
        'mandala-coloring.html',
        'crystals-elements.html'
    ];

    class PremiumAccessControl {
        constructor() {
            this.initialized = false;
            this.currentUser = null;
            this.membershipLevel = null;
            this.hasPremiumAccess = false;
        }

        /**
         * Initialize the access control system
         */
        async initialize() {
            if (this.initialized) return;

            console.log('🔐 Initializing Premium Access Control...');

            // Wait for Firebase to be ready
            await this.waitForFirebase();

            // Check authentication status
            await this.checkAuthentication();

            this.initialized = true;
            console.log('✅ Access Control Initialized');
        }

        /**
         * Wait for Firebase to be loaded and initialized
         */
        async waitForFirebase() {
            return new Promise((resolve) => {
                const checkFirebase = () => {
                    if (typeof firebase !== 'undefined' && firebase.auth) {
                        resolve();
                    } else {
                        setTimeout(checkFirebase, 100);
                    }
                };
                checkFirebase();
            });
        }

        /**
         * Check if user is authenticated and authorized
         */
        async checkAuthentication() {
            return new Promise((resolve) => {
                firebase.auth().onAuthStateChanged(async (user) => {
                    if (user) {
                        this.currentUser = user;
                        await this.checkAuthorization(user);
                    } else {
                        this.currentUser = null;
                        this.membershipLevel = null;
                        this.hasPremiumAccess = false;
                        localStorage.removeItem('membershipLevel');
                        localStorage.removeItem('isAuthorizedUser');
                    }
                    resolve();
                });
            });
        },

        /**
         * Get user's membership level from Firestore
         */
        async getMembershipLevel(userId) {
            try {
                const userDoc = await firebase.firestore()
                    .collection('users')
                    .doc(userId)
                    .get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    this.membershipLevel = userData.membershipLevel || 'basic';

                    // Update localStorage for quick reference
                    localStorage.setItem('membershipLevel', this.membershipLevel);

                    // Check if user has premium access
                    this.hasPremiumAccess = PREMIUM_TIERS.includes(this.membershipLevel);

                    console.log('📊 Membership Level:', this.membershipLevel);
                    console.log('💎 Premium Access:', this.hasPremiumAccess);
                } else {
                    // No user document - default to basic
                    this.membershipLevel = 'basic';
                    this.hasPremiumAccess = false;

                    console.warn('⚠️ No user document found - defaulting to basic');
                }
            } catch (error) {
                console.error('❌ Error fetching membership level:', error);
                this.membershipLevel = 'basic';
                this.hasPremiumAccess = false;
            }
        }

        /**
         * Check if current page requires premium access
         */
        isCurrentPagePremium() {
            const currentPath = window.location.pathname;
            const currentFile = currentPath.split('/').pop();

            return PREMIUM_SECTIONS.includes(currentFile);
        }

        /**
         * Check if current page is a free section
         */
        isCurrentPageFree() {
            const currentPath = window.location.pathname;
            const currentFile = currentPath.split('/').pop();

            return FREE_SECTIONS.includes(currentFile);
        }

        /**
         * Check if user has access to current page
         */
        async hasAccessToCurrentPage() {
            await this.initialize();

            // Not authenticated - no access to any protected content
            if (!this.currentUser) {
                return false;
            }

            // Check if page is premium
            if (this.isCurrentPagePremium()) {
                return this.hasPremiumAccess;
            }

            // Free sections or public pages - allow if authenticated
            return true;
        }

        /**
         * Enforce access control on current page
         * Redirects unauthorized users
         */
        async enforceAccess() {
            await this.initialize();

            console.log('🔒 Enforcing access control...');

            // Check if not authenticated
            if (!this.currentUser) {
                console.warn('⛔ Not authenticated - redirecting to login');
                this.redirectToLogin();
                return false;
            }

            // Check if page requires premium access
            if (this.isCurrentPagePremium() && !this.hasPremiumAccess) {
                console.warn('⛔ PREMIUM ACCESS BLOCKED - User not in authorized list');
                this.showAccessBlockedMessage();
                return false;
            }

            console.log('✅ Access granted');
            return true;
        }

        /**
         * Redirect to login page
         */
        redirectToLogin() {
            const currentPage = window.location.pathname;
            sessionStorage.setItem('redirectAfterLogin', currentPage);

            // Show message before redirect
            this.showAccessDeniedMessage('Please log in to access this content');

            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        }

        /**
         * Show access blocked message for unauthorized users
         */
        showAccessBlockedMessage() {
            const currentUser = this.currentUser;
            const email = currentUser?.email || 'unknown';
            
            this.showAccessDeniedMessage(`🚫 ACCESS RESTRICTED: Only authorized users can access premium content. Your account (${email}) is not authorized for premium access. Contact support if you believe this is an error.`);
            
            setTimeout(() => {
                // Redirect to free dashboard
                window.location.href = '/free-dashboard.html';
            }, 5000);
        },

        /**
         * Redirect to upgrade page
         */
        redirectToUpgrade() {
            const currentPage = window.location.pathname;
            sessionStorage.setItem('intendedDestination', currentPage);

            // Show message before redirect
            this.showAccessDeniedMessage('This content requires a premium membership');

            setTimeout(() => {
                window.location.href = '/free-dashboard.html?showUpgrade=true';
            }, 2000);
        }

        /**
         * Show access denied message to user
         */
        showAccessDeniedMessage(message) {
            // Create overlay
            const overlay = document.createElement('div');
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

            // Create message box
            const messageBox = document.createElement('div');
            messageBox.style.cssText = `
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #d4af37;
                border-radius: 20px;
                padding: 3rem;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 20px 60px rgba(212, 175, 55, 0.3);
            `;

            messageBox.innerHTML = `
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
                <h2 style="color: #d4af37; font-size: 1.8rem; margin-bottom: 1rem; font-family: 'Playfair Display', serif;">
                    Access Restricted
                </h2>
                <p style="color: #ffffff; font-size: 1.1rem; margin-bottom: 1.5rem;">
                    ${message}
                </p>
                <div style="color: #8b5cf6; font-size: 0.9rem;">
                    Redirecting...
                </div>
            `;

            overlay.appendChild(messageBox);
            document.body.appendChild(overlay);

            // Add fade-in animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        /**
         * Check if user can access a specific section
         */
        canAccessSection(sectionFile) {
            if (!this.initialized) {
                console.warn('Access control not initialized');
                return false;
            }

            // Premium sections require premium membership
            if (PREMIUM_SECTIONS.includes(sectionFile)) {
                return this.hasPremiumAccess;
            }

            // Free sections require authentication
            if (FREE_SECTIONS.includes(sectionFile)) {
                return !!this.currentUser;
            }

            // Unknown section - deny by default
            return false;
        }

        /**
         * Get upgrade URL for current user
         */
        getUpgradeUrl() {
            return '/free-dashboard.html?showUpgrade=true';
        }

        /**
         * Show upgrade modal (can be called from any page)
         */
        showUpgradeModal() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
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
                    <p style="color: #ffffff; font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.6;">
                        Access exclusive content, advanced features, and the complete Divine Temple experience.
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button onclick="window.location.href='/free-dashboard.html?showUpgrade=true'" style="
                            background: linear-gradient(135deg, #d4af37, #f59e0b);
                            border: none;
                            color: white;
                            padding: 1rem 2rem;
                            border-radius: 15px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: transform 0.3s ease;
                        ">
                            View Plans
                        </button>
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            color: white;
                            padding: 1rem 2rem;
                            border-radius: 15px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                        ">
                            Close
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
        }
    }

    // Create global instance
    window.PremiumAccessControl = new PremiumAccessControl();

    // Auto-enforce access control when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.PremiumAccessControl.enforceAccess();
        });
    } else {
        window.PremiumAccessControl.enforceAccess();
    }

    console.log('🔐 Premium Access Control Module Loaded');
})();
