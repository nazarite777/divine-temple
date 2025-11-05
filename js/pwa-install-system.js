/**
 * 📱 Divine Temple PWA Installation System
 *
 * Features:
 * - Install prompt management
 * - Add to Home Screen functionality
 * - App installation detection
 * - Install banner/modal
 * - iOS-specific instructions
 * - Update notifications
 * - Offline mode detection
 * - App launch tracking
 */

class PWAInstallSystem {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = this.checkIfInstalled();
        this.isStandalone = this.checkIfStandalone();
        this.isIOS = this.checkIfIOS();
        this.updateAvailable = false;
        this.init();
    }

    init() {
        console.log('📱 PWA Install System initialized');

        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log('Install prompt captured');

            // Show install banner if not already installed
            if (!this.isInstalled && !this.isStandalone) {
                setTimeout(() => {
                    this.showInstallBanner();
                }, 3000); // Show after 3 seconds
            }
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.isInstalled = true;
            this.hideInstallBanner();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(50, 'Installed Divine Temple app! 📱', 'pwa');
            }

            this.showInstallSuccessMessage();
        });

        // Check for updates
        this.checkForUpdates();

        // Listen for online/offline status
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Track app launch
        if (this.isStandalone) {
            this.trackAppLaunch();
        }

        // Show iOS install instructions if on iOS
        if (this.isIOS && !this.isStandalone) {
            setTimeout(() => {
                this.showIOSInstructions();
            }, 5000);
        }
    }

    checkIfInstalled() {
        // Check if already installed
        const installed = localStorage.getItem('pwa_installed');
        return installed === 'true';
    }

    checkIfStandalone() {
        // Check if running as standalone app
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }

    checkIfIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('No install prompt available');
            return { success: false, message: 'Installation not available' };
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user's response
        const result = await this.deferredPrompt.userChoice;

        if (result.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            localStorage.setItem('pwa_installed', 'true');
            this.deferredPrompt = null;

            return { success: true, message: 'Installation started' };
        } else {
            console.log('User dismissed the install prompt');

            // Track dismissal
            const dismissCount = parseInt(localStorage.getItem('install_dismiss_count') || '0');
            localStorage.setItem('install_dismiss_count', (dismissCount + 1).toString());

            return { success: false, message: 'Installation cancelled' };
        }
    }

    showInstallBanner() {
        // Don't show if dismissed more than 3 times
        const dismissCount = parseInt(localStorage.getItem('install_dismiss_count') || '0');
        if (dismissCount >= 3) {
            return;
        }

        const banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.id = 'pwaInstallBanner';
        banner.innerHTML = `
            <div class="install-banner-content">
                <div class="install-icon">📱</div>
                <div class="install-text">
                    <h4>Install Divine Temple</h4>
                    <p>Get the full app experience with offline access</p>
                </div>
                <button onclick="window.pwaInstallSystem.handleInstallClick()" class="install-btn">
                    Install
                </button>
                <button onclick="window.pwaInstallSystem.dismissInstallBanner()" class="dismiss-btn">
                    ✕
                </button>
            </div>
        `;

        this.addInstallStyles();
        document.body.appendChild(banner);

        // Animate in
        setTimeout(() => banner.classList.add('show'), 100);
    }

    async handleInstallClick() {
        const result = await this.promptInstall();

        if (result.success) {
            this.hideInstallBanner();
        }
    }

    dismissInstallBanner() {
        this.hideInstallBanner();

        const dismissCount = parseInt(localStorage.getItem('install_dismiss_count') || '0');
        localStorage.setItem('install_dismiss_count', (dismissCount + 1).toString());
    }

    hideInstallBanner() {
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    showInstallSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'install-success-message';
        message.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <div class="success-text">
                    <h4>App Installed Successfully!</h4>
                    <p>Divine Temple is now on your home screen</p>
                    <p class="success-xp">+50 XP</p>
                </div>
            </div>
        `;

        document.body.appendChild(message);

        setTimeout(() => message.remove(), 5000);
    }

    showIOSInstructions() {
        const modal = document.createElement('div');
        modal.className = 'ios-install-modal';
        modal.id = 'iosInstallModal';
        modal.innerHTML = `
            <div class="ios-modal-content">
                <div class="ios-modal-header">
                    <h3>📱 Install Divine Temple</h3>
                    <button onclick="document.getElementById('iosInstallModal').remove()" class="modal-close">✕</button>
                </div>
                <div class="ios-modal-body">
                    <p>To install Divine Temple on your iPhone or iPad:</p>
                    <ol class="ios-instructions">
                        <li>
                            <span class="instruction-icon">1️⃣</span>
                            <span>Tap the Share button <span class="ios-icon">⎋</span> in Safari</span>
                        </li>
                        <li>
                            <span class="instruction-icon">2️⃣</span>
                            <span>Scroll down and tap "Add to Home Screen" <span class="ios-icon">➕</span></span>
                        </li>
                        <li>
                            <span class="instruction-icon">3️⃣</span>
                            <span>Tap "Add" in the top right corner</span>
                        </li>
                    </ol>
                    <p class="ios-note">The app icon will appear on your home screen!</p>
                </div>
                <div class="ios-modal-footer">
                    <button onclick="document.getElementById('iosInstallModal').remove(); localStorage.setItem('ios_install_shown', 'true');" class="ios-got-it-btn">
                        Got it!
                    </button>
                </div>
            </div>
        `;

        this.addInstallStyles();
        document.body.appendChild(modal);

        // Don't show again if user dismisses
        const shown = localStorage.getItem('ios_install_shown');
        if (shown === 'true') {
            return;
        }
    }

    async checkForUpdates() {
        if (!('serviceWorker' in navigator)) {
            return;
        }

        try {
            const registration = await navigator.serviceWorker.getRegistration();

            if (!registration) {
                return;
            }

            // Check for updates every hour
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000);

            // Listen for update found
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available
                        this.updateAvailable = true;
                        this.showUpdateNotification();
                    }
                });
            });

        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.id = 'updateNotification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-icon">🔄</div>
                <div class="update-text">
                    <h4>Update Available</h4>
                    <p>A new version of Divine Temple is ready</p>
                </div>
                <button onclick="window.pwaInstallSystem.applyUpdate()" class="update-btn">
                    Update Now
                </button>
                <button onclick="document.getElementById('updateNotification').remove()" class="later-btn">
                    Later
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-show for 30 seconds
        setTimeout(() => {
            if (document.getElementById('updateNotification')) {
                document.getElementById('updateNotification').classList.add('show');
            }
        }, 100);
    }

    async applyUpdate() {
        if (!('serviceWorker' in navigator)) {
            return;
        }

        try {
            const registration = await navigator.serviceWorker.getRegistration();

            if (registration && registration.waiting) {
                // Tell the waiting service worker to activate
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });

                // Reload the page
                window.location.reload();
            }
        } catch (error) {
            console.error('Error applying update:', error);
        }
    }

    handleOnline() {
        console.log('App is online');

        const notification = document.createElement('div');
        notification.className = 'network-notification online';
        notification.textContent = '✅ Back online';

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    handleOffline() {
        console.log('App is offline');

        const notification = document.createElement('div');
        notification.className = 'network-notification offline';
        notification.textContent = '⚠️ You are offline - Some features may be limited';

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 5000);
    }

    trackAppLaunch() {
        const launches = parseInt(localStorage.getItem('app_launches') || '0');
        const newLaunches = launches + 1;
        localStorage.setItem('app_launches', newLaunches.toString());

        console.log(`App launched ${newLaunches} times`);

        // Award XP for milestones
        if (window.progressSystem) {
            if (newLaunches === 1) {
                window.progressSystem.awardXP(20, 'First app launch! 🚀', 'pwa');
            } else if (newLaunches === 10) {
                window.progressSystem.awardXP(50, '10 app launches! Dedicated! 🎯', 'pwa');
            } else if (newLaunches === 50) {
                window.progressSystem.awardXP(100, '50 app launches! True devotee! 🙏', 'pwa');
            } else if (newLaunches === 100) {
                window.progressSystem.awardXP(200, '100 app launches! Spiritual warrior! ⚔️', 'pwa');
            }
        }
    }

    getInstallStats() {
        return {
            isInstalled: this.isInstalled,
            isStandalone: this.isStandalone,
            isIOS: this.isIOS,
            launches: parseInt(localStorage.getItem('app_launches') || '0'),
            dismissCount: parseInt(localStorage.getItem('install_dismiss_count') || '0'),
            updateAvailable: this.updateAvailable
        };
    }

    openInstallModal() {
        const modal = document.createElement('div');
        modal.className = 'install-info-modal';
        modal.id = 'installInfoModal';

        const stats = this.getInstallStats();

        modal.innerHTML = `
            <div class="install-modal-content">
                <div class="install-modal-header">
                    <h2>📱 Install App</h2>
                    <button onclick="document.getElementById('installInfoModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="install-modal-body">
                    ${stats.isStandalone ? `
                        <div class="install-status installed">
                            <div class="status-icon">✅</div>
                            <h3>App Installed</h3>
                            <p>You're using the installed version</p>
                        </div>

                        <div class="app-stats">
                            <h4>📊 App Statistics</h4>
                            <div class="stat-grid">
                                <div class="stat-item">
                                    <div class="stat-value">${stats.launches}</div>
                                    <div class="stat-label">App Launches</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">${stats.updateAvailable ? 'Yes' : 'No'}</div>
                                    <div class="stat-label">Update Available</div>
                                </div>
                            </div>
                        </div>

                        ${stats.updateAvailable ? `
                            <button onclick="window.pwaInstallSystem.applyUpdate()" class="update-now-btn">
                                🔄 Update Now
                            </button>
                        ` : ''}
                    ` : `
                        <div class="install-benefits">
                            <h3>✨ Benefits of Installing</h3>
                            <ul class="benefits-list">
                                <li>📴 <strong>Offline Access</strong> - Use anywhere, anytime</li>
                                <li>⚡ <strong>Faster Loading</strong> - Instant app launch</li>
                                <li>🔔 <strong>Push Notifications</strong> - Stay connected</li>
                                <li>🎯 <strong>Full Screen Mode</strong> - Immersive experience</li>
                                <li>💾 <strong>Less Data Usage</strong> - Cached resources</li>
                                <li>🏠 <strong>Home Screen Icon</strong> - Quick access</li>
                            </ul>
                        </div>

                        ${this.isIOS ? `
                            <div class="ios-install-section">
                                <h4>iOS Installation</h4>
                                <button onclick="window.pwaInstallSystem.showIOSInstructions()" class="ios-instructions-btn">
                                    📱 View Instructions
                                </button>
                            </div>
                        ` : this.deferredPrompt ? `
                            <button onclick="window.pwaInstallSystem.handleInstallClick(); document.getElementById('installInfoModal').remove();" class="install-now-btn">
                                📥 Install Now
                            </button>
                        ` : `
                            <div class="install-note">
                                <p>Installation is available in supported browsers</p>
                            </div>
                        `}
                    `}
                </div>
            </div>
        `;

        this.addInstallStyles();
        document.body.appendChild(modal);
    }

    addInstallStyles() {
        if (document.getElementById('pwaInstallStyles')) return;

        const style = document.createElement('style');
        style.id = 'pwaInstallStyles';
        style.textContent = `
            .pwa-install-banner {
                position: fixed;
                bottom: -100px;
                left: 20px;
                right: 20px;
                max-width: 600px;
                margin: 0 auto;
                z-index: 9999;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                transition: bottom 0.3s ease;
            }

            .pwa-install-banner.show {
                bottom: 20px;
            }

            .install-banner-content {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px;
                color: white;
            }

            .install-icon {
                font-size: 40px;
                flex-shrink: 0;
            }

            .install-text {
                flex: 1;
            }

            .install-text h4 {
                margin: 0 0 5px 0;
                font-size: 16px;
            }

            .install-text p {
                margin: 0;
                font-size: 13px;
                opacity: 0.95;
            }

            .install-btn, .dismiss-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                transition: transform 0.2s;
            }

            .install-btn {
                background: white;
                color: #667eea;
            }

            .install-btn:hover {
                transform: scale(1.05);
            }

            .dismiss-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                width: 32px;
                height: 32px;
                padding: 0;
            }

            .install-success-message {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
            }

            .success-content {
                display: flex;
                gap: 15px;
                align-items: center;
            }

            .success-icon {
                font-size: 40px;
            }

            .success-text h4 {
                margin: 0 0 5px 0;
            }

            .success-text p {
                margin: 3px 0;
                opacity: 0.95;
            }

            .success-xp {
                font-weight: bold;
                font-size: 16px;
            }

            .ios-install-modal {
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

            .ios-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                overflow: hidden;
            }

            .ios-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .ios-modal-header h3 {
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

            .ios-modal-body {
                padding: 30px;
            }

            .ios-instructions {
                list-style: none;
                padding: 0;
                margin: 20px 0;
            }

            .ios-instructions li {
                display: flex;
                align-items: flex-start;
                gap: 15px;
                padding: 15px;
                background: #f9f9f9;
                border-radius: 10px;
                margin-bottom: 15px;
            }

            .instruction-icon {
                font-size: 24px;
            }

            .ios-icon {
                display: inline-block;
                padding: 2px 8px;
                background: #667eea;
                color: white;
                border-radius: 5px;
                font-weight: bold;
                margin: 0 5px;
            }

            .ios-note {
                text-align: center;
                font-style: italic;
                color: #666;
                margin-top: 20px;
            }

            .ios-modal-footer {
                padding: 20px;
                background: #f9f9f9;
                text-align: center;
            }

            .ios-got-it-btn {
                padding: 12px 40px;
                border: none;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
            }

            .update-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
                max-width: 400px;
            }

            .update-content {
                display: flex;
                gap: 15px;
                align-items: center;
            }

            .update-icon {
                font-size: 40px;
            }

            .update-text {
                flex: 1;
            }

            .update-text h4 {
                margin: 0 0 5px 0;
            }

            .update-text p {
                margin: 0;
                opacity: 0.95;
            }

            .update-btn, .later-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 13px;
                margin-top: 10px;
            }

            .update-btn {
                background: white;
                color: #f5576c;
            }

            .later-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                margin-left: 8px;
            }

            .network-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                padding: 15px 25px;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                animation: slideInRight 0.5s ease;
            }

            .network-notification.online {
                background: #10b981;
            }

            .network-notification.offline {
                background: #ef4444;
            }

            .install-info-modal {
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
            }

            .install-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .install-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .install-modal-header h2 {
                margin: 0;
            }

            .install-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
            }

            .install-status {
                text-align: center;
                padding: 30px;
                background: #f0fdf4;
                border-radius: 15px;
                margin-bottom: 30px;
            }

            .status-icon {
                font-size: 64px;
                margin-bottom: 15px;
            }

            .install-status h3 {
                margin: 0 0 10px 0;
                color: #10b981;
            }

            .install-status p {
                margin: 0;
                color: #666;
            }

            .app-stats {
                margin-bottom: 30px;
            }

            .app-stats h4 {
                margin: 0 0 20px 0;
            }

            .stat-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            }

            .stat-item {
                text-align: center;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 10px;
            }

            .stat-value {
                font-size: 32px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .stat-label {
                font-size: 13px;
                color: #666;
                margin-top: 5px;
            }

            .install-benefits {
                margin-bottom: 30px;
            }

            .install-benefits h3 {
                margin: 0 0 20px 0;
            }

            .benefits-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .benefits-list li {
                padding: 15px;
                background: #f9f9f9;
                border-radius: 10px;
                margin-bottom: 10px;
            }

            .install-now-btn, .update-now-btn, .ios-instructions-btn {
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .install-now-btn:hover, .update-now-btn:hover, .ios-instructions-btn:hover {
                transform: translateY(-2px);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .pwa-install-banner {
                    left: 10px;
                    right: 10px;
                }

                .install-banner-content {
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Initialize the PWA install system
if (typeof window !== 'undefined') {
    window.pwaInstallSystem = new PWAInstallSystem();
    console.log('📱 PWA Install System ready!');
}
