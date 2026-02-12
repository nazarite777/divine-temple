/**
 * Divine Temple - Journey System
 * Manages the 4-phase learning journey with progress tracking
 * Syncs with Phase 1 & Phase 2 actual progress from Firestore
 */

class JourneySystem {
    constructor() {
        this.db = null;
        this.auth = null;
        this.currentUser = null;
        this.journeyData = null;
        this.initialized = false;
    }

    async init() {
        console.log('🌟 Initializing Journey System...');

        try {
            // Wait for Firebase to be ready
            await this.waitForFirebase();

            // Initialize Firebase references
            this.db = firebase.firestore();
            this.auth = firebase.auth();

            // Set up authentication listener
            this.auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = user;
                    await this.loadJourneyData();
                    this.initialized = true;
                } else {
                    console.log('No user logged in, redirecting...');
                    window.location.href = 'members-new.html';
                }
            });

        } catch (error) {
            console.error('Error initializing Journey System:', error);
            this.showError('Failed to initialize journey system. Please refresh the page.');
        }
    }

    waitForFirebase() {
        return new Promise((resolve) => {
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                resolve();
            } else {
                const checkFirebase = setInterval(() => {
                    if (typeof firebase !== 'undefined' && firebase.firestore) {
                        clearInterval(checkFirebase);
                        resolve();
                    }
                }, 100);
            }
        });
    }

    async loadJourneyData() {
        try {
            const userId = this.currentUser.uid;

            // Load from the ACTUAL progress structure used by Phase 1 & 2
            const progressRef = this.db.collection('users')
                .doc(userId)
                .collection('journey_progress')
                .doc('current');

            const progressDoc = await progressRef.get();

            if (progressDoc.exists) {
                const data = progressDoc.data();

                // Convert actual progress to journey data structure
                this.journeyData = {
                    userId: userId,
                    current_phase: data.current_phase || 1,
                    overall_progress: 0,

                    // Phase 1: 11 sections (Intro + 9 Chapters + Conclusion)
                    phase1_progress: {
                        sections_completed: data.phase1_awakening?.sections_completed || [],
                        total_sections: 11,
                        completion_percentage: data.phase1_awakening?.completion_percentage || 0,
                        status: data.phase1_awakening?.status || 'not_started',
                        last_activity: data.phase1_awakening?.last_updated || new Date().toISOString()
                    },

                    // Phase 2: 6 Principles
                    phase2_progress: {
                        principles_completed: data.phase2_understanding?.principles_completed || [],
                        total_principles: 6,
                        completion_percentage: data.phase2_understanding?.completion_percentage || 0,
                        status: data.phase2_understanding?.status || 'locked',
                        last_activity: data.phase2_understanding?.last_updated || null
                    },

                    // Phase 3: Enochian Practice (to be implemented)
                    phase3_progress: {
                        days_practiced: 0,
                        streak: 0,
                        last_practice_date: null,
                        rituals_completed: []
                    },

                    // Phase 4: Mastery/Certification (to be implemented)
                    phase4_progress: {
                        certification_status: 'locked',
                        modules_completed: [],
                        teaching_hours: 0,
                        exam_score: null
                    },

                    achievements: [],
                    journey_started: new Date().toISOString(),
                    last_updated: new Date().toISOString()
                };

                console.log('✅ Journey data loaded successfully:', this.journeyData);
            } else {
                // No progress yet - create default
                this.journeyData = this.createDefaultJourneyData();
                console.log('ℹ️ No existing progress, using defaults');
            }

            // Render the journey dashboard
            this.renderJourney();

        } catch (error) {
            console.error('Error loading journey data:', error);
            this.showError('Failed to load your journey data.');
        }
    }

    createDefaultJourneyData() {
        return {
            userId: this.currentUser.uid,
            current_phase: 1,
            overall_progress: 0,
            phase1_progress: {
                sections_completed: [],
                total_sections: 11,
                completion_percentage: 0,
                status: 'not_started',
                last_activity: new Date().toISOString()
            },
            phase2_progress: {
                principles_completed: [],
                total_principles: 6,
                completion_percentage: 0,
                status: 'locked',
                last_activity: null
            },
            phase3_progress: {
                days_practiced: 0,
                streak: 0,
                last_practice_date: null,
                rituals_completed: []
            },
            phase4_progress: {
                certification_status: 'locked',
                modules_completed: [],
                teaching_hours: 0,
                exam_score: null
            },
            achievements: [],
            journey_started: new Date().toISOString(),
            last_updated: new Date().toISOString()
        };
    }

    renderJourney() {
        // Hide loading, show content
        document.getElementById('loadingState').style.display = 'none';
        const journeyContent = document.querySelectorAll('#journeyContent');
        journeyContent.forEach(elem => elem.style.display = 'block');

        // Calculate and display overall progress
        this.updateOverallProgress();

        // Update each phase card
        this.updatePhaseCard(1);
        this.updatePhaseCard(2);
        this.updatePhaseCard(3);
        this.updatePhaseCard(4);

        // Update current focus section
        this.updateCurrentFocus();
    }

    updateOverallProgress() {
        const progress = this.calculateOverallProgress();

        // Update percentage display
        document.getElementById('overallPercentage').textContent = `${Math.round(progress)}%`;
        document.getElementById('overallProgressBar').style.width = `${progress}%`;

        // Update stats
        const completedPhases = this.getCompletedPhasesCount();
        document.getElementById('phasesCompleted').textContent = `${completedPhases}/4 Phases Complete`;

        // Get streak from analytics if available
        const streak = this.journeyData.phase3_progress?.streak || 0;
        document.getElementById('currentStreak').textContent = `${streak} Day Streak`;

        // Last activity
        const lastActivity = this.getLastActivity();
        document.getElementById('lastActivity').textContent = `Last activity: ${lastActivity}`;
    }

    calculateOverallProgress() {
        // Each phase is worth 25% of total progress
        const phase1 = this.calculatePhaseProgress(1);
        const phase2 = this.calculatePhaseProgress(2);
        const phase3 = this.calculatePhaseProgress(3);
        const phase4 = this.calculatePhaseProgress(4);

        return (phase1 + phase2 + phase3 + phase4) / 4;
    }

    calculatePhaseProgress(phaseNumber) {
        const data = this.journeyData;

        switch(phaseNumber) {
            case 1:
                // Phase 1: 11 sections (Introduction + 9 chapters + Conclusion)
                return data.phase1_progress.completion_percentage || 0;

            case 2:
                // Phase 2: 6 Principles
                return data.phase2_progress.completion_percentage || 0;

            case 3:
                // Phase 3: Practice days (target 30 days)
                const daysPracticed = data.phase3_progress.days_practiced;
                const targetDays = 30;
                return Math.min((daysPracticed / targetDays) * 100, 100);

            case 4:
                // Phase 4: Certification status
                if (data.phase4_progress.certification_status === 'certified') return 100;
                if (data.phase4_progress.certification_status === 'in_progress') {
                    const modulesCompleted = data.phase4_progress.modules_completed.length;
                    const totalModules = 5;
                    return (modulesCompleted / totalModules) * 100;
                }
                return 0;

            default:
                return 0;
        }
    }

    updatePhaseCard(phaseNumber) {
        const progress = this.calculatePhaseProgress(phaseNumber);
        const card = document.getElementById(`phase${phaseNumber}Card`);
        const progressBar = document.getElementById(`phase${phaseNumber}Progress`);
        const progressText = document.getElementById(`phase${phaseNumber}Text`);
        const progressPercent = document.getElementById(`phase${phaseNumber}Percent`);

        if (!card || !progressBar || !progressText || !progressPercent) {
            console.warn(`Missing elements for phase ${phaseNumber}`);
            return;
        }

        // Update progress bar
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.round(progress)}%`;

        // Determine phase status
        const currentPhase = this.journeyData.current_phase;
        const isCompleted = progress >= 100;
        const isLocked = phaseNumber > currentPhase && !isCompleted;
        const isCurrent = phaseNumber === currentPhase && progress < 100;

        // Update card classes
        card.classList.remove('locked', 'current', 'completed');
        if (isCompleted) {
            card.classList.add('completed');
            progressText.textContent = 'Completed';
        } else if (isLocked) {
            card.classList.add('locked');
            progressText.textContent = 'Locked';
        } else if (isCurrent) {
            card.classList.add('current');
            progressText.textContent = 'In Progress';
        } else {
            progressText.textContent = this.getPhaseStatusText(phaseNumber, progress);
        }

        // Update specific phase text
        this.updatePhaseSpecificText(phaseNumber);
    }

    updatePhaseSpecificText(phaseNumber) {
        const progressText = document.getElementById(`phase${phaseNumber}Text`);
        const data = this.journeyData;

        if (!progressText) return;

        switch(phaseNumber) {
            case 1:
                const sectionsLeft = data.phase1_progress.total_sections - data.phase1_progress.sections_completed.length;
                if (sectionsLeft > 0 && sectionsLeft < data.phase1_progress.total_sections) {
                    progressText.textContent = `${data.phase1_progress.sections_completed.length}/${data.phase1_progress.total_sections} sections`;
                } else if (sectionsLeft === 0) {
                    progressText.textContent = 'Completed ✓';
                } else if (data.phase1_progress.sections_completed.length === 0) {
                    progressText.textContent = 'Not started';
                }
                break;

            case 2:
                const principlesLeft = data.phase2_progress.total_principles - data.phase2_progress.principles_completed.length;
                if (principlesLeft > 0 && principlesLeft < data.phase2_progress.total_principles) {
                    progressText.textContent = `${data.phase2_progress.principles_completed.length}/${data.phase2_progress.total_principles} principles`;
                } else if (principlesLeft === 0) {
                    progressText.textContent = 'Completed ✓';
                } else if (data.phase2_progress.principles_completed.length === 0) {
                    const phase1Complete = data.phase1_progress.completion_percentage >= 100;
                    progressText.textContent = phase1Complete ? 'Ready to start' : 'Locked';
                }
                break;

            case 3:
                const daysPracticed = data.phase3_progress.days_practiced;
                if (daysPracticed > 0 && daysPracticed < 30) {
                    progressText.textContent = `${daysPracticed}/30 days practiced`;
                } else if (daysPracticed === 0) {
                    const phase2Complete = data.phase2_progress.completion_percentage >= 100;
                    progressText.textContent = phase2Complete ? 'Ready to start' : 'Locked';
                }
                break;

            case 4:
                const status = data.phase4_progress.certification_status;
                if (status === 'in_progress') {
                    progressText.textContent = 'Certification in progress';
                } else if (status === 'certified') {
                    progressText.textContent = 'Certified Teacher ✓';
                } else {
                    const phase3Complete = data.phase3_progress.days_practiced >= 30;
                    progressText.textContent = phase3Complete ? 'Ready to start' : 'Locked';
                }
                break;
        }
    }

    getPhaseStatusText(phaseNumber, progress) {
        if (progress === 0) return 'Not started';
        if (progress > 0 && progress < 100) return 'In Progress';
        if (progress >= 100) return 'Completed';
        return 'Locked';
    }

    updateCurrentFocus() {
        const currentPhase = this.journeyData.current_phase;
        const focusTitle = document.getElementById('focusTitle');
        const focusDescription = document.getElementById('focusDescription');
        const focusAction = document.getElementById('focusAction');

        if (!focusTitle || !focusDescription || !focusAction) return;

        let nextAction = this.getNextAction(currentPhase);

        focusTitle.textContent = nextAction.title;
        focusDescription.textContent = nextAction.description;
        focusAction.textContent = nextAction.actionText;
        focusAction.href = nextAction.actionLink;
    }

    getNextAction(currentPhase) {
        const data = this.journeyData;

        switch(currentPhase) {
            case 1:
                const sectionsCompleted = data.phase1_progress.sections_completed.length;
                if (sectionsCompleted < data.phase1_progress.total_sections) {
                    return {
                        title: 'Phase 1: Awakening - Ya Heard Me',
                        description: `Continue your awakening journey. You've completed ${sectionsCompleted} of ${data.phase1_progress.total_sections} sections.`,
                        actionText: `Continue Phase 1 →`,
                        actionLink: 'phase1-awakening.html'
                    };
                } else {
                    return {
                        title: 'Phase 1 Complete! Ready for Phase 2',
                        description: 'You\'ve completed the Awakening phase. Move on to the 6 Principles of Aligned Manifestation™.',
                        actionText: 'Begin Phase 2 →',
                        actionLink: 'phase2-understanding.html'
                    };
                }

            case 2:
                const principlesCompleted = data.phase2_progress.principles_completed.length;
                if (principlesCompleted < data.phase2_progress.total_principles) {
                    return {
                        title: 'Phase 2: Understanding - Aligned Manifestation',
                        description: `Master the principles. You've completed ${principlesCompleted} of ${data.phase2_progress.total_principles} principles.`,
                        actionText: `Continue Phase 2 →`,
                        actionLink: 'phase2-understanding.html'
                    };
                } else {
                    return {
                        title: 'Phase 2 Complete! Ready for Phase 3',
                        description: 'You\'ve mastered the principles. Begin your daily practice with the I-N-I Year.',
                        actionText: 'Begin Phase 3 →',
                        actionLink: 'phase3-mastery.html'
                    };
                }

            case 3:
                return {
                    title: 'Phase 3: Mastery - I-N-I Year Practice',
                    description: 'Continue building your practice with the sacred calendar and daily rituals.',
                    actionText: 'Continue Practice →',
                    actionLink: 'phase3-mastery.html'
                };

            case 4:
                return {
                    title: 'Phase 4: Mastery - Teacher Certification',
                    description: 'Complete your certification to become a Divine Temple teacher and guide others.',
                    actionText: 'Continue Certification →',
                    actionLink: 'phase4-teaching.html'
                };

            default:
                return {
                    title: 'Begin Your Journey',
                    description: 'Start with Phase 1: The Awakening - Ya Heard Me audiobook journey',
                    actionText: 'Start Phase 1 →',
                    actionLink: 'phase1-awakening.html'
                };
        }
    }

    getOrdinalSuffix(num) {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
    }

    getCompletedPhasesCount() {
        let count = 0;
        for (let i = 1; i <= 4; i++) {
            if (this.calculatePhaseProgress(i) >= 100) {
                count++;
            }
        }
        return count;
    }

    getLastActivity() {
        const activities = [
            this.journeyData.phase1_progress.last_activity,
            this.journeyData.phase2_progress.last_activity,
            this.journeyData.phase3_progress.last_practice_date
        ].filter(date => date !== null && date !== undefined);

        if (activities.length === 0) {
            return 'Never';
        }

        const mostRecent = new Date(Math.max(...activities.map(d => new Date(d))));
        return this.formatRelativeTime(mostRecent);
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    showAchievement(message) {
        console.log(`🏆 Achievement: ${message}`);

        // Trigger confetti celebration
        this.celebrate();

        // Show custom achievement notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #D4AF37, #8B5CF6);
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 700;
            animation: slideIn 0.5s ease-out;
        `;
        notification.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <div>${message}</div>
            <div style="margin-top: 1rem; font-size: 1rem; opacity: 0.9;">Keep going! Your transformation continues...</div>
        `;

        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    celebrate() {
        // Check if confetti library is available
        if (typeof confetti === 'function') {
            // Fire confetti from both sides
            const count = 200;
            const defaults = {
                origin: { y: 0.7 },
                colors: ['#D4AF37', '#8B5CF6', '#4fc3f7', '#F59E0B']
            };

            function fire(particleRatio, opts) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio)
                });
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });

            fire(0.2, {
                spread: 60,
            });

            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });

            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
            });

            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    }

    showError(message) {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) {
            loadingState.innerHTML = `
                <div style="text-align: center; color: #F87171;">
                    <h3>⚠️ Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="
                        margin-top: 1rem;
                        padding: 0.75rem 1.5rem;
                        background: #8B5CF6;
                        color: white;
                        border: none;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Reload Page</button>
                </div>
            `;
        }
    }
}

// Navigation functions (global scope for onclick handlers)
function navigateToPhase(phaseNumber) {
    const card = document.getElementById(`phase${phaseNumber}Card`);

    // Don't navigate if locked
    if (card && card.classList.contains('locked')) {
        alert('Complete the previous phase to unlock this one!');
        return;
    }

    // Navigate to phase page
    switch(phaseNumber) {
        case 1:
            window.location.href = 'phase1-awakening.html';
            break;
        case 2:
            window.location.href = 'phase2-understanding.html';
            break;
        case 3:
            window.location.href = 'phase3-mastery.html';
            break;
        case 4:
            window.location.href = 'phase4-teaching.html';
            break;
    }
}

// Initialize journey system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.journeySystem = new JourneySystem();
    window.journeySystem.init();
});
