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

        console.log('🛤️ Journey gate initializing...');

        // Wait for Firebase and AuthHelper to be ready
        await waitForDependencies();

        // Check access
        const accessCheck = await window.AuthHelper.checkJourneyAccess();

        if (!accessCheck.hasAccess) {
            console.log('⛔ Journey access denied:', accessCheck.reason);
            handleAccessDenied(accessCheck.reason);
        } else {
            console.log('✅ Journey access granted');

            if (accessCheck.isAdmin) {
                console.log('👑 Admin user detected');
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
                    clearInterval(checkInterval);
                    resolve();
                } else if (attempts > 100) {
                    // After 10 seconds, stop trying
                    clearInterval(checkInterval);
                    console.error('❌ Journey Gate: Dependencies failed to load after 10 seconds');
                    console.error('- Firebase loaded:', typeof firebase !== 'undefined');
                    console.error('- AuthHelper loaded:', typeof window.AuthHelper !== 'undefined');
                    console.error('- checkJourneyAccess available:', typeof window.AuthHelper?.checkJourneyAccess === 'function');
                    resolve(); // Resolve anyway to prevent hanging
                }
            }, 100);
        });
    }

    /**
     * Handle access denied
     */
    function handleAccessDenied(reason) {
        // Hide main content
        const mainContent = document.getElementById('journeyContent');
        if (mainContent) {
            mainContent.style.display = 'none';
        }

        // Show premium gate
        if (reason === 'not_logged_in') {
            showLoginGate();
        } else {
            showPremiumUpgradeGate();
        }
    }

    /**
     * Show login gate
     */
    function showLoginGate() {
        const gateHTML = `
            <div class="premium-gate">
                <div class="gate-content">
                    <div class="gate-icon">🔐</div>
                    <h2>Login Required</h2>
                    <p>Please log in to access the Journey to Aligned Manifestation Mastery.</p>
                    <div class="gate-actions">
                        <a href="login.html?redirect=${encodeURIComponent(window.location.pathname)}" class="btn btn-primary">
                            Login
                        </a>
                        <a href="index.html#pricing" class="btn btn-secondary">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        `;

        showGate(gateHTML);
    }

    /**
     * Show premium upgrade gate
     */
    function showPremiumUpgradeGate() {
        const gateHTML = `
            <div class="premium-gate">
                <div class="gate-content">
                    <div class="gate-icon">👑</div>
                    <h2>Premium Feature</h2>
                    <p class="gate-subtitle">The 4-Phase Journey to Aligned Manifestation Mastery is a premium-only feature</p>

                    <div class="journey-preview">
                        <h3>🛤️ What You'll Get:</h3>
                        <ul class="journey-benefits">
                            <li>
                                <span class="phase-number">Phase 1</span>
                                <div class="phase-info">
                                    <strong>Ya Heard Me - Awakening</strong>
                                    <span>90-day audiobook journey with discussion & journaling</span>
                                </div>
                            </li>
                            <li>
                                <span class="phase-number">Phase 2</span>
                                <div class="phase-info">
                                    <strong>Understanding Aligned Manifestation</strong>
                                    <span>90-day deep dive into 7 core principles</span>
                                </div>
                            </li>
                            <li>
                                <span class="phase-number">Phase 3</span>
                                <div class="phase-info">
                                    <strong>I-N-I Year Mastery Practice</strong>
                                    <span>365-day immersive practice with calendar integration</span>
                                </div>
                            </li>
                            <li>
                                <span class="phase-number">Phase 4</span>
                                <div class="phase-info">
                                    <strong>Become a Guide</strong>
                                    <span>Certification program to teach others</span>
                                </div>
                            </li>
                        </ul>

                        <div class="journey-features">
                            <div class="feature-badge">✅ Progress tracking & achievements</div>
                            <div class="feature-badge">✅ Discussion forums & study groups</div>
                            <div class="feature-badge">✅ AI guidance throughout your journey</div>
                            <div class="feature-badge">✅ Chapter-by-chapter breakdowns</div>
                        </div>
                    </div>

                    <div class="pricing-highlight">
                        <div class="price-tag">
                            <span class="price-amount">$9.99</span>
                            <span class="price-period">/month</span>
                        </div>
                        <p class="price-note">Less than 2 coffees per month for unlimited spiritual growth</p>
                    </div>

                    <div class="gate-actions">
                        <a href="https://buy.stripe.com/aFaeVe2fl8F31Rk2i5fjG00" class="btn btn-primary btn-large">
                            ✨ Upgrade to Premium
                        </a>
                        <p class="terms">Cancel anytime • Start your transformation today</p>
                    </div>

                    <a href="index.html" class="back-link">← Back to Home</a>
                </div>
            </div>
        `;

        showGate(gateHTML);
    }

    /**
     * Display gate HTML
     */
    function showGate(html) {
        const container = document.getElementById('journeyGate');
        if (container) {
            container.innerHTML = html;
            container.style.display = 'block';
        } else {
            // Create gate container if it doesn't exist
            const gateDiv = document.createElement('div');
            gateDiv.id = 'journeyGate';
            gateDiv.innerHTML = html;
            document.body.insertBefore(gateDiv, document.body.firstChild);
        }
    }

    /**
     * Show admin badge for admin users
     */
    function showAdminBadge() {
        const badge = document.createElement('div');
        badge.className = 'admin-badge';
        badge.innerHTML = '👑 Admin Access';
        badge.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #8B5CF6, #D946EF);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        `;
        document.body.appendChild(badge);
    }

    /**
     * Initialize journey content (after access is granted)
     */
    function initJourneyContent(accessCheck) {
        const mainContent = document.getElementById('journeyContent');
        if (mainContent) {
            mainContent.style.display = 'block';
        }

        // Load user's journey progress if available
        if (accessCheck.userData) {
            loadJourneyProgress(accessCheck.userData);
        }
    }

    /**
     * Load user's journey progress
     */
    async function loadJourneyProgress(userData) {
        const progressData = userData.journey_progress || {
            current_phase: 1,
            overall_completion: 0,
            phase1_awakening: { status: 'not_started', completion_percentage: 0 },
            phase2_understanding: { status: 'locked', completion_percentage: 0 },
            phase3_mastery: { status: 'locked', completion_percentage: 0 },
            phase4_teaching: { status: 'locked', completion_percentage: 0 }
        };

        // Update UI with progress data
        updateJourneyProgressUI(progressData);
    }

    /**
     * Update journey progress UI
     */
    function updateJourneyProgressUI(progressData) {
        // Update current phase indicator
        const currentPhaseEl = document.getElementById('currentPhase');
        if (currentPhaseEl) {
            currentPhaseEl.textContent = `Phase ${progressData.current_phase}`;
        }

        // Update overall progress
        const overallProgressEl = document.getElementById('overallProgress');
        if (overallProgressEl) {
            overallProgressEl.textContent = `${progressData.overall_completion}%`;
        }

        // Update individual phase cards
        updatePhaseCard(1, progressData.phase1_awakening);
        updatePhaseCard(2, progressData.phase2_understanding);
        updatePhaseCard(3, progressData.phase3_mastery);
        updatePhaseCard(4, progressData.phase4_teaching);
    }

    /**
     * Update individual phase card
     */
    function updatePhaseCard(phaseNumber, phaseData) {
        const phaseCard = document.getElementById(`phase${phaseNumber}Card`);
        if (!phaseCard) return;

        // Update status badge
        const statusBadge = phaseCard.querySelector('.phase-status');
        if (statusBadge) {
            const statusText = {
                'not_started': 'Not Started',
                'in_progress': 'In Progress',
                'completed': 'Completed',
                'locked': '🔒 Locked'
            };
            statusBadge.textContent = statusText[phaseData.status] || 'Not Started';
            statusBadge.className = `phase-status status-${phaseData.status}`;
        }

        // Update progress bar
        const progressBar = phaseCard.querySelector('.progress-bar-fill');
        if (progressBar) {
            progressBar.style.width = `${phaseData.completion_percentage || 0}%`;
        }

        // Update progress text
        const progressText = phaseCard.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${phaseData.completion_percentage || 0}% Complete`;
        }

        // Disable locked phases
        if (phaseData.status === 'locked') {
            phaseCard.classList.add('locked');
            const ctaButton = phaseCard.querySelector('.phase-cta');
            if (ctaButton) {
                ctaButton.style.display = 'none';
            }
        }
    }

    // Export public API
    window.JourneyGate = {
        init: initJourneyGate,
        checkAccess: async () => {
            await waitForDependencies();
            return window.AuthHelper.checkJourneyAccess();
        }
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initJourneyGate);
    } else {
        initJourneyGate();
    }

    console.log('🛤️ Journey Gate loaded');

})();
