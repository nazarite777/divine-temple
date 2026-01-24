/**
 * Phase 2: Understanding - 6 Principles of Aligned Manifestation™
 * Complete tracking system for principle completion and progress
 */

let principlesCompleted = [];
let user = null;
let db = null;

// 6 Principles of Aligned Manifestation™
const principles = [
    {
        id: 'p1',
        number: 1,
        icon: '🌅',
        title: 'Awakening',
        subtitle: 'Wake Up From the Sleep',
        weeks: 'Weeks 1-2',
        days: 14,
        whatYoullMaster: [
            'Break institutional programming that keeps you asleep',
            'Start observing your thoughts instead of being controlled by them',
            'Begin daily meditation practice for divine connection',
            'Recognize patterns of divine communication in your life'
        ],
        dailyPractices: [
            'Morning meditation (15 minutes)',
            'Observation journaling (notice your patterns)',
            'Deprogramming exercise (question one belief)',
            'Awareness tracking (note divine nudges)'
        ],
        workbook: {
            title: 'Guide 1: Awakening Starter Kit',
            description: 'Your complete 14-day awakening protocol with exercises, prompts, and practices.',
            pdfUrl: 'workbooks/guide-1-awakening.pdf'
        },
        keyExercises: [
            '<strong>The Observation Protocol:</strong> Track your thoughts without judgment',
            '<strong>Programming Audit:</strong> Identify limiting beliefs from childhood',
            '<strong>Conscious Sleep Practice:</strong> Meditation as divine connection',
            '<strong>Divine Communication Log:</strong> Notice synchronicities and signs'
        ],
        reflectionQuestions: {
            week1: [
                'What patterns of thought are you noticing for the first time?',
                'Which beliefs feel programmed vs. divinely true?',
                'How is meditation changing your awareness?'
            ],
            week2: [
                'What divine communication have you recognized this week?',
                'Which old programs are you ready to release?',
                'How does it feel to observe instead of react?'
            ]
        }
    },
    {
        id: 'p2',
        number: 2,
        icon: '✨',
        title: 'Manifestation Mastery',
        subtitle: 'Speak Reality Into Existence',
        weeks: 'Weeks 3-5',
        days: 21,
        whatYoullMaster: [
            'Master creative language that shapes reality',
            'Eliminate disempowering speech patterns',
            'Embody your vision before it manifests',
            'Activate the 7-day manifestation protocol'
        ],
        dailyPractices: [
            'Language audit (catch and correct limiting words)',
            'Vision statement recitation (speak as if accomplished)',
            'Embodiment exercises (act as if you already have it)',
            'Manifestation tracking (document what appears)'
        ],
        workbook: {
            title: 'Guide 2: Manifestation Mastery',
            description: 'Complete manifestation protocol with language transformation exercises.',
            pdfUrl: 'workbooks/guide-2-manifestation.pdf'
        },
        keyExercises: [
            '<strong>The Language Transformation:</strong> Eliminate "trying, hoping, wishing"',
            '<strong>Vision Statement Creation:</strong> Write your reality in present tense',
            '<strong>Embodiment Challenge:</strong> Live as your future self for 7 days',
            '<strong>Manifestation Evidence Log:</strong> Track what you create with words'
        ],
        reflectionQuestions: {
            week1: [
                'What limiting words have you caught yourself using?',
                'How does speaking in present tense feel different?',
                'What has manifested from your declarations this week?'
            ],
            week2: [
                'How are you embodying your vision daily?',
                'What shifts when you speak as if it\'s already done?',
                'Which manifestations surprised you most?'
            ]
        }
    },
    {
        id: 'p3',
        number: 3,
        icon: '⏰',
        title: 'Sacred Timing',
        subtitle: 'Align With Cosmic Rhythm',
        weeks: 'Weeks 6-8',
        days: 21,
        whatYoullMaster: [
            'Understand the Enoch Calendar system',
            'Track moon phases and their energies',
            'Recognize energetic gates for optimal action',
            'Time your decisions with divine flow'
        ],
        dailyPractices: [
            'Check your Enochian date',
            'Moon phase awareness (align actions to lunar cycle)',
            'Gate energy alignment (know when to act vs. rest)',
            'Divine flow tracking (notice when things flow vs. resist)'
        ],
        workbook: {
            title: 'Guide 3: Sacred Timing',
            description: 'Master the Enoch Calendar and cosmic rhythm alignment.',
            pdfUrl: 'workbooks/guide-3-sacred-timing.pdf'
        },
        keyExercises: [
            '<strong>Enoch Calendar Mastery:</strong> Calculate your position in sacred time',
            '<strong>Moon Phase Planning:</strong> Plan 30 days by lunar cycle',
            '<strong>Gate Energy Work:</strong> Recognize the 6 gates and their messages',
            '<strong>Timing Success Log:</strong> Document perfectly timed manifestations'
        ],
        reflectionQuestions: {
            week1: [
                'How does sacred time feel different than Gregorian time?',
                'What moon phase energy are you experiencing?',
                'When do you feel most aligned with cosmic flow?'
            ],
            week2: [
                'Which gates have you recognized this week?',
                'How has timing awareness changed your decisions?',
                'What manifested when you aligned with divine timing?'
            ]
        }
    },
    {
        id: 'p4',
        number: 4,
        icon: '🗣️',
        title: 'Divine Language Mastery',
        subtitle: 'Speak As Creator, Not Creature',
        weeks: 'Weeks 9-10',
        days: 14,
        whatYoullMaster: [
            'Advanced manifestation speech patterns',
            'Temporal authority in your language',
            'Remove victim language completely',
            'Speak from accomplished reality always'
        ],
        dailyPractices: [
            'Speech pattern correction (real-time awareness)',
            'Creator language practice (declarative statements)',
            'Authority declarations (command your reality)',
            'Word power tracking (notice immediate effects)'
        ],
        workbook: {
            title: 'Guide 4: Divine Language Mastery',
            description: 'Advanced manifestation speech and creator vocabulary training.',
            pdfUrl: 'workbooks/guide-4-divine-language.pdf'
        },
        keyExercises: [
            '<strong>The Creator\'s Vocabulary:</strong> Replace all creature language',
            '<strong>Temporal Authority Training:</strong> Speak as if time obeys you',
            '<strong>Declaration Practice:</strong> Command outcomes with certainty',
            '<strong>Language Power Journal:</strong> Document word-to-reality shifts'
        ],
        reflectionQuestions: {
            week1: [
                'What victim language patterns did you identify?',
                'How does speaking with authority feel?',
                'What manifested immediately from your declarations?'
            ],
            week2: [
                'How has your language transformed in 2 weeks?',
                'What reality shifts occurred from speaking as creator?',
                'Which declarations had the most power?'
            ]
        }
    },
    {
        id: 'p5',
        number: 5,
        icon: '👁️',
        title: 'Vision Activation',
        subtitle: 'See It Before You Have It',
        weeks: 'Weeks 11-12',
        days: 14,
        whatYoullMaster: [
            'Create crystal clear vision with sensory detail',
            'Align vision with divine purpose',
            'Activate written vision power',
            'See your future with absolute clarity'
        ],
        dailyPractices: [
            'Vision board refinement (add sensory details)',
            'Multi-sensory visualization (engage all 5 senses)',
            'Vision statement updates (make it more vivid)',
            'Clarity exercises (sharpen the mental image)'
        ],
        workbook: {
            title: 'Guide 5: Vision Activation',
            description: 'Complete vision clarity protocol with activation ceremony.',
            pdfUrl: 'workbooks/guide-5-vision-activation.pdf'
        },
        keyExercises: [
            '<strong>The Vision Template:</strong> Write your future in full detail',
            '<strong>Sensory Immersion:</strong> Feel, see, hear, taste, smell your vision',
            '<strong>Purpose Alignment:</strong> Ensure vision serves beyond yourself',
            '<strong>Vision Activation Ceremony:</strong> Declare it into existence'
        ],
        reflectionQuestions: {
            week1: [
                'How clear is your vision on a scale of 1-10?',
                'Which sensory details make it feel most real?',
                'How does your vision serve others?'
            ],
            week2: [
                'What has manifested from your activated vision?',
                'How has clarity changed your daily actions?',
                'What signs confirm your vision is activating?'
            ]
        }
    },
    {
        id: 'p6',
        number: 6,
        icon: '🌍',
        title: 'Five Elements Mastery',
        subtitle: 'Partner With Cosmic Intelligence',
        weeks: 'Weeks 13-15',
        days: 21,
        whatYoullMaster: [
            'Work with Earth, Water, Fire, Air, Ether',
            'Partner with elemental council',
            'Understand nature as conscious intelligence',
            'Navigate the cosmic chess board'
        ],
        dailyPractices: [
            'Element of the week focus (dedicate time to one)',
            'Nature observation (notice elemental intelligence)',
            'Elemental partnership rituals (water gratitude, etc.)',
            'Intelligence recognition (see creation as alive)'
        ],
        workbook: {
            title: 'Guide 6: Five Elements Mastery',
            description: 'Partner with cosmic intelligence and navigate the chess board.',
            pdfUrl: 'workbooks/guide-6-five-elements.pdf'
        },
        keyExercises: [
            '<strong>The Cosmic Chess Board:</strong> Understand your position in creation',
            '<strong>Water Consciousness Experiment:</strong> Speak to water, observe results',
            '<strong>Elemental Council Partnership:</strong> Work WITH creation, not against',
            '<strong>Five Elements Integration:</strong> Harmonize all elements in your life'
        ],
        reflectionQuestions: {
            week1: [
                'Which element are you most connected to?',
                'How do you experience elemental intelligence?',
                'What messages has nature given you?'
            ],
            week2: [
                'How has partnering with elements changed your life?',
                'What results came from the water experiment?',
                'Where do you stand on the cosmic chess board now?'
            ]
        }
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✨ Phase 2: Understanding initializing...');

    await waitForFirebase();

    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (!firebaseUser) {
            console.log('⛔ User not logged in - redirecting...');
            window.location.href = 'login.html?redirect=phase2-understanding.html';
            return;
        }

        user = firebaseUser;
        db = firebase.firestore();
        console.log('✅ User authenticated:', user.email);

        // Check if Phase 1 is complete
        const phase1Complete = await checkPhase1Complete();
        if (!phase1Complete) {
            showLockedMessage();
            return;
        }

        await loadProgress();
        renderPrinciples();
        updateProgressBar();

        // Hide loading state
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    });
});

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

async function checkPhase1Complete() {
    const progressRef = db.collection('users')
        .doc(user.uid)
        .collection('journey_progress')
        .doc('current');

    try {
        const doc = await progressRef.get();
        if (doc.exists) {
            const data = doc.data();
            return data.phase1_awakening?.status === 'completed';
        }
        return false;
    } catch (error) {
        console.error('Error checking Phase 1:', error);
        return false;
    }
}

function showLockedMessage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="locked-message">
            <div class="lock-icon-large">🔒</div>
            <h2>Phase 2 is Locked</h2>
            <p>Complete all 11 sections of Phase 1: Awakening to unlock Phase 2: Understanding.</p>
            <a href="phase1-awakening.html" class="btn-primary-large">
                ← Return to Phase 1
            </a>
        </div>
    `;
    mainContent.style.display = 'block';
    document.getElementById('loadingState').style.display = 'none';
}

async function loadProgress() {
    console.log('📊 Loading Phase 2 progress...');

    const progressRef = db.collection('users')
        .doc(user.uid)
        .collection('journey_progress')
        .doc('current');

    try {
        const doc = await progressRef.get();

        if (doc.exists) {
            const data = doc.data();
            principlesCompleted = data.phase2_understanding?.principles_completed || [];
            console.log('✅ Principles completed:', principlesCompleted);
        } else {
            principlesCompleted = [];
        }
    } catch (error) {
        console.error('❌ Error loading progress:', error);
        principlesCompleted = [];
    }
}

function renderPrinciples() {
    const container = document.getElementById('principlesContainer');

    container.innerHTML = principles.map(principle => {
        const isCompleted = principlesCompleted.includes(principle.id);

        return `
            <div class="principle-card ${isCompleted ? 'completed' : ''}" data-principle="${principle.id}">
                <div class="principle-header" onclick="togglePrinciple('${principle.id}')">
                    <div class="principle-icon-container">
                        <div class="principle-icon">${principle.icon}</div>
                        <div class="principle-number">Principle ${principle.number}</div>
                    </div>

                    <div class="principle-title-group">
                        <h3>${principle.title}</h3>
                        <p class="principle-subtitle">${principle.subtitle}</p>
                        <span class="principle-duration">${principle.weeks} (${principle.days} days)</span>
                    </div>

                    <div class="principle-status" id="${principle.id}-status">
                        <span class="status-badge ${isCompleted ? 'completed' : ''}">${isCompleted ? '✅ Complete' : 'Not Started'}</span>
                    </div>
                </div>

                <div class="principle-content collapsed" id="${principle.id}-content">

                    <!-- What You'll Master -->
                    <div class="principle-overview">
                        <h4>What You'll Master:</h4>
                        <ul>
                            ${principle.whatYoullMaster.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Daily Practices -->
                    <div class="daily-practices">
                        <h4>📅 Your Daily Practice (${principle.days} Days):</h4>
                        <div class="practice-checklist">
                            ${principle.dailyPractices.map((practice, idx) => `
                                <div class="practice-item">
                                    <input type="checkbox" id="${principle.id}-practice-${idx}">
                                    <label for="${principle.id}-practice-${idx}">${practice}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Workbook Guide -->
                    <div class="workbook-section">
                        <h4>📚 Workbook Guide:</h4>
                        <div class="workbook-card">
                            <div class="workbook-info">
                                <strong>${principle.workbook.title}</strong>
                                <p>${principle.workbook.description}</p>
                            </div>
                            <button class="download-button" onclick="downloadGuide('${principle.workbook.pdfUrl}', '${principle.workbook.title}')">
                                📥 Download Guide (PDF)
                            </button>
                        </div>
                    </div>

                    <!-- Key Exercises -->
                    <div class="key-exercises">
                        <h4>🎯 Key Exercises in ${principle.workbook.title.split(':')[0]}:</h4>
                        <ol>
                            ${principle.keyExercises.map(exercise => `<li>${exercise}</li>`).join('')}
                        </ol>
                    </div>

                    <!-- Reflection Questions -->
                    <div class="reflection-questions">
                        <h4>💭 Weekly Reflection Questions:</h4>

                        <div class="week-questions">
                            <h5>Week 1:</h5>
                            <ol>
                                ${principle.reflectionQuestions.week1.map(q => `<li>${q}</li>`).join('')}
                            </ol>
                        </div>

                        ${principle.reflectionQuestions.week2 ? `
                            <div class="week-questions">
                                <h5>Week 2:</h5>
                                <ol>
                                    ${principle.reflectionQuestions.week2.map(q => `<li>${q}</li>`).join('')}
                                </ol>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Mark Complete -->
                    <div class="principle-actions">
                        ${!isCompleted ? `
                            <button class="complete-button" onclick="markPrincipleComplete('${principle.id}')">
                                ✓ Mark Principle ${principle.number} Complete
                            </button>
                        ` : `
                            <button class="completed-badge">
                                ✅ Completed
                            </button>
                        `}
                    </div>

                </div>

                <button class="expand-button" onclick="togglePrinciple('${principle.id}')" id="${principle.id}-toggle">
                    Show Details ▼
                </button>
            </div>
        `;
    }).join('');

    // Render timeline
    renderTimeline();
}

function renderTimeline() {
    const timeline = document.getElementById('principlesTimeline');
    if (!timeline) return;

    timeline.innerHTML = principles.map((principle, index) => `
        <div class="timeline-item ${principlesCompleted.includes(principle.id) ? 'completed' : ''}" data-principle="${principle.id}">
            <div class="timeline-icon">${principle.icon}</div>
            <span class="timeline-label">${principle.title}</span>
            <span class="timeline-weeks">${principle.weeks}</span>
        </div>
        ${index < principles.length - 1 ? '<div class="timeline-connector">→</div>' : ''}
    `).join('');
}

function togglePrinciple(principleId) {
    const content = document.getElementById(`${principleId}-content`);
    const toggle = document.getElementById(`${principleId}-toggle`);

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.textContent = 'Hide Details ▲';
    } else {
        content.classList.add('collapsed');
        toggle.textContent = 'Show Details ▼';
    }
}

async function markPrincipleComplete(principleId) {
    if (principlesCompleted.includes(principleId)) {
        showToast('Already completed!', 'info');
        return;
    }

    principlesCompleted.push(principleId);

    const completion = (principlesCompleted.length / 6) * 100;
    const status = completion === 100 ? 'completed' : 'in_progress';

    const progressRef = db.collection('users')
        .doc(user.uid)
        .collection('journey_progress')
        .doc('current');

    try {
        await progressRef.set({
            'phase2_understanding': {
                principles_completed: principlesCompleted,
                completion_percentage: completion,
                status: status,
                last_updated: new Date()
            },
            'current_phase': completion === 100 ? 3 : 2
        }, { merge: true });

        // Update UI
        document.getElementById(`${principleId}-status`).innerHTML = '<span class="status-badge completed">✅ Complete</span>';
        document.querySelector(`[data-principle="${principleId}"]`).classList.add('completed');

        updateProgressBar();
        renderTimeline();
        showToast('Principle completed! 🎉', 'success');

        // Celebrate if all done
        if (principlesCompleted.length === 6) {
            celebratePhaseCompletion();
        }
    } catch (error) {
        console.error('Error saving progress:', error);
        showToast('Error saving progress', 'error');
    }
}

function updateProgressBar() {
    const completion = (principlesCompleted.length / 6) * 100;

    // Update main progress bar
    const progressBar = document.getElementById('phase2-progress-bar');
    const progressText = document.getElementById('phase2-progress-text');
    const principlesCompletedText = document.getElementById('principles-completed');

    if (progressBar) progressBar.style.width = `${completion}%`;
    if (progressText) progressText.textContent = `${Math.round(completion)}% Complete`;
    if (principlesCompletedText) principlesCompletedText.textContent = `${principlesCompleted.length}/6`;

    // Update unlock progress
    const unlockProgress = document.getElementById('unlock-text-phase3');
    if (unlockProgress) {
        unlockProgress.textContent = `${principlesCompleted.length}/6 principles completed`;
    }

    // Update next phase card
    if (principlesCompleted.length === 6) {
        const phase3Preview = document.getElementById('phase3-preview');
        if (phase3Preview) {
            phase3Preview.classList.remove('locked');
            phase3Preview.classList.add('unlocked');
            phase3Preview.innerHTML = `
                <h3>✅ Phase 2 Complete!</h3>
                <p>You've mastered the 6 Principles. Ready for Phase 3: Living the Calendar</p>
                <button class="cta-button" onclick="window.location.href='phase3-mastery.html'">
                    Begin Phase 3: Mastery →
                </button>
            `;
        }
    }
}

function celebratePhaseCompletion() {
    // Confetti celebration
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
        }, 250);

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 400);
    }

    // Show completion modal
    showCompletionModal();
}

function showCompletionModal() {
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>🎉 Phase 2 Complete!</h2>
            <p>Congratulations! You've mastered the 6 Principles of Aligned Manifestation™.</p>
            <p><strong>Phase 3: Mastery</strong> is now unlocked!</p>
            <div class="badge-award">
                <div class="badge-icon">🏆</div>
                <div class="badge-text">Understanding Master</div>
            </div>
            <div class="modal-actions">
                <button onclick="window.location.href='journey.html'" class="btn-primary">
                    Return to Journey Dashboard
                </button>
                <button onclick="window.location.href='phase3-mastery.html'" class="btn-success">
                    Begin Phase 3 →
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function downloadGuide(pdfUrl, title) {
    // Check if PDF exists, otherwise show coming soon message
    showToast(`📥 ${title} - PDF download coming soon!`, 'info');

    // When PDFs are ready, use:
    // window.open(pdfUrl, '_blank');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
