/**
 * 🎐 REALISTIC WIND CHIMES AUDIO SYSTEM
 *
 * Creates natural, gentle wind chime sounds that mimic actual metal chimes
 * swaying in the breeze. Uses Web Audio API for realistic synthesis.
 *
 * Features:
 * - Multiple metallic tube tones (like real bamboo/metal chimes)
 * - Random timing to simulate wind gusts
 * - Natural decay and resonance
 * - Stereo panning for spatial effect
 * - Gentle, non-intrusive ambient sound
 */

class RealisticWindChimes {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.chimeIntervals = [];
        this.activeNodes = [];

        // Pentatonic scale frequencies for pleasant, harmonious chimes
        // Based on C major pentatonic: C, D, E, G, A (pleasant, non-dissonant)
        this.chimeFrequencies = [
            523.25,  // C5
            587.33,  // D5
            659.25,  // E5
            783.99,  // G5
            880.00,  // A5
            1046.50, // C6
            1174.66, // D6
            1318.51  // E6
        ];

        this.masterVolume = 0.12; // Very gentle volume
        this.enabled = true;

        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎐 Realistic Wind Chimes initialized');
        } catch (error) {
            console.error('Failed to initialize wind chimes:', error);
        }
    }

    /**
     * Play a single chime strike with realistic metallic tone
     */
    playChime(frequency = null, panValue = null) {
        if (!this.enabled || !this.audioContext) return;

        // Random frequency if not specified (simulates different chimes)
        if (frequency === null) {
            frequency = this.chimeFrequencies[
                Math.floor(Math.random() * this.chimeFrequencies.length)
            ];
        }

        // Random stereo position if not specified
        if (panValue === null) {
            panValue = (Math.random() * 2 - 1) * 0.6; // Range: -0.6 to 0.6
        }

        const now = this.audioContext.currentTime;

        // Create oscillator for the fundamental tone
        const osc = this.audioContext.createOscillator();

        // Use triangle wave for softer, more metallic sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, now);

        // Add slight frequency wobble to simulate metal vibration
        const wobbleAmount = frequency * 0.002; // 0.2% wobble
        osc.frequency.linearRampToValueAtTime(frequency + wobbleAmount, now + 0.1);
        osc.frequency.linearRampToValueAtTime(frequency - wobbleAmount, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(frequency, now + 0.5);

        // Create second oscillator for metallic overtone
        const osc2 = this.audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(frequency * 3.14, now); // Metallic overtone

        // Create gain nodes for envelope
        const gainNode = this.audioContext.createGain();
        const overtoneGain = this.audioContext.createGain();

        // Natural decay envelope (fast attack, slow decay like real chimes)
        const attackTime = 0.005;
        const decayTime = 3.5 + Math.random() * 1.5; // Variable decay 3.5-5 seconds
        const peakVolume = this.masterVolume * (0.8 + Math.random() * 0.4); // Vary volume

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(peakVolume, now + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

        // Overtone has faster decay
        overtoneGain.gain.setValueAtTime(0, now);
        overtoneGain.gain.linearRampToValueAtTime(peakVolume * 0.4, now + attackTime);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + decayTime * 0.7);

        // Add reverb simulation using delay
        const delay = this.audioContext.createDelay();
        delay.delayTime.setValueAtTime(0.03, now);

        const delayGain = this.audioContext.createGain();
        delayGain.gain.setValueAtTime(0.2, now);

        // Stereo panner for spatial effect
        const panner = this.audioContext.createStereoPanner ?
            this.audioContext.createStereoPanner() : null;

        if (panner) {
            panner.pan.setValueAtTime(panValue, now);
        }

        // Low-pass filter for warmth (simulates air absorption)
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 4, now);
        filter.Q.setValueAtTime(0.5, now);

        // Connect the audio graph
        osc.connect(filter);
        osc2.connect(filter);

        filter.connect(gainNode);
        filter.connect(overtoneGain);

        if (panner) {
            gainNode.connect(panner);
            overtoneGain.connect(panner);

            // Dry signal
            panner.connect(this.audioContext.destination);

            // Wet signal (reverb)
            panner.connect(delay);
        } else {
            gainNode.connect(this.audioContext.destination);
            overtoneGain.connect(this.audioContext.destination);
            gainNode.connect(delay);
        }

        delay.connect(delayGain);
        delayGain.connect(delay); // Feedback for reverb tail
        delayGain.connect(this.audioContext.destination);

        // Start oscillators
        osc.start(now);
        osc2.start(now);

        // Stop after decay
        const stopTime = now + decayTime + 0.1;
        osc.stop(stopTime);
        osc2.stop(stopTime);

        // Store nodes for cleanup
        this.activeNodes.push({ osc, osc2, gainNode, overtoneGain, delay, delayGain, filter, panner });

        // Clean up old nodes
        setTimeout(() => {
            const index = this.activeNodes.findIndex(n => n.osc === osc);
            if (index > -1) {
                this.activeNodes.splice(index, 1);
            }
        }, (decayTime + 1) * 1000);
    }

    /**
     * Play a gentle breeze pattern with multiple chimes
     */
    playBreeze(intensity = 'gentle') {
        const chimeCount = intensity === 'gentle' ? 2 : intensity === 'medium' ? 3 : 5;
        const baseDelay = intensity === 'gentle' ? 300 : intensity === 'medium' ? 200 : 100;

        for (let i = 0; i < chimeCount; i++) {
            setTimeout(() => {
                this.playChime();
            }, i * baseDelay + Math.random() * baseDelay);
        }
    }

    /**
     * Start ambient wind chime background (gentle, random chimes)
     */
    startAmbient() {
        if (this.isPlaying || !this.enabled) return;

        console.log('🎐 Starting ambient wind chimes...');
        this.isPlaying = true;

        // Play initial chime
        this.playChime();

        // Set up random intervals for natural wind effect
        const scheduleNextChime = () => {
            if (!this.isPlaying) return;

            // Random interval between 3-8 seconds (gentle breeze)
            const nextTime = 3000 + Math.random() * 5000;

            setTimeout(() => {
                if (!this.isPlaying) return;

                // Occasionally play 2-3 chimes close together (wind gust)
                if (Math.random() < 0.3) {
                    this.playBreeze('gentle');
                } else {
                    this.playChime();
                }

                scheduleNextChime();
            }, nextTime);
        };

        scheduleNextChime();
    }

    /**
     * Stop ambient wind chimes
     */
    stopAmbient() {
        if (!this.isPlaying) return;

        console.log('🎐 Stopping ambient wind chimes...');
        this.isPlaying = false;

        // Stop all intervals
        this.chimeIntervals.forEach(interval => clearInterval(interval));
        this.chimeIntervals = [];

        // Fade out active nodes
        const now = this.audioContext.currentTime;
        this.activeNodes.forEach(nodes => {
            try {
                if (nodes.gainNode) {
                    nodes.gainNode.gain.linearRampToValueAtTime(0, now + 1);
                }
                if (nodes.overtoneGain) {
                    nodes.overtoneGain.gain.linearRampToValueAtTime(0, now + 1);
                }
            } catch (e) {
                // Node might already be stopped
            }
        });
    }

    /**
     * Set master volume (0.0 - 1.0)
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Enable/disable chimes
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled && this.isPlaying) {
            this.stopAmbient();
        }
    }
}

// Initialize global wind chimes instance
if (typeof window !== 'undefined') {
    window.windChimes = new RealisticWindChimes();
}
