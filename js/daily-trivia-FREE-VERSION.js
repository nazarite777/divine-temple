/**
 * 🎯 DAILY SPIRITUAL TRIVIA - FREE TIER VERSION
 * Limited to 30 carefully curated questions to give users a taste
 * Includes upgrade prompts and progress tracking
 * Version: 1.0 FREE
 */

class FreeTierTriviaSystem {
    constructor() {
        this.currentUser = null;
        this.triviaData = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.todaysQuestions = [];
        this.userAnswers = [];
        this.questionStartTime = null;
        this.timerInterval = null;
        this.timeRemaining = 30;
        this.debugMode = true;

        // FREE TIER: Limited Question Bank (30 questions total)
        this.questionBank = [
            // ========== CHAKRAS & ENERGY (6 questions - Basic) ==========
            {
                category: 'Chakras & Energy',
                difficulty: 'easy',
                question: 'What color is associated with the Root Chakra?',
                options: ['Red', 'Orange', 'Yellow', 'Green'],
                correct: 0,
                explanation: 'The Root Chakra (Muladhara) is associated with red, representing grounding, survival, and connection to the earth.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'easy',
                question: 'Which chakra is located at the crown of the head?',
                options: ['Third Eye', 'Throat', 'Crown', 'Heart'],
                correct: 2,
                explanation: 'The Crown Chakra (Sahasrara) is located at the top of the head and represents spiritual connection and enlightenment.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'medium',
                question: 'What is the Sanskrit name for the Heart Chakra?',
                options: ['Manipura', 'Anahata', 'Vishuddha', 'Ajna'],
                correct: 1,
                explanation: 'Anahata is the Sanskrit name for the Heart Chakra, which governs love, compassion, and emotional balance.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'medium',
                question: 'Which chakra is associated with personal power and self-esteem?',
                options: ['Root', 'Solar Plexus', 'Sacral', 'Throat'],
                correct: 1,
                explanation: 'The Solar Plexus Chakra (Manipura) governs personal power, confidence, and self-esteem.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'easy',
                question: 'What element is associated with the Throat Chakra?',
                options: ['Fire', 'Water', 'Air', 'Ether/Space'],
                correct: 3,
                explanation: 'The Throat Chakra (Vishuddha) is associated with the element of Ether or Space, representing communication and expression.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'medium',
                question: 'Which chakra is blocked when you experience fear and insecurity?',
                options: ['Root Chakra', 'Heart Chakra', 'Crown Chakra', 'Third Eye'],
                correct: 0,
                explanation: 'The Root Chakra governs feelings of safety and security. When blocked, it can manifest as fear, anxiety, and insecurity.'
            },

            // ========== TAROT & ORACLE (4 questions - Basics) ==========
            {
                category: 'Tarot & Oracle',
                difficulty: 'easy',
                question: 'How many cards are in a traditional Tarot deck?',
                options: ['52', '64', '78', '88'],
                correct: 2,
                explanation: 'A traditional Tarot deck contains 78 cards: 22 Major Arcana and 56 Minor Arcana cards.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'easy',
                question: 'Which card represents new beginnings in Tarot?',
                options: ['The Fool', 'The Magician', 'The World', 'The Star'],
                correct: 0,
                explanation: 'The Fool (numbered 0) represents new beginnings, innocence, and taking a leap of faith into the unknown.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'medium',
                question: 'What does the Death card typically symbolize in Tarot?',
                options: ['Literal death', 'Transformation', 'Bad luck', 'Illness'],
                correct: 1,
                explanation: 'The Death card rarely means literal death; it symbolizes transformation, endings, and new beginnings.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'medium',
                question: 'Which suit represents the element of Water?',
                options: ['Wands', 'Cups', 'Swords', 'Pentacles'],
                correct: 1,
                explanation: 'Cups represent the element of Water and govern emotions, relationships, intuition, and creativity.'
            },

            // ========== CRYSTALS & GEMSTONES (3 questions - Basics) ==========
            {
                category: 'Crystals & Gemstones',
                difficulty: 'easy',
                question: 'Which crystal is known as the "master healer"?',
                options: ['Amethyst', 'Rose Quartz', 'Clear Quartz', 'Citrine'],
                correct: 2,
                explanation: 'Clear Quartz is called the "master healer" because it amplifies energy and can be programmed for any intention.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'easy',
                question: 'Which crystal is associated with love and the heart chakra?',
                options: ['Amethyst', 'Rose Quartz', 'Citrine', 'Black Tourmaline'],
                correct: 1,
                explanation: 'Rose Quartz is the crystal of unconditional love, compassion, and emotional healing.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'easy',
                question: 'Which crystal is associated with abundance and prosperity?',
                options: ['Citrine', 'Turquoise', 'Jade', 'Carnelian'],
                correct: 0,
                explanation: 'Citrine is known as the "merchant\'s stone" and is associated with abundance, prosperity, and success.'
            },

            // ========== MEDITATION & MINDFULNESS (4 questions - Basics) ==========
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'easy',
                question: 'What is the practice of focusing on the present moment called?',
                options: ['Mindfulness', 'Visualization', 'Affirmation', 'Channeling'],
                correct: 0,
                explanation: 'Mindfulness is the practice of bringing one\'s attention to the present moment with acceptance and without judgment.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'medium',
                question: 'In Buddhism, what is "samadhi"?',
                options: ['Suffering', 'Meditation', 'Deep concentration', 'Enlightenment'],
                correct: 2,
                explanation: 'Samadhi is a state of deep concentration and meditative consciousness in Buddhist practice.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'easy',
                question: 'What is the recommended minimum time for daily meditation practice?',
                options: ['1 minute', '5 minutes', '30 minutes', '1 hour'],
                correct: 1,
                explanation: 'While any meditation is beneficial, 5-10 minutes daily is a good starting point for beginners to build consistency.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'medium',
                question: 'Which meditation technique involves repeating a word or phrase?',
                options: ['Body scan', 'Mantra meditation', 'Walking meditation', 'Zen meditation'],
                correct: 1,
                explanation: 'Mantra meditation involves repeating a sacred word, phrase, or sound to focus the mind and elevate consciousness.'
            },

            // ========== MANTRAS & SOUND (3 questions - Basics) ==========
            {
                category: 'Mantras & Sound',
                difficulty: 'easy',
                question: 'What is the most commonly chanted mantra?',
                options: ['So Hum', 'Om', 'Om Mani Padme Hum', 'Gayatri'],
                correct: 1,
                explanation: 'Om (Aum) is the most universal and commonly chanted mantra, representing the primordial sound of creation.'
            },
            {
                category: 'Mantras & Sound',
                difficulty: 'medium',
                question: 'What frequency is known as the "Love Frequency"?',
                options: ['432 Hz', '528 Hz', '639 Hz', '741 Hz'],
                correct: 1,
                explanation: '528 Hz is known as the "Love Frequency" or "Miracle Tone" and is associated with DNA repair and transformation.'
            },
            {
                category: 'Mantras & Sound',
                difficulty: 'easy',
                question: 'What does "mantra" mean in Sanskrit?',
                options: ['Song', 'Prayer', 'Mind tool', 'Meditation'],
                correct: 2,
                explanation: 'Mantra comes from "man" (mind) and "tra" (tool/instrument), meaning a tool to focus and elevate the mind.'
            },

            // ========== BIBLICAL TRUTH & ETYMOLOGY (10 questions - Mix of difficulty) ==========
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'easy',
                question: 'What does "Christ" actually mean?',
                options: [
                    'Jesus\' last name',
                    'A title meaning "anointed one" or "awakened consciousness"',
                    'The name of a deity',
                    'A Greek god'
                ],
                correct: 1,
                explanation: 'Christ comes from the Greek "Christos", translating the Hebrew "Mashiach" (Messiah), meaning "anointed one".'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'medium',
                question: 'What is the original Hebrew name of the person called "Jesus"?',
                options: ['Jesu', 'Iesous', 'Yeshua', 'Joshua'],
                correct: 2,
                explanation: 'His name was Yeshua (יֵשׁוּעַ) in Hebrew, meaning "Yah saves" or "Salvation of Yah".'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'medium',
                question: 'What does "Emmanuel/Immanuel" mean in Hebrew?',
                options: ['King of Kings', 'God with us', 'Messiah', 'Savior'],
                correct: 1,
                explanation: 'Emmanuel/Immanuel (עִמָּנוּאֵל) means "God with us" or "El with us" in Hebrew.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'medium',
                question: 'What does "Yah" (as in Hallelu-Yah) mean?',
                options: [
                    'It means praise',
                    'It is the shortened sacred name of the Divine (from YHWH)',
                    'It means joy',
                    'It is a random syllable'
                ],
                correct: 1,
                explanation: 'Yah (יָהּ) is the shortened form of YHWH - the sacred name of the Divine. "HalleluYah" means "Praise Yah".'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'easy',
                question: 'What language did Yeshua (Jesus) speak?',
                options: ['English', 'Greek', 'Aramaic and Hebrew', 'Latin'],
                correct: 2,
                explanation: 'Yeshua spoke Aramaic (the common language) and Hebrew (the sacred language of scripture and temple).'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'medium',
                question: 'What does "Israel" mean in Hebrew?',
                options: [
                    'The Jewish people',
                    'One who struggles/wrestles with God (Divine)',
                    'The promised land',
                    'A country in the Middle East'
                ],
                correct: 1,
                explanation: 'Israel means "one who struggles with the Divine" - representing anyone who wrestles with divine truth.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'hard',
                question: 'What is the significance of "El" in Hebrew names like Micha-El, Gabri-El?',
                options: [
                    'It means "angel"',
                    'It means "God" or "The Divine" - showing direct connection to Source',
                    'It is a random suffix',
                    'It means "servant"'
                ],
                correct: 1,
                explanation: '"El" is the ancient Hebrew name for God, showing divine connection when attached to names.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'medium',
                question: 'What is the significance of the number 7 in Hebrew cosmology?',
                options: [
                    'It is lucky',
                    'It represents completion, wholeness, and divine perfection (Shabbat on 7th day)',
                    'It is a random number',
                    'It represents evil'
                ],
                correct: 1,
                explanation: 'Seven represents divine completion and perfection - Creation took 7 days with Shabbat as the 7th.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'hard',
                question: 'What is the Hebrew word for "spirit" and what does it reveal?',
                options: [
                    'Nephesh - soul/life force',
                    'Ruach - wind/breath/spirit (feminine gender)',
                    'Neshama - divine soul',
                    'Kavod - glory'
                ],
                correct: 1,
                explanation: 'Ruach is feminine in Hebrew, revealing that the Holy Spirit carries divine feminine energy.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'medium',
                question: 'What is the Hebrew concept of "Shekinah"?',
                options: [
                    'An angel',
                    'The feminine presence/dwelling of the Divine (God\'s presence on Earth)',
                    'A temple',
                    'A type of sacrifice'
                ],
                correct: 1,
                explanation: 'Shekinah represents the Divine Feminine, the immanent presence of God dwelling among humanity.'
            }
        ];

        // FREE TIER: Total of 30 questions
        console.log(`🎯 FREE TIER: Loaded ${this.questionBank.length} questions`);

        this.init();
    }

    // ==================== INITIALIZATION ====================

    async init() {
        this.log('🎯 FREE Tier Trivia System initializing...');

        try {
            // Update progress indicator
            this.updateProgressIndicator();

            // Wait for Firebase
            await this.waitForSystems();

            // Listen for auth changes
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = user;
                    await this.loadTriviaData();
                    await this.checkTodayStatus();
                } else {
                    window.location.href = '../login.html';
                }
            });
        } catch (error) {
            this.error('Initialization failed', error);
        }
    }

    async waitForSystems() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (typeof firebase !== 'undefined' && firebase.auth) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }

    log(message, data = null) {
        if (this.debugMode) {
            console.log(`[FreeTierTrivia] ${message}`, data || '');
        }
    }

    error(message, err = null) {
        console.error(`[FreeTierTrivia ERROR] ${message}`, err || '');
    }

    // ==================== FREE TIER SPECIFIC ====================

    updateProgressIndicator() {
        // Update the question progress indicator (X/30)
        const questionsCompleted = localStorage.getItem('freeQuestionsCompleted') || 0;
        const progressElement = document.getElementById('questionsCompleted');
        const progressFill = document.getElementById('questionProgressFill');

        if (progressElement) {
            progressElement.textContent = questionsCompleted;
        }

        if (progressFill) {
            const percentage = (parseInt(questionsCompleted) / 30) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    incrementQuestionsCompleted() {
        const current = parseInt(localStorage.getItem('freeQuestionsCompleted') || 0);
        const updated = Math.min(current + 1, 30);
        localStorage.setItem('freeQuestionsCompleted', updated);
        this.updateProgressIndicator();
    }

    // ==================== DATA MANAGEMENT ====================

    async loadTriviaData() {
        try {
            const userId = this.currentUser.uid;
            const triviaRef = firebase.firestore()
                .collection('users')
                .doc(userId)
                .collection('gamification')
                .doc('trivia');

            const doc = await triviaRef.get();

            if (doc.exists) {
                this.triviaData = doc.data();
                this.log('Loaded trivia data', this.triviaData);
            } else {
                // Initialize new trivia data
                this.triviaData = {
                    totalQuizzes: 0,
                    currentStreak: 0,
                    perfectScores: 0,
                    totalXPEarned: 0,
                    lastPlayedDate: null,
                    completedDates: []
                };
                await triviaRef.set(this.triviaData);
            }

            this.updateStats();
        } catch (error) {
            this.error('Failed to load trivia data', error);
        }
    }

    updateStats() {
        const stats = {
            totalQuizzes: this.triviaData?.totalQuizzes || 0,
            currentStreak: this.triviaData?.currentStreak || 0,
            perfectScores: this.triviaData?.perfectScores || 0,
            totalXPEarned: this.triviaData?.totalXPEarned || 0
        };

        document.getElementById('totalQuizzes').textContent = stats.totalQuizzes;
        document.getElementById('currentStreak').textContent = stats.currentStreak;
        document.getElementById('perfectScores').textContent = stats.perfectScores;
        document.getElementById('totalXPEarned').textContent = stats.totalXPEarned;
    }

    async checkTodayStatus() {
        const today = new Date().toDateString();
        const lastPlayed = this.triviaData?.lastPlayedDate;

        if (lastPlayed === today) {
            this.showCompletedMessage();
        } else {
            this.startNewQuiz();
        }
    }

    showCompletedMessage() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('completedMessage').style.display = 'block';
    }

    // ==================== QUIZ FLOW ====================

    startNewQuiz() {
        this.selectTodaysQuestions();
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('quizCard').style.display = 'block';
        this.showQuestion();
    }

    selectTodaysQuestions() {
        // FREE TIER: Select 3 random questions from the 30
        const shuffled = [...this.questionBank].sort(() => 0.5 - Math.random());
        this.todaysQuestions = shuffled.slice(0, 3);
        this.log('Selected today\'s questions', this.todaysQuestions);
    }

    showQuestion() {
        const question = this.todaysQuestions[this.currentQuestionIndex];

        // Update UI
        document.getElementById('questionNumber').textContent = `Question ${this.currentQuestionIndex + 1}/3`;
        document.getElementById('difficultyBadge').textContent = question.difficulty;
        document.getElementById('difficultyBadge').className = `difficulty-badge difficulty-${question.difficulty}`;
        document.getElementById('categoryBadge').textContent = question.category;
        document.getElementById('questionText').textContent = question.question;

        // Create answer options
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.innerHTML = `<span>${option}</span>`;
            btn.onclick = () => this.selectAnswer(index);
            optionsContainer.appendChild(btn);
        });

        // Reset timer
        this.startTimer();
    }

    startTimer() {
        this.timeRemaining = 30;
        this.updateTimer();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();

            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.selectAnswer(-1); // Time's up
            }
        }, 1000);
    }

    updateTimer() {
        const fill = document.getElementById('timerFill');
        const percentage = (this.timeRemaining / 30) * 100;
        fill.style.width = `${percentage}%`;

        if (this.timeRemaining <= 10) {
            fill.classList.add('warning');
        }
    }

    selectAnswer(selectedIndex) {
        clearInterval(this.timerInterval);

        const question = this.todaysQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;

        if (isCorrect) {
            this.correctAnswers++;
        }

        // Show feedback
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((btn, index) => {
            btn.classList.add('disabled');
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Show explanation
        const explanationBox = document.getElementById('explanationBox');
        document.getElementById('explanationIcon').textContent = isCorrect ? '✅' : '💡';
        document.getElementById('explanationText').textContent = question.explanation;
        explanationBox.classList.add('show');

        // Show next button
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.classList.add('show');
        nextBtn.onclick = () => this.nextQuestion();
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < 3) {
            // Reset UI
            document.getElementById('explanationBox').classList.remove('show');
            document.getElementById('nextBtn').classList.remove('show');
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    // ==================== RESULTS ====================

    async showResults() {
        // Hide quiz, show results
        document.getElementById('quizCard').style.display = 'none';
        document.getElementById('resultsCard').classList.add('show');

        // Calculate XP
        const baseXP = this.correctAnswers * 30;
        const perfectBonus = this.correctAnswers === 3 ? 50 : 0;
        const totalXP = baseXP + perfectBonus;

        // Update UI
        document.getElementById('correctCount').textContent = this.correctAnswers;
        document.getElementById('totalCount').textContent = '3';
        document.getElementById('totalXP').textContent = totalXP;

        // Results icon
        const icon = this.correctAnswers === 3 ? '🏆' : this.correctAnswers >= 2 ? '🌟' : '💪';
        document.getElementById('resultsIcon').textContent = icon;

        const title = this.correctAnswers === 3 ? 'Perfect Score!' :
                      this.correctAnswers >= 2 ? 'Great Job!' : 'Keep Learning!';
        document.getElementById('resultsTitle').textContent = title;

        // Update stats in database
        await this.updateTriviaStats(totalXP);

        // Increment questions completed counter
        this.incrementQuestionsCompleted();

        // FREE TIER: Show upgrade modal after 2 seconds
        setTimeout(() => {
            if (typeof showUpgradeModal === 'function') {
                showUpgradeModal();
            }
        }, 2000);
    }

    async updateTriviaStats(xpEarned) {
        try {
            const userId = this.currentUser.uid;
            const triviaRef = firebase.firestore()
                .collection('users')
                .doc(userId)
                .collection('gamification')
                .doc('trivia');

            const updates = {
                totalQuizzes: (this.triviaData.totalQuizzes || 0) + 1,
                totalXPEarned: (this.triviaData.totalXPEarned || 0) + xpEarned,
                lastPlayedDate: new Date().toDateString()
            };

            if (this.correctAnswers === 3) {
                updates.perfectScores = (this.triviaData.perfectScores || 0) + 1;
            }

            await triviaRef.update(updates);
            this.log('Updated trivia stats', updates);
        } catch (error) {
            this.error('Failed to update stats', error);
        }
    }

    updateLoadingMessage(message) {
        const loadingText = document.querySelector('#loadingState p');
        if (loadingText) {
            loadingText.textContent = message;
        }
    }

    showError(message, error) {
        this.error(message, error);
        alert(`Error: ${message}. Please refresh the page.`);
    }
}

// ==================== INITIALIZATION ====================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.triviaSystem = new FreeTierTriviaSystem();
    });
} else {
    window.triviaSystem = new FreeTierTriviaSystem();
}

// ==================== SOCIAL SHARING ====================

function shareResults() {
    const text = `I just scored ${window.triviaSystem?.correctAnswers || 0}/3 on Divine Temple's Daily Spiritual Trivia! 🎯✨`;
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({ title: 'Divine Temple Trivia', text, url })
            .catch(err => console.log('Share failed', err));
    } else {
        alert('Share: ' + text);
    }
}
