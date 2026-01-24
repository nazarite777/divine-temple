/**
 * 🥣 SINGING BOWL HARMONY GARDEN
 * Interactive Sound Healing & Zen Garden Simulator
 * Features chakra-tuned singing bowls, zen garden creation, and meditation
 * 
 * Features:
 * - 7 chakra-tuned singing bowls with authentic frequencies
 * - Interactive zen garden with sand patterns and stone placement
 * - Real-time sound visualization and frequency analysis
 * - Meditation timer with custom soundscapes
 * - Educational content about sound healing
 * - Progress tracking and achievement system
 */

class SingingBowlHarmonyGarden {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.bowls = [];
        this.activeBowls = new Set();
        this.garden = null;
        this.isDrawing = false;
        this.currentTool = 'rake';
        this.meditationTimer = 0;
        this.timerInterval = null;
        this.isTimerRunning = false;
        
        // Sound system
        this.soundEnabled = true;
        this.masterVolume = 0.7;
        this.sustainedNotes = new Map();
        this.spatialAudioEnabled = true;
        this.feedbackSoundsEnabled = true;
        
        // Garden state
        this.gardenElements = [];
        this.sandPattern = [];
        this.lastMousePos = { x: 0, y: 0 };
        
        // Progress tracking
        this.userProgress = {
            level: 1,
            experience: 0,
            bowlsMastered: new Set(),
            gardensCreated: 0,
            meditationMinutes: 0,
            achievements: new Set()
        };

        // Chakra bowl configurations
        this.chakraBowls = [
            {
                id: 'root',
                name: 'Root Chakra',
                frequency: 256,    // C4 - Grounding
                color: '#c41e3a',
                position: { x: 300, y: 400 },
                size: 80,
                symbol: '🟥',
                meaning: 'Grounding, Security, Stability',
                affirmation: 'I am safe and secure in my physical existence'
            },
            {
                id: 'sacral',
                name: 'Sacral Chakra', 
                frequency: 288,    // D4 - Creativity
                color: '#ff8c00',
                position: { x: 200, y: 350 },
                size: 75,
                symbol: '🟧',
                meaning: 'Creativity, Sexuality, Emotion',
                affirmation: 'I embrace my creative energy and emotional flow'
            },
            {
                id: 'solar',
                name: 'Solar Plexus',
                frequency: 320,    // E4 - Personal Power
                color: '#ffd700',
                position: { x: 150, y: 250 },
                size: 75,
                symbol: '🟨',
                meaning: 'Personal Power, Confidence, Will',
                affirmation: 'I am confident in my personal power and choices'
            },
            {
                id: 'heart',
                name: 'Heart Chakra',
                frequency: 341.3,  // F4 - Love
                color: '#20b2aa',
                position: { x: 200, y: 150 },
                size: 85,
                symbol: '💚',
                meaning: 'Love, Compassion, Connection',
                affirmation: 'I give and receive love freely and unconditionally'
            },
            {
                id: 'throat',
                name: 'Throat Chakra',
                frequency: 384,    // G4 - Truth
                color: '#4169e1',
                position: { x: 300, y: 100 },
                size: 75,
                symbol: '🔵',
                meaning: 'Truth, Communication, Expression',
                affirmation: 'I speak my truth with clarity and kindness'
            },
            {
                id: 'third_eye',
                name: 'Third Eye',
                frequency: 426.7,  // A4 - Intuition
                color: '#663399',
                position: { x: 400, y: 150 },
                size: 75,
                symbol: '🟣',
                meaning: 'Intuition, Wisdom, Perception',
                affirmation: 'I trust my inner wisdom and intuitive guidance'
            },
            {
                id: 'crown',
                name: 'Crown Chakra',
                frequency: 480,    // B4 - Spiritual Connection
                color: '#9370db',
                position: { x: 450, y: 250 },
                size: 75,
                symbol: '🟪',
                meaning: 'Spiritual Connection, Enlightenment',
                affirmation: 'I am connected to the divine consciousness within'
            }
        ];

        // Garden tools
        this.gardenTools = [
            { id: 'rake', name: 'Sand Rake', icon: '🥍', description: 'Create flowing patterns in the sand' },
            { id: 'stone', name: 'Place Stone', icon: '🪨', description: 'Add meditation stones to your garden' },
            { id: 'bamboo', name: 'Plant Bamboo', icon: '🎋', description: 'Grow bamboo for natural boundaries' },
            { id: 'lotus', name: 'Lotus Flower', icon: '🪷', description: 'Place sacred lotus flowers' },
            { id: 'water', name: 'Water Feature', icon: '💧', description: 'Add peaceful water elements' },
            { id: 'clear', name: 'Clear Garden', icon: '🗑️', description: 'Start with fresh sand' }
        ];

        this.init();
    }

    // ==================== INITIALIZATION ====================

    async init() {
        console.log('🥣 Initializing Singing Bowl Harmony Garden...');
        
        const container = document.getElementById('singingBowlContainer');
        if (!container) {
            console.warn('Singing bowl container not found');
            return;
        }

        await this.createInterface();
        await this.initAudio();
        this.setupCanvas();
        this.bindEvents();
        this.loadProgress();
        
        console.log('✅ Singing Bowl Harmony Garden initialized');
    }

    async createInterface() {
        const container = document.getElementById('singingBowlContainer');
        
        container.innerHTML = `
            <div class="harmony-garden-app">
                <!-- Header -->
                <div class="garden-header">
                    <div class="garden-title">
                        <h3>🥣 Singing Bowl Harmony Garden</h3>
                        <p class="garden-subtitle">Sound Healing & Zen Meditation</p>
                    </div>
                    
                    <div class="meditation-controls">
                        <div class="timer-display">
                            <span class="timer-icon">🧘‍♀️</span>
                            <span id="meditationTime">00:00</span>
                            <button id="timerToggle" class="timer-btn">▶️</button>
                        </div>
                        <div class="volume-control">
                            <span class="volume-icon">🔊</span>
                            <input type="range" id="masterVolume" min="0" max="100" value="70" class="volume-slider">
                        </div>
                        
                        <div class="audio-controls">
                            <h5 class="audio-title">🎵 Audio Experience</h5>
                            <div class="audio-toggles">
                                <button id="ambientToggle" class="audio-btn active" title="Toggle ambient nature sounds">
                                    🌿 Ambient
                                </button>
                                <button id="spatialToggle" class="audio-btn active" title="Toggle 3D spatial audio">
                                    🎧 Spatial
                                </button>
                                <button id="feedbackToggle" class="audio-btn active" title="Toggle interactive sounds">
                                    🔈 Feedback
                                </button>
                                <button id="harmonyBtn" class="audio-btn" title="Play chakra harmony sequence">
                                    ☯️ Harmony
                                </button>
                            </div>
                        </div>
                        
                        <style>
                            .audio-controls {
                                margin-top: 15px;
                                padding: 10px;
                                background: rgba(255, 255, 255, 0.1);
                                border-radius: 8px;
                                backdrop-filter: blur(5px);
                            }
                            
                            .audio-title {
                                margin: 0 0 10px 0;
                                color: #6b46c1;
                                font-size: 0.9em;
                                text-align: center;
                            }
                            
                            .audio-toggles {
                                display: flex;
                                gap: 8px;
                                justify-content: center;
                                flex-wrap: wrap;
                            }
                            
                            .audio-btn {
                                padding: 6px 12px;
                                border: 2px solid #e1e5e9;
                                border-radius: 20px;
                                background: rgba(255, 255, 255, 0.9);
                                font-size: 0.8em;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                white-space: nowrap;
                            }
                            
                            .audio-btn:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 4px 12px rgba(107, 70, 193, 0.3);
                            }
                            
                            .audio-btn.active {
                                border-color: #10b981;
                                background: linear-gradient(135deg, #10b981, #059669);
                                color: white;
                                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
                            }
                            
                            .audio-btn:not(.active) {
                                color: #6b7280;
                                border-color: #d1d5db;
                            }
                            
                            #harmonyBtn {
                                border-color: #8b5cf6;
                                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                                color: white;
                            }
                            
                            #harmonyBtn:hover {
                                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                            }
                        </style>
                    </div>
                </div>

                <!-- Singing Bowls Circle -->
                <div class="bowls-container">
                    <h4 class="section-title">🕉️ Chakra Singing Bowls</h4>
                    <div class="bowls-circle" id="bowlsCircle">
                        <!-- Bowls will be generated here -->
                    </div>
                    
                    <div class="bowl-info" id="bowlInfo">
                        <div class="info-placeholder">
                            <p>Click a singing bowl to learn about its healing properties</p>
                        </div>
                    </div>
                </div>

                <!-- Zen Garden -->
                <div class="garden-container">
                    <h4 class="section-title">🌿 Interactive Zen Garden</h4>
                    
                    <div class="garden-tools">
                        ${this.gardenTools.map(tool => `
                            <button class="tool-btn ${tool.id === 'rake' ? 'active' : ''}" 
                                    data-tool="${tool.id}" 
                                    title="${tool.description}">
                                ${tool.icon} ${tool.name}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="garden-canvas-container">
                        <canvas id="zenGardenCanvas" width="800" height="400"></canvas>
                        <div class="garden-overlay" id="gardenOverlay">
                            <div class="garden-instructions">
                                <p>🥍 Select the rake tool and draw patterns in the sand</p>
                                <p>🪨 Place stones and elements to create your zen space</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sound Visualization -->
                <div class="sound-visualization">
                    <h4 class="section-title">📊 Sound Frequencies</h4>
                    <canvas id="frequencyCanvas" width="800" height="120"></canvas>
                    <div class="frequency-info">
                        <span id="activeFrequencies">No active frequencies</span>
                    </div>
                </div>

                <!-- Controls Panel -->
                <div class="controls-panel">
                    <div class="control-section">
                        <button id="playHarmony" class="control-btn primary">🎵 Play Harmony</button>
                        <button id="saveComposition" class="control-btn">💾 Save</button>
                        <button id="shareGarden" class="control-btn">📤 Share</button>
                        <button id="clearAll" class="control-btn">🔄 Reset</button>
                    </div>
                    
                    <div class="learning-section">
                        <button id="openLearning" class="control-btn secondary">📚 Sound Healing Guide</button>
                        <button id="viewAchievements" class="control-btn secondary">🏆 Achievements</button>
                    </div>
                </div>

                <!-- Learning Modal -->
                <div class="learning-modal" id="learningModal" style="display: none;">
                    <div class="modal-content">
                        <button class="close-btn" id="closeLearning">&times;</button>
                        <h3>🎓 Sound Healing Knowledge</h3>
                        <div class="learning-content" id="learningContent">
                            <!-- Content will be generated dynamically -->
                        </div>
                    </div>
                </div>

                <!-- Achievement Notification -->
                <div class="achievement-notification" id="achievementNotif" style="display: none;">
                    <div class="achievement-content">
                        <span class="achievement-icon">🏆</span>
                        <div class="achievement-text">
                            <h4 id="achievementTitle">Achievement Unlocked!</h4>
                            <p id="achievementDescription">Description here</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.generateBowls();
        this.initializeGarden();
    }

    generateBowls() {
        const bowlsContainer = document.getElementById('bowlsCircle');
        
        this.chakraBowls.forEach(bowl => {
            const bowlElement = document.createElement('div');
            bowlElement.className = 'singing-bowl';
            bowlElement.dataset.bowlId = bowl.id;
            bowlElement.style.cssText = `
                left: ${bowl.position.x - bowl.size/2}px;
                top: ${bowl.position.y - bowl.size/2}px;
                width: ${bowl.size}px;
                height: ${bowl.size}px;
                border: 3px solid ${bowl.color};
                background: linear-gradient(135deg, ${bowl.color}22, ${bowl.color}44);
            `;
            
            bowlElement.innerHTML = `
                <div class="bowl-symbol">${bowl.symbol}</div>
                <div class="bowl-name">${bowl.name}</div>
                <div class="bowl-frequency">${bowl.frequency}Hz</div>
                <div class="bowl-ripple"></div>
            `;
            
            bowlsContainer.appendChild(bowlElement);
        });
    }

    setupCanvas() {
        this.garden = document.getElementById('zenGardenCanvas');
        this.gardenCtx = this.garden.getContext('2d');
        this.frequencyCanvas = document.getElementById('frequencyCanvas');
        this.frequencyCtx = this.frequencyCanvas.getContext('2d');
        
        // Initialize garden with sand texture
        this.clearGarden();
        
        // Set up frequency visualization
        this.initFrequencyVisualization();
    }

    initializeGarden() {
        // Create sand texture background
        this.createSandTexture();
        
        // Hide overlay after initialization
        setTimeout(() => {
            const overlay = document.getElementById('gardenOverlay');
            if (overlay) overlay.style.display = 'none';
        }, 3000);
    }

    createSandTexture() {
        const ctx = this.gardenCtx;
        const canvas = this.garden;
        
        // Base sand color
        ctx.fillStyle = '#f4f1e8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle texture
        for (let i = 0; i < 1000; i++) {
            ctx.fillStyle = `rgba(139, 92, 46, ${Math.random() * 0.1})`;
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                1, 1
            );
        }
        
        // Add gentle gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(244, 241, 232, 0.8)');
        gradient.addColorStop(1, 'rgba(222, 217, 202, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // ==================== AUDIO SYSTEM ====================

    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
            
            // Initialize enhanced audio features
            this.createSpatialAudio();
            this.gardenSounds = this.playInteractiveFeedbackSounds();
            
            // Start ambient soundscape after a brief delay
            setTimeout(() => this.createAmbientSoundscape(), 1000);
            
            console.log('🔊 Enhanced audio system initialized');
        } catch (error) {
            console.warn('Audio not available:', error);
            this.soundEnabled = false;
        }
    }

    playBowl(bowlId, sustain = false) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const bowl = this.chakraBowls.find(b => b.id === bowlId);
        if (!bowl) return;
        
        // Stop existing note if playing
        if (this.sustainedNotes.has(bowlId)) {
            this.stopBowl(bowlId);
        }
        
        // Use advanced sound creation
        const soundComponents = this.createAdvancedBowlSound(bowlId, sustain);
        
        // Apply spatial positioning if available
        if (this.spatialContext && this.spatialContext.bowlPositions.has(bowlId)) {
            const position = this.spatialContext.bowlPositions.get(bowlId);
            
            soundComponents.gains.forEach(gain => {
                if (gain.positionX) {
                    gain.positionX.setValueAtTime(position.x, this.audioContext.currentTime);
                    gain.positionY.setValueAtTime(position.y, this.audioContext.currentTime);
                    gain.positionZ.setValueAtTime(position.z, this.audioContext.currentTime);
                }
            });
        }
        
        // Visual feedback
        this.animateBowl(bowlId);
        this.addToActiveFrequencies(bowl.frequency);
        
        // Track progress and check achievements
        this.userProgress.bowlsMastered.add(bowlId);
        this.awardExperience(5);
        this.checkAchievements();
        
        console.log(`🥣 Playing ${bowl.name} at ${bowl.frequency}Hz`);
    }

    stopBowl(bowlId) {
        if (this.sustainedNotes.has(bowlId)) {
            const note = this.sustainedNotes.get(bowlId);
            
            if (note.oscillators && note.gains) {
                // New advanced audio structure
                note.gains.forEach(gain => {
                    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
                });
                
                setTimeout(() => {
                    note.oscillators.forEach(osc => {
                        if (osc.stop) osc.stop();
                    });
                }, 1000);
            } else {
                // Legacy structure
                note.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
                note.detuneGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
                
                note.oscillator.stop(this.audioContext.currentTime + 1);
                note.detuneOsc.stop(this.audioContext.currentTime + 1);
            }
            
            this.sustainedNotes.delete(bowlId);
        }
    }

    // ==================== ENHANCED AUDIO EXPERIENCE ====================

    createAdvancedBowlSound(bowlId, sustain = false) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const bowl = this.chakraBowls.find(b => b.id === bowlId);
        if (!bowl) return;
        
        // Create complex singing bowl sound with overtones
        const fundamental = this.audioContext.createOscillator();
        const overtone1 = this.audioContext.createOscillator();
        const overtone2 = this.audioContext.createOscillator();
        const overtone3 = this.audioContext.createOscillator();
        
        // Gain nodes for each component
        const fundamentalGain = this.audioContext.createGain();
        const overtone1Gain = this.audioContext.createGain();
        const overtone2Gain = this.audioContext.createGain();
        const overtone3Gain = this.audioContext.createGain();
        
        // Filter for metallic resonance
        const filter = this.audioContext.createBiquadFilter();
        const reverb = this.createReverb();
        
        // Connect audio chain
        fundamental.connect(fundamentalGain);
        overtone1.connect(overtone1Gain);
        overtone2.connect(overtone2Gain);
        overtone3.connect(overtone3Gain);
        
        fundamentalGain.connect(filter);
        overtone1Gain.connect(filter);
        overtone2Gain.connect(filter);
        overtone3Gain.connect(filter);
        
        filter.connect(reverb);
        reverb.connect(this.masterGain);
        
        // Set frequencies (fundamental + overtones)
        fundamental.frequency.setValueAtTime(bowl.frequency, this.audioContext.currentTime);
        overtone1.frequency.setValueAtTime(bowl.frequency * 1.59, this.audioContext.currentTime); // Minor third overtone
        overtone2.frequency.setValueAtTime(bowl.frequency * 2.02, this.audioContext.currentTime); // Octave + slight detune
        overtone3.frequency.setValueAtTime(bowl.frequency * 3.01, this.audioContext.currentTime); // Perfect fifth overtone
        
        // Oscillator types for realistic timbre
        fundamental.type = 'sine';
        overtone1.type = 'sine';
        overtone2.type = 'triangle';
        overtone3.type = 'sine';
        
        // Configure filter for bowl resonance
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(bowl.frequency * 1.5, this.audioContext.currentTime);
        filter.Q.setValueAtTime(8, this.audioContext.currentTime);
        
        if (sustain) {
            // Sustained singing bowl tone
            fundamentalGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            fundamentalGain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.8);
            
            overtone1Gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            overtone1Gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 1.2);
            
            overtone2Gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            overtone2Gain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 1.5);
            
            overtone3Gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            overtone3Gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 2.0);
            
            this.sustainedNotes.set(bowlId, { 
                oscillators: [fundamental, overtone1, overtone2, overtone3],
                gains: [fundamentalGain, overtone1Gain, overtone2Gain, overtone3Gain]
            });
            
            fundamental.start();
            overtone1.start();
            overtone2.start();
            overtone3.start();
        } else {
            // Strike sound with realistic decay
            const strikeTime = this.audioContext.currentTime;
            const decayTime = 6; // 6 seconds decay
            
            // Quick attack, long decay
            fundamentalGain.gain.setValueAtTime(0, strikeTime);
            fundamentalGain.gain.linearRampToValueAtTime(0.6, strikeTime + 0.05);
            fundamentalGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + decayTime);
            
            overtone1Gain.gain.setValueAtTime(0, strikeTime);
            overtone1Gain.gain.linearRampToValueAtTime(0.2, strikeTime + 0.1);
            overtone1Gain.gain.exponentialRampToValueAtTime(0.001, strikeTime + decayTime * 0.8);
            
            overtone2Gain.gain.setValueAtTime(0, strikeTime);
            overtone2Gain.gain.linearRampToValueAtTime(0.1, strikeTime + 0.2);
            overtone2Gain.gain.exponentialRampToValueAtTime(0.001, strikeTime + decayTime * 0.6);
            
            overtone3Gain.gain.setValueAtTime(0, strikeTime);
            overtone3Gain.gain.linearRampToValueAtTime(0.05, strikeTime + 0.3);
            overtone3Gain.gain.exponentialRampToValueAtTime(0.001, strikeTime + decayTime * 0.4);
            
            fundamental.start();
            overtone1.start();
            overtone2.start();
            overtone3.start();
            
            fundamental.stop(strikeTime + decayTime);
            overtone1.stop(strikeTime + decayTime);
            overtone2.stop(strikeTime + decayTime);
            overtone3.stop(strikeTime + decayTime);
        }
        
        return { oscillators: [fundamental, overtone1, overtone2, overtone3], gains: [fundamentalGain, overtone1Gain, overtone2Gain, overtone3Gain] };
    }

    createReverb() {
        const convolver = this.audioContext.createConvolver();
        const length = this.audioContext.sampleRate * 2; // 2 seconds reverb
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        convolver.buffer = impulse;
        return convolver;
    }

    createAmbientSoundscape() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        // Nature sounds synthesis
        this.ambientSounds = {
            wind: this.createWindSound(),
            water: this.createWaterSound(),
            birds: this.createBirdSounds(),
            temple: this.createTempleBells()
        };
        
        // Start ambient soundscape
        Object.values(this.ambientSounds).forEach(sound => {
            if (sound && sound.start) sound.start();
        });
        
        console.log('🌿 Ambient soundscape activated');
    }

    createWindSound() {
        const noise = this.audioContext.createBufferSource();
        const filter = this.audioContext.createBiquadFilter();
        const gain = this.audioContext.createGain();
        
        // Generate wind noise
        const bufferSize = this.audioContext.sampleRate * 10; // 10 seconds of noise
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            channelData[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        noise.buffer = buffer;
        noise.loop = true;
        
        // Filter for wind character
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        return noise;
    }

    createWaterSound() {
        const noise = this.audioContext.createBufferSource();
        const filter1 = this.audioContext.createBiquadFilter();
        const filter2 = this.audioContext.createBiquadFilter();
        const gain = this.audioContext.createGain();
        
        // Generate water noise
        const bufferSize = this.audioContext.sampleRate * 8;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            channelData[i] = (Math.random() * 2 - 1) * 0.3;
        }
        
        noise.buffer = buffer;
        noise.loop = true;
        
        // Filter for water character
        filter1.type = 'highpass';
        filter1.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        filter2.type = 'lowpass';
        filter2.frequency.setValueAtTime(4000, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0.03, this.audioContext.currentTime);
        
        noise.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gain);
        gain.connect(this.masterGain);
        
        return noise;
    }

    createBirdSounds() {
        // Create periodic bird chirps
        const birdInterval = setInterval(() => {
            if (!this.soundEnabled) return;
            
            // Random bird chirp
            if (Math.random() > 0.7) { // 30% chance every interval
                this.createSingleBirdChirp();
            }
        }, 5000 + Math.random() * 10000); // Every 5-15 seconds
        
        return { stop: () => clearInterval(birdInterval) };
    }

    createSingleBirdChirp() {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        // Random bird frequency
        const baseFreq = 800 + Math.random() * 1200;
        oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(baseFreq * 1.5, this.audioContext.currentTime + 0.1);
        oscillator.frequency.linearRampToValueAtTime(baseFreq * 0.8, this.audioContext.currentTime + 0.3);
        
        oscillator.type = 'square';
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        filter.Q.setValueAtTime(10, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    createTempleBells() {
        // Distant temple bell sounds
        const bellInterval = setInterval(() => {
            if (!this.soundEnabled) return;
            
            if (Math.random() > 0.9) { // 10% chance
                this.createDistantBell();
            }
        }, 30000 + Math.random() * 60000); // Every 30-90 seconds
        
        return { stop: () => clearInterval(bellInterval) };
    }

    createDistantBell() {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        const reverb = this.createReverb();
        
        oscillator.connect(filter);
        filter.connect(reverb);
        reverb.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.frequency.setValueAtTime(400 + Math.random() * 200, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 8);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 8);
    }

    createSpatialAudio() {
        // Create 3D audio positioning for bowls
        this.spatialContext = {
            listener: this.audioContext.listener,
            bowlPositions: new Map()
        };
        
        // Set up listener position (center of garden)
        if (this.spatialContext.listener.positionX) {
            this.spatialContext.listener.positionX.setValueAtTime(0, this.audioContext.currentTime);
            this.spatialContext.listener.positionY.setValueAtTime(0, this.audioContext.currentTime);
            this.spatialContext.listener.positionZ.setValueAtTime(0, this.audioContext.currentTime);
        }
        
        // Position each bowl in 3D space
        this.chakraBowls.forEach(bowl => {
            const angle = (this.chakraBowls.indexOf(bowl) / this.chakraBowls.length) * Math.PI * 2;
            const radius = 2; // 2 meters from center
            
            this.spatialContext.bowlPositions.set(bowl.id, {
                x: Math.cos(angle) * radius,
                y: 0,
                z: Math.sin(angle) * radius
            });
        });
    }

    playInteractiveFeedbackSounds() {
        // Garden interaction sounds
        const gardenSounds = {
            rake: () => this.createRakeSound(),
            stone: () => this.createStoneSound(),
            bamboo: () => this.createBambooSound(),
            lotus: () => this.createLotusSound(),
            water: () => this.createWaterDropSound()
        };
        
        return gardenSounds;
    }

    createRakeSound() {
        const noise = this.audioContext.createBufferSource();
        const filter = this.audioContext.createBiquadFilter();
        const gain = this.audioContext.createGain();
        
        // Generate sand/gravel texture
        const bufferSize = this.audioContext.sampleRate * 0.2; // 200ms
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            channelData[i] = (Math.random() * 2 - 1) * 0.5;
        }
        
        noise.buffer = buffer;
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        filter.Q.setValueAtTime(2, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start();
        noise.stop(this.audioContext.currentTime + 0.2);
    }

    createStoneSound() {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
        oscillator.type = 'square';
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    createBambooSound() {
        // Gentle bamboo rustling
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(600, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    createLotusSound() {
        // Gentle chime for lotus placement
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 2);
    }

    createWaterDropSound() {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    stopAmbientSounds() {
        if (this.ambientSounds) {
            Object.values(this.ambientSounds).forEach(sound => {
                if (sound && sound.stop) sound.stop();
            });
            this.ambientSounds = null;
        }
    }

    // ==================== VISUAL FEEDBACK ====================

    animateBowl(bowlId) {
        const bowlElement = document.querySelector(`[data-bowl-id="${bowlId}"]`);
        if (!bowlElement) return;
        
        // Add ripple effect
        const ripple = bowlElement.querySelector('.bowl-ripple');
        ripple.style.animation = 'none';
        ripple.offsetHeight; // Trigger reflow
        ripple.style.animation = 'bowlRipple 2s ease-out';
        
        // Bowl shake effect
        bowlElement.classList.add('striking');
        setTimeout(() => {
            bowlElement.classList.remove('striking');
        }, 500);
    }

    addToActiveFrequencies(frequency) {
        this.activeBowls.add(frequency);
        this.updateFrequencyDisplay();
        
        // Remove from active after 4 seconds
        setTimeout(() => {
            this.activeBowls.delete(frequency);
            this.updateFrequencyDisplay();
        }, 4000);
    }

    updateFrequencyDisplay() {
        const display = document.getElementById('activeFrequencies');
        if (this.activeBowls.size === 0) {
            display.textContent = 'No active frequencies';
        } else {
            const frequencies = Array.from(this.activeBowls).sort((a, b) => a - b);
            display.textContent = `Active: ${frequencies.map(f => f.toFixed(1) + 'Hz').join(', ')}`;
        }
    }

    initFrequencyVisualization() {
        this.drawFrequencyBackground();
    }

    drawFrequencyBackground() {
        const ctx = this.frequencyCtx;
        const canvas = this.frequencyCanvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw frequency grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Vertical lines for frequency markers
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * canvas.width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= 4; i++) {
            const y = (i / 4) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw chakra frequency markers
        this.chakraBowls.forEach(bowl => {
            const x = ((bowl.frequency - 200) / 300) * canvas.width; // Scale 200-500Hz
            ctx.fillStyle = bowl.color;
            ctx.fillRect(x - 2, canvas.height - 20, 4, 20);
            
            // Label
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(bowl.frequency + 'Hz', x, canvas.height - 25);
        });
    }

    // ==================== GARDEN INTERACTION ====================

    bindEvents() {
        // Bowl interactions
        document.querySelectorAll('.singing-bowl').forEach(bowl => {
            bowl.addEventListener('mousedown', (e) => this.handleBowlInteraction(e, 'strike'));
            bowl.addEventListener('mouseup', (e) => this.handleBowlInteraction(e, 'release'));
            bowl.addEventListener('mouseover', (e) => this.showBowlInfo(e.target.dataset.bowlId));
        });
        
        // Garden tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTool(e.target.dataset.tool));
        });
        
        // Garden canvas interactions
        this.garden.addEventListener('mousedown', this.startGardenInteraction.bind(this));
        this.garden.addEventListener('mousemove', this.continueGardenInteraction.bind(this));
        this.garden.addEventListener('mouseup', this.endGardenInteraction.bind(this));
        
        // Control buttons
        document.getElementById('playHarmony').addEventListener('click', this.playChakraHarmony.bind(this));
        document.getElementById('saveComposition').addEventListener('click', this.saveComposition.bind(this));
        document.getElementById('shareGarden').addEventListener('click', this.shareGarden.bind(this));
        document.getElementById('clearAll').addEventListener('click', this.clearAll.bind(this));
        
        // Timer controls
        document.getElementById('timerToggle').addEventListener('click', this.toggleTimer.bind(this));
        
        // Volume control
        document.getElementById('masterVolume').addEventListener('input', this.updateVolume.bind(this));
        
        // Audio experience controls
        document.getElementById('ambientToggle').addEventListener('click', this.toggleAmbient.bind(this));
        document.getElementById('spatialToggle').addEventListener('click', this.toggleSpatial.bind(this));
        document.getElementById('feedbackToggle').addEventListener('click', this.toggleFeedback.bind(this));
        document.getElementById('harmonyBtn').addEventListener('click', this.playChakraHarmony.bind(this));
        
        // Learning modal
        document.getElementById('openLearning').addEventListener('click', this.openLearning.bind(this));
        document.getElementById('closeLearning').addEventListener('click', this.closeLearning.bind(this));
        
        // Achievement button
        document.getElementById('viewAchievements').addEventListener('click', this.viewAchievements.bind(this));
    }

    handleBowlInteraction(e, action) {
        const bowlId = e.target.closest('.singing-bowl').dataset.bowlId;
        
        if (action === 'strike') {
            if (e.shiftKey) {
                // Sustained mode with shift key
                this.playBowl(bowlId, true);
            } else {
                // Normal strike
                this.playBowl(bowlId, false);
            }
            this.startTimer(); // Auto-start meditation timer
        } else if (action === 'release') {
            // Stop sustained notes
            this.stopBowl(bowlId);
        }
    }

    showBowlInfo(bowlId) {
        const bowl = this.chakraBowls.find(b => b.id === bowlId);
        if (!bowl) return;
        
        const infoContainer = document.getElementById('bowlInfo');
        infoContainer.innerHTML = `
            <div class="bowl-details">
                <h4>${bowl.symbol} ${bowl.name}</h4>
                <p class="bowl-meaning">${bowl.meaning}</p>
                <p class="bowl-frequency">Frequency: ${bowl.frequency}Hz</p>
                <p class="bowl-affirmation">"${bowl.affirmation}"</p>
                <div class="interaction-tip">
                    Click to strike • Hold Shift + Click to sustain
                </div>
            </div>
        `;
    }

    selectTool(toolId) {
        this.currentTool = toolId;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${toolId}"]`).classList.add('active');
        
        // Change cursor based on tool
        this.garden.style.cursor = this.getToolCursor(toolId);
    }

    getToolCursor(toolId) {
        switch (toolId) {
            case 'rake': return 'crosshair';
            case 'stone': return 'copy';
            case 'bamboo': return 'cell';
            case 'lotus': return 'pointer';
            case 'water': return 'help';
            case 'clear': return 'not-allowed';
            default: return 'default';
        }
    }

    // ==================== GARDEN DRAWING ====================

    startGardenInteraction(e) {
        this.isDrawing = true;
        const rect = this.garden.getBoundingClientRect();
        this.lastMousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        this.performGardenAction(this.lastMousePos.x, this.lastMousePos.y);
        this.startTimer(); // Auto-start meditation timer
    }

    continueGardenInteraction(e) {
        if (!this.isDrawing || this.currentTool !== 'rake') return;
        
        const rect = this.garden.getBoundingClientRect();
        const currentPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        this.drawRakeLine(this.lastMousePos.x, this.lastMousePos.y, currentPos.x, currentPos.y);
        this.lastMousePos = currentPos;
    }

    endGardenInteraction(e) {
        this.isDrawing = false;
    }

    performGardenAction(x, y) {
        switch (this.currentTool) {
            case 'rake':
                this.drawRakePoint(x, y);
                break;
            case 'stone':
                this.placeStone(x, y);
                break;
            case 'bamboo':
                this.plantBamboo(x, y);
                break;
            case 'lotus':
                this.placeLotus(x, y);
                break;
            case 'water':
                this.addWater(x, y);
                break;
            case 'clear':
                this.clearGarden();
                break;
        }
    }

    drawRakePoint(x, y) {
        const ctx = this.gardenCtx;
        ctx.strokeStyle = '#d4b896';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        // Play rake sound with random variation
        if (this.feedbackSoundsEnabled && this.gardenSounds && this.gardenSounds.rake && Math.random() > 0.3) {
            this.gardenSounds.rake();
        }
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawRakeLine(x1, y1, x2, y2) {
        const ctx = this.gardenCtx;
        ctx.strokeStyle = '#d4b896';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    placeStone(x, y) {
        const ctx = this.gardenCtx;
        const size = 15 + Math.random() * 10;
        
        // Play stone sound
        if (this.feedbackSoundsEnabled && this.gardenSounds && this.gardenSounds.stone) {
            this.gardenSounds.stone();
        }
        
        // Stone shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(x + 2, y + 2, size, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Stone body
        ctx.fillStyle = '#8a8a8a';
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Stone highlight
        ctx.fillStyle = '#b0b0b0';
        ctx.beginPath();
        ctx.ellipse(x - 3, y - 3, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        this.gardenElements.push({ type: 'stone', x, y, size });
    }

    plantBamboo(x, y) {
        const ctx = this.gardenCtx;
        const height = 80 + Math.random() * 40;
        
        // Play bamboo sound
        if (this.feedbackSoundsEnabled && this.gardenSounds && this.gardenSounds.bamboo) {
            this.gardenSounds.bamboo();
        }
        
        // Bamboo stalk
        ctx.strokeStyle = '#7ba05b';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - height);
        ctx.stroke();
        
        // Bamboo segments
        for (let i = 20; i < height; i += 25) {
            ctx.strokeStyle = '#6d8f4f';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 3, y - i);
            ctx.lineTo(x + 3, y - i);
            ctx.stroke();
        }
        
        // Leaves
        for (let i = 0; i < 3; i++) {
            const leafY = y - height + (i * 15);
            const leafX = x + (Math.random() - 0.5) * 10;
            
            ctx.fillStyle = '#7ba05b';
            ctx.beginPath();
            ctx.ellipse(leafX, leafY, 8, 3, Math.random() * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.gardenElements.push({ type: 'bamboo', x, y, height });
    }

    placeLotus(x, y) {
        const ctx = this.gardenCtx;
        
        // Play lotus sound
        if (this.feedbackSoundsEnabled && this.gardenSounds && this.gardenSounds.lotus) {
            this.gardenSounds.lotus();
        }
        
        // Lotus petals
        const petalCount = 8;
        const petalSize = 12;
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalX = x + Math.cos(angle) * 8;
            const petalY = y + Math.sin(angle) * 8;
            
            ctx.fillStyle = '#ffb6c1';
            ctx.beginPath();
            ctx.ellipse(petalX, petalY, petalSize, petalSize * 0.5, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Lotus center
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        this.gardenElements.push({ type: 'lotus', x, y });
    }

    addWater(x, y) {
        const ctx = this.gardenCtx;
        const size = 25 + Math.random() * 15;
        
        // Play water drop sound
        if (this.feedbackSoundsEnabled && this.gardenSounds && this.gardenSounds.water) {
            this.gardenSounds.water();
        }
        
        // Water body
        ctx.fillStyle = 'rgba(168, 213, 229, 0.6)';
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Water ripples
        for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `rgba(168, 213, 229, ${0.3 - i * 0.1})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(x, y, size + i * 5, (size + i * 5) * 0.7, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        this.gardenElements.push({ type: 'water', x, y, size });
    }

    clearGarden() {
        this.gardenElements = [];
        this.createSandTexture();
    }

    // ==================== TIMER & MEDITATION ====================

    startTimer() {
        if (!this.isTimerRunning) {
            this.isTimerRunning = true;
            document.getElementById('timerToggle').textContent = '⏸️';
            
            this.timerInterval = setInterval(() => {
                this.meditationTimer++;
                this.updateTimerDisplay();
            }, 1000);
        }
    }

    toggleTimer() {
        if (this.isTimerRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    pauseTimer() {
        this.isTimerRunning = false;
        document.getElementById('timerToggle').textContent = '▶️';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Add session time to total meditation minutes
        this.userProgress.meditationMinutes += Math.floor(this.meditationTimer / 60);
        this.saveProgress();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.meditationTimer / 60);
        const seconds = this.meditationTimer % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('meditationTime').textContent = display;
    }

    // ==================== SPECIAL FEATURES ====================

    playChakraHarmony() {
        // Play all chakra bowls in sequence, then together
        let delay = 0;
        
        this.chakraBowls.forEach(bowl => {
            setTimeout(() => {
                this.playBowl(bowl.id, false);
            }, delay);
            delay += 500;
        });
        
        // Play full harmony after sequence
        setTimeout(() => {
            this.chakraBowls.forEach(bowl => {
                this.playBowl(bowl.id, true);
            });
            
            // Stop harmony after 10 seconds
            setTimeout(() => {
                this.chakraBowls.forEach(bowl => {
                    this.stopBowl(bowl.id);
                });
            }, 10000);
        }, delay + 1000);
    }

    saveComposition() {
        // Save current garden state and active frequencies
        const composition = {
            garden: this.gardenElements,
            timestamp: Date.now(),
            meditationTime: this.meditationTimer
        };
        
        localStorage.setItem('harmonyGardenComposition', JSON.stringify(composition));
        
        // Track garden creation for achievements
        this.userProgress.gardensCreated++;
        this.awardExperience(10);
        this.checkAchievements();
        
        this.showNotification('🎵 Composition saved!');
    }

    shareGarden() {
        // Create image of current garden
        this.garden.toBlob(blob => {
            const files = [new File([blob], 'zen-garden.png', { type: 'image/png' })];
            
            if (navigator.canShare && navigator.canShare({ files })) {
                navigator.share({
                    files,
                    title: 'My Zen Garden',
                    text: 'Created during my sound healing meditation session!'
                });
            } else {
                // Fallback: download image
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'zen-garden.png';
                link.click();
            }
        });
    }

    clearAll() {
        this.clearGarden();
        this.chakraBowls.forEach(bowl => this.stopBowl(bowl.id));
        this.activeBowls.clear();
        this.updateFrequencyDisplay();
        this.pauseTimer();
        this.meditationTimer = 0;
        this.updateTimerDisplay();
    }

    updateVolume(e) {
        this.masterVolume = e.target.value / 100;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
        }
    }

    // ==================== AUDIO EXPERIENCE CONTROLS ====================

    toggleAmbient() {
        const btn = document.getElementById('ambientToggle');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            this.stopAmbientSounds();
            btn.classList.remove('active');
            btn.innerHTML = '🌿 <s>Ambient</s>';
            console.log('🔇 Ambient sounds disabled');
        } else {
            this.createAmbientSoundscape();
            btn.classList.add('active');
            btn.innerHTML = '🌿 Ambient';
            console.log('🌿 Ambient sounds enabled');
        }
    }

    toggleSpatial() {
        const btn = document.getElementById('spatialToggle');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            this.spatialAudioEnabled = false;
            btn.classList.remove('active');
            btn.innerHTML = '🎧 <s>Spatial</s>';
            console.log('🔇 Spatial audio disabled');
        } else {
            this.spatialAudioEnabled = true;
            this.createSpatialAudio();
            btn.classList.add('active');
            btn.innerHTML = '🎧 Spatial';
            console.log('🎧 Spatial audio enabled');
        }
    }

    toggleFeedback() {
        const btn = document.getElementById('feedbackToggle');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            this.feedbackSoundsEnabled = false;
            btn.classList.remove('active');
            btn.innerHTML = '🔈 <s>Feedback</s>';
            console.log('🔇 Feedback sounds disabled');
        } else {
            this.feedbackSoundsEnabled = true;
            btn.classList.add('active');
            btn.innerHTML = '🔈 Feedback';
            console.log('🔈 Feedback sounds enabled');
        }
    }

    openLearning() {
        document.getElementById('learningModal').style.display = 'flex';
        this.generateLearningContent();
    }

    closeLearning() {
        document.getElementById('learningModal').style.display = 'none';
    }

    generateLearningContent() {
        const content = document.getElementById('learningContent');
        const dailyPractice = this.getDailyPractice();
        
        content.innerHTML = `
            <div class="learning-sections">
                <div class="learning-section">
                    <h4>🌅 Today's Practice</h4>
                    <button class="practice-quick-btn" onclick="singingBowlHarmonyGarden.showDailyPractice()">
                        ${dailyPractice.title} (${dailyPractice.duration})
                    </button>
                </div>
                
                <div class="learning-section">
                    <h4>🥣 About Singing Bowls</h4>
                    <p>Tibetan singing bowls have been used for centuries in meditation and healing practices. Each bowl produces specific frequencies that resonate with different chakras and energy centers in the body.</p>
                </div>
                
                <div class="learning-section">
                    <h4>🕉️ Chakra Healing Sessions</h4>
                    ${this.chakraBowls.map(bowl => `
                        <div class="chakra-healing">
                            <button class="chakra-heal-btn" onclick="singingBowlHarmonyGarden.startChakraHealing('${bowl.id}')" style="border-color: ${bowl.color}">
                                ${bowl.symbol} Heal ${bowl.name}
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="learning-section">
                    <h4>🎯 Spiritual Tools</h4>
                    <button class="spiritual-btn" onclick="singingBowlHarmonyGarden.setIntention()">💭 Set Daily Intention</button>
                    <button class="spiritual-btn" onclick="singingBowlHarmonyGarden.viewAchievements()">🏆 View Achievements</button>
                </div>
                
                <div class="learning-section">
                    <h4>🧘 Meditation Techniques</h4>
                    <p>• Focus on one bowl's sound to develop concentration</p>
                    <p>• Play multiple bowls to create healing harmonies</p>
                    <p>• Use the zen garden as a visual meditation focus</p>
                    <p>• Combine sounds with breath awareness</p>
                </div>
            </div>
        `;
    }

    // ==================== SPIRITUAL FEATURES & ACHIEVEMENTS ====================

    checkAchievements() {
        const newAchievements = [];
        
        // Bowl mastery achievements
        if (this.userProgress.bowlsMastered.size >= 7 && !this.userProgress.achievements.has('bowl_master')) {
            newAchievements.push({
                id: 'bowl_master',
                title: 'Bowl Master',
                description: 'Mastered all 7 chakra singing bowls',
                icon: '🏆'
            });
        }
        
        // Meditation time achievements
        const totalMinutes = Math.floor(this.meditationTimer / 60) + this.userProgress.meditationMinutes;
        
        if (totalMinutes >= 30 && !this.userProgress.achievements.has('meditation_novice')) {
            newAchievements.push({
                id: 'meditation_novice',
                title: 'Meditation Novice',
                description: 'Meditated for 30 minutes total',
                icon: '🧘‍♀️'
            });
        }
        
        if (totalMinutes >= 120 && !this.userProgress.achievements.has('meditation_adept')) {
            newAchievements.push({
                id: 'meditation_adept',
                title: 'Meditation Adept', 
                description: 'Meditated for 2 hours total',
                icon: '🕉️'
            });
        }
        
        if (totalMinutes >= 300 && !this.userProgress.achievements.has('zen_master')) {
            newAchievements.push({
                id: 'zen_master',
                title: 'Zen Master',
                description: 'Meditated for 5 hours total',
                icon: '👑'
            });
        }
        
        // Garden creation achievements
        if (this.userProgress.gardensCreated >= 5 && !this.userProgress.achievements.has('garden_creator')) {
            newAchievements.push({
                id: 'garden_creator',
                title: 'Garden Creator',
                description: 'Created 5 unique zen gardens',
                icon: '🌿'
            });
        }
        
        if (this.userProgress.gardensCreated >= 20 && !this.userProgress.achievements.has('landscape_artist')) {
            newAchievements.push({
                id: 'landscape_artist',
                title: 'Landscape Artist',
                description: 'Created 20 beautiful gardens',
                icon: '🎨'
            });
        }
        
        // Harmony achievements
        if (this.activeBowls.size >= 3 && !this.userProgress.achievements.has('harmony_seeker')) {
            newAchievements.push({
                id: 'harmony_seeker',
                title: 'Harmony Seeker',
                description: 'Played 3 bowls simultaneously',
                icon: '🎵'
            });
        }
        
        if (this.activeBowls.size >= 7 && !this.userProgress.achievements.has('chakra_harmonist')) {
            newAchievements.push({
                id: 'chakra_harmonist',
                title: 'Chakra Harmonist',
                description: 'Achieved full 7-chakra harmony',
                icon: '🌈'
            });
        }
        
        // Show new achievements
        newAchievements.forEach(achievement => {
            this.userProgress.achievements.add(achievement.id);
            this.showAchievement(achievement);
            this.awardExperience(50); // 50 XP per achievement
        });
        
        this.saveProgress();
    }

    showAchievement(achievement) {
        const notification = document.getElementById('achievementNotif');
        const title = document.getElementById('achievementTitle');
        const description = document.getElementById('achievementDescription');
        
        title.textContent = `${achievement.icon} ${achievement.title}`;
        description.textContent = achievement.description;
        
        notification.style.display = 'flex';
        notification.classList.add('achievement-show');
        
        // Play achievement sound
        this.playAchievementSound();
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.style.display = 'none';
            notification.classList.remove('achievement-show');
        }, 4000);
        
        console.log(`🏆 Achievement unlocked: ${achievement.title}`);
    }

    playAchievementSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        // Create uplifting achievement chord progression
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C octave
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.8);
            }, index * 150);
        });
    }

    awardExperience(points) {
        this.userProgress.experience += points;
        
        // Check for level up
        const newLevel = Math.floor(this.userProgress.experience / 100) + 1;
        if (newLevel > this.userProgress.level) {
            this.userProgress.level = newLevel;
            this.showLevelUp(newLevel);
        }
        
        this.updateProgressDisplay();
    }

    showLevelUp(level) {
        this.showNotification(`🌟 Level Up! You reached Level ${level}`);
        
        // Play level up sound
        if (this.soundEnabled && this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1046.50, this.audioContext.currentTime + 0.5);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.5);
        }
    }

    updateProgressDisplay() {
        // Update progress indicators in UI
        const progressWidget = document.querySelector('.progress-widget');
        if (progressWidget) {
            const experiencePercent = (this.userProgress.experience % 100);
            progressWidget.innerHTML = `
                <div class="level-display">Level ${this.userProgress.level}</div>
                <div class="xp-bar">
                    <div class="xp-fill" style="width: ${experiencePercent}%"></div>
                </div>
                <div class="xp-text">${this.userProgress.experience} XP</div>
            `;
        }
    }

    // Daily spiritual practices and guidance
    getDailyPractice() {
        const practices = [
            {
                title: "Morning Chakra Alignment",
                description: "Start your day by playing each chakra bowl in sequence, focusing on the energy centers in your body.",
                bowls: ['root', 'sacral', 'solar', 'heart', 'throat', 'third_eye', 'crown'],
                duration: "10 minutes"
            },
            {
                title: "Stress Release Garden",
                description: "Create flowing sand patterns while focusing on releasing tension and worry.",
                focus: "rake",
                affirmation: "I release what no longer serves me",
                duration: "15 minutes"
            },
            {
                title: "Heart Opening Meditation",
                description: "Focus on the heart chakra bowl while placing lotus flowers in your garden.",
                bowls: ['heart'],
                focus: "lotus",
                affirmation: "Love flows freely through me",
                duration: "12 minutes"
            },
            {
                title: "Grounding Earth Connection",
                description: "Place stones mindfully while listening to root chakra tones.",
                bowls: ['root'],
                focus: "stone",
                affirmation: "I am stable and secure",
                duration: "8 minutes"
            },
            {
                title: "Creative Expression Flow",
                description: "Let creativity guide your garden design with sacral chakra energy.",
                bowls: ['sacral'],
                focus: "bamboo",
                affirmation: "My creativity flows without limits",
                duration: "20 minutes"
            }
        ];
        
        const today = new Date();
        const practiceIndex = today.getDay() % practices.length;
        return practices[practiceIndex];
    }

    showDailyPractice() {
        const practice = this.getDailyPractice();
        const modal = document.getElementById('learningModal');
        const content = document.getElementById('learningContent');
        
        content.innerHTML = `
            <div class="daily-practice">
                <h3>🌅 Today's Spiritual Practice</h3>
                <div class="practice-card">
                    <h4>${practice.title}</h4>
                    <p class="practice-description">${practice.description}</p>
                    
                    ${practice.bowls ? `
                        <div class="practice-bowls">
                            <strong>Recommended Bowls:</strong>
                            ${practice.bowls.map(bowlId => {
                                const bowl = this.chakraBowls.find(b => b.id === bowlId);
                                return `<span class="bowl-tag" style="color: ${bowl.color}">${bowl.symbol} ${bowl.name}</span>`;
                            }).join(' ')}
                        </div>
                    ` : ''}
                    
                    ${practice.affirmation ? `
                        <div class="practice-affirmation">
                            <strong>Affirmation:</strong> "${practice.affirmation}"
                        </div>
                    ` : ''}
                    
                    <div class="practice-duration">
                        <strong>Duration:</strong> ${practice.duration}
                    </div>
                    
                    <button class="start-practice-btn" onclick="singingBowlHarmonyGarden.startGuidedPractice('${practice.title}')">
                        🧘‍♀️ Begin Practice
                    </button>
                </div>
                
                <div class="mindfulness-tips">
                    <h4>💡 Mindfulness Tips</h4>
                    <ul>
                        <li>Breathe deeply and naturally throughout your practice</li>
                        <li>Notice physical sensations as you interact with the bowls</li>
                        <li>Let thoughts come and go without judgment</li>
                        <li>Focus on the present moment and your sensory experience</li>
                        <li>End with gratitude for this time of self-care</li>
                    </ul>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    startGuidedPractice(practiceTitle) {
        this.closeLearning();
        this.showNotification(`🧘‍♀️ Starting: ${practiceTitle}`);
        this.startTimer();
        
        // Auto-guide the user based on practice
        const practice = this.getDailyPractice();
        if (practice.title === practiceTitle) {
            this.runGuidedSession(practice);
        }
    }

    runGuidedSession(practice) {
        let step = 0;
        const steps = this.createPracticeSteps(practice);
        
        const nextStep = () => {
            if (step < steps.length) {
                this.showNotification(steps[step]);
                step++;
                setTimeout(nextStep, 15000); // 15 seconds per step
            } else {
                this.showNotification("🌟 Practice complete! Well done.");
                this.awardExperience(25);
                this.checkAchievements();
            }
        };
        
        nextStep();
    }

    createPracticeSteps(practice) {
        const steps = [
            "🧘‍♀️ Find a comfortable position and take 3 deep breaths",
            "🎯 Set your intention for this practice session"
        ];
        
        if (practice.affirmation) {
            steps.push(`💭 Repeat your affirmation: "${practice.affirmation}"`);
        }
        
        if (practice.bowls) {
            practice.bowls.forEach(bowlId => {
                const bowl = this.chakraBowls.find(b => b.id === bowlId);
                steps.push(`${bowl.symbol} Focus on your ${bowl.name.toLowerCase()} - click the bowl`);
            });
        }
        
        if (practice.focus) {
            const tool = this.gardenTools.find(t => t.id === practice.focus);
            steps.push(`${tool.icon} Use the ${tool.name} in your garden mindfully`);
        }
        
        steps.push("🙏 Take a moment to appreciate your practice");
        
        return steps;
    }

    // Chakra healing sessions
    startChakraHealing(chakraId) {
        const chakra = this.chakraBowls.find(c => c.id === chakraId);
        if (!chakra) return;
        
        this.showNotification(`🕉️ Starting ${chakra.name} healing session`);
        
        // Play chakra-specific healing sequence
        this.playBowl(chakraId, true);
        
        // Guide user through chakra meditation
        const healingSteps = [
            `💫 Focus on your ${chakra.name.toLowerCase()}`,
            `🌟 Visualize ${chakra.color} light at this energy center`,
            `💭 Repeat: "${chakra.affirmation}"`,
            `🌊 Breathe into this area of your body`,
            `✨ Feel the energy flowing freely`
        ];
        
        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < healingSteps.length) {
                this.showNotification(healingSteps[stepIndex]);
                stepIndex++;
            } else {
                clearInterval(interval);
                this.stopBowl(chakraId);
                this.showNotification("🌟 Chakra healing complete!");
                this.userProgress.bowlsMastered.add(chakraId);
                this.awardExperience(15);
                this.checkAchievements();
            }
        }, 10000); // 10 seconds per step
    }

    // Manifestation and intention setting
    setIntention() {
        const intentions = [
            "I am open to receiving abundance in all forms",
            "I trust in the wisdom of my heart and intuition", 
            "I release fear and embrace love in all my actions",
            "I am grateful for this moment and all its possibilities",
            "I radiate peace and attract harmonious relationships",
            "I am worthy of love, success, and happiness",
            "I trust the process of life and my spiritual journey"
        ];
        
        const todayIntention = intentions[new Date().getDay()];
        
        this.showNotification(`💭 Today's Intention: ${todayIntention}`);
        
        // Visual intention ritual
        setTimeout(() => {
            this.showNotification("🕯️ Place your hands over your heart and repeat your intention");
        }, 3000);
        
        setTimeout(() => {
            this.showNotification("🌟 Your intention is set. Let it guide your practice.");
        }, 8000);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #20b2aa, #4169e1);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    viewAchievements() {
        const modal = document.getElementById('learningModal');
        const content = document.getElementById('learningContent');
        
        const allAchievements = [
            { id: 'bowl_master', title: 'Bowl Master', description: 'Mastered all 7 chakra singing bowls', icon: '🏆' },
            { id: 'meditation_novice', title: 'Meditation Novice', description: 'Meditated for 30 minutes total', icon: '🧘‍♀️' },
            { id: 'meditation_adept', title: 'Meditation Adept', description: 'Meditated for 2 hours total', icon: '🕉️' },
            { id: 'zen_master', title: 'Zen Master', description: 'Meditated for 5 hours total', icon: '👑' },
            { id: 'garden_creator', title: 'Garden Creator', description: 'Created 5 unique zen gardens', icon: '🌿' },
            { id: 'landscape_artist', title: 'Landscape Artist', description: 'Created 20 beautiful gardens', icon: '🎨' },
            { id: 'harmony_seeker', title: 'Harmony Seeker', description: 'Played 3 bowls simultaneously', icon: '🎵' },
            { id: 'chakra_harmonist', title: 'Chakra Harmonist', description: 'Achieved full 7-chakra harmony', icon: '🌈' }
        ];
        
        content.innerHTML = `
            <div class="achievements-display">
                <h3>🏆 Your Spiritual Journey</h3>
                
                <div class="progress-overview">
                    <div class="stat-card">
                        <span class="stat-icon">⭐</span>
                        <div class="stat-info">
                            <div class="stat-value">Level ${this.userProgress.level}</div>
                            <div class="stat-label">${this.userProgress.experience} XP</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <span class="stat-icon">🧘‍♀️</span>
                        <div class="stat-info">
                            <div class="stat-value">${this.userProgress.meditationMinutes + Math.floor(this.meditationTimer / 60)}</div>
                            <div class="stat-label">Minutes Meditated</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <span class="stat-icon">🌿</span>
                        <div class="stat-info">
                            <div class="stat-value">${this.userProgress.gardensCreated}</div>
                            <div class="stat-label">Gardens Created</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <span class="stat-icon">🥣</span>
                        <div class="stat-info">
                            <div class="stat-value">${this.userProgress.bowlsMastered.size}/7</div>
                            <div class="stat-label">Bowls Mastered</div>
                        </div>
                    </div>
                </div>
                
                <div class="achievements-grid">
                    ${allAchievements.map(achievement => {
                        const earned = this.userProgress.achievements.has(achievement.id);
                        return `
                            <div class="achievement-card ${earned ? 'earned' : 'locked'}">
                                <div class="achievement-icon">${achievement.icon}</div>
                                <div class="achievement-info">
                                    <h4>${achievement.title}</h4>
                                    <p>${achievement.description}</p>
                                </div>
                                ${earned ? '<div class="earned-badge">✅</div>' : '<div class="locked-badge">🔒</div>'}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="journey-encouragement">
                    <h4>🌟 Continue Your Journey</h4>
                    <p>Each moment of practice brings you closer to inner peace and spiritual growth.</p>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    loadProgress() {
        const saved = localStorage.getItem('harmonyGardenProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.userProgress = { 
                ...this.userProgress, 
                ...progress,
                bowlsMastered: new Set(progress.bowlsMastered || []),
                achievements: new Set(progress.achievements || [])
            };
        }
        
        // Initialize progress display
        this.updateProgressDisplay();
    }

    saveProgress() {
        const progressToSave = {
            ...this.userProgress,
            bowlsMastered: Array.from(this.userProgress.bowlsMastered),
            achievements: Array.from(this.userProgress.achievements)
        };
        localStorage.setItem('harmonyGardenProgress', JSON.stringify(progressToSave));
    }

    // ==================== CLEANUP ====================

    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        console.log('🥣 Singing Bowl Harmony Garden destroyed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('singingBowlContainer')) {
        console.log('🥣 Initializing Singing Bowl Harmony Garden...');
        window.singingBowlHarmonyGarden = new SingingBowlHarmonyGarden();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.singingBowlHarmonyGarden) {
        window.singingBowlHarmonyGarden.destroy();
    }
});

// ==================== MOBILE & DEVICE COMPATIBILITY ====================

// Mobile touch optimization
document.addEventListener('DOMContentLoaded', () => {
    // Prevent zoom on double tap for better mobile experience
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Optimize for mobile viewport
    if (window.innerWidth <= 768) {
        console.log('📱 Mobile device detected - optimizing interface');
        
        // Add mobile-specific styles
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            @media (max-width: 768px) {
                .harmony-garden-app {
                    padding: 0.5rem !important;
                }
                
                .bowls-circle {
                    transform: scale(0.8) !important;
                    margin: 1rem auto !important;
                }
                
                .zen-garden-canvas {
                    max-width: 100% !important;
                    height: 250px !important;
                }
                
                .garden-tools {
                    flex-wrap: wrap !important;
                    gap: 0.5rem !important;
                }
                
                .tool-btn {
                    padding: 0.5rem 0.75rem !important;
                    font-size: 0.8rem !important;
                }
                
                .audio-toggles {
                    flex-direction: column !important;
                    align-items: center !important;
                }
                
                .frequency-canvas {
                    height: 80px !important;
                }
                
                .progress-stats {
                    grid-template-columns: 1fr !important;
                    gap: 1rem !important;
                }
            }
        `;
        document.head.appendChild(mobileStyles);
    }
});

// Performance optimization for different devices
window.addEventListener('load', () => {
    // Detect device capabilities
    const isLowPowerDevice = window.navigator.hardwareConcurrency <= 2;
    const isSlowConnection = navigator.connection && navigator.connection.effectiveType === 'slow-2g';
    
    if (isLowPowerDevice || isSlowConnection) {
        console.log('⚡ Low-power device detected - optimizing performance');
        
        if (window.singingBowlHarmonyGarden) {
            // Reduce visual effects for performance
            window.singingBowlHarmonyGarden.performanceMode = true;
            
            // Simplify audio processing
            if (window.singingBowlHarmonyGarden.ambientSounds) {
                window.singingBowlHarmonyGarden.stopAmbientSounds();
            }
        }
    }
});

// iOS Safari audio context fix
document.addEventListener('touchstart', function() {
    if (window.singingBowlHarmonyGarden && window.singingBowlHarmonyGarden.audioContext) {
        if (window.singingBowlHarmonyGarden.audioContext.state === 'suspended') {
            window.singingBowlHarmonyGarden.audioContext.resume().then(() => {
                console.log('🍎 iOS Audio context resumed');
            });
        }
    }
}, { once: true });

// Graceful degradation for unsupported features
window.addEventListener('DOMContentLoaded', () => {
    // Check for Web Audio API support
    if (!window.AudioContext && !window.webkitAudioContext) {
        console.warn('🔇 Web Audio API not supported - providing fallback experience');
        
        // Show notification about limited audio
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(245, 158, 11, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        `;
        notification.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem;">🎵 Audio Enhancement</div>
            <div style="font-size: 0.9rem;">For the best sound healing experience, use a modern browser with audio support.</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
    
    // Check for Canvas support
    if (!document.createElement('canvas').getContext) {
        console.warn('🎨 Canvas not supported - providing alternative visualization');
    }
});

console.log('✅ Singing Bowl Harmony Garden - Full system loaded and optimized');