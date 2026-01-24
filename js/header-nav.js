/**
 * Header Navigation JavaScript
 * Handles mobile menu, user authentication state, and navigation
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initializeHeader);

    function initializeHeader() {
        console.log('🎯 Initializing header navigation...');

        // Initialize mobile menu
        initializeMobileMenu();

        // Check authentication state and update header
        checkAuthenticationState();
    }

    /**
     * Initialize mobile menu functionality
     */
    function initializeMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenu = document.getElementById('close-menu');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (!mobileToggle || !mobileMenu) {
            console.log('⚠️ Mobile menu elements not found');
            return;
        }

        // Open mobile menu
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close mobile menu
        if (closeMenu) {
            closeMenu.addEventListener('click', closeMobileMenu);
        }

        // Close menu when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', closeMobileMenu);
        }

        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-item');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMobileMenu, 200);
            });
        });

        console.log('✅ Mobile menu initialized');
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    /**
     * Check authentication state and update header
     */
    async function checkAuthenticationState() {
        console.log('🔐 Checking authentication state...');

        // Wait for Firebase to be ready
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.log('⚠️ Firebase not available');
            return;
        }

        // Listen for auth state changes
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                console.log('✅ User logged in:', user.email);
                await updateHeaderForLoggedInUser(user);
            } else {
                console.log('👤 User not logged in');
                updateHeaderForLoggedOutUser();
            }
        });
    }

    /**
     * Update header for logged-in user
     */
    async function updateHeaderForLoggedInUser(user) {
        // Hide login/upgrade buttons
        const loginBtn = document.getElementById('login-btn');
        const upgradeBtn = document.querySelector('.upgrade-button');

        if (loginBtn) loginBtn.style.display = 'none';
        if (upgradeBtn) upgradeBtn.style.display = 'none';

        // Show user menu
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = 'flex';

            // Update user email
            const userEmail = document.getElementById('header-user-email');
            if (userEmail) {
                // Show only first part of email for privacy
                const emailParts = user.email.split('@');
                userEmail.textContent = emailParts[0];
            }
        }

        // Check if user has premium access
        await checkPremiumStatus(user);
    }

    /**
     * Update header for logged-out user
     */
    function updateHeaderForLoggedOutUser() {
        // Show login/upgrade buttons
        const loginBtn = document.getElementById('login-btn');
        const upgradeBtn = document.querySelector('.upgrade-button');

        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (upgradeBtn) upgradeBtn.style.display = 'inline-block';

        // Hide user menu
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = 'none';
        }
    }

    /**
     * Check if user has premium access
     */
    async function checkPremiumStatus(user) {
        try {
            // Check if user has premium access via AuthHelper
            if (typeof window.AuthHelper !== 'undefined') {
                const userDoc = await firebase.firestore()
                    .collection('users')
                    .doc(user.uid)
                    .get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const hasPremium = window.AuthHelper.hasPremiumAccess(userData, user);

                    if (hasPremium) {
                        // Add premium indicator to account link
                        const accountLink = document.querySelector('.account-link');
                        if (accountLink && !accountLink.querySelector('.premium-indicator')) {
                            const premiumBadge = document.createElement('span');
                            premiumBadge.className = 'premium-indicator';
                            premiumBadge.textContent = '👑';
                            premiumBadge.style.marginLeft = '5px';
                            accountLink.appendChild(premiumBadge);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error checking premium status:', error);
        }
    }

    /**
     * Logout function (attached to window for global access)
     */
    window.logout = async function() {
        console.log('🚪 Logging out...');

        try {
            await firebase.auth().signOut();

            // Clear local storage
            localStorage.removeItem('membershipLevel');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            localStorage.removeItem('hasPremiumAccess');

            // Clear session storage
            sessionStorage.clear();

            console.log('✅ Logout successful');

            // Redirect to home page
            window.location.href = 'index.html';
        } catch (error) {
            console.error('❌ Logout error:', error);
            alert('Error logging out. Please try again.');
        }
    };

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            });
        }
    });

    console.log('🎯 Header navigation loaded');
})();
