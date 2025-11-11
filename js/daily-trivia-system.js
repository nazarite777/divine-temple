/**
 * 🎯 DAILY SPIRITUAL TRIVIA SYSTEM
 * Interactive trivia game with XP rewards, achievements, and streak tracking
 *
 * Features:
 * - 100+ spiritual questions across 10 categories
 * - Daily question rotation
 * - Difficulty-based XP rewards (Easy: 10, Medium: 20, Hard: 30)
 * - Perfect score bonus (+20 XP)
 * - Speed bonuses (+5-15 XP)
 * - Streak tracking with rewards
 * - Firebase integration
 * - Educational explanations
 * - Particle effects and animations
 * - Social sharing
 */

class DailyTriviaSystem {
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
        this.timeRemaining = 30; // 30 seconds per question

        // Question Database - 100+ questions across 10 categories
        this.questionBank = [
            // ========== CHAKRAS & ENERGY (15 questions) ==========
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
                difficulty: 'hard',
                question: 'How many main nadis (energy channels) are there in the subtle body according to yogic tradition?',
                options: ['7', '72', '108', '72,000'],
                correct: 3,
                explanation: 'According to yogic tradition, there are 72,000 nadis (energy channels) in the subtle body, with Ida, Pingala, and Sushumna being the three main ones.'
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
            {
                category: 'Chakras & Energy',
                difficulty: 'hard',
                question: 'What is the bija (seed) mantra for the Third Eye Chakra?',
                options: ['LAM', 'VAM', 'RAM', 'OM'],
                correct: 3,
                explanation: 'OM (or AUM) is the bija mantra for the Third Eye Chakra (Ajna), representing cosmic consciousness and intuition.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'medium',
                question: 'Which chakra governs creativity and sexuality?',
                options: ['Root', 'Sacral', 'Solar Plexus', 'Heart'],
                correct: 1,
                explanation: 'The Sacral Chakra (Svadhisthana) governs creativity, sexuality, pleasure, and emotional flow.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'easy',
                question: 'How many main chakras are there in the traditional system?',
                options: ['5', '7', '9', '12'],
                correct: 1,
                explanation: 'There are 7 main chakras in the traditional Hindu system, from Root to Crown.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'hard',
                question: 'Which Kundalini yoga practice involves breath retention?',
                options: ['Asana', 'Pranayama', 'Mudra', 'Bandha'],
                correct: 1,
                explanation: 'Pranayama involves breath control and retention techniques used to awaken and channel kundalini energy.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'medium',
                question: 'What color is the Throat Chakra?',
                options: ['Blue', 'Green', 'Purple', 'Indigo'],
                correct: 0,
                explanation: 'The Throat Chakra (Vishuddha) is associated with blue, representing communication, truth, and self-expression.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'easy',
                question: 'Which chakra is associated with intuition?',
                options: ['Root', 'Sacral', 'Third Eye', 'Crown'],
                correct: 2,
                explanation: 'The Third Eye Chakra (Ajna) is the center of intuition, insight, and psychic abilities.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'hard',
                question: 'What does "chakra" literally mean in Sanskrit?',
                options: ['Light', 'Energy', 'Wheel', 'Power'],
                correct: 2,
                explanation: 'Chakra means "wheel" or "disk" in Sanskrit, referring to the spinning vortexes of energy in the subtle body.'
            },
            {
                category: 'Chakras & Energy',
                difficulty: 'medium',
                question: 'Which chakra is responsible for grounding you to the physical world?',
                options: ['Crown', 'Third Eye', 'Root', 'Heart'],
                correct: 2,
                explanation: 'The Root Chakra connects you to the physical earth and provides grounding, stability, and security.'
            },

            // ========== TAROT & ORACLE (15 questions) ==========
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
                difficulty: 'hard',
                question: 'How many suits are in the Minor Arcana?',
                options: ['2', '3', '4', '5'],
                correct: 2,
                explanation: 'The Minor Arcana has 4 suits: Wands (Fire), Cups (Water), Swords (Air), and Pentacles (Earth).'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'medium',
                question: 'Which suit represents the element of Water?',
                options: ['Wands', 'Cups', 'Swords', 'Pentacles'],
                correct: 1,
                explanation: 'Cups represent the element of Water and govern emotions, relationships, intuition, and creativity.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'easy',
                question: 'What is the highest numbered card in the Major Arcana?',
                options: ['The World', 'The Sun', 'The Moon', 'Judgement'],
                correct: 0,
                explanation: 'The World (card 21) is the highest numbered card in the Major Arcana, representing completion and fulfillment.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'hard',
                question: 'Which Tarot card is numbered 13?',
                options: ['The Devil', 'Death', 'The Tower', 'The Hanged Man'],
                correct: 1,
                explanation: 'Death is card number 13 in the Major Arcana, representing transformation and rebirth.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'medium',
                question: 'What does the suit of Pentacles represent?',
                options: ['Emotions', 'Thoughts', 'Actions', 'Material world'],
                correct: 3,
                explanation: 'Pentacles (or Coins) represent the material world, including money, career, health, and physical manifestation.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'easy',
                question: 'Which card is associated with balance and justice?',
                options: ['The Emperor', 'Justice', 'The High Priestess', 'Temperance'],
                correct: 1,
                explanation: 'The Justice card represents fairness, balance, truth, and karmic consequences.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'hard',
                question: 'What is the astrological correspondence of The Emperor card?',
                options: ['Aries', 'Leo', 'Taurus', 'Capricorn'],
                correct: 0,
                explanation: 'The Emperor is associated with Aries, representing leadership, authority, and masculine energy.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'medium',
                question: 'Which card represents sudden change or upheaval?',
                options: ['The Tower', 'Death', 'The Devil', 'The Moon'],
                correct: 0,
                explanation: 'The Tower represents sudden change, upheaval, revelation, and the breaking down of old structures.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'easy',
                question: 'What does the suit of Wands represent?',
                options: ['Emotions', 'Action and passion', 'Thoughts', 'Material wealth'],
                correct: 1,
                explanation: 'Wands represent the element of Fire and govern action, passion, creativity, and willpower.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'hard',
                question: 'Who is often credited with designing the Rider-Waite Tarot deck illustrations?',
                options: ['Arthur Waite', 'Pamela Colman Smith', 'Aleister Crowley', 'Eden Gray'],
                correct: 1,
                explanation: 'Pamela Colman Smith illustrated the iconic Rider-Waite deck, though it was commissioned by Arthur Edward Waite.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'medium',
                question: 'Which card represents divine feminine wisdom?',
                options: ['The Empress', 'The High Priestess', 'The Star', 'The Moon'],
                correct: 1,
                explanation: 'The High Priestess represents divine feminine wisdom, intuition, and the subconscious mind.'
            },
            {
                category: 'Tarot & Oracle',
                difficulty: 'medium',
                question: 'What element is associated with the suit of Swords?',
                options: ['Fire', 'Water', 'Air', 'Earth'],
                correct: 2,
                explanation: 'Swords are associated with Air, representing thoughts, communication, truth, and mental clarity.'
            },

            // ========== CRYSTALS & GEMSTONES (12 questions) ==========
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
                difficulty: 'medium',
                question: 'What is the primary chakra associated with Amethyst?',
                options: ['Root', 'Heart', 'Third Eye', 'Solar Plexus'],
                correct: 2,
                explanation: 'Amethyst resonates with the Third Eye and Crown chakras, enhancing intuition and spiritual awareness.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'medium',
                question: 'Which crystal is best known for protection and grounding?',
                options: ['Selenite', 'Black Tourmaline', 'Moonstone', 'Labradorite'],
                correct: 1,
                explanation: 'Black Tourmaline is a powerful protective stone that grounds energy and shields against negativity.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'hard',
                question: 'What is the Mohs hardness of diamond?',
                options: ['7', '8', '9', '10'],
                correct: 3,
                explanation: 'Diamond is the hardest natural material with a Mohs hardness of 10.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'easy',
                question: 'Which crystal is associated with abundance and prosperity?',
                options: ['Citrine', 'Turquoise', 'Jade', 'Carnelian'],
                correct: 0,
                explanation: 'Citrine is known as the "merchant\'s stone" and is associated with abundance, prosperity, and success.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'medium',
                question: 'Which crystal should NOT be cleansed in water?',
                options: ['Clear Quartz', 'Amethyst', 'Selenite', 'Rose Quartz'],
                correct: 2,
                explanation: 'Selenite is water-soluble and will dissolve or become damaged when placed in water.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'hard',
                question: 'What gives Amethyst its purple color?',
                options: ['Copper', 'Iron', 'Manganese', 'Titanium'],
                correct: 1,
                explanation: 'Amethyst gets its purple color from iron impurities and natural irradiation.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'medium',
                question: 'Which crystal is known for enhancing communication?',
                options: ['Lapis Lazuli', 'Carnelian', 'Tiger\'s Eye', 'Obsidian'],
                correct: 0,
                explanation: 'Lapis Lazuli is associated with the Throat Chakra and enhances communication, truth, and self-expression.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'easy',
                question: 'What color is Malachite?',
                options: ['Blue', 'Green', 'Purple', 'Red'],
                correct: 1,
                explanation: 'Malachite is a vibrant green stone with distinctive banding patterns, used for transformation and protection.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'hard',
                question: 'Which crystal structure does Pyrite have?',
                options: ['Hexagonal', 'Cubic', 'Monoclinic', 'Trigonal'],
                correct: 1,
                explanation: 'Pyrite (fool\'s gold) has a cubic crystal structure and often forms perfect cube-shaped crystals.'
            },
            {
                category: 'Crystals & Gemstones',
                difficulty: 'medium',
                question: 'Which stone is known as the "stone of courage"?',
                options: ['Carnelian', 'Bloodstone', 'Jasper', 'Hematite'],
                correct: 0,
                explanation: 'Carnelian is known as the stone of courage, vitality, and motivation, stimulating creativity and confidence.'
            },

            // ========== MEDITATION & MINDFULNESS (12 questions) ==========
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
                difficulty: 'hard',
                question: 'What does "Vipassana" mean in Pali?',
                options: ['Loving-kindness', 'Insight', 'Breathing', 'Stillness'],
                correct: 1,
                explanation: 'Vipassana means "insight" or "clear seeing" and is a meditation technique focusing on observing reality as it is.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'medium',
                question: 'Which meditation technique involves repeating a word or phrase?',
                options: ['Body scan', 'Mantra meditation', 'Walking meditation', 'Zen meditation'],
                correct: 1,
                explanation: 'Mantra meditation involves repeating a sacred word, phrase, or sound to focus the mind and elevate consciousness.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'easy',
                question: 'What is the lotus position used for?',
                options: ['Sleeping', 'Meditation', 'Exercise', 'Dancing'],
                correct: 1,
                explanation: 'The lotus position (Padmasana) is a cross-legged sitting posture used in meditation and yoga.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'hard',
                question: 'Who is credited with bringing mindfulness meditation to the West?',
                options: ['Deepak Chopra', 'Jon Kabat-Zinn', 'Eckhart Tolle', 'Thich Nhat Hanh'],
                correct: 1,
                explanation: 'Jon Kabat-Zinn developed the Mindfulness-Based Stress Reduction (MBSR) program, bringing mindfulness to mainstream Western medicine.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'medium',
                question: 'What type of meditation focuses on cultivating love and compassion?',
                options: ['Transcendental', 'Loving-kindness (Metta)', 'Zen', 'Chakra'],
                correct: 1,
                explanation: 'Metta (loving-kindness) meditation cultivates unconditional love and compassion for oneself and all beings.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'easy',
                question: 'What is the main focus of breath meditation?',
                options: ['Thoughts', 'Breath', 'Sounds', 'Visualizations'],
                correct: 1,
                explanation: 'Breath meditation (Anapanasati) involves focusing attention on the natural rhythm of the breath.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'hard',
                question: 'In Zen Buddhism, what is a "koan"?',
                options: ['Meditation cushion', 'Paradoxical riddle', 'Temple', 'Prayer'],
                correct: 1,
                explanation: 'A koan is a paradoxical question or statement used in Zen practice to transcend rational thinking and achieve enlightenment.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'medium',
                question: 'What does "Om" represent when chanted?',
                options: ['Peace', 'Love', 'Universal sound', 'Gratitude'],
                correct: 2,
                explanation: 'Om (Aum) represents the primordial sound of the universe and encompasses all of creation, preservation, and dissolution.'
            },
            {
                category: 'Meditation & Mindfulness',
                difficulty: 'medium',
                question: 'Which brainwave state is associated with deep meditation?',
                options: ['Beta', 'Alpha', 'Theta', 'Delta'],
                correct: 2,
                explanation: 'Theta brainwaves (4-8 Hz) are associated with deep meditation, creativity, and the subconscious mind.'
            },

            // ========== SACRED GEOMETRY (10 questions) ==========
            {
                category: 'Sacred Geometry',
                difficulty: 'easy',
                question: 'What is the Flower of Life composed of?',
                options: ['Triangles', 'Overlapping circles', 'Squares', 'Pentagons'],
                correct: 1,
                explanation: 'The Flower of Life is a geometric pattern composed of multiple evenly-spaced, overlapping circles arranged in a flower-like pattern.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'medium',
                question: 'What ratio is considered the "divine proportion"?',
                options: ['Pi', 'Golden Ratio (Phi)', 'Square root of 2', 'Fibonacci'],
                correct: 1,
                explanation: 'The Golden Ratio (Phi ≈ 1.618) is found throughout nature and is considered divinely proportional in sacred geometry.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'hard',
                question: 'How many Platonic solids exist?',
                options: ['3', '5', '7', '9'],
                correct: 1,
                explanation: 'There are exactly 5 Platonic solids: tetrahedron, cube, octahedron, dodecahedron, and icosahedron.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'easy',
                question: 'What shape is the base of the Great Pyramid of Giza?',
                options: ['Circle', 'Triangle', 'Square', 'Hexagon'],
                correct: 2,
                explanation: 'The Great Pyramid has a square base with four triangular faces meeting at the apex.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'medium',
                question: 'What does the Vesica Piscis represent?',
                options: ['Fish', 'Intersection of two circles', 'Triangle', 'Spiral'],
                correct: 1,
                explanation: 'The Vesica Piscis is formed by the intersection of two circles of equal radius, representing duality and creation.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'hard',
                question: 'Which geometric shape is associated with the element of Fire?',
                options: ['Cube', 'Tetrahedron', 'Octahedron', 'Icosahedron'],
                correct: 1,
                explanation: 'The tetrahedron (4 triangular faces) is associated with the element of Fire in Platonic solid correspondences.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'medium',
                question: 'What is Metatron\'s Cube derived from?',
                options: ['Flower of Life', 'Tree of Life', 'Golden Ratio', 'Fibonacci Spiral'],
                correct: 0,
                explanation: 'Metatron\'s Cube is derived from the Fruit of Life (part of the Flower of Life) and contains all five Platonic solids.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'easy',
                question: 'How many sides does a hexagon have?',
                options: ['5', '6', '7', '8'],
                correct: 1,
                explanation: 'A hexagon has 6 sides and is found extensively in nature, particularly in honeycomb structures.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'hard',
                question: 'What is the angle of the Great Pyramid\'s slope?',
                options: ['45°', '51.84°', '60°', '72°'],
                correct: 1,
                explanation: 'The Great Pyramid has a slope angle of approximately 51.84°, which incorporates the golden ratio.'
            },
            {
                category: 'Sacred Geometry',
                difficulty: 'medium',
                question: 'What spiral pattern follows the Fibonacci sequence?',
                options: ['Golden Spiral', 'Logarithmic Spiral', 'Archimedean Spiral', 'Hyperbolic Spiral'],
                correct: 0,
                explanation: 'The Golden Spiral follows the Fibonacci sequence and is found throughout nature in shells, galaxies, and plant growth.'
            },

            // ========== ASTROLOGY & MOON PHASES (10 questions) ==========
            {
                category: 'Astrology & Moon',
                difficulty: 'easy',
                question: 'How many zodiac signs are there?',
                options: ['10', '12', '13', '14'],
                correct: 1,
                explanation: 'There are 12 zodiac signs in Western astrology, each representing 30° of the 360° zodiacal circle.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'medium',
                question: 'Which moon phase is best for new beginnings?',
                options: ['Full Moon', 'New Moon', 'Waxing Crescent', 'Waning Gibbous'],
                correct: 1,
                explanation: 'The New Moon represents new beginnings, fresh starts, and setting intentions for the lunar cycle ahead.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'easy',
                question: 'What element is Aries associated with?',
                options: ['Earth', 'Air', 'Fire', 'Water'],
                correct: 2,
                explanation: 'Aries is a Fire sign, characterized by passion, enthusiasm, and dynamic energy.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'hard',
                question: 'How long does it take the moon to complete one full cycle?',
                options: ['27.3 days', '28 days', '29.5 days', '30 days'],
                correct: 2,
                explanation: 'The lunar cycle (from new moon to new moon) takes approximately 29.5 days to complete.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'medium',
                question: 'Which zodiac sign is ruled by Venus?',
                options: ['Aries', 'Taurus', 'Gemini', 'Cancer'],
                correct: 1,
                explanation: 'Taurus and Libra are both ruled by Venus, the planet of love, beauty, and harmony.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'easy',
                question: 'What does a Full Moon represent spiritually?',
                options: ['Beginnings', 'Completion', 'Confusion', 'Silence'],
                correct: 1,
                explanation: 'The Full Moon represents completion, manifestation, illumination, and the peak of the lunar cycle\'s energy.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'hard',
                question: 'What is a "Blue Moon"?',
                options: ['Moon that appears blue', 'Eclipse', 'Second full moon in a month', 'Rare lunar event'],
                correct: 2,
                explanation: 'A Blue Moon is the second full moon occurring within a single calendar month, happening roughly every 2-3 years.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'medium',
                question: 'Which planet rules Scorpio?',
                options: ['Mars', 'Pluto', 'Venus', 'Both Mars and Pluto'],
                correct: 3,
                explanation: 'Scorpio is co-ruled by Mars (traditional ruler) and Pluto (modern ruler), governing transformation and intensity.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'medium',
                question: 'What is the lunar phase for releasing and letting go?',
                options: ['New Moon', 'Waxing Moon', 'Full Moon', 'Waning Moon'],
                correct: 3,
                explanation: 'The Waning Moon is ideal for releasing, letting go, and clearing away what no longer serves you.'
            },
            {
                category: 'Astrology & Moon',
                difficulty: 'hard',
                question: 'What is the "Lilith" in astrology?',
                options: ['A planet', 'Black Moon (lunar apogee)', 'An asteroid', 'A constellation'],
                correct: 1,
                explanation: 'Black Moon Lilith is the lunar apogee (the point where the moon is farthest from Earth) and represents shadow work and hidden desires.'
            },

            // ========== MANTRAS & SOUND (8 questions) ==========
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
                difficulty: 'hard',
                question: 'How many Solfeggio frequencies are there in the original scale?',
                options: ['3', '6', '9', '12'],
                correct: 1,
                explanation: 'There are 6 original Solfeggio frequencies: 396, 417, 528, 639, 741, and 852 Hz, each with specific healing properties.'
            },
            {
                category: 'Mantras & Sound',
                difficulty: 'easy',
                question: 'What does "mantra" mean in Sanskrit?',
                options: ['Song', 'Prayer', 'Mind tool', 'Meditation'],
                correct: 2,
                explanation: 'Mantra comes from "man" (mind) and "tra" (tool/instrument), meaning a tool to focus and elevate the mind.'
            },
            {
                category: 'Mantras & Sound',
                difficulty: 'medium',
                question: 'What is the Gayatri Mantra used for?',
                options: ['Protection', 'Enlightenment', 'Wealth', 'Healing'],
                correct: 1,
                explanation: 'The Gayatri Mantra is a sacred Vedic hymn invoking divine light and wisdom for spiritual enlightenment.'
            },
            {
                category: 'Mantras & Sound',
                difficulty: 'hard',
                question: 'What Hz frequency is associated with the Third Eye chakra?',
                options: ['432 Hz', '528 Hz', 'HASH Hz', '852 Hz'],
                correct: 3,
                explanation: '852 Hz is the Solfeggio frequency associated with the Third Eye chakra, promoting intuition and spiritual awareness.'
            },
            {
                category: 'Mantras & Sound',
                difficulty: 'medium',
                question: 'What type of sound healing uses metal bowls?',
                options: ['Crystal bowls', 'Tibetan singing bowls', 'Gong bath', 'Tuning forks'],
                correct: 1,
                explanation: 'Tibetan singing bowls are made of metal alloys and produce harmonic overtones used for sound healing and meditation.'
            },
            {
                category: 'Mantras & Sound',
                difficulty: 'easy',
                question: 'What is binaural beats meditation?',
                options: ['Singing', 'Two different frequencies in each ear', 'Drumming', 'Chanting'],
                correct: 1,
                explanation: 'Binaural beats occur when two slightly different frequencies are played in each ear, creating a perceived third frequency that can alter brainwave states.'
            },

            // ========== SPIRITUAL PRACTICES (8 questions) ==========
            {
                category: 'Spiritual Practices',
                difficulty: 'easy',
                question: 'What is the practice of burning herbs for purification called?',
                options: ['Smudging', 'Incensing', 'Fumigation', 'Burning'],
                correct: 0,
                explanation: 'Smudging is the ceremonial practice of burning sacred herbs (like sage or palo santo) to cleanse energy and purify spaces.'
            },
            {
                category: 'Spiritual Practices',
                difficulty: 'medium',
                question: 'What is a "vision quest"?',
                options: ['Reading', 'Fasting ritual', 'Dance', 'Pilgrimage'],
                correct: 1,
                explanation: 'A vision quest is a Native American rite of passage involving fasting, solitude, and communion with nature to receive spiritual guidance.'
            },
            {
                category: 'Spiritual Practices',
                difficulty: 'easy',
                question: 'What is gratitude journaling?',
                options: ['Writing complaints', 'Recording blessings', 'Dream journal', 'Goal setting'],
                correct: 1,
                explanation: 'Gratitude journaling involves regularly writing down things you\'re grateful for to cultivate appreciation and positive energy.'
            },
            {
                category: 'Spiritual Practices',
                difficulty: 'hard',
                question: 'What is "Bhakti Yoga"?',
                options: ['Physical postures', 'Path of devotion', 'Breath work', 'Knowledge study'],
                correct: 1,
                explanation: 'Bhakti Yoga is the path of devotion and love towards the divine, one of the four main paths of yoga.'
            },
            {
                category: 'Spiritual Practices',
                difficulty: 'medium',
                question: 'What is automatic writing used for?',
                options: ['Learning calligraphy', 'Channeling messages', 'Taking notes', 'Spell writing'],
                correct: 1,
                explanation: 'Automatic writing is a practice of allowing the hand to write without conscious thought, often used to channel spiritual messages or access the subconscious.'
            },
            {
                category: 'Spiritual Practices',
                difficulty: 'easy',
                question: 'What is affirmation practice?',
                options: ['Negative thinking', 'Positive statements', 'Questioning', 'Complaining'],
                correct: 1,
                explanation: 'Affirmations are positive statements repeated regularly to reprogram the subconscious mind and manifest desired outcomes.'
            },
            {
                category: 'Spiritual Practices',
                difficulty: 'hard',
                question: 'What is the purpose of a "labyrinth walk"?',
                options: ['Exercise', 'Getting lost', 'Moving meditation', 'Competition'],
                correct: 2,
                explanation: 'Labyrinth walking is a moving meditation practice that uses a winding path to quiet the mind and promote contemplation.'
            },
            {
                category: 'Spiritual Practices',
                difficulty: 'medium',
                question: 'What is "shadow work"?',
                options: ['Working at night', 'Exploring unconscious aspects', 'Candle magic', 'Dark meditation'],
                correct: 1,
                explanation: 'Shadow work involves exploring and integrating the unconscious, repressed, or denied aspects of oneself for healing and wholeness.'
            },

            // ========== ELEMENTS & NATURE (5 questions) ==========
            {
                category: 'Elements & Nature',
                difficulty: 'easy',
                question: 'How many classical elements are there in Western tradition?',
                options: ['3', '4', '5', '7'],
                correct: 1,
                explanation: 'Western tradition recognizes 4 classical elements: Earth, Water, Fire, and Air (sometimes including Spirit/Ether as the 5th).'
            },
            {
                category: 'Elements & Nature',
                difficulty: 'medium',
                question: 'Which direction is associated with the element of Fire?',
                options: ['North', 'South', 'East', 'West'],
                correct: 1,
                explanation: 'In many traditions, Fire is associated with the South, representing passion, transformation, and willpower.'
            },
            {
                category: 'Elements & Nature',
                difficulty: 'easy',
                question: 'What element represents emotions and intuition?',
                options: ['Fire', 'Earth', 'Air', 'Water'],
                correct: 3,
                explanation: 'Water element represents emotions, intuition, the subconscious, and the flow of feelings.'
            },
            {
                category: 'Elements & Nature',
                difficulty: 'hard',
                question: 'In Chinese philosophy, how many elements are there?',
                options: ['4', '5', '6', '8'],
                correct: 1,
                explanation: 'Chinese philosophy recognizes 5 elements: Wood, Fire, Earth, Metal, and Water, which interact in generative and destructive cycles.'
            },
            {
                category: 'Elements & Nature',
                difficulty: 'medium',
                question: 'Which element is associated with mental clarity and communication?',
                options: ['Fire', 'Water', 'Air', 'Earth'],
                correct: 2,
                explanation: 'Air element governs mental clarity, communication, intellect, and the realm of ideas and thoughts.'
            },

            // ========== SACRED TEXTS & WISDOM (5 questions) ==========
            {
                category: 'Sacred Texts',
                difficulty: 'easy',
                question: 'What ancient Indian text contains the Bhagavad Gita?',
                options: ['Vedas', 'Upanishads', 'Mahabharata', 'Ramayana'],
                correct: 2,
                explanation: 'The Bhagavad Gita is part of the Mahabharata, an ancient Indian epic, and contains a dialogue between Krishna and Arjuna.'
            },
            {
                category: 'Sacred Texts',
                difficulty: 'medium',
                question: 'What does "Tao Te Ching" translate to?',
                options: ['Book of Changes', 'The Way and Its Power', 'Ancient Wisdom', 'Path of Virtue'],
                correct: 1,
                explanation: 'Tao Te Ching means "The Way and Its Power" or "The Book of the Way," attributed to Lao Tzu.'
            },
            {
                category: 'Sacred Texts',
                difficulty: 'hard',
                question: 'How many sutras are in the Yoga Sutras of Patanjali?',
                options: ['108', '196', '256', '365'],
                correct: 1,
                explanation: 'The Yoga Sutras of Patanjali contain 196 aphorisms divided into four chapters outlining the philosophy and practice of yoga.'
            },
            {
                category: 'Sacred Texts',
                difficulty: 'medium',
                question: 'What is the Emerald Tablet associated with?',
                options: ['Buddhism', 'Hermeticism', 'Hinduism', 'Taoism'],
                correct: 1,
                explanation: 'The Emerald Tablet is a foundational Hermetic text attributed to Hermes Trismegistus, containing alchemical and spiritual wisdom.'
            },
            {
                category: 'Sacred Texts',
                difficulty: 'easy',
                question: 'What are the Vedas?',
                options: ['Buddhist texts', 'Ancient Hindu scriptures', 'Greek philosophy', 'Chinese wisdom'],
                correct: 1,
                explanation: 'The Vedas are ancient Sanskrit texts that form the oldest scriptures of Hinduism, containing hymns, philosophy, and spiritual knowledge.'
            }
        ];

        this.init();
    }

    // ==================== INITIALIZATION ====================

    async init() {
        console.log('🎯 Daily Trivia System initializing...');

        // Wait for Firebase and Progress System
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
    }

    async waitForSystems() {
        return new Promise((resolve) => {
            const checkSystems = setInterval(() => {
                if (typeof firebase !== 'undefined' && window.progressSystem) {
                    clearInterval(checkSystems);
                    resolve();
                }
            }, 100);
        });
    }

    // ==================== DATA MANAGEMENT ====================

    async loadTriviaData() {
        try {
            const doc = await firebase.firestore()
                .collection('triviaProgress')
                .doc(this.currentUser.uid)
                .get();

            if (doc.exists) {
                this.triviaData = doc.data();
            } else {
                // Initialize new user
                this.triviaData = {
                    userId: this.currentUser.uid,
                    totalQuizzes: 0,
                    perfectScores: 0,
                    totalXPEarned: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    lastCompletedDate: null,
                    categoryStats: {},
                    completedDates: []
                };
                await this.saveTriviaData();
            }

            this.updateStatsDisplay();
        } catch (error) {
            console.error('Error loading trivia data:', error);
        }
    }

    async saveTriviaData() {
        try {
            await firebase.firestore()
                .collection('triviaProgress')
                .doc(this.currentUser.uid)
                .set(this.triviaData);
        } catch (error) {
            console.error('Error saving trivia data:', error);
        }
    }

    updateStatsDisplay() {
        document.getElementById('totalQuizzes').textContent = this.triviaData.totalQuizzes || 0;
        document.getElementById('currentStreak').textContent = this.triviaData.currentStreak || 0;
        document.getElementById('perfectScores').textContent = this.triviaData.perfectScores || 0;
        document.getElementById('totalXPEarned').textContent = this.triviaData.totalXPEarned || 0;
    }

    // ==================== DAILY QUESTIONS ====================

    async checkTodayStatus() {
        const today = new Date().toISOString().split('T')[0];

        if (this.triviaData.lastCompletedDate === today) {
            // Already completed today
            this.showCompletedMessage();
        } else {
            // Generate new questions for today
            this.generateDailyQuestions();
            this.startQuiz();
        }
    }

    generateDailyQuestions() {
        // Use date as seed for consistent daily questions
        const today = new Date().toISOString().split('T')[0];
        const seed = this.hashCode(today);

        // Shuffle question bank with seed
        const shuffled = this.seededShuffle([...this.questionBank], seed);

        // Select 3 questions with varying difficulty
        const easy = shuffled.find(q => q.difficulty === 'easy');
        const medium = shuffled.find(q => q.difficulty === 'medium');
        const hard = shuffled.find(q => q.difficulty === 'hard');

        this.todaysQuestions = [easy, medium, hard].filter(Boolean);

        // If we don't have all 3, fill with random questions
        while (this.todaysQuestions.length < 3) {
            const randomQ = shuffled[this.todaysQuestions.length];
            if (randomQ && !this.todaysQuestions.includes(randomQ)) {
                this.todaysQuestions.push(randomQ);
            }
        }

        console.log('Today\'s questions generated:', this.todaysQuestions);
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

    // ==================== QUIZ FLOW ====================

    startQuiz() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('quizCard').style.display = 'block';
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.userAnswers = [];
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.todaysQuestions[this.currentQuestionIndex];
        const questionNum = this.currentQuestionIndex + 1;

        // Update question header
        document.getElementById('questionNumber').textContent = `Question ${questionNum}/3`;
        document.getElementById('difficultyBadge').textContent = question.difficulty.toUpperCase();
        document.getElementById('difficultyBadge').className = `difficulty-badge difficulty-${question.difficulty}`;

        // Update category and question
        document.getElementById('categoryBadge').textContent = question.category;
        document.getElementById('questionText').textContent = question.question;

        // Hide explanation and next button
        document.getElementById('explanationBox').classList.remove('show');
        document.getElementById('nextBtn').classList.remove('show');

        // Display answer options
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.innerHTML = `<span>${option}</span>`;
            button.onclick = () => this.selectAnswer(index);
            optionsContainer.appendChild(button);
        });

        // Start timer
        this.startTimer();
        this.questionStartTime = Date.now();
    }

    startTimer() {
        this.timeRemaining = 30;
        const timerFill = document.getElementById('timerFill');
        timerFill.style.width = '100%';
        timerFill.classList.remove('warning');

        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            const percentage = (this.timeRemaining / 30) * 100;
            timerFill.style.width = percentage + '%';

            if (this.timeRemaining <= 10) {
                timerFill.classList.add('warning');
            }

            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.selectAnswer(-1); // Time's up - wrong answer
            }
        }, 1000);
    }

    selectAnswer(selectedIndex) {
        clearInterval(this.timerInterval);

        const question = this.todaysQuestions[this.currentQuestionIndex];
        const buttons = document.querySelectorAll('.answer-btn');
        const isCorrect = selectedIndex === question.correct;
        const timeSpent = ((Date.now() - this.questionStartTime) / 1000).toFixed(1);

        // Calculate speed bonus (max 15 XP if answered in under 5 seconds)
        let speedBonus = 0;
        if (isCorrect && timeSpent < 10) {
            speedBonus = Math.floor((10 - timeSpent) * 1.5);
        }

        // Disable all buttons
        buttons.forEach(btn => btn.classList.add('disabled'));

        // Highlight correct/incorrect
        if (selectedIndex >= 0) {
            buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        buttons[question.correct].classList.add('correct');

        // Update score
        if (isCorrect) {
            this.correctAnswers++;
            const baseXP = this.getXPForDifficulty(question.difficulty);
            const questionXP = baseXP + speedBonus;
            this.score += questionXP;

            // Particle effect
            this.createParticles(buttons[selectedIndex]);
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
        document.getElementById('explanationIcon').textContent = isCorrect ? '✨' : '💡';
        document.getElementById('explanationText').textContent = question.explanation;
        document.getElementById('explanationBox').classList.add('show');

        // Show next button
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.textContent = this.currentQuestionIndex < 2 ? 'Next Question →' : 'See Results 🎉';
        nextBtn.classList.add('show');
        nextBtn.onclick = () => this.nextQuestion();
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

    // ==================== RESULTS ====================

    async showResults() {
        document.getElementById('quizCard').style.display = 'none';
        document.getElementById('resultsCard').classList.add('show');

        // Perfect score bonus
        let perfectBonus = 0;
        if (this.correctAnswers === 3) {
            perfectBonus = 20;
            this.score += perfectBonus;
            this.triviaData.perfectScores++;
        }

        // Update display
        document.getElementById('correctCount').textContent = this.correctAnswers;
        document.getElementById('totalCount').textContent = '3';
        document.getElementById('totalXP').textContent = this.score;

        // Results icon and title
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');

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

        // XP Breakdown
        const breakdown = document.getElementById('xpBreakdown');
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

        // Update streak
        await this.updateStreak();

        // Save progress
        await this.saveProgress();

        // Award XP to universal system
        if (window.progressSystem) {
            await window.progressSystem.awardXP(
                this.score,
                `Daily Trivia (${this.correctAnswers}/3 correct)`,
                'daily-trivia'
            );
        }

        // Check for achievements
        this.checkAchievements();
    }

    async updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = this.triviaData.lastCompletedDate;

        if (!lastDate) {
            // First time
            this.triviaData.currentStreak = 1;
        } else {
            const lastDateObj = new Date(lastDate);
            const todayObj = new Date(today);
            const daysDiff = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
                // Streak continues!
                this.triviaData.currentStreak++;

                if (this.triviaData.currentStreak > this.triviaData.longestStreak) {
                    this.triviaData.longestStreak = this.triviaData.currentStreak;
                }

                // Streak message
                const streakMsg = document.getElementById('streakMessage');
                streakMsg.textContent = `🔥 ${this.triviaData.currentStreak} Day Streak! Keep it up!`;

                // Streak bonus XP (awarded by universal progress system)
            } else if (daysDiff > 1) {
                // Streak broken
                this.triviaData.currentStreak = 1;
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
    }

    checkAchievements() {
        const achievements = [];

        // First trivia
        if (this.triviaData.totalQuizzes === 1) {
            achievements.push('🎯 First Steps - Completed your first trivia!');
        }

        // Perfect score
        if (this.correctAnswers === 3 && this.triviaData.perfectScores === 1) {
            achievements.push('🏆 Perfect Scholar - First perfect score!');
        }

        // 7-day streak
        if (this.triviaData.currentStreak === 7) {
            achievements.push('🔥 Dedicated Seeker - 7 day streak!');
        }

        // 30-day streak
        if (this.triviaData.currentStreak === 30) {
            achievements.push('⭐ Trivia Master - 30 day streak!');
        }

        // 10 perfect scores
        if (this.triviaData.perfectScores === 10) {
            achievements.push('👑 Trivia Legend - 10 perfect scores!');
        }

        if (achievements.length > 0) {
            const achievementMsg = document.getElementById('achievementMessage');
            achievementMsg.innerHTML = achievements.join('<br>');
        }
    }

    // ==================== UI EFFECTS ====================

    createParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
            particle.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }
    }

    showCompletedMessage() {
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

        document.querySelector('.time-remaining').textContent =
            `Come back in ${hours}h ${minutes}m for new questions`;
    }
}

// ==================== SOCIAL SHARING ====================

function shareResults() {
    const trivia = window.triviaSystem;
    const score = trivia.correctAnswers;
    const total = 3;
    const streak = trivia.triviaData.currentStreak;

    const text = `🎯 Daily Spiritual Trivia\n\nScore: ${score}/${total}\n🔥 ${streak} Day Streak\n\nJoin me on the spiritual journey! 🌟`;

    if (navigator.share) {
        navigator.share({
            title: 'Daily Spiritual Trivia Results',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        });
    }
}

function viewLeaderboard() {
    // TODO: Implement leaderboard view
    alert('Leaderboard coming soon!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.triviaSystem = new DailyTriviaSystem();
});
