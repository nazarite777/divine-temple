/**
 * Divine Temple Freemium Configuration
 *
 * Update your Medium blog URL and other freemium settings here
 */

const FREEMIUM_CONFIG = {
    // 📚 Your Medium Blog URL
    // Replace with your actual Medium article/blog URL
    mediumBlogUrl: 'https://medium.com/@yourhandle/divine-temple-unlock-full-access',

    // 📧 Support Email
    supportEmail: 'support@divinetemple.com',

    // 💎 Premium Features Count
    premiumFeaturesCount: 14,

    // ✨ Free Features
    freeFeatures: [
        'Enochian Calendar',
        'Basic Spiritual Insights',
        'Community Access (Read-Only)'
    ],

    // 💎 Premium Features (for display on free dashboard)
    premiumFeatures: [
        {
            icon: '🧘',
            name: 'Meditation Center',
            description: 'Guided meditations, breathing exercises, and mindfulness practices'
        },
        {
            icon: '🔮',
            name: 'Oracle & Divination',
            description: 'Tarot readings, I Ching, runes, and sacred geometry tools'
        },
        {
            icon: '⚡',
            name: 'Energy Healing',
            description: 'Chakra balancing, aura cleansing, crystal healing database'
        },
        {
            icon: '🙏',
            name: 'Devotion & Growth',
            description: 'Prayer wheel, mantra practice, gratitude journal'
        },
        {
            icon: '📖',
            name: 'Sacred Knowledge',
            description: 'Ancient texts, mystical teachings, dream journal'
        },
        {
            icon: '🎵',
            name: 'Spiritual Music',
            description: 'Solfeggio frequencies, binaural beats, healing sounds'
        },
        {
            icon: '👥',
            name: 'Community',
            description: 'Connect with fellow seekers, share experiences'
        },
        {
            icon: '🎯',
            name: 'Progress Tracking',
            description: 'XP system, daily quests, achievements, insights'
        }
    ],

    // 🎨 Branding
    siteName: 'Divine Temple',
    tagline: 'Your Sacred Spiritual Journey'
};

// Make config available globally
window.FREEMIUM_CONFIG = FREEMIUM_CONFIG;
