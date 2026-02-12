/**
 * Phase 1: Awakening - Chapter Tracking JavaScript
 * Tracks completion of 12 audiobook chapters
 */

let chaptersCompleted = [];
let user = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌅 Phase 1: Awakening initializing...');

    // Wait for Firebase
    await waitForFirebase();

    // Check authentication
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (!firebaseUser) {
            console.log('⛔ User not logged in')
        }

        user = firebaseUser;
        console.log('✅ User authenticated:', user.email);

        // Load progress
        await loadPhase1Progress();

        // Update UI
        updateAllChapterStatus();
        updateProgressBar();
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
 * Load Phase 1 progress from Firebase
 */
async function loadPhase1Progress() {
    console.log('📊 Loading Phase 1 progress...');

    const progressRef = firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('journey_progress')
        .doc('current');

    try {
        const doc = await progressRef.get();

        if (doc.exists) {
            const data = doc.data();
            chaptersCompleted = data.phase1_awakening?.chapters_completed || [];
            console.log('✅ Chapters completed:', chaptersCompleted);
        } else {
            console.log('⚡ No progress found, starting fresh');
            chaptersCompleted = [];
        }
    } catch (error) {
        console.error('❌ Error loading progress:', error);
        chaptersCompleted = [];
    }
}

/**
 * Toggle chapter details (expand/collapse)
 */
function toggleChapter(chapterNum) {
    const content = document.getElementById(`chapter-${chapterNum}-content`);
    const button = event.target;

    if (!content) return;

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        content.style.display = 'block';
        if (button) button.textContent = 'Hide Details ▲';
    } else {
        content.classList.add('collapsed');
        content.style.display = 'none';
        if (button) button.textContent = 'Show Details ▼';
    }
}

/**
 * Mark chapter as complete
 */
async function markChapterComplete(chapterNum) {
    console.log(`✓ Marking Chapter ${chapterNum} as complete...`);

    // Check if already completed
    if (chaptersCompleted.includes(chapterNum)) {
        showCompletionToast(`Chapter ${chapterNum} was already completed!`);
        return;
    }

    // Add to completed
    chaptersCompleted.push(chapterNum);
    chaptersCompleted.sort((a, b) => a - b);

    // Calculate completion percentage
    const completion = (chaptersCompleted.length / 12) * 100;
    const status = completion === 100 ? 'completed' : 'in_progress';

    console.log(`   Progress: ${chaptersCompleted.length}/12 (${Math.round(completion)}%)`);

    // Update Firebase
    try {
        const progressRef = firebase.firestore()
            .collection('users')
            .doc(user.uid)
            .collection('journey_progress')
            .doc('current');

        await progressRef.set({
            'phase1_awakening': {
                chapters_completed: chaptersCompleted,
                completion_percentage: completion,
                status: status,
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
            },
            'current_phase': completion === 100 ? 2 : 1,
            'last_activity': firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log('✅ Progress saved to Firebase');

        // Update UI
        updateChapterStatus(chapterNum);
        updateProgressBar();

        // Celebration
        if (chaptersCompleted.length === 12) {
            celebratePhaseCompletion();
        } else {
            showCompletionToast(`🎉 Chapter ${chapterNum} completed!`);
        }

    } catch (error) {
        console.error('❌ Error saving progress:', error);
        showCompletionToast('Error saving progress. Please try again.');

        // Roll back
        chaptersCompleted = chaptersCompleted.filter(num => num !== chapterNum);
    }
}

/**
 * Update chapter status icon
 */
function updateChapterStatus(chapterNum) {
    const statusEl = document.getElementById(`chapter-${chapterNum}-status`);
    if (statusEl) {
        statusEl.innerHTML = '<span class="status-icon completed">✅</span>';
    }

    const chapterCard = document.querySelector(`[data-chapter="${chapterNum}"]`);
    if (chapterCard) {
        chapterCard.classList.add('completed');
    }
}

/**
 * Update all chapter status indicators
 */
function updateAllChapterStatus() {
    chaptersCompleted.forEach(num => {
        updateChapterStatus(num);
    });
}

/**
 * Update progress bar
 */
function updateProgressBar() {
    const percentage = (chaptersCompleted.length / 12) * 100;

    // Update progress bar if it exists
    const progressBar = document.getElementById('phase1-progress-bar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }

    // Update progress text
    const progressText = document.getElementById('phase1-progress-text');
    if (progressText) {
        progressText.textContent = Math.round(percentage) + '% Complete';
    }

    // Update chapters completed text
    const chaptersCompletedText = document.getElementById('chapters-completed');
    if (chaptersCompletedText) {
        chaptersCompletedText.textContent = `${chaptersCompleted.length}/12`;
    }

    // Update unlock progress for Phase 2
    const unlockText = document.getElementById('unlock-text');
    if (unlockText) {
        unlockText.textContent = `${chaptersCompleted.length}/12 chapters completed`;
    }

    // Unlock Phase 2 if all chapters complete
    if (chaptersCompleted.length === 12) {
        unlockPhase2();
    }
}

/**
 * Unlock Phase 2
 */
function unlockPhase2() {
    const phase2Card = document.getElementById('phase2-preview');
    if (!phase2Card) return;

    phase2Card.classList.remove('locked');
    phase2Card.innerHTML = `
        <h3 style="color: #10B981; font-size: 1.8rem; margin-bottom: 1rem;">✅ Phase 1 Complete!</h3>
        <p style="margin-bottom: 1.5rem; font-size: 1.1rem;">
            Congratulations! You've completed the Awakening journey. You're ready for Phase 2: Understanding the Aligned Manifestation Principles.
        </p>
        <button class="cta-button primary" onclick="window.location.href='phase2-understanding.html'" style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 15px 30px; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; width: 100%; max-width: 400px;">
            Begin Phase 2 →
        </button>
    `;
}

/**
 * Open journal with pre-filled prompt
 */
function openJournal(promptTitle) {
    console.log('📝 Opening journal:', promptTitle);

    // Store prompt in session storage
    sessionStorage.setItem('journalPrompt', promptTitle);

    // Navigate to member portal journal section
    window.location.href = 'members-new.html#journal';
}

/**
 * Celebrate phase completion with confetti
 */
function celebratePhaseCompletion() {
    console.log('🎉 PHASE 1 COMPLETE! Celebrating...');

    // Confetti animation (if library is loaded)
    if (typeof confetti === 'function') {
        // Multiple bursts
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Show completion modal
    showCompletionModal();
}

/**
 * Show completion modal
 */
function showCompletionModal() {
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background: linear-gradient(135deg, #8B5CF6, #3B82F6);
            padding: 3rem;
            border-radius: 25px;
            text-align: center;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        ">
            <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: white;">Phase 1 Complete!</h2>
            <p style="font-size: 1.2rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 2rem;">
                You've completed all 12 chapters of the Awakening journey. Your transformation has begun!
            </p>
            <div style="background: rgba(255, 255, 255, 0.2); padding: 1.5rem; border-radius: 15px; margin-bottom: 2rem;">
                <p style="font-size: 1rem; color: white; margin-bottom: 0.5rem;">🌅 Chapters Completed: 12/12</p>
                <p style="font-size: 1rem; color: white;">🔓 Phase 2: Understanding - Now Unlocked!</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove(); window.location.href='journey.html'" style="
                background: white;
                color: #8B5CF6;
                padding: 15px 40px;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                margin-right: 1rem;
            ">
                Back to Journey
            </button>
            <button onclick="window.location.href='phase2-understanding.html'" style="
                background: rgba(255, 255, 255, 0.2);
                color: white;
                padding: 15px 40px;
                border: 2px solid white;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
            ">
                Begin Phase 2 →
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Toast notification
 */
function showCompletionToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        font-weight: 600;
        z-index: 9999;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    // Animate out
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';

        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

console.log('🌅 Phase1.js loaded');
