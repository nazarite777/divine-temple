/**
 * Divine Temple Service Worker
 * Sacred caching for offline spiritual practice
 */

const CACHE_NAME = 'divine-temple-complete-v9.0';
const STATIC_CACHE = 'divine-temple-static-v9.0';
const DYNAMIC_CACHE = 'divine-temple-dynamic-v9.0';
const OFFLINE_PAGE = '/offline.html';

// Complete Divine Temple Platform Files for PWA
const STATIC_ASSETS = [
    // Core platform pages
    '/',
    '/index.html',
    '/members.html',
    '/members-new.html',
    '/free-dashboard.html',
    '/register.html',
    '/login.html',
    '/offline.html',
    '/manifest.json',
    
    // Consciousness & Trivia System
    '/sections/daily-trivia-PREMIUM.html',
    '/sections/daily-trivia-FREE.html',
    '/js/daily-trivia-PREMIUM.js',
    '/js/daily-trivia-FREE-VERSION.js',
    '/js/trivia-audio-system.js',
    
    // Singing Bowl Meditation System
    '/sections/singing-bowl-harmony-garden.html',
    '/js/singing-bowl-system.js',
    '/js/singing-bowl-garden.js',
    '/js/realistic-wind-chimes.js',
    
    // Divine Guidance & Oracle System
    '/sections/divine-guidance-system.html',
    '/sections/oracle-cards.html',
    '/js/divine-guidance-system.js',
    '/js/oracle-cards-system.js',
    
    // Existing spiritual sections
    '/sections/oracle-divination.html',
    '/sections/meditation-mindfulness.html',
    '/sections/energy-healing.html',
    '/sections/sacred-arts-sound.html',
    '/sections/devotion-growth.html',
    '/sections/advanced-practices.html',
    '/sections/spiritual-tools.html',
    '/sections/meditation-corner.html',
    '/sections/astrology-insights.html',
    '/sections/chakra-alignment.html',
    '/sections/dream-journal.html',
    '/sections/manifestation-board.html',
    '/js/performance.js',
    '/js/image-optimizer.js',
    '/api/auth.php',
    '/manifest.json',
    OFFLINE_PAGE,
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache static assets with enhanced error handling
self.addEventListener('install', event => {
    console.log('🌟 Divine Temple Service Worker Installing - Phase 8 PWA Excellence...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Caching enhanced spiritual resources for offline practice');
                return cache.addAll(STATIC_ASSETS).catch(err => {
                    console.warn('⚠️ Some resources failed to cache:', err);
                    // Continue installation even if some resources fail
                });
            })
            .then(() => {
                console.log('✨ Divine Temple Service Worker Phase 8 Installed Successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🔥 Divine Temple Service Worker Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Removing old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Divine Temple Service Worker Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content and cache new requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isStaticAsset(request.url)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isAPIRequest(request.url)) {
        event.respondWith(handleAPIRequest(request));
    } else if (isImageRequest(request.url)) {
        event.respondWith(handleImageRequest(request));
    } else {
        event.respondWith(handleDynamicRequest(request));
    }
});

// Handle static assets (cache first strategy)
async function handleStaticAsset(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Error handling static asset:', error);
        return createOfflinePage();
    }
}

// Handle API requests (network first, cache fallback)
async function handleAPIRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('📡 Network unavailable, checking cache for API request');
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline API response
        return new Response(JSON.stringify({
            success: false,
            message: 'You are currently offline. Please check your connection to access the Divine Temple.',
            offline: true
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Handle image requests (cache first with fallback)
async function handleImageRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return placeholder image when offline
        return createPlaceholderImage();
    }
}

// Handle dynamic content (network first)
async function handleDynamicRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return createOfflinePage();
    }
}

// Utility functions
function isStaticAsset(url) {
    return url.includes('.css') || 
           url.includes('.js') || 
           url.includes('.woff') || 
           url.includes('.woff2') ||
           url.includes('fonts.googleapis.com') ||
           url.includes('fonts.gstatic.com');
}

function isAPIRequest(url) {
    return url.includes('/api/') || url.includes('api.php');
}

function isImageRequest(url) {
    return url.includes('.jpg') || 
           url.includes('.jpeg') || 
           url.includes('.png') || 
           url.includes('.gif') || 
           url.includes('.webp') || 
           url.includes('.svg');
}

// Create offline page
function createOfflinePage() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Divine Temple - Offline</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    text-align: center;
                }
                .offline-container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    padding: 3rem;
                    max-width: 500px;
                    margin: 2rem;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    color: #d4af37;
                }
                .offline-title {
                    font-size: 2rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: #8b5fbf;
                }
                .offline-message {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }
                .retry-btn {
                    background: linear-gradient(135deg, #8b5fbf, #d4af37);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                .retry-btn:hover {
                    transform: translateY(-2px);
                }
                .spiritual-quote {
                    margin-top: 2rem;
                    font-style: italic;
                    color: #d4af37;
                    font-size: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">🏛️</div>
                <h1 class="offline-title">Temporarily Disconnected</h1>
                <p class="offline-message">
                    The Divine Temple is currently offline. Your spiritual journey can continue with 
                    cached content, or you can reconnect when your internet connection is restored.
                </p>
                <button class="retry-btn" onclick="window.location.reload()">
                    🔄 Reconnect to the Temple
                </button>
                <div class="spiritual-quote">
                    "Even in moments of disconnection, the divine light within you continues to shine." ✨
                </div>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Create placeholder image for offline mode
function createPlaceholderImage() {
    const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a2e"/>
                    <stop offset="100%" style="stop-color:#0f3460"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#bg)"/>
            <text x="50%" y="45%" font-family="Arial" font-size="16" fill="#d4af37" text-anchor="middle">
                🏛️ Divine Temple
            </text>
            <text x="50%" y="60%" font-family="Arial" font-size="12" fill="#ffffff" text-anchor="middle" opacity="0.8">
                Image temporarily unavailable
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: { 'Content-Type': 'image/svg+xml' }
    });
}

// Background sync for when connection is restored
self.addEventListener('sync', event => {
    if (event.tag === 'divine-temple-sync') {
        event.waitUntil(syncData());
    }
});

// Sync data when connection is restored
async function syncData() {
    console.log('🔄 Syncing Divine Temple data...');
    
    try {
        // Sync any pending Oracle readings or user data
        const pendingData = await getPendingData();
        
        if (pendingData.length > 0) {
            for (const data of pendingData) {
                await fetch('/api/sync.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            await clearPendingData();
            console.log('✅ Divine Temple data synced successfully');
        }
    } catch (error) {
        console.error('❌ Sync failed:', error);
    }
}

// Get pending data from IndexedDB
async function getPendingData() {
    // Implementation would depend on your offline data storage strategy
    return [];
}

// Clear pending data after successful sync
async function clearPendingData() {
    // Implementation would depend on your offline data storage strategy
}

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: '/icons/temple-icon-192.png',
            badge: '/icons/temple-badge-72.png',
            vibrate: [200, 100, 200],
            data: {
                url: '/'
            },
            actions: [
                {
                    action: 'open',
                    title: '🏛️ Enter Temple',
                    icon: '/icons/action-temple.png'
                },
                {
                    action: 'meditate',
                    title: '🧘 Meditate Now',
                    icon: '/icons/action-meditate.png'
                },
                {
                    action: 'oracle',
                    title: '🔮 Draw Oracle Card',
                    icon: '/icons/action-oracle.png'
                }
            ],
            tag: 'divine-temple-notification'
        };
        
        event.waitUntil(
            self.registration.showNotification('Divine Temple 🏛️', options)
        );
    }
});

// Enhanced notification click handling for Phase 8
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    const { action, data } = event;
    let targetUrl = data?.url || '/members-new.html';
    
    // Handle specific actions
    if (action === 'meditate') {
        targetUrl = '/members-new.html#meditation-mindfulness';
    } else if (action === 'oracle') {
        targetUrl = '/members-new.html#oracle-divination';
    } else if (action === 'open') {
        targetUrl = '/members-new.html';
    }
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Check if Divine Temple is already open
            for (let client of clientList) {
                if (client.url.includes('divine-temple') && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// Background sync for spiritual progress tracking
self.addEventListener('sync', event => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'spiritual-progress-sync') {
        event.waitUntil(syncSpiritualProgress());
    } else if (event.tag === 'oracle-reading-sync') {
        event.waitUntil(syncOracleReadings());
    } else if (event.tag === 'meditation-session-sync') {
        event.waitUntil(syncMeditationSessions());
    } else if (event.tag === 'divine-temple-sync') {
        event.waitUntil(syncData());
    }
});

// Enhanced sync functions for Phase 8
async function syncSpiritualProgress() {
    try {
        const progressData = await getOfflineData('spiritual-progress');
        if (progressData.length > 0) {
            await fetch('/api/sync-progress.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: progressData })
            });
            await clearOfflineData('spiritual-progress');
            console.log('✨ Spiritual progress synced successfully');
        }
    } catch (error) {
        console.log('❌ Failed to sync spiritual progress:', error);
    }
}

async function syncOracleReadings() {
    try {
        const oracleData = await getOfflineData('oracle-readings');
        if (oracleData.length > 0) {
            await fetch('/api/sync-oracle.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ readings: oracleData })
            });
            await clearOfflineData('oracle-readings');
            console.log('🔮 Oracle readings synced successfully');
        }
    } catch (error) {
        console.log('❌ Failed to sync Oracle readings:', error);
    }
}

async function syncMeditationSessions() {
    try {
        const meditationData = await getOfflineData('meditation-sessions');
        if (meditationData.length > 0) {
            await fetch('/api/sync-meditation.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessions: meditationData })
            });
            await clearOfflineData('meditation-sessions');
            console.log('🧘 Meditation sessions synced successfully');
        }
    } catch (error) {
        console.log('❌ Failed to sync meditation sessions:', error);
    }
}

// Offline data management utilities
async function getOfflineData(type) {
    try {
        const data = localStorage.getItem(`divine-temple-offline-${type}`);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading offline data:', error);
        return [];
    }
}

async function clearOfflineData(type) {
    try {
        localStorage.removeItem(`divine-temple-offline-${type}`);
    } catch (error) {
        console.error('Error clearing offline data:', error);
    }
}

// Periodic background sync for daily spiritual reminders
self.addEventListener('periodicsync', event => {
    if (event.tag === 'daily-spiritual-reminder') {
        event.waitUntil(sendDailySpiritualReminder());
    }
});

async function sendDailySpiritualReminder() {
    const lastReminder = localStorage.getItem('last-spiritual-reminder');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (!lastReminder || (now - parseInt(lastReminder)) > oneDay) {
        await self.registration.showNotification('Daily Spiritual Practice 🙏', {
            body: 'Your daily spiritual journey awaits. Take a moment to connect with your divine nature.',
            icon: '/icons/temple-icon-192.png',
            badge: '/icons/temple-badge-72.png',
            tag: 'daily-reminder',
            data: { url: '/members-new.html' },
            actions: [
                { action: 'practice', title: '🌟 Start Practice', icon: '/icons/action-practice.png' },
                { action: 'later', title: '⏰ Remind Later', icon: '/icons/action-later.png' }
            ]
        });
        
        localStorage.setItem('last-spiritual-reminder', now.toString());
    }
}

console.log('🏛️ Divine Temple Service Worker Phase 8 - PWA Excellence fully loaded! ✨');

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('🌟 Divine Temple Service Worker Loaded Successfully');