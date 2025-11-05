/**
 * 📺 Divine Temple Video Library System
 *
 * Features:
 * - Partner content integration (YouTube, Vimeo, custom hosted)
 * - Guided video series and courses
 * - Video categories (meditation, yoga, teachings, rituals, documentaries)
 * - Progress tracking (save position, mark as watched)
 * - Video playlists (curated and custom)
 * - Comments and ratings
 * - Live stream support
 * - Video transcripts
 * - XP rewards for watching
 * - Recommendations based on viewing history
 */

class VideoLibrarySystem {
    constructor() {
        this.videoLibrary = this.loadVideoLibrary();
        this.watchHistory = this.loadWatchHistory();
        this.savedProgress = this.loadSavedProgress();
        this.playlists = this.loadPlaylists();
        this.favorites = this.loadFavorites();
        this.currentVideo = null;
        this.player = null;
        this.init();
    }

    init() {
        console.log('📺 Video Library System initialized');
        this.setupProgressTracking();
    }

    loadVideoLibrary() {
        return {
            courses: [
                {
                    id: 'course-1',
                    title: '30-Day Meditation Mastery',
                    description: 'Complete meditation course from beginner to advanced',
                    instructor: 'Master Meditation Teacher',
                    level: 'All Levels',
                    duration: 36000, // Total duration in seconds (10 hours)
                    thumbnail: '/img/videos/meditation-course.jpg',
                    videos: [
                        {
                            id: 'course-1-v1',
                            title: 'Day 1: Introduction to Meditation',
                            duration: 1200,
                            videoUrl: 'https://youtube.com/embed/xyz123',
                            type: 'youtube'
                        },
                        {
                            id: 'course-1-v2',
                            title: 'Day 2: Breath Awareness',
                            duration: 1200,
                            videoUrl: 'https://youtube.com/embed/xyz124',
                            type: 'youtube'
                        }
                        // ... more videos
                    ],
                    tags: ['meditation', 'course', 'mindfulness'],
                    rating: 4.9,
                    enrollments: 5432
                },
                {
                    id: 'course-2',
                    title: 'Yoga for Spiritual Awakening',
                    description: '21-day transformational yoga journey',
                    instructor: 'Yoga Master',
                    level: 'Intermediate',
                    duration: 25200, // 7 hours
                    thumbnail: '/img/videos/yoga-course.jpg',
                    videos: [
                        {
                            id: 'course-2-v1',
                            title: 'Day 1: Foundation Poses',
                            duration: 1800,
                            videoUrl: 'https://youtube.com/embed/abc123',
                            type: 'youtube'
                        }
                        // ... more videos
                    ],
                    tags: ['yoga', 'awakening', 'transformation'],
                    rating: 4.8,
                    enrollments: 3210
                }
            ],
            teachings: [
                {
                    id: 'teaching-1',
                    title: 'The Nature of Consciousness',
                    description: 'Deep dive into consciousness and awareness',
                    teacher: 'Spiritual Master',
                    duration: 5400, // 90 minutes
                    thumbnail: '/img/videos/consciousness.jpg',
                    videoUrl: 'https://youtube.com/embed/def456',
                    type: 'youtube',
                    tags: ['consciousness', 'philosophy', 'awakening'],
                    views: 125000,
                    rating: 4.9
                },
                {
                    id: 'teaching-2',
                    title: 'Understanding Karma',
                    description: 'The law of cause and effect explained',
                    teacher: 'Dharma Teacher',
                    duration: 3600,
                    thumbnail: '/img/videos/karma.jpg',
                    videoUrl: 'https://youtube.com/embed/ghi789',
                    type: 'youtube',
                    tags: ['karma', 'buddhism', 'philosophy'],
                    views: 98000,
                    rating: 4.7
                }
            ],
            meditations: [
                {
                    id: 'meditation-1',
                    title: 'Guided Body Scan Meditation',
                    description: 'Full body relaxation and awareness',
                    guide: 'Calm Voice',
                    duration: 1200, // 20 minutes
                    thumbnail: '/img/videos/body-scan.jpg',
                    videoUrl: 'https://youtube.com/embed/jkl012',
                    type: 'youtube',
                    difficulty: 'Beginner',
                    tags: ['meditation', 'relaxation', 'body scan'],
                    views: 250000
                },
                {
                    id: 'meditation-2',
                    title: 'Chakra Activation Meditation',
                    description: 'Activate and balance all seven chakras',
                    guide: 'Energy Healer',
                    duration: 2100, // 35 minutes
                    thumbnail: '/img/videos/chakra-activation.jpg',
                    videoUrl: 'https://youtube.com/embed/mno345',
                    type: 'youtube',
                    difficulty: 'Intermediate',
                    tags: ['meditation', 'chakras', 'energy'],
                    views: 180000
                }
            ],
            rituals: [
                {
                    id: 'ritual-1',
                    title: 'Full Moon Ceremony',
                    description: 'Sacred ritual for the full moon',
                    guide: 'Moon Priestess',
                    duration: 1800, // 30 minutes
                    thumbnail: '/img/videos/full-moon.jpg',
                    videoUrl: 'https://youtube.com/embed/pqr678',
                    type: 'youtube',
                    tags: ['ritual', 'moon', 'ceremony'],
                    views: 75000
                },
                {
                    id: 'ritual-2',
                    title: 'Sacred Smudging Ceremony',
                    description: 'Learn the art of energy clearing with sage',
                    guide: 'Shaman',
                    duration: 900, // 15 minutes
                    thumbnail: '/img/videos/smudging.jpg',
                    videoUrl: 'https://youtube.com/embed/stu901',
                    type: 'youtube',
                    tags: ['ritual', 'cleansing', 'smudging'],
                    views: 92000
                }
            ],
            documentaries: [
                {
                    id: 'doc-1',
                    title: 'The Awakening: A Spiritual Journey',
                    description: 'Documentary following spiritual seekers around the world',
                    duration: 7200, // 2 hours
                    thumbnail: '/img/videos/awakening-doc.jpg',
                    videoUrl: 'https://youtube.com/embed/vwx234',
                    type: 'youtube',
                    tags: ['documentary', 'spirituality', 'journey'],
                    views: 500000,
                    rating: 4.9
                }
            ],
            liveStreams: [
                {
                    id: 'live-1',
                    title: 'Weekly Group Meditation',
                    description: 'Join us live every Sunday at 7 PM',
                    guide: 'Community Leader',
                    schedule: 'Sunday 7:00 PM EST',
                    thumbnail: '/img/videos/group-meditation.jpg',
                    streamUrl: 'https://youtube.com/live/abc',
                    type: 'youtube-live',
                    tags: ['live', 'meditation', 'community'],
                    recurring: true
                }
            ]
        };
    }

    getAllVideos() {
        const allVideos = [];
        for (const category in this.videoLibrary) {
            if (category === 'courses') {
                // For courses, add each individual video
                this.videoLibrary.courses.forEach(course => {
                    course.videos.forEach(video => {
                        allVideos.push({
                            ...video,
                            courseId: course.id,
                            courseTitle: course.title
                        });
                    });
                });
            } else {
                allVideos.push(...this.videoLibrary[category]);
            }
        }
        return allVideos;
    }

    getVideoById(videoId) {
        // Check in courses first
        for (const course of this.videoLibrary.courses) {
            const video = course.videos.find(v => v.id === videoId);
            if (video) {
                return {
                    ...video,
                    courseId: course.id,
                    courseTitle: course.title,
                    instructor: course.instructor
                };
            }
        }

        // Check other categories
        for (const category in this.videoLibrary) {
            if (category !== 'courses') {
                const video = this.videoLibrary[category].find(v => v.id === videoId);
                if (video) return video;
            }
        }

        return null;
    }

    getCourseById(courseId) {
        return this.videoLibrary.courses.find(c => c.id === courseId);
    }

    getVideosByCategory(category) {
        if (category === 'all') {
            return this.getAllVideos();
        }
        return this.videoLibrary[category] || [];
    }

    async watchVideo(videoId) {
        const video = this.getVideoById(videoId);

        if (!video) {
            return { success: false, message: 'Video not found' };
        }

        this.currentVideo = video;

        // Add to watch history
        this.addToWatchHistory(video);

        // Load saved progress if exists
        const progress = this.savedProgress[videoId];
        if (progress) {
            // Resume from saved position
            console.log(`Resuming from ${progress.position}s`);
        }

        // 🎯 AWARD XP for starting video
        if (window.progressSystem) {
            window.progressSystem.awardXP(15, `Started watching: ${video.title}`, 'videos');
            window.progressSystem.logActivity('video_started', 'videos', {
                videoId: video.id,
                title: video.title
            });
        }

        return { success: true, video };
    }

    saveProgress(videoId, position, duration) {
        this.savedProgress[videoId] = {
            position,
            duration,
            percentage: (position / duration) * 100,
            lastWatched: new Date().toISOString()
        };

        localStorage.setItem('video_progress', JSON.stringify(this.savedProgress));

        // Award milestone XP
        const percent = Math.floor((position / duration) * 100);
        const milestoneKey = `video_milestone_${videoId}`;
        const lastMilestone = parseInt(localStorage.getItem(milestoneKey) || '0');

        if (percent >= 50 && lastMilestone < 50) {
            if (window.progressSystem) {
                window.progressSystem.awardXP(10, 'Halfway through video', 'videos');
            }
            localStorage.setItem(milestoneKey, '50');
        } else if (percent >= 90 && lastMilestone < 90) {
            // Mark as completed
            this.markAsCompleted(videoId);
        }
    }

    markAsCompleted(videoId) {
        const video = this.getVideoById(videoId);
        if (!video) return;

        const completedKey = `video_completed_${videoId}`;
        if (localStorage.getItem(completedKey)) {
            return; // Already awarded XP
        }

        // 🎯 AWARD XP for completing video
        let xp = 30; // Base XP

        if (video.duration >= 3600) xp += 50; // 1+ hour
        else if (video.duration >= 1800) xp += 30; // 30+ min
        else if (video.duration >= 600) xp += 15; // 10+ min

        if (video.courseId) xp += 20; // Course video bonus

        if (window.progressSystem) {
            window.progressSystem.awardXP(xp, `Completed: ${video.title}`, 'videos');
            window.progressSystem.logActivity('video_completed', 'videos', {
                videoId: video.id,
                duration: video.duration
            });
        }

        localStorage.setItem(completedKey, 'true');

        // Check if course is completed
        if (video.courseId) {
            this.checkCourseCompletion(video.courseId);
        }
    }

    checkCourseCompletion(courseId) {
        const course = this.getCourseById(courseId);
        if (!course) return;

        const allCompleted = course.videos.every(video =>
            localStorage.getItem(`video_completed_${video.id}`)
        );

        if (allCompleted) {
            const courseCompletedKey = `course_completed_${courseId}`;
            if (!localStorage.getItem(courseCompletedKey)) {
                // 🎯 AWARD BIG XP for completing course
                if (window.progressSystem) {
                    window.progressSystem.awardXP(500, `Course Completed: ${course.title}! 🎓`, 'videos');
                }
                localStorage.setItem(courseCompletedKey, 'true');

                this.showCourseCompletionBadge(course);
            }
        }
    }

    showCourseCompletionBadge(course) {
        const badge = document.createElement('div');
        badge.className = 'course-completion-badge';
        badge.innerHTML = `
            <div class="badge-content">
                <div class="badge-icon">🎓</div>
                <h3>Course Completed!</h3>
                <p>${course.title}</p>
                <p class="badge-xp">+500 XP</p>
                <p class="badge-message">Congratulations on completing this transformational journey!</p>
            </div>
        `;

        document.body.appendChild(badge);

        setTimeout(() => badge.remove(), 8000);
    }

    isCompleted(videoId) {
        return localStorage.getItem(`video_completed_${videoId}`) === 'true';
    }

    isCourseCompleted(courseId) {
        return localStorage.getItem(`course_completed_${courseId}`) === 'true';
    }

    getCourseProgress(courseId) {
        const course = this.getCourseById(courseId);
        if (!course) return 0;

        const completed = course.videos.filter(video =>
            this.isCompleted(video.id)
        ).length;

        return (completed / course.videos.length) * 100;
    }

    addToWatchHistory(video) {
        const historyItem = {
            videoId: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            timestamp: new Date().toISOString()
        };

        this.watchHistory.unshift(historyItem);

        // Keep only last 100 items
        if (this.watchHistory.length > 100) {
            this.watchHistory = this.watchHistory.slice(0, 100);
        }

        this.saveWatchHistory();
    }

    toggleFavorite(videoId) {
        const index = this.favorites.indexOf(videoId);

        if (index === -1) {
            this.favorites.push(videoId);

            if (window.progressSystem) {
                window.progressSystem.awardXP(5, 'Added to favorites', 'videos');
            }
        } else {
            this.favorites.splice(index, 1);
        }

        this.saveFavorites();
        return this.favorites.includes(videoId);
    }

    isFavorite(videoId) {
        return this.favorites.includes(videoId);
    }

    getFavorites() {
        return this.favorites
            .map(id => this.getVideoById(id))
            .filter(video => video !== null);
    }

    createPlaylist(name, videoIds = []) {
        const playlist = {
            id: Date.now().toString(),
            name,
            videos: videoIds,
            createdAt: new Date().toISOString(),
            thumbnail: null
        };

        this.playlists.push(playlist);
        this.savePlaylists();

        if (window.progressSystem) {
            window.progressSystem.awardXP(20, `Created playlist: ${name}`, 'videos');
        }

        return playlist;
    }

    addToPlaylist(playlistId, videoId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist && !playlist.videos.includes(videoId)) {
            playlist.videos.push(videoId);
            this.savePlaylists();
            return true;
        }
        return false;
    }

    removeFromPlaylist(playlistId, videoId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist) {
            playlist.videos = playlist.videos.filter(id => id !== videoId);
            this.savePlaylists();
            return true;
        }
        return false;
    }

    deletePlaylist(playlistId) {
        this.playlists = this.playlists.filter(p => p.id !== playlistId);
        this.savePlaylists();
    }

    getPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return null;

        return {
            ...playlist,
            videos: playlist.videos
                .map(id => this.getVideoById(id))
                .filter(v => v !== null)
        };
    }

    getRecommendations(limit = 10) {
        // Simple recommendation based on watch history
        const watchedCategories = {};
        const watchedTags = {};

        // Analyze watch history
        this.watchHistory.forEach(item => {
            const video = this.getVideoById(item.videoId);
            if (video && video.tags) {
                video.tags.forEach(tag => {
                    watchedTags[tag] = (watchedTags[tag] || 0) + 1;
                });
            }
        });

        // Get top tags
        const topTags = Object.entries(watchedTags)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([tag]) => tag);

        // Find videos with similar tags
        const allVideos = this.getAllVideos();
        const recommendations = allVideos
            .filter(video => {
                // Don't recommend already watched videos
                if (this.isCompleted(video.id)) return false;

                // Match tags
                if (video.tags) {
                    return video.tags.some(tag => topTags.includes(tag));
                }
                return false;
            })
            .slice(0, limit);

        return recommendations;
    }

    enrollInCourse(courseId) {
        const course = this.getCourseById(courseId);
        if (!course) return false;

        const enrollmentKey = `course_enrolled_${courseId}`;
        if (!localStorage.getItem(enrollmentKey)) {
            localStorage.setItem(enrollmentKey, new Date().toISOString());

            if (window.progressSystem) {
                window.progressSystem.awardXP(50, `Enrolled in: ${course.title}`, 'videos');
            }

            return true;
        }

        return false;
    }

    isEnrolled(courseId) {
        return localStorage.getItem(`course_enrolled_${courseId}`) !== null;
    }

    getEnrolledCourses() {
        return this.videoLibrary.courses.filter(course =>
            this.isEnrolled(course.id)
        );
    }

    setupProgressTracking() {
        // Auto-save progress every 10 seconds if video is playing
        setInterval(() => {
            if (this.currentVideo && this.player) {
                const position = this.getCurrentPosition();
                const duration = this.currentVideo.duration;

                if (position && duration) {
                    this.saveProgress(this.currentVideo.id, position, duration);
                }
            }
        }, 10000);
    }

    getCurrentPosition() {
        // This would get the current position from the video player
        // Implementation depends on the player type (YouTube, Vimeo, etc.)
        return 0;
    }

    getStats() {
        const totalWatched = this.watchHistory.length;
        const totalCompleted = this.getAllVideos().filter(v => this.isCompleted(v.id)).length;
        const totalFavorites = this.favorites.length;
        const totalPlaylists = this.playlists.length;
        const enrolledCourses = this.getEnrolledCourses().length;
        const completedCourses = this.videoLibrary.courses.filter(c =>
            this.isCourseCompleted(c.id)
        ).length;

        // Calculate total watch time
        const watchTime = Object.values(this.savedProgress).reduce((sum, progress) => {
            return sum + progress.position;
        }, 0);

        return {
            totalWatched,
            totalCompleted,
            totalFavorites,
            totalPlaylists,
            enrolledCourses,
            completedCourses,
            watchTimeHours: Math.floor(watchTime / 3600)
        };
    }

    // Storage functions
    loadWatchHistory() {
        const saved = localStorage.getItem('video_watch_history');
        return saved ? JSON.parse(saved) : [];
    }

    saveWatchHistory() {
        localStorage.setItem('video_watch_history', JSON.stringify(this.watchHistory));
    }

    loadSavedProgress() {
        const saved = localStorage.getItem('video_progress');
        return saved ? JSON.parse(saved) : {};
    }

    loadPlaylists() {
        const saved = localStorage.getItem('video_playlists');
        return saved ? JSON.parse(saved) : [];
    }

    savePlaylists() {
        localStorage.setItem('video_playlists', JSON.stringify(this.playlists));
    }

    loadFavorites() {
        const saved = localStorage.getItem('video_favorites');
        return saved ? JSON.parse(saved) : [];
    }

    saveFavorites() {
        localStorage.setItem('video_favorites', JSON.stringify(this.favorites));
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }
}

// Initialize the video library system
if (typeof window !== 'undefined') {
    window.videoLibrarySystem = new VideoLibrarySystem();
    console.log('📺 Video Library System ready!');
}
