/**
 * 🎛️ SOUNDBOARD INTEGRATION
 *
 * Seamlessly integrates realistic recorded audio with the existing soundboard system
 * Provides hybrid approach: real audio when available, synthesized as fallback
 */

// Wait for both systems to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎛️ Initializing Soundboard Integration...');

    // Define which sounds use real audio vs synthesis
    const USE_REAL_AUDIO = {
        // Nature Ambience
        rain: true,
        thunder: true,
        wind: true,

        // Nighttime
        crickets: true,
        owl: true,
        frogs: true,
        cicadas: true,

        // Daytime
        birds: true,

        // Animals
        wolf: true,

        // Water
        ocean: true,
        stream: true,

        // Fire & Earth
        fire: true,
        leaves: true,

        // Keep synthesized (special sounds)
        chimes: false,
        bowl: false,
        brown: false
    };

    // Store original functions for fallback
    const originalToggleSound = window.toggleSound;
    const originalSetVolume = window.setVolume;
    const originalStartSound = window.startSound;
    const originalStopSound = window.stopSound;

    /**
     * Enhanced toggleSound with real audio support
     */
    window.toggleSound = async function(soundName, enabled) {
        console.log(`🎵 Toggle ${soundName}: ${enabled}`);

        // Check if we should use real audio
        if (USE_REAL_AUDIO[soundName] && window.realisticAudio) {
            try {
                if (enabled) {
                    // Check if audio file exists
                    const hasRealAudio = window.realisticAudio.audioFiles[soundName];

                    if (hasRealAudio) {
                        console.log(`🌍 Using real audio for ${soundName}`);
                        await window.realisticAudio.playSound(soundName);

                        // Set volume from slider
                        const volumeSlider = document.getElementById(`volume-${soundName}`);
                        if (volumeSlider) {
                            const volume = parseInt(volumeSlider.value) / 100;
                            window.realisticAudio.setVolume(soundName, volume);
                        }
                    } else {
                        console.log(`⚠️ Real audio not found for ${soundName}, using synthesis`);
                        // Fall back to synthesized sound
                        if (originalStartSound) {
                            originalStartSound(soundName);
                        }
                    }
                } else {
                    await window.realisticAudio.stopSound(soundName);
                }

                // Save preferences
                saveSoundPreferences();
                return;

            } catch (error) {
                console.warn(`⚠️ Real audio failed for ${soundName}, falling back to synthesis:`, error);
                // Fall back to original synthesized version
                if (originalToggleSound) {
                    originalToggleSound(soundName, enabled);
                }
            }
        } else {
            // Use original synthesized sound
            console.log(`🎹 Using synthesis for ${soundName}`);
            if (originalToggleSound) {
                originalToggleSound(soundName, enabled);
            }
        }
    };

    /**
     * Enhanced setVolume with real audio support
     */
    window.setVolume = function(soundName, value) {
        // Update UI
        const valueDisplay = document.getElementById(`value-${soundName}`);
        if (valueDisplay) {
            valueDisplay.textContent = value + '%';
        }

        const volume = parseInt(value) / 100;

        // Update real audio volume if active
        if (USE_REAL_AUDIO[soundName] && window.realisticAudio) {
            if (window.realisticAudio.isPlaying(soundName)) {
                window.realisticAudio.setVolume(soundName, volume);
            }
        }

        // Also update synthesized version (for fallback)
        if (originalSetVolume) {
            originalSetVolume(soundName, value);
        }

        // Save preferences
        saveSoundPreferences();
    };

    /**
     * Enhanced master volume control
     */
    const originalSetMasterVolume = window.setMasterVolume;
    window.setMasterVolume = function(value) {
        console.log(`🔊 Master volume: ${value}%`);

        const volume = parseInt(value) / 100;

        // Update real audio manager
        if (window.realisticAudio) {
            window.realisticAudio.setMasterVolume(volume);
        }

        // Update synthesized audio
        if (originalSetMasterVolume) {
            originalSetMasterVolume(value);
        }

        // Update UI
        const valueDisplay = document.getElementById('masterVolumeValue');
        if (valueDisplay) {
            valueDisplay.textContent = value + '%';
        }

        // Save to localStorage
        localStorage.setItem('masterVolume', value);
    };

    /**
     * Enhanced openSoundDashboard to initialize real audio
     */
    const originalOpenSoundDashboard = window.openSoundDashboard;
    window.openSoundDashboard = function() {
        // Initialize realistic audio on first open
        if (window.realisticAudio && !window.realisticAudio.initialized) {
            window.realisticAudio.init().then(() => {
                console.log('✅ Real audio system initialized');
            }).catch(error => {
                console.warn('⚠️ Real audio init failed:', error);
            });
        }

        // Call original function
        if (originalOpenSoundDashboard) {
            originalOpenSoundDashboard();
        }
    };

    /**
     * Enhanced preset application
     */
    const originalApplyPreset = window.applyPreset;
    window.applyPreset = function(presetName) {
        console.log(`🎨 Applying preset: ${presetName}`);

        // Stop all sounds first
        if (window.realisticAudio) {
            window.realisticAudio.stopAll();
        }

        // Disable all toggles
        const allSounds = ['rain', 'thunder', 'crickets', 'birds', 'fire', 'chimes', 'ocean', 'bowl', 'brown', 'wind', 'stream', 'owl', 'frogs', 'cicadas', 'leaves', 'wolf'];
        allSounds.forEach(sound => {
            const toggle = document.getElementById(`toggle-${sound}`);
            if (toggle) {
                toggle.checked = false;
            }
        });

        // Preset configurations
        const presets = {
            silent: {},
            forest: {
                sounds: ['birds', 'wind', 'leaves'],
                volumes: { birds: 60, wind: 40, leaves: 50 }
            },
            rain: {
                sounds: ['rain', 'thunder', 'wind'],
                volumes: { rain: 70, thunder: 40, wind: 30 }
            },
            night: {
                sounds: ['crickets', 'owl', 'wind'],
                volumes: { crickets: 60, owl: 50, wind: 30 }
            },
            stream: {
                sounds: ['stream', 'birds', 'wind'],
                volumes: { stream: 70, birds: 40, wind: 30 }
            },
            temple: {
                sounds: ['bowl', 'chimes', 'wind'],
                volumes: { bowl: 60, chimes: 50, wind: 20 }
            },
            ocean: {
                sounds: ['ocean', 'wind'],
                volumes: { ocean: 70, wind: 40 }
            },
            summer: {
                sounds: ['birds', 'cicadas', 'wind'],
                volumes: { birds: 50, cicadas: 60, wind: 30 }
            }
        };

        const preset = presets[presetName];
        if (preset && preset.sounds) {
            // Apply preset sounds
            preset.sounds.forEach(sound => {
                const toggle = document.getElementById(`toggle-${sound}`);
                const volumeSlider = document.getElementById(`volume-${sound}`);

                if (toggle && volumeSlider) {
                    // Set volume
                    const volume = preset.volumes[sound] || 50;
                    volumeSlider.value = volume;
                    setVolume(sound, volume);

                    // Enable sound
                    toggle.checked = true;
                    toggleSound(sound, true);
                }
            });
        }

        saveSoundPreferences();
    };

    /**
     * Debug helpers
     */
    window.debugSoundSystem = function() {
        console.log('🔧 Sound System Debug:');
        console.log('='.repeat(50));

        console.log('\n📊 Real Audio Status:');
        if (window.realisticAudio) {
            console.log('  Initialized:', window.realisticAudio.initialized);
            console.log('  Master Volume:', Math.round(window.realisticAudio.masterVolume * 100) + '%');
            console.log('  Active Sounds:', window.realisticAudio.getActiveSounds());
            console.log('  Loaded Files:', Object.keys(window.realisticAudio.sounds));
        } else {
            console.log('  ❌ Not available');
        }

        console.log('\n🎹 Synthesis Status:');
        if (window.audioContext) {
            console.log('  AudioContext State:', window.audioContext.state);
            console.log('  Active Sounds:', window.activeSounds ? Object.keys(window.activeSounds) : 'N/A');
        } else {
            console.log('  ❌ Not initialized');
        }

        console.log('\n🎛️ Configuration:');
        console.log('  Real Audio Enabled:', Object.keys(USE_REAL_AUDIO).filter(k => USE_REAL_AUDIO[k]));
        console.log('  Synthesized:', Object.keys(USE_REAL_AUDIO).filter(k => !USE_REAL_AUDIO[k]));

        console.log('\n🧪 Test Commands:');
        console.log('  testRealAudio("soundName") - Test a specific real audio sound');
        console.log('  window.realisticAudio.debug() - Detailed real audio debug');
        console.log('='.repeat(50));
    };

    /**
     * Test function for real audio
     */
    window.testRealAudio = async function(soundName) {
        if (!window.realisticAudio) {
            console.error('❌ Real audio manager not available');
            return;
        }

        console.log(`🧪 Testing real audio: ${soundName}`);

        try {
            await window.realisticAudio.playSound(soundName);
            console.log(`✅ ${soundName} playing`);

            // Stop after 5 seconds
            setTimeout(() => {
                window.realisticAudio.stopSound(soundName);
                console.log(`⏹️ ${soundName} stopped`);
            }, 5000);
        } catch (error) {
            console.error(`❌ Test failed:`, error);
        }
    };

    /**
     * Auto-check for missing audio files
     */
    window.checkMissingAudio = function() {
        console.log('🔍 Checking for missing audio files...');

        if (!window.realisticAudio) {
            console.error('❌ Real audio manager not available');
            return;
        }

        const sounds = Object.keys(USE_REAL_AUDIO).filter(k => USE_REAL_AUDIO[k]);
        const missing = [];
        const available = [];

        sounds.forEach(sound => {
            const filePath = window.realisticAudio.audioFiles[sound];
            if (filePath) {
                // Try to fetch to check if exists
                fetch(filePath, { method: 'HEAD' })
                    .then(response => {
                        if (response.ok) {
                            available.push(sound);
                            console.log(`✅ ${sound}: ${filePath}`);
                        } else {
                            missing.push(sound);
                            console.warn(`❌ ${sound}: Not found at ${filePath}`);
                        }
                    })
                    .catch(() => {
                        missing.push(sound);
                        console.warn(`❌ ${sound}: Failed to fetch ${filePath}`);
                    });
            } else {
                missing.push(sound);
                console.warn(`⚠️ ${sound}: No file path configured`);
            }
        });

        setTimeout(() => {
            console.log('\n📊 Summary:');
            console.log(`✅ Available: ${available.length}/${sounds.length}`);
            console.log(`❌ Missing: ${missing.length}/${sounds.length}`);
            if (missing.length > 0) {
                console.log('\n📥 Missing files:', missing);
                console.log('📖 See NATURE_SOUNDS_SOURCING_GUIDE.md for download instructions');
            }
        }, 1000);
    };

    console.log('✅ Soundboard Integration complete');
    console.log('🔧 Use debugSoundSystem() for debug info');
    console.log('🔍 Use checkMissingAudio() to verify audio files');
});
