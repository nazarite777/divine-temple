/**
 * 🔗 Divine Temple Integrations System
 *
 * Features:
 * - Spotify integration (playlist creation, music streaming)
 * - YouTube integration (subscribe to channel, embed videos)
 * - Google Calendar integration (schedule spiritual practices)
 * - Apple Music integration
 * - Integration management dashboard
 * - OAuth authentication flow
 * - XP rewards for connecting services
 */

class IntegrationsSystem {
    constructor() {
        this.connectedServices = this.loadConnectedServices();
        this.apiKeys = {
            spotify: {
                clientId: 'YOUR_SPOTIFY_CLIENT_ID',
                redirectUri: window.location.origin + '/callback/spotify'
            },
            google: {
                clientId: 'YOUR_GOOGLE_CLIENT_ID',
                redirectUri: window.location.origin + '/callback/google',
                apiKey: 'YOUR_GOOGLE_API_KEY'
            },
            youtube: {
                apiKey: 'YOUR_YOUTUBE_API_KEY'
            }
        };
        this.init();
    }

    init() {
        console.log('🔗 Integrations System initialized');

        // Check for OAuth callbacks
        this.handleOAuthCallback();
    }

    loadConnectedServices() {
        const saved = localStorage.getItem('connected_services');
        return saved ? JSON.parse(saved) : {};
    }

    saveConnectedServices() {
        localStorage.setItem('connected_services', JSON.stringify(this.connectedServices));
    }

    isConnected(service) {
        return this.connectedServices[service] && this.connectedServices[service].connected;
    }

    // ========== SPOTIFY INTEGRATION ==========

    async connectSpotify() {
        const scopes = [
            'user-read-private',
            'user-read-email',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-library-modify',
            'user-library-read'
        ];

        const authUrl = `https://accounts.spotify.com/authorize?` +
            `client_id=${this.apiKeys.spotify.clientId}&` +
            `response_type=token&` +
            `redirect_uri=${encodeURIComponent(this.apiKeys.spotify.redirectUri)}&` +
            `scope=${encodeURIComponent(scopes.join(' '))}`;

        window.location.href = authUrl;
    }

    handleSpotifyCallback(accessToken) {
        this.connectedServices.spotify = {
            connected: true,
            accessToken: accessToken,
            connectedAt: new Date().toISOString()
        };

        this.saveConnectedServices();

        // 🎯 AWARD XP
        if (window.progressSystem) {
            window.progressSystem.awardXP(30, 'Connected Spotify! 🎵', 'integrations');
        }

        return { success: true, message: 'Spotify connected!' };
    }

    async createSpotifyPlaylist(name, description, tracks = []) {
        if (!this.isConnected('spotify')) {
            return { success: false, message: 'Spotify not connected' };
        }

        try {
            const accessToken = this.connectedServices.spotify.accessToken;

            // Get user ID
            const userResponse = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const user = await userResponse.json();

            // Create playlist
            const playlistResponse = await fetch(
                `https://api.spotify.com/v1/users/${user.id}/playlists`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        public: false
                    })
                }
            );

            const playlist = await playlistResponse.json();

            // Add tracks if provided
            if (tracks.length > 0) {
                await fetch(
                    `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            uris: tracks
                        })
                    }
                );
            }

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(25, `Created Spotify playlist: ${name}`, 'integrations');
            }

            return {
                success: true,
                message: 'Playlist created!',
                playlist: playlist
            };

        } catch (error) {
            console.error('Error creating Spotify playlist:', error);
            return { success: false, message: 'Failed to create playlist' };
        }
    }

    async searchSpotifyMusic(query, type = 'track', limit = 20) {
        if (!this.isConnected('spotify')) {
            return { success: false, results: [] };
        }

        try {
            const accessToken = this.connectedServices.spotify.accessToken;

            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            const data = await response.json();

            return {
                success: true,
                results: data[type + 's'].items
            };

        } catch (error) {
            console.error('Error searching Spotify:', error);
            return { success: false, results: [] };
        }
    }

    // Preset spiritual playlists
    getSpiritualPlaylists() {
        return [
            {
                name: 'Divine Temple Meditation',
                description: 'Calming meditation music for your spiritual practice',
                tracks: [
                    'spotify:track:meditation1',
                    'spotify:track:meditation2'
                ]
            },
            {
                name: 'Chakra Healing',
                description: 'Frequencies for chakra balancing and healing',
                tracks: [
                    'spotify:track:chakra1',
                    'spotify:track:chakra2'
                ]
            },
            {
                name: 'Sacred Mantras',
                description: 'Powerful mantras for devotional practice',
                tracks: [
                    'spotify:track:mantra1',
                    'spotify:track:mantra2'
                ]
            }
        ];
    }

    // ========== YOUTUBE INTEGRATION ==========

    async connectYouTube() {
        // YouTube uses Google OAuth
        return this.connectGoogle('youtube');
    }

    async subscribeToYouTubeChannel(channelId) {
        if (!this.isConnected('youtube')) {
            return { success: false, message: 'YouTube not connected' };
        }

        try {
            const accessToken = this.connectedServices.google.accessToken;

            const response = await fetch(
                'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        snippet: {
                            resourceId: {
                                kind: 'youtube#channel',
                                channelId: channelId
                            }
                        }
                    })
                }
            );

            const data = await response.json();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(15, 'Subscribed to YouTube channel! 📺', 'integrations');
            }

            return { success: true, message: 'Subscribed to channel!', data };

        } catch (error) {
            console.error('Error subscribing to YouTube channel:', error);
            return { success: false, message: 'Failed to subscribe' };
        }
    }

    async searchYouTubeVideos(query, maxResults = 25) {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?` +
                `part=snippet&` +
                `q=${encodeURIComponent(query)}&` +
                `type=video&` +
                `maxResults=${maxResults}&` +
                `key=${this.apiKeys.youtube.apiKey}`
            );

            const data = await response.json();

            return {
                success: true,
                videos: data.items
            };

        } catch (error) {
            console.error('Error searching YouTube:', error);
            return { success: false, videos: [] };
        }
    }

    // ========== GOOGLE CALENDAR INTEGRATION ==========

    async connectGoogle(service = 'calendar') {
        const scopes = service === 'calendar' ?
            ['https://www.googleapis.com/auth/calendar.events'] :
            ['https://www.googleapis.com/auth/youtube.force-ssl'];

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${this.apiKeys.google.clientId}&` +
            `redirect_uri=${encodeURIComponent(this.apiKeys.google.redirectUri)}&` +
            `response_type=token&` +
            `scope=${encodeURIComponent(scopes.join(' '))}`;

        window.location.href = authUrl;
    }

    handleGoogleCallback(accessToken) {
        this.connectedServices.google = {
            connected: true,
            accessToken: accessToken,
            connectedAt: new Date().toISOString()
        };

        this.connectedServices.youtube = {
            connected: true,
            accessToken: accessToken,
            connectedAt: new Date().toISOString()
        };

        this.connectedServices.calendar = {
            connected: true,
            accessToken: accessToken,
            connectedAt: new Date().toISOString()
        };

        this.saveConnectedServices();

        // 🎯 AWARD XP
        if (window.progressSystem) {
            window.progressSystem.awardXP(30, 'Connected Google Calendar! 📅', 'integrations');
        }

        return { success: true, message: 'Google services connected!' };
    }

    async createCalendarEvent(event) {
        if (!this.isConnected('calendar')) {
            return { success: false, message: 'Google Calendar not connected' };
        }

        try {
            const accessToken = this.connectedServices.google.accessToken;

            const eventData = {
                summary: event.title,
                description: event.description || '',
                start: {
                    dateTime: event.startTime,
                    timeZone: event.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: event.endTime,
                    timeZone: event.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'popup', minutes: 15 }
                    ]
                }
            };

            const response = await fetch(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(eventData)
                }
            );

            const data = await response.json();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(15, 'Scheduled spiritual practice! 📅', 'integrations');
            }

            return {
                success: true,
                message: 'Event created in Google Calendar!',
                event: data
            };

        } catch (error) {
            console.error('Error creating calendar event:', error);
            return { success: false, message: 'Failed to create event' };
        }
    }

    // Quick schedule presets
    scheduleQuickPractice(practiceType, date, duration = 30) {
        const practices = {
            meditation: {
                title: '🧘 Daily Meditation',
                description: 'Take time for your meditation practice'
            },
            yoga: {
                title: '🕉️ Yoga Session',
                description: 'Practice yoga for body and mind'
            },
            journaling: {
                title: '📖 Spiritual Journaling',
                description: 'Reflect on your spiritual journey'
            },
            prayer: {
                title: '🙏 Prayer & Devotion',
                description: 'Connect with the divine through prayer'
            }
        };

        const practice = practices[practiceType] || practices.meditation;

        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        return this.createCalendarEvent({
            title: practice.title,
            description: practice.description,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
        });
    }

    // ========== GENERAL INTEGRATION MANAGEMENT ==========

    handleOAuthCallback() {
        // Parse hash fragment for OAuth tokens
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const accessToken = params.get('access_token');
        const state = params.get('state');

        if (accessToken && state) {
            // Determine which service based on state
            if (state.includes('spotify')) {
                this.handleSpotifyCallback(accessToken);
            } else if (state.includes('google')) {
                this.handleGoogleCallback(accessToken);
            }

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    disconnectService(service) {
        if (this.connectedServices[service]) {
            delete this.connectedServices[service];
            this.saveConnectedServices();

            return { success: true, message: `${service} disconnected` };
        }

        return { success: false, message: 'Service not connected' };
    }

    getConnectedServices() {
        return Object.keys(this.connectedServices).filter(service =>
            this.connectedServices[service].connected
        );
    }

    getIntegrationStats() {
        return {
            totalConnected: this.getConnectedServices().length,
            spotify: this.isConnected('spotify'),
            youtube: this.isConnected('youtube'),
            calendar: this.isConnected('calendar'),
            google: this.isConnected('google')
        };
    }

    openIntegrationsModal() {
        const modal = document.createElement('div');
        modal.className = 'integrations-modal';
        modal.id = 'integrationsModal';

        const stats = this.getIntegrationStats();

        modal.innerHTML = `
            <div class="integrations-modal-content">
                <div class="integrations-modal-header">
                    <h2>🔗 Integrations</h2>
                    <button onclick="document.getElementById('integrationsModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="integrations-modal-body">
                    <p class="integrations-intro">
                        Connect your favorite services to enhance your spiritual practice
                    </p>

                    <div class="integrations-list">
                        <!-- Spotify -->
                        <div class="integration-card">
                            <div class="integration-icon">🎵</div>
                            <div class="integration-info">
                                <h3>Spotify</h3>
                                <p>Create spiritual playlists and listen to meditation music</p>
                            </div>
                            <div class="integration-action">
                                ${stats.spotify ? `
                                    <span class="connected-badge">✓ Connected</span>
                                    <button onclick="window.integrationsSystem.disconnectService('spotify'); location.reload();" class="disconnect-btn">
                                        Disconnect
                                    </button>
                                ` : `
                                    <button onclick="window.integrationsSystem.connectSpotify()" class="connect-btn">
                                        Connect
                                    </button>
                                `}
                            </div>
                        </div>

                        <!-- YouTube -->
                        <div class="integration-card">
                            <div class="integration-icon">📺</div>
                            <div class="integration-info">
                                <h3>YouTube</h3>
                                <p>Subscribe to spiritual channels and access guided videos</p>
                            </div>
                            <div class="integration-action">
                                ${stats.youtube ? `
                                    <span class="connected-badge">✓ Connected</span>
                                    <button onclick="window.integrationsSystem.disconnectService('youtube'); location.reload();" class="disconnect-btn">
                                        Disconnect
                                    </button>
                                ` : `
                                    <button onclick="window.integrationsSystem.connectYouTube()" class="connect-btn">
                                        Connect
                                    </button>
                                `}
                            </div>
                        </div>

                        <!-- Google Calendar -->
                        <div class="integration-card">
                            <div class="integration-icon">📅</div>
                            <div class="integration-info">
                                <h3>Google Calendar</h3>
                                <p>Schedule your spiritual practices and get reminders</p>
                            </div>
                            <div class="integration-action">
                                ${stats.calendar ? `
                                    <span class="connected-badge">✓ Connected</span>
                                    <button onclick="window.integrationsSystem.disconnectService('calendar'); location.reload();" class="disconnect-btn">
                                        Disconnect
                                    </button>
                                ` : `
                                    <button onclick="window.integrationsSystem.connectGoogle('calendar')" class="connect-btn">
                                        Connect
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>

                    <div class="integrations-stats">
                        <h4>📊 Integration Stats</h4>
                        <p><strong>${stats.totalConnected}</strong> services connected</p>
                    </div>
                </div>
            </div>
        `;

        this.addIntegrationsStyles();
        document.body.appendChild(modal);
    }

    addIntegrationsStyles() {
        if (document.getElementById('integrationsStyles')) return;

        const style = document.createElement('style');
        style.id = 'integrationsStyles';
        style.textContent = `
            .integrations-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .integrations-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 700px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .integrations-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .integrations-modal-header h2 {
                margin: 0;
            }

            .modal-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
            }

            .integrations-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
            }

            .integrations-intro {
                text-align: center;
                color: #666;
                margin-bottom: 30px;
            }

            .integrations-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .integration-card {
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 15px;
                border: 2px solid #e0e0e0;
                transition: all 0.2s;
            }

            .integration-card:hover {
                border-color: #667eea;
                background: #f9f9ff;
            }

            .integration-icon {
                font-size: 48px;
                flex-shrink: 0;
            }

            .integration-info {
                flex: 1;
            }

            .integration-info h3 {
                margin: 0 0 5px 0;
                font-size: 18px;
            }

            .integration-info p {
                margin: 0;
                color: #666;
                font-size: 14px;
            }

            .integration-action {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
            }

            .connected-badge {
                color: #10b981;
                font-weight: 600;
                font-size: 14px;
            }

            .connect-btn, .disconnect-btn {
                padding: 10px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                transition: transform 0.2s;
            }

            .connect-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .connect-btn:hover {
                transform: translateY(-2px);
            }

            .disconnect-btn {
                background: #f0f0f0;
                color: #666;
            }

            .integrations-stats {
                margin-top: 30px;
                padding: 20px;
                background: #f0f0f0;
                border-radius: 12px;
                text-align: center;
            }

            .integrations-stats h4 {
                margin: 0 0 10px 0;
            }

            .integrations-stats p {
                margin: 0;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        document.head.appendChild(style);
    }
}

// Initialize the integrations system
if (typeof window !== 'undefined') {
    window.integrationsSystem = new IntegrationsSystem();
    console.log('🔗 Integrations System ready!');
}
