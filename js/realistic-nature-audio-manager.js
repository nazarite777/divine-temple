/**
 * 🌍 REALISTIC NATURE AUDIO MANAGER
 *
 * Professional-grade audio system for immersive nature soundscapes
 * Uses real high-quality recordings instead of synthesized sounds
 *
 * Features:
 * - HTML5 Audio with seamless looping
 * - Crossfade transitions (fade in/out)
 * - Audio preloading for instant playback
 * - Memory management
 * - Individual volume control per sound
 * - Master volume control
 * - Mobile-optimized (respects autoplay policies)
 * - Backward compatible with existing UI
 */

class RealisticNatureAudioManager {
    constructor() {
        this.sounds = {};
        this.activeAudio = {};
        this.volumes = {};
        this.masterVolume = 0.7;
        this.fadeTime = 2000; // 2 seconds fade in/out
        this.preloadEnabled = true;
        this.initialized = false;

        // Audio file paths mapping
        // You can host these on your server or use a CDN
        this.audioFiles = {
            // Nature Ambience
            rain: 'audio/sounds/rain-gentle-loop.mp3',
            thunder: 'audio/sounds/thunder-distant.mp3',
            wind: 'audio/sounds/wind-breeze-loop.mp3',

            // Nighttime Sounds
            crickets: 'audio/sounds/crickets-night-loop.mp3',
            owl: 'audio/sounds/owl-forest.mp3',
            frogs: 'audio/sounds/frogs-pond-loop.mp3',
            cicadas: 'audio/sounds/cicadas-summer-loop.mp3',

            // Daytime Sounds
            birds: 'audio/sounds/birds-forest-morning.mp3',

            // Animal Sounds
            wolf: 'audio/sounds/wolf-howl-distant.mp3',

            // Water Sounds
            ocean: 'audio/sounds/ocean-waves-loop.mp3',
            stream: 'audio/sounds/stream-flowing-loop.mp3',

            // Fire & Earth
            fire: 'audio/sounds/fire-crackling-loop.mp3',
            leaves: 'audio/sounds/leaves-rustling-loop.mp3',

            // Sacred Sounds (keeping synthesized for these)
            chimes: null, // Use existing synthesis
            bowl: null,   // Use existing synthesis
            brown: null   // Use existing synthesis
        };

        // Sound characteristics
        this.soundConfig = {
            rain: { loop: true, defaultVolume: 0.5, fadeIn: true },
            thunder: { loop: false, defaultVolume: 0.6, fadeIn: false, interval: 15000 }, // Every 15s
            wind: { loop: true, defaultVolume: 0.4, fadeIn: true },
            crickets: { loop: true, defaultVolume: 0.6, fadeIn: true },
            owl: { loop: false, defaultVolume: 0.5, fadeIn: false, interval: 20000 }, // Every 20s
            frogs: { loop: true, defaultVolume: 0.5, fadeIn: true },
            cicadas: { loop: true, defaultVolume: 0.5, fadeIn: true },
            birds: { loop: true, defaultVolume: 0.5, fadeIn: true },
            wolf: { loop: false, defaultVolume: 0.6, fadeIn: false, interval: 45000 }, // Every 45s
            ocean: { loop: true, defaultVolume: 0.5, fadeIn: true },
            stream: { loop: true, defaultVolume: 0.5, fadeIn: true },
            fire: { loop: true, defaultVolume: 0.5, fadeIn: true },
            leaves: { loop: true, defaultVolume: 0.4, fadeIn: true },
            chimes: { loop: false, synthesized: true },
            bowl: { loop: false, synthesized: true },
            brown: { loop: true, synthesized: true }
        };

        // Interval trackers for non-looping sounds
        this.intervals = {};

        console.log('🌍 Realistic Nature Audio Manager initialized');
    }

    /**
     * Initialize the audio system
     * Call this on first user interaction to comply with autoplay policies
     */
    async init() {
        if (this.initialized) return;

        console.log('🎵 Initializing audio system...');

        // Preload priority sounds (ambient loops)
        if (this.preloadEnabled) {
            const prioritySounds = ['rain', 'wind', 'crickets', 'birds', 'fire', 'ocean'];
            await this.preloadSounds(prioritySounds);
        }

        this.initialized = true;
        console.log('✅ Audio system ready');
    }

    /**
     * Preload audio files for instant playback
     */
    async preloadSounds(soundNames) {
        console.log('📥 Preloading sounds:', soundNames.join(', '));

        const promises = soundNames.map(soundName => {
            return new Promise((resolve) => {
                const filePath = this.audioFiles[soundName];
                if (!filePath) {
                    resolve(); // Skip synthesized sounds
                    return;
                }

                const audio = new Audio();
                audio.preload = 'auto';
                audio.src = filePath;

                audio.addEventListener('canplaythrough', () => {
                    this.sounds[soundName] = audio;
                    console.log(`✓ ${soundName} loaded`);
                    resolve();
                }, { once: true });

                audio.addEventListener('error', (e) => {
                    console.warn(`⚠️ Failed to load ${soundName}:`, e);
                    resolve(); // Continue even if one fails
                });

                audio.load();
            });
        });

        await Promise.all(promises);
        console.log('✅ Preloading complete');
    }

    /**
     * Load a single audio file
     */
    loadSound(soundName) {
        return new Promise((resolve, reject) => {
            const filePath = this.audioFiles[soundName];

            if (!filePath) {
                reject(new Error(`No audio file configured for ${soundName}`));
                return;
            }

            // Return cached if already loaded
            if (this.sounds[soundName]) {
                resolve(this.sounds[soundName]);
                return;
            }

            const audio = new Audio(filePath);
            audio.preload = 'auto';

            audio.addEventListener('canplaythrough', () => {
                this.sounds[soundName] = audio;
                resolve(audio);
            }, { once: true });

            audio.addEventListener('error', (e) => {
                reject(new Error(`Failed to load ${soundName}: ${e.message}`));
            });

            audio.load();
        });
    }

    /**
     * Play a sound with smooth fade-in
     */
    async playSound(soundName, options = {}) {
        try {
            // Check if it's a synthesized sound (delegate to old system)
            const config = this.soundConfig[soundName];
            if (config && config.synthesized) {
                console.log(`🎹 ${soundName} uses synthesis (skipping real audio)`);
                return null;
            }

            // Stop if already playing
            if (this.activeAudio[soundName]) {
                console.log(`⏸️ ${soundName} already playing`);
                return this.activeAudio[soundName];
            }

            console.log(`▶️ Starting ${soundName}...`);

            // Load audio if not cached
            if (!this.sounds[soundName]) {
                await this.loadSound(soundName);
            }

            // Create new instance for playback (allows multiple instances)
            const audio = this.sounds[soundName].cloneNode();

            // Set properties
            audio.loop = config?.loop || false;
            audio.volume = 0; // Start at 0 for fade-in

            // Store reference
            this.activeAudio[soundName] = audio;
            this.volumes[soundName] = config?.defaultVolume || 0.5;

            // Handle playback promise (mobile compatibility)
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error(`Play failed for ${soundName}:`, error);
                    delete this.activeAudio[soundName];
                });
            }

            // Fade in
            if (config?.fadeIn) {
                this.fadeIn(audio, this.volumes[soundName] * this.masterVolume);
            } else {
                audio.volume = this.volumes[soundName] * this.masterVolume;
            }

            // Handle non-looping sounds with intervals
            if (!config?.loop && config?.interval) {
                this.scheduleInterval(soundName, config.interval);
            }

            // Auto-cleanup on end
            audio.addEventListener('ended', () => {
                if (!audio.loop) {
                    delete this.activeAudio[soundName];
                }
            });

            return audio;

        } catch (error) {
            console.error(`Failed to play ${soundName}:`, error);
            return null;
        }
    }

    /**
     * Schedule periodic playback for non-looping sounds (thunder, owl, wolf)
     */
    scheduleInterval(soundName, interval) {
        // Clear existing interval
        if (this.intervals[soundName]) {
            clearInterval(this.intervals[soundName]);
        }

        // Set new interval with randomization
        this.intervals[soundName] = setInterval(() => {
            // Add ±30% randomization
            const randomDelay = Math.random() * interval * 0.6 - interval * 0.3;

            setTimeout(() => {
                if (this.activeAudio[soundName]) {
                    this.playSound(soundName);
                }
            }, randomDelay);
        }, interval);
    }

    /**
     * Stop a sound with smooth fade-out
     */
    async stopSound(soundName) {
        const audio = this.activeAudio[soundName];

        if (!audio) {
            console.log(`⏹️ ${soundName} not playing`);
            return;
        }

        console.log(`⏹️ Stopping ${soundName}...`);

        // Clear interval if exists
        if (this.intervals[soundName]) {
            clearInterval(this.intervals[soundName]);
            delete this.intervals[soundName];
        }

        // Fade out
        await this.fadeOut(audio);

        // Stop and cleanup
        audio.pause();
        audio.currentTime = 0;
        delete this.activeAudio[soundName];
    }

    /**
     * Smooth fade-in effect
     */
    fadeIn(audio, targetVolume) {
        const steps = 50;
        const stepTime = this.fadeTime / steps;
        const volumeIncrement = targetVolume / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
            }
        }, stepTime);
    }

    /**
     * Smooth fade-out effect
     */
    fadeOut(audio) {
        return new Promise((resolve) => {
            const steps = 50;
            const stepTime = this.fadeTime / steps;
            const volumeDecrement = audio.volume / steps;
            let currentStep = 0;

            const fadeInterval = setInterval(() => {
                currentStep++;
                audio.volume = Math.max(audio.volume - volumeDecrement, 0);

                if (currentStep >= steps || audio.volume === 0) {
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, stepTime);
        });
    }

    /**
     * Set volume for a specific sound
     */
    setVolume(soundName, volume) {
        // Clamp between 0 and 1
        volume = Math.max(0, Math.min(1, volume));
        this.volumes[soundName] = volume;

        const audio = this.activeAudio[soundName];
        if (audio) {
            audio.volume = volume * this.masterVolume;
        }

        console.log(`🔊 ${soundName} volume: ${Math.round(volume * 100)}%`);
    }

    /**
     * Set master volume (affects all sounds)
     */
    setMasterVolume(volume) {
        volume = Math.max(0, Math.min(1, volume));
        this.masterVolume = volume;

        // Update all active sounds
        Object.keys(this.activeAudio).forEach(soundName => {
            const audio = this.activeAudio[soundName];
            if (audio) {
                audio.volume = this.volumes[soundName] * this.masterVolume;
            }
        });

        console.log(`🔊 Master volume: ${Math.round(volume * 100)}%`);
    }

    /**
     * Toggle a sound on/off
     */
    async toggleSound(soundName, enabled) {
        if (enabled) {
            await this.playSound(soundName);
        } else {
            await this.stopSound(soundName);
        }
    }

    /**
     * Check if a sound is currently playing
     */
    isPlaying(soundName) {
        return !!this.activeAudio[soundName];
    }

    /**
     * Stop all sounds
     */
    async stopAll() {
        console.log('⏹️ Stopping all sounds...');

        const stopPromises = Object.keys(this.activeAudio).map(soundName =>
            this.stopSound(soundName)
        );

        await Promise.all(stopPromises);
    }

    /**
     * Get list of currently playing sounds
     */
    getActiveSounds() {
        return Object.keys(this.activeAudio);
    }

    /**
     * Memory cleanup
     */
    cleanup() {
        this.stopAll();

        // Clear all cached audio
        Object.values(this.sounds).forEach(audio => {
            audio.src = '';
        });

        this.sounds = {};
        this.activeAudio = {};
        this.initialized = false;

        console.log('🧹 Audio manager cleaned up');
    }

    /**
     * Debug information
     */
    debug() {
        console.log('🔧 Audio Manager Debug:');
        console.log('- Initialized:', this.initialized);
        console.log('- Master Volume:', Math.round(this.masterVolume * 100) + '%');
        console.log('- Loaded sounds:', Object.keys(this.sounds));
        console.log('- Active sounds:', Object.keys(this.activeAudio));
        console.log('- Individual volumes:', this.volumes);
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.realisticAudio = new RealisticNatureAudioManager();

    // Auto-initialize on first user interaction
    const initOnInteraction = () => {
        window.realisticAudio.init();
        document.removeEventListener('click', initOnInteraction);
        document.removeEventListener('touchstart', initOnInteraction);
    };

    document.addEventListener('click', initOnInteraction, { once: true });
    document.addEventListener('touchstart', initOnInteraction, { once: true });
}
