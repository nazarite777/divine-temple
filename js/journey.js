/**
 * Journey Hub - Main Dashboard JavaScript
 * Tracks user progress through 4-phase transformation
 */

// Initialize journey page
let userProgress = null;
let user = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🛤️ Journey Hub initializing...');

    // Wait for Firebase to be ready
    await waitForFirebase();

    //  Check authentication
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (!firebaseUser) {
            console.log('⛔ User not logged in - redirecting...');
            window.location.href = 'login.html?redirect=journey.html';
            return;
        }

        user = firebaseUser;
        console.log('✅ User authenticated:', user.email);

        // Load user's journey progress
        await loadJourneyProgress();

        // Update UI
        updateProgressUI();
        updateNextAction();
    });
});

/**
 * Wait for Firebase to be ready
 */
function waitForFirebase() {
    return new Promise((resolve) => {
        if (typeof firebase !== 'undefined' && firebase.auth) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (typeof firebase !== 'undefined' && firebase.auth) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        }
    });
}

/**
 * Load journey progress from Firebase
 */
async function loadJourneyProgress() {
    console.log('📊 Loading journey progress...');

    const progressRef = firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('journey_progress')
        .doc('current');

    try {
        const doc = await progressRef.get();

        if (doc.exists) {
            userProgress = doc.data();
            console.log('✅ Progress loaded:', userProgress);

            // Convert Firestore timestamps to Dates
            if (userProgress.started_date && userProgress.started_date.toDate) {
                userProgress.started_date = userProgress.started_date.toDate();
            }
        } else {
            console.log('⚡ Initializing new journey progress...');

            // Initialize journey progress
            userProgress = {
                started_date: new Date(),
                current_phase: 1,
                overall_completion: 0,
                days_active: 1,
                streak: 1,
                last_activity: new Date(),

                phase1_awakening: {
                    status: 'in_progress',
                    chapters_completed: [],
                    completion_percentage: 0,
                    started_date: new Date(),
                    completed_date: null
                },

                phase2_understanding: {
                    status: 'locked',
                    principles_completed: [],
                    completion_percentage: 0,
                    started_date: null,
                    completed_date: null
                },

                phase3_mastery: {
                    status: 'locked',
                    days_practiced: 0,
                    completion_percentage: 0,
                    started_date: null,
                    completed_date: null
                },

                phase4_teaching: {
                    status: 'locked',
                    certification_status: 'not_started',
                    completion_percentage: 0,
                    started_date: null,
                    completed_date: null
                }
            };

            // Save initial progress
            await progressRef.set(userProgress);
            console.log('✅ Initial progress saved');
        }

        // Update days active
        if (userProgress.started_date) {
            userProgress.days_active = calculateDaysActive();
        }

    } catch (error) {
        console.error('❌ Error loading progress:', error);
        // Use default progress
        userProgress = {
            started_date: new Date(),
            current_phase: 1,
            overall_completion: 0,
            days_active: 0,
            streak: 0,
            phase1_awakening: { status: 'in_progress', chapters_completed: [], completion_percentage: 0 },
            phase2_understanding: { status: 'locked', completion_percentage: 0 },
            phase3_mastery: { status: 'locked', completion_percentage: 0 },
            phase4_teaching: { status: 'locked', completion_percentage: 0 }
        };
    }
}

/**
 * Update progress UI
 */
function updateProgressUI() {
    console.log('🎨 Updating progress UI...');

    // Overall progress ring
    updateProgressRing(userProgress.overall_completion || 0);
    const overallPercent = document.getElementById('overall-percentage');
    if (overallPercent) {
        overallPercent.textContent = Math.round(userProgress.overall_completion || 0) + '%';
    }

    // Stats
    const daysActive = document.getElementById('days-active');
    if (daysActive) daysActive.textContent = userProgress.days_active || 0;

    const currentPhase = document.getElementById('current-phase');
    if (currentPhase) currentPhase.textContent = 'Phase ' + (userProgress.current_phase || 1);

    const streakCount = document.getElementById('streak-count');
    if (streakCount) streakCount.textContent = userProgress.streak || 0;

    // Phase 1 progress
    const phase1Percent = userProgress.phase1_awakening?.completion_percentage || 0;
    const phase1ProgressBar = document.getElementById('phase1-progress');
    if (phase1ProgressBar) {
        phase1ProgressBar.style.width = phase1Percent + '%';
    }

    const phase1PercentText = document.getElementById('phase1-percent');
    if (phase1PercentText) {
        phase1PercentText.textContent = Math.round(phase1Percent) + '% Complete';
    }

    // Phase 1 status
    const phase1Status = document.getElementById('phase1-status');
    if (phase1Status && userProgress.phase1_awakening) {
        const statusBadge = phase1Status.querySelector('.status-badge');
        if (statusBadge) {
            if (userProgress.phase1_awakening.status === 'completed') {
                statusBadge.className = 'status-badge completed';
                statusBadge.textContent = 'Completed ✓';
            } else {
                statusBadge.className = 'status-badge active';
                statusBadge.textContent = 'In Progress';
            }
        }
    }

    // Unlock Phase 2 if Phase 1 is complete
    if (userProgress.phase1_awakening?.status === 'completed') {
        unlockPhase(2);

        // Update Phase 2 progress
        const phase2Percent = userProgress.phase2_understanding?.completion_percentage || 0;
        const phase2ProgressBar = document.getElementById('phase2-progress');
        if (phase2ProgressBar) {
            phase2ProgressBar.style.width = phase2Percent + '%';
        }
    }

    // Unlock Phase 3 if Phase 2 is complete
    if (userProgress.phase2_understanding?.status === 'completed') {
        unlockPhase(3);

        const phase3Percent = userProgress.phase3_mastery?.completion_percentage || 0;
        const phase3ProgressBar = document.getElementById('phase3-progress');
        if (phase3ProgressBar) {
            phase3ProgressBar.style.width = phase3Percent + '%';
        }
    }

    // Unlock Phase 4 if Phase 3 is complete
    if (userProgress.phase3_mastery?.status === 'completed') {
        unlockPhase(4);

        const phase4Percent = userProgress.phase4_teaching?.completion_percentage || 0;
        const phase4ProgressBar = document.getElementById('phase4-progress');
        if (phase4ProgressBar) {
            phase4ProgressBar.style.width = phase4Percent + '%';
        }
    }

    // Calculate overall completion
    calculateOverallCompletion();
}

/**
 * Update circular progress ring
 */
function updateProgressRing(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    // Animate the ring
    setTimeout(() => {
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }, 100);
}

/**
 * Unlock phase
 */
function unlockPhase(phaseNumber) {
    console.log(`🔓 Unlocking Phase ${phaseNumber}...`);

    const phaseCard = document.querySelector(`.phase-card.phase-${phaseNumber}`);
    if (!phaseCard) return;

    phaseCard.classList.remove('locked');

    const lockOverlay = phaseCard.querySelector('.lock-overlay');
    if (lockOverlay) {
        lockOverlay.remove();
    }

    const button = phaseCard.querySelector('.cta-button');
    if (button) {
        button.disabled = false;
        button.classList.remove('secondary');
        button.classList.add('primary');
        button.textContent = `Start Phase ${phaseNumber} →`;
    }

    const progressPercentage = phaseCard.querySelector('.progress-percentage');
    if (progressPercentage && progressPercentage.textContent === 'Locked') {
        progressPercentage.textContent = '0% Complete';
    }
}

/**
 * Navigate to phase page
 */
function navigateToPhase(phaseNumber) {
    const phaseUrls = {
        1: 'phase1-awakening.html',
        2: 'phase2-understanding.html',
        3: 'phase3-mastery.html',
        4: 'phase4-teaching.html'
    };

    const url = phaseUrls[phaseNumber];
    if (url) {
        console.log(`🚀 Navigating to Phase ${phaseNumber}: ${url}`);
        window.location.href = url;
    }
}

/**
 * Update next action card
 */
function updateNextAction() {
    const nextActionContent = document.getElementById('next-action-content');
    if (!nextActionContent) return;

    if (!userProgress) {
        nextActionContent.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 20px;">
                Start your journey with Phase 1: Awakening
            </p>
            <button class="cta-button primary" onclick="navigateToPhase(1)" style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 15px 30px; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                Begin Phase 1 →
            </button>
        `;
        return;
    }

    if (userProgress.current_phase === 1) {
        const chaptersCompleted = userProgress.phase1_awakening?.chapters_completed?.length || 0;
        const nextChapter = chaptersCompleted + 1;

        if (nextChapter <= 12) {
            nextActionContent.innerHTML = `
                <p style="font-size: 1.2rem; margin-bottom: 20px;">
                    Listen to Chapter ${nextChapter} of Ya Heard Me
                </p>
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">
                    You've completed ${chaptersCompleted}/12 chapters
                </p>
                <button class="cta-button primary" onclick="navigateToPhase(1)" style="background: white; color: #8B5CF6; padding: 15px 30px; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                    Go to Phase 1 →
                </button>
            `;
        } else {
            nextActionContent.innerHTML = `
                <p style="font-size: 1.2rem; margin-bottom: 20px;">
                    🎉 You've completed Phase 1! Ready for Phase 2?
                </p>
                <button class="cta-button primary" onclick="navigateToPhase(2)" style="background: white; color: #8B5CF6; padding: 15px 30px; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                    Begin Phase 2 →
                </button>
            `;
        }
    } else if (userProgress.current_phase === 2) {
        nextActionContent.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 20px;">
                Continue Phase 2: Understanding
            </p>
            <button class="cta-button primary" onclick="navigateToPhase(2)" style="background: white; color: #8B5CF6; padding: 15px 30px; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                Go to Phase 2 →
            </button>
        `;
    } else if (userProgress.current_phase === 3) {
        nextActionContent.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 20px;">
                Continue Phase 3: Mastery Practice
            </p>
            <button class="cta-button primary" onclick="navigateToPhase(3)" style="background: white; color: #8B5CF6; padding: 15px 30px; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                Go to Phase 3 →
            </button>
        `;
    } else if (userProgress.current_phase === 4) {
        nextActionContent.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 20px;">
                Continue Phase 4: Teaching Certification
            </p>
            <button class="cta-button primary" onclick="navigateToPhase(4)" style="background: white; color: #8B5CF6; padding: 15px 30px; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                Go to Phase 4 →
            </button>
        `;
    }
}

/**
 * Calculate days active since journey started
 */
function calculateDaysActive() {
    if (!userProgress.started_date) return 0;

    const start = userProgress.started_date instanceof Date
        ? userProgress.started_date
        : userProgress.started_date.toDate();

    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Calculate overall completion percentage
 */
function calculateOverallCompletion() {
    const phase1 = userProgress.phase1_awakening?.completion_percentage || 0;
    const phase2 = userProgress.phase2_understanding?.completion_percentage || 0;
    const phase3 = userProgress.phase3_mastery?.completion_percentage || 0;
    const phase4 = userProgress.phase4_teaching?.completion_percentage || 0;

    // Each phase is worth 25% of overall completion
    const overall = (phase1 + phase2 + phase3 + phase4) / 4;

    userProgress.overall_completion = overall;

    // Update in Firebase (fire and forget)
    if (user) {
        firebase.firestore()
            .collection('users')
            .doc(user.uid)
            .collection('journey_progress')
            .doc('current')
            .update({ overall_completion: overall })
            .catch(err => console.warn('Failed to update overall completion:', err));
    }
}

console.log('🛤️ Journey.js loaded');
