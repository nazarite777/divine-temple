/**
 * Divine Temple Service Worker
 * Sacred caching for offline spiritual practice
 */

const CACHE_NAME = 'divine-temple-v1.0';
const STATIC_CACHE = 'divine-temple-static-v1.0';
const DYNAMIC_CACHE = 'divine-temple-dynamic-v1.0';

// Resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/members-new.html',
    '/register.html',
    '/verify-email.html',
    '/sections/spiritual-tools.html',
    '/sections/meditation-corner.html',
    '/sections/astrology-insights.html',
    '/sections/chakra-alignment.html',
    '/sections/dream-journal.html',
    '/sections/manifestation-board.html',
    '/js/performance.js',
    '/api/auth.php',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('🌟 Divine Temple Service Worker Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Caching static assets for offline spiritual practice');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✨ Divine Temple Service Worker Installed Successfully');
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
                    icon: '/icons/temple-action.png'
                },
                {
                    action: 'close',
                    title: '✨ Later',
                    icon: '/icons/close-action.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification('Divine Temple', options)
        );
    }
});

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