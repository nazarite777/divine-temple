/**
 * Divine Temple Theming System - Phase 9: Personalization Excellence
 * Advanced spiritual customization and preference management
 */

class DivineThemeManager {
    constructor() {
        this.themes = {
            'divine-light': {
                name: 'Divine Light',
                icon: '☀️',
                description: 'Celestial radiance for daytime spiritual practice',
                colors: {
                    primary: 'linear-gradient(135deg, #fef3c7, #fed7aa, #fbbf24)',
                    secondary: 'linear-gradient(135deg, #ddd6fe, #c7d2fe, #a5b4fc)',
                    accent: '#f59e0b',
                    accentSecondary: '#8b5cf6',
                    background: 'linear-gradient(135deg, #fefce8, #fef3c7, #fed7aa)',
                    surface: 'rgba(255, 255, 255, 0.9)',
                    surfaceGlass: 'rgba(255, 255, 255, 0.7)',
                    text: '#1f2937',
                    textSecondary: '#6b7280',
                    border: 'rgba(251, 191, 36, 0.3)',
                    shadow: 'rgba(245, 158, 11, 0.3)'
                },
                filters: {
                    brightness: 1.1,
                    contrast: 1.05,
                    saturation: 1.1
                }
            },
            'sacred-dark': {
                name: 'Sacred Dark',
                icon: '🌙',
                description: 'Mystical depths for nighttime contemplation',
                colors: {
                    primary: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
                    secondary: 'linear-gradient(135deg, #4c1d95, #5b21b6, #6d28d9)',
                    accent: '#d4af37',
                    accentSecondary: '#8b5fbf',
                    background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)',
                    surface: 'rgba(255, 255, 255, 0.1)',
                    surfaceGlass: 'rgba(255, 255, 255, 0.05)',
                    text: '#f9fafb',
                    textSecondary: '#d1d5db',
                    border: 'rgba(255, 255, 255, 0.2)',
                    shadow: 'rgba(212, 175, 55, 0.4)'
                },
                filters: {
                    brightness: 0.9,
                    contrast: 1.1,
                    saturation: 1.2
                }
            },
            'aurora-dream': {
                name: 'Aurora Dream',
                icon: '🌌',
                description: 'Ethereal cosmic energies for transcendent experiences',
                colors: {
                    primary: 'linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)',
                    secondary: 'linear-gradient(135deg, #0c4a6e, #0e7490, #0891b2)',
                    accent: '#06b6d4',
                    accentSecondary: '#8b5cf6',
                    background: 'linear-gradient(135deg, #0f0f23, #1e1b4b, #312e81)',
                    surface: 'rgba(6, 182, 212, 0.1)',
                    surfaceGlass: 'rgba(6, 182, 212, 0.05)',
                    text: '#f0f9ff',
                    textSecondary: '#bae6fd',
                    border: 'rgba(6, 182, 212, 0.3)',
                    shadow: 'rgba(6, 182, 212, 0.4)'
                },
                filters: {
                    brightness: 1.0,
                    contrast: 1.15,
                    saturation: 1.3
                }
            },
            'forest-sage': {
                name: 'Forest Sage',
                icon: '🌿',
                description: 'Earthy wisdom for grounded spiritual practice',
                colors: {
                    primary: 'linear-gradient(135deg, #1f2937, #374151, #4b5563)',
                    secondary: 'linear-gradient(135deg, #064e3b, #065f46, #047857)',
                    accent: '#10b981',
                    accentSecondary: '#6b7280',
                    background: 'linear-gradient(135deg, #111827, #1f2937, #374151)',
                    surface: 'rgba(16, 185, 129, 0.1)',
                    surfaceGlass: 'rgba(16, 185, 129, 0.05)',
                    text: '#ecfdf5',
                    textSecondary: '#a7f3d0',
                    border: 'rgba(16, 185, 129, 0.3)',
                    shadow: 'rgba(16, 185, 129, 0.4)'
                },
                filters: {
                    brightness: 0.95,
                    contrast: 1.05,
                    saturation: 1.1
                }
            },
            'rose-mystique': {
                name: 'Rose Mystique',
                icon: '🌹',
                description: 'Divine feminine energy for heart-centered practice',
                colors: {
                    primary: 'linear-gradient(135deg, #4c1d95, #5b21b6, #7c3aed)',
                    secondary: 'linear-gradient(135deg, #be185d, #e11d48, #f43f5e)',
                    accent: '#ec4899',
                    accentSecondary: '#8b5cf6',
                    background: 'linear-gradient(135deg, #1e1b4b, #4c1d95, #5b21b6)',
                    surface: 'rgba(236, 72, 153, 0.1)',
                    surfaceGlass: 'rgba(236, 72, 153, 0.05)',
                    text: '#fdf2f8',
                    textSecondary: '#f9a8d4',
                    border: 'rgba(236, 72, 153, 0.3)',
                    shadow: 'rgba(236, 72, 153, 0.4)'
                },
                filters: {
                    brightness: 1.05,
                    contrast: 1.1,
                    saturation: 1.25
                }
            }
        };
        
        this.preferences = {
            theme: 'sacred-dark',
            animations: 'enhanced',
            fontSize: 'medium',
            dashboardLayout: 'grid',
            cardStyle: 'glass',
            particleEffects: true,
            soundEnabled: true,
            autoTheme: false,
            customAccent: null
        };
        
        this.init();
    }
    
    init() {
        console.log('🎨 Initializing Divine Theme Manager Phase 9...');
        this.loadPreferences();
        this.applyTheme();
        this.setupThemeToggle();
        this.setupAutoTheme();
        this.initializeCustomization();
    }
    
    loadPreferences() {
        const saved = localStorage.getItem('divine-temple-preferences');
        if (saved) {
            this.preferences = { ...this.preferences, ...JSON.parse(saved) };
        }
        console.log('✨ Loaded user preferences:', this.preferences);
    }
    
    savePreferences() {
        localStorage.setItem('divine-temple-preferences', JSON.stringify(this.preferences));
        console.log('💾 Preferences saved');
    }
    
    applyTheme(themeName = this.preferences.theme) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        console.log(`🎨 Applying theme: ${theme.name}`);
        
        // Apply CSS custom properties
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--theme-${key}`, value);
        });
        
        // Apply filters
        Object.entries(theme.filters).forEach(([key, value]) => {
            root.style.setProperty(`--filter-${key}`, value);
        });
        
        // Update body classes
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
        
        // Update theme-aware elements
        this.updateThemeElements(theme);
        
        // Trigger theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeName, themeData: theme } 
        }));
        
        this.preferences.theme = themeName;
        this.savePreferences();
    }
    
    updateThemeElements(theme) {
        // Update favicon based on theme
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = `/icons/temple-${theme.name.toLowerCase().replace(' ', '-')}.ico`;
        }
        
        // Update meta theme color
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = theme.colors.accent;
        
        // Update any theme-specific images or icons
        document.querySelectorAll('[data-theme-src]').forEach(img => {
            const baseSrc = img.dataset.themeSrc;
            img.src = `${baseSrc}-${this.preferences.theme}.png`;
        });
    }
    
    setupThemeToggle() {
        // Create floating theme toggle
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle-fab';
        themeToggle.innerHTML = `
            <button class="theme-toggle-btn" onclick="divineThemeManager.toggleThemeMenu()">
                🎨
            </button>
            <div class="theme-menu" id="theme-menu">
                <div class="theme-menu-header">
                    <h3>Sacred Themes ✨</h3>
                    <button class="theme-menu-close" onclick="divineThemeManager.closeThemeMenu()">×</button>
                </div>
                <div class="theme-options">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="theme-option ${key === this.preferences.theme ? 'active' : ''}" 
                             data-theme="${key}" onclick="divineThemeManager.selectTheme('${key}')">
                            <div class="theme-preview" style="background: ${theme.colors.primary}">
                                <div class="theme-icon">${theme.icon}</div>
                            </div>
                            <div class="theme-info">
                                <div class="theme-name">${theme.name}</div>
                                <div class="theme-desc">${theme.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="theme-controls">
                    <label class="theme-control">
                        <input type="checkbox" ${this.preferences.autoTheme ? 'checked' : ''} 
                               onchange="divineThemeManager.toggleAutoTheme(this.checked)">
                        <span>🌅 Auto Theme (Day/Night)</span>
                    </label>
                </div>
            </div>
        `;
        
        document.body.appendChild(themeToggle);
    }
    
    toggleThemeMenu() {
        const menu = document.getElementById('theme-menu');
        menu.classList.toggle('theme-menu-open');
    }
    
    closeThemeMenu() {
        const menu = document.getElementById('theme-menu');
        menu.classList.remove('theme-menu-open');
    }
    
    selectTheme(themeName) {
        // Update active state
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');
        
        // Apply theme with transition
        document.body.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        this.applyTheme(themeName);
        
        // Remove transition after animation
        setTimeout(() => {
            document.body.style.transition = '';
        }, 800);
        
        // Close menu
        this.closeThemeMenu();
        
        // Show confirmation
        this.showThemeNotification(this.themes[themeName].name);
    }
    
    setupAutoTheme() {
        if (this.preferences.autoTheme) {
            this.enableAutoTheme();
        }
    }
    
    toggleAutoTheme(enabled) {
        this.preferences.autoTheme = enabled;
        this.savePreferences();
        
        if (enabled) {
            this.enableAutoTheme();
        } else {
            this.disableAutoTheme();
        }
    }
    
    enableAutoTheme() {
        const checkTime = () => {
            const hour = new Date().getHours();
            const isDayTime = hour >= 6 && hour < 20;
            const newTheme = isDayTime ? 'divine-light' : 'sacred-dark';
            
            if (newTheme !== this.preferences.theme) {
                this.applyTheme(newTheme);
            }
        };
        
        // Check immediately and then every hour
        checkTime();
        this.autoThemeInterval = setInterval(checkTime, 3600000);
        
        console.log('🌅 Auto theme enabled');
    }
    
    disableAutoTheme() {
        if (this.autoThemeInterval) {
            clearInterval(this.autoThemeInterval);
            this.autoThemeInterval = null;
        }
        console.log('🌅 Auto theme disabled');
    }
    
    initializeCustomization() {
        // Apply other preferences
        this.applyFontSize();
        this.applyAnimationSettings();
        this.applyLayoutSettings();
        this.setupCustomization();
    }
    
    applyFontSize() {
        const fontSizes = {
            small: '0.9rem',
            medium: '1rem',
            large: '1.1rem',
            xlarge: '1.2rem'
        };
        
        document.documentElement.style.setProperty(
            '--base-font-size', 
            fontSizes[this.preferences.fontSize] || fontSizes.medium
        );
    }
    
    applyAnimationSettings() {
        const animationLevels = {
            none: '0s',
            reduced: '0.2s',
            normal: '0.4s',
            enhanced: '0.6s'
        };
        
        document.documentElement.style.setProperty(
            '--animation-duration',
            animationLevels[this.preferences.animations] || animationLevels.enhanced
        );
        
        if (this.preferences.animations === 'none') {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    }
    
    applyLayoutSettings() {
        document.body.classList.remove('layout-grid', 'layout-list', 'layout-cards');
        document.body.classList.add(`layout-${this.preferences.dashboardLayout}`);
        
        document.body.classList.remove('card-glass', 'card-solid', 'card-minimal');
        document.body.classList.add(`card-${this.preferences.cardStyle}`);
    }
    
    setupCustomization() {
        // Create customization panel
        const customPanel = document.createElement('div');
        customPanel.id = 'customization-panel';
        customPanel.innerHTML = `
            <div class="custom-panel-header">
                <h3>⚙️ Personalization</h3>
                <button onclick="this.parentElement.parentElement.classList.toggle('panel-open')">⚙️</button>
            </div>
            <div class="custom-panel-content">
                <div class="custom-section">
                    <label>Font Size</label>
                    <select onchange="divineThemeManager.changeFontSize(this.value)">
                        <option value="small" ${this.preferences.fontSize === 'small' ? 'selected' : ''}>Small</option>
                        <option value="medium" ${this.preferences.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="large" ${this.preferences.fontSize === 'large' ? 'selected' : ''}>Large</option>
                        <option value="xlarge" ${this.preferences.fontSize === 'xlarge' ? 'selected' : ''}>Extra Large</option>
                    </select>
                </div>
                
                <div class="custom-section">
                    <label>Animations</label>
                    <select onchange="divineThemeManager.changeAnimations(this.value)">
                        <option value="none" ${this.preferences.animations === 'none' ? 'selected' : ''}>None</option>
                        <option value="reduced" ${this.preferences.animations === 'reduced' ? 'selected' : ''}>Reduced</option>
                        <option value="normal" ${this.preferences.animations === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="enhanced" ${this.preferences.animations === 'enhanced' ? 'selected' : ''}>Enhanced</option>
                    </select>
                </div>
                
                <div class="custom-section">
                    <label>Dashboard Layout</label>
                    <select onchange="divineThemeManager.changeLayout(this.value)">
                        <option value="grid" ${this.preferences.dashboardLayout === 'grid' ? 'selected' : ''}>Grid</option>
                        <option value="list" ${this.preferences.dashboardLayout === 'list' ? 'selected' : ''}>List</option>
                        <option value="cards" ${this.preferences.dashboardLayout === 'cards' ? 'selected' : ''}>Cards</option>
                    </select>
                </div>
                
                <div class="custom-section">
                    <label>Card Style</label>
                    <select onchange="divineThemeManager.changeCardStyle(this.value)">
                        <option value="glass" ${this.preferences.cardStyle === 'glass' ? 'selected' : ''}>Glass</option>
                        <option value="solid" ${this.preferences.cardStyle === 'solid' ? 'selected' : ''}>Solid</option>
                        <option value="minimal" ${this.preferences.cardStyle === 'minimal' ? 'selected' : ''}>Minimal</option>
                    </select>
                </div>
                
                <div class="custom-section">
                    <label class="custom-checkbox">
                        <input type="checkbox" ${this.preferences.particleEffects ? 'checked' : ''} 
                               onchange="divineThemeManager.toggleParticles(this.checked)">
                        <span>✨ Particle Effects</span>
                    </label>
                </div>
                
                <div class="custom-section">
                    <button class="reset-btn" onclick="divineThemeManager.resetToDefaults()">
                        🔄 Reset to Defaults
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(customPanel);
    }
    
    changeFontSize(size) {
        this.preferences.fontSize = size;
        this.applyFontSize();
        this.savePreferences();
    }
    
    changeAnimations(level) {
        this.preferences.animations = level;
        this.applyAnimationSettings();
        this.savePreferences();
    }
    
    changeLayout(layout) {
        this.preferences.dashboardLayout = layout;
        this.applyLayoutSettings();
        this.savePreferences();
    }
    
    changeCardStyle(style) {
        this.preferences.cardStyle = style;
        this.applyLayoutSettings();
        this.savePreferences();
    }
    
    toggleParticles(enabled) {
        this.preferences.particleEffects = enabled;
        document.body.classList.toggle('no-particles', !enabled);
        this.savePreferences();
    }
    
    resetToDefaults() {
        this.preferences = {
            theme: 'sacred-dark',
            animations: 'enhanced',
            fontSize: 'medium',
            dashboardLayout: 'grid',
            cardStyle: 'glass',
            particleEffects: true,
            soundEnabled: true,
            autoTheme: false,
            customAccent: null
        };
        
        this.savePreferences();
        window.location.reload();
    }
    
    showThemeNotification(themeName) {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <div class="theme-notification-content">
                <span class="theme-notification-icon">🎨</span>
                <span>Switched to ${themeName} theme</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Export/Import preferences
    exportPreferences() {
        const data = {
            preferences: this.preferences,
            exported: new Date().toISOString(),
            version: '9.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'divine-temple-preferences.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    importPreferences(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.preferences) {
                    this.preferences = { ...this.preferences, ...data.preferences };
                    this.savePreferences();
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to import preferences:', error);
            }
        };
        reader.readAsText(file);
    }
}

// Initialize theme manager
const divineThemeManager = new DivineThemeManager();

// Export for global access
window.divineThemeManager = divineThemeManager;

console.log('🎨 Divine Temple Theme Manager Phase 9 loaded successfully! ✨');