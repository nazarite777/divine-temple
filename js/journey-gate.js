/**
 * Journey Premium Gate
 * Protects premium-only journey content
 */

(function() {
    'use strict';

    let journeyGateInitialized = false;

    /**
     * Initialize journey gate on page load
     */
    async function initJourneyGate() {
        if (journeyGateInitialized) return;
        journeyGateInitialized = true;

        console.log('Journey gate initializing...');

        // Check access with timeout to prevent infinite loading on mobile
        const accessCheckTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Journey access check timed out')), 10000)
        );

        try {
            const accessCheck = await Promise.race([
                window.AuthHelper.checkJourneyAccess(),
                accessCheckTimeout
            ]);

            if (!accessCheck.hasAccess) {
                console.log('Access denied:', accessCheck.reason);
                handleAccessDenied(accessCheck.reason);
            } else {
                console.log('Access granted');

                if (accessCheck.isAdmin) {
                    console.log('Admin user detected');
                    showAdminBadge();
                }

                // Initialize journey content
                initJourneyContent(accessCheck);
            }
        } catch (error) {
            console.error('Journey gate error:', error.message);
            
            // On timeout, redirect to login to prevent infinite loading
            if (error.message.includes('timed out')) {
                console.error('Journey access check timed out - redirecting to login');
                handleAccessDenied('timeout');
            } else {
                handleAccessDenied('error');
            }
        }
    }

    function waitForDependencies() {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof firebase !== 'undefined' &&
                    firebase.auth &&
                    typeof window.AuthHelper !== 'undefined' &&
                    typeof window.AuthHelper.checkJourneyAccess === 'function') {

                    clearInterval(checkInterval);

                    // Wait for Firebase to know about the auth state
                    let authAttempts = 0;
                    const authCheckInterval = setInterval(() => {
                        authAttempts++;

                        const currentUser = firebase.auth().currentUser;
                        if (currentUser || authAttempts > 15) {
                            clearInterval(authCheckInterval);
                            resolve();
                        }
                    }, 100);
                } else if (attempts > 100) {
                    clearInterval(checkInterval);
                    console.error('🔄 Journey Gate: Dependencies failed to load after 10 seconds');
                    resolve();
                }
            }, 100);
        });
    }

    /**
     * Handle access denied - redirect to login
     */
    function handleAccessDenied(reason) {
        console.log('🔒 Access denied. Reason:', reason);

        // Show loading message
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #0a0a1e 0%, #1a1a2e 50%, #0f3460 100%);
                color: white;
                font-family: 'Inter', sans-serif;
            ">
                <div style="font-size: 3rem; margin-bottom: 2rem;">🔐</div>
                <h2 style="margin-bottom: 1rem;">Premium Access Required</h2>
                <p style="margin-bottom: 2rem; color: rgba(255, 255, 255, 0.8);">
                    Redirecting to login...
                </p>
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid #D4AF37;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'members-new.html';
        }, 2000);
    }

    /**
     * Initialize journey content - enable all phase buttons and content
     */
    function initJourneyContent(accessCheck) {
        console.log('✨ Initializing journey content...');

        // Mark page as fully loaded
        document.documentElement.setAttribute('data-journey-loaded', 'true');

        // Enable all journey section buttons
        const phaseButtons = document.querySelectorAll('[data-phase]');
        phaseButtons.forEach(button => {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
            button.classList.remove('disabled');
        });

        // Dispatch custom event for other scripts to react to
        const event = new CustomEvent('journeyAccessGranted', { detail: accessCheck });
        document.dispatchEvent(event);

        console.log('✅ Journey content initialized');
    }

    /**
     * Show admin badge for admin users
     */
    function showAdminBadge() {
        console.log('👑 Displaying admin badge...');

        const badge = document.createElement('div');
        badge.id = 'admin-badge';
        badge.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #D4AF37, #F59E0B);
                color: #0F0F23;
                padding: 0.75rem 1.5rem;
                border-radius: 50px;
                font-weight: 700;
                z-index: 9999;
                box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
                animation: slideIn 0.5s ease-out;
            ">
                👑 Admin Mode
            </div>
            <style>
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            </style>
        `;

        document.body.appendChild(badge);
    }

    // Initialize journey gate when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initJourneyGate);
    } else {
        initJourneyGate();
    }

    // Also expose to window for manual triggering if needed
    window.JourneyGate = {
        init: initJourneyGate,
        handleAccessDenied,
        initJourneyContent,
        showAdminBadge
    };
})();