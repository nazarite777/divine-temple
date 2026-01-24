/**
 * Enhanced PWA Install System
 * Handles cross-platform PWA installation with better browser support
 */

class EnhancedPWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isStandalone = this.checkStandaloneMode();
        this.supportsPWA = this.checkPWASupport();
        
        this.init();
    }
    
    init() {
        console.log('🚀 Enhanced PWA Installer initialized');
        console.log('📊 PWA Status:', {
            isInstalled: this.isInstalled,
            isStandalone: this.isStandalone,
            supportsPWA: this.supportsPWA,
            userAgent: navigator.userAgent
        });
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Register service worker
        this.registerServiceWorker();
        
        // Update UI based on install status with delay to ensure DOM is ready
        setTimeout(() => {
            this.updateInstallButtons();
        }, 100);
        
        // Force another check after DOM content loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    console.log('🔄 DOM loaded, re-checking buttons');
                    this.updateInstallButtons();
                }, 500);
            });
        }
    }
    
    checkStandaloneMode() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }
    
    checkPWASupport() {
        return 'serviceWorker' in navigator && 
               'PushManager' in window &&
               'Notification' in window;
    }
    
    setupEventListeners() {
        // Enhanced beforeinstallprompt handler
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 beforeinstallprompt event captured');
            e.preventDefault();
            this.deferredPrompt = e;
            this.updateInstallButtons();
            
            // Auto-show banner on supported browsers
            setTimeout(() => {
                this.maybeShowInstallBanner();
            }, 3000);
        });
        
        // App installed handler
        window.addEventListener('appinstalled', (evt) => {
            console.log('🎉 PWA was installed successfully');
            this.isInstalled = true;
            this.hideAllInstallElements();
            this.showInstallSuccessMessage();
            localStorage.setItem('pwa-installed', 'true');
        });
        
        // Visibility change handler for PWA detection
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Check if we're now in standalone mode
                const wasStandalone = this.isStandalone;
                this.isStandalone = this.checkStandaloneMode();
                
                if (!wasStandalone && this.isStandalone) {
                    console.log('🏛️ App launched in standalone mode');
                    this.hideAllInstallElements();
                }
            }
        });
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registered:', registration);
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    console.log('🔄 Service Worker update found');
                });
                
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }
    
    updateInstallButtons() {
        const buttons = document.querySelectorAll('[id*="nstallBtn"], [id*="manual"], .pwa-install-btn, .pwa-manual-btn');
        
        console.log('🔍 Found install buttons:', buttons.length);
        
        buttons.forEach((btn, index) => {
            if (!btn) return;
            
            console.log(`📱 Button ${index + 1}:`, {
                id: btn.id,
                class: btn.className,
                isStandalone: this.isStandalone,
                supportsPWA: this.supportsPWA
            });
            
            if (this.isStandalone) {
                // Already installed - hide button
                btn.classList.add('hidden');
                btn.style.display = 'none';
                console.log('✅ Already installed, hiding button');
            } else if (this.supportsPWA) {
                // PWA supported - show button
                btn.classList.remove('hidden');
                btn.style.display = 'flex';
                btn.style.visibility = 'visible';
                btn.style.opacity = '1';
                
                // Update button text based on availability
                if (this.deferredPrompt) {
                    btn.title = 'Install Divine Temple as PWA';
                } else {
                    btn.title = 'Use browser menu to install';
                }
                
                console.log('🚀 PWA supported, showing button');
            } else {
                // PWA not supported - hide button
                btn.classList.add('hidden');
                btn.style.display = 'none';
                console.log('❌ PWA not supported, hiding button');
            }
        });
    }
    
    maybeShowInstallBanner() {
        // Check if banner was recently dismissed
        const lastDismissed = localStorage.getItem('pwa-banner-dismissed');
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        if (this.deferredPrompt && (!lastDismissed || parseInt(lastDismissed) < oneDayAgo)) {
            const banner = document.getElementById('pwaInstallBanner') || 
                          document.getElementById('installBanner');
            
            if (banner) {
                this.showInstallBanner(banner);
            }
        }
    }
    
    showInstallBanner(banner) {
        banner.style.display = 'block';
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }
    
    hideInstallBanner() {
        const banners = document.querySelectorAll('#pwaInstallBanner, #installBanner');
        banners.forEach(banner => {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        });
        
        localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
    }
    
    hideAllInstallElements() {
        // Hide all install buttons and banners
        const elements = document.querySelectorAll(
            '[id*="nstallBtn"], [id*="manual"], .pwa-install-btn, .pwa-manual-btn, #pwaInstallBanner, #installBanner'
        );
        
        elements.forEach(element => {
            element.classList.add('hidden');
            setTimeout(() => {
                element.style.display = 'none';
            }, 400);
        });
    }
    
    async promptInstall() {
        console.log('🎯 Install prompt triggered');
        
        // Check if already installed
        if (this.isStandalone) {
            this.showMessage('✅ Divine Temple is already installed!', 'success');
            return { outcome: 'already-installed' };
        }
        
        // Check if prompt is available
        if (!this.deferredPrompt) {
            console.log('📱 No deferred prompt available, showing fallback');
            this.showFallbackInstructions();
            return { outcome: 'no-prompt-available' };
        }
        
        try {
            // Show the install prompt
            await this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const choiceResult = await this.deferredPrompt.userChoice;
            console.log('👤 User choice:', choiceResult.outcome);
            
            if (choiceResult.outcome === 'accepted') {
                this.showMessage('🎉 Installing Divine Temple...', 'success');
            } else {
                this.showMessage('💡 Install anytime using your browser menu', 'info');
            }
            
            // Reset the deferred prompt
            this.deferredPrompt = null;
            return choiceResult;
            
        } catch (error) {
            console.error('❌ Install failed:', error);
            this.showMessage('❌ Installation failed. Try using your browser menu → "Install app"', 'error');
            return { outcome: 'error', error };
        }
    }
    
    showFallbackInstructions() {
        const userAgent = navigator.userAgent.toLowerCase();
        let instructions = '';
        let icon = '📱';
        
        if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
            icon = '🌐';
            instructions = 'Chrome: Click the install icon (⊕) in the address bar';
        } else if (userAgent.includes('edg')) {
            icon = '🔷';
            instructions = 'Edge: Click the install icon (⊕) in the address bar';
        } else if (userAgent.includes('firefox')) {
            icon = '🦊';
            instructions = 'Firefox: Look for install option in address bar or menu';
        } else if (userAgent.includes('safari')) {
            icon = '🧭';
            instructions = 'Safari: Tap Share button → "Add to Home Screen"';
        } else {
            instructions = 'Use your browser menu → "Install app" or "Add to Home Screen"';
        }
        
        this.showMessage(`${icon} ${instructions}`, 'info', 8000);
    }
    
    showMessage(message, type = 'info', duration = 5000) {
        // Try to use existing notification systems first
        if (window.uxEnhancementManager && window.uxEnhancementManager.showNotification) {
            window.uxEnhancementManager.showNotification(message, type, duration);
            return;
        }
        
        // Fallback to custom notification
        this.createCustomNotification(message, type, duration);
    }
    
    createCustomNotification(message, type, duration) {
        const notification = document.createElement('div');
        notification.className = `pwa-notification pwa-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; border: none; color: inherit; cursor: pointer; margin-left: 10px;">✕</button>
            </div>
        `;
        
        // Add styles if not already present
        this.ensureNotificationStyles();
        
        document.body.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }
    
    ensureNotificationStyles() {
        if (document.querySelector('#pwa-notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'pwa-notification-styles';
        style.textContent = `
            .pwa-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(26, 26, 46, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid #d4af37;
                border-radius: 10px;
                padding: 1rem 1.5rem;
                color: white;
                max-width: 350px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideInRight 0.3s ease;
                font-family: 'Inter', sans-serif;
            }
            .pwa-notification-success { border-color: #10b981; }
            .pwa-notification-error { border-color: #ef4444; }
            .pwa-notification-info { border-color: #3b82f6; }
            .notification-content { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                gap: 10px;
            }
            @keyframes slideInRight { 
                from { transform: translateX(100%); opacity: 0; } 
                to { transform: translateX(0); opacity: 1; } 
            }
            @media (max-width: 480px) {
                .pwa-notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    showInstallSuccessMessage() {
        this.showMessage('🎉 Divine Temple installed successfully! Check your home screen or app launcher.', 'success', 6000);
    }
    
    // Public API
    install() {
        return this.promptInstall();
    }
    
    getStatus() {
        return {
            isInstalled: this.isInstalled,
            isStandalone: this.isStandalone,
            supportsPWA: this.supportsPWA,
            hasPrompt: !!this.deferredPrompt
        };
    }
}

// Initialize the enhanced PWA installer
window.enhancedPWAInstaller = new EnhancedPWAInstaller();

// Global install function for buttons
window.installPWA = () => {
    return window.enhancedPWAInstaller.install();
};

// Store deferred prompt globally for backward compatibility
window.addEventListener('beforeinstallprompt', (e) => {
    window.deferredPrompt = e;
});

console.log('🏛️ Enhanced PWA Install System loaded');