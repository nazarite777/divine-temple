/**
 * Divine Temple - Journey System
 * Manages the 4-phase learning journey with progress tracking
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
                    window.location.href = 'login.html';
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

            // Try to load existing journey data
            const journeyRef = this.db.collection('user_journey').doc(userId);
            const journeyDoc = await journeyRef.get();

            if (journeyDoc.exists) {
                this.journeyData = journeyDoc.data();
            } else {
                // Initialize new journey data
                this.journeyData = this.createDefaultJourneyData();
                await journeyRef.set(this.journeyData);
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
                chapters_completed: [],
                total_chapters: 12,
                last_activity: new Date().toISOString(),
                notes: {}
            },
            phase2_progress: {
                principles_completed: [],
                total_principles: 7,
                workbook_exercises: [],
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
        document.getElementById('journeyContent').style.display = 'block';

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
                // Phase 1: Audiobook chapters
                const chaptersCompleted = data.phase1_progress.chapters_completed.length;
                const totalChapters = data.phase1_progress.total_chapters;
                return (chaptersCompleted / totalChapters) * 100;

            case 2:
                // Phase 2: Principles completed
                const principlesCompleted = data.phase2_progress.principles_completed.length;
                const totalPrinciples = data.phase2_progress.total_principles;
                return (principlesCompleted / totalPrinciples) * 100;

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

        // Update progress bar
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.round(progress)}%`;

        // Determine phase status
        const currentPhase = this.journeyData.current_phase;
        const isCompleted = progress >= 100;
        const isLocked = phaseNumber > currentPhase && !isCompleted;
        const isCurrent = phaseNumber === currentPhase;

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

        switch(phaseNumber) {
            case 1:
                const chaptersLeft = data.phase1_progress.total_chapters - data.phase1_progress.chapters_completed.length;
                if (chaptersLeft > 0 && chaptersLeft < data.phase1_progress.total_chapters) {
                    progressText.textContent = `${chaptersLeft} chapters remaining`;
                } else if (chaptersLeft === 0) {
                    progressText.textContent = 'Completed';
                }
                break;

            case 2:
                const principlesLeft = data.phase2_progress.total_principles - data.phase2_progress.principles_completed.length;
                if (principlesLeft > 0 && principlesLeft < data.phase2_progress.total_principles) {
                    progressText.textContent = `${principlesLeft} principles remaining`;
                }
                break;

            case 3:
                const daysPracticed = data.phase3_progress.days_practiced;
                if (daysPracticed > 0 && daysPracticed < 30) {
                    progressText.textContent = `${daysPracticed}/30 days practiced`;
                }
                break;

            case 4:
                const status = data.phase4_progress.certification_status;
                if (status === 'in_progress') {
                    progressText.textContent = 'Certification in progress';
                } else if (status === 'certified') {
                    progressText.textContent = 'Certified Teacher';
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
                const nextChapter = data.phase1_progress.chapters_completed.length + 1;
                if (nextChapter <= data.phase1_progress.total_chapters) {
                    return {
                        title: `Chapter ${nextChapter}: Ya Heard Me`,
                        description: `Continue your awakening journey with chapter ${nextChapter} of the foundational audiobook.`,
                        actionText: `Listen to Chapter ${nextChapter} →`,
                        actionLink: 'phase1-awakening.html'
                    };
                } else {
                    return {
                        title: 'Phase 1 Complete! Ready for Phase 2',
                        description: 'You\'ve completed the Awakening phase. Move on to Aligned Manifestation Principles.',
                        actionText: 'Begin Phase 2 →',
                        actionLink: '#'
                    };
                }

            case 2:
                const nextPrinciple = data.phase2_progress.principles_completed.length + 1;
                if (nextPrinciple <= data.phase2_progress.total_principles) {
                    return {
                        title: `Principle ${nextPrinciple}: Aligned Manifestation`,
                        description: `Learn the ${nextPrinciple}${this.getOrdinalSuffix(nextPrinciple)} principle of manifestation.`,
                        actionText: `Study Principle ${nextPrinciple} →`,
                        actionLink: `principle-${nextPrinciple}.html`
                    };
                } else {
                    return {
                        title: 'Phase 2 Complete! Ready for Phase 3',
                        description: 'You\'ve mastered the principles. Begin your daily practice with the Enochian Calendar.',
                        actionText: 'Begin Phase 3 →',
                        actionLink: '#'
                    };
                }

            case 3:
                return {
                    title: 'Daily Enochian Practice',
                    description: 'Continue building your practice streak. Check today\'s sacred date and complete your ritual.',
                    actionText: 'Practice Today →',
                    actionLink: 'free-dashboard.html'
                };

            case 4:
                return {
                    title: 'Teacher Certification',
                    description: 'Complete your certification to become a Divine Temple teacher and guide others.',
                    actionText: 'Continue Certification →',
                    actionLink: 'certification.html'
                };

            default:
                return {
                    title: 'Begin Your Journey',
                    description: 'Start with Phase 1: The Awakening',
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
        ].filter(date => date !== null);

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

    async updateJourneyProgress(updates) {
        try {
            const userId = this.currentUser.uid;
            const journeyRef = this.db.collection('user_journey').doc(userId);

            // Merge updates with existing data
            await journeyRef.update({
                ...updates,
                last_updated: new Date().toISOString()
            });

            // Reload journey data
            await this.loadJourneyData();

            console.log('✅ Journey progress updated successfully');

        } catch (error) {
            console.error('Error updating journey progress:', error);
        }
    }

    async completeChapter(chapterNumber) {
        const currentCompleted = this.journeyData.phase1_progress.chapters_completed;

        if (!currentCompleted.includes(chapterNumber)) {
            currentCompleted.push(chapterNumber);

            await this.updateJourneyProgress({
                'phase1_progress.chapters_completed': currentCompleted,
                'phase1_progress.last_activity': new Date().toISOString()
            });

            // Check if phase 1 is complete
            if (currentCompleted.length >= this.journeyData.phase1_progress.total_chapters) {
                await this.unlockPhase(2);
            }
        }
    }

    async completePrinciple(principleNumber) {
        const currentCompleted = this.journeyData.phase2_progress.principles_completed;

        if (!currentCompleted.includes(principleNumber)) {
            currentCompleted.push(principleNumber);

            await this.updateJourneyProgress({
                'phase2_progress.principles_completed': currentCompleted,
                'phase2_progress.last_activity': new Date().toISOString()
            });

            // Check if phase 2 is complete
            if (currentCompleted.length >= this.journeyData.phase2_progress.total_principles) {
                await this.unlockPhase(3);
            }
        }
    }

    async recordPracticeDay() {
        const today = new Date().toISOString().split('T')[0];
        const lastPractice = this.journeyData.phase3_progress.last_practice_date;

        // Check if already practiced today
        if (lastPractice && lastPractice.split('T')[0] === today) {
            return;
        }

        const newDaysPracticed = this.journeyData.phase3_progress.days_practiced + 1;

        // Calculate streak
        let newStreak = 1;
        if (lastPractice) {
            const lastDate = new Date(lastPractice);
            const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
                newStreak = this.journeyData.phase3_progress.streak + 1;
            }
        }

        await this.updateJourneyProgress({
            'phase3_progress.days_practiced': newDaysPracticed,
            'phase3_progress.streak': newStreak,
            'phase3_progress.last_practice_date': new Date().toISOString()
        });

        // Check if phase 3 is complete (30 days)
        if (newDaysPracticed >= 30) {
            await this.unlockPhase(4);
        }
    }

    async unlockPhase(phaseNumber) {
        if (this.journeyData.current_phase < phaseNumber) {
            await this.updateJourneyProgress({
                current_phase: phaseNumber
            });

            // Show achievement notification
            this.showAchievement(`Phase ${phaseNumber} Unlocked!`);
        }
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
        loadingState.innerHTML = `
            <div style="text-align: center; color: var(--error);">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: var(--accent-purple);
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

// Navigation functions (global scope for onclick handlers)
function navigateToPhase(phaseNumber) {
    const card = document.getElementById(`phase${phaseNumber}Card`);

    // Don't navigate if locked
    if (card.classList.contains('locked')) {
        alert('Complete the previous phase to unlock this one!');
        return;
    }

    // Navigate to phase page
    switch(phaseNumber) {
        case 1:
            window.location.href = 'phase1-awakening.html';
            break;
        case 2:
            window.location.href = 'phase2-alignment.html';
            break;
        case 3:
            window.location.href = 'phase3-practice.html';
            break;
        case 4:
            window.location.href = 'phase4-mastery.html';
            break;
    }
}

// Initialize journey system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.journeySystem = new JourneySystem();
    window.journeySystem.init();
});
