/**
 * 🎯 ENHANCED DAILY SPIRITUAL TRIVIA SYSTEM
 * Interactive trivia game with immersive audio and reliable memory persistence
 * Version 3.0 - Audio-enhanced with improved data management
 * 
 * New Features:
 * - Immersive sound effects and background music
 * - Enhanced memory persistence with better error handling
 * - Audio controls with persistent settings
 * - Improved visual feedback and animations
 */

class EnhancedDailyTriviaSystem {
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

        // Audio system
        this.audioSystem = null;

        // Question Database - Freemium Edition (30 High-Quality Questions)
        this.questionBank = [
            // ========== CHAKRAS & ENERGY (6 questions) ==========
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
                difficulty: 'hard',
                question: 'How many main nadis (energy channels) are there in the subtle body according to yogic tradition?',
                options: ['7', '72', '108', '72,000'],
                correct: 3,
                explanation: 'According to yogic tradition, there are 72,000 nadis (energy channels) in the subtle body, with Ida, Pingala, and Sushumna being the three main ones.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'medium',
                question: 'Which chakra is blocked when you experience fear and insecurity?',
                options: ['Root Chakra', 'Heart Chakra', 'Crown Chakra', 'Third Eye'],
                correct: 0,
                explanation: 'The Root Chakra governs feelings of safety and security. When blocked, it can manifest as fear, anxiety, and insecurity.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'hard',
                question: 'What is the bija (seed) mantra for the Third Eye Chakra?',
                options: ['LAM', 'VAM', 'RAM', 'OM'],
                correct: 3,
                explanation: 'OM (or AUM) is the bija mantra for the Third Eye Chakra (Ajna), representing cosmic consciousness and intuition.'
            },

            // ========== TAROT & ORACLE (3 questions) ==========
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

            // ========== CRYSTALS & GEMSTONES (3 questions) ==========
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

            // ========== MEDITATION & MINDFULNESS (3 questions) ==========
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
                difficulty: 'medium',
                question: 'Which meditation technique involves repeating a word or phrase?',
                options: ['Body scan', 'Mantra meditation', 'Walking meditation', 'Zen meditation'],
                correct: 1,
                explanation: 'Mantra meditation involves repeating a sacred word, phrase, or sound to focus the mind and elevate consciousness.'
            },

            // ========== MANTRAS & SOUND (3 questions) ==========
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

            // ========== BIBLICAL TRUTH & ETYMOLOGY (12 questions) ==========
            // Deep teachings on mistranslations, etymology, and hidden truths
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
                explanation: 'Christ comes from the Greek "Christos" (Χριστός), translating the Hebrew "Mashiach" (Messiah), meaning "anointed one". It is a title, not a name - referring to one who has been anointed with divine purpose and awakened consciousness. The Christ is the divine consciousness that can dwell in any vessel aligned with divine will.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'hard',
                question: 'What is the original Hebrew name of the person called "Jesus"?',
                options: ['Jesu', 'Iesous', 'Yeshua', 'Joshua'],
                correct: 2,
                explanation: 'His name was Yeshua (יֵשׁוּעַ) in Hebrew, meaning "Yah saves" or "Salvation of Yah". "Jesus" comes from the Greek "Iesous" (Ἰησοῦς), which was later Latinized to "Iesus" and eventually became "Jesus" in English. The name carries the divine name "Yah" within it, showing his purpose as a vessel of divine salvation.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'hard',
                question: 'Why is the "Virgin Mary" doctrine problematic from a Hebrew perspective?',
                options: [
                    'Mary was not a virgin',
                    'The word "virgin" does not exist in Hebrew - the original word "almah" means "young woman"',
                    'It contradicts Roman Catholic teachings',
                    'There is no problem with it'
                ],
                correct: 1,
                explanation: 'The Hebrew word in Isaiah 7:14 is "almah" (עַלְמָה) meaning "young woman" or "maiden" - NOT "betulah" (בְּתוּלָה) which specifically means virgin. Greek translators used "parthenos" (virgin), creating a theological doctrine from a mistranslation. The prophecy was about a young woman giving birth, not a miraculous virgin birth.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'medium',
                question: 'Why is understanding Greek vs Hebrew important in biblical interpretation?',
                options: [
                    'Greek is more accurate than Hebrew',
                    'Hebrew carries the original cultural and linguistic context; Greek translations can introduce theological biases',
                    'Hebrew is the only language God understands',
                    'It is not important'
                ],
                correct: 1,
                explanation: 'The Hebrew scriptures (Tanakh/Old Testament) contain the original context, idioms, and cultural meanings. When translated to Greek (Septuagint), then Latin (Vulgate), then English, layers of interpretation and theological bias were added. Understanding Hebrew etymology reveals the original intent, such as "almah" vs "virgin", "Yeshua" vs "Jesus", and countless other examples where meaning was altered to fit doctrinal narratives.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'hard',
                question: 'What is the significance of "El" in Hebrew names like Nazir El, Micha-El, Gabri-El?',
                options: [
                    'It means "angel"',
                    'It means "God" or "The Divine" - showing direct connection to Source',
                    'It is a random suffix',
                    'It means "servant"'
                ],
                correct: 1,
                explanation: '"El" (אֵל) is the ancient Hebrew name for God/The Divine, meaning "The Mighty One" or "The Most High". When attached to a name, it shows divine connection, purpose, or authority. Micha-el = "Who is like El?", Gabri-el = "Strength of El", Nazir-El = "One consecrated to El". These names declare divine alignment and sacred purpose.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'medium',
                question: 'What is a "Nazir" or "Nazarite" according to Hebrew tradition?',
                options: [
                    'Someone from Nazareth',
                    'One who takes a vow of separation/consecration to the Divine',
                    'A type of priest',
                    'A prophet'
                ],
                correct: 1,
                explanation: 'A Nazir (נָזִיר) is one who takes a vow of consecration and separation unto the Most High (Numbers 6). This includes abstaining from wine, not cutting hair, and avoiding death/impurity. Samson, Samuel, and John the Baptist were Nazarites. It represents complete dedication to divine purpose - being "set apart" for sacred work.'
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
                explanation: 'Yah (יָהּ) is the shortened form of the Tetragrammaton YHWH (יהוה) - the sacred name of the Divine. "HalleluYah" means "Praise Yah" (Praise the Divine). Many Hebrew names contain "Yah": Elijah (Eli-Yah = My God is Yah), Isaiah (Yesha-Yah = Salvation of Yah), showing their connection to the Most High.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'easy',
                question: 'What language did Yeshua (Jesus) speak?',
                options: [
                    'English',
                    'Greek',
                    'Aramaic and Hebrew',
                    'Latin'
                ],
                correct: 2,
                explanation: 'Yeshua spoke Aramaic (the common language of first-century Judea) and Hebrew (the sacred language of scripture and temple). He did NOT speak Greek or Latin fluently. This is critical: the "New Testament" was written in Greek for a Gentile audience, meaning Yeshua\'s actual words were translated and filtered through Greek language, culture, and philosophy - potentially losing original Hebraic meaning and context.'
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
                explanation: 'Israel (יִשְׂרָאֵל) comes from "Yisra" (to struggle/wrestle) + "El" (God), meaning "one who struggles with the Divine" or "God prevails". It was the name given to Jacob after wrestling with the divine messenger. Symbolically, Israel represents anyone who wrestles with divine truth, seeks divine understanding, and strives to align with higher consciousness - not limited to ethnicity or geography.'
            },
            {
                category: 'Biblical Truth & Etymology',
                difficulty: 'hard',
                question: 'What is the Tetragrammaton and why is it significant?',
                options: [
                    'A geometric shape',
                    'The four-letter sacred name of the Divine: YHWH (יהוה)',
                    'The four gospels',
                    'A type of angel'
                ],
                correct: 1,
                explanation: 'The Tetragrammaton is YHWH (יהוה) - the four-letter sacred name of the Divine, considered too holy to pronounce. It is often rendered as "Yahweh", "Yahuah", or "Jehovah" (incorrect). The letters Yod-Heh-Vav-Heh represent the eternal, self-existent nature of the Divine: "I AM that I AM" (Ehyeh Asher Ehyeh). This name contains the past, present, and future tenses of "to be" - revealing the timeless, infinite nature of the Creator.'
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
                explanation: 'Ruach (רוּחַ) means wind, breath, or spirit - and is FEMININE in Hebrew grammar. This reveals that the "Holy Spirit" (Ruach HaKodesh) carries divine feminine energy. Western theology masculinized the Trinity, but the Hebrew shows divine feminine presence. Spirit is the breath of life, the wind of change, the intuitive wisdom - all feminine expressions of the Divine.'
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
                explanation: 'Shekinah (שְׁכִינָה) means "dwelling" or "presence" - specifically the feminine aspect of the Divine that dwells among humanity. In Kabbalah, Shekinah represents the Divine Feminine, the immanent presence of God in the world (vs transcendent). She is the Holy Spirit, divine wisdom (Sophia), the compassionate mother aspect of the Most High. The Shekinah reveals that the Divine has both masculine and feminine expressions.'
            }
        ];

        this.init();
    }

    // ==================== DEBUG LOGGING ====================
    log(message, data = null) {
        if (this.debugMode) {
            console.log(`[TriviaEnhanced] ${message}`, data || '');
        }
    }

    error(message, error = null) {
        console.error(`[TriviaEnhanced ERROR] ${message}`, error || '');
    }

    // ==================== INITIALIZATION ====================

    async init() {
        this.log('🎯 Enhanced Daily Trivia System initializing...');

        try {
            // Initialize audio system first
            await this.initAudioSystem();

            // Show initial loading message
            this.updateLoadingMessage('Initializing trivia system...');

            // Wait for Firebase and Progress System
            await this.waitForSystems();
            
            this.log('Systems ready, checking auth state');

            // Listen for auth changes
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    this.log(`User authenticated: ${user.email}`);
                    this.currentUser = user;
                    
                    // Resume audio context on user interaction
                    this.audioSystem?.resumeAudioContext();
                    
                    await this.loadTriviaData();
                    await this.checkTodayStatus();
                    
                    // Start background music after a delay
                    setTimeout(() => {
                        if (this.audioSystem?.musicEnabled) {
                            this.audioSystem.startBackgroundMusic();
                        }
                    }, 1500);
                } else {
                    this.log('No user authenticated, redirecting to login');
                    window.location.href = '../members-new.html';
                }
            });
        } catch (error) {
            this.error('Initialization failed', error);
            this.showError('Failed to initialize trivia system', error);
        }
    }

    async initAudioSystem() {
        this.log('🎵 Initializing audio system...');
        
        try {
            if (typeof TriviaAudioSystem !== 'undefined') {
                this.audioSystem = new TriviaAudioSystem();
                await this.audioSystem.init();
                this.addSoundControls();
                this.log('✅ Audio system ready');
            } else {
                this.log('⚠️ Audio system not available');
            }
        } catch (error) {
            this.error('Audio system initialization failed', error);
        }
    }

    addSoundControls() {
        // Add audio controls to the trivia interface
        const loadingState = document.getElementById('loadingState');
        if (loadingState && !document.getElementById('triviaAudioControls')) {
            const audioControls = document.createElement('div');
            audioControls.id = 'triviaAudioControls';
            audioControls.className = 'trivia-audio-controls';
            audioControls.innerHTML = `
                <button id="triviaSoundToggle" class="audio-control-btn" title="Toggle Sound Effects">
                    🔊
                </button>
                <button id="triviaMusicToggle" class="audio-control-btn" title="Toggle Background Music">
                    🎵
                </button>
            `;

            // Add styles
            if (!document.getElementById('triviaAudioStyles')) {
                const style = document.createElement('style');
                style.id = 'triviaAudioStyles';
                style.textContent = `
                    .trivia-audio-controls {
                        position: fixed;
                        top: 1rem;
                        right: 1rem;
                        display: flex;
                        gap: 0.5rem;
                        z-index: 1000;
                    }
                    
                    .audio-control-btn {
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        width: 45px;
                        height: 45px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 1.3rem;
                        transition: all 0.3s ease;
                        color: white;
                        backdrop-filter: blur(10px);
                    }
                    
                    .audio-control-btn:hover {
                        background: rgba(255, 255, 255, 0.2);
                        transform: scale(1.1);
                        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                    }
                    
                    .audio-control-btn.disabled {
                        opacity: 0.5;
                        filter: grayscale(100%);
                    }
                    
                    .audio-control-btn.active {
                        background: rgba(212, 175, 55, 0.2);
                        border-color: var(--primary-gold);
                        box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
                    }
                `;
                document.head.appendChild(style);
            }

            loadingState.appendChild(audioControls);

            // Add event listeners
            document.getElementById('triviaSoundToggle')?.addEventListener('click', () => {
                if (this.audioSystem) {
                    const enabled = this.audioSystem.toggleSound();
                    this.updateSoundControlButton('triviaSoundToggle', enabled, '🔊', '🔇');
                }
            });

            document.getElementById('triviaMusicToggle')?.addEventListener('click', () => {
                if (this.audioSystem) {
                    const enabled = this.audioSystem.toggleMusic();
                    this.updateSoundControlButton('triviaMusicToggle', enabled, '🎵', '🎶');
                }
            });

            // Initialize button states
            this.updateSoundControlButton('triviaSoundToggle', this.audioSystem?.soundEnabled, '🔊', '🔇');
            this.updateSoundControlButton('triviaMusicToggle', this.audioSystem?.musicEnabled, '🎵', '🎶');
        }
    }

    updateSoundControlButton(buttonId, enabled, enabledIcon, disabledIcon) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.textContent = enabled ? enabledIcon : disabledIcon;
            button.classList.toggle('disabled', !enabled);
            button.classList.toggle('active', enabled);
        }
    }

    updateLoadingMessage(message) {
        const loadingEl = document.getElementById('loadingState');
        if (loadingEl) {
            const messageEl = loadingEl.querySelector('.loading-text') || 
                            loadingEl.querySelector('p') || 
                            loadingEl;
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
    }

    async waitForSystems() {
        this.log('Waiting for Firebase and Progress System...');
        
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkSystems = setInterval(() => {
                attempts++;
                
                const firebaseReady = typeof firebase !== 'undefined' && firebase.auth;
                const progressReady = window.progressSystem || true;
                
                if (firebaseReady && progressReady) {
                    clearInterval(checkSystems);
                    this.log('✅ All systems ready');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkSystems);
                    this.error('Systems timeout');
                    reject(new Error('Systems timeout'));
                }
            }, 100);
        });
    }

    // ==================== ENHANCED DATA MANAGEMENT ====================

    async loadTriviaData() {
        this.log('Loading trivia data...');
        this.updateLoadingMessage('Loading your progress...');

        try {
            const doc = await firebase.firestore()
                .collection('triviaProgress')
                .doc(this.currentUser.uid)
                .get();

            if (doc.exists) {
                this.triviaData = doc.data();
                this.log('Trivia data loaded:', this.triviaData);
                
                // Ensure all required fields exist
                this.validateTriviaData();
            } else {
                this.log('No existing data, initializing new user');
                await this.initializeNewUser();
            }

            this.updateStatsDisplay();
        } catch (error) {
            this.error('Error loading trivia data', error);
            // Initialize with default data on error
            await this.initializeNewUser();
        }
    }

    async initializeNewUser() {
        this.triviaData = {
            userId: this.currentUser.uid,
            totalQuizzes: 0,
            perfectScores: 0,
            totalXPEarned: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastCompletedDate: null,
            categoryStats: {},
            completedDates: [],
            achievements: [],
            settings: {
                soundEnabled: true,
                musicEnabled: true
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await this.saveTriviaData();
        this.log('New user initialized and saved');
    }

    validateTriviaData() {
        // Ensure all required fields exist
        const defaults = {
            totalQuizzes: 0,
            perfectScores: 0,
            totalXPEarned: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastCompletedDate: null,
            categoryStats: {},
            completedDates: [],
            achievements: [],
            settings: { soundEnabled: true, musicEnabled: true }
        };

        let needsUpdate = false;
        
        Object.entries(defaults).forEach(([key, defaultValue]) => {
            if (this.triviaData[key] === undefined) {
                this.triviaData[key] = defaultValue;
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            this.log('Trivia data updated with missing fields');
            this.saveTriviaData(); // Save asynchronously
        }
    }

    async saveTriviaData() {
        if (!this.triviaData || !this.currentUser) {
            this.log('Cannot save - no data or user');
            return;
        }

        try {
            // Add update timestamp
            this.triviaData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();

            // Save to Firestore
            await firebase.firestore()
                .collection('triviaProgress')
                .doc(this.currentUser.uid)
                .set(this.triviaData, { merge: true });

            // Also save to localStorage as backup
            try {
                const backupData = { ...this.triviaData };
                backupData.lastUpdated = new Date().toISOString();
                localStorage.setItem(`triviaProgress_${this.currentUser.uid}`, JSON.stringify(backupData));
                this.log('Trivia data saved to Firestore and localStorage');
            } catch (localError) {
                this.log('localStorage save failed (quota exceeded or disabled)', localError);
            }

            this.log('Trivia data saved successfully');
        } catch (error) {
            this.error('Error saving trivia data', error);

            // Retry once after a delay
            setTimeout(async () => {
                try {
                    await firebase.firestore()
                        .collection('triviaProgress')
                        .doc(this.currentUser.uid)
                        .set(this.triviaData, { merge: true });
                    this.log('Trivia data saved on retry');
                } catch (retryError) {
                    this.error('Failed to save trivia data on retry', retryError);
                }
            }, 2000);
        }
    }

    updateStatsDisplay() {
        const elements = {
            'totalQuizzes': this.triviaData?.totalQuizzes || 0,
            'currentStreak': this.triviaData?.currentStreak || 0,
            'perfectScores': this.triviaData?.perfectScores || 0,
            'totalXPEarned': this.triviaData?.totalXPEarned || 0
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        this.log('Stats display updated');
    }

    // ==================== DAILY QUESTIONS ====================

    async checkTodayStatus() {
        const today = new Date().toISOString().split('T')[0];
        this.log(`Checking today's status. Today: ${today}, Last completed: ${this.triviaData?.lastCompletedDate}`);

        // Debug option to reset completion status
        const urlParams = new URLSearchParams(window.location.search);
        const forceReset = urlParams.get('reset') === 'true';
        
        if (forceReset && this.triviaData) {
            this.log('🔄 Force reset detected - clearing completion status');
            this.triviaData.lastCompletedDate = null;
            await this.saveTriviaData();
        }

        if (this.triviaData?.lastCompletedDate === today && !forceReset) {
            this.log('Already completed today - showing completed message');
            this.showCompletedMessage();
        } else {
            this.log('Not completed today - generating new questions');
            this.updateLoadingMessage('Generating today\'s questions...');
            this.generateDailyQuestions();
            this.startQuiz();
        }
    }

    generateDailyQuestions() {
        const today = new Date().toISOString().split('T')[0];
        this.log(`Generating questions for ${today}`);

        try {
            // Use date as seed for consistent daily questions
            const seed = this.hashCode(today);
            this.log(`Generated seed: ${seed}`);

            // Shuffle question bank with seed
            const shuffled = this.seededShuffle([...this.questionBank], seed);
            this.log(`Shuffled ${shuffled.length} questions`);

            // Select 3 questions with varying difficulty for daily practice
            const easyQuestions = shuffled.filter(q => q.difficulty === 'easy');
            const mediumQuestions = shuffled.filter(q => q.difficulty === 'medium');
            const hardQuestions = shuffled.filter(q => q.difficulty === 'hard');

            this.todaysQuestions = [
                easyQuestions[0] || shuffled[0],
                mediumQuestions[0] || shuffled[1],
                hardQuestions[0] || shuffled[2]
            ].filter(Boolean);

            // Ensure we have 3 questions
            while (this.todaysQuestions.length < 3 && shuffled.length > this.todaysQuestions.length) {
                const nextQ = shuffled[this.todaysQuestions.length];
                if (nextQ && !this.todaysQuestions.includes(nextQ)) {
                    this.todaysQuestions.push(nextQ);
                }
            }

            this.log('Today\'s questions generated:', this.todaysQuestions.map(q => q.question));

        } catch (error) {
            this.error('Error generating questions', error);
            // Fallback: use first 3 questions
            this.todaysQuestions = this.questionBank.slice(0, 3);
            this.log('Used fallback questions');
        }
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    seededShuffle(array, seed) {
        const rng = this.seededRandom(seed);
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    seededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    // ==================== ENHANCED QUIZ FLOW ====================

    startQuiz() {
        this.log('Starting quiz...');
        
        if (!this.todaysQuestions || this.todaysQuestions.length === 0) {
            this.error('No questions available');
            this.showError('No questions available. Please try refreshing the page.');
            return;
        }

        // Play quiz start sound
        this.audioSystem?.playSound('questionReveal');

        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('quizCard').style.display = 'block';
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.userAnswers = [];
        
        this.displayQuestion();
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.todaysQuestions.length) {
            this.error('Question index out of range');
            return;
        }

        const question = this.todaysQuestions[this.currentQuestionIndex];
        const questionNum = this.currentQuestionIndex + 1;

        this.log(`Displaying question ${questionNum}: ${question.question}`);

        // Play question reveal sound
        this.audioSystem?.playSound('questionReveal');

        // Update question header
        document.getElementById('questionNumber').textContent = `Question ${questionNum}/3`;
        document.getElementById('difficultyBadge').textContent = question.difficulty.toUpperCase();
        document.getElementById('difficultyBadge').className = `difficulty-badge difficulty-${question.difficulty}`;

        // Update category and question
        const categoryEl = document.getElementById('categoryBadge');
        const questionEl = document.getElementById('questionText');
        
        if (categoryEl) categoryEl.textContent = question.category;
        if (questionEl) questionEl.textContent = question.question;

        // Hide explanation and next button
        const explanationBox = document.getElementById('explanationBox');
        const nextBtn = document.getElementById('nextBtn');
        
        if (explanationBox) explanationBox.classList.remove('show');
        if (nextBtn) nextBtn.classList.remove('show');

        // Display answer options with enhanced interaction
        const optionsContainer = document.getElementById('answerOptions');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';

            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.innerHTML = `<span>${option}</span>`;
                
                // Add hover sound effect
                button.addEventListener('mouseenter', () => {
                    this.audioSystem?.playSound('hover');
                });
                
                button.addEventListener('click', () => {
                    this.audioSystem?.playSound('click');
                    this.selectAnswer(index);
                });
                
                optionsContainer.appendChild(button);
            });
        }

        // Start timer with audio warnings
        this.startTimer();
        this.questionStartTime = Date.now();
    }

    startTimer() {
        this.timeRemaining = 30;
        const timerFill = document.getElementById('timerFill');
        
        if (timerFill) {
            timerFill.style.width = '100%';
            timerFill.classList.remove('warning');
        }

        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            
            if (timerFill) {
                const percentage = (this.timeRemaining / 30) * 100;
                timerFill.style.width = percentage + '%';

                // Audio warnings
                if (this.timeRemaining === 10) {
                    timerFill.classList.add('warning');
                    this.audioSystem?.playSound('timerWarning');
                } else if (this.timeRemaining === 5) {
                    this.audioSystem?.playSound('timerCritical');
                }
            }

            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.selectAnswer(-1); // Time's up
            }
        }, 1000);
    }

    selectAnswer(selectedIndex) {
        clearInterval(this.timerInterval);

        const question = this.todaysQuestions[this.currentQuestionIndex];
        const buttons = document.querySelectorAll('.answer-btn');
        const isCorrect = selectedIndex === question.correct;
        const timeSpent = ((Date.now() - this.questionStartTime) / 1000).toFixed(1);

        this.log(`Answer selected: ${selectedIndex}, Correct: ${question.correct}, Is Correct: ${isCorrect}`);

        // Play sound feedback
        if (selectedIndex === -1) {
            // Time's up
            this.audioSystem?.playSound('wrongAnswer');
        } else if (isCorrect) {
            this.audioSystem?.playSound('correctAnswer');
        } else {
            this.audioSystem?.playSound('wrongAnswer');
        }

        // Calculate speed bonus
        let speedBonus = 0;
        if (isCorrect && timeSpent < 10) {
            speedBonus = Math.floor((10 - timeSpent) * 1.5);
        }

        // Disable all buttons
        buttons.forEach(btn => btn.classList.add('disabled'));

        // Highlight correct/incorrect with enhanced animations
        if (selectedIndex >= 0) {
            buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
            
            // Add particle effect for correct answers
            if (isCorrect) {
                this.createEnhancedParticles(buttons[selectedIndex]);
            }
        }
        buttons[question.correct].classList.add('correct');

        // Update score
        if (isCorrect) {
            this.correctAnswers++;
            const baseXP = this.getXPForDifficulty(question.difficulty);
            const questionXP = baseXP + speedBonus;
            this.score += questionXP;
        }

        // Store answer
        this.userAnswers.push({
            question: question.question,
            selected: selectedIndex >= 0 ? question.options[selectedIndex] : 'Time\'s up',
            correct: question.options[question.correct],
            isCorrect,
            timeSpent,
            speedBonus
        });

        // Show explanation
        const explanationIcon = document.getElementById('explanationIcon');
        const explanationText = document.getElementById('explanationText');
        const explanationBox = document.getElementById('explanationBox');
        
        if (explanationIcon) explanationIcon.textContent = isCorrect ? '✨' : '💡';
        if (explanationText) explanationText.textContent = question.explanation;
        if (explanationBox) explanationBox.classList.add('show');

        // Show next button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.textContent = this.currentQuestionIndex < 2 ? 'Next Question →' : 'See Results 🎉';
            nextBtn.classList.add('show');
            nextBtn.onclick = () => {
                this.audioSystem?.playSound('click');
                this.nextQuestion();
            };
        }
    }

    getXPForDifficulty(difficulty) {
        const xpMap = {
            easy: 10,
            medium: 20,
            hard: 30
        };
        return xpMap[difficulty] || 10;
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < 3) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    // ==================== ENHANCED RESULTS ====================

    async showResults() {
        this.log('Showing results...');
        
        document.getElementById('quizCard').style.display = 'none';
        document.getElementById('resultsCard').classList.add('show');

        // Play victory sound
        if (this.correctAnswers === 3) {
            this.audioSystem?.playSound('perfectScore');
        } else {
            this.audioSystem?.playSound('victory');
        }

        // Perfect score bonus
        let perfectBonus = 0;
        if (this.correctAnswers === 3) {
            perfectBonus = 20;
            this.score += perfectBonus;
            this.triviaData.perfectScores++;
        }

        // Update display
        const elements = {
            'correctCount': this.correctAnswers,
            'totalCount': '3',
            'totalXP': this.score
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        // Results icon and title with enhanced feedback
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');

        if (resultsIcon && resultsTitle) {
            if (this.correctAnswers === 3) {
                resultsIcon.textContent = '🏆';
                resultsTitle.textContent = 'Perfect Score!';
            } else if (this.correctAnswers === 2) {
                resultsIcon.textContent = '⭐';
                resultsTitle.textContent = 'Great Job!';
            } else if (this.correctAnswers === 1) {
                resultsIcon.textContent = '📚';
                resultsTitle.textContent = 'Keep Learning!';
            } else {
                resultsIcon.textContent = '💪';
                resultsTitle.textContent = 'Try Again Tomorrow!';
            }
        }

        // XP Breakdown
        this.showXPBreakdown(perfectBonus);

        // Update streak with audio feedback
        await this.updateStreak();

        // Save progress
        await this.saveProgress();

        // Award XP to universal system
        if (window.progressSystem) {
            try {
                await window.progressSystem.awardXP(
                    this.score,
                    `Daily Trivia (${this.correctAnswers}/5 correct)`,
                    'daily-trivia'
                );
                this.log('XP awarded to progress system');
            } catch (error) {
                this.error('Error awarding XP', error);
            }
        }

        // Check for achievements
        this.checkAchievements();
    }

    showXPBreakdown(perfectBonus) {
        const breakdown = document.getElementById('xpBreakdown');
        if (!breakdown) return;

        breakdown.innerHTML = '';

        this.userAnswers.forEach((answer, i) => {
            const question = this.todaysQuestions[i];
            const baseXP = this.getXPForDifficulty(question.difficulty);

            if (answer.isCorrect) {
                const item = document.createElement('div');
                item.className = 'xp-breakdown-item';
                item.innerHTML = `
                    <span>Question ${i + 1} (${question.difficulty})</span>
                    <span>+${baseXP} XP${answer.speedBonus > 0 ? ` (+${answer.speedBonus} speed)` : ''}</span>
                `;
                breakdown.appendChild(item);
            }
        });

        if (perfectBonus > 0) {
            const item = document.createElement('div');
            item.className = 'xp-breakdown-item';
            item.innerHTML = `<span>Perfect Score Bonus 🏆</span><span>+${perfectBonus} XP</span>`;
            breakdown.appendChild(item);
        }

        const total = document.createElement('div');
        total.className = 'xp-breakdown-item';
        total.innerHTML = `<span>Total</span><span>+${this.score} XP</span>`;
        breakdown.appendChild(total);
    }

    async updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = this.triviaData.lastCompletedDate;

        if (!lastDate) {
            this.triviaData.currentStreak = 1;
            this.log('First time - streak set to 1');
        } else {
            const lastDateObj = new Date(lastDate);
            const todayObj = new Date(today);
            const daysDiff = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
                this.triviaData.currentStreak++;
                this.log(`Streak continues! Now ${this.triviaData.currentStreak} days`);

                if (this.triviaData.currentStreak > this.triviaData.longestStreak) {
                    this.triviaData.longestStreak = this.triviaData.currentStreak;
                }

                // Play streak sound for milestones
                if (this.triviaData.currentStreak % 5 === 0) {
                    this.audioSystem?.playSound('streak');
                }

                // Show streak message
                const streakMsg = document.getElementById('streakMessage');
                if (streakMsg) {
                    streakMsg.textContent = `🔥 ${this.triviaData.currentStreak} Day Streak! Keep it up!`;
                }
            } else if (daysDiff > 1) {
                this.triviaData.currentStreak = 1;
                this.log('Streak broken, reset to 1');
            }
        }
    }

    async saveProgress() {
        const today = new Date().toISOString().split('T')[0];

        this.triviaData.totalQuizzes++;
        this.triviaData.totalXPEarned += this.score;
        this.triviaData.lastCompletedDate = today;

        if (!this.triviaData.completedDates) {
            this.triviaData.completedDates = [];
        }
        this.triviaData.completedDates.push(today);

        // Update category stats
        this.todaysQuestions.forEach((q, i) => {
            if (!this.triviaData.categoryStats) {
                this.triviaData.categoryStats = {};
            }
            if (!this.triviaData.categoryStats[q.category]) {
                this.triviaData.categoryStats[q.category] = {
                    correct: 0,
                    total: 0
                };
            }
            this.triviaData.categoryStats[q.category].total++;
            if (this.userAnswers[i].isCorrect) {
                this.triviaData.categoryStats[q.category].correct++;
            }
        });

        await this.saveTriviaData();
        this.updateStatsDisplay();
        this.log('Progress saved');
    }

    checkAchievements() {
        const achievements = [];

        if (this.triviaData.totalQuizzes === 1) {
            achievements.push('🎯 First Steps - Completed your first trivia!');
            this.audioSystem?.playSound('achievement');
        }

        if (this.correctAnswers === 3 && this.triviaData.perfectScores === 1) {
            achievements.push('🏆 Perfect Scholar - First perfect score!');
            this.audioSystem?.playSound('achievement');
        }

        if (this.triviaData.currentStreak === 7) {
            achievements.push('🔥 Dedicated Seeker - 7 day streak!');
            this.audioSystem?.playSound('achievement');
        }

        if (this.triviaData.currentStreak === 30) {
            achievements.push('⭐ Trivia Master - 30 day streak!');
            this.audioSystem?.playSound('achievement');
        }

        if (this.triviaData.perfectScores === 10) {
            achievements.push('👑 Trivia Legend - 10 perfect scores!');
            this.audioSystem?.playSound('achievement');
        }

        if (achievements.length > 0) {
            const achievementMsg = document.getElementById('achievementMessage');
            if (achievementMsg) {
                achievementMsg.innerHTML = achievements.join('<br>');
            }
        }
    }

    // ==================== ENHANCED UI EFFECTS ====================

    createEnhancedParticles(element) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create more particles with varied effects
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'trivia-particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            
            // Randomize particle appearance
            const colors = ['#D4AF37', '#FFD700', '#FFA500', '#FF6B35'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;

            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 100 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');

            // Enhanced particle styling
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.position = 'fixed';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.animation = 'triviaParticle 2s ease-out forwards';

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }
    }

    showCompletedMessage() {
        this.log('Showing completed message');
        
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('completedMessage').style.display = 'block';

        // Calculate time until tomorrow
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        const timeEl = document.querySelector('.time-remaining');
        if (timeEl) {
            timeEl.textContent = `Come back in ${hours}h ${minutes}m for new questions`;
        }

        // Add reset option for debugging
        if (this.debugMode) {
            const completedEl = document.getElementById('completedMessage');
            if (completedEl && !completedEl.querySelector('.debug-reset-btn')) {
                const resetBtn = document.createElement('button');
                resetBtn.className = 'debug-reset-btn';
                resetBtn.textContent = '🔄 Reset (Debug)';
                resetBtn.style.cssText = `
                    margin-top: 1rem;
                    background: var(--accent-orange);
                    color: black;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: 600;
                `;
                resetBtn.onclick = () => {
                    this.audioSystem?.playSound('click');
                    window.location.href = window.location.pathname + '?reset=true';
                };
                completedEl.appendChild(resetBtn);
            }
        }
    }

    showError(message, error = null) {
        this.error(message, error);
        
        const loadingEl = document.getElementById('loadingState');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3 style="color: #F43F5E;">❌ Error</h3>
                    <p>${message}</p>
                    ${error ? `<div style="margin-top: 1rem; padding: 1rem; background: rgba(244, 63, 94, 0.1); border-radius: 8px; font-family: monospace; font-size: 0.8rem;">${error.message || error}</div>` : ''}
                    <button onclick="location.reload()" style="margin-top: 1rem; background: var(--primary-gold); color: black; border: none; padding: 0.8rem 2rem; border-radius: 25px; cursor: pointer; font-weight: 600;">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    // ==================== CLEANUP ====================

    destroy() {
        this.log('🎯 Cleaning up Enhanced Trivia System...');
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.audioSystem) {
            this.audioSystem.destroy();
        }
    }
}

// Add CSS for enhanced particle animation
if (!document.getElementById('triviaParticleStyles')) {
    const particleStyle = document.createElement('style');
    particleStyle.id = 'triviaParticleStyles';
    particleStyle.textContent = `
        @keyframes triviaParticle {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            50% {
                transform: translate(calc(var(--tx) * 0.5), calc(var(--ty) * 0.5)) scale(1.2);
                opacity: 0.8;
            }
            100% {
                transform: translate(var(--tx), var(--ty)) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// ==================== SOCIAL SHARING ====================

function shareResults() {
    const trivia = window.enhancedTriviaSystem;
    if (!trivia) return;

    trivia.audioSystem?.playSound('click');

    const score = trivia.correctAnswers;
    const total = 5;
    const streak = trivia.triviaData?.currentStreak || 0;

    const text = `🎯 Daily Spiritual Trivia\n\nScore: ${score}/${total}\n🔥 ${streak} Day Streak\n\nJoin me on the spiritual journey! 🌟`;

    if (navigator.share) {
        navigator.share({
            title: 'Daily Spiritual Trivia Results',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        });
    }
}

function viewLeaderboard() {
    if (window.enhancedTriviaSystem) {
        window.enhancedTriviaSystem.audioSystem?.playSound('click');
    }
    alert('Leaderboard coming soon!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing Enhanced Daily Trivia System...');
    window.enhancedTriviaSystem = new EnhancedDailyTriviaSystem();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.enhancedTriviaSystem) {
        window.enhancedTriviaSystem.destroy();
    }
});