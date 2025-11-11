/**
 * 🧘 ENHANCED CHAKRA MEMORY MATCH SYSTEM
 * Beautiful memory matching game with chakra theme
 * Version 2.0 - Enhanced with sound effects and improved memory persistence
 *
 * New Features:
 * - Immersive sound effects and background music
 * - Fixed memory persistence issues
 * - Enhanced visual feedback
 * - Better error handling and debugging
 * - Improved user experience
 */

class ChakraMemoryGameEnhanced {
    constructor() {
        this.currentUser = null;
        this.gameData = null;
        this.selectedMode = null;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isProcessing = false;
        this.debugMode = true;

        // Sound system
        this.sounds = {
            flip: null,
            match: null,
            victory: null,
            perfect: null,
            background: null,
            error: null,
            click: null
        };
        this.soundEnabled = true;
        this.musicEnabled = true;

        // Initialize sound effects
        this.initSounds();

        // Chakra card database - 24 unique cards (12 pairs for hard mode)
        this.chakraCards = [
            // Root Chakra - Muladhara
            {
                id: 'root-symbol',
                chakra: 'Root',
                type: 'symbol',
                icon: '🔴',
                text: 'Root Symbol',
                color: '#E53E3E',
                pair: 'root-name'
            },
            {
                id: 'root-name',
                chakra: 'Root',
                type: 'name',
                icon: '🪨',
                text: 'Muladhara',
                color: '#E53E3E',
                pair: 'root-symbol'
            },

            // Sacral Chakra - Svadhisthana
            {
                id: 'sacral-symbol',
                chakra: 'Sacral',
                type: 'symbol',
                icon: '🟠',
                text: 'Sacral Symbol',
                color: '#ED8936',
                pair: 'sacral-name'
            },
            {
                id: 'sacral-name',
                chakra: 'Sacral',
                type: 'name',
                icon: '💧',
                text: 'Svadhisthana',
                color: '#ED8936',
                pair: 'sacral-symbol'
            },

            // Solar Plexus - Manipura
            {
                id: 'solar-symbol',
                chakra: 'Solar Plexus',
                type: 'symbol',
                icon: '🟡',
                text: 'Solar Symbol',
                color: '#ECC94B',
                pair: 'solar-name'
            },
            {
                id: 'solar-name',
                chakra: 'Solar Plexus',
                type: 'name',
                icon: '🔥',
                text: 'Manipura',
                color: '#ECC94B',
                pair: 'solar-symbol'
            },

            // Heart Chakra - Anahata
            {
                id: 'heart-symbol',
                chakra: 'Heart',
                type: 'symbol',
                icon: '🟢',
                text: 'Heart Symbol',
                color: '#48BB78',
                pair: 'heart-name'
            },
            {
                id: 'heart-name',
                chakra: 'Heart',
                type: 'name',
                icon: '💚',
                text: 'Anahata',
                color: '#48BB78',
                pair: 'heart-symbol'
            },

            // Throat Chakra - Vishuddha
            {
                id: 'throat-symbol',
                chakra: 'Throat',
                type: 'symbol',
                icon: '🔵',
                text: 'Throat Symbol',
                color: '#4299E1',
                pair: 'throat-name'
            },
            {
                id: 'throat-name',
                chakra: 'Throat',
                type: 'name',
                icon: '🗣️',
                text: 'Vishuddha',
                color: '#4299E1',
                pair: 'throat-symbol'
            },

            // Third Eye - Ajna
            {
                id: 'thirdeye-symbol',
                chakra: 'Third Eye',
                type: 'symbol',
                icon: '🟣',
                text: 'Third Eye Symbol',
                color: '#667EEA',
                pair: 'thirdeye-name'
            },
            {
                id: 'thirdeye-name',
                chakra: 'Third Eye',
                type: 'name',
                icon: '👁️',
                text: 'Ajna',
                color: '#667EEA',
                pair: 'thirdeye-symbol'
            },

            // Crown Chakra - Sahasrara
            {
                id: 'crown-symbol',
                chakra: 'Crown',
                type: 'symbol',
                icon: '🟣',
                text: 'Crown Symbol',
                color: '#9F7AEA',
                pair: 'crown-name'
            },
            {
                id: 'crown-name',
                chakra: 'Crown',
                type: 'name',
                icon: '👑',
                text: 'Sahasrara',
                color: '#9F7AEA',
                pair: 'crown-symbol'
            },

            // Additional pairs for medium/hard difficulty
            // Chakra Elements
            {
                id: 'root-element',
                chakra: 'Root',
                type: 'element',
                icon: '🌍',
                text: 'Earth',
                color: '#E53E3E',
                pair: 'root-location'
            },
            {
                id: 'root-location',
                chakra: 'Root',
                type: 'location',
                icon: '🦶',
                text: 'Base of Spine',
                color: '#E53E3E',
                pair: 'root-element'
            },

            {
                id: 'sacral-element',
                chakra: 'Sacral',
                type: 'element',
                icon: '🌊',
                text: 'Water',
                color: '#ED8936',
                pair: 'sacral-emotion'
            },
            {
                id: 'sacral-emotion',
                chakra: 'Sacral',
                type: 'emotion',
                icon: '😊',
                text: 'Creativity',
                color: '#ED8936',
                pair: 'sacral-element'
            },

            {
                id: 'solar-element',
                chakra: 'Solar Plexus',
                type: 'element',
                icon: '🔥',
                text: 'Fire',
                color: '#ECC94B',
                pair: 'solar-power'
            },
            {
                id: 'solar-power',
                chakra: 'Solar Plexus',
                type: 'power',
                icon: '⚡',
                text: 'Personal Power',
                color: '#ECC94B',
                pair: 'solar-element'
            },

            {
                id: 'heart-element',
                chakra: 'Heart',
                type: 'element',
                icon: '💨',
                text: 'Air',
                color: '#48BB78',
                pair: 'heart-emotion'
            },
            {
                id: 'heart-emotion',
                chakra: 'Heart',
                type: 'emotion',
                icon: '💖',
                text: 'Love',
                color: '#48BB78',
                pair: 'heart-element'
            },

            {
                id: 'throat-element',
                chakra: 'Throat',
                type: 'element',
                icon: '🌬️',
                text: 'Ether',
                color: '#4299E1',
                pair: 'throat-function'
            },
            {
                id: 'throat-function',
                chakra: 'Throat',
                type: 'function',
                icon: '🎤',
                text: 'Communication',
                color: '#4299E1',
                pair: 'throat-element'
            }
        ];

        // Difficulty configurations
        this.difficulties = {
            easy: {
                pairs: 4,
                minMoves: 8,
                perfectMoves: 10,
                baseXP: 50,
                perfectXP: 100,
                speedBonus: 20
            },
            medium: {
                pairs: 8,
                minMoves: 16,
                perfectMoves: 20,
                baseXP: 100,
                perfectXP: 200,
                speedBonus: 50
            },
            hard: {
                pairs: 12,
                minMoves: 24,
                perfectMoves: 30,
                baseXP: 200,
                perfectXP: 400,
                speedBonus: 100
            }
        };

        this.init();
    }

    // ==================== DEBUG LOGGING ====================
    log(message, data = null) {
        if (this.debugMode) {
            console.log(`[ChakraMemory] ${message}`, data || '');
        }
    }

    error(message, error = null) {
        console.error(`[ChakraMemory ERROR] ${message}`, error || '');
    }

    // ==================== SOUND SYSTEM ====================
    initSounds() {
        this.log('Initializing sound system...');
        
        // Create audio contexts with Web Audio API for better control
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.log('Audio context created');
        } catch (e) {
            this.log('Web Audio API not supported, falling back to HTML5 audio');
        }

        // Initialize sound effects with synthesized audio
        this.createSoundEffects();
        
        // Add sound controls to UI
        this.addSoundControls();
    }

    createSoundEffects() {
        this.log('Creating sound effects...');

        // Card flip sound - soft whoosh
        this.sounds.flip = this.createTone([400, 600], 0.1, 'sine', 0.3);
        
        // Match sound - harmonious chime
        this.sounds.match = this.createChord([523, 659, 784], 0.4, 'sine', 0.4);
        
        // Victory sound - triumphant chord progression  
        this.sounds.victory = this.createChordProgression([
            [523, 659, 784], // C major
            [587, 740, 880], // D major  
            [659, 831, 988]  // E major
        ], 0.6, 'sine', 0.5);
        
        // Perfect game sound - magical sparkle
        this.sounds.perfect = this.createSparkleSound();
        
        // Error sound - gentle negative feedback
        this.sounds.error = this.createTone([300, 200], 0.2, 'triangle', 0.2);
        
        // Click sound - soft tap
        this.sounds.click = this.createTone([800], 0.05, 'sine', 0.1);

        // Background music - ambient chakra tones
        this.sounds.background = this.createAmbientLoop();
        
        this.log('Sound effects created');
    }

    createTone(frequencies, duration, waveType = 'sine', volume = 0.3) {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            try {
                const now = this.audioContext.currentTime;
                
                frequencies.forEach((freq, index) => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, now);
                    oscillator.type = waveType;
                    
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(volume / frequencies.length, now + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
                    
                    oscillator.start(now + index * 0.05);
                    oscillator.stop(now + duration + index * 0.05);
                });
            } catch (e) {
                this.error('Error playing tone', e);
            }
        };
    }

    createChord(frequencies, duration, waveType = 'sine', volume = 0.4) {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            try {
                const now = this.audioContext.currentTime;
                
                frequencies.forEach(freq => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, now);
                    oscillator.type = waveType;
                    
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(volume / frequencies.length, now + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
                    
                    oscillator.start(now);
                    oscillator.stop(now + duration);
                });
            } catch (e) {
                this.error('Error playing chord', e);
            }
        };
    }

    createChordProgression(chords, duration, waveType = 'sine', volume = 0.5) {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            chords.forEach((chord, chordIndex) => {
                setTimeout(() => {
                    this.createChord(chord, duration * 0.8, waveType, volume)();
                }, chordIndex * duration * 500);
            });
        };
    }

    createSparkleSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Create multiple sparkle notes
            const sparkleFreqs = [1047, 1319, 1568, 1865, 2093];
            sparkleFreqs.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone([freq], 0.3, 'sine', 0.2)();
                }, index * 100);
            });
        };
    }

    createAmbientLoop() {
        let ambientOscillators = [];
        
        return {
            start: () => {
                if (!this.musicEnabled || !this.audioContext || ambientOscillators.length > 0) return;
                
                this.log('Starting ambient background music');
                
                // Create subtle chakra frequency drones
                const chakraFreqs = [256, 288, 320, 341, 384, 426, 480]; // Chakra frequencies in Hz
                
                chakraFreqs.forEach((freq, index) => {
                    setTimeout(() => {
                        try {
                            const oscillator = this.audioContext.createOscillator();
                            const gainNode = this.audioContext.createGain();
                            const filter = this.audioContext.createBiquadFilter();
                            
                            oscillator.connect(filter);
                            filter.connect(gainNode);
                            gainNode.connect(this.audioContext.destination);
                            
                            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                            oscillator.type = 'sine';
                            
                            filter.type = 'lowpass';
                            filter.frequency.setValueAtTime(freq * 2, this.audioContext.currentTime);
                            
                            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 2);
                            
                            oscillator.start();
                            ambientOscillators.push({ oscillator, gainNode });
                        } catch (e) {
                            this.error('Error creating ambient sound', e);
                        }
                    }, index * 2000);
                });
            },
            
            stop: () => {
                this.log('Stopping ambient background music');
                
                ambientOscillators.forEach(({ oscillator, gainNode }) => {
                    try {
                        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
                        oscillator.stop(this.audioContext.currentTime + 1);
                    } catch (e) {
                        // Oscillator may already be stopped
                    }
                });
                ambientOscillators = [];
            }
        };
    }

    addSoundControls() {
        // Add sound toggle buttons to the UI
        const gameHeader = document.querySelector('.game-header');
        if (gameHeader) {
            const soundControls = document.createElement('div');
            soundControls.className = 'sound-controls';
            soundControls.innerHTML = `
                <button id="soundToggle" class="sound-btn" title="Toggle Sound Effects">
                    🔊
                </button>
                <button id="musicToggle" class="sound-btn" title="Toggle Background Music">
                    🎵
                </button>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .sound-controls {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    display: flex;
                    gap: 0.5rem;
                    z-index: 100;
                }
                
                .sound-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                    color: white;
                }
                
                .sound-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }
                
                .sound-btn.disabled {
                    opacity: 0.5;
                    filter: grayscale(100%);
                }
            `;
            document.head.appendChild(style);
            
            gameHeader.appendChild(soundControls);
            
            // Add event listeners
            document.getElementById('soundToggle').addEventListener('click', () => {
                this.toggleSound();
            });
            
            document.getElementById('musicToggle').addEventListener('click', () => {
                this.toggleMusic();
            });
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('soundToggle');
        if (btn) {
            btn.textContent = this.soundEnabled ? '🔊' : '🔇';
            btn.classList.toggle('disabled', !this.soundEnabled);
        }
        
        // Play confirmation sound
        if (this.soundEnabled) {
            this.playSound('click');
        }
        
        this.log(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`);
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const btn = document.getElementById('musicToggle');
        if (btn) {
            btn.textContent = this.musicEnabled ? '🎵' : '🎶';
            btn.classList.toggle('disabled', !this.musicEnabled);
        }
        
        // Start/stop background music
        if (this.musicEnabled) {
            this.sounds.background.start();
        } else {
            this.sounds.background.stop();
        }
        
        this.log(`Music ${this.musicEnabled ? 'enabled' : 'disabled'}`);
    }

    playSound(soundName) {
        if (this.sounds[soundName] && typeof this.sounds[soundName] === 'function') {
            try {
                // Resume audio context if needed (browser autoplay policy)
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                this.sounds[soundName]();
            } catch (e) {
                this.error(`Error playing sound ${soundName}`, e);
            }
        }
    }

    // ==================== INITIALIZATION ====================

    async init() {
        this.log('🧘 Enhanced Chakra Memory Game initializing...');

        try {
            await this.waitForSystems();
            
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    this.log(`User authenticated: ${user.email}`);
                    this.currentUser = user;
                    await this.loadGameData();
                    this.updateBestTimes();
                    
                    // Start ambient music when user is logged in
                    if (this.musicEnabled) {
                        setTimeout(() => {
                            this.sounds.background.start();
                        }, 1000);
                    }
                } else {
                    this.log('No user authenticated, redirecting to login');
                    window.location.href = '../login.html';
                }
            });
        } catch (error) {
            this.error('Initialization failed', error);
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

    // ==================== DATA MANAGEMENT ====================

    async loadGameData() {
        this.log('Loading game data...');
        
        try {
            const doc = await firebase.firestore()
                .collection('chakraMemoryProgress')
                .doc(this.currentUser.uid)
                .get();

            if (doc.exists) {
                this.gameData = doc.data();
                this.log('Game data loaded:', this.gameData);
            } else {
                this.log('No existing data, initializing new user');
                this.gameData = {
                    userId: this.currentUser.uid,
                    gamesPlayed: 0,
                    perfectGames: 0,
                    totalXPEarned: 0,
                    lastPlayed: null,
                    bestTimes: {
                        easy: null,
                        medium: null,
                        hard: null
                    },
                    stats: {
                        easy: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 },
                        medium: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 },
                        hard: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 }
                    },
                    achievements: [],
                    settings: {
                        soundEnabled: true,
                        musicEnabled: true
                    }
                };
                await this.saveGameData();
            }

            // Apply saved sound settings
            if (this.gameData.settings) {
                this.soundEnabled = this.gameData.settings.soundEnabled !== false;
                this.musicEnabled = this.gameData.settings.musicEnabled !== false;
                this.updateSoundControls();
            }
            
        } catch (error) {
            this.error('Error loading game data', error);
            // Initialize with default data on error
            this.gameData = {
                userId: this.currentUser.uid,
                gamesPlayed: 0,
                perfectGames: 0,
                totalXPEarned: 0,
                lastPlayed: null,
                bestTimes: { easy: null, medium: null, hard: null },
                stats: {
                    easy: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 },
                    medium: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 },
                    hard: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 }
                },
                achievements: [],
                settings: { soundEnabled: true, musicEnabled: true }
            };
        }
    }

    async saveGameData() {
        if (!this.gameData || !this.currentUser) return;
        
        try {
            // Update last played timestamp
            this.gameData.lastPlayed = firebase.firestore.FieldValue.serverTimestamp();
            
            // Save sound settings
            this.gameData.settings = {
                soundEnabled: this.soundEnabled,
                musicEnabled: this.musicEnabled
            };
            
            await firebase.firestore()
                .collection('chakraMemoryProgress')
                .doc(this.currentUser.uid)
                .set(this.gameData, { merge: true });
                
            this.log('Game data saved successfully');
        } catch (error) {
            this.error('Error saving game data', error);
        }
    }

    updateSoundControls() {
        const soundBtn = document.getElementById('soundToggle');
        const musicBtn = document.getElementById('musicToggle');
        
        if (soundBtn) {
            soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
            soundBtn.classList.toggle('disabled', !this.soundEnabled);
        }
        
        if (musicBtn) {
            musicBtn.textContent = this.musicEnabled ? '🎵' : '🎶';
            musicBtn.classList.toggle('disabled', !this.musicEnabled);
        }
    }

    updateBestTimes() {
        if (!this.gameData) return;

        const formatTime = (seconds) => {
            if (!seconds) return '--:--';
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        const elements = {
            'bestTimeEasy': this.gameData.bestTimes.easy,
            'bestTimeMedium': this.gameData.bestTimes.medium,
            'bestTimeHard': this.gameData.bestTimes.hard
        };

        Object.entries(elements).forEach(([id, time]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = formatTime(time);
        });

        this.log('Best times updated');
    }

    // ==================== MODE SELECTION ====================

    selectMode(mode) {
        this.selectedMode = mode;
        this.playSound('click');

        this.log(`Mode selected: ${mode}`);

        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const selectedBtn = document.querySelector(`[data-mode="${mode}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }

        // Enable start button
        const startBtn = document.querySelector('.start-game-btn');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = `Start ${mode.charAt(0).toUpperCase() + mode.slice(1)} Game 🎮`;
        }
    }

    // ==================== GAME FLOW ====================

    startGame() {
        if (!this.selectedMode) return;

        this.log(`Starting ${this.selectedMode} game`);
        this.playSound('click');

        // Hide mode selection
        const modeSelection = document.getElementById('modeSelection');
        if (modeSelection) {
            modeSelection.style.display = 'none';
        }

        // Show game board
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            gameBoard.classList.add('active');
        }

        // Setup game
        this.setupGame();
    }

    setupGame() {
        this.log('Setting up game...');
        
        // Reset game state
        this.moves = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.startTime = Date.now();
        this.isProcessing = false;

        // Get difficulty config
        const config = this.difficulties[this.selectedMode];

        // Select and shuffle cards
        this.cards = this.selectCards(config.pairs);
        this.shuffleCards();

        // Update UI
        const elements = {
            'movesValue': '0',
            'pairsValue': `0/${config.pairs}`,
            'timeValue': '00:00'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        // Render cards
        this.renderCards();

        // Start timer
        this.startTimer();

        this.log('Game setup complete');
    }

    selectCards(pairs) {
        // Shuffle available cards and take required pairs
        const shuffled = [...this.chakraCards].sort(() => Math.random() - 0.5);
        const selected = [];
        const usedPairs = new Set();

        for (let i = 0; i < shuffled.length && selected.length < pairs * 2; i++) {
            const card = shuffled[i];
            const pairCard = this.chakraCards.find(c => c.id === card.pair);

            if (pairCard && !usedPairs.has(card.chakra + card.type + card.pair)) {
                selected.push({ ...card, cardId: `card-${selected.length}` });
                selected.push({ ...pairCard, cardId: `card-${selected.length}` });
                usedPairs.add(card.chakra + card.type + card.pair);
                usedPairs.add(pairCard.chakra + pairCard.type + pairCard.pair);
            }
        }

        return selected.slice(0, pairs * 2);
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderCards() {
        const grid = document.getElementById('cardsGrid');
        if (!grid) return;

        grid.innerHTML = '';
        grid.className = `cards-grid ${this.selectedMode}`;

        this.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            grid.appendChild(cardElement);
        });

        this.log(`Rendered ${this.cards.length} cards`);
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.dataset.cardId = card.cardId;
        cardDiv.dataset.pairId = card.pair;
        cardDiv.dataset.chakra = card.chakra;

        cardDiv.innerHTML = `
            <div class="card-face card-front">
                <div class="card-pattern"></div>
            </div>
            <div class="card-face card-back" style="border-color: ${card.color}">
                <div class="card-icon">${card.icon}</div>
                <div class="card-text" style="color: ${card.color}">${card.text}</div>
            </div>
        `;

        cardDiv.addEventListener('click', () => this.flipCard(cardDiv, card));

        return cardDiv;
    }

    flipCard(cardElement, card) {
        // Prevent flipping if processing, already flipped, or matched
        if (this.isProcessing ||
            cardElement.classList.contains('flipped') ||
            cardElement.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            this.playSound('error');
            return;
        }

        this.log(`Flipping card: ${card.text}`);

        // Play flip sound
        this.playSound('flip');

        // Flip the card
        cardElement.classList.add('flipped');
        this.flippedCards.push({ element: cardElement, data: card });

        // Check for match if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.isProcessing = true;
            this.moves++;
            
            const movesEl = document.getElementById('movesValue');
            if (movesEl) movesEl.textContent = this.moves;

            setTimeout(() => {
                this.checkMatch();
            }, 600);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;

        this.log(`Checking match: ${card1.data.text} vs ${card2.data.text}`);

        // Check if cards match (they should have each other's IDs)
        if (card1.data.pair === card2.data.id) {
            this.log('✅ Match found!');
            
            // Match!
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');

            this.matchedPairs++;
            const config = this.difficulties[this.selectedMode];
            
            const pairsEl = document.getElementById('pairsValue');
            if (pairsEl) pairsEl.textContent = `${this.matchedPairs}/${config.pairs}`;

            // Play match sound
            this.playSound('match');

            // Particle effects
            this.createParticles(card1.element, card1.data.color);
            this.createParticles(card2.element, card2.data.color);

            // Check for victory
            if (this.matchedPairs === config.pairs) {
                setTimeout(() => this.gameComplete(), 800);
            }
        } else {
            this.log('❌ No match');
            
            // No match - flip back
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
            }, 400);
        }

        this.flippedCards = [];
        this.isProcessing = false;
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            
            const timeEl = document.getElementById('timeValue');
            if (timeEl) {
                timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    // ==================== GAME COMPLETE ====================

    async gameComplete() {
        this.log('🎉 Game complete!');
        
        clearInterval(this.timerInterval);

        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        const config = this.difficulties[this.selectedMode];

        // Calculate stars (1-3 based on moves)
        let stars = 1;
        if (this.moves <= config.perfectMoves) stars = 3;
        else if (this.moves <= config.minMoves * 1.5) stars = 2;

        // Calculate XP
        let xp = config.baseXP;
        const breakdown = [`Base: ${config.baseXP} XP`];

        // Perfect game bonus
        const isPerfect = this.moves === config.minMoves;
        if (isPerfect) {
            const perfectBonus = config.perfectXP - config.baseXP;
            xp = config.perfectXP;
            breakdown.push(`Perfect Game: +${perfectBonus} XP`);
        }

        // Speed bonus 
        const speedThresholds = { easy: 120, medium: 180, hard: 240 };
        if (totalTime < speedThresholds[this.selectedMode]) {
            const speedBonus = Math.floor(config.speedBonus * (1 - totalTime / speedThresholds[this.selectedMode]));
            xp += speedBonus;
            breakdown.push(`Speed Bonus: +${speedBonus} XP`);
        }

        // 3-star bonus
        if (stars === 3) {
            const starBonus = 50;
            xp += starBonus;
            breakdown.push(`3-Star Bonus: +${starBonus} XP`);
        }

        // Play victory sound
        if (isPerfect) {
            this.playSound('perfect');
        } else {
            this.playSound('victory');
        }

        // Update stats
        if (!this.gameData) {
            this.gameData = { gamesPlayed: 0, perfectGames: 0, totalXPEarned: 0, bestTimes: {}, stats: {} };
        }

        this.gameData.gamesPlayed = (this.gameData.gamesPlayed || 0) + 1;
        this.gameData.totalXPEarned = (this.gameData.totalXPEarned || 0) + xp;
        
        if (isPerfect) {
            this.gameData.perfectGames = (this.gameData.perfectGames || 0) + 1;
        }

        // Initialize stats object if needed
        if (!this.gameData.stats) {
            this.gameData.stats = {
                easy: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 },
                medium: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 },
                hard: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 }
            };
        }

        if (!this.gameData.stats[this.selectedMode]) {
            this.gameData.stats[this.selectedMode] = { played: 0, wins: 0, totalMoves: 0, totalTime: 0 };
        }

        // Update stats for difficulty
        this.gameData.stats[this.selectedMode].played++;
        this.gameData.stats[this.selectedMode].wins++;
        this.gameData.stats[this.selectedMode].totalMoves += this.moves;
        this.gameData.stats[this.selectedMode].totalTime += totalTime;

        // Check for new best time
        let isNewRecord = false;
        if (!this.gameData.bestTimes) {
            this.gameData.bestTimes = {};
        }
        
        if (!this.gameData.bestTimes[this.selectedMode] ||
            totalTime < this.gameData.bestTimes[this.selectedMode]) {
            this.gameData.bestTimes[this.selectedMode] = totalTime;
            isNewRecord = true;
        }

        // Save progress
        await this.saveGameData();
        this.updateBestTimes();

        // Award XP to universal system
        if (window.progressSystem) {
            try {
                await window.progressSystem.awardXP(
                    xp,
                    `Chakra Memory Match (${this.selectedMode})`,
                    'chakra-memory'
                );
                this.log('XP awarded to progress system');
            } catch (error) {
                this.error('Error awarding XP', error);
            }
        }

        // Show victory screen
        this.showVictoryScreen(totalTime, stars, xp, breakdown, isNewRecord);
    }

    showVictoryScreen(time, stars, xp, breakdown, isNewRecord) {
        this.log('Showing victory screen');
        
        // Hide game board
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            gameBoard.classList.remove('active');
        }

        // Format time
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Update victory screen elements
        const elements = {
            'finalTime': timeStr,
            'finalMoves': this.moves.toString(),
            'finalStars': '⭐'.repeat(stars),
            'totalXP': xp.toString()
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        // XP breakdown
        const breakdownDiv = document.getElementById('xpBreakdown');
        if (breakdownDiv) {
            breakdownDiv.innerHTML = breakdown.join('<br>');
        }

        // New record message
        const newRecordMsg = document.getElementById('newRecordMsg');
        if (newRecordMsg) {
            newRecordMsg.style.display = isNewRecord ? 'block' : 'none';
        }

        // Show victory screen
        const victoryScreen = document.getElementById('victoryScreen');
        if (victoryScreen) {
            victoryScreen.classList.add('show');
        }
    }

    // ==================== GAME CONTROLS ====================

    resetGame() {
        this.log('Resetting game');
        this.playSound('click');
        this.setupGame();
    }

    playAgain() {
        this.log('Playing again');
        this.playSound('click');
        
        const victoryScreen = document.getElementById('victoryScreen');
        if (victoryScreen) {
            victoryScreen.classList.remove('show');
        }
        
        this.setupGame();
    }

    backToMenu() {
        this.log('Back to menu');
        this.playSound('click');
        
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Stop background music
        this.sounds.background.stop();

        // Hide game board and victory screen
        const gameBoard = document.getElementById('gameBoard');
        const victoryScreen = document.getElementById('victoryScreen');
        const modeSelection = document.getElementById('modeSelection');
        
        if (gameBoard) gameBoard.classList.remove('active');
        if (victoryScreen) victoryScreen.classList.remove('show');
        if (modeSelection) modeSelection.style.display = 'block';

        // Deselect mode
        this.selectedMode = null;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        const startBtn = document.querySelector('.start-game-btn');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.textContent = 'Select a Difficulty to Start';
        }
    }

    // ==================== UI EFFECTS ====================

    createParticles(element, color) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle chakra-particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;

            const angle = (Math.PI * 2 * i) / 12;
            const velocity = 80 + Math.random() * 60;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');

            // Add chakra-specific styling
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.borderRadius = '50%';
            particle.style.position = 'fixed';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.animation = 'chakraParticle 1.5s ease-out forwards';

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 1500);
        }
    }

    shareResults() {
        this.log('Sharing results');
        this.playSound('click');
        
        const stars = document.getElementById('finalStars')?.textContent || '';
        const time = document.getElementById('finalTime')?.textContent || '';
        const xp = document.getElementById('totalXP')?.textContent || '';

        const text = `🧘 Chakra Memory Match\n\n` +
            `Difficulty: ${this.selectedMode?.charAt(0).toUpperCase()}${this.selectedMode?.slice(1) || ''}\n` +
            `Rating: ${stars}\n` +
            `Time: ${time}\n` +
            `XP Earned: +${xp}\n\n` +
            `Align your chakras in Divine Temple! 🌟`;

        if (navigator.share) {
            navigator.share({
                title: 'Chakra Memory Match Results',
                text: text,
                url: window.location.href
            }).catch(err => this.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes chakraParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Global functions for inline onclick handlers
function selectMode(mode) {
    if (window.chakraGameEnhanced) {
        window.chakraGameEnhanced.selectMode(mode);
    }
}

function startGame() {
    if (window.chakraGameEnhanced) {
        window.chakraGameEnhanced.startGame();
    }
}

function resetGame() {
    if (window.chakraGameEnhanced) {
        window.chakraGameEnhanced.resetGame();
    }
}

function playAgain() {
    if (window.chakraGameEnhanced) {
        window.chakraGameEnhanced.playAgain();
    }
}

function backToMenu() {
    if (window.chakraGameEnhanced) {
        window.chakraGameEnhanced.backToMenu();
    }
}

function shareResults() {
    if (window.chakraGameEnhanced) {
        window.chakraGameEnhanced.shareResults();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧘 Initializing Enhanced Chakra Memory Game...');
    window.chakraGameEnhanced = new ChakraMemoryGameEnhanced();
});