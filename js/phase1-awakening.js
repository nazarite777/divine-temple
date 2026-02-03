/**
 * Phase 1: Awakening - Ya Heard Me Audiobook Journey
 * Complete chapter tracking with Introduction + 9 Chapters + Conclusion = 11 sections
 */

// Audio streaming URLs from Google Drive
const audioMap = {
    'intro': { id: '1hwRwWKa7TcP6iXLP4fia7A9Hg7CN8vSS', duration: '~8 min' },
    'ch1': { id: '1xjGZAE9e_B7FGMqtW-ujp7gCT5pEk9wc', duration: '~12 min' },
    'ch2': { id: '1qxlYoLaYI_8iyOWkP7NrS2XOphrtKFOX', duration: '~14 min' },
    'ch3': { id: '1PrIRPymEsnlMx9G7vL0htbpSsM8MN0_s', duration: '~11 min' },
    'ch4': { id: '1fNWY8-cyWLPOmmy5QmQGrMu6aXRiF5wC', duration: '~13 min' },
    'ch5': { id: '1dqTo_AgYH6Rtvmii5L2EonHe7dXYDV74', duration: '~10 min' },
    'ch6': { id: '172xFi6l6U0cXerrjQPvK7tou3_WdPSpb', duration: '~15 min' },
    'ch7': { id: '1N6xlY7UAjuU3i3pCdX0-uCXUFuXzlRYr', duration: '~12 min' },
    'ch8': { id: '1q7bJgZkNXRutSu-PrKSERQBlkR8aLF0x', duration: '~11 min' },
    'ch9': { id: '1mS-shUXhHfiP9cdI_spbDny8LXLg64XN', duration: '~13 min' },
    'conclusion': { id: '1UO1IuinGpvsp3uYZqJmE-a8p9nl5dyfM', duration: '~6 min' }
};

function getDriveStreamUrl(driveId) {
    return https://drive.google.com/uc?id=&export=download;
}

let sectionsCompleted = [];
let user = null;
let db = null;

// Ya Heard Me complete structure
const sections = [
    {
        id: 'intro',
        type: 'Introduction',
        title: 'A Wake-Up Call from One Divine Being to Another',
        summary: 'Nazir shares the foundation that started everything, the moment that changed his life, and his personal discovery process of recognizing divine communication.',
        questions: [
            'What moments in your life have served as wake-up calls to deeper truth?',
            'How do you currently recognize divine communication in your own life?',
            'What foundation of truth resonates most strongly with you right now?'
        ],
        prompts: [
            'Write about a time when you felt called to awaken to a deeper truth. What triggered that moment?',
            'Reflect on how you currently distinguish between programmed thinking and divine revelation in your own experience.'
        ]
    },
    {
        id: 'ch1',
        type: 'Chapter 1',
        title: 'The Foundation of Truth',
        summary: "Nazir's fascination with sunlight leads to divine revelations about reality, exposing moon landing deception and revealing his divine assignment through ancient wisdom.",
        questions: [
            'What aspects of mainstream reality have you questioned in your own awakening?',
            'How does sunlight or natural phenomena speak to you personally?',
            'What "deceptions" have you become aware of in your spiritual journey?'
        ],
        prompts: [
            'Write about a moment when you realized something you believed was not true. How did that revelation feel?',
            'Describe your relationship with sunlight and nature. What messages do they carry for you?'
        ]
    },
    {
        id: 'ch2',
        type: 'Chapter 2',
        title: 'The Cosmic Chess Board',
        summary: 'Understanding Hebrew creation reality, consciousness invoked into water, the sacred dome, and Enoch\'s revelation of the cosmic game board with directional navigation.',
        questions: [
            'How do you understand the relationship between consciousness and the physical world?',
            'What does "cosmic chess board" mean to you in terms of your life strategy?',
            'How aware are you of directional energies and cosmic positioning?'
        ],
        prompts: [
            'Imagine your life as a cosmic chess game. What pieces are you moving? What is your strategy?',
            'Write about the relationship between your consciousness and the reality you experience daily.'
        ]
    },
    {
        id: 'ch3',
        type: 'Chapter 3',
        title: 'How the Lord Revealed the Sun as Divine Communication',
        summary: 'Discovery of the true solar message system, daily and seasonal communications, prophetic revelation, and living by divine solar timing.',
        questions: [
            'Do you pay attention to solar cycles in your spiritual practice?',
            'How might understanding the sun as divine communication change your daily routine?',
            'What messages from nature have you been ignoring or missing?'
        ],
        prompts: [
            'Start observing the sun daily for one week. Journal what you notice and feel.',
            'Write about how seasonal changes mirror changes in your own life right now.'
        ]
    },
    {
        id: 'ch4',
        type: 'Chapter 4',
        title: 'My Awakening to Divine Creative Power',
        summary: 'Witnessing manifestation in action, speaking from creative authority, understanding temporal power, and learning about misusing spiritual abilities.',
        questions: [
            'When have you witnessed your words creating reality?',
            'How do you currently speak about your desires and intentions?',
            'What have you learned about the responsible use of creative power?'
        ],
        prompts: [
            'Write about a time when something you spoke about manifested exactly as you said. What did you learn?',
            'List 10 things you want to create. Rewrite each as if it already exists, speaking from creative authority.'
        ]
    },
    {
        id: 'ch5',
        type: 'Chapter 5',
        title: 'How the Lord Revealed Sacred Rhythm to Me',
        summary: 'Discovery of perfect timing, awakening to artificial time programming, the Enoch Calendar system, gate energies, and moon cycle mastery.',
        questions: [
            'How does artificial time (Gregorian calendar) affect your spiritual practice?',
            'What would change if you aligned with natural cosmic rhythms?',
            'How aware are you of energetic gates and optimal timing for actions?'
        ],
        prompts: [
            'Reflect on times when your timing felt perfect versus times when it felt off. What was different?',
            'Research the current moon phase. How does it relate to what\'s happening in your life?'
        ]
    },
    {
        id: 'ch6',
        type: 'Chapter 6',
        title: 'My Year Living in Divine Sacred Rhythm',
        summary: 'Personal journey through cosmic timing, spring renewal, summer expansion, autumn wisdom, and complete cycle transformation.',
        questions: [
            'What season are you in right now (energetically, not just calendar)?',
            'How might honoring natural seasons change your approach to goals?',
            'What would a complete sacred year cycle look like for you?'
        ],
        prompts: [
            'Describe the energetic season you\'re currently experiencing. What is being planted, growing, harvested, or resting?',
            'Design your ideal sacred year. What would you do in each season?'
        ]
    },
    {
        id: 'ch7',
        type: 'Chapter 7',
        title: 'My Journey Walking Divine Truth in a Programmed World',
        summary: 'Lessons about timing misalignment, divine patience, operating in the Gregorian world while staying true to sacred time, maintaining faith among skeptics.',
        questions: [
            'How do you navigate living spiritually in a materialistic world?',
            'What challenges have you faced when your timing doesn\'t match others\' expectations?',
            'How do you maintain faith when manifestations don\'t appear instantly?'
        ],
        prompts: [
            'Write about a time when you stayed true to your spiritual knowing despite external pressure.',
            'How do you balance divine timing with worldly deadlines and expectations?'
        ]
    },
    {
        id: 'ch8',
        type: 'Chapter 8',
        title: 'The Intertwining of Flesh and Spirit',
        summary: 'Understanding our dual nature, biblical examples of spirit-flesh mastery, developing spiritual senses, meditation as conscious sleep, living as a conscious bridge.',
        questions: [
            'How integrated are your spiritual and physical selves?',
            'What spiritual senses are you developing or want to develop?',
            'How comfortable are you operating in both spiritual and physical realms simultaneously?'
        ],
        prompts: [
            'Describe a moment when you felt fully integrated - spirit and flesh working as one.',
            'What spiritual senses are calling to be developed in you? How can you practice them?'
        ]
    },
    {
        id: 'ch9',
        type: 'Chapter 9',
        title: 'The Mind of Generational Wealth',
        summary: 'Understanding true wealth beyond money, shifting to generational thinking, wealth as consciousness in motion, building systems that serve others.',
        questions: [
            'How do you define wealth in your life?',
            'What legacy are you building for future generations?',
            'How can your consciousness create wealth that serves beyond yourself?'
        ],
        prompts: [
            'List all the ways you are already wealthy. Go beyond money.',
            'Write a letter to your great-great-grandchildren. What legacy are you creating for them?'
        ]
    },
    {
        id: 'conclusion',
        type: 'Conclusion',
        title: 'Integration and Next Steps',
        summary: 'Final integration of the journey and stepping into your divine assignment.',
        questions: [
            'What is your biggest takeaway from this awakening journey?',
            'How will you apply these truths in your daily life?',
            'What is your next step in your divine assignment?'
        ],
        prompts: [
            'Write a letter to yourself summarizing your journey through Ya Heard Me. What has shifted?',
            'Declare your divine assignment based on what you\'ve learned. What are you here to do?'
        ]
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('ðŸŒ… Phase 1: Awakening (Ya Heard Me) initializing...');

    await waitForFirebase();

    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (!firebaseUser) {
            console.log('â›” User not logged in - redirecting...');
            window.location.href = 'login.html?redirect=phase1-awakening.html';
            return;
        }

        user = firebaseUser;
        db = firebase.firestore();
        console.log('âœ… User authenticated:', user.email);

        await loadProgress();
        renderSections();
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

async function loadProgress() {
    console.log('ðŸ“Š Loading Phase 1 progress...');

    const progressRef = db.collection('users')
        .doc(user.uid)
        .collection('journey_progress')
        .doc('current');

    try {
        const doc = await progressRef.get();

        if (doc.exists) {
            const data = doc.data();
            sectionsCompleted = data.phase1_awakening?.sections_completed || [];
            console.log('âœ… Sections completed:', sectionsCompleted);
        } else {
            console.log('âš¡ No progress found, starting fresh');
            sectionsCompleted = [];
        }
    } catch (error) {
        console.error('âŒ Error loading progress:', error);
        sectionsCompleted = [];
    }
}

function renderSections() {
    const container = document.getElementById('sectionsContainer');

    container.innerHTML = sections.map(section => {
        const isCompleted = sectionsCompleted.includes(section.id);

        return `
            <div class="chapter-card ${isCompleted ? 'completed' : ''}" data-section="${section.id}">
                <div class="chapter-header" onclick="toggleChapter('${section.id}')">
                    <div class="chapter-number">${section.type}</div>
                    <h3 class="chapter-title">${section.title}</h3>
                    <div class="chapter-status" id="${section.id}-status">
                        ${isCompleted ? 'âœ… Complete' : 'â­• Not Started'}
                    </div>
                </div>

                <div class="chapter-content collapsed" id="${section.id}-content">
                    <div class="chapter-summary">
                        <p>${section.summary}</p>
                    </div>

                    <div class="discussion-questions">
                        <h4>ðŸ’­ Reflection Questions</h4>
                        <ol>
                            ${section.questions.map(q => `<li>${q}</li>`).join('')}
                        </ol>
                    </div>

                    <div class="journal-prompts">
                        <h4>âœï¸ Journal Prompts</h4>
                        ${section.prompts.map((prompt, index) => `
                            <div class="prompt">
                                <p><strong>Prompt ${index + 1}:</strong> ${prompt}</p>
                                <button class="journal-button" onclick="openJournal('${section.title} - Prompt ${index + 1}')">
                                    Write in Journal â†’
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="chapter-actions">
                        ${!isCompleted ? `
                            <button class="complete-button" onclick="markSectionComplete('${section.id}')">
                                âœ“ Mark Complete
                            </button>
                        ` : `
                            <button class="completed-badge">
                                âœ… Completed
                            </button>
                        `}
                    </div>
                </div>

                <button class="expand-button" onclick="toggleChapter('${section.id}')" id="${section.id}-toggle">
                    Show Details â–¼
                </button>
            </div>
        `;
    }).join('');
}

function toggleChapter(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const toggle = document.getElementById(`${sectionId}-toggle`);

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.textContent = 'Hide Details â–²';
    } else {
        content.classList.add('collapsed');
        toggle.textContent = 'Show Details â–¼';
    }
}

async function markSectionComplete(sectionId) {
    if (sectionsCompleted.includes(sectionId)) {
        showToast('Already completed!', 'info');
        return;
    }

    sectionsCompleted.push(sectionId);

    const completion = (sectionsCompleted.length / 11) * 100;
    const status = completion === 100 ? 'completed' : 'in_progress';

    const progressRef = db.collection('users')
        .doc(user.uid)
        .collection('journey_progress')
        .doc('current');

    try {
        await progressRef.set({
            'phase1_awakening': {
                sections_completed: sectionsCompleted,
                completion_percentage: completion,
                status: status,
                last_updated: new Date()
            },
            'current_phase': completion === 100 ? 2 : 1
        }, { merge: true });

        // Update UI
        document.getElementById(`${sectionId}-status`).innerHTML = 'âœ… Complete';
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('completed');

        updateProgressBar();
        showToast('Section completed! ðŸŽ‰', 'success');

        // Celebrate if all done
        if (sectionsCompleted.length === 11) {
            celebratePhaseCompletion();
        }
    } catch (error) {
        console.error('Error saving progress:', error);
        showToast('Error saving progress', 'error');
    }
}

function updateProgressBar() {
    const completion = (sectionsCompleted.length / 11) * 100;
    document.getElementById('progressPercentage').textContent = `${Math.round(completion)}%`;
    document.getElementById('progressBar').style.width = `${completion}%`;
    document.getElementById('progressText').textContent = `${sectionsCompleted.length} of 11 sections completed`;

    // Update unlock progress
    const unlockProgress = document.getElementById('unlockProgress');
    if (unlockProgress) {
        unlockProgress.textContent = `${sectionsCompleted.length}/11 sections complete`;
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
            <h2>ðŸŽ‰ Phase 1 Complete!</h2>
            <p>Congratulations! You've completed the Awakening phase of your journey.</p>
            <p><strong>Phase 2: Understanding</strong> is now unlocked!</p>
            <div class="modal-actions">
                <button onclick="window.location.href='journey.html'" class="btn-primary">
                    Return to Journey Dashboard
                </button>
                <button onclick="window.location.href='phase2-understanding.html'" class="btn-success">
                    Begin Phase 2 â†’
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openJournal(promptTitle) {
    // Redirect to journal page with pre-filled prompt
    const journalUrl = `members-new.html#journal?prompt=${encodeURIComponent(promptTitle)}`;
    window.location.href = journalUrl;
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

