/**
 * 🔔 Divine Temple Push Notifications System
 *
 * Features:
 * - Browser push notifications
 * - Service Worker registration
 * - Firebase Cloud Messaging (FCM) integration
 * - Notification permission management
 * - Custom notification types:
 *   - Achievement unlocks
 *   - Daily quest reminders
 *   - Friend activity
 *   - Circle messages
 *   - Streak reminders
 *   - Weekly leaderboard results
 * - Notification scheduling
 * - Do Not Disturb mode
 */

class PushNotificationSystem {
    constructor() {
        this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
        this.permission = Notification.permission;
        this.registration = null;
        this.subscription = null;
        this.fcmToken = null;
        this.settings = this.loadSettings();
        this.init();
    }

    async init() {
        console.log('🔔 Push Notification System initialized');

        if (!this.isSupported) {
            console.warn('Push notifications are not supported in this browser');
            return;
        }

        // Register service worker
        await this.registerServiceWorker();

        // Check permission
        if (this.permission === 'granted') {
            await this.subscribeToPush();
        }

        // Set up event listeners
        this.setupEventListeners();
    }

    loadSettings() {
        const saved = localStorage.getItem('push_notification_settings');
        return saved ? JSON.parse(saved) : {
            enabled: false,
            achievements: true,
            quests: true,
            friends: true,
            circles: true,
            streaks: true,
            leaderboards: true,
            dailyReminder: true,
            reminderTime: '09:00',
            dndEnabled: false,
            dndStart: '22:00',
            dndEnd: '08:00'
        };
    }

    saveSettings() {
        localStorage.setItem('push_notification_settings', JSON.stringify(this.settings));
    }

    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/'
            });

            console.log('Service Worker registered:', this.registration);

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            return this.registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return null;
        }
    }

    async requestPermission() {
        if (!this.isSupported) {
            return {
                success: false,
                message: 'Push notifications not supported in this browser'
            };
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;

            if (permission === 'granted') {
                this.settings.enabled = true;
                this.saveSettings();

                await this.subscribeToPush();

                // 🎯 AWARD XP
                if (window.progressSystem) {
                    window.progressSystem.awardXP(20, 'Enabled push notifications', 'settings');
                }

                return {
                    success: true,
                    message: 'Push notifications enabled! 🔔'
                };
            } else if (permission === 'denied') {
                return {
                    success: false,
                    message: 'Push notifications blocked. Please enable them in browser settings.'
                };
            } else {
                return {
                    success: false,
                    message: 'Push notification permission not granted'
                };
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return {
                success: false,
                message: 'Failed to request permission'
            };
        }
    }

    async subscribeToPush() {
        if (!this.registration) {
            await this.registerServiceWorker();
        }

        if (!this.registration) {
            console.error('No service worker registration');
            return null;
        }

        try {
            // Check if already subscribed
            let subscription = await this.registration.pushManager.getSubscription();

            if (!subscription) {
                // Create new subscription
                // In production, you'd use your own VAPID public key
                const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';

                subscription = await this.registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
                });
            }

            this.subscription = subscription;

            // Send subscription to server (if using Firebase)
            if (typeof firebase !== 'undefined' && firebase.auth) {
                await this.sendSubscriptionToServer(subscription);
            }

            console.log('Push subscription created:', subscription);
            return subscription;

        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            return null;
        }
    }

    async sendSubscriptionToServer(subscription) {
        const user = firebase.auth().currentUser;
        if (!user) return;

        try {
            const db = firebase.firestore();

            await db.collection('pushSubscriptions').doc(user.uid).set({
                userId: user.uid,
                subscription: JSON.parse(JSON.stringify(subscription)),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                settings: this.settings
            }, { merge: true });

            console.log('Push subscription saved to server');
        } catch (error) {
            console.error('Error saving push subscription:', error);
        }
    }

    async unsubscribeFromPush() {
        if (!this.subscription) {
            return { success: true };
        }

        try {
            await this.subscription.unsubscribe();
            this.subscription = null;
            this.settings.enabled = false;
            this.saveSettings();

            // Remove from server
            if (typeof firebase !== 'undefined' && firebase.auth) {
                const user = firebase.auth().currentUser;
                if (user) {
                    const db = firebase.firestore();
                    await db.collection('pushSubscriptions').doc(user.uid).delete();
                }
            }

            return {
                success: true,
                message: 'Push notifications disabled'
            };
        } catch (error) {
            console.error('Error unsubscribing from push:', error);
            return {
                success: false,
                message: 'Failed to disable notifications'
            };
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    setupEventListeners() {
        // Listen for achievement unlocks
        window.addEventListener('achievement-unlocked', (e) => {
            if (this.settings.enabled && this.settings.achievements && !this.isDNDActive()) {
                this.showNotification({
                    title: 'Achievement Unlocked! 🏆',
                    body: `${e.detail.name}`,
                    icon: '/img/achievement-icon.png',
                    tag: 'achievement',
                    data: { type: 'achievement', id: e.detail.id }
                });
            }
        });

        // Listen for level ups
        window.addEventListener('level-up', (e) => {
            if (this.settings.enabled && !this.isDNDActive()) {
                this.showNotification({
                    title: 'Level Up! 🎉',
                    body: `Congratulations! You reached Level ${e.detail.level}!`,
                    icon: '/img/level-up-icon.png',
                    tag: 'level-up',
                    data: { type: 'level-up', level: e.detail.level }
                });
            }
        });

        // Listen for friend activity
        window.addEventListener('friend-activity-added', (e) => {
            if (this.settings.enabled && this.settings.friends && !this.isDNDActive()) {
                const activity = e.detail;
                if (activity.type === 'achievement') {
                    this.showNotification({
                        title: 'Friend Activity 👥',
                        body: `${activity.userName} unlocked ${activity.data.name}!`,
                        icon: '/img/friend-icon.png',
                        tag: 'friend-activity',
                        data: { type: 'friend-activity', ...activity }
                    });
                }
            }
        });
    }

    async showNotification(options) {
        if (this.permission !== 'granted') {
            console.log('Notification permission not granted');
            return;
        }

        if (!this.registration) {
            await this.registerServiceWorker();
        }

        if (!this.registration) {
            console.error('No service worker registration for notifications');
            return;
        }

        try {
            const notificationOptions = {
                body: options.body,
                icon: options.icon || '/img/logo-192x192.png',
                badge: options.badge || '/img/badge-icon.png',
                tag: options.tag || 'default',
                requireInteraction: options.requireInteraction || false,
                silent: options.silent || false,
                data: options.data || {},
                actions: options.actions || []
            };

            await this.registration.showNotification(options.title, notificationOptions);

            console.log('Notification shown:', options.title);
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    async scheduleDailyReminder() {
        if (!this.settings.dailyReminder || !this.settings.enabled) {
            return;
        }

        const now = new Date();
        const reminderTime = this.settings.reminderTime.split(':');
        const scheduledTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            parseInt(reminderTime[0]),
            parseInt(reminderTime[1])
        );

        // If time has passed today, schedule for tomorrow
        if (scheduledTime < now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const delay = scheduledTime.getTime() - now.getTime();

        setTimeout(() => {
            this.showNotification({
                title: 'Daily Practice Reminder 🧘',
                body: 'Time for your spiritual practice! Complete your daily quests.',
                icon: '/img/daily-reminder-icon.png',
                tag: 'daily-reminder',
                requireInteraction: true,
                actions: [
                    { action: 'view-quests', title: 'View Quests' },
                    { action: 'dismiss', title: 'Later' }
                ],
                data: { type: 'daily-reminder' }
            });

            // Schedule next day's reminder
            this.scheduleDailyReminder();
        }, delay);

        console.log(`Daily reminder scheduled for ${scheduledTime.toLocaleString()}`);
    }

    async scheduleStreakReminder() {
        if (!this.settings.streaks || !this.settings.enabled) {
            return;
        }

        // Check streak at 8 PM
        const now = new Date();
        const reminderTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            20, // 8 PM
            0
        );

        if (reminderTime < now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const delay = reminderTime.getTime() - now.getTime();

        setTimeout(() => {
            // Check if user completed activity today
            const lastActive = localStorage.getItem('last_active_date');
            const today = new Date().toISOString().split('T')[0];

            if (lastActive !== today) {
                this.showNotification({
                    title: 'Streak Reminder 🔥',
                    body: "Don't break your streak! Complete at least one activity today.",
                    icon: '/img/streak-icon.png',
                    tag: 'streak-reminder',
                    requireInteraction: true,
                    data: { type: 'streak-reminder' }
                });
            }

            // Schedule next day's reminder
            this.scheduleStreakReminder();
        }, delay);
    }

    isDNDActive() {
        if (!this.settings.dndEnabled) {
            return false;
        }

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const start = this.settings.dndStart;
        const end = this.settings.dndEnd;

        // Handle overnight DND (e.g., 22:00 to 08:00)
        if (start > end) {
            return currentTime >= start || currentTime <= end;
        }

        // Handle same-day DND (e.g., 12:00 to 14:00)
        return currentTime >= start && currentTime <= end;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();

        // Update server settings
        if (typeof firebase !== 'undefined' && firebase.auth) {
            const user = firebase.auth().currentUser;
            if (user) {
                const db = firebase.firestore();
                db.collection('pushSubscriptions').doc(user.uid).update({
                    settings: this.settings
                }).catch(err => console.error('Error updating settings:', err));
            }
        }

        // Restart schedulers if needed
        if (newSettings.dailyReminder !== undefined || newSettings.reminderTime !== undefined) {
            this.scheduleDailyReminder();
        }

        if (newSettings.streaks !== undefined) {
            this.scheduleStreakReminder();
        }
    }

    openSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'notification-settings-modal';
        modal.id = 'notificationSettingsModal';

        modal.innerHTML = `
            <div class="notification-modal-content">
                <div class="notification-modal-header">
                    <h2>🔔 Notification Settings</h2>
                    <button onclick="document.getElementById('notificationSettingsModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="notification-modal-body">
                    ${!this.isSupported ? `
                        <div class="notification-warning">
                            ⚠️ Push notifications are not supported in this browser.
                        </div>
                    ` : ''}

                    ${this.permission === 'denied' ? `
                        <div class="notification-error">
                            ❌ Push notifications are blocked. Please enable them in your browser settings.
                        </div>
                    ` : ''}

                    <div class="notification-permission-section">
                        <h3>🔔 Enable Notifications</h3>
                        <p>Get notified about achievements, quests, and friend activity.</p>

                        ${this.permission === 'granted' ? `
                            <div class="permission-status enabled">
                                ✅ Notifications Enabled
                            </div>
                            <button onclick="window.pushNotificationSystem.disableNotifications()" class="disable-btn">
                                Disable Notifications
                            </button>
                        ` : `
                            <button onclick="window.pushNotificationSystem.enableNotifications()" class="enable-btn">
                                Enable Push Notifications
                            </button>
                        `}
                    </div>

                    ${this.permission === 'granted' ? `
                        <div class="notification-types">
                            <h3>📋 Notification Types</h3>

                            <label class="notification-toggle">
                                <input type="checkbox" ${this.settings.achievements ? 'checked' : ''}
                                       onchange="window.pushNotificationSystem.toggleSetting('achievements', this.checked)">
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">🏆 Achievement Unlocks</span>
                            </label>

                            <label class="notification-toggle">
                                <input type="checkbox" ${this.settings.quests ? 'checked' : ''}
                                       onchange="window.pushNotificationSystem.toggleSetting('quests', this.checked)">
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">📋 Daily Quest Reminders</span>
                            </label>

                            <label class="notification-toggle">
                                <input type="checkbox" ${this.settings.friends ? 'checked' : ''}
                                       onchange="window.pushNotificationSystem.toggleSetting('friends', this.checked)">
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">👥 Friend Activity</span>
                            </label>

                            <label class="notification-toggle">
                                <input type="checkbox" ${this.settings.circles ? 'checked' : ''}
                                       onchange="window.pushNotificationSystem.toggleSetting('circles', this.checked)">
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">🏰 Circle Messages</span>
                            </label>

                            <label class="notification-toggle">
                                <input type="checkbox" ${this.settings.streaks ? 'checked' : ''}
                                       onchange="window.pushNotificationSystem.toggleSetting('streaks', this.checked)">
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">🔥 Streak Reminders</span>
                            </label>

                            <label class="notification-toggle">
                                <input type="checkbox" ${this.settings.leaderboards ? 'checked' : ''}
                                       onchange="window.pushNotificationSystem.toggleSetting('leaderboards', this.checked)">
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">🏆 Leaderboard Updates</span>
                            </label>
                        </div>

                        <div class="daily-reminder-section">
                            <h3>⏰ Daily Reminder</h3>
                            <label class="notification-toggle">
                                <input type="checkbox" ${this.settings.dailyReminder ? 'checked' : ''}
                                       onchange="window.pushNotificationSystem.toggleSetting('dailyReminder', this.checked)">
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">Enable Daily Reminder</span>
                            </label>

                            ${this.settings.dailyReminder ? `
                                <div class="time-picker">
                                    <label>Reminder Time:</label>
                                    <input type="time" value="${this.settings.reminderTime}"
                                           onchange="window.pushNotificationSystem.updateSettings({ reminderTime: this.value })"
                                           class="time-input">
                                </div>
                            ` : ''}
                        </div>

                        <div class="dnd-section">
                            <h3>🌙 Do Not Disturb</h3>
                            <label class="notification-toggle">
                                <input type="checkbox" ${this.settings.dndEnabled ? 'checked' : ''}
                                       onchange="window.pushNotificationSystem.toggleDND(this.checked)">
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">Enable Do Not Disturb</span>
                            </label>

                            ${this.settings.dndEnabled ? `
                                <div class="dnd-times">
                                    <div class="time-picker">
                                        <label>From:</label>
                                        <input type="time" value="${this.settings.dndStart}"
                                               onchange="window.pushNotificationSystem.updateSettings({ dndStart: this.value })"
                                               class="time-input">
                                    </div>
                                    <div class="time-picker">
                                        <label>To:</label>
                                        <input type="time" value="${this.settings.dndEnd}"
                                               onchange="window.pushNotificationSystem.updateSettings({ dndEnd: this.value })"
                                               class="time-input">
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <div class="test-notification-section">
                            <button onclick="window.pushNotificationSystem.sendTestNotification()" class="test-btn">
                                🔔 Send Test Notification
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        this.addNotificationStyles();
        document.body.appendChild(modal);
    }

    async enableNotifications() {
        const result = await this.requestPermission();
        alert(result.message);

        if (result.success) {
            // Reload modal
            document.getElementById('notificationSettingsModal').remove();
            this.openSettingsModal();

            // Start schedulers
            this.scheduleDailyReminder();
            this.scheduleStreakReminder();
        }
    }

    async disableNotifications() {
        const result = await this.unsubscribeFromPush();
        alert(result.message);

        if (result.success) {
            // Reload modal
            document.getElementById('notificationSettingsModal').remove();
            this.openSettingsModal();
        }
    }

    toggleSetting(setting, value) {
        this.updateSettings({ [setting]: value });
    }

    toggleDND(enabled) {
        this.updateSettings({ dndEnabled: enabled });

        // Reload modal to show/hide time pickers
        document.getElementById('notificationSettingsModal').remove();
        this.openSettingsModal();
    }

    sendTestNotification() {
        this.showNotification({
            title: 'Test Notification 🔔',
            body: 'If you can see this, notifications are working perfectly!',
            icon: '/img/logo-192x192.png',
            tag: 'test',
            requireInteraction: false,
            data: { type: 'test' }
        });
    }

    addNotificationStyles() {
        if (document.getElementById('notificationSettingsStyles')) return;

        const style = document.createElement('style');
        style.id = 'notificationSettingsStyles';
        style.textContent = `
            .notification-settings-modal {
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

            .notification-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .notification-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .notification-modal-header h2 {
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

            .notification-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 30px;
            }

            .notification-modal-body > div {
                margin-bottom: 30px;
            }

            .notification-modal-body h3 {
                margin: 0 0 15px 0;
                font-size: 18px;
            }

            .notification-warning, .notification-error {
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
            }

            .notification-warning {
                background: #fff3cd;
                border: 2px solid #ffc107;
                color: #856404;
            }

            .notification-error {
                background: #f8d7da;
                border: 2px solid #dc3545;
                color: #721c24;
            }

            .permission-status {
                padding: 15px;
                border-radius: 10px;
                margin: 15px 0;
                font-weight: 600;
            }

            .permission-status.enabled {
                background: #d4edda;
                border: 2px solid #28a745;
                color: #155724;
            }

            .enable-btn, .disable-btn, .test-btn {
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .enable-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .disable-btn {
                background: #f0f0f0;
                color: #666;
            }

            .test-btn {
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                color: white;
                margin-top: 20px;
            }

            .enable-btn:hover, .disable-btn:hover, .test-btn:hover {
                transform: translateY(-2px);
            }

            .notification-toggle {
                display: flex;
                align-items: center;
                padding: 15px;
                background: #f9f9f9;
                border-radius: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .notification-toggle:hover {
                background: #f0f0f0;
            }

            .notification-toggle input[type="checkbox"] {
                display: none;
            }

            .toggle-slider {
                width: 50px;
                height: 26px;
                background: #ccc;
                border-radius: 26px;
                position: relative;
                transition: background 0.2s;
                margin-right: 15px;
            }

            .toggle-slider::before {
                content: '';
                position: absolute;
                width: 22px;
                height: 22px;
                background: white;
                border-radius: 50%;
                top: 2px;
                left: 2px;
                transition: transform 0.2s;
            }

            .notification-toggle input[type="checkbox"]:checked + .toggle-slider {
                background: #667eea;
            }

            .notification-toggle input[type="checkbox"]:checked + .toggle-slider::before {
                transform: translateX(24px);
            }

            .toggle-label {
                font-weight: 600;
            }

            .time-picker {
                margin: 15px 0;
                padding-left: 65px;
            }

            .time-picker label {
                display: block;
                margin-bottom: 5px;
                font-weight: 600;
                color: #666;
                font-size: 14px;
            }

            .time-input {
                padding: 10px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 15px;
                width: 150px;
            }

            .dnd-times {
                display: flex;
                gap: 20px;
                padding-left: 65px;
                margin-top: 15px;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        document.head.appendChild(style);
    }
}

// Initialize the push notification system
if (typeof window !== 'undefined') {
    window.pushNotificationSystem = new PushNotificationSystem();
    console.log('🔔 Push Notification System ready!');
}
