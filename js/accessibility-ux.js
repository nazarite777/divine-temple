/**
 * Divine Temple Accessibility & UX Enhancement Suite
 * Final polish for optimal user experience and accessibility compliance
 */

class AccessibilityManager {
    constructor() {
        this.focusTrap = null;
        this.announcements = [];
        this.keyboardNavigation = true;
        this.highContrastMode = false;
        this.screenReaderActive = this.detectScreenReader();
        
        this.init();
    }

    init() {
        this.setupAccessibilityFeatures();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.setupHighContrastMode();
        this.addSkipLinks();
        
        console.log('♿ Accessibility Manager initialized');
        console.log('🎯 Screen Reader detected:', this.screenReaderActive);
    }

    // ================================
    // SCREEN READER SUPPORT
    // ================================

    detectScreenReader() {
        // Check for common screen reader indicators
        return !!(
            navigator.userAgent.includes('NVDA') ||
            navigator.userAgent.includes('JAWS') ||
            navigator.userAgent.includes('VoiceOver') ||
            window.speechSynthesis ||
            document.querySelector('[aria-live]')
        );
    }

    setupScreenReaderSupport() {
        // Create live announcement region
        this.createLiveRegion();
        
        // Add ARIA labels to interactive elements
        this.addAriaLabels();
        
        // Setup region descriptions
        this.setupLandmarkRegions();
    }

    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute !important;
            left: -10000px !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
        `;
        document.body.appendChild(liveRegion);
    }

    announce(message, priority = 'polite') {
        const liveRegion = document.getElementById('live-announcements');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
        
        console.log(`📢 Announced: ${message}`);
    }

    addAriaLabels() {
        // Add labels to buttons without text
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
            const icon = button.querySelector('[class*="icon"], .emoji');
            const text = button.textContent.trim();
            
            if (!text && icon) {
                const iconClass = icon.className;
                let label = 'Button';
                
                if (iconClass.includes('close')) label = 'Close';
                else if (iconClass.includes('menu')) label = 'Menu';
                else if (iconClass.includes('play')) label = 'Play';
                else if (iconClass.includes('pause')) label = 'Pause';
                else if (iconClass.includes('next')) label = 'Next';
                else if (iconClass.includes('previous')) label = 'Previous';
                
                button.setAttribute('aria-label', label);
            }
        });

        // Add labels to form inputs
        document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
            const placeholder = input.placeholder;
            const type = input.type;
            
            if (placeholder) {
                input.setAttribute('aria-label', placeholder);
            } else {
                const label = type.charAt(0).toUpperCase() + type.slice(1) + ' input';
                input.setAttribute('aria-label', label);
            }
        });
    }

    setupLandmarkRegions() {
        // Add main landmarks
        const main = document.querySelector('main') || document.body;
        if (!main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Add navigation landmarks
        document.querySelectorAll('nav').forEach(nav => {
            if (!nav.getAttribute('aria-label')) {
                nav.setAttribute('aria-label', 'Site navigation');
            }
        });

        // Add content sections
        document.querySelectorAll('.section-container, .content-section').forEach(section => {
            section.setAttribute('role', 'region');
            const heading = section.querySelector('h1, h2, h3');
            if (heading) {
                const id = heading.id || `section-${Math.random().toString(36).substr(2, 9)}`;
                heading.id = id;
                section.setAttribute('aria-labelledby', id);
            }
        });
    }

    // ================================
    // KEYBOARD NAVIGATION
    // ================================

    setupKeyboardNavigation() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Make all interactive elements keyboard accessible
        this.enhanceKeyboardAccess();
        
        // Setup tabindex management
        this.setupTabIndexManagement();
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'Escape':
                this.handleEscape(e);
                break;
            case 'Tab':
                this.handleTab(e);
                break;
            case 'Enter':
            case ' ':
                this.handleActivation(e);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.handleArrowKeys(e);
                break;
        }
    }

    handleEscape(e) {
        // Close modals, dropdowns, etc.
        const openModal = document.querySelector('.modal.active, .dropdown.open');
        if (openModal) {
            this.closeModal(openModal);
            e.preventDefault();
        }
        
        // Return focus to dashboard
        if (document.querySelector('#section-container.active')) {
            if (window.returnToDashboard) {
                window.returnToDashboard();
            }
        }
    }

    handleTab(e) {
        // Trap focus in modals
        const modal = document.querySelector('.modal.active');
        if (modal) {
            this.trapFocus(modal, e);
        }
    }

    handleActivation(e) {
        const target = e.target;
        
        // Allow activation of custom interactive elements
        if (target.classList.contains('card') || 
            target.classList.contains('nav-card') ||
            target.getAttribute('role') === 'button') {
            
            if (target.onclick) {
                target.onclick(e);
                e.preventDefault();
            }
        }
    }

    handleArrowKeys(e) {
        // Grid navigation for card layouts
        const gridContainer = e.target.closest('.nav-grid, .cards-grid, .videos-grid');
        if (gridContainer) {
            this.navigateGrid(gridContainer, e);
        }
    }

    enhanceKeyboardAccess() {
        // Make cards keyboard accessible
        document.querySelectorAll('.nav-card, .card, .video-card').forEach(card => {
            if (!card.getAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            if (!card.getAttribute('role')) {
                card.setAttribute('role', 'button');
            }
        });

        // Add keyboard indicators
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('.nav-card, .card, .video-card')) {
                e.target.classList.add('keyboard-focused');
            }
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('keyboard-focused');
        });
    }

    setupTabIndexManagement() {
        // Manage tabindex for better navigation flow
        document.querySelectorAll('[tabindex="0"]').forEach((element, index) => {
            element.setAttribute('data-tab-order', index);
        });
    }

    navigateGrid(gridContainer, e) {
        const cards = Array.from(gridContainer.querySelectorAll('[tabindex="0"]'));
        const currentIndex = cards.indexOf(e.target);
        const columns = this.getGridColumns(gridContainer);
        
        let newIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowRight':
                newIndex = Math.min(currentIndex + 1, cards.length - 1);
                break;
            case 'ArrowLeft':
                newIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'ArrowDown':
                newIndex = Math.min(currentIndex + columns, cards.length - 1);
                break;
            case 'ArrowUp':
                newIndex = Math.max(currentIndex - columns, 0);
                break;
        }
        
        if (newIndex !== currentIndex) {
            cards[newIndex].focus();
            e.preventDefault();
        }
    }

    getGridColumns(gridContainer) {
        const computedStyle = window.getComputedStyle(gridContainer);
        const columns = computedStyle.gridTemplateColumns.split(' ').length;
        return columns || 3; // Default fallback
    }

    // ================================
    // FOCUS MANAGEMENT
    // ================================

    setupFocusManagement() {
        this.createFocusIndicators();
        this.setupFocusTrap();
    }

    createFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-focused {
                outline: 3px solid #8B5CF6 !important;
                outline-offset: 2px !important;
                border-radius: 8px !important;
            }
            
            .focus-visible {
                outline: 2px solid #D4AF37 !important;
                outline-offset: 2px !important;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(style);
    }

    setupFocusTrap() {
        // Will be activated for modals
        this.focusableElements = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(',');
    }

    trapFocus(container, e) {
        const focusableElements = container.querySelectorAll(this.focusableElements);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content anchor if it doesn't exist
        const mainContent = document.querySelector('main, #dashboard, .section-container');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    }

    // ================================
    // HIGH CONTRAST MODE
    // ================================

    setupHighContrastMode() {
        // Detect system high contrast preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        if (prefersHighContrast) {
            this.enableHighContrastMode();
        }

        // Add toggle button
        this.addHighContrastToggle();
    }

    enableHighContrastMode() {
        document.documentElement.classList.add('high-contrast');
        this.highContrastMode = true;
        
        const style = document.createElement('style');
        style.id = 'high-contrast-styles';
        style.textContent = `
            .high-contrast {
                --accent-gold: #FFD700 !important;
                --accent-purple: #9370DB !important;
                --text-primary: #FFFFFF !important;
                --text-secondary: #E0E0E0 !important;
                --glass-bg: rgba(0, 0, 0, 0.9) !important;
                --glass-border: #FFFFFF !important;
            }
            
            .high-contrast * {
                border-color: #FFFFFF !important;
            }
            
            .high-contrast .nav-card:hover,
            .high-contrast .card:hover {
                background: #000000 !important;
                border-color: #FFD700 !important;
            }
        `;
        document.head.appendChild(style);
        
        this.announce('High contrast mode enabled');
    }

    addHighContrastToggle() {
        const toggle = document.createElement('button');
        toggle.innerHTML = '🎨';
        toggle.setAttribute('aria-label', 'Toggle high contrast mode');
        toggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #FFFFFF;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s;
        `;
        
        toggle.addEventListener('click', () => {
            if (this.highContrastMode) {
                this.disableHighContrastMode();
            } else {
                this.enableHighContrastMode();
            }
        });

        document.body.appendChild(toggle);
    }

    disableHighContrastMode() {
        document.documentElement.classList.remove('high-contrast');
        this.highContrastMode = false;
        
        const style = document.getElementById('high-contrast-styles');
        if (style) {
            style.remove();
        }
        
        this.announce('High contrast mode disabled');
    }

    // ================================
    // UTILITY METHODS
    // ================================

    closeModal(modal) {
        modal.classList.remove('active');
        
        // Return focus to trigger element
        const trigger = document.querySelector('[data-modal-trigger]');
        if (trigger) {
            trigger.focus();
        }
        
        this.announce('Modal closed');
    }

    validateAccessibility() {
        const issues = [];
        
        // Check for missing alt text
        document.querySelectorAll('img:not([alt])').forEach(img => {
            issues.push(`Image missing alt text: ${img.src}`);
        });
        
        // Check for missing labels
        document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label) {
                issues.push(`Input missing label: ${input.type}`);
            }
        });
        
        // Check for missing headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            issues.push('No heading structure found');
        }
        
        // Check color contrast (basic)
        const lowContrastElements = this.checkColorContrast();
        issues.push(...lowContrastElements);
        
        if (issues.length > 0) {
            console.warn('Accessibility issues found:', issues);
        } else {
            console.log('✅ Accessibility validation passed');
        }
        
        return issues;
    }

    checkColorContrast() {
        const issues = [];
        // Basic contrast checking would go here
        // This is simplified - real implementation would use WCAG calculations
        return issues;
    }

    // Public API
    getAccessibilityReport() {
        return {
            screenReaderActive: this.screenReaderActive,
            highContrastMode: this.highContrastMode,
            keyboardNavigation: this.keyboardNavigation,
            issues: this.validateAccessibility(),
            features: [
                'Screen reader support',
                'Keyboard navigation',
                'Focus management',
                'High contrast mode',
                'Live announcements',
                'Skip links',
                'ARIA labels'
            ]
        };
    }
}

// ================================
// UX ENHANCEMENT MANAGER
// ================================

class UXEnhancementManager {
    constructor() {
        this.notifications = [];
        this.loadingStates = new Map();
        this.userPreferences = this.loadUserPreferences();
        
        this.init();
    }

    init() {
        this.setupNotificationSystem();
        this.setupLoadingStates();
        this.setupUserFeedback();
        this.setupHelpSystem();
        this.setupErrorHandling();
        
        console.log('✨ UX Enhancement Manager initialized');
    }

    // ================================
    // NOTIFICATION SYSTEM
    // ================================

    setupNotificationSystem() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
            max-width: 300px;
        `;
        notification.textContent = message;

        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        // Click to dismiss
        notification.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        return notification;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6',
            spiritual: '#8B5CF6'
        };
        return colors[type] || colors.info;
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ================================
    // LOADING STATES
    // ================================

    setupLoadingStates() {
        this.createLoadingOverlay();
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'global-loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            flex-direction: column;
        `;

        overlay.innerHTML = `
            <div class="loading-spinner" style="
                width: 60px;
                height: 60px;
                border: 4px solid rgba(139, 92, 246, 0.3);
                border-left-color: #8B5CF6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            "></div>
            <div style="color: white; font-size: 1.1rem;">Loading divine content...</div>
        `;

        document.body.appendChild(overlay);
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('global-loading-overlay');
        const text = overlay.querySelector('div:last-child');
        text.textContent = message;
        overlay.style.display = 'flex';
    }

    hideLoading() {
        const overlay = document.getElementById('global-loading-overlay');
        overlay.style.display = 'none';
    }

    // ================================
    // USER FEEDBACK
    // ================================

    setupUserFeedback() {
        this.setupProgressIndicators();
        this.setupConfirmationDialogs();
    }

    setupProgressIndicators() {
        // Add progress indicators for long operations
        window.addEventListener('progressStart', (e) => {
            this.showProgress(e.detail);
        });

        window.addEventListener('progressUpdate', (e) => {
            this.updateProgress(e.detail);
        });

        window.addEventListener('progressComplete', () => {
            this.hideProgress();
        });
    }

    showProgress(options = {}) {
        const { message = 'Processing...', percentage = 0 } = options;
        
        let progressBar = document.getElementById('progress-indicator');
        if (!progressBar) {
            progressBar = this.createProgressBar();
        }

        progressBar.style.display = 'block';
        progressBar.querySelector('.progress-message').textContent = message;
        progressBar.querySelector('.progress-fill').style.width = `${percentage}%`;
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-indicator';
        progressBar.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: none;
            min-width: 300px;
        `;

        progressBar.innerHTML = `
            <div class="progress-message" style="margin-bottom: 0.5rem; text-align: center;">Processing...</div>
            <div style="background: rgba(255, 255, 255, 0.2); border-radius: 10px; height: 8px; overflow: hidden;">
                <div class="progress-fill" style="
                    background: linear-gradient(90deg, #8B5CF6, #D4AF37);
                    height: 100%;
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 10px;
                "></div>
            </div>
        `;

        document.body.appendChild(progressBar);
        return progressBar;
    }

    updateProgress(options = {}) {
        const { percentage = 0, message } = options;
        const progressBar = document.getElementById('progress-indicator');
        
        if (progressBar) {
            progressBar.querySelector('.progress-fill').style.width = `${percentage}%`;
            if (message) {
                progressBar.querySelector('.progress-message').textContent = message;
            }
        }
    }

    hideProgress() {
        const progressBar = document.getElementById('progress-indicator');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    }

    setupConfirmationDialogs() {
        // Enhanced confirmation dialogs
        window.confirmAction = (message, onConfirm, onCancel) => {
            return this.showConfirmDialog(message, onConfirm, onCancel);
        };
    }

    showConfirmDialog(message, onConfirm, onCancel) {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;

        dialog.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                color: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            ">
                <div style="margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.5;">${message}</div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="confirm-btn" style="
                        background: linear-gradient(135deg, #10B981, #059669);
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                    ">Confirm</button>
                    <button class="cancel-btn" style="
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                    ">Cancel</button>
                </div>
            </div>
        `;

        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');

        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            if (onConfirm) onConfirm();
        });

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            if (onCancel) onCancel();
        });

        confirmBtn.addEventListener('mouseenter', () => {
            confirmBtn.style.transform = 'translateY(-2px)';
        });

        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.transform = 'translateY(-2px)';
        });

        document.body.appendChild(dialog);
        confirmBtn.focus();
    }

    // ================================
    // HELP SYSTEM
    // ================================

    setupHelpSystem() {
        this.addHelpTooltips();
        this.setupContextualHelp();
    }

    addHelpTooltips() {
        // Add tooltips to complex UI elements
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            this.addTooltip(element, element.dataset.tooltip);
        });
    }

    addTooltip(element, text) {
        element.addEventListener('mouseenter', () => {
            this.showTooltip(element, text);
        });

        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.id = 'active-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 10002;
            pointer-events: none;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        `;
        tooltip.textContent = text;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    }

    hideTooltip() {
        const tooltip = document.getElementById('active-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    setupContextualHelp() {
        // Add contextual help based on current section
        window.addEventListener('sectionChange', (e) => {
            this.updateContextualHelp(e.detail.section);
        });
    }

    updateContextualHelp(section) {
        const helpMessages = {
            'oracle-cards': 'Draw cards for divine guidance and spiritual insights',
            'sacred-books': 'Read and study sacred texts with interactive features',
            'videos-media': 'Watch curated spiritual content and join discussions',
            'sacred-geometry': 'Explore mystical patterns and sacred mathematics'
        };

        const message = helpMessages[section];
        if (message) {
            this.showNotification(message, 'spiritual', 6000);
        }
    }

    // ================================
    // ERROR HANDLING
    // ================================

    setupErrorHandling() {
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    }

    handleGlobalError(e) {
        console.error('Global error:', e.error);
        this.showNotification('An unexpected error occurred. Please try again.', 'error');
    }

    handlePromiseError(e) {
        console.error('Promise rejection:', e.reason);
        this.showNotification('A background operation failed. Please refresh if issues persist.', 'warning');
    }

    // ================================
    // USER PREFERENCES
    // ================================

    loadUserPreferences() {
        const defaults = {
            animations: true,
            notifications: true,
            sounds: false,
            theme: 'auto'
        };

        try {
            const saved = localStorage.getItem('divine-temple-preferences');
            return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
        } catch (error) {
            return defaults;
        }
    }

    saveUserPreferences() {
        localStorage.setItem('divine-temple-preferences', JSON.stringify(this.userPreferences));
    }

    updatePreference(key, value) {
        this.userPreferences[key] = value;
        this.saveUserPreferences();
        this.applyPreferences();
    }

    applyPreferences() {
        // Apply animation preferences
        if (!this.userPreferences.animations) {
            document.documentElement.style.setProperty('--animation-duration', '0.01s');
        }

        // Apply notification preferences
        if (!this.userPreferences.notifications) {
            this.notifications.forEach(notification => {
                this.removeNotification(notification);
            });
        }
    }

    // Public API
    getEnhancementReport() {
        return {
            userPreferences: this.userPreferences,
            activeNotifications: this.notifications.length,
            loadingStates: this.loadingStates.size,
            features: [
                'Toast notifications',
                'Loading indicators',
                'Progress tracking',
                'Confirmation dialogs',
                'Help tooltips',
                'Error handling',
                'User preferences'
            ]
        };
    }
}

// Global initialization
window.AccessibilityManager = AccessibilityManager;
window.UXEnhancementManager = UXEnhancementManager;

// Auto-initialize if not already done
if (!window.accessibilityManager) {
    window.accessibilityManager = new AccessibilityManager();
}

if (!window.uxEnhancementManager) {
    window.uxEnhancementManager = new UXEnhancementManager();
}

console.log('✨ Accessibility & UX Enhancement Suite loaded');