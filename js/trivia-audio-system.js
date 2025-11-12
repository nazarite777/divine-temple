/**
 * 🎵 TRIVIA GAME SOUND SYSTEM
 * Immersive audio experience for the daily spiritual trivia
 * 
 * Features:
 * - Question reveal sounds
 * - Correct/incorrect answer feedback
 * - Timer warning beeps
 * - Victory celebration sounds
 * - Ambient spiritual background music
 * - UI interaction sounds
 */

class TriviaAudioSystem {
    constructor() {
        this.audioContext = null;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.masterVolume = 0.7;
        
        // Sound library
        this.sounds = {
            questionReveal: null,
            correctAnswer: null,
            wrongAnswer: null,
            timerWarning: null,
            timerCritical: null,
            victory: null,
            perfectScore: null,
            streak: null,
            click: null,
            hover: null,
            achievement: null
        };
        
        // Background music
        this.backgroundMusic = {
            oscillators: [],
            gainNodes: [],
            isPlaying: false
        };
        
        this.init();
    }

    // ==================== INITIALIZATION ====================
    
    async init() {
        console.log('🎵 Initializing Trivia Audio System...');
        
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('✅ Audio context created');
            
            // Create all sound effects
            this.createSoundEffects();
            
            // Load user preferences
            this.loadSoundPreferences();
            
            console.log('🎵 Trivia Audio System ready!');
        } catch (error) {
            console.error('❌ Audio system initialization failed:', error);
        }
    }

    // ==================== SOUND CREATION ====================
    
    createSoundEffects() {
        console.log('🔊 Creating realistic trivia sound effects...');

        // Question reveal - gentle temple bells ascending
        this.sounds.questionReveal = () => {
            const notes = [523, 659, 784]; // C, E, G
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    this.playBellTone(freq, 0.4, 0.25);
                }, index * 120);
            });
        };

        // Correct answer - harmonious singing bowls with shimmer
        this.sounds.correctAnswer = () => {
            // Main singing bowl sound
            const fundamentals = [523, 659, 784]; // C major triad
            fundamentals.forEach(freq => {
                this.playSingingBowl(freq, 0.8, 0.35);
            });

            // Add crystalline shimmer after a moment
            setTimeout(() => {
                const sparkle = [1319, 1568, 1865, 2093];
                sparkle.forEach((freq, index) => {
                    setTimeout(() => {
                        this.playBellTone(freq, 0.3, 0.15);
                    }, index * 60);
                });
            }, 200);
        };

        // Wrong answer - soft wooden block tap (not harsh)
        this.sounds.wrongAnswer = () => {
            this.playWoodenBlock(0.25);
        };

        // Timer warning - gentle tingsha bell
        this.sounds.timerWarning = () => {
            this.playTingshaClick(0.18);
        };

        // Timer critical - more urgent tingsha
        this.sounds.timerCritical = () => {
            this.playTingshaClick(0.22);
            setTimeout(() => this.playTingshaClick(0.22), 180);
        };

        // Victory - triumphant temple bells
        this.sounds.victory = () => {
            const progression = [
                [523, 659, 784],       // C major
                [587, 740, 880],       // D major
                [659, 831, 988],       // E major
                [523, 659, 784, 1047]  // C major with octave
            ];

            progression.forEach((chord, index) => {
                setTimeout(() => {
                    chord.forEach(freq => {
                        this.playBellTone(freq, 1.2, 0.3);
                    });
                }, index * 400);
            });
        };
        
        // Perfect score - magical celebration
        this.sounds.perfectScore = () => {
            // Play victory first
            this.sounds.victory();
            
            // Add magical sparkle overlay
            setTimeout(() => {
                const magicalNotes = [1047, 1319, 1568, 1865, 2093, 2349];
                magicalNotes.forEach((freq, index) => {
                    setTimeout(() => {
                        this.playTone(freq, 0.3, 'sine', 0.2);
                    }, index * 100);
                });
            }, 800);
        };
        
        // Streak - ascending celebration
        this.sounds.streak = () => {
            const streakNotes = [659, 784, 988, 1175];
            this.playSequence(streakNotes, 0.2, 'sine', 0.3, 120);
        };
        
        // Click - subtle tap
        this.sounds.click = () => {
            this.playTone(1200, 0.05, 'sine', 0.1);
        };
        
        // Hover - very subtle
        this.sounds.hover = () => {
            this.playTone(800, 0.03, 'sine', 0.05);
        };
        
        // Achievement - special fanfare
        this.sounds.achievement = () => {
            const fanfare = [523, 659, 784, 1047, 1319];
            fanfare.forEach((freq, index) => {
                setTimeout(() => {
                    this.playTone(freq, 0.4, 'sine', 0.3);
                }, index * 150);
            });
        };
        
        console.log('✅ All trivia sound effects created');
    }

    // ==================== REALISTIC SOUND GENERATORS ====================

    /**
     * Play a realistic bell tone with harmonics and natural decay
     */
    playBellTone(frequency, duration = 0.6, volume = 0.3) {
        if (!this.soundEnabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Fundamental tone
        const osc1 = this.audioContext.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(frequency, now);

        // Harmonic overtones for bell character
        const osc2 = this.audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(frequency * 2.76, now); // Minor third harmonic

        const osc3 = this.audioContext.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(frequency * 5.4, now); // Metallic overtone

        // Gains with natural bell envelope
        const gain1 = this.audioContext.createGain();
        const gain2 = this.audioContext.createGain();
        const gain3 = this.audioContext.createGain();

        // Bell has fast attack, long decay
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(volume * this.masterVolume, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(volume * 0.6 * this.masterVolume, now + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

        gain3.gain.setValueAtTime(0, now);
        gain3.gain.linearRampToValueAtTime(volume * 0.3 * this.masterVolume, now + 0.005);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);

        // Add subtle reverb with delay
        const delay = this.audioContext.createDelay();
        delay.delayTime.setValueAtTime(0.03, now);
        const delayGain = this.audioContext.createGain();
        delayGain.gain.setValueAtTime(0.15, now);

        // Connect graph
        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);

        gain1.connect(this.audioContext.destination);
        gain2.connect(this.audioContext.destination);
        gain3.connect(this.audioContext.destination);

        gain1.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(this.audioContext.destination);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        osc1.stop(now + duration + 0.1);
        osc2.stop(now + duration + 0.1);
        osc3.stop(now + duration + 0.1);
    }

    /**
     * Play realistic singing bowl sound
     */
    playSingingBowl(frequency, duration = 1.5, volume = 0.3) {
        if (!this.soundEnabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Fundamental with slight vibrato
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);

        // Vibrato LFO
        const vibrato = this.audioContext.createOscillator();
        vibrato.frequency.setValueAtTime(4, now); // 4 Hz vibrato
        const vibratoGain = this.audioContext.createGain();
        vibratoGain.gain.setValueAtTime(3, now); // +/- 3 Hz

        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);

        // Envelope
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume * this.masterVolume, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(volume * 0.7 * this.masterVolume, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Filter for warmth
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 3, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(now);
        vibrato.start(now);

        osc.stop(now + duration);
        vibrato.stop(now + duration);
    }

    /**
     * Play gentle bamboo tap sound (soft, non-intrusive)
     */
    playWoodenBlock(volume = 0.3) {
        if (!this.soundEnabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Gentle bamboo tap using soft sine tones
        const fundamental = this.audioContext.createOscillator();
        fundamental.type = 'sine';
        fundamental.frequency.setValueAtTime(440, now); // Gentle A note

        const harmonic = this.audioContext.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.setValueAtTime(880, now); // Octave harmonic

        // Very gentle envelopes (no harsh attack)
        const fundamentalGain = this.audioContext.createGain();
        const harmonicGain = this.audioContext.createGain();

        fundamentalGain.gain.setValueAtTime(0, now);
        fundamentalGain.gain.linearRampToValueAtTime(volume * 0.2 * this.masterVolume, now + 0.005);
        fundamentalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        harmonicGain.gain.setValueAtTime(0, now);
        harmonicGain.gain.linearRampToValueAtTime(volume * 0.1 * this.masterVolume, now + 0.005);
        harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        // Soft low-pass filter for warmth
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(0.5, now);

        fundamental.connect(filter);
        harmonic.connect(filter);

        filter.connect(fundamentalGain);
        filter.connect(harmonicGain);

        fundamentalGain.connect(this.audioContext.destination);
        harmonicGain.connect(this.audioContext.destination);

        fundamental.start(now);
        harmonic.start(now);

        fundamental.stop(now + 0.25);
        harmonic.stop(now + 0.2);
    }

    /**
     * Play tingsha cymbal click sound
     */
    playTingshaClick(volume = 0.2) {
        if (!this.soundEnabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;

        // High pitched metallic tones
        const freq1 = 2500;
        const freq2 = 2637; // Slightly detuned for shimmer

        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();

        osc1.frequency.setValueAtTime(freq1, now);
        osc2.frequency.setValueAtTime(freq2, now);

        osc1.type = 'sine';
        osc2.type = 'sine';

        const gain1 = this.audioContext.createGain();
        const gain2 = this.audioContext.createGain();

        // Sharp attack, quick decay
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(volume * this.masterVolume, now + 0.005);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(volume * 0.8 * this.masterVolume, now + 0.005);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc1.connect(gain1);
        osc2.connect(gain2);

        gain1.connect(this.audioContext.destination);
        gain2.connect(this.audioContext.destination);

        osc1.start(now);
        osc2.start(now);

        osc1.stop(now + 0.35);
        osc2.stop(now + 0.3);
    }

    // ==================== AUDIO PRIMITIVES ====================

    playTone(frequency, duration, waveType = 'sine', volume = 0.3) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = waveType;
            
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
        } catch (error) {
            console.error('Error playing tone:', error);
        }
    }
    
    playChord(frequencies, duration, waveType = 'sine', volume = 0.4) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        frequencies.forEach(freq => {
            this.playTone(freq, duration, waveType, volume / frequencies.length);
        });
    }
    
    playSequence(frequencies, duration, waveType = 'sine', volume = 0.3, gap = 100) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, duration, waveType, volume);
            }, index * gap);
        });
    }

    // ==================== BACKGROUND MUSIC ====================
    
    startBackgroundMusic() {
        if (!this.musicEnabled || !this.audioContext || this.backgroundMusic.isPlaying) return;
        
        console.log('🎵 Starting trivia background music...');
        
        // Spiritual frequencies for meditation/concentration
        const frequencies = [
            174, // Pain relief and healing
            285, // Tissue regeneration  
            396, // Fear and guilt release
            417, // Change and new beginnings
            528, // Love and DNA repair
            639, // Connection and relationships
            741, // Awakening intuition
            852  // Spiritual awareness
        ];
        
        // Create gentle drones at low volume
        frequencies.forEach((freq, index) => {
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
                    
                    // Low-pass filter for warmth
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(freq * 1.5, this.audioContext.currentTime);
                    
                    // Very low volume for ambient effect
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.015 * this.masterVolume, this.audioContext.currentTime + 3);
                    
                    oscillator.start();
                    
                    this.backgroundMusic.oscillators.push(oscillator);
                    this.backgroundMusic.gainNodes.push(gainNode);
                } catch (error) {
                    console.error('Error creating background music:', error);
                }
            }, index * 1000); // Stagger the start times
        });
        
        this.backgroundMusic.isPlaying = true;
    }
    
    stopBackgroundMusic() {
        if (!this.backgroundMusic.isPlaying) return;
        
        console.log('🎵 Stopping trivia background music...');
        
        // Fade out and stop all oscillators
        this.backgroundMusic.gainNodes.forEach(gainNode => {
            try {
                gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
            } catch (error) {
                // Ignore errors from already stopped nodes
            }
        });
        
        this.backgroundMusic.oscillators.forEach(oscillator => {
            try {
                oscillator.stop(this.audioContext.currentTime + 1);
            } catch (error) {
                // Ignore errors from already stopped oscillators
            }
        });
        
        // Clear arrays
        this.backgroundMusic.oscillators = [];
        this.backgroundMusic.gainNodes = [];
        this.backgroundMusic.isPlaying = false;
    }

    // ==================== SETTINGS & PREFERENCES ====================
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSoundPreferences();
        
        // Play confirmation if enabling
        if (this.soundEnabled) {
            setTimeout(() => this.sounds.click(), 100);
        }
        
        console.log(`🔊 Sound effects ${this.soundEnabled ? 'enabled' : 'disabled'}`);
        return this.soundEnabled;
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        this.saveSoundPreferences();
        
        if (this.musicEnabled) {
            this.startBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
        
        console.log(`🎵 Background music ${this.musicEnabled ? 'enabled' : 'disabled'}`);
        return this.musicEnabled;
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.saveSoundPreferences();
        console.log(`🔊 Master volume set to ${Math.round(this.masterVolume * 100)}%`);
    }
    
    loadSoundPreferences() {
        try {
            const saved = localStorage.getItem('trivia-audio-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.soundEnabled = settings.soundEnabled !== false;
                this.musicEnabled = settings.musicEnabled !== false;
                this.masterVolume = settings.masterVolume || 0.7;
                console.log('✅ Audio preferences loaded');
            }
        } catch (error) {
            console.error('Error loading audio preferences:', error);
        }
    }
    
    saveSoundPreferences() {
        try {
            const settings = {
                soundEnabled: this.soundEnabled,
                musicEnabled: this.musicEnabled,
                masterVolume: this.masterVolume
            };
            localStorage.setItem('trivia-audio-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving audio preferences:', error);
        }
    }

    // ==================== PUBLIC API ====================
    
    // Resume audio context (required for browser autoplay policies)
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('✅ Audio context resumed');
            } catch (error) {
                console.error('Error resuming audio context:', error);
            }
        }
    }
    
    // Play specific sound effect
    playSound(soundName) {
        if (this.sounds[soundName] && typeof this.sounds[soundName] === 'function') {
            // Resume audio context if needed
            this.resumeAudioContext();
            this.sounds[soundName]();
        } else {
            console.warn(`Sound "${soundName}" not found`);
        }
    }
    
    // Clean up audio resources
    destroy() {
        console.log('🎵 Cleaning up Trivia Audio System...');
        
        this.stopBackgroundMusic();
        
        if (this.audioContext) {
            try {
                this.audioContext.close();
            } catch (error) {
                console.error('Error closing audio context:', error);
            }
        }
    }
}

// Export for use in trivia system
window.TriviaAudioSystem = TriviaAudioSystem;