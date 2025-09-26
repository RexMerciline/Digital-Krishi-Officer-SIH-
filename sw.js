/**
 * Service Worker for Farmer Query Chatbot
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'farmer-chatbot-v1.2';
const STATIC_CACHE = 'farmer-static-v1.2';
const DYNAMIC_CACHE = 'farmer-dynamic-v1.2';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css', 
    '/app.js',
    '/assets/government-schemes.json',
    '/assets/sample-data.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js'
];

// Dynamic assets (API responses, images)
const DYNAMIC_ASSETS = [
    '/api/',
    'https://api.openweathermap.org/',
    'https://api.data.gov.in/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch((error) => {
                console.error('Service Worker: Cache install failed', error);
            })
    );
    
    // Force activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Take control of all pages immediately
    return self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle static assets
    if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    return response || fetch(request);
                })
                .catch(() => {
                    // Return offline page for HTML requests
                    if (request.headers.get('accept').includes('text/html')) {
                        return caches.match('/index.html');
                    }
                })
        );
        return;
    }
    
    // Handle API requests with cache-first strategy for resilience
    if (url.pathname.includes('/api/') || DYNAMIC_ASSETS.some(asset => request.url.includes(asset))) {
        event.respondWith(
            caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                    return cache.match(request)
                        .then((response) => {
                            if (response) {
                                // Return cached response and update cache in background
                                fetch(request)
                                    .then((fetchResponse) => {
                                        if (fetchResponse.status === 200) {
                                            cache.put(request, fetchResponse.clone());
                                        }
                                    })
                                    .catch(() => {}); // Ignore fetch errors for background updates
                                
                                return response;
                            }
                            
                            // No cached response, try network
                            return fetch(request)
                                .then((fetchResponse) => {
                                    if (fetchResponse.status === 200) {
                                        cache.put(request, fetchResponse.clone());
                                    }
                                    return fetchResponse;
                                })
                                .catch(() => {
                                    // Network failed, return mock data if available
                                    return generateMockResponse(request);
                                });
                        });
                })
        );
        return;
    }
    
    // Default: network first, then cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone and cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then((cache) => {
                            cache.put(request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(request);
            })
    );
});

// Generate mock responses for offline API requests
function generateMockResponse(request) {
    const url = new URL(request.url);
    
    // Mock weather data
    if (url.pathname.includes('weather') || url.hostname.includes('openweathermap')) {
        const mockWeather = {
            list: [
                {
                    dt: Date.now() / 1000,
                    main: { temp: 25, humidity: 65, temp_min: 20, temp_max: 30 },
                    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
                    wind: { speed: 3.5 },
                    pop: 0.1
                }
            ],
            city: { name: 'Offline Location' }
        };
        
        return new Response(JSON.stringify(mockWeather), {
            status: 200,
            statusText: 'OK (Offline)',
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Mock market data
    if (url.pathname.includes('market') || url.pathname.includes('price')) {
        const mockMarket = {
            prices: [
                { commodity: 'Rice', price: 2450, change: 5.2, market: 'Delhi' },
                { commodity: 'Wheat', price: 2150, change: 3.8, market: 'Delhi' }
            ],
            timestamp: Date.now(),
            source: 'Offline Cache'
        };
        
        return new Response(JSON.stringify(mockMarket), {
            status: 200,
            statusText: 'OK (Offline)',
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Default offline response
    return new Response(JSON.stringify({
        error: 'Offline',
        message: 'This feature requires internet connection',
        cached_data_available: true
    }), {
        status: 503,
        statusText: 'Service Unavailable (Offline)',
        headers: { 'Content-Type': 'application/json' }
    });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'background-sync-chat') {
        event.waitUntil(syncChatMessages());
    }
    
    if (event.tag === 'background-sync-images') {
        event.waitUntil(syncImageAnalysis());
    }
});

// Sync offline chat messages when back online
async function syncChatMessages() {
    try {
        // Get offline messages from IndexedDB or localStorage
        const offlineMessages = JSON.parse(localStorage.getItem('offline-chat-messages') || '[]');
        
        for (const message of offlineMessages) {
            // Process each offline message
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
        }
        
        // Clear offline messages after successful sync
        localStorage.removeItem('offline-chat-messages');
        console.log('Service Worker: Chat messages synced successfully');
        
    } catch (error) {
        console.error('Service Worker: Failed to sync chat messages', error);
    }
}

// Sync offline image analysis when back online  
async function syncImageAnalysis() {
    try {
        // Get offline images from IndexedDB
        const offlineImages = JSON.parse(localStorage.getItem('offline-images') || '[]');
        
        for (const imageData of offlineImages) {
            // Process each offline image
            const formData = new FormData();
            formData.append('image', imageData.blob);
            
            await fetch('/api/analyze-image', {
                method: 'POST',
                body: formData
            });
        }
        
        // Clear offline images after successful sync
        localStorage.removeItem('offline-images');
        console.log('Service Worker: Images synced successfully');
        
    } catch (error) {
        console.error('Service Worker: Failed to sync images', error);
    }
}

// Push notifications (for future implementation)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received', event);
    
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'New farming update available',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/badge-72x72.png',
        tag: data.tag || 'farming-update',
        data: data.data || {},
        actions: [
            {
                action: 'view',
                title: 'View Update',
                icon: '/assets/action-view.png'
            },
            {
                action: 'dismiss', 
                title: 'Dismiss',
                icon: '/assets/action-dismiss.png'
            }
        ],
        requireInteraction: true,
        renotify: true
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Farmer Assistant', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        // Open the app
        event.waitUntil(
            self.clients.openWindow('/')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default click action
        event.waitUntil(
            self.clients.matchAll().then((clients) => {
                // Check if app is already open
                const client = clients.find(c => c.visibilityState === 'visible');
                if (client) {
                    client.focus();
                } else {
                    // Open new window
                    self.clients.openWindow('/');
                }
            })
        );
    }
});

// Message handling between SW and main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'CACHE_CLEAR':
                clearAllCaches();
                break;
                
            case 'CACHE_UPDATE':
                updateCache();
                break;
                
            case 'GET_CACHE_STATUS':
                getCacheStatus().then(status => {
                    event.ports[0].postMessage({ status });
                });
                break;
                
            default:
                console.log('Service Worker: Unknown message type', event.data.type);
        }
    }
});

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('Service Worker: All caches cleared');
}

// Update cache with latest assets
async function updateCache() {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS);
    console.log('Service Worker: Cache updated');
}

// Get cache status information
async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {
        caches: cacheNames.length,
        static_cache_exists: cacheNames.includes(STATIC_CACHE),
        dynamic_cache_exists: cacheNames.includes(DYNAMIC_CACHE),
        total_size: await getTotalCacheSize()
    };
    return status;
}

// Calculate total cache size
async function getTotalCacheSize() {
    let totalSize = 0;
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
    }
    
    return totalSize;
}

console.log('Service Worker: Loaded successfully');