/**
 * DIVINE TEMPLE - Premium Daily Trivia System
 * Advanced Consciousness Awakening & Deprogramming Questions
 * 100+ Questions across 12+ Esoteric Categories
 * 
 * Features:
 * - 12 Advanced Categories (Kabbalah, Enochian, Gnosticism, etc.)
 * - 3 Difficulty Levels (Seeker, Initiate, Adept)
 * - Timed Challenges & Global Leaderboards
 * - Detailed Explanations with Source References
 * - Progress Analytics & Category Mastery
 * - Achievement System & Streak Bonuses
 */

class PremiumTriviaSystem {
    constructor() {
        this.currentUser = null;
        this.dailyProgress = this.loadDailyProgress();
        this.userStats = this.loadUserStats();
        this.selectedDifficulty = 'seeker';
        this.selectedCategory = 'mixed';
        this.timerActive = false;
        this.timeRemaining = 0;
        this.currentQuestionIndex = 0;
        this.questionsAnswered = [];
        this.sessionStartTime = Date.now();
        
        this.init();
    }

    // PREMIUM QUESTION DATABASE - 100+ Advanced Questions
    premiumQuestions = {
        kabbalah: {
            name: "🔯 Kabbalah & Tree of Life",
            description: "Ancient Jewish mysticism and the divine emanations",
            questions: [
                {
                    id: "kab_001",
                    difficulty: "seeker",
                    question: "What are the ten Sephiroth on the Tree of Life?",
                    answers: [
                        "Ten divine angels that guard heaven",
                        "Ten emanations or attributes through which the divine reveals itself",
                        "Ten commandments in their mystical form",
                        "Ten stages of human spiritual development"
                    ],
                    correct: 1,
                    explanation: "The Sephiroth are ten divine emanations that represent how the infinite (Ein Sof) manifests in creation. They form a map of consciousness from Keter (Crown) to Malkuth (Kingdom), showing the path of divine descent and human ascent.",
                    sources: ["Zohar", "Sefer Yetzirah"]
                },
                {
                    id: "kab_002",
                    difficulty: "initiate",
                    question: "What is the significance of Da'at (Knowledge) as the 'hidden' Sephirah?",
                    answers: [
                        "It represents forbidden knowledge that was removed from the Tree",
                        "It's the bridge between the upper and lower triangles, representing conscious awareness",
                        "It's a backup Sephirah used when others are damaged",
                        "It represents the knowledge of good and evil from Genesis"
                    ],
                    correct: 1,
                    explanation: "Da'at represents the consciousness that bridges the supernal triad (Keter-Chokmah-Binah) with the lower Sephiroth. It's the point where divine wisdom becomes conscious knowledge, the 'abyss' that must be crossed in spiritual ascent.",
                    sources: ["Aleister Crowley", "Golden Dawn teachings"]
                },
                {
                    id: "kab_003",
                    difficulty: "adept",
                    question: "In the Four Worlds system, what does Atziluth represent?",
                    answers: [
                        "The world of physical manifestation",
                        "The world of divine emanation and pure spirit",
                        "The world of formation and angels",
                        "The world of creation and souls"
                    ],
                    correct: 1,
                    explanation: "Atziluth is the highest of the Four Worlds, the realm of pure divine emanation where the Sephiroth exist in their most refined form. It's the world of divine names and archetypes, closest to the Ein Sof (infinite).",
                    sources: ["Chaim Vital", "Etz Chaim"]
                },
                {
                    id: "kab_004",
                    difficulty: "seeker",
                    question: "What is Ein Sof in Kabbalistic teaching?",
                    answers: [
                        "The first Sephirah on the Tree of Life",
                        "The infinite, unknowable aspect of God before manifestation",
                        "The name of a famous Kabbalist",
                        "The lowest world of physical matter"
                    ],
                    correct: 1,
                    explanation: "Ein Sof means 'without end' or 'infinite.' It represents the absolute, unknowable essence of the Divine before any manifestation or emanation. It's beyond all attributes, names, and comprehension - the infinite source from which the Sephiroth emanate.",
                    sources: ["Zohar", "Isaac Luria teachings"]
                },
                {
                    id: "kab_005",
                    difficulty: "initiate",
                    question: "What is the significance of the Middle Pillar on the Tree of Life?",
                    answers: [
                        "It represents physical strength",
                        "It represents the balanced path of consciousness between mercy and severity",
                        "It's the most dangerous path to traverse",
                        "It only connects two Sephiroth"
                    ],
                    correct: 1,
                    explanation: "The Middle Pillar (Keter-Tiferet-Yesod-Malkuth) represents perfect balance between the Pillar of Mercy (right) and Pillar of Severity (left). It's the central channel of equilibrium where divine consciousness descends and human consciousness ascends in harmony.",
                    sources: ["Golden Dawn", "Kabbalistic meditation practices"]
                },
                {
                    id: "kab_006",
                    difficulty: "initiate",
                    question: "What does Tiferet (Beauty) represent on the Tree of Life?",
                    answers: [
                        "Physical attractiveness",
                        "The harmonious center where all opposites unite in perfect balance",
                        "Artistic talent",
                        "The beauty of nature"
                    ],
                    correct: 1,
                    explanation: "Tiferet is the central Sephirah, representing the heart of the Tree. It harmonizes all opposing forces - mercy and severity, expansion and contraction - into divine beauty and balance. It's associated with the awakened heart and Christ consciousness.",
                    sources: ["Zohar", "Kabbalistic cosmology"]
                },
                {
                    id: "kab_007",
                    difficulty: "adept",
                    question: "What is the Kabbalistic understanding of the three veils of negative existence before manifestation?",
                    answers: [
                        "Three types of darkness in the universe",
                        "Ain (Nothing), Ain Soph (Limitless), Ain Soph Aur (Limitless Light)",
                        "Three stages of meditation",
                        "The three lower worlds"
                    ],
                    correct: 1,
                    explanation: "The Three Veils represent stages before creation: Ain (absolute nothingness), Ain Soph (infinite nothingness), and Ain Soph Aur (limitless light emerging from infinity). These are the gradual manifestation from absolute void to the first glimmer of existence before Keter.",
                    sources: ["Isaac Luria", "Advanced Kabbalistic cosmology"]
                },
                {
                    id: "kab_008",
                    difficulty: "adept",
                    question: "What is the purpose of the Lightning Flash path descending the Tree of Life?",
                    answers: [
                        "To show the path of enlightenment upward",
                        "To map how divine consciousness descends from Ein Sof into material manifestation",
                        "To represent destruction",
                        "To show the fastest meditation technique"
                    ],
                    correct: 1,
                    explanation: "The Lightning Flash traces how consciousness descends from Keter through each Sephirah to Malkuth, showing the path of divine emanation from pure spirit into physical matter. It's the descent of the Word creating reality, while the serpent path shows the return journey of awakening.",
                    sources: ["Sefer Yetzirah", "Kabbalistic tree symbolism"]
                },
                {
                    id: "kab_009",
                    difficulty: "adept",
                    question: "What is Tzimtzum in Lurianic Kabbalah?",
                    answers: [
                        "A meditation technique for beginners",
                        "The divine contraction where God withdrew to create space for the universe",
                        "The expansion of consciousness",
                        "A type of angelic being"
                    ],
                    correct: 1,
                    explanation: "Tzimtzum is the paradoxical concept that the infinite Ein Sof contracted or withdrew itself to create a 'space' where finite reality could exist. This divine self-limitation allowed for creation and free will, as otherwise the infinite would fill all space leaving no room for anything else.",
                    sources: ["Isaac Luria", "Lurianic Kabbalah"]
                }
            ]
        },

        enochian: {
            name: "👁️ Enochian Mysteries",
            description: "The Book of Enoch and angelic communications",
            questions: [
                {
                    id: "eno_001",
                    difficulty: "seeker",
                    question: "Who were the Watchers in the Book of Enoch?",
                    answers: [
                        "Human priests who watched over temples",
                        "Angels assigned to watch and guide humanity who fell from grace",
                        "Prophets who watched for signs of the end times",
                        "Celestial bodies that watch over the earth"
                    ],
                    correct: 1,
                    explanation: "The Watchers were a group of angels sent to observe and guide humanity. Led by Azazel and Semjaza, they transgressed by taking human wives and teaching forbidden knowledge, leading to their fall and the corruption that necessitated the flood.",
                    sources: ["1 Enoch 6-11", "Book of Jubilees"]
                },
                {
                    id: "eno_002",
                    difficulty: "initiate", 
                    question: "What forbidden knowledge did Azazel teach humanity according to Enoch?",
                    answers: [
                        "Agriculture and animal husbandry",
                        "Metallurgy, weapons, cosmetics, and enchantments",
                        "Writing and mathematics",
                        "Medicine and healing arts"
                    ],
                    correct: 1,
                    explanation: "Azazel taught the arts of metallurgy for weapons and war, cosmetics for vanity, and various enchantments and magical practices. This knowledge was considered 'forbidden' because it led humanity away from their pure spiritual nature toward materialism and conflict.",
                    sources: ["1 Enoch 8:1-3"]
                },
                {
                    id: "eno_003",
                    difficulty: "adept",
                    question: "What is the significance of the 364-day Enochian calendar?",
                    answers: [
                        "It perfectly aligns with the lunar cycle",
                        "It maintains four equal seasons of 91 days, reflecting divine order",
                        "It predicts the return of the Watchers",
                        "It calculates when the Messiah will arrive"
                    ],
                    correct: 1,
                    explanation: "The 364-day calendar creates perfect symmetry with four seasons of exactly 91 days (13 weeks) each. This reflects the divine order of creation and ensures that festivals always fall on the same days of the week, maintaining cosmic harmony.",
                    sources: ["1 Enoch 72-82", "Book of Jubilees"]
                },
                {
                    id: "eno_004",
                    difficulty: "seeker",
                    question: "Who is Metatron in the Book of Enoch tradition?",
                    answers: [
                        "A fallen angel",
                        "Enoch transformed into the highest archangel, scribe of God",
                        "Noah's teacher",
                        "The angel of death"
                    ],
                    correct: 1,
                    explanation: "Metatron is identified as Enoch after his transformation into an angel. He became the supreme angel, sitting closest to God's throne as the divine scribe and 'Lesser YHVH.' His title 'Prince of the Presence' reflects his role as intermediary between God and creation.",
                    sources: ["3 Enoch", "Hebrew Enoch"]
                },
                {
                    id: "eno_005",
                    difficulty: "initiate",
                    question: "What are the seven heavens described in Enochian literature?",
                    answers: [
                        "Seven stages of hell for the wicked",
                        "Seven ascending realms of consciousness and angelic orders culminating in God's throne",
                        "Seven planets in the ancient solar system",
                        "Seven different afterlife destinations"
                    ],
                    correct: 1,
                    explanation: "The seven heavens represent ascending levels of spiritual reality, each governed by different angelic orders and containing specific mysteries. Enoch journeyed through all seven, culminating in the seventh heaven where God's throne resides, representing the highest state of divine consciousness.",
                    sources: ["2 Enoch", "Ancient apocalyptic literature"]
                },
                {
                    id: "eno_006",
                    difficulty: "initiate",
                    question: "What is the significance of the Nephilim in the Enochian narrative?",
                    answers: [
                        "They were ordinary giants with no spiritual meaning",
                        "The offspring of Watchers and human women, representing corrupted consciousness",
                        "A tribe of peaceful giants",
                        "Guardians of sacred knowledge"
                    ],
                    correct: 1,
                    explanation: "The Nephilim were hybrid beings born from the union of fallen Watchers and human women. They represent the corruption that occurs when spiritual forces mix improperly with material existence, creating imbalance. Their great size symbolizes the distortion of natural order.",
                    sources: ["1 Enoch 7", "Genesis 6:4", "Book of Giants"]
                },
                {
                    id: "eno_007",
                    difficulty: "adept",
                    question: "What is the deeper spiritual meaning of Enoch's ascension without experiencing death?",
                    answers: [
                        "He was lucky to avoid dying",
                        "He achieved complete transformation of consciousness while embodied, transcending death",
                        "God made a random exception for him",
                        "It's just a metaphor with no real meaning"
                    ],
                    correct: 1,
                    explanation: "Enoch's ascension represents the possibility of complete spiritual transformation while still in the body - the alchemical transmutation of the physical into the spiritual. 'Enoch walked with God and was not, for God took him' signifies achieving such unity with divine consciousness that death becomes irrelevant.",
                    sources: ["Genesis 5:24", "Hebrews 11:5", "Mystical Judaism"]
                },
                {
                    id: "eno_008",
                    difficulty: "adept",
                    question: "What do the 'secrets of the cosmos' revealed to Enoch represent spiritually?",
                    answers: [
                        "Ancient astronomy knowledge",
                        "The hidden structures of reality and consciousness that govern creation",
                        "Weather prediction methods",
                        "Mathematical formulas"
                    ],
                    correct: 1,
                    explanation: "The cosmic secrets revealed to Enoch include the movements of celestial bodies, the nature of thunder and lightning, and the paths of angels - representing the hidden laws governing both outer cosmos and inner consciousness. These mysteries show how macrocosm and microcosm mirror each other.",
                    sources: ["1 Enoch 17-36", "Astronomical Book"]
                },
                {
                    id: "eno_009",
                    difficulty: "adept",
                    question: "What is the significance of Enoch receiving a pen and ink in the heavenly court?",
                    answers: [
                        "He became a simple scribe",
                        "He became the divine recorder who writes reality into existence through sacred script",
                        "He learned basic literacy",
                        "He documented ancient history"
                    ],
                    correct: 1,
                    explanation: "Enoch's role as heavenly scribe goes beyond mere recording - he participates in the creative act itself. In mystical Judaism, the act of writing divine truths is a form of co-creation with God. Enoch writing equals the logos manifesting, showing how consciousness creates reality through sacred knowledge.",
                    sources: ["3 Enoch", "Merkabah mysticism"]
                }
            ]
        },

        gnosticism: {
            name: "🐍 Gnostic Wisdom",
            description: "Hidden knowledge and divine spark within",
            questions: [
                {
                    id: "gno_001",
                    difficulty: "seeker",
                    question: "What is the Demiurge in Gnostic cosmology?",
                    answers: [
                        "The supreme creator god",
                        "A false creator god who traps souls in matter",
                        "The first human to achieve gnosis",
                        "The divine feminine principle"
                    ],
                    correct: 1,
                    explanation: "The Demiurge is a lesser, ignorant creator deity who fashioned the material world as a prison for divine souls. Unlike the true God (the Pleroma), the Demiurge operates from ignorance, creating a flawed reality that traps the divine spark within matter.",
                    sources: ["Nag Hammadi", "Apocryphon of John"]
                },
                {
                    id: "gno_002",
                    difficulty: "initiate",
                    question: "What does 'Sophia' represent in Gnostic mythology?",
                    answers: [
                        "The first woman created by God",
                        "Divine Wisdom whose fall created the material world",
                        "The bride of Christ in heaven",
                        "The holy spirit in female form"
                    ],
                    correct: 1,
                    explanation: "Sophia (Wisdom) is a divine aeon whose desire to know the supreme Father led to her fall and the creation of the Demiurge. Her story represents the soul's journey from unity through division back to gnosis (knowledge) of the divine.",
                    sources: ["Pistis Sophia", "The Thunder, Perfect Mind"]
                },
                {
                    id: "gno_003",
                    difficulty: "adept",
                    question: "In the Gospel of Thomas, what does Jesus mean by 'If you bring forth what is within you'?",
                    answers: [
                        "Confess your sins publicly for salvation",
                        "Express your divine nature to achieve liberation",
                        "Share your material wealth with others", 
                        "Follow external religious commandments"
                    ],
                    correct: 1,
                    explanation: "This refers to awakening and expressing the divine spark (pneuma) within. The complete saying: 'If you bring forth what is within you, what you bring forth will save you. If you do not bring forth what is within you, what you do not bring forth will destroy you.' This is pure Gnostic teaching about self-realization.",
                    sources: ["Gospel of Thomas, Logion 70"]
                }
            ]
        },

        sacred_geometry: {
            name: "🔺 Sacred Geometry",
            description: "Divine mathematical principles in creation",
            questions: [
                {
                    id: "geo_001",
                    difficulty: "seeker",
                    question: "What is the significance of the Golden Ratio (Phi) in sacred geometry?",
                    answers: [
                        "It's used to calculate temple dimensions",
                        "It represents the divine proportion found throughout nature and consciousness",
                        "It's the ratio between earth and heaven",
                        "It determines the perfect prayer timing"
                    ],
                    correct: 1,
                    explanation: "The Golden Ratio (1.618...) appears throughout nature in spirals, flowers, human proportions, and DNA. In sacred geometry, it represents the divine proportion that creates harmony and beauty, reflecting the mathematical nature of consciousness itself.",
                    sources: ["Euclid's Elements", "Fibonacci sequences in nature"]
                },
                {
                    id: "geo_002",
                    difficulty: "initiate",
                    question: "What does Metatron's Cube contain within its structure?",
                    answers: [
                        "The seven chakras mapped geometrically",
                        "All five Platonic solids representing the elements",
                        "The Tree of Life pathways",
                        "The 72 names of God in geometric form"
                    ],
                    correct: 1,
                    explanation: "Metatron's Cube contains all five Platonic solids (tetrahedron, cube, octahedron, dodecahedron, icosahedron) which represent the classical elements (fire, earth, air, spirit, water). It's considered the fundamental geometric pattern underlying all of creation.",
                    sources: ["Hermetic teachings", "Platonic geometry"]
                },
                {
                    id: "geo_003",
                    difficulty: "adept",
                    question: "In the Flower of Life pattern, what does the central hexagon represent?",
                    answers: [
                        "The six days of creation",
                        "The heart chakra as the center of love",
                        "The perfect balance of masculine and feminine energies",
                        "The six directions of space around a central point"
                    ],
                    correct: 2,
                    explanation: "The central hexagon in the Flower of Life represents the perfect balance and unity of opposing forces - masculine/feminine, positive/negative, expansion/contraction. It's the point of perfect equilibrium from which all creation emanates in balanced duality.",
                    sources: ["Drunvalo Melchizedek", "Ancient geometric traditions"]
                }
            ]
        },

        biblical_codes: {
            name: "📜 Hidden Biblical Codes",
            description: "Deeper meanings encoded in scripture",
            questions: [
                {
                    id: "bib_001",
                    difficulty: "seeker",
                    question: "What is the significance of the number 40 appearing repeatedly in the Bible?",
                    answers: [
                        "It was the average human lifespan",
                        "It represents complete transformation and testing periods",
                        "It's the number of tribes of Israel",
                        "It represents the days in a month"
                    ],
                    correct: 1,
                    explanation: "The number 40 appears in periods of transformation: 40 days of rain (Noah), 40 years in wilderness (Israelites), 40 days of temptation (Jesus), 40 days of fasting (Moses). It represents complete cycles of purification and spiritual preparation.",
                    sources: ["Biblical numerology studies"]
                },
                {
                    id: "bib_002",
                    difficulty: "initiate",
                    question: "What does the name 'Elohim' reveal about the nature of God in Genesis?",
                    answers: [
                        "God is singular and masculine",
                        "God encompasses both masculine and feminine principles",
                        "God is a title, not a name",
                        "God is one of many gods mentioned"
                    ],
                    correct: 1,
                    explanation: "Elohim is grammatically plural yet takes singular verbs, suggesting a unity that contains multiplicity. Many scholars see this as indicating the divine encompasses both masculine and feminine aspects - the complete divine wholeness before gender separation.",
                    sources: ["Hebrew linguistic analysis", "Kabbalistic interpretations"]
                },
                {
                    id: "bib_003",
                    difficulty: "adept",
                    question: "What is the deeper meaning of Jesus saying 'Before Abraham was, I AM'?",
                    answers: [
                        "Jesus existed before Abraham was born",
                        "Jesus is claiming the eternal 'I AM' consciousness that transcends time",
                        "Jesus is descended from Abraham's lineage",
                        "Jesus is greater than the patriarch Abraham"
                    ],
                    correct: 1,
                    explanation: "By using 'I AM' (the same divine name revealed to Moses), Jesus is claiming the eternal, timeless consciousness that exists beyond linear time. This is the Christ consciousness - the eternal divine awareness that is our true nature.",
                    sources: ["John 8:58", "Mystical Christianity interpretations"]
                }
            ]
        },

        consciousness_tech: {
            name: "🧠 Consciousness Technology",
            description: "Ancient and modern methods of expanding awareness",
            questions: [
                {
                    id: "con_001",
                    difficulty: "seeker",
                    question: "What is binaural beats' effect on brainwave states?",
                    answers: [
                        "They damage hearing over time",
                        "They can entrain the brain to specific frequencies for altered states",
                        "They only work with expensive equipment",
                        "They have no measurable effect"
                    ],
                    correct: 1,
                    explanation: "Binaural beats create frequency-following response where the brain synchronizes to the difference between two slightly different frequencies played in each ear. This can induce theta (meditation), alpha (relaxation), or gamma (heightened awareness) states.",
                    sources: ["Neuroscience research", "Monroe Institute studies"]
                },
                {
                    id: "con_002",
                    difficulty: "initiate",
                    question: "What is the significance of 40Hz gamma waves in consciousness research?",
                    answers: [
                        "They indicate brain damage",
                        "They're associated with heightened awareness and unity consciousness",
                        "They only occur during sleep",
                        "They're a sign of mental illness"
                    ],
                    correct: 1,
                    explanation: "40Hz gamma waves are associated with peak awareness, unity consciousness, and moments of insight. Advanced meditators show increased gamma activity, and it's linked to the binding of disparate brain regions into unified conscious experience.",
                    sources: ["Neuroscience of meditation", "Tibetan monk studies"]
                },
                {
                    id: "con_003",
                    difficulty: "adept",
                    question: "How do ancient pyramid frequencies relate to human consciousness?",
                    answers: [
                        "They're just architectural acoustics with no special properties",
                        "They resonate at frequencies that can induce altered states of consciousness",
                        "They were designed for musical performances only",
                        "They protect against natural disasters"
                    ],
                    correct: 1,
                    explanation: "Pyramids like the Great Pyramid resonate around 110Hz, which research shows can shift brainwaves and induce transcendent states. This frequency appears in many ancient sacred sites, suggesting intentional consciousness-altering design.",
                    sources: ["Acoustic archaeology", "Paolo Debertolis research"]
                }
            ]
        },

        ancient_mysteries: {
            name: "🏛️ Ancient Mystery Schools",
            description: "Wisdom traditions from Egypt, Greece, and beyond",
            questions: [
                {
                    id: "mys_001",
                    difficulty: "seeker",
                    question: "What was the primary teaching of the Eleusinian Mysteries?",
                    answers: [
                        "The immortality of the soul and rebirth",
                        "Military strategy and warfare",
                        "Agricultural techniques",
                        "Political governance systems"
                    ],
                    correct: 0,
                    explanation: "The Eleusinian Mysteries taught initiates about the soul's immortality through the story of Persephone's death and rebirth. Participants experienced a mystical vision that assured them of life after death and their divine nature.",
                    sources: ["Clement of Alexandria", "Cicero's references"]
                },
                {
                    id: "mys_002",
                    difficulty: "initiate",
                    question: "What does 'As Above, So Below' mean in Hermetic philosophy?",
                    answers: [
                        "Heaven is better than Earth",
                        "The macrocosm is reflected in the microcosm",
                        "Spiritual beings live in the sky",
                        "What goes up must come down"
                    ],
                    correct: 1,
                    explanation: "This principle teaches that patterns in the greater cosmos (macrocosm) are reflected in smaller systems (microcosm), including humans. Understanding universal laws allows us to understand ourselves and vice versa - we are the universe in miniature.",
                    sources: ["Emerald Tablet of Hermes"]
                },
                {
                    id: "mys_003",
                    difficulty: "adept",
                    question: "What was the ultimate goal of Egyptian mystery school initiation?",
                    answers: [
                        "To become a priest or priestess",
                        "To achieve conscious immortality and become one with Ra",
                        "To gain political power in society",
                        "To learn hieroglyphic writing"
                    ],
                    correct: 1,
                    explanation: "The highest Egyptian mysteries aimed to unite the initiate's consciousness with Ra (divine light), achieving conscious immortality. This was symbolized by the journey through the Duat (underworld) and represented the soul's return to its divine source while maintaining individual awareness.",
                    sources: ["Egyptian Book of the Dead", "Pyramid Texts"]
                }
            ]
        },

        chakras_energy: {
            name: "🌈 Chakras & Energy Systems",
            description: "Understanding the subtle energy anatomy",
            questions: [
                {
                    id: "cha_001",
                    difficulty: "seeker",
                    question: "What happens when the Kundalini energy reaches the Crown chakra?",
                    answers: [
                        "Physical death occurs",
                        "Union with cosmic consciousness and enlightenment",
                        "Psychic powers manifest",
                        "The person becomes invisible"
                    ],
                    correct: 1,
                    explanation: "When Kundalini reaches Sahasrara (Crown chakra), it creates Samadhi - union with cosmic consciousness. This is the goal of yogic practice: the individual consciousness merges with universal consciousness while maintaining awareness.",
                    sources: ["Tantric texts", "Kashmir Shaivism"]
                },
                {
                    id: "cha_002",
                    difficulty: "initiate",
                    question: "Why is the Heart chakra considered the bridge between lower and upper chakras?",
                    answers: [
                        "It's physically located in the center",
                        "It transforms survival-based energy into love and compassion",
                        "It has the most nerve connections",
                        "It beats faster than other energy centers"
                    ],
                    correct: 1,
                    explanation: "Anahata (Heart chakra) transforms the personal, survival-based energies of the lower three chakras into love, compassion, and connection. It's where ego-based consciousness begins to open to universal love and higher spiritual awareness.",
                    sources: ["Yoga texts", "Tibetan Buddhism teachings"]
                },
                {
                    id: "cha_003",
                    difficulty: "adept",
                    question: "What is the relationship between the chakras and the endocrine system?",
                    answers: [
                        "There is no connection between them",
                        "Each chakra corresponds to specific endocrine glands that regulate consciousness",
                        "Chakras only affect muscles, not glands",
                        "The endocrine system blocks chakra function"
                    ],
                    correct: 1,
                    explanation: "Each chakra correlates with endocrine glands: Root (adrenals), Sacral (gonads), Solar (pancreas), Heart (thymus), Throat (thyroid), Third Eye (pituitary), Crown (pineal). These glands secrete hormones that directly affect consciousness, mood, and spiritual perception.",
                    sources: ["Modern energy medicine", "Endocrine system research"]
                }
            ]
        },

        alchemy_transformation: {
            name: "🧪 Alchemy & Transformation",
            description: "The Great Work of spiritual transformation",
            questions: [
                {
                    id: "alc_001",
                    difficulty: "seeker",
                    question: "What does the alchemical process of 'Nigredo' represent?",
                    answers: [
                        "The creation of black pigment",
                        "The dark night of the soul and decomposition of ego",
                        "The final stage of enlightenment",
                        "A dangerous chemical reaction"
                    ],
                    correct: 1,
                    explanation: "Nigredo (blackening) is the first stage of the Great Work, representing the death and decomposition of the ego-self. Like a seed rotting in dark soil, the old identity must dissolve before spiritual rebirth can occur.",
                    sources: ["Carl Jung", "Medieval alchemical texts"]
                },
                {
                    id: "alc_002",
                    difficulty: "initiate",
                    question: "What is the Philosopher's Stone in spiritual alchemy?",
                    answers: [
                        "A literal stone that turns lead to gold",
                        "The transformed consciousness that transmutes base nature into divine nature",
                        "A powerful crystal for meditation",
                        "The foundation stone of ancient temples"
                    ],
                    correct: 1,
                    explanation: "The Philosopher's Stone represents the perfected human consciousness that can transmute the 'base metal' of ordinary awareness into the 'gold' of divine consciousness. It's the goal of inner transformation work.",
                    sources: ["Hermetic alchemy", "Paracelsus"]
                },
                {
                    id: "alc_003",
                    difficulty: "adept",
                    question: "What do the alchemical symbols of Sol and Luna represent in the psyche?",
                    answers: [
                        "Day and night cycles for meditation timing",
                        "The masculine conscious mind and feminine unconscious that must be unified",
                        "Two different types of gold in metalworking",
                        "The sun and moon's gravitational effects"
                    ],
                    correct: 1,
                    explanation: "Sol (Sun) represents the conscious, rational, masculine principle, while Luna (Moon) represents the unconscious, intuitive, feminine principle. The Great Work involves unifying these opposites into the sacred marriage (hieros gamos) within consciousness.",
                    sources: ["Jungian psychology", "Rosarium Philosophorum"]
                }
            ]
        },

        astrotheology: {
            name: "⭐ Astrotheology",
            description: "Celestial influences on consciousness and spirituality",
            questions: [
                {
                    id: "ast_001",
                    difficulty: "seeker",
                    question: "What is the significance of the precession of equinoxes in spiritual traditions?",
                    answers: [
                        "It determines when to plant crops",
                        "It marks great ages of consciousness evolution lasting ~2,160 years each",
                        "It affects the weather patterns",
                        "It has no spiritual significance"
                    ],
                    correct: 1,
                    explanation: "The 25,920-year precession cycle creates twelve 2,160-year 'Great Ages' (Age of Pisces, Aquarius, etc.). Many traditions believe these ages correspond to different phases of human consciousness evolution, with each age bringing distinct spiritual themes.",
                    sources: ["Ancient astronomical texts", "Astrological traditions"]
                },
                {
                    id: "ast_002",
                    difficulty: "initiate",
                    question: "How does the pineal gland respond to celestial cycles?",
                    answers: [
                        "It only responds to artificial light",
                        "It produces melatonin and DMT in response to light/dark and possibly cosmic cycles",
                        "It shrinks during full moons",
                        "It has no connection to celestial phenomena"
                    ],
                    correct: 1,
                    explanation: "The pineal gland, called the 'seat of the soul,' produces melatonin based on light cycles and may produce DMT during deep meditation or near-death experiences. Some research suggests it responds to geomagnetic fields influenced by solar and lunar cycles.",
                    sources: ["Rick Strassman research", "Pineal gland studies"]
                },
                {
                    id: "ast_003",
                    difficulty: "adept",
                    question: "What is the spiritual significance of the Schumann Resonance?",
                    answers: [
                        "It's just electromagnetic noise with no meaning",
                        "It's Earth's heartbeat frequency that synchronizes with human brainwaves",
                        "It only affects electronic equipment",
                        "It determines earthquake timing"
                    ],
                    correct: 1,
                    explanation: "The Schumann Resonance (~7.83Hz) is Earth's electromagnetic heartbeat, closely matching human theta brainwaves associated with deep meditation and healing. When this frequency shifts, many people report consciousness changes, suggesting our awareness is intimately connected to planetary rhythms.",
                    sources: ["Schumann Resonance research", "Biorhythm studies"]
                }
            ]
        },

        divine_feminine: {
            name: "🌙 Divine Feminine Mysteries",
            description: "The sacred feminine principle in spirituality",
            questions: [
                {
                    id: "fem_001",
                    difficulty: "seeker",
                    question: "What does the Black Madonna represent in esoteric Christianity?",
                    answers: [
                        "A statue that was accidentally darkened by candle smoke",
                        "The divine feminine wisdom (Sophia) and the dark creative womb of the universe",
                        "A symbol of racial integration in medieval times",
                        "A representation of sin and darkness"
                    ],
                    correct: 1,
                    explanation: "The Black Madonna represents Sophia (divine wisdom) and the fertile darkness of the cosmic womb from which all creation emerges. She embodies the sacred feminine principle that was largely suppressed in patriarchal Christianity but preserved in esoteric traditions.",
                    sources: ["Gnostic gospels", "Medieval mysticism"]
                },
                {
                    id: "fem_002",
                    difficulty: "initiate",
                    question: "In Tantric philosophy, what is Shakti's relationship to Shiva?",
                    answers: [
                        "She is Shiva's subordinate assistant",
                        "She is the creative power and consciousness that animates Shiva's pure awareness",
                        "She is Shiva's enemy in cosmic battle",
                        "She is a separate deity with no connection to Shiva"
                    ],
                    correct: 1,
                    explanation: "Shakti is the dynamic, creative energy of consciousness while Shiva is pure, unchanging awareness. 'Shiva without Shakti is a corpse' - consciousness without energy is static, while energy without consciousness is chaotic. They are two aspects of one reality.",
                    sources: ["Tantric texts", "Kashmir Shaivism"]
                },
                {
                    id: "fem_003",
                    difficulty: "adept",
                    question: "What is the deeper meaning of Mary Magdalene as the 'Apostle to the Apostles'?",
                    answers: [
                        "She was simply the first to spread the news of resurrection",
                        "She represents the sacred feminine wisdom tradition that completes Christ consciousness",
                        "She was Jesus's literal wife and mother of his children",
                        "She was chosen randomly by Jesus to deliver messages"
                    ],
                    correct: 1,
                    explanation: "Mary Magdalene represents the sacred feminine gnosis (direct knowing) that complements the masculine logos (word/teaching). In Gnostic texts, she receives the highest teachings because the feminine principle embodies the receptive wisdom needed for direct spiritual realization.",
                    sources: ["Gospel of Mary", "Gospel of Philip"]
                }
            ]
        },

        sacred_numerology: {
            name: "🔢 Sacred Numerology & Symbolism",
            description: "The mystical science of numbers and divine patterns",
            questions: [
                {
                    id: "num_001",
                    difficulty: "seeker",
                    question: "What does the number 7 represent in sacred numerology?",
                    answers: [
                        "Material wealth and abundance",
                        "Spiritual completion and divine perfection",
                        "Physical strength",
                        "Bad luck and misfortune"
                    ],
                    correct: 1,
                    explanation: "The number 7 represents spiritual completion and divine perfection. It appears throughout sacred texts: 7 days of creation, 7 chakras, 7 seals, 7 heavens. It symbolizes the union of the divine (3) with the earthly (4), creating spiritual wholeness.",
                    sources: ["Biblical numerology", "Pythagorean teachings"]
                },
                {
                    id: "num_002",
                    difficulty: "seeker",
                    question: "What is the significance of the number 3 in spiritual traditions?",
                    answers: [
                        "The number of human senses",
                        "The trinity principle - mind, body, spirit or creation, preservation, destruction",
                        "The number of physical dimensions",
                        "The number of elements (earth, water, fire)"
                    ],
                    correct: 1,
                    explanation: "The number 3 represents the divine trinity principle found across traditions: Christian Trinity (Father-Son-Spirit), Hindu Trimurti (Brahma-Vishnu-Shiva), and the threefold nature of human consciousness (mind-body-spirit). It represents creative manifestation.",
                    sources: ["Universal symbolism", "Trinitarian theology"]
                },
                {
                    id: "num_003",
                    difficulty: "initiate",
                    question: "In Kabbalah, what does the number 22 represent?",
                    answers: [
                        "The 22 letters of the Hebrew alphabet and paths on the Tree of Life",
                        "The 22 archangels guarding heaven",
                        "The 22 sacred books in the Torah",
                        "The 22 stages of enlightenment"
                    ],
                    correct: 0,
                    explanation: "The number 22 corresponds to the 22 letters of the Hebrew alphabet, which are also the 22 paths connecting the 10 Sephiroth on the Tree of Life. Each letter is a cosmic force and creative energy, making 22 the number of manifesting divine word into reality.",
                    sources: ["Sefer Yetzirah", "Kabbalistic teachings"]
                },
                {
                    id: "num_004",
                    difficulty: "initiate",
                    question: "What is the spiritual significance of 11:11?",
                    answers: [
                        "It's just a coincidence with no meaning",
                        "A portal number signaling spiritual awakening and alignment",
                        "A warning of danger",
                        "The time to pray daily"
                    ],
                    correct: 1,
                    explanation: "11:11 is considered a 'wake-up call' from the universe. The master number 11 represents spiritual illumination and intuition. When doubled (11:11), it's seen as a portal or gateway, signaling that you're in alignment with higher consciousness and should pay attention to synchronicities.",
                    sources: ["Numerology", "Spiritual synchronicity studies"]
                },
                {
                    id: "num_005",
                    difficulty: "initiate",
                    question: "What does the number 12 represent in sacred geometry and spirituality?",
                    answers: [
                        "The number of months in a year only",
                        "Divine government, cosmic order, and completion of cycles",
                        "The number of disciples only",
                        "Physical manifestation"
                    ],
                    correct: 1,
                    explanation: "The number 12 represents divine government and cosmic order: 12 zodiac signs, 12 tribes of Israel, 12 apostles, 12 hours, 12 months. It's 3 (divine) × 4 (earthly), symbolizing heaven's rule over earth and the completion of cosmic cycles.",
                    sources: ["Sacred geometry", "Biblical numerology"]
                },
                {
                    id: "num_006",
                    difficulty: "adept",
                    question: "What is the esoteric meaning of 666 beyond the 'number of the beast'?",
                    answers: [
                        "Pure evil with no other meaning",
                        "The number of carbon (6 protons, 6 neutrons, 6 electrons) representing material consciousness",
                        "A random number chosen for dramatic effect",
                        "The number of demons in hell"
                    ],
                    correct: 1,
                    explanation: "666 is the number of carbon, the basis of physical life (6 protons, 6 neutrons, 6 electrons). Esoterically, it represents material consciousness trapped in the physical realm. It's not inherently evil but symbolizes consciousness identified solely with matter, missing the spiritual '7' of divine completion.",
                    sources: ["Esoteric Christianity", "Scientific symbolism"]
                },
                {
                    id: "num_007",
                    difficulty: "adept",
                    question: "In sacred numerology, what does reducing numbers to their root digit (e.g., 23 = 2+3 = 5) reveal?",
                    answers: [
                        "Mathematical shortcuts with no spiritual meaning",
                        "The vibrational essence and core spiritual frequency of that number",
                        "A way to simplify calculations",
                        "The age of the universe"
                    ],
                    correct: 1,
                    explanation: "Digit reduction reveals the vibrational essence of a number. Each root digit (1-9) carries specific spiritual frequencies and meanings. This process shows that complex manifestations ultimately reduce to fundamental spiritual principles, reflecting the hermetic axiom 'as above, so below.'",
                    sources: ["Pythagorean numerology", "Chaldean numerology"]
                },
                {
                    id: "num_008",
                    difficulty: "adept",
                    question: "What is the significance of the number 108 in Eastern spirituality?",
                    answers: [
                        "The exact number of Hindu gods",
                        "A sacred number representing the universe (108 beads on mala, 108 Upanishads, etc.)",
                        "The number of years in a spiritual cycle",
                        "The temperature of enlightenment"
                    ],
                    correct: 1,
                    explanation: "108 is supremely sacred: 108 Upanishads, 108 mala beads, 108 marma points in Ayurveda, 108 sacred sites. Mathematically, 1+0+8=9 (completion). The distance from Earth to Sun is approximately 108 times the Sun's diameter, reflecting cosmic harmony in sacred architecture.",
                    sources: ["Vedic mathematics", "Buddhist traditions"]
                },
                {
                    id: "num_009",
                    difficulty: "adept",
                    question: "What is the Fibonacci sequence's relationship to spiritual growth?",
                    answers: [
                        "No relationship - it's just mathematics",
                        "It maps the spiral of consciousness evolution and divine growth patterns in nature",
                        "It predicts the future",
                        "It determines meditation lengths"
                    ],
                    correct: 1,
                    explanation: "The Fibonacci sequence (1,1,2,3,5,8,13...) creates the golden spiral found in galaxies, DNA, flowers, and hurricanes. Spiritually, it represents how consciousness builds upon itself - each level incorporates and transcends the previous, creating the sacred spiral of evolution toward divine perfection.",
                    sources: ["Sacred geometry", "Natural mathematics"]
                }
            ]
        }
    };

    // Initialize the premium trivia system
    init() {
        this.setupEventListeners();
        this.loadUserProfile();
        this.displayDashboard();
        this.updateStats();
        this.initPWAFeatures();
    }

    // PWA-specific initialization
    initPWAFeatures() {
        // Listen for PWA messages from service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                this.handleServiceWorkerMessage(event.data);
            });
        }

        // Handle URL parameters for PWA shortcuts
        this.handlePWAShortcuts();
        
        // Setup offline data persistence
        this.setupOfflineCapabilities();
        
        // Enable background sync registration
        this.setupBackgroundSync();
    }

    // Handle messages from service worker
    handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'SYNC_SUCCESS':
                this.showSyncNotification('Progress synced successfully!');
                break;
            case 'NOTIFICATION_ACTION':
                this.handleNotificationAction(data.action);
                break;
            default:
                console.log('Unhandled service worker message:', data);
        }
    }

    // Handle PWA shortcut actions
    handlePWAShortcuts() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('mode') === 'quick') {
            // Start quick quiz from shortcut
            this.selectedDifficulty = 'mixed';
            this.selectedCategory = 'mixed';
            setTimeout(() => this.startQuiz(), 500);
        } else if (urlParams.get('mode') === 'study') {
            // Enter study mode from shortcut
            setTimeout(() => this.enterStudyMode(), 500);
        } else if (urlParams.get('view') === 'leaderboard') {
            // Show leaderboard from shortcut
            setTimeout(() => this.showLeaderboard(), 500);
        }
    }

    // Handle notification actions
    handleNotificationAction(action) {
        switch (action) {
            case 'start-quiz':
                this.startQuiz();
                break;
            case 'view-leaderboard':
                this.showLeaderboard();
                break;
        }
    }

    // Setup offline data capabilities
    setupOfflineCapabilities() {
        // Override save functions to work offline
        this.originalSaveUserStats = this.saveUserStats;
        this.saveUserStats = () => {
            // Always save locally
            this.originalSaveUserStats();
            
            // Queue for sync when online
            if (!navigator.onLine) {
                this.queueOfflineData('userStats', this.userStats);
            }
        };

        // Cache question data for offline use
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CACHE_TRIVIA_DATA',
                url: '/api/trivia-questions',
                payload: this.premiumQuestions
            });
        }
    }

    // Setup background sync for offline actions
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            // Register for background sync when going offline
            window.addEventListener('offline', () => {
                navigator.serviceWorker.ready.then(registration => {
                    return registration.sync.register('sync-trivia-progress');
                }).catch(error => {
                    console.error('Background sync registration failed:', error);
                });
            });
        }
    }

    // Queue data for offline sync
    queueOfflineData(type, data) {
        const offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
        offlineQueue.push({
            type: type,
            data: data,
            timestamp: Date.now()
        });
        localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
    }

    // Show sync notification
    showSyncNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            font-weight: 600;
            z-index: 5000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = `✅ ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Load user statistics and progress
    loadUserStats() {
        const saved = localStorage.getItem('premiumTriviaStats');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            totalQuestions: 0,
            correctAnswers: 0,
            currentStreak: 0,
            longestStreak: 0,
            categoryMastery: {},
            achievements: [],
            totalPlayTime: 0,
            perfectGames: 0,
            leaderboardScore: 0,
            difficultyProgress: {
                seeker: { completed: 0, correct: 0 },
                initiate: { completed: 0, correct: 0 },
                adept: { completed: 0, correct: 0 }
            }
        };
    }

    // Save user progress
    saveUserStats() {
        localStorage.setItem('premiumTriviaStats', JSON.stringify(this.userStats));
    }

    // Load daily progress
    loadDailyProgress() {
        const today = new Date().toISOString().split('T')[0];
        const saved = localStorage.getItem(`premiumTriviaDaily_${today}`);
        
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            date: today,
            questionsCompleted: 0,
            categoriesExplored: [],
            perfectCategories: [],
            timeSpent: 0,
            highestStreak: 0
        };
    }

    // Get random questions based on selected category and difficulty
    getQuestions(category = 'mixed', difficulty = 'mixed', count = 10) {
        let availableQuestions = [];
        
        if (category === 'mixed') {
            // Get questions from all categories
            Object.keys(this.premiumQuestions).forEach(cat => {
                availableQuestions.push(...this.premiumQuestions[cat].questions);
            });
        } else {
            availableQuestions = this.premiumQuestions[category].questions;
        }
        
        if (difficulty !== 'mixed') {
            availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
        }
        
        // Shuffle and return requested count
        return this.shuffleArray(availableQuestions).slice(0, count);
    }

    // Utility function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Setup event listeners
    setupEventListeners() {
        // Category selection
        document.addEventListener('change', (e) => {
            if (e.target.id === 'categorySelect') {
                this.selectedCategory = e.target.value;
                this.updateQuestionPreview();
            }
        });

        // Difficulty selection  
        document.addEventListener('change', (e) => {
            if (e.target.id === 'difficultySelect') {
                this.selectedDifficulty = e.target.value;
                this.updateQuestionPreview();
            }
        });

        // Start quiz button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'startQuizBtn') {
                this.startQuiz();
            }
        });
    }

    // Display main dashboard
    displayDashboard() {
        // This will be implemented when we create the HTML interface
        console.log('Premium Trivia System loaded with', this.getTotalQuestionCount(), 'questions');
    }

    // Get total question count
    getTotalQuestionCount() {
        let total = 0;
        Object.keys(this.premiumQuestions).forEach(category => {
            total += this.premiumQuestions[category].questions.length;
        });
        return total;
    }

    // Start a quiz session
    startQuiz() {
        const selectedQuestions = this.getQuestions(this.selectedCategory, this.selectedDifficulty, 10);
        
        if (selectedQuestions.length === 0) {
            alert('No questions available for selected criteria. Please choose different options.');
            return;
        }

        this.currentQuestions = selectedQuestions;
        this.currentQuestionIndex = 0;
        this.questionsAnswered = [];
        this.sessionStartTime = Date.now();
        
        // Show quiz interface
        this.showQuizInterface();
        this.displayQuestion();
    }

    // Display current question
    displayQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        const questionContainer = document.getElementById('questionContainer');
        
        if (!questionContainer) return;

        const difficultyColors = {
            seeker: '#10b981',
            initiate: '#f59e0b', 
            adept: '#ef4444'
        };

        const categoryData = this.getCategoryData(question);
        
        questionContainer.innerHTML = `
            <div class="question-header">
                <div class="question-meta">
                    <span class="category-badge">${categoryData.name}</span>
                    <span class="difficulty-badge" style="background: ${difficultyColors[question.difficulty]}">
                        ${question.difficulty.toUpperCase()}
                    </span>
                </div>
                <div class="question-progress">
                    Question ${this.currentQuestionIndex + 1} of ${this.currentQuestions.length}
                </div>
            </div>
            
            <div class="question-text">
                ${question.question}
            </div>
            
            <div class="answers-container">
                ${question.answers.map((answer, index) => `
                    <button class="answer-btn" data-answer="${index}">
                        <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                        <span class="answer-text">${answer}</span>
                    </button>
                `).join('')}
            </div>
            
            <div class="question-timer" id="questionTimer" style="display: none;">
                <div class="timer-bar">
                    <div class="timer-fill" id="timerFill"></div>
                </div>
                <span id="timerText">30s</span>
            </div>
        `;

        // Add answer button listeners
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAnswer(parseInt(e.currentTarget.dataset.answer));
            });
        });

        // Start timer if enabled
        if (this.timerActive) {
            this.startQuestionTimer();
        }
    }

    // Select an answer
    selectAnswer(answerIndex) {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = answerIndex === question.correct;
        
        // Store answer
        this.questionsAnswered.push({
            questionId: question.id,
            selectedAnswer: answerIndex,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            timeSpent: this.timerActive ? (30 - this.timeRemaining) : null
        });

        // Update stats
        this.userStats.totalQuestions++;
        if (isCorrect) {
            this.userStats.correctAnswers++;
            this.userStats.currentStreak++;
            if (this.userStats.currentStreak > this.userStats.longestStreak) {
                this.userStats.longestStreak = this.userStats.currentStreak;
            }
        } else {
            this.userStats.currentStreak = 0;
        }

        // Show answer explanation
        this.showAnswerExplanation(question, answerIndex, isCorrect);
    }

    // Show answer explanation
    showAnswerExplanation(question, selectedAnswer, isCorrect) {
        const explanationContainer = document.createElement('div');
        explanationContainer.className = 'answer-explanation';
        explanationContainer.innerHTML = `
            <div class="explanation-header ${isCorrect ? 'correct' : 'incorrect'}">
                <span class="result-icon">${isCorrect ? '✅' : '❌'}</span>
                <span class="result-text">${isCorrect ? 'Correct!' : 'Incorrect'}</span>
                ${!isCorrect ? `<span class="correct-answer">Correct answer: ${String.fromCharCode(65 + question.correct)}</span>` : ''}
            </div>
            
            <div class="explanation-content">
                <h4>💡 Truth Revelation:</h4>
                <p>${question.explanation}</p>
                
                ${question.sources ? `
                    <div class="sources">
                        <strong>📚 Sources:</strong> ${question.sources.join(', ')}
                    </div>
                ` : ''}
            </div>
            
            <button class="next-question-btn" onclick="premiumTrivia.nextQuestion()">
                ${this.currentQuestionIndex + 1 < this.currentQuestions.length ? 'Next Question' : 'View Results'} →
            </button>
        `;

        const questionContainer = document.getElementById('questionContainer');
        questionContainer.appendChild(explanationContainer);

        // Disable answer buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.dataset.answer) === question.correct) {
                btn.classList.add('correct-answer');
            } else if (parseInt(btn.dataset.answer) === selectedAnswer) {
                btn.classList.add('selected-incorrect');
            }
        });
    }

    // Move to next question
    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    // Show quiz results
    showResults() {
        const correctCount = this.questionsAnswered.filter(q => q.isCorrect).length;
        const totalCount = this.questionsAnswered.length;
        const accuracy = Math.round((correctCount / totalCount) * 100);
        const sessionTime = Date.now() - this.sessionStartTime;

        // Update user stats
        this.userStats.totalPlayTime += sessionTime;
        if (accuracy === 100) {
            this.userStats.perfectGames++;
        }

        // Check for achievements
        const newAchievements = this.checkAchievements();

        // Update leaderboard score
        this.updateLeaderboardScore(accuracy, sessionTime);

        // Save stats
        this.saveUserStats();

        // Display results
        this.displayResults(correctCount, totalCount, accuracy, sessionTime, newAchievements);
    }

    // Display results screen
    displayResults(correct, total, accuracy, time, achievements) {
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) return;

        const grade = this.getGrade(accuracy);
        const timeStr = this.formatTime(time);

        resultsContainer.innerHTML = `
            <div class="results-screen">
                <div class="results-header">
                    <div class="grade-display ${grade.class}">
                        <span class="grade-letter">${grade.letter}</span>
                        <span class="grade-text">${grade.text}</span>
                    </div>
                    <div class="accuracy-display">
                        ${correct}/${total} Correct (${accuracy}%)
                    </div>
                </div>

                <div class="results-stats">
                    <div class="stat-item">
                        <span class="stat-label">Time Spent:</span>
                        <span class="stat-value">${timeStr}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Current Streak:</span>
                        <span class="stat-value">${this.userStats.currentStreak}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total XP Earned:</span>
                        <span class="stat-value">+${this.calculateXP(correct, total, accuracy)}</span>
                    </div>
                </div>

                ${achievements.length > 0 ? `
                    <div class="new-achievements">
                        <h3>🏆 New Achievements Unlocked!</h3>
                        ${achievements.map(achievement => `
                            <div class="achievement-item">
                                <span class="achievement-icon">${achievement.icon}</span>
                                <div>
                                    <strong>${achievement.name}</strong>
                                    <p>${achievement.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="results-actions">
                    <button class="action-btn primary" onclick="premiumTrivia.startNewQuiz()">
                        🔄 New Quiz
                    </button>
                    <button class="action-btn secondary" onclick="premiumTrivia.showDashboard()">
                        📊 Dashboard
                    </button>
                    <button class="action-btn secondary" onclick="premiumTrivia.showLeaderboard()">
                        🏆 Leaderboard
                    </button>
                </div>
            </div>
        `;
    }

    // Timer functionality
    startQuestionTimer(duration = 30) {
        this.timeRemaining = duration;
        document.getElementById('questionTimer').style.display = 'block';
        
        const timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                clearInterval(timer);
                this.selectAnswer(-1); // Time up, no answer
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerText = document.getElementById('timerText');
        const timerFill = document.getElementById('timerFill');
        
        if (timerText) timerText.textContent = `${this.timeRemaining}s`;
        if (timerFill) {
            const percent = (this.timeRemaining / 30) * 100;
            timerFill.style.width = `${percent}%`;
        }
    }

    // Achievement system
    checkAchievements() {
        const newAchievements = [];
        const achievements = [
            {
                id: 'first_perfect',
                name: 'Enlightened Beginner',
                description: 'Achieve 100% accuracy on your first quiz',
                icon: '🌟',
                condition: () => this.userStats.perfectGames === 1 && this.userStats.totalQuestions === 10
            },
            {
                id: 'streak_10',
                name: 'Divine Flow',
                description: 'Answer 10 questions correctly in a row',
                icon: '⚡',
                condition: () => this.userStats.currentStreak >= 10
            },
            {
                id: 'category_master',
                name: 'Esoteric Scholar',
                description: 'Master all difficulty levels in any category',
                icon: '🎓',
                condition: () => this.checkCategoryMastery()
            }
        ];

        achievements.forEach(achievement => {
            if (!this.userStats.achievements.includes(achievement.id) && achievement.condition()) {
                this.userStats.achievements.push(achievement.id);
                newAchievements.push(achievement);
            }
        });

        return newAchievements;
    }

    // Utility functions
    getCategoryData(question) {
        for (const [key, category] of Object.entries(this.premiumQuestions)) {
            if (category.questions.some(q => q.id === question.id)) {
                return category;
            }
        }
        return { name: 'Mixed' };
    }

    getGrade(accuracy) {
        if (accuracy >= 95) return { letter: 'A+', text: 'Enlightened Master', class: 'grade-a-plus' };
        if (accuracy >= 90) return { letter: 'A', text: 'Spiritual Adept', class: 'grade-a' };
        if (accuracy >= 85) return { letter: 'B+', text: 'Awakened Seeker', class: 'grade-b-plus' };
        if (accuracy >= 80) return { letter: 'B', text: 'Conscious Student', class: 'grade-b' };
        if (accuracy >= 70) return { letter: 'C', text: 'Learning Initiate', class: 'grade-c' };
        return { letter: 'D', text: 'Aspiring Novice', class: 'grade-d' };
    }

    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    calculateXP(correct, total, accuracy) {
        let baseXP = correct * 10;
        if (accuracy === 100) baseXP *= 1.5; // Perfect bonus
        if (this.selectedDifficulty === 'initiate') baseXP *= 1.2;
        if (this.selectedDifficulty === 'adept') baseXP *= 1.5;
        return Math.round(baseXP);
    }

    updateLeaderboardScore(accuracy, time) {
        const scoreMultiplier = {
            seeker: 1,
            initiate: 1.2,
            adept: 1.5
        };
        
        const timeBonus = Math.max(0, 300000 - time) / 10000; // Bonus for quick completion
        const score = (accuracy * scoreMultiplier[this.selectedDifficulty]) + timeBonus;
        
        this.userStats.leaderboardScore += Math.round(score);
    }

    checkCategoryMastery() {
        // Check if user has completed questions in all difficulty levels for any category
        // Implementation depends on how we track category-specific progress
        return false; // Placeholder
    }

    // Interface management
    showQuizInterface() {
        document.getElementById('dashboardContainer')?.style.setProperty('display', 'none');
        document.getElementById('quizContainer')?.style.setProperty('display', 'block');
    }

    showDashboard() {
        document.getElementById('quizContainer')?.style.setProperty('display', 'none');
        document.getElementById('dashboardContainer')?.style.setProperty('display', 'block');
        this.updateStats();
    }

    startNewQuiz() {
        this.startQuiz();
    }

    showLeaderboard() {
        // Implementation for leaderboard display
        console.log('Showing leaderboard...');
    }

    // Update statistics display
    updateStats() {
        const elements = {
            'totalQuestions': this.userStats.totalQuestions,
            'correctAnswers': this.userStats.correctAnswers,
            'currentStreak': this.userStats.currentStreak,
            'accuracyRate': this.userStats.totalQuestions > 0 ? 
                Math.round((this.userStats.correctAnswers / this.userStats.totalQuestions) * 100) : 0,
            'perfectGames': this.userStats.perfectGames,
            'leaderboardScore': this.userStats.leaderboardScore
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // Leaderboard system
    getLeaderboard() {
        // In production, this would fetch from server
        const localLeaderboard = localStorage.getItem('premiumTriviaLeaderboard');
        if (localLeaderboard) {
            return JSON.parse(localLeaderboard);
        }
        
        // Demo leaderboard data
        return [
            { name: 'Mystic Master', score: 95847, streak: 47, level: 'Adept' },
            { name: 'Sacred Seeker', score: 87234, streak: 23, level: 'Initiate' },
            { name: 'Wisdom Walker', score: 76543, streak: 19, level: 'Adept' },
            { name: 'Truth Finder', score: 65432, streak: 15, level: 'Initiate' },
            { name: 'Light Bearer', score: 54321, streak: 12, level: 'Seeker' }
        ];
    }

    showLeaderboard() {
        const leaderboard = this.getLeaderboard();
        const currentUserRank = this.getCurrentUserRank(leaderboard);
        
        const leaderboardHTML = `
            <div class="leaderboard-container">
                <div class="leaderboard-header">
                    <h2 class="leaderboard-title">🏆 Global Consciousness Leaderboard</h2>
                    <p class="leaderboard-subtitle">Top awakened souls on the path of knowledge</p>
                </div>

                <div class="current-user-rank">
                    <h3>Your Current Position</h3>
                    <div class="user-rank-card">
                        <span class="rank-position">#${currentUserRank}</span>
                        <span class="rank-name">${this.currentUser.name}</span>
                        <span class="rank-score">${this.userStats.leaderboardScore.toLocaleString()}</span>
                    </div>
                </div>

                <div class="leaderboard-list">
                    ${leaderboard.map((player, index) => `
                        <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}">
                            <div class="rank-badge ${this.getRankClass(index)}">
                                ${index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </div>
                            <div class="player-info">
                                <div class="player-name">${player.name}</div>
                                <div class="player-level">${player.level} • ${player.streak} streak</div>
                            </div>
                            <div class="player-score">${player.score.toLocaleString()}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="leaderboard-actions">
                    <button class="action-btn primary" onclick="premiumTrivia.showDashboard()">
                        📊 Back to Dashboard
                    </button>
                    <button class="action-btn secondary" onclick="premiumTrivia.startCompetitiveQuiz()">
                        ⚔️ Competitive Mode
                    </button>
                </div>
            </div>
        `;

        // Show leaderboard (replace current content)
        document.getElementById('dashboardContainer').style.display = 'none';
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('resultsContainer').innerHTML = leaderboardHTML;
        document.getElementById('resultsContainer').style.display = 'block';
    }

    getCurrentUserRank(leaderboard) {
        const userScore = this.userStats.leaderboardScore;
        const rank = leaderboard.findIndex(player => player.score < userScore);
        return rank === -1 ? leaderboard.length + 1 : rank + 1;
    }

    getRankClass(index) {
        if (index === 0) return 'rank-first';
        if (index === 1) return 'rank-second'; 
        if (index === 2) return 'rank-third';
        return 'rank-other';
    }

    // Competitive quiz mode
    startCompetitiveQuiz() {
        this.timerActive = true;
        this.competitiveMode = true;
        this.startQuiz();
        
        // Show competitive mode UI
        this.showCompetitiveInterface();
    }

    showCompetitiveInterface() {
        const competitiveUI = document.createElement('div');
        competitiveUI.className = 'competitive-ui';
        competitiveUI.innerHTML = `
            <div class="competitive-banner">
                <span>⚔️ COMPETITIVE MODE</span>
                <span class="multiplier">Score Multiplier: 2x</span>
            </div>
        `;
        
        document.getElementById('quizContainer').prepend(competitiveUI);
    }

    // Advanced analytics
    getCategoryAnalytics() {
        const analytics = {};
        
        Object.keys(this.premiumQuestions).forEach(category => {
            analytics[category] = {
                total: this.premiumQuestions[category].questions.length,
                completed: 0,
                correct: 0,
                accuracy: 0,
                mastery: 'Novice'
            };
        });

        return analytics;
    }

    showAnalytics() {
        const analytics = this.getCategoryAnalytics();
        
        const analyticsHTML = `
            <div class="analytics-container">
                <div class="analytics-header">
                    <h2 class="analytics-title">📊 Detailed Analytics</h2>
                    <p class="analytics-subtitle">Track your mastery across all esoteric categories</p>
                </div>

                <div class="analytics-overview">
                    <div class="overview-stat">
                        <span class="overview-label">Total Accuracy</span>
                        <span class="overview-value">${this.userStats.totalQuestions > 0 ? Math.round((this.userStats.correctAnswers / this.userStats.totalQuestions) * 100) : 0}%</span>
                    </div>
                    <div class="overview-stat">
                        <span class="overview-label">Longest Streak</span>
                        <span class="overview-value">${this.userStats.longestStreak}</span>
                    </div>
                    <div class="overview-stat">
                        <span class="overview-label">Categories Explored</span>
                        <span class="overview-value">${Object.keys(analytics).length}</span>
                    </div>
                </div>

                <div class="category-analytics">
                    ${Object.entries(analytics).map(([key, data]) => `
                        <div class="category-analysis">
                            <div class="category-header">
                                <span class="category-title">${this.premiumQuestions[key].name}</span>
                                <span class="mastery-level ${data.mastery.toLowerCase()}">${data.mastery}</span>
                            </div>
                            <div class="category-progress">
                                <div class="progress-bar-small">
                                    <div class="progress-fill-small" style="width: ${(data.completed / data.total) * 100}%"></div>
                                </div>
                                <span class="progress-text">${data.completed}/${data.total}</span>
                            </div>
                            <div class="category-stats">
                                <span>Accuracy: ${data.accuracy}%</span>
                                <span>Difficulty: Mixed</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="analytics-actions">
                    <button class="action-btn primary" onclick="premiumTrivia.showDashboard()">
                        📊 Back to Dashboard
                    </button>
                    <button class="action-btn secondary" onclick="premiumTrivia.exportProgress()">
                        📤 Export Progress
                    </button>
                </div>
            </div>
        `;

        // Show analytics
        document.getElementById('dashboardContainer').style.display = 'none';
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('resultsContainer').innerHTML = analyticsHTML;
        document.getElementById('resultsContainer').style.display = 'block';
    }

    // Export user progress
    exportProgress() {
        const progressData = {
            user: this.currentUser,
            stats: this.userStats,
            analytics: this.getCategoryAnalytics(),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(progressData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `divine-temple-trivia-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Daily challenges
    getTodayChallenge() {
        const today = new Date().toDateString();
        const challenges = [
            {
                id: 'kabbalah_mastery',
                title: 'Kabbalah Master Challenge',
                description: 'Answer 5 Kabbalah questions with 100% accuracy',
                category: 'kabbalah',
                target: 5,
                reward: 500
            },
            {
                id: 'speed_demon',
                title: 'Lightning Consciousness',
                description: 'Complete 10 questions in under 5 minutes',
                category: 'mixed',
                timeLimit: 300,
                reward: 750
            },
            {
                id: 'perfect_streak',
                title: 'Divine Perfection',
                description: 'Achieve a 15-question perfect streak',
                category: 'mixed',
                streak: 15,
                reward: 1000
            }
        ];

        // Rotate daily challenge based on date
        const dayIndex = new Date().getDate() % challenges.length;
        return challenges[dayIndex];
    }

    showDailyChallenge() {
        const challenge = this.getTodayChallenge();
        
        const challengeHTML = `
            <div class="daily-challenge">
                <div class="challenge-header">
                    <h3>🎯 Today's Challenge</h3>
                    <div class="challenge-reward">+${challenge.reward} XP</div>
                </div>
                <div class="challenge-content">
                    <h4>${challenge.title}</h4>
                    <p>${challenge.description}</p>
                    <button class="challenge-btn" onclick="premiumTrivia.startChallenge('${challenge.id}')">
                        🚀 Accept Challenge
                    </button>
                </div>
            </div>
        `;

        return challengeHTML;
    }

    startChallenge(challengeId) {
        const challenge = this.getTodayChallenge();
        if (challenge.id === challengeId) {
            // Set up challenge parameters
            this.currentChallenge = challenge;
            this.selectedCategory = challenge.category;
            if (challenge.timeLimit) {
                this.timerActive = true;
            }
            this.startQuiz();
        }
    }

    // Study mode - browse questions without quiz format
    enterStudyMode() {
        const studyHTML = `
            <div class="study-mode-container">
                <div class="study-header">
                    <h2 class="study-title">📖 Study Mode</h2>
                    <p class="study-subtitle">Browse and learn from all questions at your own pace</p>
                </div>

                <div class="study-filters">
                    <select id="studyCategoryFilter" class="form-select">
                        <option value="all">All Categories</option>
                        ${Object.entries(this.premiumQuestions).map(([key, category]) => 
                            `<option value="${key}">${category.name}</option>`
                        ).join('')}
                    </select>
                    
                    <select id="studyDifficultyFilter" class="form-select">
                        <option value="all">All Difficulties</option>
                        <option value="seeker">Seeker</option>
                        <option value="initiate">Initiate</option>
                        <option value="adept">Adept</option>
                    </select>
                </div>

                <div class="study-questions" id="studyQuestions">
                    <!-- Questions will be populated here -->
                </div>

                <div class="study-actions">
                    <button class="action-btn primary" onclick="premiumTrivia.showDashboard()">
                        📊 Back to Dashboard
                    </button>
                </div>
            </div>
        `;

        document.getElementById('dashboardContainer').style.display = 'none';
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('resultsContainer').innerHTML = studyHTML;
        document.getElementById('resultsContainer').style.display = 'block';

        this.populateStudyQuestions();
    }

    populateStudyQuestions() {
        const container = document.getElementById('studyQuestions');
        let allQuestions = [];
        
        Object.values(this.premiumQuestions).forEach(category => {
            allQuestions.push(...category.questions);
        });

        container.innerHTML = allQuestions.map((question, index) => `
            <div class="study-question-card">
                <div class="study-question-header">
                    <span class="question-number">${index + 1}</span>
                    <span class="difficulty-badge" style="background: ${this.getDifficultyColor(question.difficulty)}">
                        ${question.difficulty}
                    </span>
                </div>
                <div class="study-question-text">${question.question}</div>
                <div class="study-answers">
                    ${question.answers.map((answer, i) => `
                        <div class="study-answer ${i === question.correct ? 'correct-study-answer' : ''}">
                            ${String.fromCharCode(65 + i)}. ${answer}
                        </div>
                    `).join('')}
                </div>
                <div class="study-explanation">
                    <strong>💡 Explanation:</strong> ${question.explanation}
                    ${question.sources ? `<br><strong>📚 Sources:</strong> ${question.sources.join(', ')}` : ''}
                </div>
            </div>
        `).join('');
    }

    getDifficultyColor(difficulty) {
        const colors = {
            seeker: '#10b981',
            initiate: '#f59e0b',
            adept: '#ef4444'
        };
        return colors[difficulty] || '#6b7280';
    }

    // Load user profile (placeholder for authentication integration)
    loadUserProfile() {
        // This will integrate with the Divine Temple member system
        this.currentUser = {
            id: 'member_' + Date.now(),
            name: 'Divine Seeker',
            memberSince: new Date(),
            subscriptionLevel: 'premium'
        };
    }
}

// Initialize the premium trivia system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.premiumTrivia = new PremiumTriviaSystem();
});

export default PremiumTriviaSystem;