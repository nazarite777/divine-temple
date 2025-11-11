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
        console.log('🔊 Creating trivia sound effects...');
        
        // Question reveal - gentle ascending notes
        this.sounds.questionReveal = () => {
            const notes = [523, 659, 784]; // C, E, G
            this.playSequence(notes, 0.15, 'sine', 0.3, 100);
        };
        
        // Correct answer - harmonious major chord
        this.sounds.correctAnswer = () => {
            const chord = [523, 659, 784, 1047]; // C major chord with octave
            this.playChord(chord, 0.6, 'sine', 0.4);
            
            // Add sparkle effect
            setTimeout(() => {
                const sparkle = [1319, 1568, 1865];
                this.playSequence(sparkle, 0.2, 'sine', 0.2, 80);
            }, 200);
        };
        
        // Wrong answer - gentle, not harsh feedback
        this.sounds.wrongAnswer = () => {
            const notes = [392, 349]; // G to F (descending)
            this.playSequence(notes, 0.3, 'triangle', 0.25, 150);
        };
        
        // Timer warning - subtle pulse
        this.sounds.timerWarning = () => {
            this.playTone(800, 0.1, 'square', 0.15);
        };
        
        // Timer critical - more urgent but still gentle
        this.sounds.timerCritical = () => {
            this.playTone(1000, 0.15, 'square', 0.2);
            setTimeout(() => this.playTone(1000, 0.15, 'square', 0.2), 200);
        };
        
        // Victory - triumphant progression
        this.sounds.victory = () => {
            const progression = [
                [523, 659, 784],    // C major
                [587, 740, 880],    // D major  
                [659, 831, 988],    // E major
                [523, 659, 784, 1047] // C major with octave
            ];
            
            progression.forEach((chord, index) => {
                setTimeout(() => {
                    this.playChord(chord, 0.8, 'sine', 0.4);
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