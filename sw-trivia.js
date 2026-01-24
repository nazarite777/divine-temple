/**
 * Service Worker for Premium Consciousness Trivia PWA
 * Provides offline functionality, caching, and push notifications
 */

const CACHE_NAME = 'consciousness-trivia-v1.0.0';
const STATIC_CACHE_NAME = 'trivia-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'trivia-dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
    '/sections/daily-trivia-PREMIUM.html',
    '/js/daily-trivia-PREMIUM.js',
    '/js/pwa-handler.js',
    '/manifest-trivia.json',
    '/css/performance-optimized.css',
    '/images/icons/icon-192.png',
    '/images/icons/icon-512.png',
    // Fonts
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
    // Core offline page
    '/offline.html'
];

// Resources to cache dynamically
const DYNAMIC_CACHE_URLS = [
    '/sections/',
    '/js/',
    '/css/',
    '/images/'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
    '/api/',
    '/auth/',
    '/firebase'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        (async () => {
            try {
                const staticCache = await caches.open(STATIC_CACHE_NAME);
                await staticCache.addAll(STATIC_ASSETS);
                console.log('Static assets cached successfully');
                
                // Skip waiting to activate immediately
                self.skipWaiting();
            } catch (error) {
                console.error('Error during install:', error);
            }
        })()
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    
    event.waitUntil(
        (async () => {
            try {
                // Clean up old caches
                const cacheNames = await caches.keys();
                const deletePromises = cacheNames
                    .filter(name => name !== STATIC_CACHE_NAME && name !== DYNAMIC_CACHE_NAME)
                    .map(name => caches.delete(name));
                
                await Promise.all(deletePromises);
                console.log('Old caches cleaned up');
                
                // Take control of all clients immediately
                self.clients.claim();
            } catch (error) {
                console.error('Error during activation:', error);
            }
        })()
    );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(handleFetch(request));
});

// Main fetch handling logic
async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Network-first strategy for API calls
        if (NETWORK_FIRST.some(path => url.pathname.startsWith(path))) {
            return await networkFirst(request);
        }
        
        // Cache-first strategy for static assets
        if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset.split('/').pop()))) {
            return await cacheFirst(request);
        }
        
        // Stale-while-revalidate for HTML pages and dynamic content
        if (request.destination === 'document' || DYNAMIC_CACHE_URLS.some(path => url.pathname.startsWith(path))) {
            return await staleWhileRevalidate(request);
        }
        
        // Default to network with cache fallback
        return await networkWithCacheFallback(request);
        
    } catch (error) {
        console.error('Fetch error:', error);
        return await handleOfflineRequest(request);
    }
}

// Cache-first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    await cacheResponse(request, networkResponse.clone(), STATIC_CACHE_NAME);
    return networkResponse;
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE_NAME);
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // Fetch from network in background
    const fetchPromise = fetch(request).then(async (networkResponse) => {
        await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE_NAME);
        return networkResponse;
    }).catch(() => null);
    
    // Return cached response immediately if available
    if (cachedResponse) {
        // Update cache in background
        fetchPromise.catch(() => {});
        return cachedResponse;
    }
    
    // If no cache, wait for network
    const networkResponse = await fetchPromise;
    if (networkResponse) {
        return networkResponse;
    }
    
    throw new Error('No cached response and network failed');
}

// Network with cache fallback
async function networkWithCacheFallback(request) {
    try {
        const networkResponse = await fetch(request);
        await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE_NAME);
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Cache response helper
async function cacheResponse(request, response, cacheName) {
    // Only cache successful responses
    if (response.status === 200) {
        const cache = await caches.open(cacheName);
        await cache.put(request, response);
    }
}

// Handle offline requests
async function handleOfflineRequest(request) {
    const url = new URL(request.url);
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // For HTML pages, return offline page
    if (request.destination === 'document') {
        const offlinePage = await caches.match('/offline.html');
        if (offlinePage) {
            return offlinePage;
        }
    }
    
    // For images, return a placeholder
    if (request.destination === 'image') {
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#1a1a2e"/><text x="100" y="100" text-anchor="middle" fill="#d4af37" font-family="Arial, sans-serif" font-size="14">Image Offline</text></svg>',
            {
                headers: { 'Content-Type': 'image/svg+xml' },
                status: 200
            }
        );
    }
    
    // Default offline response
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'This resource is not available offline'
        }),
        {
            headers: { 'Content-Type': 'application/json' },
            status: 503
        }
    );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'sync-trivia-progress') {
        event.waitUntil(syncTriviaProgress());
    }
});

// Sync trivia progress when back online
async function syncTriviaProgress() {
    try {
        // Get offline stored progress
        const offlineData = await getOfflineProgressData();
        
        if (offlineData.length > 0) {
            // Send to server
            const response = await fetch('/api/sync-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: offlineData })
            });
            
            if (response.ok) {
                // Clear offline data
                await clearOfflineProgressData();
                console.log('Progress synced successfully');
                
                // Notify all clients
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SYNC_SUCCESS',
                        message: 'Progress synced successfully'
                    });
                });
            }
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: 'New consciousness questions await your exploration!',
        icon: '/images/icons/icon-192.png',
        badge: '/images/icons/badge-72.png',
        data: {
            url: '/sections/daily-trivia-PREMIUM.html'
        },
        actions: [
            {
                action: 'start-quiz',
                title: 'Start Quiz',
                icon: '/images/icons/action-quiz.png'
            },
            {
                action: 'view-leaderboard',
                title: 'Leaderboard',
                icon: '/images/icons/action-leaderboard.png'
            }
        ],
        tag: 'trivia-reminder',
        renotify: true,
        requireInteraction: false
    };
    
    if (event.data) {
        try {
            const payload = event.data.json();
            options.body = payload.body || options.body;
            options.data = { ...options.data, ...payload.data };
        } catch (error) {
            console.error('Error parsing push payload:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification('🧠 Consciousness Trivia', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const action = event.action;
    const data = event.notification.data;
    
    event.waitUntil(
        (async () => {
            const clients = await self.clients.matchAll({ type: 'window' });
            
            // Check if app is already open
            for (const client of clients) {
                if (client.url.includes('daily-trivia-PREMIUM')) {
                    client.focus();
                    
                    // Send action to the client
                    if (action) {
                        client.postMessage({
                            type: 'NOTIFICATION_ACTION',
                            action: action
                        });
                    }
                    return;
                }
            }
            
            // Open new window
            let url = data?.url || '/sections/daily-trivia-PREMIUM.html';
            if (action === 'view-leaderboard') {
                url += '?view=leaderboard';
            }
            
            await self.clients.openWindow(url);
        })()
    );
});

// Helper functions for offline data management
async function getOfflineProgressData() {
    // This would interact with IndexedDB in a real implementation
    return [];
}

async function clearOfflineProgressData() {
    // This would clear IndexedDB data in a real implementation
}

// Message handling from clients
self.addEventListener('message', (event) => {
    const { data } = event;
    
    if (data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (data.type === 'CACHE_TRIVIA_DATA') {
        event.waitUntil(
            cacheResponse(
                new Request(data.url),
                new Response(JSON.stringify(data.payload)),
                DYNAMIC_CACHE_NAME
            )
        );
    }
});