/**
 * 🌿 AMBIENT NATURE SOUNDS SYSTEM
 *
 * Creates realistic, gentle nature sounds for spiritual ambience:
 * - Soft wind/breeze
 * - Enhanced bird chirps and songs
 * - Natural forest ambience
 *
 * All sounds designed to be calming, non-intrusive, and meditation-friendly
 */

class AmbientNatureSounds {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.activeNodes = [];

        // Wind system
        this.windNodes = {
            oscillators: [],
            filters: [],
            gains: []
        };

        // Bird system
        this.birdIntervals = [];

        this.masterVolume = 0.10; // Very gentle
        this.windVolume = 0.08;
        this.birdVolume = 0.15;
        this.enabled = true;

        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🌿 Ambient Nature Sounds initialized');
        } catch (error) {
            console.error('Failed to initialize nature sounds:', error);
        }
    }

    // ==================== GENTLE BREEZE/WIND ====================

    /**
     * Create realistic gentle breeze using filtered noise
     * Mimics air movement through trees and grass
     */
    startGentleBreeze() {
        if (!this.enabled || !this.audioContext) return;

        console.log('🌬️ Starting gentle breeze...');

        const now = this.audioContext.currentTime;

        // Create brown noise (lower frequency than white noise - softer)
        const bufferSize = this.audioContext.sampleRate * 2;
        const brownNoiseBuffer = this.audioContext.createBuffer(
            1,
            bufferSize,
            this.audioContext.sampleRate
        );
        const brownNoiseData = brownNoiseBuffer.getChannelData(0);

        // Generate brown noise (gentle, wind-like)
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            brownNoiseData[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = brownNoiseData[i];
            brownNoiseData[i] *= 3.5; // Amplify brown noise
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = brownNoiseBuffer;
        noise.loop = true;

        // Multiple band-pass filters for natural wind character
        // Low frequencies = gentle whoosh
        const lowFilter = this.audioContext.createBiquadFilter();
        lowFilter.type = 'bandpass';
        lowFilter.frequency.setValueAtTime(150, now);
        lowFilter.Q.setValueAtTime(0.5, now);

        const midFilter = this.audioContext.createBiquadFilter();
        midFilter.type = 'bandpass';
        midFilter.frequency.setValueAtTime(400, now);
        midFilter.Q.setValueAtTime(0.3, now);

        const highFilter = this.audioContext.createBiquadFilter();
        highFilter.type = 'highpass';
        highFilter.frequency.setValueAtTime(800, now);

        // Gain for volume control with gentle modulation
        const windGain = this.audioContext.createGain();
        windGain.gain.setValueAtTime(0, now);
        windGain.gain.linearRampToValueAtTime(
            this.windVolume * this.masterVolume,
            now + 3
        );

        // LFO to create gusts (very slow modulation)
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.setValueAtTime(0.1, now); // 10 second cycle
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.setValueAtTime(this.windVolume * 0.3, now);

        lfo.connect(lfoGain);
        lfoGain.connect(windGain.gain);

        // Connect audio graph
        noise.connect(lowFilter);
        noise.connect(midFilter);
        noise.connect(highFilter);

        lowFilter.connect(windGain);
        midFilter.connect(windGain);
        highFilter.connect(windGain);

        windGain.connect(this.audioContext.destination);

        // Start
        noise.start(now);
        lfo.start(now);

        // Store nodes
        this.windNodes.oscillators.push(noise, lfo);
        this.windNodes.filters.push(lowFilter, midFilter, highFilter);
        this.windNodes.gains.push(windGain, lfoGain);
    }

    /**
     * Stop the gentle breeze
     */
    stopGentleBreeze() {
        if (!this.audioContext) return;

        console.log('🌬️ Stopping gentle breeze...');

        const now = this.audioContext.currentTime;

        // Fade out wind
        this.windNodes.gains.forEach(gain => {
            try {
                gain.gain.linearRampToValueAtTime(0, now + 2);
            } catch (e) {
                // Node might be stopped
            }
        });

        // Stop oscillators after fade
        setTimeout(() => {
            this.windNodes.oscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });

            // Clear arrays
            this.windNodes.oscillators = [];
            this.windNodes.filters = [];
            this.windNodes.gains = [];
        }, 2100);
    }

    // ==================== ENHANCED BIRD SOUNDS ====================

    /**
     * Play realistic bird chirp with frequency sweep
     */
    playBirdChirp(type = 'robin') {
        if (!this.enabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;

        let startFreq, endFreq, duration, pattern;

        // Different bird types with realistic frequency patterns
        switch(type) {
            case 'robin': // American Robin - cheerful warble
                startFreq = 2000;
                endFreq = 3200;
                duration = 0.15;
                pattern = 'up';
                break;

            case 'sparrow': // House Sparrow - short chirp
                startFreq = 3500;
                endFreq = 2800;
                duration = 0.08;
                pattern = 'down';
                break;

            case 'dove': // Mourning Dove - soft coo
                startFreq = 400;
                endFreq = 350;
                duration = 0.25;
                pattern = 'down-gentle';
                break;

            case 'cardinal': // Northern Cardinal - bright whistle
                startFreq = 3000;
                endFreq = 4500;
                duration = 0.2;
                pattern = 'up';
                break;

            case 'chickadee': // Black-capped Chickadee - "chick-a-dee"
                startFreq = 3800;
                endFreq = 3200;
                duration = 0.12;
                pattern = 'warble';
                break;

            default:
                startFreq = 2500;
                endFreq = 3000;
                duration = 0.15;
                pattern = 'up';
        }

        const osc = this.audioContext.createOscillator();
        osc.type = 'sine'; // Pure tone for bird-like quality

        // Set frequency sweep pattern
        osc.frequency.setValueAtTime(startFreq, now);

        if (pattern === 'warble') {
            // Chickadee warble pattern
            osc.frequency.linearRampToValueAtTime(startFreq * 1.1, now + duration * 0.25);
            osc.frequency.linearRampToValueAtTime(startFreq * 0.9, now + duration * 0.5);
            osc.frequency.linearRampToValueAtTime(endFreq, now + duration);
        } else if (pattern === 'down-gentle') {
            // Gentle downward sweep (dove coo)
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
        } else if (pattern === 'up') {
            // Upward sweep
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.6);
            osc.frequency.exponentialRampToValueAtTime(endFreq * 0.95, now + duration);
        } else {
            // Downward sweep
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
        }

        // Natural bird envelope (quick attack, quick decay)
        const gain = this.audioContext.createGain();
        const volume = this.birdVolume * this.masterVolume * (0.8 + Math.random() * 0.4);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(volume * 0.5, now + duration * 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Add slight vibrato for realism
        const vibrato = this.audioContext.createOscillator();
        vibrato.frequency.setValueAtTime(5 + Math.random() * 3, now); // 5-8 Hz
        const vibratoGain = this.audioContext.createGain();
        vibratoGain.gain.setValueAtTime(startFreq * 0.015, now); // 1.5% vibrato

        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);

        // Bandpass filter for natural bird tone
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime((startFreq + endFreq) / 2, now);
        filter.Q.setValueAtTime(2, now);

        // Stereo positioning (random)
        const panner = this.audioContext.createStereoPanner ?
            this.audioContext.createStereoPanner() : null;

        if (panner) {
            panner.pan.setValueAtTime((Math.random() * 2 - 1) * 0.7, now);
        }

        // Connect graph
        osc.connect(filter);
        filter.connect(gain);

        if (panner) {
            gain.connect(panner);
            panner.connect(this.audioContext.destination);
        } else {
            gain.connect(this.audioContext.destination);
        }

        // Start
        osc.start(now);
        vibrato.start(now);

        // Stop
        osc.stop(now + duration + 0.1);
        vibrato.stop(now + duration + 0.1);
    }

    /**
     * Play a bird song sequence (multiple chirps)
     */
    playBirdSong(birdType = 'robin') {
        if (!this.enabled) return;

        const patterns = {
            robin: [0, 150, 300, 500], // Cheerful sequence
            sparrow: [0, 80, 160], // Quick chirps
            cardinal: [0, 200, 400, 800, 1000], // Complex song
            chickadee: [0, 120, 240, 360, 480], // "Chick-a-dee-dee-dee"
            dove: [0, 400, 800] // Slow cooing
        };

        const pattern = patterns[birdType] || patterns.robin;

        pattern.forEach(delay => {
            setTimeout(() => {
                this.playBirdChirp(birdType);
            }, delay);
        });
    }

    /**
     * Start ambient bird sounds (random chirps)
     */
    startAmbientBirds() {
        if (this.isPlaying || !this.enabled) return;

        console.log('🐦 Starting ambient bird sounds...');
        this.isPlaying = true;

        const birdTypes = ['robin', 'sparrow', 'cardinal', 'chickadee', 'dove'];

        const scheduleNextBird = () => {
            if (!this.isPlaying) return;

            // Random interval between 5-15 seconds
            const nextTime = 5000 + Math.random() * 10000;

            setTimeout(() => {
                if (!this.isPlaying) return;

                // Random bird type
                const bird = birdTypes[Math.floor(Math.random() * birdTypes.length)];

                // 70% single chirp, 30% song sequence
                if (Math.random() < 0.7) {
                    this.playBirdChirp(bird);
                } else {
                    this.playBirdSong(bird);
                }

                scheduleNextBird();
            }, nextTime);
        };

        // Start with initial chirp
        this.playBirdChirp('robin');
        scheduleNextBird();
    }

    /**
     * Stop ambient birds
     */
    stopAmbientBirds() {
        if (!this.isPlaying) return;

        console.log('🐦 Stopping ambient bird sounds...');
        this.isPlaying = false;

        this.birdIntervals.forEach(interval => clearInterval(interval));
        this.birdIntervals = [];
    }

    // ==================== COMBINED AMBIENT NATURE ====================

    /**
     * Start complete nature ambience (wind + birds)
     */
    startNatureAmbience() {
        if (!this.enabled) return;

        console.log('🌿 Starting full nature ambience...');
        this.startGentleBreeze();

        // Wait 2 seconds before starting birds (natural fade-in)
        setTimeout(() => {
            this.startAmbientBirds();
        }, 2000);
    }

    /**
     * Stop all nature sounds
     */
    stopNatureAmbience() {
        console.log('🌿 Stopping nature ambience...');
        this.stopGentleBreeze();
        this.stopAmbientBirds();
    }

    // ==================== CONTROLS ====================

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    setWindVolume(volume) {
        this.windVolume = Math.max(0, Math.min(1, volume));
    }

    setBirdVolume(volume) {
        this.birdVolume = Math.max(0, Math.min(1, volume));
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.stopNatureAmbience();
        }
    }
}

// Initialize global nature sounds instance
if (typeof window !== 'undefined') {
    window.natureSounds = new AmbientNatureSounds();
}
