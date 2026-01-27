/**
 * Journey Hub - Complete Dashboard with Error Handling
 * Manages 4-phase journey progress with Firebase integration
 */

let userProgress = null;
let currentUser = null;


// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Journey Hub loading...');

    try {
        // Wait for Firebase to be ready
        await waitForFirebase();
        console.log('✅ Firebase ready');

        // Check if user is logged in (optional - don't require login)
        await waitForAuth();

        if (currentUser) {
            console.log('✅ User authenticated:', currentUser.email);

            // Load journey progress from Firebase
            console.log('📊 Loading journey progress...');
            await loadJourneyProgress();
        } else {
            console.log('👤 Guest user - using default progress');
            // Use default progress for guest users
            userProgress = createDefaultProgress();
        }

        // Update UI
        console.log('🎨 Updating dashboard...');
        updateDashboard();

        // Hide loading, show content
        hideLoading();
        showContent();

        console.log('✅✅✅ Journey Hub loaded successfully!');

    } catch (error) {
        console.error('❌ Journey loading error:', error);
        // Still show the page with default content
        userProgress = createDefaultProgress();
        updateDashboard();
        hideLoading();
        showContent();
    }
});

/**
 * Wait for Firebase to be ready
 */
function waitForFirebase() {
    return new Promise((resolve) => {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            resolve();
        } else {
            let attempts = 0;
            const checkFirebase = setInterval(() => {
                attempts++;
                if (typeof firebase !== 'undefined' && firebase.firestore) {
                    clearInterval(checkFirebase);
                    resolve();
                } else if (attempts > 50) {
                    clearInterval(checkFirebase);
                    // Resolve anyway - we'll use default progress
                    resolve();
                }
            }, 100);
        }
    });
}

/**
 * Wait for Firebase auth
 */
function waitForAuth() {
    return new Promise((resolve) => {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            resolve();
            return;
        }
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            currentUser = user;
            unsubscribe();
            resolve();
        });
    });
}

/**
 * Check premium access
 */
async function checkPremiumAccess() {
    try {
        if (!currentUser) return false;

        const userDoc = await db.collection('users').doc(currentUser.uid).get();

        if (!userDoc.exists) {
            console.log('⚠️ User document not found - assuming no premium');
            return false;
        }

        const userData = userDoc.data();

        // Check all premium fields
        const isPremium = userData.isPremium === true ||
                         userData.is_premium === true ||
                         userData.premium === true ||
                         userData.premiumAccess === true ||
                         userData.premium_access === true ||
                         userData.hasLifetimeAccess === true;

        console.log('Premium check:', {
            isPremium: userData.isPremium,
            is_premium: userData.is_premium,
            premium: userData.premium,
            result: isPremium
        });

        return isPremium;

    } catch (error) {
        console.error('Error checking premium access:', error);
        return false;
    }
}

/**
 * Load journey progress from Firebase
 */
async function loadJourneyProgress() {
    try {
        if (!currentUser || typeof db === 'undefined') {
            userProgress = createDefaultProgress();
            return;
        }

        const progressRef = db.collection('users')
            .doc(currentUser.uid)
            .collection('journey_progress')
            .doc('current');

        const doc = await progressRef.get();

        if (doc.exists) {
            userProgress = doc.data();
            console.log('✅ Progress loaded:', userProgress);

            // Convert Firestore timestamps to readable dates
            if (userProgress.started_date && userProgress.started_date.toDate) {
                userProgress.started_date = userProgress.started_date.toDate();
            }
        } else {
            // Initialize new journey
            console.log('🆕 Creating new journey...');
            userProgress = createDefaultProgress();
            await progressRef.set(userProgress);
            console.log('✅ Journey initialized');
        }

        // Calculate days active
        if (userProgress.started_date) {
            const startDate = userProgress.started_date instanceof Date ?
                            userProgress.started_date :
                            new Date(userProgress.started_date);
            const today = new Date();
            const diffTime = Math.abs(today - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            userProgress.days_active = diffDays;
        }

    } catch (error) {
        console.error('❌ Error loading progress:', error);
        userProgress = createDefaultProgress();
    }
}

/**
 * Create default progress structure
 */
function createDefaultProgress() {
    return {
        started_date: new Date(),
        current_phase: 1,
        overall_completion: 0,
        days_active: 1,
        streak: 1,

        phase1_awakening: {
            status: 'in_progress',
            sections_completed: [],
            total_sections: 11,
            completion_percentage: 0,
            started_date: new Date(),
            last_updated: new Date()
        },

        phase2_understanding: {
            status: 'locked',
            principles_completed: [],
            total_principles: 6,
            completion_percentage: 0
        },

        phase3_mastery: {
            status: 'locked',
            days_practiced: 0,
            completion_percentage: 0
        },

        phase4_teaching: {
            status: 'locked',
            certification_status: 'not_started',
            completion_percentage: 0
        }
    };
}

/**
 * Update dashboard UI
 */
function updateDashboard() {
    if (!userProgress) {
        console.error('❌ No progress data to display');
        return;
    }

    // Calculate overall completion
    const phase1 = userProgress.phase1_awakening?.completion_percentage || 0;
    const phase2 = userProgress.phase2_understanding?.completion_percentage || 0;
    const phase3 = userProgress.phase3_mastery?.completion_percentage || 0;
    const phase4 = userProgress.phase4_teaching?.completion_percentage || 0;

    const overallCompletion = (phase1 + phase2 + phase3 + phase4) / 4;
    userProgress.overall_completion = overallCompletion;

    // Update overall progress
    const overallPercent = document.getElementById('overallPercentage');
    if (overallPercent) {
        overallPercent.textContent = Math.round(overallCompletion) + '%';
    }

    const overallBar = document.getElementById('overallProgressBar');
    if (overallBar) {
        overallBar.style.width = overallCompletion + '%';
    }

    // Update stats
    const phasesCompleted = calculateCompletedPhases();
    const phasesText = document.getElementById('phasesCompleted');
    if (phasesText) {
        phasesText.textContent = `${phasesCompleted}/4 Phases Complete`;
    }

    const streakText = document.getElementById('currentStreak');
    if (streakText) {
        streakText.textContent = (userProgress.streak || 0) + ' Day Streak';
    }

    const lastActivityText = document.getElementById('lastActivity');
    if (lastActivityText) {
        lastActivityText.textContent = 'Last activity: ' + getLastActivity();
    }

    // Update phase cards
    updatePhaseCard(1, userProgress.phase1_awakening);
    updatePhaseCard(2, userProgress.phase2_understanding);
    updatePhaseCard(3, userProgress.phase3_mastery);
    updatePhaseCard(4, userProgress.phase4_teaching);

    // Update current focus
    updateCurrentFocus();

    console.log('✅ Dashboard updated successfully');
}

/**
 * Calculate completed phases
 */
function calculateCompletedPhases() {
    let count = 0;
    if (userProgress.phase1_awakening?.completion_percentage >= 100) count++;
    if (userProgress.phase2_understanding?.completion_percentage >= 100) count++;
    if (userProgress.phase3_mastery?.completion_percentage >= 100) count++;
    if (userProgress.phase4_teaching?.completion_percentage >= 100) count++;
    return count;
}

/**
 * Get last activity text
 */
function getLastActivity() {
    const lastUpdated = userProgress.phase1_awakening?.last_updated;
    if (!lastUpdated) return 'Never';

    const date = lastUpdated instanceof Date ? lastUpdated : new Date(lastUpdated);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

/**
 * Update individual phase card
 */
function updatePhaseCard(phaseNum, phaseData) {
    const progressBar = document.getElementById(`phase${phaseNum}Progress`);
    const progressText = document.getElementById(`phase${phaseNum}Text`);
    const progressPercent = document.getElementById(`phase${phaseNum}Percent`);
    const phaseCard = document.getElementById(`phase${phaseNum}Card`);

    if (!phaseData) return;

    const percent = phaseData.completion_percentage || 0;

    if (progressBar) progressBar.style.width = percent + '%';
    if (progressPercent) progressPercent.textContent = Math.round(percent) + '%';

    // Update status text
    if (progressText) {
        if (phaseData.status === 'completed') {
            progressText.textContent = 'Completed ✓';
        } else if (phaseData.status === 'in_progress') {
            if (phaseNum === 1 && phaseData.sections_completed) {
                progressText.textContent = `${phaseData.sections_completed.length}/11 sections`;
            } else if (phaseNum === 2 && phaseData.principles_completed) {
                progressText.textContent = `${phaseData.principles_completed.length}/6 principles`;
            } else {
                progressText.textContent = 'In Progress';
            }
        } else if (phaseData.status === 'locked') {
            progressText.textContent = 'Locked';
        } else {
            progressText.textContent = 'Not started';
        }
    }

    // Remove locked class if unlocked
    if (phaseCard && phaseData.status !== 'locked') {
        phaseCard.classList.remove('locked');
    }
}

/**
 * Update current focus section
 */
function updateCurrentFocus() {
    const focusTitle = document.getElementById('focusTitle');
    const focusDescription = document.getElementById('focusDescription');
    const focusAction = document.getElementById('focusAction');

    if (!focusTitle || !focusDescription || !focusAction) return;

    const currentPhase = userProgress.current_phase || 1;

    if (currentPhase === 1) {
        const sectionsComplete = userProgress.phase1_awakening?.sections_completed?.length || 0;
        focusTitle.textContent = 'Continue Phase 1: Awakening';
        focusDescription.textContent = `You've completed ${sectionsComplete} of 11 sections. Continue your journey through Ya Heard Me.`;
        focusAction.textContent = 'Continue Phase 1 →';
        focusAction.href = 'phase1-awakening.html';
    } else if (currentPhase === 2) {
        const principlesComplete = userProgress.phase2_understanding?.principles_completed?.length || 0;
        focusTitle.textContent = 'Continue Phase 2: Understanding';
        focusDescription.textContent = `You've completed ${principlesComplete} of 6 principles. Master the Aligned Manifestation teachings.`;
        focusAction.textContent = 'Continue Phase 2 →';
        focusAction.href = 'phase2-understanding.html';
    }
}

/**
 * Show loading state
 */
function showLoading() {
    const loading = document.getElementById('loadingState');
    if (loading) loading.style.display = 'flex';
}

/**
 * Hide loading state
 */
function hideLoading() {
    const loading = document.getElementById('loadingState');
    if (loading) loading.style.display = 'none';
}

/**
 * Show main content
 */
function showContent() {
    const content = document.getElementById('journeyMainContent');
    if (content) content.style.display = 'block';
}

/**
 * Show error message
 */
function showError(message) {
    hideLoading();

    // Create error display
    const container = document.querySelector('.container');
    if (!container) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-banner';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h3>⚠️ Error Loading Journey</h3>
            <p>${message}</p>
            <div class="error-actions">
                <button onclick="location.reload()" class="reload-button">Reload Page</button>
                <button onclick="window.location.href='members-new.html'" class="back-button">Back to Portal</button>
            </div>
        </div>
    `;

    container.insertBefore(errorDiv, container.firstChild);
}

/**
 * Show premium upgrade modal
 */
function showPremiumUpgradeModal() {
    const modal = document.createElement('div');
    modal.className = 'premium-modal-overlay';
    modal.innerHTML = `
        <div class="premium-modal">
            <h2>🛡️ Journey Hub - Premium Feature</h2>
            <p>The 4-Phase Journey to Aligned Manifestation Mastery is available to Premium members.</p>
            <div class="journey-preview">
                <h3>What You'll Get:</h3>
                <ul>
                    <li>✅ Phase 1: Ya Heard Me audiobook journey (90 days)</li>
                    <li>✅ Phase 2: 6 Principles with workbook guides (90 days)</li>
                    <li>✅ Phase 3: I-N-I Year mastery practice (365 days)</li>
                    <li>✅ Phase 4: Certification to teach others</li>
                    <li>✅ Progress tracking & achievements</li>
                </ul>
            </div>
            <a href="https://buy.stripe.com/aFaeVe2fl8F31Rk2i5fjG00" class="upgrade-button">
                Upgrade to Premium - $9.99/month
            </a>
            <button onclick="window.location.href='index.html'" class="modal-back-button">
                ← Back to Home
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Navigation function for phase cards
function navigateToPhase(phaseNumber) {
    const card = document.getElementById(`phase${phaseNumber}Card`);

    if (card && card.classList.contains('locked')) {
        alert('Complete the previous phase to unlock this one!');
        return;
    }

    const urls = {
        1: 'phase1-awakening.html',
        2: 'phase2-understanding.html',
        3: 'phase3-mastery.html',
        4: 'phase4-teaching.html'
    };

    window.location.href = urls[phaseNumber];
}

console.log('✨ Journey Hub script loaded');
