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

        console.log('ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂºÃ‚Â¤ÃƒÂ¯Ã‚Â¸Ã‚Â Journey gate initializing...');

        // Wait for Firebase and AuthHelper to be ready
        await waitForDependencies();

        // Check access
        const accessCheck = await window.AuthHelper.checkJourneyAccess();

        if (!accessCheck.hasAccess) {
            console.log('ÃƒÂ¢Ã¢â‚¬ÂºÃ¢â‚¬Â Journey access denied:', accessCheck.reason);
            handleAccessDenied(accessCheck.reason);
        } else {
            console.log('ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Journey access granted');

            if (accessCheck.isAdmin) {
                console.log('ÃƒÂ°Ã…Â¸Ã¢â‚¬ËœÃ¢â‚¬Ëœ Admin user detected');
                showAdminBadge();
            }

            // Initialize journey content
            initJourneyContent(accessCheck);
        }
    }

    /**
     * Wait for required dependencies to load
     */
    function waitForDependencies() {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof firebase !== 'undefined' &&
                    firebase.auth &&
                    typeof window.AuthHelper !== 'undefined' &&
                    typeof window.AuthHelper.checkJourneyAccess === 'function') {
                    
                    // Dependencies ready - now wait for auth state to be known
                    clearInterval(checkInterval);
                    
                    // Wait for Firebase to know about the auth state
                    // This can take 500-1500ms depending on token verification
                    let authAttempts = 0;
                    const authCheckInterval = setInterval(() => {
                        authAttempts++;
                        
                        // Auth state is ready when:
                        // 1. currentUser is set (logged in), OR
                        // 2. More than 1500ms has passed (verified as not logged in)
                        const currentUser = firebase.auth().currentUser;
                        if (currentUser || authAttempts > 15) {
                            clearInterval(authCheckInterval);
                            resolve();
                        }
                    }, 100);
                } else if (attempts > 100) {
                    clearInterval(checkInterval);
                    console.error(' Journey Gate: Dependencies failed to load after 10 seconds');
                    resolve();
                }
            }, 100);
        });
    }