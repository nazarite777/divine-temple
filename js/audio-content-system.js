/**
 * 🎧 Divine Temple Audio Content System
 *
 * Features:
 * - Podcasts (spiritual teachings, interviews)
 * - Audiobooks (sacred texts, spiritual wisdom)
 * - Guided Meditations (various durations)
 * - Sleep Stories (bedtime spiritual tales)
 * - Chants & Mantras (sacred sounds)
 * - Binaural Beats (brain entrainment)
 * - Audio player with playlist support
 * - Download for offline listening
 * - Sleep timer
 * - Playback speed control
 * - XP rewards for listening
 */

class AudioContentSystem {
    constructor() {
        this.audioPlayer = null;
        this.currentTrack = null;
        this.playlist = [];
        this.playlistIndex = 0;
        this.audioLibrary = this.loadAudioLibrary();
        this.favorites = this.loadFavorites();
        this.listeningHistory = this.loadHistory();
        this.downloadedTracks = this.loadDownloaded();
        this.currentCategory = 'all';
        this.isPlaying = false;
        this.sleepTimer = null;
        this.init();
    }

    init() {
        console.log('🎧 Audio Content System initialized');
        this.setupAudioPlayer();
        this.setupEventListeners();
    }

    setupAudioPlayer() {
        // Create audio element if it doesn't exist
        if (!this.audioPlayer) {
            this.audioPlayer = new Audio();
            this.audioPlayer.preload = 'metadata';

            // Event listeners for audio player
            this.audioPlayer.addEventListener('ended', () => this.handleTrackEnded());
            this.audioPlayer.addEventListener('timeupdate', () => this.handleTimeUpdate());
            this.audioPlayer.addEventListener('loadedmetadata', () => this.handleMetadataLoaded());
            this.audioPlayer.addEventListener('error', (e) => this.handleError(e));
            this.audioPlayer.addEventListener('play', () => this.isPlaying = true);
            this.audioPlayer.addEventListener('pause', () => this.isPlaying = false);
        }
    }

    setupEventListeners() {
        // Listen for sleep timer expiration
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.sleepTimer) {
                // Pause if sleep timer is active and tab is hidden
            }
        });
    }

    loadAudioLibrary() {
        return {
            podcasts: [
                {
                    id: 'podcast-1',
                    title: 'Awakening the Divine Within',
                    description: 'Discover your inner divinity through ancient wisdom teachings',
                    duration: 3600, // seconds
                    category: 'podcast',
                    series: 'Divine Wisdom',
                    episode: 1,
                    author: 'Master Sage',
                    imageUrl: '/img/audio/podcast-1.jpg',
                    audioUrl: '/audio/podcasts/awakening-divine.mp3',
                    tags: ['spirituality', 'wisdom', 'awakening'],
                    releasedDate: '2024-01-15'
                },
                {
                    id: 'podcast-2',
                    title: 'The Path of Enlightenment',
                    description: 'Journey through the stages of spiritual enlightenment',
                    duration: 2700,
                    category: 'podcast',
                    series: 'Divine Wisdom',
                    episode: 2,
                    author: 'Master Sage',
                    imageUrl: '/img/audio/podcast-2.jpg',
                    audioUrl: '/audio/podcasts/path-enlightenment.mp3',
                    tags: ['enlightenment', 'spiritual path', 'awakening'],
                    releasedDate: '2024-01-22'
                }
            ],
            audiobooks: [
                {
                    id: 'audiobook-1',
                    title: 'The Bhagavad Gita',
                    description: 'Sacred Hindu scripture narrated with divine wisdom',
                    duration: 18000, // 5 hours
                    category: 'audiobook',
                    author: 'Narrated by Divine Voice',
                    imageUrl: '/img/audio/bhagavad-gita.jpg',
                    audioUrl: '/audio/audiobooks/bhagavad-gita.mp3',
                    tags: ['sacred text', 'hinduism', 'wisdom'],
                    chapters: 18
                },
                {
                    id: 'audiobook-2',
                    title: 'The Power of Now',
                    description: 'A guide to spiritual enlightenment',
                    duration: 12600,
                    category: 'audiobook',
                    author: 'Eckhart Tolle',
                    imageUrl: '/img/audio/power-of-now.jpg',
                    audioUrl: '/audio/audiobooks/power-of-now.mp3',
                    tags: ['mindfulness', 'present moment', 'enlightenment']
                }
            ],
            meditations: [
                {
                    id: 'meditation-1',
                    title: 'Morning Awakening Meditation',
                    description: 'Start your day with divine energy and intention',
                    duration: 600, // 10 minutes
                    category: 'meditation',
                    type: 'guided',
                    difficulty: 'beginner',
                    guide: 'Serene Voice',
                    imageUrl: '/img/audio/morning-meditation.jpg',
                    audioUrl: '/audio/meditations/morning-awakening.mp3',
                    tags: ['morning', 'energy', 'awakening']
                },
                {
                    id: 'meditation-2',
                    title: 'Chakra Balancing Journey',
                    description: 'Align and balance all seven chakras',
                    duration: 1800, // 30 minutes
                    category: 'meditation',
                    type: 'guided',
                    difficulty: 'intermediate',
                    guide: 'Master Healer',
                    imageUrl: '/img/audio/chakra-balancing.jpg',
                    audioUrl: '/audio/meditations/chakra-balancing.mp3',
                    tags: ['chakras', 'energy healing', 'balance']
                },
                {
                    id: 'meditation-3',
                    title: 'Deep Spiritual Connection',
                    description: 'Connect with your higher self and divine guidance',
                    duration: 3600, // 1 hour
                    category: 'meditation',
                    type: 'guided',
                    difficulty: 'advanced',
                    guide: 'Spiritual Master',
                    imageUrl: '/img/audio/deep-connection.jpg',
                    audioUrl: '/audio/meditations/deep-connection.mp3',
                    tags: ['deep meditation', 'spiritual connection', 'higher self']
                }
            ],
            sleepStories: [
                {
                    id: 'sleep-1',
                    title: 'Journey to the Sacred Temple',
                    description: 'A peaceful journey to a mystical temple in the clouds',
                    duration: 2400, // 40 minutes
                    category: 'sleep',
                    narrator: 'Soothing Voice',
                    imageUrl: '/img/audio/sacred-temple.jpg',
                    audioUrl: '/audio/sleep/sacred-temple.mp3',
                    tags: ['sleep', 'temple', 'peaceful']
                },
                {
                    id: 'sleep-2',
                    title: 'The Crystal Cave of Dreams',
                    description: 'Drift into deep sleep in a magical crystal cave',
                    duration: 3000, // 50 minutes
                    category: 'sleep',
                    narrator: 'Dreamy Voice',
                    imageUrl: '/img/audio/crystal-cave.jpg',
                    audioUrl: '/audio/sleep/crystal-cave.mp3',
                    tags: ['sleep', 'crystals', 'dreams']
                }
            ],
            chants: [
                {
                    id: 'chant-1',
                    title: 'Om Mani Padme Hum',
                    description: 'Tibetan Buddhist mantra for compassion',
                    duration: 300, // 5 minutes
                    category: 'chant',
                    tradition: 'Buddhism',
                    imageUrl: '/img/audio/om-mani.jpg',
                    audioUrl: '/audio/chants/om-mani-padme-hum.mp3',
                    tags: ['mantra', 'buddhism', 'compassion'],
                    loopable: true
                },
                {
                    id: 'chant-2',
                    title: 'Gayatri Mantra',
                    description: 'Ancient Vedic mantra for enlightenment',
                    duration: 420, // 7 minutes
                    category: 'chant',
                    tradition: 'Hinduism',
                    imageUrl: '/img/audio/gayatri.jpg',
                    audioUrl: '/audio/chants/gayatri-mantra.mp3',
                    tags: ['mantra', 'hinduism', 'enlightenment'],
                    loopable: true
                }
            ],
            binauralBeats: [
                {
                    id: 'binaural-1',
                    title: 'Deep Theta Meditation',
                    description: '6 Hz theta waves for deep meditation',
                    duration: 1800, // 30 minutes
                    category: 'binaural',
                    frequency: '6 Hz',
                    brainwaveState: 'Theta',
                    imageUrl: '/img/audio/theta-waves.jpg',
                    audioUrl: '/audio/binaural/theta-meditation.mp3',
                    tags: ['binaural beats', 'theta', 'meditation'],
                    loopable: true
                },
                {
                    id: 'binaural-2',
                    title: 'Alpha Relaxation',
                    description: '10 Hz alpha waves for relaxation and creativity',
                    duration: 1200, // 20 minutes
                    category: 'binaural',
                    frequency: '10 Hz',
                    brainwaveState: 'Alpha',
                    imageUrl: '/img/audio/alpha-waves.jpg',
                    audioUrl: '/audio/binaural/alpha-relaxation.mp3',
                    tags: ['binaural beats', 'alpha', 'relaxation'],
                    loopable: true
                }
            ]
        };
    }

    getAllTracks() {
        const allTracks = [];
        for (const category in this.audioLibrary) {
            allTracks.push(...this.audioLibrary[category]);
        }
        return allTracks;
    }

    getTrackById(id) {
        const allTracks = this.getAllTracks();
        return allTracks.find(track => track.id === id);
    }

    getTracksByCategory(category) {
        if (category === 'all') {
            return this.getAllTracks();
        }
        return this.audioLibrary[category] || [];
    }

    async playTrack(trackId) {
        const track = this.getTrackById(trackId);

        if (!track) {
            console.error('Track not found:', trackId);
            return { success: false, message: 'Track not found' };
        }

        try {
            this.currentTrack = track;
            this.audioPlayer.src = track.audioUrl;
            await this.audioPlayer.play();

            // Add to history
            this.addToHistory(track);

            // Update UI
            this.updatePlayerUI();

            // 🎯 AWARD XP for starting to listen
            if (window.progressSystem) {
                window.progressSystem.awardXP(10, `Started listening: ${track.title}`, 'audio');
                window.progressSystem.logActivity('audio_started', 'audio', {
                    trackId: track.id,
                    title: track.title,
                    category: track.category
                });
            }

            return { success: true, track };

        } catch (error) {
            console.error('Error playing track:', error);
            return { success: false, message: 'Failed to play track' };
        }
    }

    pause() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
        }
    }

    resume() {
        if (this.audioPlayer && this.currentTrack) {
            this.audioPlayer.play();
        }
    }

    stop() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
            this.currentTrack = null;
            this.updatePlayerUI();
        }
    }

    seek(time) {
        if (this.audioPlayer) {
            this.audioPlayer.currentTime = time;
        }
    }

    setVolume(volume) {
        if (this.audioPlayer) {
            this.audioPlayer.volume = Math.max(0, Math.min(1, volume));
        }
    }

    setPlaybackSpeed(speed) {
        if (this.audioPlayer) {
            this.audioPlayer.playbackRate = speed;
            localStorage.setItem('audio_playback_speed', speed);
        }
    }

    getPlaybackSpeed() {
        return parseFloat(localStorage.getItem('audio_playback_speed') || '1.0');
    }

    handleTrackEnded() {
        // Award XP for completing track
        if (this.currentTrack && window.progressSystem) {
            const xp = this.calculateCompletionXP(this.currentTrack);
            window.progressSystem.awardXP(xp, `Completed: ${this.currentTrack.title}`, 'audio');
            window.progressSystem.logActivity('audio_completed', 'audio', {
                trackId: this.currentTrack.id,
                duration: this.currentTrack.duration
            });
        }

        // Play next in playlist if exists
        if (this.playlist.length > 0 && this.playlistIndex < this.playlist.length - 1) {
            this.playlistIndex++;
            const nextTrack = this.playlist[this.playlistIndex];
            this.playTrack(nextTrack.id);
        } else if (this.currentTrack && this.currentTrack.loopable) {
            // Loop if track is loopable
            this.audioPlayer.currentTime = 0;
            this.audioPlayer.play();
        } else {
            this.stop();
        }
    }

    calculateCompletionXP(track) {
        let xp = 20; // Base XP

        // Duration bonuses
        if (track.duration >= 3600) xp += 50; // 1+ hour
        else if (track.duration >= 1800) xp += 30; // 30+ minutes
        else if (track.duration >= 600) xp += 15; // 10+ minutes

        // Category bonuses
        if (track.category === 'meditation') xp += 20;
        if (track.category === 'audiobook') xp += 25;
        if (track.difficulty === 'advanced') xp += 15;

        return xp;
    }

    handleTimeUpdate() {
        // Update progress bar and time display
        if (this.currentTrack) {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            this.updateProgress(progress);

            // Check milestones (25%, 50%, 75%)
            const percent = Math.floor(progress);
            const milestone = localStorage.getItem(`audio_milestone_${this.currentTrack.id}`);

            if (!milestone || parseInt(milestone) < percent) {
                if (percent >= 25 && parseInt(milestone || 0) < 25) {
                    this.awardMilestoneXP(25);
                    localStorage.setItem(`audio_milestone_${this.currentTrack.id}`, '25');
                } else if (percent >= 50 && parseInt(milestone || 0) < 50) {
                    this.awardMilestoneXP(50);
                    localStorage.setItem(`audio_milestone_${this.currentTrack.id}`, '50');
                } else if (percent >= 75 && parseInt(milestone || 0) < 75) {
                    this.awardMilestoneXP(75);
                    localStorage.setItem(`audio_milestone_${this.currentTrack.id}`, '75');
                }
            }
        }

        // Check sleep timer
        if (this.sleepTimer && Date.now() >= this.sleepTimer) {
            this.fadeOut();
        }
    }

    awardMilestoneXP(percent) {
        if (window.progressSystem) {
            window.progressSystem.awardXP(5, `${percent}% progress`, 'audio');
        }
    }

    handleMetadataLoaded() {
        // Update duration display
        this.updatePlayerUI();
    }

    handleError(error) {
        console.error('Audio player error:', error);
        alert('Error loading audio. Please try again.');
    }

    addToHistory(track) {
        const historyItem = {
            trackId: track.id,
            title: track.title,
            category: track.category,
            timestamp: new Date().toISOString()
        };

        this.listeningHistory.unshift(historyItem);

        // Keep only last 100 items
        if (this.listeningHistory.length > 100) {
            this.listeningHistory = this.listeningHistory.slice(0, 100);
        }

        this.saveHistory();
    }

    toggleFavorite(trackId) {
        const index = this.favorites.indexOf(trackId);

        if (index === -1) {
            this.favorites.push(trackId);

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(5, 'Added to favorites', 'audio');
            }
        } else {
            this.favorites.splice(index, 1);
        }

        this.saveFavorites();
        return this.favorites.includes(trackId);
    }

    isFavorite(trackId) {
        return this.favorites.includes(trackId);
    }

    getFavorites() {
        return this.favorites.map(id => this.getTrackById(id)).filter(track => track !== undefined);
    }

    createPlaylist(tracks) {
        this.playlist = tracks;
        this.playlistIndex = 0;
    }

    addToPlaylist(trackId) {
        const track = this.getTrackById(trackId);
        if (track && !this.playlist.find(t => t.id === trackId)) {
            this.playlist.push(track);
        }
    }

    removeFromPlaylist(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.playlist.splice(index, 1);
            if (this.playlistIndex >= index && this.playlistIndex > 0) {
                this.playlistIndex--;
            }
        }
    }

    clearPlaylist() {
        this.playlist = [];
        this.playlistIndex = 0;
    }

    nextTrack() {
        if (this.playlist.length > 0 && this.playlistIndex < this.playlist.length - 1) {
            this.playlistIndex++;
            this.playTrack(this.playlist[this.playlistIndex].id);
        }
    }

    previousTrack() {
        if (this.playlist.length > 0 && this.playlistIndex > 0) {
            this.playlistIndex--;
            this.playTrack(this.playlist[this.playlistIndex].id);
        }
    }

    setSleepTimer(minutes) {
        if (minutes > 0) {
            this.sleepTimer = Date.now() + (minutes * 60 * 1000);
            localStorage.setItem('audio_sleep_timer', this.sleepTimer);

            alert(`Sleep timer set for ${minutes} minutes`);
        } else {
            this.sleepTimer = null;
            localStorage.removeItem('audio_sleep_timer');
        }
    }

    fadeOut(duration = 5000) {
        if (!this.audioPlayer) return;

        const startVolume = this.audioPlayer.volume;
        const fadeInterval = 100;
        const steps = duration / fadeInterval;
        const volumeStep = startVolume / steps;
        let currentStep = 0;

        const fade = setInterval(() => {
            currentStep++;
            const newVolume = startVolume - (volumeStep * currentStep);

            if (newVolume <= 0 || currentStep >= steps) {
                clearInterval(fade);
                this.audioPlayer.volume = 0;
                this.pause();
                this.sleepTimer = null;
                localStorage.removeItem('audio_sleep_timer');
            } else {
                this.audioPlayer.volume = newVolume;
            }
        }, fadeInterval);
    }

    // Offline/Download functionality (would require additional implementation)
    async downloadTrack(trackId) {
        // In a real implementation, this would download the audio file
        // For now, just mark as downloaded
        if (!this.downloadedTracks.includes(trackId)) {
            this.downloadedTracks.push(trackId);
            this.saveDownloaded();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(10, 'Downloaded track for offline', 'audio');
            }
        }
    }

    isDownloaded(trackId) {
        return this.downloadedTracks.includes(trackId);
    }

    // Storage functions
    loadFavorites() {
        const saved = localStorage.getItem('audio_favorites');
        return saved ? JSON.parse(saved) : [];
    }

    saveFavorites() {
        localStorage.setItem('audio_favorites', JSON.stringify(this.favorites));
    }

    loadHistory() {
        const saved = localStorage.getItem('audio_history');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('audio_history', JSON.stringify(this.listeningHistory));
    }

    loadDownloaded() {
        const saved = localStorage.getItem('audio_downloaded');
        return saved ? JSON.parse(saved) : [];
    }

    saveDownloaded() {
        localStorage.setItem('audio_downloaded', JSON.stringify(this.downloadedTracks));
    }

    getStats() {
        const allTracks = this.getAllTracks();
        const listened = this.listeningHistory.length;
        const favorites = this.favorites.length;
        const downloaded = this.downloadedTracks.length;

        // Calculate total listening time (approximate)
        const totalTime = this.listeningHistory.reduce((sum, item) => {
            const track = this.getTrackById(item.trackId);
            return sum + (track ? track.duration : 0);
        }, 0);

        return {
            totalTracks: allTracks.length,
            listened,
            favorites,
            downloaded,
            totalListeningTime: totalTime,
            totalListeningHours: Math.floor(totalTime / 3600)
        };
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    }

    updatePlayerUI() {
        // This would update the audio player UI elements
        // Implementation depends on the HTML structure
        window.dispatchEvent(new CustomEvent('audio-player-updated', {
            detail: {
                track: this.currentTrack,
                isPlaying: this.isPlaying,
                currentTime: this.audioPlayer?.currentTime || 0,
                duration: this.audioPlayer?.duration || 0
            }
        }));
    }

    updateProgress(progress) {
        window.dispatchEvent(new CustomEvent('audio-progress-updated', {
            detail: {
                progress,
                currentTime: this.audioPlayer?.currentTime || 0,
                duration: this.audioPlayer?.duration || 0
            }
        }));
    }
}

// Initialize the audio content system
if (typeof window !== 'undefined') {
    window.audioContentSystem = new AudioContentSystem();
    console.log('🎧 Audio Content System ready!');
}
