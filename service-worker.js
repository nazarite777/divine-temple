/**
 * 🔧 Divine Temple Service Worker
 *
 * Handles:
 * - Push notifications
 * - Background sync
 * - Offline caching (for PWA)
 * - Notification click handling
 */

const CACHE_NAME = 'divine-temple-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/css/styles.css',
    '/js/firebase-config.js',
    '/js/universal-progress-system.js',
    '/img/logo-192x192.png',
    '/img/logo-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received');

    let data = {
        title: 'Divine Temple',
        body: 'You have a new notification',
        icon: '/img/logo-192x192.png',
        badge: '/img/badge-icon.png',
        tag: 'default',
        data: {}
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/img/logo-192x192.png',
        badge: data.badge || '/img/badge-icon.png',
        tag: data.tag || 'default',
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
        vibrate: data.vibrate || [200, 100, 200],
        data: data.data || {},
        actions: data.actions || []
    };

    // Add default actions based on notification type
    if (data.data && data.data.type) {
        switch (data.data.type) {
            case 'achievement':
                options.actions = [
                    { action: 'view', title: 'View Achievement', icon: '/img/view-icon.png' },
                    { action: 'share', title: 'Share', icon: '/img/share-icon.png' }
                ];
                break;
            case 'quest':
                options.actions = [
                    { action: 'complete', title: 'Complete Now', icon: '/img/check-icon.png' },
                    { action: 'later', title: 'Later', icon: '/img/later-icon.png' }
                ];
                break;
            case 'friend-activity':
                options.actions = [
                    { action: 'view', title: 'View Profile', icon: '/img/profile-icon.png' }
                ];
                break;
            case 'circle-message':
                options.actions = [
                    { action: 'reply', title: 'Reply', icon: '/img/reply-icon.png' },
                    { action: 'view', title: 'View', icon: '/img/view-icon.png' }
                ];
                break;
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event.action);

    event.notification.close();

    const data = event.notification.data || {};
    let url = '/dashboard.html';

    // Determine URL based on notification type and action
    if (event.action === 'view') {
        switch (data.type) {
            case 'achievement':
                url = '/dashboard.html#achievements';
                break;
            case 'friend-activity':
                url = '/dashboard.html#friends';
                break;
            case 'circle-message':
                url = '/dashboard.html#circles';
                break;
            case 'leaderboard':
                url = '/dashboard.html#leaderboards';
                break;
            default:
                url = '/dashboard.html';
        }
    } else if (event.action === 'complete') {
        if (data.type === 'quest') {
            url = '/dashboard.html#quests';
        }
    } else if (event.action === 'share') {
        if (data.type === 'achievement') {
            // Open share dialog
            url = '/dashboard.html#share?achievement=' + (data.id || '');
        }
    } else if (event.action === 'reply') {
        if (data.type === 'circle-message') {
            url = '/dashboard.html#circles?circle=' + (data.circleId || '');
        }
    } else {
        // Default action (clicking notification without action button)
        switch (data.type) {
            case 'achievement':
                url = '/dashboard.html#achievements';
                break;
            case 'quest':
            case 'daily-reminder':
                url = '/dashboard.html#quests';
                break;
            case 'friend-activity':
                url = '/dashboard.html#friends';
                break;
            case 'circle-message':
                url = '/dashboard.html#circles';
                break;
            case 'streak-reminder':
                url = '/dashboard.html';
                break;
            case 'leaderboard':
                url = '/dashboard.html#leaderboards';
                break;
            case 'level-up':
                url = '/dashboard.html#profile';
                break;
            default:
                url = '/dashboard.html';
        }
    }

    // Open or focus the app window
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then((clientList) => {
            // Check if there's already a window open
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }

            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

// Background sync event (for offline support)
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);

    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgressData());
    }
});

async function syncProgressData() {
    try {
        // Get pending progress updates from IndexedDB
        const pendingUpdates = await getPendingUpdates();

        if (pendingUpdates.length === 0) {
            return;
        }

        // Send updates to server
        for (const update of pendingUpdates) {
            await fetch('/api/sync-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update)
            });
        }

        // Clear pending updates
        await clearPendingUpdates();

        console.log('[Service Worker] Progress data synced successfully');
    } catch (error) {
        console.error('[Service Worker] Failed to sync progress data:', error);
    }
}

// Helper functions for IndexedDB
function getPendingUpdates() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('DivineTem pleDB', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('pendingUpdates')) {
                resolve([]);
                return;
            }

            const transaction = db.transaction(['pendingUpdates'], 'readonly');
            const store = transaction.objectStore('pendingUpdates');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result || []);
            };

            getAllRequest.onerror = () => {
                reject(getAllRequest.error);
            };
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

function clearPendingUpdates() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('DivineTempleDB', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('pendingUpdates')) {
                resolve();
                return;
            }

            const transaction = db.transaction(['pendingUpdates'], 'readwrite');
            const store = transaction.objectStore('pendingUpdates');
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                resolve();
            };

            clearRequest.onerror = () => {
                reject(clearRequest.error);
            };
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
});

console.log('[Service Worker] Loaded');
