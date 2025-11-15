/**
 * PWA Handler for Premium Consciousness Trivia
 * Handles installation prompts, service worker registration, and offline capabilities
 */

class PWAHandler {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    async init() {
        // Register service worker
        await this.registerServiceWorker();
        
        // Setup installation handling
        this.setupInstallPrompt();
        
        // Monitor online/offline status
        this.setupNetworkMonitoring();
        
        // Check if running as PWA
        this.checkPWAMode();
        
        // Setup PWA-specific UI
        this.setupPWAUI();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw-trivia.js', {
                    scope: '/'
                });
                
                console.log('Service Worker registered successfully:', registration);
                
                // Listen for service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallBanner();
        });

        // Handle install button click
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installApp();
            });
        }

        // Handle dismiss button
        const dismissBtn = document.getElementById('dismissInstall');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                this.dismissInstallBanner();
            });
        }

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed successfully');
            this.isInstalled = true;
            this.hideInstallBanner();
            this.showInstallSuccessMessage();
        });
    }

    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateNetworkStatus();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateNetworkStatus();
        });

        this.updateNetworkStatus();
    }

    checkPWAMode() {
        // Check if running in standalone mode (installed as PWA)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isIOSStandalone = window.navigator.standalone === true;

        if (isStandalone || isIOSStandalone) {
            document.body.classList.add('pwa-mode');
            this.setupPWANavigation();
        }
    }

    setupPWAUI() {
        // Add PWA status indicator
        this.createStatusIndicator();
        
        // Add app-like header for PWA mode
        this.createPWAHeader();
        
        // Setup gesture navigation for mobile
        this.setupGestureNavigation();
    }

    showInstallBanner() {
        const banner = document.getElementById('installBanner');
        if (banner && !this.isInstalled) {
            banner.style.display = 'block';
        }
    }

    hideInstallBanner() {
        const banner = document.getElementById('installBanner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    dismissInstallBanner() {
        this.hideInstallBanner();
        // Remember user dismissed it
        localStorage.setItem('installBannerDismissed', Date.now().toString());
    }

    async installApp() {
        if (!this.deferredPrompt) return;

        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for user response
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        this.deferredPrompt = null;
    }

    updateNetworkStatus() {
        const offlineIndicator = document.getElementById('offlineIndicator');
        const statusIndicator = document.querySelector('.pwa-status');
        
        if (this.isOnline) {
            if (offlineIndicator) offlineIndicator.style.display = 'none';
            if (statusIndicator) {
                statusIndicator.textContent = '🟢 Online';
                statusIndicator.className = 'pwa-status online';
            }
        } else {
            if (offlineIndicator) offlineIndicator.style.display = 'block';
            if (statusIndicator) {
                statusIndicator.textContent = '🔴 Offline';
                statusIndicator.className = 'pwa-status offline';
            }
        }
    }

    createStatusIndicator() {
        if (document.querySelector('.pwa-status')) return;
        
        const indicator = document.createElement('div');
        indicator.className = this.isOnline ? 'pwa-status online' : 'pwa-status offline';
        indicator.textContent = this.isOnline ? '🟢 Online' : '🔴 Offline';
        document.body.appendChild(indicator);
    }

    createPWAHeader() {
        // Create app-like header for standalone mode
        const header = document.createElement('div');
        header.className = 'pwa-header';
        header.innerHTML = `
            <div class="pwa-title">🧠 Consciousness Trivia</div>
            <div class="pwa-actions">
                <button class="pwa-btn" id="syncBtn" title="Sync Progress">
                    <span>🔄</span>
                </button>
                <button class="pwa-btn" id="settingsBtn" title="Settings">
                    <span>⚙️</span>
                </button>
            </div>
        `;
        
        // Insert at beginning of container
        const container = document.querySelector('.premium-container');
        if (container) {
            container.insertBefore(header, container.firstChild);
        }

        // Add functionality to buttons
        document.getElementById('syncBtn')?.addEventListener('click', () => {
            this.syncProgress();
        });

        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });
    }

    setupPWANavigation() {
        // Add swipe gestures for navigation in PWA mode
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!e.changedTouches.length) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Swipe right to go back (only in PWA mode)
            if (deltaX > 50 && Math.abs(deltaY) < 50) {
                if (window.premiumTrivia && typeof window.premiumTrivia.showDashboard === 'function') {
                    window.premiumTrivia.showDashboard();
                }
            }
        });
    }

    setupGestureNavigation() {
        // Pull-to-refresh functionality
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        let refreshing = false;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0 && !refreshing) {
                startY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (startY && window.scrollY === 0 && !refreshing) {
                currentY = e.touches[0].clientY;
                pullDistance = currentY - startY;

                if (pullDistance > 0) {
                    e.preventDefault();
                    // Visual feedback for pull-to-refresh
                    this.showPullToRefreshIndicator(pullDistance);
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (pullDistance > 100 && !refreshing) {
                this.triggerRefresh();
            }
            this.hidePullToRefreshIndicator();
            startY = 0;
            pullDistance = 0;
        });
    }

    showPullToRefreshIndicator(distance) {
        let indicator = document.getElementById('pullRefreshIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pullRefreshIndicator';
            indicator.style.cssText = `
                position: fixed;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 25px;
                padding: 1rem 2rem;
                color: var(--primary-gold);
                font-weight: 600;
                z-index: 2000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }

        const progress = Math.min(distance / 100, 1);
        indicator.style.top = `${Math.max(-50 + (distance * 0.5), -50)}px`;
        indicator.textContent = progress >= 1 ? '🔄 Release to refresh' : '⬇️ Pull to refresh';
        indicator.style.opacity = Math.min(progress, 1);
    }

    hidePullToRefreshIndicator() {
        const indicator = document.getElementById('pullRefreshIndicator');
        if (indicator) {
            indicator.style.top = '-50px';
            indicator.style.opacity = '0';
        }
    }

    async triggerRefresh() {
        console.log('Refreshing trivia data...');
        this.showRefreshingIndicator();
        
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update trivia system if available
        if (window.premiumTrivia) {
            window.premiumTrivia.updateStats();
        }
        
        this.hideRefreshingIndicator();
    }

    showRefreshingIndicator() {
        let indicator = document.getElementById('pullRefreshIndicator');
        if (indicator) {
            indicator.textContent = '🔄 Refreshing...';
            indicator.style.top = '20px';
            indicator.style.opacity = '1';
        }
    }

    hideRefreshingIndicator() {
        setTimeout(() => {
            const indicator = document.getElementById('pullRefreshIndicator');
            if (indicator) {
                indicator.style.top = '-50px';
                indicator.style.opacity = '0';
            }
        }, 1000);
    }

    async syncProgress() {
        console.log('Syncing progress...');
        // Implement progress synchronization with server
        const button = document.getElementById('syncBtn');
        if (button) {
            button.innerHTML = '<span>⏳</span>';
            await new Promise(resolve => setTimeout(resolve, 2000));
            button.innerHTML = '<span>✅</span>';
            setTimeout(() => {
                button.innerHTML = '<span>🔄</span>';
            }, 2000);
        }
    }

    showSettings() {
        console.log('Opening PWA settings...');
        // Implement settings modal
        this.createSettingsModal();
    }

    createSettingsModal() {
        // Remove existing modal
        const existing = document.getElementById('pwaSettingsModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'pwaSettingsModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            z-index: 3000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        modal.innerHTML = `
            <div style="
                background: var(--glass-bg);
                backdrop-filter: blur(30px);
                border: 2px solid var(--primary-gold);
                border-radius: 25px;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                text-align: center;
            ">
                <h3 style="color: var(--primary-gold); margin-bottom: 1.5rem;">⚙️ PWA Settings</h3>
                
                <div style="text-align: left; margin-bottom: 1.5rem;">
                    <label style="display: flex; align-items: center; margin-bottom: 1rem; cursor: pointer;">
                        <input type="checkbox" id="notifications" style="margin-right: 0.75rem;">
                        <span>Enable daily reminders</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; margin-bottom: 1rem; cursor: pointer;">
                        <input type="checkbox" id="offline" checked style="margin-right: 0.75rem;">
                        <span>Enable offline mode</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; margin-bottom: 1rem; cursor: pointer;">
                        <input type="checkbox" id="analytics" style="margin-right: 0.75rem;">
                        <span>Share usage analytics</span>
                    </label>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button id="saveSettings" style="
                        background: var(--gradient-primary);
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 15px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                    ">Save</button>
                    
                    <button id="closeSettings" style="
                        background: transparent;
                        border: 1px solid var(--glass-border);
                        padding: 0.75rem 1.5rem;
                        border-radius: 15px;
                        color: var(--text-primary);
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
            modal.remove();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            modal.remove();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    saveSettings() {
        const settings = {
            notifications: document.getElementById('notifications')?.checked || false,
            offline: document.getElementById('offline')?.checked || true,
            analytics: document.getElementById('analytics')?.checked || false
        };

        localStorage.setItem('pwaSettings', JSON.stringify(settings));
        console.log('PWA settings saved:', settings);

        // Request notification permission if enabled
        if (settings.notifications && 'Notification' in window) {
            Notification.requestPermission();
        }
    }

    showUpdateNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Consciousness Trivia Updated!', {
                body: 'New questions and features available. Restart the app to update.',
                icon: '/images/icons/icon-192.png',
                tag: 'app-update'
            });
        }
    }

    showInstallSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--gradient-primary);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 20px;
            font-weight: 600;
            z-index: 4000;
            text-align: center;
        `;
        message.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
            <div>Consciousness Trivia Installed!</div>
            <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.5rem;">
                Access it from your home screen
            </div>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwaHandler = new PWAHandler();
});

// Export for potential external use
window.PWAHandler = PWAHandler;