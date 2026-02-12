/**
 * Header Navigation & Dropdown Management
 * Handles dropdown menus, mobile navigation, sticky header, and auth state
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    setupDropdowns();
    setupMobileMenu();
    setupStickyHeader();
    updateAuthButtons();
});

/**
 * Initialize header functionality
 */
function initializeHeader() {
    console.log('🏛️ Header initialized');
}

/**
 * Setup dropdown functionality for desktop navigation
 */
function setupDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        const parentLi = toggle.closest('.nav-dropdown');
        const dropdownMenu = parentLi?.querySelector('.dropdown-menu');

        if (!dropdownMenu) return;

        // Desktop hover behavior
        parentLi.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                dropdownMenu.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });

        parentLi.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                dropdownMenu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Click behavior for mobile and desktop
        toggle.addEventListener('click', (e) => {
            e.preventDefault();

            const isActive = dropdownMenu.classList.contains('active');

            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });

            // Toggle current dropdown
            if (!isActive) {
                dropdownMenu.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                dropdownMenu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });
            document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const navActions = document.querySelector('.nav-actions');

    if (!mobileMenuToggle || !navLinks) return;

    mobileMenuToggle.addEventListener('click', function() {
        const isActive = navLinks.classList.contains('active');

        navLinks.classList.toggle('active');
        navActions?.classList.toggle('active');
        this.setAttribute('aria-expanded', !isActive);

        // Update hamburger icon
        this.textContent = isActive ? '☰' : '✕';
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        // Don't close on dropdown toggle clicks
        if (!link.classList.contains('dropdown-toggle')) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                navActions?.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.textContent = '☰';
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navActions?.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.textContent = '☰';
        }
    });
}

/**
 * Setup sticky header on scroll
 */
function setupStickyHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add sticky class when scrolling down
        if (currentScroll > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Hide header when scrolling down, show when scrolling up
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Update auth buttons based on user login state
 */
function updateAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const upgradeBtn = document.getElementById('upgradeBtn');

    if (!loginBtn) return;

    // Check if user is logged in (Firebase or localStorage)
    checkAuthState().then(({ isLoggedIn, user, isPremium }) => {
        if (isLoggedIn) {
            // User is logged in
            loginBtn.textContent = 'My Account';
            loginBtn.href = 'members-new.html';
            loginBtn.classList.add('logged-in');

            // Hide upgrade button if user is premium
            if (isPremium && upgradeBtn) {
                upgradeBtn.style.display = 'none';
            }

            // Add username if available
            if (user?.displayName) {
                loginBtn.innerHTML = `<span class="user-avatar">👤</span> ${user.displayName}`;
            }
        } else {
            // User is not logged in
            loginBtn.textContent = 'Login';
            loginBtn.href = 'members-new.html';
            loginBtn.classList.remove('logged-in');

            if (upgradeBtn) {
                upgradeBtn.style.display = 'inline-flex';
            }
        }
    });
}

/**
 * Check authentication state
 * Returns { isLoggedIn, user, isPremium }
 */
async function checkAuthState() {
    // Check Firebase auth if available
    if (typeof firebase !== 'undefined' && firebase.auth) {
        return new Promise((resolve) => {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    // User is logged in, check premium status
                    let isPremium = false;

                    try {
                        const userDoc = await firebase.firestore()
                            .collection('users')
                            .doc(user.uid)
                            .get();

                        if (userDoc.exists) {
                            const userData = userDoc.data();
                            isPremium = userData.premium === true ||
                                       userData.premium_status === 'active' ||
                                       userData.membershipLevel === 'premium' ||
                                       isAdminUser(user.email);
                        }
                    } catch (error) {
                        console.error('Error checking premium status:', error);
                    }

                    resolve({
                        isLoggedIn: true,
                        user: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName
                        },
                        isPremium
                    });
                } else {
                    resolve({ isLoggedIn: false, user: null, isPremium: false });
                }
            });
        });
    }

    // Fallback to localStorage check
    const isAuthenticated = localStorage.getItem('divineAuthenticated') === 'true';
    const currentMember = localStorage.getItem('currentMember');

    if (isAuthenticated && currentMember) {
        const member = JSON.parse(currentMember);
        return {
            isLoggedIn: true,
            user: {
                displayName: member.firstName || member.divineName,
                email: member.email
            },
            isPremium: member.membershipLevel === 'premium' || member.membershipLevel === 'founding'
        };
    }

    return { isLoggedIn: false, user: null, isPremium: false };
}

/**
 * Check if user is admin
 */
function isAdminUser(email) {
    const adminEmails = ['cbevvv@gmail.com', 'nazir@edenconsciousness.com'];
    return email && adminEmails.includes(email.toLowerCase());
}

/**
 * Add active page indicator
 */
function addActivePageIndicator() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === '#home')) {
            item.classList.add('active');
        }
    });
}

// Initialize active page indicator
document.addEventListener('DOMContentLoaded', addActivePageIndicator);

// Export functions for global use
window.HeaderNav = {
    updateAuthButtons,
    checkAuthState,
    isAdminUser
};
