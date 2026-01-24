/**
 * 🌟 DIVINE TEMPLE - FREE DAILY TRIVIA SYSTEM
 * Deprogramming Edition: 30 Thought-Provoking Questions
 * Designed to awaken consciousness and lead users to premium membership
 */

class DailyTriviaFreeEdition {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.totalXP = 0;
        this.questionsAnswered = 0;
        this.maxFreeQuestions = 30;
        this.audioSystem = null;
        
        // User Progress Data
        this.userProgress = {
            completedToday: false,
            questionsCompleted: 0,
            perfectScores: 0,
            totalQuizzes: 0,
            currentStreak: 0,
            lastPlayed: null,
            totalXP: 0
        };

        // 30 Consciousness-Awakening Questions
        this.deprogrammingQuestions = [
            {
                id: 1,
                category: "Biblical Truth",
                question: "What is the difference between 'Jesus Christ' and 'Christ Jesus' in biblical context?",
                options: [
                    "They are exactly the same person",
                    "Jesus Christ = man who became divine, Christ Jesus = divine consciousness in man", 
                    "One is Greek, one is Hebrew",
                    "There is no difference"
                ],
                correct: 1,
                explanation: "'Jesus Christ' refers to the man Yeshua who embodied the Christ consciousness. 'Christ Jesus' refers to the divine Christ consciousness that can dwell within any awakened soul. This distinction reveals the path of inner divinity available to all.",
                xpReward: 25
            },
            {
                id: 2,
                category: "Sacred Lineage", 
                question: "Why is Joseph described as a 'righteous man' in Matthew 1:19?",
                options: [
                    "He was wealthy and successful",
                    "He was religiously observant",
                    "He chose love over law when Mary was found with child",
                    "He was chosen by God randomly"
                ],
                correct: 2,
                explanation: "Joseph's righteousness was demonstrated when he chose compassion over condemnation. Rather than expose Mary to shame or stoning (as the law permitted), he planned to divorce her quietly. This shows true spiritual righteousness - love transcending religious law.",
                xpReward: 25
            },
            {
                id: 3,
                category: "Divine Feminine",
                question: "What does the Virgin Mary truly represent in spiritual consciousness?",
                options: [
                    "A historical woman only",
                    "The divine feminine principle that births Christ consciousness",
                    "A religious figure to worship",
                    "A symbol of purity only"
                ],
                correct: 1,
                explanation: "The Virgin Mary represents the pure divine feminine consciousness within every soul - the spiritual womb that can conceive and birth the Christ consciousness. This is why she is called 'blessed among women' - she represents humanity's capacity for divine conception.",
                xpReward: 30
            },
            {
                id: 4,
                category: "Sacred Calendar",
                question: "What is the true purpose of the sun, moon, and stars according to the Book of Enoch?",
                options: [
                    "To provide light and heat only",
                    "To be worshipped as gods",
                    "To serve as signs for sacred times and divine order",
                    "To guide navigation only"
                ],
                correct: 2,
                explanation: "The Book of Enoch reveals that the luminaries serve as divine timepieces, marking sacred seasons, festivals, and spiritual cycles. They maintain cosmic order and help us align with divine timing - not for worship, but as tools for spiritual synchronization.",
                xpReward: 35
            },
            {
                id: 5,
                category: "Spiritual Truth",
                question: "What is the fundamental difference between religion and spirituality?",
                options: [
                    "Religion is organized, spirituality is personal",
                    "Religion controls through fear, spirituality liberates through love",
                    "Religion focuses on external rules, spirituality on inner transformation", 
                    "All of the above"
                ],
                correct: 3,
                explanation: "Religion often becomes a system of external control through dogma and fear. True spirituality is the inner journey of divine connection, personal transformation, and liberation of consciousness. While religion can point the way, spirituality is the actual walking of the path.",
                xpReward: 20
            },
            {
                id: 6,
                category: "Hidden History",
                question: "Why were the Books of Enoch removed from the biblical canon?",
                options: [
                    "They contained too much scientific knowledge",
                    "They revealed humanity's divine nature and angelic origins",
                    "They were written too late",
                    "They contradicted church authority"
                ],
                correct: 1,
                explanation: "The Books of Enoch contained advanced astronomical knowledge, revealed humanity's divine heritage, and described direct divine communication available to all. This threatened religious hierarchy by showing that every soul has direct access to divine wisdom without intermediaries.",
                xpReward: 40
            },
            {
                id: 7,
                category: "Divine Names",
                question: "What does the name 'Yeshua' actually mean, and why is it significant?",
                options: [
                    "Son of God",
                    "YHWH saves/YHWH is salvation",
                    "Anointed one",
                    "Prince of Peace"
                ],
                correct: 1,
                explanation: "'Yeshua' means 'YHWH is salvation' - revealing that salvation comes from the divine name/consciousness itself, not from external saviors. This points to the indwelling divine presence as our true source of liberation and awakening.",
                xpReward: 30
            },
            {
                id: 8,
                category: "Cosmic Order",
                question: "What is intercalation in the Enochian calendar system?",
                options: [
                    "Adding extra days to align with solar cycles",
                    "Removing days for accuracy",
                    "Changing the month order",
                    "A ritual purification"
                ],
                correct: 0,
                explanation: "Intercalation in the Enochian calendar involves adding specific days to maintain perfect alignment with the solar year (364 days + intercalation = 365.25). This maintains the sacred rhythm of weeks and ensures festivals fall on their proper days, preserving divine timing.",
                xpReward: 35
            },
            {
                id: 9,
                category: "Consciousness",
                question: "What does 'Christ consciousness' actually represent?",
                options: [
                    "Believing in Jesus as savior",
                    "The awakened divine mind available to all humanity",
                    "A religious experience only",
                    "Salvation after death"
                ],
                correct: 1,
                explanation: "Christ consciousness is the awakened state of divine awareness that Yeshua demonstrated - unity with Source, unconditional love, and recognition of our divine nature. This consciousness is the birthright of every soul, not exclusive to one individual.",
                xpReward: 25
            },
            {
                id: 10,
                category: "Sacred Geometry",
                question: "Why do ancient temples worldwide share similar geometric proportions?",
                options: [
                    "Coincidence",
                    "Cultural exchange",
                    "They were built using universal divine blueprints",
                    "Practical construction needs"
                ],
                correct: 2,
                explanation: "Ancient sacred sites follow universal geometric principles encoded in creation itself - the golden ratio, sacred squares, and celestial alignments. These weren't human inventions but divine blueprints revealed to awakened consciousness across all cultures.",
                xpReward: 30
            },
            {
                id: 11,
                category: "Divine Authority",
                question: "What does it mean that humans are created 'in the image of God'?",
                options: [
                    "We look like God physically",
                    "We have divine creative consciousness and authority",
                    "We are God's favorite creation",
                    "We have souls"
                ],
                correct: 1,
                explanation: "Being made 'in God's image' means we possess divine creative consciousness - the ability to create reality through thought, word, and intention. We are co-creators with divine authority over our experience, not powerless subjects needing salvation.",
                xpReward: 35
            },
            {
                id: 12,
                category: "Hidden Wisdom",
                question: "Why did Yeshua teach in parables rather than direct instruction?",
                options: [
                    "To confuse people",
                    "To hide truth from the unworthy", 
                    "To activate inner knowing rather than mental understanding",
                    "Cultural tradition"
                ],
                correct: 2,
                explanation: "Parables bypass the analytical mind and speak directly to the soul's wisdom. They require inner revelation rather than external interpretation, ensuring that spiritual truth is received by consciousness ready to embody it, not just intellectually understand it.",
                xpReward: 25
            },
            {
                id: 13,
                category: "Spiritual Liberation",
                question: "What is the 'narrow gate' that Yeshua spoke of?",
                options: [
                    "A literal doorway",
                    "Church membership",
                    "The path of inner transformation and consciousness expansion",
                    "Following all religious rules"
                ],
                correct: 2,
                explanation: "The narrow gate is the challenging path of inner transformation - releasing ego, expanding consciousness, and embodying divine love. It's 'narrow' because it requires total commitment to spiritual growth, not external religious compliance.",
                xpReward: 30
            },
            {
                id: 14,
                category: "Divine Timing",
                question: "What is the significance of the 7-day week in creation and consciousness?",
                options: [
                    "It's just a convenient division",
                    "It reflects the 7 chakras and spiritual development cycles",
                    "God needed rest",
                    "Ancient tradition only"
                ],
                correct: 1,
                explanation: "The 7-day cycle reflects the seven centers of consciousness (chakras), the seven levels of spiritual development, and the natural rhythms of creation itself. Each day represents a stage of consciousness evolution and energy activation.",
                xpReward: 35
            },
            {
                id: 15,
                category: "Truth vs Doctrine",
                question: "What is the difference between the 'letter of the law' and the 'spirit of the law'?",
                options: [
                    "Written vs spoken instructions",
                    "External compliance vs inner transformation and divine love",
                    "Old vs New Testament",
                    "Human vs divine law"
                ],
                correct: 1,
                explanation: "The letter kills, but the spirit gives life. External rule-following without inner transformation is spiritual death. The spirit of divine law is love, compassion, and consciousness expansion - the intent behind all true spiritual guidance.",
                xpReward: 25
            },
            {
                id: 16,
                category: "Cosmic Truth",
                question: "What does 'As above, so below' really mean?",
                options: [
                    "Heaven and earth are the same",
                    "Celestial patterns reflect in earthly manifestation and consciousness",
                    "Angels live among us",
                    "Everything is predetermined"
                ],
                correct: 1,
                explanation: "This hermetic principle reveals that cosmic patterns, divine laws, and celestial movements are reflected in human consciousness and earthly experience. Understanding heavenly principles allows us to navigate and create in the material realm.",
                xpReward: 30
            },
            {
                id: 17,
                category: "Inner Divinity",
                question: "What did Yeshua mean by 'the Kingdom of Heaven is within you'?",
                options: [
                    "Heaven is a state of mind",
                    "Divine consciousness and creative power dwell within every soul",
                    "We don't need to die to experience paradise",
                    "All of the above"
                ],
                correct: 3,
                explanation: "The Kingdom of Heaven within is the divine consciousness, creative power, and direct connection to Source that exists in every awakened soul. It's not a future destination but a present reality accessible through inner transformation.",
                xpReward: 35
            },
            {
                id: 18,
                category: "Sacred Numbers",
                question: "Why is the number 144,000 significant in Revelation?",
                options: [
                    "It's a literal count of saved people",
                    "It represents the awakened souls who anchor divine consciousness on Earth",
                    "It's symbolic of completion (12x12x1000)",
                    "Both B and C"
                ],
                correct: 3,
                explanation: "144,000 represents the complete number (12x12x1000) of awakened souls who embody divine consciousness and serve as anchors for planetary awakening. It's both symbolic completeness and the critical mass needed for consciousness shift.",
                xpReward: 40
            },
            {
                id: 19,
                category: "Divine Feminine",
                question: "What is the role of Sophia (Divine Wisdom) in creation?",
                options: [
                    "She is God's wife",
                    "She represents the divine feminine creative principle and wisdom",
                    "She's a mythological figure",
                    "She's the Holy Spirit"
                ],
                correct: 1,
                explanation: "Sophia represents the divine feminine wisdom that co-creates with the masculine divine principle. She is the wisdom aspect of God that brings divine ideas into manifestation through love, beauty, and sacred order.",
                xpReward: 35
            },
            {
                id: 20,
                category: "Spiritual Authority",
                question: "What does 'Judge not, lest ye be judged' truly teach us?",
                options: [
                    "Never have opinions",
                    "Don't criticize others",
                    "What we judge in others reflects our own consciousness and creates our experience",
                    "Be passive about everything"
                ],
                correct: 2,
                explanation: "This isn't about being passive but understanding that judgment creates separation and returns to us. When we judge others, we're revealing our own consciousness level and attracting similar judgment. Discernment without condemnation is wisdom.",
                xpReward: 25
            },
            {
                id: 21,
                category: "Awakening Process",
                question: "What is meant by being 'born again' spiritually?",
                options: [
                    "Physical reincarnation",
                    "Religious conversion",
                    "Consciousness awakening to divine identity and spiritual reality",
                    "Baptism ceremony"
                ],
                correct: 2,
                explanation: "Spiritual rebirth is the awakening of consciousness from ego-identification to divine identity. It's the recognition of our true nature as spiritual beings having a human experience, not the reverse. This shifts our entire reality perception.",
                xpReward: 30
            },
            {
                id: 22,
                category: "Divine Love",
                question: "What is unconditional love versus emotional attachment?",
                options: [
                    "They are the same thing",
                    "Unconditional love seeks the highest good without attachment to outcomes",
                    "Attachment is stronger",
                    "Love requires conditions"
                ],
                correct: 1,
                explanation: "Unconditional love seeks the soul's highest evolution without personal agenda or attachment to how love is received. Emotional attachment seeks personal satisfaction and creates suffering when expectations aren't met. Divine love liberates, attachment binds.",
                xpReward: 25
            },
            {
                id: 23,
                category: "Energy Mastery",
                question: "What is the relationship between thought, emotion, and manifestation?",
                options: [
                    "They are unrelated",
                    "Thought directs, emotion energizes, manifestation follows",
                    "Only action matters",
                    "Manifestation is random"
                ],
                correct: 1,
                explanation: "Thought provides direction and focus, emotion provides the energetic charge, and manifestation follows this energized intention. This is the divine creative process we inherit as beings made 'in God's image' - we create through consciousness.",
                xpReward: 35
            },
            {
                id: 24,
                category: "Sacred Symbols",
                question: "What does the cross symbolize beyond Christian crucifixion?",
                options: [
                    "Suffering only",
                    "The intersection of heaven and earth, spirit and matter",
                    "A torture device",
                    "Christian identity"
                ],
                correct: 1,
                explanation: "The cross is an ancient symbol representing the intersection of divine and human, vertical (spiritual) and horizontal (material) dimensions. It symbolizes the integration of heaven and earth consciousness within the awakened human being.",
                xpReward: 30
            },
            {
                id: 25,
                category: "Truth Revelation",
                question: "What does 'seek and ye shall find' teach about spiritual discovery?",
                options: [
                    "Keep looking externally",
                    "Sincere spiritual seeking activates inner revelation and divine guidance",
                    "Search religious texts",
                    "Ask others for answers"
                ],
                correct: 1,
                explanation: "Sincere spiritual seeking aligns us with divine consciousness and activates inner guidance. Truth isn't found externally but revealed through our connection to divine wisdom. The seeking itself transforms us to receive what we seek.",
                xpReward: 25
            },
            {
                id: 26,
                category: "Divine Purpose",
                question: "What is humanity's true purpose according to divine design?",
                options: [
                    "To suffer and be saved",
                    "To embody divine consciousness and co-create Heaven on Earth",
                    "To worship and serve",
                    "To be tested and judged"
                ],
                correct: 1,
                explanation: "Humanity's purpose is to embody divine consciousness in physical form and co-create Heaven on Earth - manifesting divine love, wisdom, and creative power through awakened human expression. We are divine consciousness experiencing itself in form.",
                xpReward: 40
            },
            {
                id: 27,
                category: "Spiritual Freedom",
                question: "What is the difference between salvation and liberation?",
                options: [
                    "They are identical",
                    "Salvation implies rescue from outside, liberation is awakening to inherent divinity",
                    "Liberation is temporary",
                    "Salvation is better"
                ],
                correct: 1,
                explanation: "Salvation implies being rescued from sin by an external savior. Liberation is awakening to our inherent divine nature and freedom - recognizing we were never separate from Source and don't need external rescue, only remembrance of our true identity.",
                xpReward: 35
            },
            {
                id: 28,
                category: "Divine Communication",
                question: "How does divine guidance typically communicate with awakened consciousness?",
                options: [
                    "Through religious authority only",
                    "Through inner knowing, synchronicity, and intuitive revelation",
                    "Through fear and punishment",
                    "Through external voices only"
                ],
                correct: 1,
                explanation: "Divine guidance speaks through inner knowing, synchronistic events, intuitive insights, and direct revelation to awakened consciousness. It doesn't come through fear or external authority but through love, peace, and expanded awareness.",
                xpReward: 30
            },
            {
                id: 29,
                category: "Consciousness Evolution",
                question: "What is the Great Awakening happening in our time?",
                options: [
                    "A religious revival",
                    "Mass awakening to divine consciousness and spiritual truth",
                    "Political change",
                    "Technological advancement"
                ],
                correct: 1,
                explanation: "The Great Awakening is the planetary shift where humanity remembers its divine nature, recognizes spiritual truth beyond religious dogma, and awakens to co-creative power. It's consciousness evolution from separation to unity awareness.",
                xpReward: 40
            },
            {
                id: 30,
                category: "Divine Identity",
                question: "What is the ultimate spiritual truth about human identity?",
                options: [
                    "We are sinful beings needing salvation",
                    "We are spiritual beings temporarily having a human experience",
                    "We are divine consciousness expressing through human form",
                    "Both B and C"
                ],
                correct: 3,
                explanation: "The ultimate truth is that we ARE divine consciousness expressing through human form - not separate from Source but individualized expressions of the One Divine. We are spiritual beings having human experiences to evolve consciousness and embody divinity in form.",
                xpReward: 50
            }
        ];

        this.init();
    }

    async init() {
        console.log('🌟 Initializing Free Daily Trivia System');
        
        try {
            // Initialize audio system
            if (window.TriviaAudioSystem) {
                this.audioSystem = new TriviaAudioSystem();
                await this.audioSystem.initialize();
            }
            
            // Load user progress
            this.loadProgress();
            
            // Update UI
            this.updateStatsDisplay();
            this.updateQuestionProgress();
            
            // Check if already completed today
            if (this.checkIfCompletedToday()) {
                this.showCompletedMessage();
                return;
            }
            
            // Start trivia
            this.startTrivia();
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize trivia system');
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('divineTemple_freeTrivia');
            if (saved) {
                this.userProgress = { ...this.userProgress, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('divineTemple_freeTrivia', JSON.stringify(this.userProgress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    checkIfCompletedToday() {
        const today = new Date().toDateString();
        return this.userProgress.lastPlayed === today && this.userProgress.completedToday;
    }

    startTrivia() {
        // Shuffle questions for variety
        this.shuffleArray(this.deprogrammingQuestions);
        
        // Reset session
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questionsAnswered = 0;
        
        // Hide loading, show quiz
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('quizCard').style.display = 'block';
        
        this.loadCurrentQuestion();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    loadCurrentQuestion() {
        if (this.questionsAnswered >= this.maxFreeQuestions) {
            this.completeTrivia();
            return;
        }

        const question = this.deprogrammingQuestions[this.currentQuestionIndex];
        
        // Update quiz card content
        document.getElementById('quizCard').innerHTML = `
            <div class="question-header">
                <div class="question-number">
                    Question ${this.questionsAnswered + 1} of ${this.maxFreeQuestions}
                </div>
                <div class="question-category" style="background: linear-gradient(135deg, var(--primary-gold), var(--accent-purple));">
                    ${question.category}
                </div>
            </div>

            <div class="question-content">
                <h2 class="question-text">${question.question}</h2>
                
                <div class="options-container">
                    ${question.options.map((option, index) => `
                        <button class="option-btn" onclick="triviaSystem.selectAnswer(${index})" data-index="${index}">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `).join('')}
                </div>
                
                <div class="question-footer">
                    <div class="xp-reward">🌟 ${question.xpReward} XP</div>
                    <div class="progress-indicator">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((this.questionsAnswered + 1) / this.maxFreeQuestions) * 100}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="question-explanation" id="explanationSection" style="display: none;">
                <div class="explanation-content">
                    <div class="explanation-icon" id="explanationIcon">💡</div>
                    <h4>Deeper Understanding</h4>
                    <p id="explanationText">${question.explanation}</p>
                    <div class="explanation-footer">
                        <div class="xp-gained" id="xpGained"></div>
                        <button class="next-btn" onclick="triviaSystem.nextQuestion()">
                            ${this.questionsAnswered + 1 >= this.maxFreeQuestions ? 'Complete Trivia ✨' : 'Next Question →'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add question styles
        this.addQuestionStyles();
        
        // Play question sound
        if (this.audioSystem) {
            this.audioSystem.playQuestionSound();
        }
    }

    addQuestionStyles() {
        if (document.getElementById('triviaQuestionStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'triviaQuestionStyles';
        styles.textContent = `
            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .question-number {
                font-size: 0.9rem;
                color: var(--text-secondary);
                background: var(--glass-bg);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                border: 1px solid var(--glass-border);
            }

            .question-category {
                padding: 0.5rem 1.2rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                color: white;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .question-content h2 {
                font-family: 'Playfair Display', serif;
                font-size: 1.5rem;
                line-height: 1.4;
                margin-bottom: 2rem;
                color: var(--text-primary);
            }

            .options-container {
                display: grid;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .option-btn {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.2rem;
                background: var(--glass-bg);
                border: 2px solid var(--glass-border);
                border-radius: 15px;
                color: var(--text-primary);
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            }

            .option-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: var(--primary-gold);
                transform: translateY(-2px);
            }

            .option-letter {
                background: linear-gradient(135deg, var(--primary-gold), var(--accent-purple));
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.9rem;
                flex-shrink: 0;
            }

            .option-text {
                flex: 1;
                line-height: 1.4;
            }

            .option-btn.correct {
                background: rgba(16, 185, 129, 0.2);
                border-color: #10B981;
                color: #10B981;
            }

            .option-btn.incorrect {
                background: rgba(239, 68, 68, 0.2);
                border-color: #EF4444;
                color: #EF4444;
            }

            .option-btn.disabled {
                pointer-events: none;
                opacity: 0.6;
            }

            .question-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1.5rem;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .xp-reward {
                background: linear-gradient(135deg, var(--accent-purple), var(--primary-gold));
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .progress-indicator {
                flex: 1;
                max-width: 200px;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-gold), var(--accent-purple));
                border-radius: 10px;
                transition: width 0.5s ease;
            }

            .question-explanation {
                background: rgba(139, 92, 246, 0.1);
                border: 2px solid var(--accent-purple);
                border-radius: 20px;
                padding: 2rem;
                margin-top: 2rem;
                animation: slideUp 0.5s ease;
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .explanation-content h4 {
                color: var(--primary-gold);
                margin: 0.5rem 0 1rem 0;
                font-size: 1.2rem;
            }

            .explanation-icon {
                font-size: 3rem;
                text-align: center;
                margin-bottom: 1rem;
            }

            .explanation-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1.5rem;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .xp-gained {
                color: var(--primary-gold);
                font-weight: 600;
                font-size: 1.1rem;
            }

            .next-btn {
                background: linear-gradient(135deg, var(--primary-gold), var(--accent-purple));
                color: white;
                padding: 0.75rem 2rem;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .next-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
            }

            @media (max-width: 768px) {
                .question-content h2 {
                    font-size: 1.2rem;
                }
                
                .option-btn {
                    padding: 1rem;
                }
                
                .question-footer,
                .explanation-footer {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    selectAnswer(selectedIndex) {
        const question = this.deprogrammingQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Update score
        if (isCorrect) {
            this.score++;
            this.totalXP += question.xpReward;
        }
        
        // Visual feedback
        const options = document.querySelectorAll('.option-btn');
        options.forEach((btn, index) => {
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
