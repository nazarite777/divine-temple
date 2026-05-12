/**
 * Journey Premium Gate
 * Protects premium-only journey content with a translucent overlay
 * Consistent UX across Phase 1-4 pages
 */
(function() {
    'use strict';
    var journeyGateInitialized = false;

    function detectPhase() {
        var path = window.location.pathname.toLowerCase();
        if (path.indexOf('phase1') !== -1) return { num: 1, name: 'Awakening', icon: '\u{1F305}' };
        if (path.indexOf('phase2') !== -1) return { num: 2, name: 'Understanding', icon: '\u{1F9E0}' };
        if (path.indexOf('phase3') !== -1) return { num: 3, name: 'Mastery', icon: '\u26A1' };
        if (path.indexOf('phase4') !== -1) return { num: 4, name: 'Teaching', icon: '\u{1F451}' };
        return { num: 0, name: 'Journey', icon: '\u2728' };
    }

    async function initJourneyGate() {
        if (journeyGateInitialized) return;
        journeyGateInitialized = true;
        console.log('Journey gate initializing...');

        await waitForDependencies();

        if (typeof window.AuthHelper === 'undefined' ||
            typeof window.AuthHelper.checkJourneyAccess !== 'function') {
            console.warn('AuthHelper not available - showing gate');
            showPremiumOverlay('not_logged_in');
            return;
        }

        try {
            var accessCheck = await Promise.race([
                window.AuthHelper.checkJourneyAccess(),
                new Promise(function(_, reject) {
                    setTimeout(function() { reject(new Error('timeout')); }, 10000);
                })
            ]);
            if (!accessCheck.hasAccess) {
                showPremiumOverlay(accessCheck.reason);
            } else {
                hidePremiumOverlay();
                if (accessCheck.isAdmin) showAdminBadge();
                initJourneyContent(accessCheck);
            }
        } catch (error) {
            console.error('Journey gate error:', error.message);
            showPremiumOverlay('error');
        }
    }

    function waitForDependencies() {
        return new Promise(function(resolve) {
            var attempts = 0;
            var check = setInterval(function() {
                attempts++;
                if (typeof firebase !== 'undefined' && firebase.auth &&
                    typeof window.AuthHelper !== 'undefined' &&
                    typeof window.AuthHelper.checkJourneyAccess === 'function') {
                    clearInterval(check);
                    var authAttempts = 0;
                    var authCheck = setInterval(function() {
                        authAttempts++;
                        if (firebase.auth().currentUser || authAttempts > 15) {
                            clearInterval(authCheck);
                            resolve();
                        }
                    }, 100);
                } else if (attempts > 100) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    }

    function showPremiumOverlay(reason) {
        var phase = detectPhase();
        var existing = document.getElementById('journeyGateOverlay');
        if (existing) existing.remove();

        var isNotLoggedIn = (reason === 'not_logged_in' || reason === 'timeout' || reason === 'error');
        var msg = isNotLoggedIn
            ? 'Sign in to your premium account to access this phase of your transformation journey.'
            : 'This phase is exclusively for premium members. Upgrade to continue your transformation.';

        var overlay = document.createElement('div');
        overlay.id = 'journeyGateOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,10,25,0.75);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;';

        overlay.innerHTML =
            '<div style="text-align:center;background:linear-gradient(135deg,rgba(20,20,45,.95),rgba(30,25,50,.95));border:1px solid rgba(212,175,55,.3);border-radius:22px;padding:2.5rem 2rem;max-width:500px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.5);">' +
                '<div style="font-size:3rem;margin-bottom:0.75rem;">' + phase.icon + '</div>' +
                '<div style="font-size:0.85rem;text-transform:uppercase;letter-spacing:2px;color:#F59E0B;margin-bottom:1rem;font-weight:600;">Phase ' + phase.num + ' \u00B7 ' + phase.name + '</div>' +
                '<h2 style="font-size:1.6rem;margin-bottom:0.5rem;background:linear-gradient(135deg,#8B5CF6,#F59E0B);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">Unlock Your Journey</h2>' +
                '<p style="color:rgba(255,255,255,.7);margin-bottom:1.5rem;line-height:1.6;font-size:0.95rem;">' + msg + '</p>' +
                '<div style="display:flex;flex-direction:column;gap:0.75rem;">' +
                    '<a href="pricing.html" style="padding:0.9rem;border-radius:12px;font-weight:600;text-decoration:none;display:block;text-align:center;font-size:0.95rem;background:linear-gradient(135deg,#F59E0B,#D97706);color:white;">Upgrade to Premium</a>' +
                    '<a href="members-new.html" style="padding:0.9rem;border-radius:12px;font-weight:600;text-decoration:none;display:block;text-align:center;font-size:0.95rem;background:rgba(255,255,255,.06);color:rgba(255,255,255,.8);border:1px solid rgba(212,175,55,.2);">Sign In to Existing Account</a>' +
                    '<a href="journey.html" style="padding:0.9rem;border-radius:12px;font-weight:600;text-decoration:none;display:block;text-align:center;font-size:0.95rem;background:rgba(255,255,255,.06);color:rgba(255,255,255,.8);border:1px solid rgba(212,175,55,.2);">\u2190 Back to Journey Overview</a>' +
                '</div>' +
            '</div>';

        document.body.appendChild(overlay);
    }

    function hidePremiumOverlay() {
        var el = document.getElementById('journeyGateOverlay');
        if (el) el.remove();
    }

    function initJourneyContent(accessCheck) {
        document.documentElement.setAttribute('data-journey-loaded', 'true');
        var buttons = document.querySelectorAll('[data-phase]');
        buttons.forEach(function(b) { b.style.pointerEvents = 'auto'; b.style.opacity = '1'; b.classList.remove('disabled'); });
        document.dispatchEvent(new CustomEvent('journeyAccessGranted', { detail: accessCheck }));
        console.log('Journey content initialized');
    }

    function showAdminBadge() {
        var badge = document.createElement('div');
        badge.innerHTML = '<div style="position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#D4AF37,#F59E0B);color:#0F0F23;padding:0.75rem 1.5rem;border-radius:50px;font-weight:700;z-index:9999;box-shadow:0 8px 24px rgba(212,175,55,.3);">\u{1F451} Admin Mode</div>';
        document.body.appendChild(badge);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initJourneyGate);
    } else {
        initJourneyGate();
    }

    window.JourneyGate = { init: initJourneyGate, showPremiumOverlay: showPremiumOverlay, hidePremiumOverlay: hidePremiumOverlay, initJourneyContent: initJourneyContent, showAdminBadge: showAdminBadge };
})();
