/**
 * 🎵 DIVINE AUDIO ENGINE
 * Universal audio system for sacred sounds across all sections
 *
 * Features:
 * - Multi-layered harmonic tones
 * - Binaural beats generator
 * - Nature soundscapes
 * - Sacred frequencies (Solfeggio, chakra tones, etc.)
 * - Smooth fade in/out
 * - Volume mixing
 * - Audio scheduling
 */

class DivineAudioEngine {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.activeSources = new Map();
        this.isInitialized = false;

        // Audio constants
        this.FADE_TIME = 0.5; // seconds
        this.DEFAULT_VOLUME = 0.3;

        console.log('🎵 Divine Audio Engine created');
    }

    // ==================== INITIALIZATION ====================

    init() {
        if (this.isInitialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = this.DEFAULT_VOLUME;
            this.masterGain.connect(this.context.destination);

            this.isInitialized = true;
            console.log('✅ Divine Audio Engine initialized');
        } catch (error) {
            console.error('❌ Failed to initialize audio:', error);
        }
    }

    // ==================== SOLFEGGIO FREQUENCIES ====================

    /**
     * Play Solfeggio healing frequency with harmonics
     * @param {number} frequency - Base frequency (e.g., 528 for transformation)
     * @param {string} id - Unique identifier for this sound
     * @param {number} duration - Duration in seconds (0 = infinite)
     */
    playSolfeggio(frequency, id = 'solfeggio', duration = 0) {
        this.init();
        this.stop(id); // Stop any existing sound with this ID

        const oscillators = [];
        const gains = [];

        // Fundamental frequency (main tone)
        const fundamental = this.context.createOscillator();
        fundamental.type = 'sine';
        fundamental.frequency.setValueAtTime(frequency, this.context.currentTime);

        const fundamentalGain = this.context.createGain();
        fundamentalGain.gain.setValueAtTime(0, this.context.currentTime);
        fundamentalGain.gain.linearRampToValueAtTime(0.4, this.context.currentTime + this.FADE_TIME);

        fundamental.connect(fundamentalGain);
        fundamentalGain.connect(this.masterGain);
        oscillators.push(fundamental);
        gains.push(fundamentalGain);

        // Harmonic 1: Octave above (adds brightness)
        const harmonic1 = this.context.createOscillator();
        harmonic1.type = 'sine';
        harmonic1.frequency.setValueAtTime(frequency * 2, this.context.currentTime);

        const harmonic1Gain = this.context.createGain();
        harmonic1Gain.gain.setValueAtTime(0, this.context.currentTime);
        harmonic1Gain.gain.linearRampToValueAtTime(0.15, this.context.currentTime + this.FADE_TIME);

        harmonic1.connect(harmonic1Gain);
        harmonic1Gain.connect(this.masterGain);
        oscillators.push(harmonic1);
        gains.push(harmonic1Gain);

        // Harmonic 2: Perfect fifth (adds depth)
        const harmonic2 = this.context.createOscillator();
        harmonic2.type = 'sine';
        harmonic2.frequency.setValueAtTime(frequency * 1.5, this.context.currentTime);

        const harmonic2Gain = this.context.createGain();
        harmonic2Gain.gain.setValueAtTime(0, this.context.currentTime);
        harmonic2Gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + this.FADE_TIME);

        harmonic2.connect(harmonic2Gain);
        harmonic2Gain.connect(this.masterGain);
        oscillators.push(harmonic2);
        gains.push(harmonic2Gain);

        // Sub-harmonic: Octave below (adds grounding)
        const subHarmonic = this.context.createOscillator();
        subHarmonic.type = 'sine';
        subHarmonic.frequency.setValueAtTime(frequency / 2, this.context.currentTime);

        const subGain = this.context.createGain();
        subGain.gain.setValueAtTime(0, this.context.currentTime);
        subGain.gain.linearRampToValueAtTime(0.2, this.context.currentTime + this.FADE_TIME);

        subHarmonic.connect(subGain);
        subGain.connect(this.masterGain);
        oscillators.push(subHarmonic);
        gains.push(subGain);

        // Start all oscillators
        oscillators.forEach(osc => osc.start());

        // Schedule stop if duration specified
        if (duration > 0) {
            setTimeout(() => this.stop(id), duration * 1000);
        }

        // Store for later control
        this.activeSources.set(id, { oscillators, gains });

        return id;
    }

    // ==================== BINAURAL BEATS ====================

    /**
     * Create binaural beats for meditation/focus states
     * @param {number} baseFrequency - Carrier frequency (e.g., 200)
     * @param {number} beatFrequency - Beat frequency (e.g., 10 for alpha)
     * @param {string} id - Unique identifier
     *
     * Beat frequencies:
     * - Delta (0.5-4 Hz): Deep sleep
     * - Theta (4-8 Hz): Meditation, creativity
     * - Alpha (8-14 Hz): Relaxation, light meditation
     * - Beta (14-30 Hz): Focus, alertness
     * - Gamma (30-100 Hz): High-level cognition
     */
    playBinauralBeat(baseFrequency, beatFrequency, id = 'binaural') {
        this.init();
        this.stop(id);

        // Create stereo panner for each ear
        const leftOsc = this.context.createOscillator();
        const rightOsc = this.context.createOscillator();

        const leftGain = this.context.createGain();
        const rightGain = this.context.createGain();

        const leftPanner = this.context.createStereoPanner();
        const rightPanner = this.context.createStereoPanner();

        // Left ear: base frequency
        leftOsc.type = 'sine';
        leftOsc.frequency.setValueAtTime(baseFrequency, this.context.currentTime);
        leftPanner.pan.value = -1; // Full left

        // Right ear: base + beat frequency
        rightOsc.type = 'sine';
        rightOsc.frequency.setValueAtTime(baseFrequency + beatFrequency, this.context.currentTime);
        rightPanner.pan.value = 1; // Full right

        // Fade in
        leftGain.gain.setValueAtTime(0, this.context.currentTime);
        leftGain.gain.linearRampToValueAtTime(0.3, this.context.currentTime + this.FADE_TIME);

        rightGain.gain.setValueAtTime(0, this.context.currentTime);
        rightGain.gain.linearRampToValueAtTime(0.3, this.context.currentTime + this.FADE_TIME);

        // Connect nodes
        leftOsc.connect(leftGain);
        leftGain.connect(leftPanner);
        leftPanner.connect(this.masterGain);

        rightOsc.connect(rightGain);
        rightGain.connect(rightPanner);
        rightPanner.connect(this.masterGain);

        // Start
        leftOsc.start();
        rightOsc.start();

        this.activeSources.set(id, {
            oscillators: [leftOsc, rightOsc],
            gains: [leftGain, rightGain]
        });

        return id;
    }

    // ==================== CHAKRA FREQUENCIES ====================

    /**
     * Play chakra-specific healing frequency
     */
    playChakraFrequency(chakraName, id = null) {
        const frequencies = {
            'root': 396,
            'sacral': 417,
            'solar': 528,
            'heart': 639,
            'throat': 741,
            'third-eye': 852,
            'crown': 963
        };

        const frequency = frequencies[chakraName.toLowerCase()];
        if (!frequency) {
            console.error('Unknown chakra:', chakraName);
            return null;
        }

        return this.playSolfeggio(frequency, id || `chakra-${chakraName}`);
    }

    // ==================== AMBIENT SOUNDSCAPES ====================

    /**
     * Create ambient nature soundscape using noise and filtering
     */
    playAmbientSound(type = 'ocean', id = 'ambient') {
        this.init();
        this.stop(id);

        // Create noise source
        const bufferSize = 2 * this.context.sampleRate;
        const noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        // Generate noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.context.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        // Filter based on type
        const filter = this.context.createBiquadFilter();

        switch(type) {
            case 'ocean':
                filter.type = 'lowpass';
                filter.frequency.value = 500;
                filter.Q.value = 0.5;
                break;
            case 'rain':
                filter.type = 'bandpass';
                filter.frequency.value = 1000;
                filter.Q.value = 2;
                break;
            case 'wind':
                filter.type = 'highpass';
                filter.frequency.value = 800;
                filter.Q.value = 0.3;
                break;
            case 'forest':
                filter.type = 'bandpass';
                filter.frequency.value = 600;
                filter.Q.value = 1;
                break;
        }

        const gain = this.context.createGain();
        gain.gain.setValueAtTime(0, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.context.currentTime + this.FADE_TIME * 2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();

        this.activeSources.set(id, {
            oscillators: [noise],
            gains: [gain]
        });

        return id;
    }

    // ==================== SACRED BELLS & CHIMES ====================

    /**
     * Play a meditation bell/chime sound
     */
    playBell(frequency = 528, duration = 3, id = null) {
        this.init();
        const bellId = id || `bell-${Date.now()}`;

        const osc = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, this.context.currentTime);

        const gain = this.context.createGain();

        // Bell envelope: Quick attack, slow decay
        gain.gain.setValueAtTime(0, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(0.6, this.context.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.context.currentTime + duration);

        return bellId;
    }

    /**
     * Play interval bells for meditation timer
     */
    playIntervalBells(intervals = [60, 120, 180]) {
        intervals.forEach(seconds => {
            setTimeout(() => this.playBell(528, 2), seconds * 1000);
        });
    }

    // ==================== SACRED OM/AUM TONE ====================

    /**
     * Play the sacred Om/Aum tone (approximately 136.1 Hz - Earth year frequency)
     */
    playOm(id = 'om') {
        return this.playSolfeggio(136.1, id);
    }

    // ==================== CONTROL FUNCTIONS ====================

    /**
     * Stop a specific sound by ID
     */
    stop(id) {
        if (!this.activeSources.has(id)) return;

        const { oscillators, gains } = this.activeSources.get(id);
        const fadeTime = this.FADE_TIME;

        // Fade out
        gains.forEach(gain => {
            gain.gain.linearRampToValueAtTime(0, this.context.currentTime + fadeTime);
        });

        // Stop after fade
        setTimeout(() => {
            oscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            this.activeSources.delete(id);
        }, fadeTime * 1000);
    }

    /**
     * Stop all active sounds
     */
    stopAll() {
        const ids = Array.from(this.activeSources.keys());
        ids.forEach(id => this.stop(id));
    }

    /**
     * Set master volume (0-1)
     */
    setVolume(volume) {
        if (!this.masterGain) return;
        const clampedVolume = Math.max(0, Math.min(1, volume));
        this.masterGain.gain.linearRampToValueAtTime(
            clampedVolume,
            this.context.currentTime + 0.1
        );
    }

    /**
     * Get current volume
     */
    getVolume() {
        return this.masterGain ? this.masterGain.gain.value : this.DEFAULT_VOLUME;
    }

    /**
     * Check if a sound is currently playing
     */
    isPlaying(id) {
        return this.activeSources.has(id);
    }

    /**
     * Get list of active sound IDs
     */
    getActiveSounds() {
        return Array.from(this.activeSources.keys());
    }

    // ==================== PRESETS ====================

    /**
     * Play preset meditation soundscape
     */
    playMeditationPreset(preset = 'peaceful') {
        const presets = {
            'peaceful': () => {
                this.playBinauralBeat(200, 8, 'binaural'); // Theta waves
                this.playAmbientSound('ocean', 'ambient');
            },
            'deep': () => {
                this.playBinauralBeat(200, 4, 'binaural'); // Delta waves
                this.playAmbientSound('rain', 'ambient');
            },
            'focused': () => {
                this.playBinauralBeat(200, 14, 'binaural'); // Beta waves
                this.playAmbientSound('forest', 'ambient');
            },
            'heart': () => {
                this.playChakraFrequency('heart', 'chakra');
                this.playAmbientSound('wind', 'ambient');
            },
            'sacred': () => {
                this.playOm('om');
                setTimeout(() => this.playBell(528, 3), 5000);
            }
        };

        const presetFunc = presets[preset];
        if (presetFunc) {
            presetFunc();
        } else {
            console.error('Unknown preset:', preset);
        }
    }

    // ==================== UTILITY ====================

    /**
     * Resume audio context (needed after user interaction)
     */
    async resume() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
            console.log('🎵 Audio context resumed');
        }
    }

    /**
     * Get audio context state
     */
    getState() {
        return this.context ? this.context.state : 'not-initialized';
    }
}

// ==================== GLOBAL INSTANCE ====================

// Create global instance
window.divineAudio = new DivineAudioEngine();

// Auto-resume on user interaction
document.addEventListener('click', () => {
    window.divineAudio.resume();
}, { once: true });

document.addEventListener('touchstart', () => {
    window.divineAudio.resume();
}, { once: true });

console.log('✨ Divine Audio Engine loaded and ready');
