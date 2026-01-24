/**
 * 🔗 Divine Temple Integration Configuration
 * 
 * This file contains the client-side configuration for OAuth integrations.
 * API keys and secrets should be set as environment variables in production.
 * 
 * SECURITY NOTE: Only client IDs and public keys go here.
 * Never put client secrets or private keys in this file!
 */

// Integration Configuration Object
window.INTEGRATION_CONFIG = {
    // Spotify Music Integration
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID',
        scopes: [
            'user-read-private',
            'user-read-email', 
            'playlist-modify-public',
            'playlist-modify-private',
            'user-library-modify',
            'user-read-playback-state',
            'user-modify-playback-state'
        ],
        apiUrl: 'https://api.spotify.com/v1'
    },

    // Google OAuth (for YouTube and Calendar)
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        apiKey: process.env.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY',
        scopes: [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/calendar.events'
        ]
    },

    // YouTube Data API
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY',
        channelId: 'YOUR_YOUTUBE_CHANNEL_ID', // Divine Temple channel
        apiUrl: 'https://www.googleapis.com/youtube/v3'
    },

    // Google Calendar API  
    calendar: {
        calendarId: 'primary', // User's primary calendar
        apiUrl: 'https://www.googleapis.com/calendar/v3'
    },

    // Common OAuth settings
    oauth: {
        redirectUri: `${window.location.origin}/callback.html`,
        state: {
            // Generate unique state for each OAuth request
            generate: (service) => btoa(JSON.stringify({
                service: service,
                timestamp: Date.now(),
                random: Math.random().toString(36).substr(2, 9)
            }))
        }
    }
};

// OAuth URL Generators
window.INTEGRATION_URLS = {
    // Spotify Authorization URL
    getSpotifyAuthUrl: () => {
        const config = window.INTEGRATION_CONFIG.spotify;
        const params = new URLSearchParams({
            client_id: config.clientId,
            response_type: 'code',
            redirect_uri: window.INTEGRATION_CONFIG.oauth.redirectUri,
            scope: config.scopes.join(' '),
            state: window.INTEGRATION_CONFIG.oauth.state.generate('spotify'),
            show_dialog: 'true'
        });
        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    },

    // Google OAuth URL (for YouTube + Calendar)
    getGoogleAuthUrl: () => {
        const config = window.INTEGRATION_CONFIG.google;
        const params = new URLSearchParams({
            client_id: config.clientId,
            response_type: 'code',
            redirect_uri: window.INTEGRATION_CONFIG.oauth.redirectUri,
            scope: config.scopes.join(' '),
            state: window.INTEGRATION_CONFIG.oauth.state.generate('google'),
            access_type: 'offline',
            prompt: 'consent'
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
};

// XP Rewards for Integrations
window.INTEGRATION_XP_REWARDS = {
    spotify: 50,     // 50 XP for connecting Spotify
    youtube: 30,     // 30 XP for subscribing to channel
    calendar: 40,    // 40 XP for calendar integration
    firstPlaylist: 25,   // 25 XP for creating first spiritual playlist
    firstEvent: 20,      // 20 XP for scheduling first practice
    weeklyUsage: 15      // 15 XP for weekly integration usage
};

// Development Mode Check
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode detected - integration APIs may use test credentials');
    
    // Override redirect URI for local development
    window.INTEGRATION_CONFIG.oauth.redirectUri = 'http://localhost:5000/callback.html';
}

console.log('🔗 Integration configuration loaded:', {
    spotify: !!window.INTEGRATION_CONFIG.spotify.clientId && window.INTEGRATION_CONFIG.spotify.clientId !== 'YOUR_SPOTIFY_CLIENT_ID',
    google: !!window.INTEGRATION_CONFIG.google.clientId && window.INTEGRATION_CONFIG.google.clientId !== 'YOUR_GOOGLE_CLIENT_ID',
    youtube: !!window.INTEGRATION_CONFIG.youtube.apiKey && window.INTEGRATION_CONFIG.youtube.apiKey !== 'YOUR_YOUTUBE_API_KEY'
});