/**
 * Divine Temple - Phase 1: Awakening System
 * Manages Ya Heard Me audiobook with chapter tracking and progress
 */

class Phase1System {
    constructor() {
        this.db = null;
        this.auth = null;
        this.currentUser = null;
        this.journeyData = null;
        this.currentChapter = null;
        this.audioPlayer = null;

        // Chapter data with discussion questions and journal prompts
        this.chapters = [
            {
                number: 1,
                title: "The Call to Awakening",
                duration: "18:32",
                audioUrl: "audio/ya-heard-me/chapter-01.mp3", // Placeholder - update with actual URLs
                description: "Discover the first steps of your spiritual awakening and understand the divine call within you.",
                discussionQuestions: [
                    "What does 'awakening' mean to you personally?",
                    "Have you felt a spiritual calling? When did you first recognize it?",
                    "What resistance have you encountered on your path?"
                ],
                journalPrompts: [
                    "Write about a moment when you felt truly awakened or aware of something greater.",
                    "What part of your life is calling for transformation right now?",
                    "Describe your vision of your highest self."
                ]
            },
            {
                number: 2,
                title: "Understanding Divine Timing",
                duration: "22:15",
                audioUrl: "audio/ya-heard-me/chapter-02.mp3",
                description: "Learn to recognize and align with divine timing in all aspects of your life.",
                discussionQuestions: [
                    "How do you differentiate between divine timing and delay?",
                    "Recall a time when perfect timing revealed itself to you.",
                    "What are you trying to force that might benefit from patience?"
                ],
                journalPrompts: [
                    "Reflect on a situation where waiting led to a better outcome.",
                    "What signs tell you that you're in alignment with divine timing?",
                    "Write a letter to your future self about trusting the process."
                ]
            },
            {
                number: 3,
                title: "The Power of Sacred Truth",
                duration: "20:48",
                audioUrl: "audio/ya-heard-me/chapter-03.mp3",
                description: "Embrace the transformative power of speaking and living your sacred truth.",
                discussionQuestions: [
                    "Where in your life are you not speaking your truth?",
                    "What fears prevent you from being authentic?",
                    "How does living truthfully align with your spiritual path?"
                ],
                journalPrompts: [
                    "Write about a time when speaking your truth changed everything.",
                    "What truth have you been avoiding? Why?",
                    "Create an affirmation that empowers you to live authentically."
                ]
            },
            {
                number: 4,
                title: "Releasing Ancestral Patterns",
                duration: "25:10",
                audioUrl: "audio/ya-heard-me/chapter-04.mp3",
                description: "Identify and release limiting patterns inherited from your lineage.",
                discussionQuestions: [
                    "What patterns do you notice repeating in your family?",
                    "How have ancestral beliefs shaped your current reality?",
                    "What would it feel like to break free from these cycles?"
                ],
                journalPrompts: [
                    "List three patterns you've inherited that no longer serve you.",
                    "Write a forgiveness letter to your ancestors for patterns they passed down.",
                    "Describe the new legacy you want to create for future generations."
                ]
            },
            {
                number: 5,
                title: "The Sacred Masculine & Feminine",
                duration: "23:45",
                audioUrl: "audio/ya-heard-me/chapter-05.mp3",
                description: "Balance the divine masculine and feminine energies within yourself.",
                discussionQuestions: [
                    "Which energy (masculine or feminine) feels more dominant in you?",
                    "How can you honor both aspects of your divine nature?",
                    "What does sacred balance look like in your daily life?"
                ],
                journalPrompts: [
                    "Describe your relationship with your masculine energy.",
                    "Describe your relationship with your feminine energy.",
                    "What would perfect inner balance create in your external world?"
                ]
            },
            {
                number: 6,
                title: "Alchemy of Transformation",
                duration: "21:30",
                audioUrl: "audio/ya-heard-me/chapter-06.mp3",
                description: "Master the spiritual alchemy that transforms challenges into gold.",
                discussionQuestions: [
                    "What current challenge could be your greatest teacher?",
                    "How have past struggles shaped who you are today?",
                    "What needs to be transmuted in your life right now?"
                ],
                journalPrompts: [
                    "Write about a difficulty that later became a blessing.",
                    "What 'lead' in your life is ready to become 'gold'?",
                    "Create a ritual for transforming negative energy into positive power."
                ]
            },
            {
                number: 7,
                title: "Divine Alignment & Purpose",
                duration: "24:20",
                audioUrl: "audio/ya-heard-me/chapter-07.mp3",
                description: "Discover and align with your soul's true purpose and mission.",
                discussionQuestions: [
                    "What activities make you feel most aligned and alive?",
                    "How does your current life reflect your soul's purpose?",
                    "What would you do if you knew you couldn't fail?"
                ],
                journalPrompts: [
                    "Complete this: 'I came to Earth to...'",
                    "List 10 things that bring you joy - what patterns do you notice?",
                    "Describe a day in your perfectly aligned life."
                ]
            },
            {
                number: 8,
                title: "The Language of the Universe",
                duration: "19:55",
                audioUrl: "audio/ya-heard-me/chapter-08.mp3",
                description: "Learn to recognize and interpret the signs, symbols, and synchronicities around you.",
                discussionQuestions: [
                    "What synchronicities have you noticed recently?",
                    "How does the universe communicate with you personally?",
                    "What sign have you been asking for?"
                ],
                journalPrompts: [
                    "Record the most meaningful synchronicity you've experienced.",
                    "What symbols or numbers keep appearing in your life?",
                    "How can you become more receptive to universal guidance?"
                ]
            },
            {
                number: 9,
                title: "Sacred Sovereignty",
                duration: "22:40",
                audioUrl: "audio/ya-heard-me/chapter-09.mp3",
                description: "Claim your power as a sovereign divine being and set sacred boundaries.",
                discussionQuestions: [
                    "Where do you give your power away?",
                    "What boundaries need to be established or reinforced?",
                    "How does sovereignty differ from selfish independence?"
                ],
                journalPrompts: [
                    "Write a declaration of your divine sovereignty.",
                    "List areas where you need to reclaim your power.",
                    "What boundaries would your highest self set?"
                ]
            },
            {
                number: 10,
                title: "The Frequency of Abundance",
                duration: "26:15",
                audioUrl: "audio/ya-heard-me/chapter-10.mp3",
                description: "Attune to the vibration of abundance and unlock infinite prosperity.",
                discussionQuestions: [
                    "What beliefs about abundance are you ready to release?",
                    "How do you define true prosperity?",
                    "Where in your life do you already experience abundance?"
                ],
                journalPrompts: [
                    "List 20 things you're abundant in right now.",
                    "What would abundance in all areas feel like?",
                    "Rewrite your money story from a place of overflow."
                ]
            },
            {
                number: 11,
                title: "Embodying the Divine",
                duration: "23:50",
                audioUrl: "audio/ya-heard-me/chapter-11.mp3",
                description: "Integrate divine wisdom into your physical body and daily actions.",
                discussionQuestions: [
                    "How does your body communicate spiritual truth to you?",
                    "What daily practices help you embody divine wisdom?",
                    "How can you make the spiritual practical?"
                ],
                journalPrompts: [
                    "Describe how it feels in your body when you're aligned.",
                    "What spiritual insights need to be embodied in action?",
                    "Create a daily ritual for embodying your divine nature."
                ]
            },
            {
                number: 12,
                title: "The Path Forward: Integration",
                duration: "20:30",
                audioUrl: "audio/ya-heard-me/chapter-12.mp3",
                description: "Integrate all teachings and step confidently into your awakened life.",
                discussionQuestions: [
                    "What has been your biggest revelation from this journey?",
                    "How will you apply these teachings in your daily life?",
                    "What commitment are you making to your continued awakening?"
                ],
                journalPrompts: [
                    "Write a gratitude letter to yourself for completing this phase.",
                    "What are your three main takeaways from Ya Heard Me?",
                    "Set intentions for Phase 2 of your journey."
                ]
            }
        ];
    }

    async init() {
        console.log('🌅 Initializing Phase 1: Awakening System...');

        try {
            await this.waitForFirebase();

            this.db = firebase.firestore();
            this.auth = firebase.auth();
            this.audioPlayer = document.getElementById('audioPlayer');

            this.auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = user;
                    await this.loadProgress();
                    this.renderChapters();
                    this.setupAudioPlayer();
                } else {
                    window.location.href = 'login.html';
                }
            });

        } catch (error) {
            console.error('Error initializing Phase 1 System:', error);
            this.showError('Failed to initialize. Please refresh the page.');
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

    async loadProgress() {
        try {
            const userId = this.currentUser.uid;
            const journeyRef = this.db.collection('user_journey').doc(userId);
            const journeyDoc = await journeyRef.get();

            if (journeyDoc.exists) {
                this.journeyData = journeyDoc.data();
            } else {
                // Initialize default journey data
                this.journeyData = {
                    userId: userId,
                    current_phase: 1,
                    phase1_progress: {
                        chapters_completed: [],
                        total_chapters: 12,
                        last_activity: new Date().toISOString(),
                        notes: {}
                    }
                };
                await journeyRef.set(this.journeyData);
            }

            this.updateProgressDisplay();

            // Hide loading, show content
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';

        } catch (error) {
            console.error('Error loading progress:', error);
            this.showError('Failed to load your progress.');
        }
    }

    updateProgressDisplay() {
        const completed = this.journeyData.phase1_progress.chapters_completed.length;
        const total = this.journeyData.phase1_progress.total_chapters;
        const percentage = Math.round((completed / total) * 100);

        document.getElementById('progressPercentage').textContent = `${percentage}%`;
        document.getElementById('progressBar').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${completed} of ${total} chapters completed`;
    }

    renderChapters() {
        const chapterList = document.getElementById('chapterList');
        const completedChapters = this.journeyData.phase1_progress.chapters_completed;

        chapterList.innerHTML = this.chapters.map(chapter => {
            const isCompleted = completedChapters.includes(chapter.number);
            const isCurrent = !isCompleted &&
                (completedChapters.length === 0 ? chapter.number === 1 : chapter.number === completedChapters.length + 1);

            return `
                <div class="chapter-card ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}"
                     data-chapter="${chapter.number}">
                    <div class="chapter-header">
                        <div class="chapter-number">${chapter.number}</div>
                        <div class="chapter-info">
                            <h3 class="chapter-title">${chapter.title}</h3>
                            <p class="chapter-duration">⏱️ ${chapter.duration}</p>
                        </div>
                    </div>

                    <div class="chapter-content">
                        <div class="content-section">
                            <p>${chapter.description}</p>
                        </div>

                        <div class="content-section">
                            <h4>💭 Discussion Questions</h4>
                            <ul class="discussion-questions">
                                ${chapter.discussionQuestions.map(q => `<li>${q}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="content-section">
                            <h4>📝 Journal Prompts</h4>
                            <ul class="journal-prompts">
                                ${chapter.journalPrompts.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="chapter-actions">
                            <button class="btn btn-primary" onclick="phase1System.playChapter(${chapter.number})">
                                ${isCompleted ? '🔄 Listen Again' : '▶️ Play Chapter'}
                            </button>
                            <button class="btn btn-secondary" onclick="phase1System.openJournal(${chapter.number})">
                                📓 Open Journal
                            </button>
                            ${!isCompleted ? `
                                <button class="btn btn-success" onclick="phase1System.completeChapter(${chapter.number})">
                                    ✓ Mark Complete
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    setupAudioPlayer() {
        this.audioPlayer.addEventListener('timeupdate', () => {
            const current = this.formatTime(this.audioPlayer.currentTime);
            const duration = this.formatTime(this.audioPlayer.duration);
            document.getElementById('audioTime').textContent = `${current} / ${duration}`;
        });

        this.audioPlayer.addEventListener('ended', () => {
            if (this.currentChapter) {
                this.showCompletionPrompt(this.currentChapter.number);
            }
        });
    }

    playChapter(chapterNumber) {
        const chapter = this.chapters.find(c => c.number === chapterNumber);
        if (!chapter) return;

        this.currentChapter = chapter;

        // Note: You'll need to update audioUrl with actual audio file URLs
        // For demo purposes, this will show a message
        if (!chapter.audioUrl || chapter.audioUrl.includes('Placeholder')) {
            alert(`📢 Audio for "${chapter.title}" will be available soon!\n\nFor now, you can:\n• Read the discussion questions\n• Complete the journal prompts\n• Mark the chapter complete when ready`);
            return;
        }

        this.audioPlayer.src = chapter.audioUrl;
        this.audioPlayer.play();

        document.getElementById('currentChapter').textContent = `Chapter ${chapter.number}: ${chapter.title}`;

        // Scroll to player
        document.querySelector('.audiobook-player').scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Update last activity
        this.updateLastActivity();
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showCompletionPrompt(chapterNumber) {
        const isCompleted = this.journeyData.phase1_progress.chapters_completed.includes(chapterNumber);

        if (!isCompleted) {
            const complete = confirm(`You've finished Chapter ${chapterNumber}!\n\nWould you like to mark it as complete?`);
            if (complete) {
                this.completeChapter(chapterNumber);
            }
        }
    }

    async completeChapter(chapterNumber) {
        try {
            const completedChapters = this.journeyData.phase1_progress.chapters_completed;

            if (completedChapters.includes(chapterNumber)) {
                alert('This chapter is already marked as complete!');
                return;
            }

            // Add chapter to completed list
            completedChapters.push(chapterNumber);
            completedChapters.sort((a, b) => a - b);

            // Update Firestore
            const userId = this.currentUser.uid;
            const journeyRef = this.db.collection('user_journey').doc(userId);

            await journeyRef.update({
                'phase1_progress.chapters_completed': completedChapters,
                'phase1_progress.last_activity': new Date().toISOString()
            });

            // Update local data
            this.journeyData.phase1_progress.chapters_completed = completedChapters;

            // Update display
            this.updateProgressDisplay();
            this.renderChapters();

            // Show success message
            const chapter = this.chapters.find(c => c.number === chapterNumber);
            alert(`🎉 Chapter ${chapterNumber}: "${chapter.title}" completed!\n\n${completedChapters.length} of 12 chapters done.${completedChapters.length === 12 ? '\n\n✨ Phase 1 Complete! You can now move to Phase 2!' : ''}`);

            // Record achievement if phase complete
            if (completedChapters.length === 12) {
                await this.completePhase1();
            }

        } catch (error) {
            console.error('Error completing chapter:', error);
            alert('Failed to save progress. Please try again.');
        }
    }

    async completePhase1() {
        try {
            const userId = this.currentUser.uid;
            const journeyRef = this.db.collection('user_journey').doc(userId);

            // Unlock Phase 2
            await journeyRef.update({
                current_phase: 2
            });

            // Award achievement (integrate with achievement system if available)
            console.log('🏆 Phase 1 Complete - Awakening Seeker achievement unlocked!');

            // You could also update the universal progress system here
            if (window.progressSystem) {
                await window.progressSystem.awardXP(500, 'Completed Phase 1: The Awakening');
            }

        } catch (error) {
            console.error('Error completing phase:', error);
        }
    }

    openJournal(chapterNumber) {
        // Navigate to journaling system with chapter context
        const chapter = this.chapters.find(c => c.number === chapterNumber);

        // Store chapter context in localStorage for journaling system
        localStorage.setItem('journalContext', JSON.stringify({
            phase: 1,
            chapter: chapterNumber,
            title: chapter.title,
            prompts: chapter.journalPrompts
        }));

        // Navigate to journal (if available) or show prompts
        if (document.querySelector('[href*="journal"]')) {
            window.location.href = 'sections/journaling-system.html';
        } else {
            alert(`📓 Journal Prompts for "${chapter.title}":\n\n${chapter.journalPrompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}\n\nOpen your personal journal and reflect on these prompts.`);
        }
    }

    async updateLastActivity() {
        try {
            const userId = this.currentUser.uid;
            const journeyRef = this.db.collection('user_journey').doc(userId);

            await journeyRef.update({
                'phase1_progress.last_activity': new Date().toISOString()
            });

        } catch (error) {
            console.error('Error updating last activity:', error);
        }
    }

    showError(message) {
        const loadingState = document.getElementById('loadingState');
        loadingState.innerHTML = `
            <div style="text-align: center; color: var(--error);">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                    Reload Page
                </button>
            </div>
        `;
    }
}

// Initialize Phase 1 System
document.addEventListener('DOMContentLoaded', () => {
    window.phase1System = new Phase1System();
    window.phase1System.init();
});
