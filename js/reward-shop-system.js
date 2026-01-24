/**
 * 🛍️ DIVINE TEMPLE - REWARD SHOP SYSTEM
 *
 * Allows users to spend XP on unlockable content and customizations.
 * Provides progression goals beyond leveling and achievements.
 *
 * Features:
 * - Themes (color schemes, backgrounds)
 * - Sound packs (premium meditation sounds)
 * - Oracle decks (exclusive card sets)
 * - Profile customization (avatars, badges)
 * - Celebration effects (particle styles)
 */

class RewardShopSystem {
    constructor() {
        this.currentUser = null;
        this.shopData = null;
        this.isInitialized = false;

        // Define all shop items
        this.shopCatalog = {
            themes: [
                {
                    id: 'theme_sunset',
                    name: 'Sunset Serenity',
                    description: 'Warm orange and pink gradients',
                    cost: 500,
                    icon: '🌅',
                    type: 'theme',
                    preview: 'linear-gradient(135deg, #ff6b6b, #feca57, #ee5a6f)'
                },
                {
                    id: 'theme_ocean',
                    name: 'Ocean Depths',
                    description: 'Deep blue and teal tones',
                    cost: 500,
                    icon: '🌊',
                    type: 'theme',
                    preview: 'linear-gradient(135deg, #1e3c72, #2a5298, #7303c0)'
                },
                {
                    id: 'theme_forest',
                    name: 'Forest Sanctuary',
                    description: 'Natural green and earth tones',
                    cost: 500,
                    icon: '🌲',
                    type: 'theme',
                    preview: 'linear-gradient(135deg, #134e5e, #71b280)'
                },
                {
                    id: 'theme_aurora',
                    name: 'Aurora Borealis',
                    description: 'Mystical northern lights',
                    cost: 1000,
                    icon: '🌌',
                    type: 'theme',
                    premium: true,
                    preview: 'linear-gradient(135deg, #00d2ff, #928dab, #ff00ff)'
                },
                {
                    id: 'theme_golden',
                    name: 'Golden Temple',
                    description: 'Luxurious gold and purple',
                    cost: 1500,
                    icon: '👑',
                    type: 'theme',
                    premium: true,
                    preview: 'linear-gradient(135deg, #D4AF37, #FFD700, #8B5CF6)'
                }
            ],
            sounds: [
                {
                    id: 'sound_tibetan',
                    name: 'Tibetan Singing Bowls',
                    description: 'Deep resonant bowl tones',
                    cost: 300,
                    icon: '🎵',
                    type: 'sound'
                },
                {
                    id: 'sound_rain',
                    name: 'Rainforest Ambience',
                    description: 'Gentle rain and birds',
                    cost: 300,
                    icon: '🌧️',
                    type: 'sound'
                },
                {
                    id: 'sound_ocean',
                    name: 'Ocean Waves',
                    description: 'Calming beach sounds',
                    cost: 300,
                    icon: '🌊',
                    type: 'sound'
                },
                {
                    id: 'sound_crystal',
                    name: 'Crystal Harmonics',
                    description: 'Pure crystalline tones',
                    cost: 600,
                    icon: '💎',
                    type: 'sound',
                    premium: true
                },
                {
                    id: 'sound_cosmic',
                    name: 'Cosmic Frequencies',
                    description: 'Space-inspired soundscapes',
                    cost: 800,
                    icon: '🌌',
                    type: 'sound',
                    premium: true
                }
            ],
            decks: [
                {
                    id: 'deck_angels',
                    name: 'Angel Guidance Deck',
                    description: '44 angelic messages',
                    cost: 800,
                    icon: '👼',
                    type: 'deck'
                },
                {
                    id: 'deck_crystals',
                    name: 'Crystal Oracle Deck',
                    description: '48 crystal wisdom cards',
                    cost: 800,
                    icon: '💎',
                    type: 'deck'
                },
                {
                    id: 'deck_goddess',
                    name: 'Goddess Power Deck',
                    description: '52 divine feminine cards',
                    cost: 1000,
                    icon: '👸',
                    type: 'deck',
                    premium: true
                },
                {
                    id: 'deck_ancient',
                    name: 'Ancient Wisdom Deck',
                    description: '78 mystical teachings',
                    cost: 1500,
                    icon: '📜',
                    type: 'deck',
                    premium: true
                }
            ],
            effects: [
                {
                    id: 'effect_rainbow',
                    name: 'Rainbow Celebration',
                    description: 'Colorful particle burst',
                    cost: 400,
                    icon: '🌈',
                    type: 'effect'
                },
                {
                    id: 'effect_stars',
                    name: 'Starfall Effect',
                    description: 'Falling stars animation',
                    cost: 400,
                    icon: '⭐',
                    type: 'effect'
                },
                {
                    id: 'effect_hearts',
                    name: 'Love & Light',
                    description: 'Floating hearts',
                    cost: 400,
                    icon: '💖',
                    type: 'effect'
                },
                {
                    id: 'effect_divine',
                    name: 'Divine Radiance',
                    description: 'Golden light rays',
                    cost: 1000,
                    icon: '✨',
                    type: 'effect',
                    premium: true
                }
            ],
            avatars: [
                {
                    id: 'avatar_lotus',
                    name: 'Lotus Master',
                    description: 'Sacred lotus symbol',
                    cost: 200,
                    icon: '🪷',
                    type: 'avatar'
                },
                {
                    id: 'avatar_om',
                    name: 'Om Symbol',
                    description: 'Universal sound',
                    cost: 200,
                    icon: '🕉️',
                    type: 'avatar'
                },
                {
                    id: 'avatar_phoenix',
                    name: 'Phoenix Rising',
                    description: 'Transformation symbol',
                    cost: 500,
                    icon: '🔥',
                    type: 'avatar',
                    premium: true
                },
                {
                    id: 'avatar_dragon',
                    name: 'Mystic Dragon',
                    description: 'Eastern wisdom',
                    cost: 800,
                    icon: '🐉',
                    type: 'avatar',
                    premium: true
                }
            ],
            boosters: [
                {
                    id: 'boost_xp_24h',
                    name: '24h XP Booster',
                    description: '+50% XP for 24 hours',
                    cost: 300,
                    icon: '⚡',
                    type: 'booster',
                    duration: 24 * 60 * 60 * 1000
                },
                {
                    id: 'boost_xp_week',
                    name: 'Weekly XP Booster',
                    description: '+50% XP for 7 days',
                    cost: 1500,
                    icon: '⚡⚡',
                    type: 'booster',
                    duration: 7 * 24 * 60 * 60 * 1000
                },
                {
                    id: 'boost_double_xp',
                    name: 'Double XP (24h)',
                    description: '2x XP for 24 hours',
                    cost: 2000,
                    icon: '💫',
                    type: 'booster',
                    premium: true,
                    duration: 24 * 60 * 60 * 1000,
                    multiplier: 2
                }
            ],
            knowledge: [
                {
                    id: 'knowledge_etymology',
                    name: 'Hidden Etymology Guide',
                    description: 'Deep dive into Hebrew roots and mistranslations',
                    cost: 300,
                    icon: '📖',
                    type: 'knowledge',
                    content: 'etymology_guide.pdf'
                },
                {
                    id: 'knowledge_mistranslations',
                    name: 'Mistranslation Decoder',
                    description: 'PDF of all major biblical mistranslations',
                    cost: 500,
                    icon: '📜',
                    type: 'knowledge',
                    content: 'mistranslations.pdf'
                },
                {
                    id: 'knowledge_names',
                    name: 'Sacred Name Codex',
                    description: 'Complete guide to YHWH, Elohim, El, Yah',
                    cost: 400,
                    icon: '🔍',
                    type: 'knowledge',
                    content: 'sacred_names.pdf'
                },
                {
                    id: 'knowledge_cosmology',
                    name: 'Cosmology Primer',
                    description: '"What Ya Heard Me Speaks of You" teachings',
                    cost: 600,
                    icon: '🌟',
                    type: 'knowledge',
                    premium: true,
                    content: 'cosmology_primer.pdf'
                },
                {
                    id: 'knowledge_nazarite',
                    name: 'Nazarite Path Manual',
                    description: 'Guide to consecration and righteousness',
                    cost: 800,
                    icon: '👑',
                    type: 'knowledge',
                    premium: true,
                    content: 'nazarite_manual.pdf'
                },
                {
                    id: 'knowledge_glossary',
                    name: 'Full Glossary Access',
                    description: 'Complete book glossary of all terms',
                    cost: 1500,
                    icon: '📚',
                    type: 'knowledge',
                    premium: true,
                    content: 'full_glossary.pdf'
                }
            ],
            customization: [
                // Title Badges
                {
                    id: 'title_truth_awakened',
                    name: 'Truth Awakened',
                    description: 'Title: "Truth Awakened"',
                    cost: 500,
                    icon: '✨',
                    type: 'title',
                    displayText: 'Truth Awakened'
                },
                {
                    id: 'title_etymology_scholar',
                    name: 'Etymology Scholar',
                    description: 'Title: "Etymology Scholar"',
                    cost: 800,
                    icon: '📜',
                    type: 'title',
                    displayText: 'Etymology Scholar'
                },
                {
                    id: 'title_hebrew_sage',
                    name: 'Hebrew Sage',
                    description: 'Title: "Hebrew Sage"',
                    cost: 1000,
                    icon: '🕎',
                    type: 'title',
                    premium: true,
                    displayText: 'Hebrew Sage'
                },
                {
                    id: 'title_consecrated_seeker',
                    name: 'Consecrated Seeker',
                    description: 'Title: "Consecrated Seeker"',
                    cost: 1200,
                    icon: '🔥',
                    type: 'title',
                    premium: true,
                    displayText: 'Consecrated Seeker'
                },
                {
                    id: 'title_child_yhwh',
                    name: 'Child of YHWH',
                    description: 'Title: "Child of YHWH"',
                    cost: 2000,
                    icon: '👑',
                    type: 'title',
                    premium: true,
                    displayText: 'Child of YHWH'
                },
                // Profile Frames
                {
                    id: 'frame_golden_seal',
                    name: 'Golden Seal of El',
                    description: 'Golden border frame',
                    cost: 800,
                    icon: '🔱',
                    type: 'frame',
                    cssClass: 'frame-golden-seal'
                },
                {
                    id: 'frame_tetragrammaton',
                    name: 'Tetragrammaton Border',
                    description: 'Sacred name border',
                    cost: 1000,
                    icon: '🔯',
                    type: 'frame',
                    premium: true,
                    cssClass: 'frame-tetragrammaton'
                },
                {
                    id: 'frame_nazarite',
                    name: 'Nazarite Crown',
                    description: 'Consecrated crown frame',
                    cost: 1500,
                    icon: '👑',
                    type: 'frame',
                    premium: true,
                    cssClass: 'frame-nazarite'
                },
                {
                    id: 'frame_divine_flame',
                    name: 'Divine Flame Aura',
                    description: 'Animated fire border',
                    cost: 2000,
                    icon: '🔥',
                    type: 'frame',
                    premium: true,
                    cssClass: 'frame-divine-flame'
                },
                // Profile Badges
                {
                    id: 'badge_truth_seeker',
                    name: 'Truth Seeker Badge',
                    description: 'Display achievement badge',
                    cost: 300,
                    icon: '🎯',
                    type: 'badge'
                },
                {
                    id: 'badge_master_teacher',
                    name: 'Master Teacher Badge',
                    description: 'Display achievement badge',
                    cost: 1200,
                    icon: '📚',
                    type: 'badge',
                    premium: true
                },
                {
                    id: 'badge_nazir_elite',
                    name: 'Nazir Elite Badge',
                    description: 'Display elite status badge',
                    cost: 2100,
                    icon: '⭐',
                    type: 'badge',
                    premium: true,
                    requiredLevel: 21
                }
            ]
        };

        this.init();
    }

    async init() {
        console.log('🛍️ Initializing Reward Shop System...');

        // Wait for Firebase auth
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged(async (user) => {
                this.currentUser = user;
                if (user) {
                    await this.loadShopData();
                } else {
                    this.loadLocalShopData();
                }
                this.isInitialized = true;
                console.log('✅ Reward Shop System ready');
            });
        } else {
            this.loadLocalShopData();
            this.isInitialized = true;
            console.log('✅ Reward Shop System ready (local mode)');
        }
    }

    // ==================== DATA MANAGEMENT ====================
    async loadShopData() {
        if (!this.currentUser) return;

        try {
            const db = firebase.firestore();
            const doc = await db.collection('rewardShop').doc(this.currentUser.uid).get();

            if (doc.exists) {
                this.shopData = doc.data();
            } else {
                this.shopData = this.getDefaultShopData();
                await this.saveShopData();
            }
        } catch (error) {
            console.error('Error loading shop data:', error);
            this.loadLocalShopData();
        }
    }

    loadLocalShopData() {
        const saved = localStorage.getItem('rewardShopData');
        if (saved) {
            this.shopData = JSON.parse(saved);
        } else {
            this.shopData = this.getDefaultShopData();
            this.saveLocalShopData();
        }
    }

    getDefaultShopData() {
        return {
            ownedItems: [],
            activeTheme: 'default',
            activeSound: 'default',
            activeEffect: 'default',
            activeAvatar: 'default',
            activeBoosters: [],
            purchaseHistory: []
        };
    }

    async saveShopData() {
        if (this.currentUser && typeof firebase !== 'undefined') {
            try {
                const db = firebase.firestore();
                await db.collection('rewardShop').doc(this.currentUser.uid).set(this.shopData);
            } catch (error) {
                console.error('Error saving shop data:', error);
            }
        }
        this.saveLocalShopData();
    }

    saveLocalShopData() {
        localStorage.setItem('rewardShopData', JSON.stringify(this.shopData));
    }

    // ==================== SHOP OPERATIONS ====================
    async purchaseItem(itemId) {
        const item = this.findItemById(itemId);
        if (!item) {
            return { success: false, message: 'Item not found' };
        }

        // Check if already owned
        if (this.isItemOwned(itemId)) {
            return { success: false, message: 'Already owned' };
        }

        // Check if user has enough XP
        const userXP = window.progressSystem?.userData?.totalXP || 0;
        if (userXP < item.cost) {
            return { success: false, message: `Need ${item.cost - userXP} more XP` };
        }

        // Deduct XP
        if (window.progressSystem) {
            window.progressSystem.userData.totalXP -= item.cost;
            await window.progressSystem.saveUserData();
        }

        // Add to owned items
        this.shopData.ownedItems.push({
            id: itemId,
            purchasedAt: new Date().toISOString(),
            cost: item.cost
        });

        // Add to purchase history
        this.shopData.purchaseHistory.unshift({
            itemId,
            itemName: item.name,
            cost: item.cost,
            date: new Date().toISOString()
        });

        // Auto-activate certain items
        if (item.type === 'theme') {
            this.shopData.activeTheme = itemId;
            this.applyTheme(itemId);
        } else if (item.type === 'booster') {
            this.activateBooster(item);
        }

        await this.saveShopData();

        this.showPurchaseNotification(item);

        return { success: true, message: 'Purchase successful!' };
    }

    activateBooster(item) {
        const booster = {
            id: item.id,
            activatedAt: Date.now(),
            expiresAt: Date.now() + item.duration,
            multiplier: item.multiplier || 1.5
        };

        this.shopData.activeBoosters.push(booster);
        this.saveShopData();

        // Set expiration timer
        setTimeout(() => {
            this.expireBooster(item.id);
        }, item.duration);
    }

    expireBooster(boosterId) {
        this.shopData.activeBoosters = this.shopData.activeBoosters.filter(b => b.id !== boosterId);
        this.saveShopData();
        console.log(`⚡ Booster expired: ${boosterId}`);
    }

    getActiveBoosterMultiplier() {
        let multiplier = 1;
        const now = Date.now();

        this.shopData.activeBoosters.forEach(booster => {
            if (booster.expiresAt > now) {
                multiplier *= booster.multiplier;
            }
        });

        return multiplier;
    }

    findItemById(itemId) {
        for (const category of Object.values(this.shopCatalog)) {
            const item = category.find(i => i.id === itemId);
            if (item) return item;
        }
        return null;
    }

    isItemOwned(itemId) {
        return this.shopData.ownedItems.some(item => item.id === itemId);
    }

    applyTheme(themeId) {
        const theme = this.findItemById(themeId);
        if (!theme) return;

        // Apply theme to document root
        document.documentElement.style.setProperty('--theme-gradient', theme.preview);

        // Notify other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { themeId, theme }
        }));

        console.log(`🎨 Theme applied: ${theme.name}`);
    }

    activateItem(itemId, type) {
        switch (type) {
            case 'theme':
                this.shopData.activeTheme = itemId;
                this.applyTheme(itemId);
                break;
            case 'sound':
                this.shopData.activeSound = itemId;
                break;
            case 'effect':
                this.shopData.activeEffect = itemId;
                break;
            case 'avatar':
                this.shopData.activeAvatar = itemId;
                break;
        }

        this.saveShopData();
    }

    // ==================== UI NOTIFICATIONS ====================
    showPurchaseNotification(item) {
        const notification = document.createElement('div');
        notification.className = 'purchase-notification';
        notification.innerHTML = `
            <div class="purchase-content">
                <div class="purchase-icon">${item.icon}</div>
                <div class="purchase-text">
                    <div class="purchase-title">Purchase Complete!</div>
                    <div class="purchase-name">${item.name}</div>
                    <div class="purchase-cost">-${item.cost} XP</div>
                </div>
            </div>
            <style>
                .purchase-notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(255, 215, 0, 0.95));
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 40px rgba(212, 175, 55, 0.5);
                    z-index: 99999;
                    animation: slideInRight 0.5s ease;
                    max-width: 350px;
                }

                .purchase-content {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    color: #0F0F23;
                }

                .purchase-icon {
                    font-size: 3rem;
                }

                .purchase-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0.25rem;
                }

                .purchase-name {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }

                .purchase-cost {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #8B5CF6;
                }
            </style>
        `;

        document.body.appendChild(notification);

        // Play sound
        if (window.divineAudio) {
            window.divineAudio.playBell(639, 2);
        }

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // ==================== PUBLIC API ====================
    getCatalog() {
        return this.shopCatalog;
    }

    getOwnedItems() {
        return this.shopData.ownedItems;
    }

    getActiveItems() {
        return {
            theme: this.shopData.activeTheme,
            sound: this.shopData.activeSound,
            effect: this.shopData.activeEffect,
            avatar: this.shopData.activeAvatar,
            boosters: this.shopData.activeBoosters
        };
    }

    getPurchaseHistory() {
        return this.shopData.purchaseHistory;
    }

    canAfford(itemId) {
        const item = this.findItemById(itemId);
        if (!item) return false;

        const userXP = window.progressSystem?.userData?.totalXP || 0;
        return userXP >= item.cost;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.rewardShop = new RewardShopSystem();
    });
} else {
    window.rewardShop = new RewardShopSystem();
}

console.log('🛍️ Reward Shop System loaded');
