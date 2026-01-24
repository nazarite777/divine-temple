/**
 * 🌍 Divine Temple Multi-Language System (i18n)
 *
 * Features:
 * - Support for multiple languages
 * - Dynamic text translation
 * - RTL (Right-to-Left) support for Arabic/Hebrew
 * - Language switcher UI
 * - Persistent language selection
 * - Translation key management
 * - Fallback to English for missing translations
 * - Date/time/number localization
 * - Pluralization support
 *
 * Supported Languages:
 * - English (en)
 * - Spanish (es)
 * - French (fr)
 * - German (de)
 * - Hindi (hi)
 * - Sanskrit (sa)
 * - Chinese Simplified (zh-CN)
 * - Japanese (ja)
 * - Arabic (ar)
 * - Portuguese (pt)
 */

class MultiLanguageSystem {
    constructor() {
        this.currentLanguage = this.loadLanguage();
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.supportedLanguages = this.getSupportedLanguages();
        this.rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        this.init();
    }

    async init() {
        console.log('🌍 Multi-Language System initialized');

        // Load translations for current language
        await this.loadTranslations(this.currentLanguage);

        // Apply language to the page
        this.applyLanguage();

        // Set up MutationObserver for dynamic content
        this.setupDynamicTranslation();
    }

    getSupportedLanguages() {
        return [
            {
                code: 'en',
                name: 'English',
                nativeName: 'English',
                flag: '🇺🇸',
                rtl: false
            },
            {
                code: 'es',
                name: 'Spanish',
                nativeName: 'Español',
                flag: '🇪🇸',
                rtl: false
            },
            {
                code: 'fr',
                name: 'French',
                nativeName: 'Français',
                flag: '🇫🇷',
                rtl: false
            },
            {
                code: 'de',
                name: 'German',
                nativeName: 'Deutsch',
                flag: '🇩🇪',
                rtl: false
            },
            {
                code: 'hi',
                name: 'Hindi',
                nativeName: 'हिन्दी',
                flag: '🇮🇳',
                rtl: false
            },
            {
                code: 'sa',
                name: 'Sanskrit',
                nativeName: 'संस्कृतम्',
                flag: '🕉️',
                rtl: false
            },
            {
                code: 'zh-CN',
                name: 'Chinese (Simplified)',
                nativeName: '简体中文',
                flag: '🇨🇳',
                rtl: false
            },
            {
                code: 'ja',
                name: 'Japanese',
                nativeName: '日本語',
                flag: '🇯🇵',
                rtl: false
            },
            {
                code: 'ar',
                name: 'Arabic',
                nativeName: 'العربية',
                flag: '🇸🇦',
                rtl: true
            },
            {
                code: 'pt',
                name: 'Portuguese',
                nativeName: 'Português',
                flag: '🇵🇹',
                rtl: false
            }
        ];
    }

    async loadTranslations(languageCode) {
        // In production, these would be loaded from external JSON files
        // For now, we'll include them inline

        const translationData = this.getTranslationData(languageCode);
        this.translations[languageCode] = translationData;
    }

    getTranslationData(languageCode) {
        // This is a sample translation structure
        // In production, load from /locales/[language].json

        const translations = {
            en: {
                common: {
                    welcome: 'Welcome',
                    login: 'Login',
                    logout: 'Logout',
                    signup: 'Sign Up',
                    email: 'Email',
                    password: 'Password',
                    submit: 'Submit',
                    cancel: 'Cancel',
                    save: 'Save',
                    delete: 'Delete',
                    edit: 'Edit',
                    close: 'Close',
                    loading: 'Loading...',
                    error: 'Error',
                    success: 'Success',
                    yes: 'Yes',
                    no: 'No',
                    confirm: 'Confirm',
                    back: 'Back',
                    next: 'Next',
                    finish: 'Finish',
                    search: 'Search'
                },
                navigation: {
                    home: 'Home',
                    dashboard: 'Dashboard',
                    profile: 'Profile',
                    settings: 'Settings',
                    help: 'Help',
                    about: 'About'
                },
                dashboard: {
                    title: 'Spiritual Dashboard',
                    welcome_message: 'Welcome to your spiritual journey',
                    daily_quests: 'Daily Quests',
                    progress: 'Progress',
                    achievements: 'Achievements',
                    level: 'Level',
                    xp: 'XP',
                    streak: 'Day Streak'
                },
                quests: {
                    daily: 'Daily Quests',
                    complete: 'Complete',
                    pending: 'Pending',
                    reward: 'Reward',
                    description: 'Description'
                },
                meditation: {
                    title: 'Meditation',
                    start: 'Start Meditation',
                    duration: 'Duration',
                    minutes: 'minutes',
                    guidance: 'Guided',
                    silent: 'Silent'
                },
                social: {
                    friends: 'Friends',
                    add_friend: 'Add Friend',
                    circles: 'Circles',
                    create_circle: 'Create Circle',
                    join_circle: 'Join Circle',
                    messages: 'Messages',
                    activity: 'Activity'
                },
                achievements: {
                    title: 'Achievements',
                    unlocked: 'Unlocked',
                    locked: 'Locked',
                    progress: 'Progress',
                    reward: 'Reward'
                },
                settings: {
                    title: 'Settings',
                    language: 'Language',
                    notifications: 'Notifications',
                    privacy: 'Privacy',
                    account: 'Account',
                    theme: 'Theme',
                    dark_mode: 'Dark Mode'
                },
                messages: {
                    welcome_back: 'Welcome back, {name}!',
                    level_up: 'Congratulations! You reached Level {level}!',
                    xp_earned: '+{amount} XP earned',
                    achievement_unlocked: 'Achievement Unlocked: {name}',
                    quest_completed: 'Quest completed: {name}',
                    friend_request: '{name} sent you a friend request',
                    circle_invitation: 'You have been invited to {circle}'
                },
                plurals: {
                    day: '{count} day | {count} days',
                    hour: '{count} hour | {count} hours',
                    minute: '{count} minute | {count} minutes',
                    friend: '{count} friend | {count} friends',
                    achievement: '{count} achievement | {count} achievements'
                }
            },
            es: {
                common: {
                    welcome: 'Bienvenido',
                    login: 'Iniciar sesión',
                    logout: 'Cerrar sesión',
                    signup: 'Registrarse',
                    email: 'Correo electrónico',
                    password: 'Contraseña',
                    submit: 'Enviar',
                    cancel: 'Cancelar',
                    save: 'Guardar',
                    delete: 'Eliminar',
                    edit: 'Editar',
                    close: 'Cerrar',
                    loading: 'Cargando...',
                    error: 'Error',
                    success: 'Éxito',
                    yes: 'Sí',
                    no: 'No',
                    confirm: 'Confirmar',
                    back: 'Atrás',
                    next: 'Siguiente',
                    finish: 'Finalizar',
                    search: 'Buscar'
                },
                navigation: {
                    home: 'Inicio',
                    dashboard: 'Panel',
                    profile: 'Perfil',
                    settings: 'Configuración',
                    help: 'Ayuda',
                    about: 'Acerca de'
                },
                dashboard: {
                    title: 'Panel Espiritual',
                    welcome_message: 'Bienvenido a tu viaje espiritual',
                    daily_quests: 'Misiones Diarias',
                    progress: 'Progreso',
                    achievements: 'Logros',
                    level: 'Nivel',
                    xp: 'XP',
                    streak: 'Racha de Días'
                },
                messages: {
                    welcome_back: '¡Bienvenido de nuevo, {name}!',
                    level_up: '¡Felicidades! ¡Alcanzaste el Nivel {level}!',
                    xp_earned: '+{amount} XP ganado',
                    achievement_unlocked: 'Logro Desbloqueado: {name}',
                    quest_completed: 'Misión completada: {name}'
                }
            },
            fr: {
                common: {
                    welcome: 'Bienvenue',
                    login: 'Connexion',
                    logout: 'Déconnexion',
                    signup: "S'inscrire",
                    email: 'Email',
                    password: 'Mot de passe',
                    submit: 'Soumettre',
                    cancel: 'Annuler',
                    save: 'Sauvegarder',
                    delete: 'Supprimer',
                    edit: 'Modifier',
                    close: 'Fermer',
                    loading: 'Chargement...',
                    error: 'Erreur',
                    success: 'Succès',
                    search: 'Rechercher'
                },
                dashboard: {
                    title: 'Tableau de Bord Spirituel',
                    welcome_message: 'Bienvenue dans votre voyage spirituel',
                    daily_quests: 'Quêtes Quotidiennes',
                    progress: 'Progrès',
                    level: 'Niveau',
                    xp: 'XP'
                }
            },
            hi: {
                common: {
                    welcome: 'स्वागत है',
                    login: 'लॉग इन करें',
                    logout: 'लॉग आउट',
                    signup: 'साइन अप करें',
                    email: 'ईमेल',
                    password: 'पासवर्ड',
                    submit: 'जमा करें',
                    cancel: 'रद्द करें',
                    save: 'सहेजें',
                    search: 'खोजें'
                },
                dashboard: {
                    title: 'आध्यात्मिक डैशबोर्ड',
                    welcome_message: 'अपनी आध्यात्मिक यात्रा में आपका स्वागत है',
                    daily_quests: 'दैनिक कार्य',
                    progress: 'प्रगति',
                    achievements: 'उपलब्धियाँ',
                    level: 'स्तर',
                    xp: 'अनुभव अंक'
                }
            },
            sa: {
                common: {
                    welcome: 'स्वागतम्',
                    login: 'प्रवेशः',
                    logout: 'निर्गमनम्',
                    search: 'अन्वेषणम्'
                },
                dashboard: {
                    title: 'आध्यात्मिक पटलम्',
                    daily_quests: 'दैनिक कार्याणि',
                    progress: 'प्रगतिः',
                    level: 'स्तरः'
                }
            },
            'zh-CN': {
                common: {
                    welcome: '欢迎',
                    login: '登录',
                    logout: '登出',
                    signup: '注册',
                    email: '电子邮件',
                    password: '密码',
                    submit: '提交',
                    cancel: '取消',
                    save: '保存',
                    search: '搜索'
                },
                dashboard: {
                    title: '灵性仪表板',
                    welcome_message: '欢迎来到您的灵性之旅',
                    daily_quests: '每日任务',
                    progress: '进度',
                    achievements: '成就',
                    level: '等级',
                    xp: '经验值'
                }
            },
            ja: {
                common: {
                    welcome: 'ようこそ',
                    login: 'ログイン',
                    logout: 'ログアウト',
                    signup: '新規登録',
                    email: 'メール',
                    password: 'パスワード',
                    submit: '送信',
                    cancel: 'キャンセル',
                    save: '保存',
                    search: '検索'
                },
                dashboard: {
                    title: 'スピリチュアルダッシュボード',
                    welcome_message: 'あなたのスピリチュアルな旅へようこそ',
                    daily_quests: 'デイリークエスト',
                    progress: '進捗',
                    achievements: '実績',
                    level: 'レベル',
                    xp: '経験値'
                }
            },
            ar: {
                common: {
                    welcome: 'مرحباً',
                    login: 'تسجيل الدخول',
                    logout: 'تسجيل الخروج',
                    signup: 'التسجيل',
                    email: 'البريد الإلكتروني',
                    password: 'كلمة المرور',
                    submit: 'إرسال',
                    cancel: 'إلغاء',
                    save: 'حفظ',
                    search: 'بحث'
                },
                dashboard: {
                    title: 'لوحة القيادة الروحية',
                    welcome_message: 'مرحباً بك في رحلتك الروحية',
                    daily_quests: 'المهام اليومية',
                    progress: 'التقدم',
                    achievements: 'الإنجازات',
                    level: 'المستوى',
                    xp: 'نقاط الخبرة'
                }
            },
            pt: {
                common: {
                    welcome: 'Bem-vindo',
                    login: 'Entrar',
                    logout: 'Sair',
                    signup: 'Cadastrar',
                    email: 'Email',
                    password: 'Senha',
                    submit: 'Enviar',
                    cancel: 'Cancelar',
                    save: 'Salvar',
                    search: 'Pesquisar'
                },
                dashboard: {
                    title: 'Painel Espiritual',
                    welcome_message: 'Bem-vindo à sua jornada espiritual',
                    daily_quests: 'Missões Diárias',
                    progress: 'Progresso',
                    achievements: 'Conquistas',
                    level: 'Nível',
                    xp: 'XP'
                }
            }
        };

        return translations[languageCode] || translations[this.fallbackLanguage];
    }

    t(key, params = {}) {
        // Translate a key
        // Example: t('dashboard.welcome_message')
        // Example with params: t('messages.welcome_back', { name: 'John' })

        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        // Traverse the translation object
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English
                translation = this.translations[this.fallbackLanguage];
                for (const fk of keys) {
                    if (translation && translation[fk]) {
                        translation = translation[fk];
                    } else {
                        return key; // Return key if not found
                    }
                }
                break;
            }
        }

        if (typeof translation !== 'string') {
            return key;
        }

        // Replace parameters
        let result = translation;
        for (const [param, value] of Object.entries(params)) {
            result = result.replace(`{${param}}`, value);
        }

        return result;
    }

    plural(key, count) {
        // Handle pluralization
        // Example: plural('plurals.day', 1) => "1 day"
        // Example: plural('plurals.day', 5) => "5 days"

        const translation = this.t(key);
        const forms = translation.split('|').map(f => f.trim());

        let form;
        if (count === 1) {
            form = forms[0];
        } else {
            form = forms[1] || forms[0];
        }

        return form.replace('{count}', count);
    }

    async changeLanguage(languageCode) {
        if (!this.supportedLanguages.find(lang => lang.code === languageCode)) {
            console.error('Unsupported language:', languageCode);
            return false;
        }

        this.currentLanguage = languageCode;

        // Load translations if not already loaded
        if (!this.translations[languageCode]) {
            await this.loadTranslations(languageCode);
        }

        // Save preference
        this.saveLanguage();

        // Apply language
        this.applyLanguage();

        // 🎯 AWARD XP for changing language
        if (window.progressSystem) {
            const langInfo = this.supportedLanguages.find(l => l.code === languageCode);
            window.progressSystem.awardXP(10, `Changed language to ${langInfo.name}`, 'settings');
        }

        // Dispatch event
        window.dispatchEvent(new CustomEvent('language-changed', {
            detail: { language: languageCode }
        }));

        return true;
    }

    applyLanguage() {
        // Set HTML lang attribute
        document.documentElement.lang = this.currentLanguage;

        // Set RTL direction if needed
        if (this.isRTL()) {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }

        // Translate all elements with data-i18n attribute
        this.translatePage();
    }

    translatePage() {
        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Check if we should translate text content or placeholder
            if (element.hasAttribute('data-i18n-placeholder')) {
                element.placeholder = translation;
            } else if (element.hasAttribute('data-i18n-title')) {
                element.title = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    setupDynamicTranslation() {
        // Set up MutationObserver to automatically translate new content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Translate the new element and its children
                            const elements = node.querySelectorAll('[data-i18n]');
                            if (node.hasAttribute?.('data-i18n')) {
                                const key = node.getAttribute('data-i18n');
                                node.textContent = this.t(key);
                            }
                            elements.forEach(el => {
                                const key = el.getAttribute('data-i18n');
                                el.textContent = this.t(key);
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    isRTL() {
        return this.rtlLanguages.includes(this.currentLanguage);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getCurrentLanguageInfo() {
        return this.supportedLanguages.find(lang => lang.code === this.currentLanguage);
    }

    formatDate(date, options = {}) {
        // Localize date formatting
        const dateObj = date instanceof Date ? date : new Date(date);
        return new Intl.DateTimeFormat(this.currentLanguage, options).format(dateObj);
    }

    formatNumber(number, options = {}) {
        // Localize number formatting
        return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    }

    formatCurrency(amount, currency = 'USD') {
        // Localize currency formatting
        return new Intl.NumberFormat(this.currentLanguage, {
            style: 'currency',
            currency
        }).format(amount);
    }

    openLanguageSwitcher() {
        const modal = document.createElement('div');
        modal.className = 'language-switcher-modal';
        modal.id = 'languageSwitcherModal';

        const currentLang = this.getCurrentLanguageInfo();

        modal.innerHTML = `
            <div class="language-modal-content">
                <div class="language-modal-header">
                    <h2>🌍 ${this.t('settings.language')}</h2>
                    <button onclick="document.getElementById('languageSwitcherModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="current-language">
                    <div class="current-lang-label">${this.t('common.current')}:</div>
                    <div class="current-lang-display">
                        <span class="lang-flag">${currentLang.flag}</span>
                        <span class="lang-name">${currentLang.nativeName}</span>
                    </div>
                </div>

                <div class="language-list">
                    ${this.supportedLanguages.map(lang => `
                        <button class="language-option ${lang.code === this.currentLanguage ? 'active' : ''}"
                                onclick="window.multiLanguageSystem.selectLanguage('${lang.code}')">
                            <span class="lang-flag">${lang.flag}</span>
                            <div class="lang-info">
                                <div class="lang-native">${lang.nativeName}</div>
                                <div class="lang-english">${lang.name}</div>
                            </div>
                            ${lang.code === this.currentLanguage ? '<span class="lang-checkmark">✓</span>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.addLanguageSwitcherStyles();
        document.body.appendChild(modal);
    }

    async selectLanguage(languageCode) {
        await this.changeLanguage(languageCode);

        // Close modal
        document.getElementById('languageSwitcherModal').remove();

        // Show success message
        const langInfo = this.supportedLanguages.find(l => l.code === languageCode);
        alert(`Language changed to ${langInfo.nativeName}!`);
    }

    addLanguageSwitcherStyles() {
        if (document.getElementById('languageSwitcherStyles')) return;

        const style = document.createElement('style');
        style.id = 'languageSwitcherStyles';
        style.textContent = `
            .language-switcher-modal {
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

            .language-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .language-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .language-modal-header h2 {
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

            .current-language {
                padding: 20px 30px;
                background: #f9f9f9;
                border-bottom: 2px solid #e0e0e0;
            }

            .current-lang-label {
                font-size: 13px;
                font-weight: 600;
                color: #666;
                margin-bottom: 8px;
            }

            .current-lang-display {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .lang-flag {
                font-size: 32px;
            }

            .lang-name {
                font-size: 20px;
                font-weight: 600;
            }

            .language-list {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            }

            .language-option {
                width: 100%;
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                margin-bottom: 10px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            }

            .language-option:hover {
                border-color: #667eea;
                background: #f9f9ff;
            }

            .language-option.active {
                border-color: #667eea;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            }

            .language-option .lang-flag {
                font-size: 36px;
            }

            .lang-info {
                flex: 1;
                text-align: left;
            }

            .lang-native {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 3px;
            }

            .lang-english {
                font-size: 13px;
                color: #666;
            }

            .lang-checkmark {
                color: #667eea;
                font-size: 24px;
                font-weight: bold;
            }

            /* RTL Support */
            .rtl .language-option {
                text-align: right;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        document.head.appendChild(style);
    }

    // Storage functions
    loadLanguage() {
        const saved = localStorage.getItem('preferred_language');
        if (saved && this.supportedLanguages.find(lang => lang.code === saved)) {
            return saved;
        }

        // Try to detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];

        if (this.supportedLanguages.find(lang => lang.code === langCode)) {
            return langCode;
        }

        return this.fallbackLanguage;
    }

    saveLanguage() {
        localStorage.setItem('preferred_language', this.currentLanguage);
    }
}

// Initialize the multi-language system
if (typeof window !== 'undefined') {
    window.multiLanguageSystem = new MultiLanguageSystem();
    console.log('🌍 Multi-Language System ready!');

    // Helper function for easy translation
    window.t = (key, params) => window.multiLanguageSystem.t(key, params);
    window.plural = (key, count) => window.multiLanguageSystem.plural(key, count);
}
