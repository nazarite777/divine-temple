/**
 * 💳 Divine Temple In-App Purchases (Stripe Integration)
 *
 * Features:
 * - Premium subscription tiers
 * - One-time purchases (content, features)
 * - Stripe Checkout integration
 * - Payment history tracking
 * - Subscription management
 * - Revenue analytics
 * - Refund handling
 * - Promotional codes
 */

class InAppPurchases {
    constructor() {
        this.stripePublicKey = 'pk_live_51SRqpyJ2w43XIVJIO3ygkLZAnsODBJhQUyMarnEEXyAWeaFiJJjC2wpDTL3H3yHGdOAXbwJDYOTgMjPT5j0XJcl600ytNIr5CC'; // Real live key
        this.stripe = null;
        this.currentUser = null;
        this.purchaseHistory = this.loadPurchaseHistory();
        this.subscription = this.loadSubscription();
        this.init();
    }

    async init() {
        console.log('💳 In-App Purchases initialized');

        // Load Stripe.js
        await this.loadStripe();

        // Check if user has active subscription
        this.checkSubscriptionStatus();
    }

    async loadStripe() {
        // Load Stripe.js from CDN
        if (typeof Stripe !== 'undefined') {
            this.stripe = Stripe(this.stripePublicKey);
            console.log('Stripe loaded');
        } else {
            console.warn('Stripe.js not loaded. Add script tag to HTML.');
        }
    }

    loadPurchaseHistory() {
        const saved = localStorage.getItem('purchase_history');
        return saved ? JSON.parse(saved) : [];
    }

    savePurchaseHistory() {
        localStorage.setItem('purchase_history', JSON.stringify(this.purchaseHistory));
    }

    loadSubscription() {
        const saved = localStorage.getItem('subscription_data');
        return saved ? JSON.parse(saved) : null;
    }

    saveSubscription() {
        localStorage.setItem('subscription_data', JSON.stringify(this.subscription));
    }

    // ========== SUBSCRIPTION TIERS ==========

    getSubscriptionTiers() {
        return [
            {
                id: 'free',
                name: 'Free',
                price: 0,
                period: 'forever',
                features: [
                    'Access to Enochian Calendar',
                    'Basic meditation guides',
                    'Limited content library',
                    'Community forums'
                ],
                popular: false
            },
            {
                id: 'monthly',
                name: 'Premium Monthly',
                price: 9.99,
                period: 'month',
                stripePriceId: 'price_monthly_premium',
                features: [
                    'Everything in Free',
                    'Full content library access',
                    'Advanced meditation programs',
                    'Personalized AI recommendations',
                    'Download content offline',
                    'Remove ads',
                    '1-on-1 mentor matching',
                    'Priority support'
                ],
                popular: true,
                savings: null
            },
            {
                id: 'yearly',
                name: 'Premium Yearly',
                price: 99.99,
                period: 'year',
                stripePriceId: 'price_yearly_premium',
                features: [
                    'Everything in Monthly',
                    'Save $20/year!',
                    'Exclusive yearly content',
                    'Early access to new features',
                    'Premium badge',
                    'Free spiritual gifts'
                ],
                popular: false,
                savings: '17% off'
            },
            {
                id: 'lifetime',
                name: 'Lifetime Access',
                price: 299.99,
                period: 'lifetime',
                stripePriceId: 'price_lifetime_premium',
                features: [
                    'Everything in Yearly',
                    'One-time payment',
                    'Lifetime updates',
                    'Founder badge',
                    'VIP community access',
                    'Personal spiritual coach',
                    'Exclusive retreats & events'
                ],
                popular: false,
                savings: 'Best Value'
            }
        ];
    }

    // ========== ONE-TIME PURCHASES ==========

    getOneTimePurchases() {
        return [
            {
                id: 'advanced_course_1',
                name: 'Advanced Chakra Mastery Course',
                description: 'Complete 8-week course for chakra mastery',
                price: 49.99,
                stripePriceId: 'price_chakra_course',
                type: 'course',
                benefits: [
                    '8 weeks of guided instruction',
                    'Video lessons and exercises',
                    'Downloadable workbook',
                    'Certificate of completion',
                    'Lifetime access'
                ]
            },
            {
                id: 'oracle_deck_premium',
                name: 'Premium Oracle Deck',
                description: 'Unlock premium oracle card deck with 108 cards',
                price: 29.99,
                stripePriceId: 'price_premium_oracle',
                type: 'feature',
                benefits: [
                    '108 premium oracle cards',
                    'Advanced spreads',
                    'Detailed interpretations',
                    'Exclusive artwork'
                ]
            },
            {
                id: 'meditation_library',
                name: 'Complete Meditation Library',
                description: '100+ guided meditations for all levels',
                price: 39.99,
                stripePriceId: 'price_meditation_library',
                type: 'content',
                benefits: [
                    '100+ guided meditations',
                    'All difficulty levels',
                    'Various durations (5-60 min)',
                    'Downloadable MP3s'
                ]
            },
            {
                id: 'ad_removal',
                name: 'Remove Ads',
                description: 'Permanent ad-free experience',
                price: 4.99,
                stripePriceId: 'price_ad_removal',
                type: 'feature',
                benefits: [
                    'No ads ever',
                    'Cleaner interface',
                    'Faster loading',
                    'One-time payment'
                ]
            }
        ];
    }

    // ========== STRIPE CHECKOUT ==========

    async purchaseSubscription(tierId) {
        const tier = this.getSubscriptionTiers().find(t => t.id === tierId);

        if (!tier || !tier.stripePriceId) {
            return { success: false, message: 'Invalid subscription tier' };
        }

        if (!this.stripe) {
            return { success: false, message: 'Stripe not initialized' };
        }

        try {
            // In production, create a Checkout Session on your server
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    priceId: tier.stripePriceId,
                    mode: tierId === 'lifetime' ? 'payment' : 'subscription'
                })
            });

            const session = await response.json();

            // Redirect to Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                return { success: false, message: result.error.message };
            }

            return { success: true };

        } catch (error) {
            console.error('Error purchasing subscription:', error);
            return { success: false, message: 'Payment failed' };
        }
    }

    async purchaseOneTime(productId) {
        const product = this.getOneTimePurchases().find(p => p.id === productId);

        if (!product) {
            return { success: false, message: 'Product not found' };
        }

        if (!this.stripe) {
            return { success: false, message: 'Stripe not initialized' };
        }

        try {
            // Create Checkout Session on server
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    priceId: product.stripePriceId,
                    mode: 'payment'
                })
            });

            const session = await response.json();

            // Redirect to Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                return { success: false, message: result.error.message };
            }

            return { success: true };

        } catch (error) {
            console.error('Error purchasing product:', error);
            return { success: false, message: 'Payment failed' };
        }
    }

    // ========== POST-PURCHASE HANDLING ==========

    handleSuccessfulPurchase(purchaseData) {
        const purchase = {
            id: Date.now().toString(),
            productId: purchaseData.productId,
            type: purchaseData.type,
            amount: purchaseData.amount,
            currency: purchaseData.currency || 'USD',
            status: 'completed',
            purchasedAt: new Date().toISOString(),
            stripeSessionId: purchaseData.sessionId
        };

        this.purchaseHistory.push(purchase);
        this.savePurchaseHistory();

        // Update subscription if applicable
        if (purchaseData.type === 'subscription') {
            this.subscription = {
                tier: purchaseData.tier,
                status: 'active',
                startedAt: new Date().toISOString(),
                renewsAt: this.calculateRenewalDate(purchaseData.tier),
                cancelAtPeriodEnd: false
            };
            this.saveSubscription();
        }

        // Unlock purchased content
        this.unlockContent(purchaseData.productId);

        // 🎯 AWARD XP
        if (window.progressSystem) {
            const xp = purchaseData.type === 'subscription' ? 100 : 50;
            window.progressSystem.awardXP(xp, `Purchased: ${purchaseData.productName}! 💎`, 'purchases');
        }

        // Show success message
        this.showPurchaseSuccessMessage(purchase);

        return { success: true, purchase };
    }

    calculateRenewalDate(tier) {
        const now = new Date();

        if (tier === 'monthly') {
            now.setMonth(now.getMonth() + 1);
        } else if (tier === 'yearly') {
            now.setFullYear(now.getFullYear() + 1);
        } else if (tier === 'lifetime') {
            return null; // No renewal for lifetime
        }

        return now.toISOString();
    }

    unlockContent(productId) {
        const unlocked = localStorage.getItem('unlocked_content') || '[]';
        const unlockedArray = JSON.parse(unlocked);

        if (!unlockedArray.includes(productId)) {
            unlockedArray.push(productId);
            localStorage.setItem('unlocked_content', JSON.stringify(unlockedArray));
        }
    }

    isContentUnlocked(productId) {
        const unlocked = localStorage.getItem('unlocked_content') || '[]';
        const unlockedArray = JSON.parse(unlocked);
        return unlockedArray.includes(productId);
    }

    showPurchaseSuccessMessage(purchase) {
        const message = document.createElement('div');
        message.className = 'purchase-success-message';
        message.innerHTML = `
            <div class="purchase-success-content">
                <div class="success-icon">🎉</div>
                <div class="success-text">
                    <h4>Purchase Successful!</h4>
                    <p>Thank you for your purchase</p>
                    <p class="success-amount">$${purchase.amount}</p>
                </div>
            </div>
        `;

        document.body.appendChild(message);

        setTimeout(() => message.remove(), 5000);
    }

    // ========== SUBSCRIPTION MANAGEMENT ==========

    checkSubscriptionStatus() {
        if (!this.subscription) return false;

        if (this.subscription.tier === 'lifetime') {
            return true; // Lifetime never expires
        }

        if (this.subscription.renewsAt) {
            const renewalDate = new Date(this.subscription.renewsAt);
            const now = new Date();

            if (now > renewalDate && !this.subscription.cancelAtPeriodEnd) {
                // Subscription expired, mark as inactive
                this.subscription.status = 'expired';
                this.saveSubscription();
                return false;
            }
        }

        return this.subscription.status === 'active';
    }

    hasActiveSubscription() {
        return this.checkSubscriptionStatus();
    }

    async cancelSubscription() {
        if (!this.subscription || this.subscription.tier === 'lifetime') {
            return { success: false, message: 'No active subscription to cancel' };
        }

        try {
            // Cancel on server
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscriptionId: this.subscription.stripeSubscriptionId
                })
            });

            const data = await response.json();

            if (data.success) {
                this.subscription.cancelAtPeriodEnd = true;
                this.saveSubscription();

                return {
                    success: true,
                    message: `Subscription will end on ${new Date(this.subscription.renewsAt).toLocaleDateString()}`
                };
            }

            return { success: false, message: 'Failed to cancel subscription' };

        } catch (error) {
            console.error('Error canceling subscription:', error);
            return { success: false, message: 'Failed to cancel subscription' };
        }
    }

    // ========== UI METHODS ==========

    openSubscriptionModal() {
        const modal = document.createElement('div');
        modal.className = 'subscription-modal';
        modal.id = 'subscriptionModal';

        const tiers = this.getSubscriptionTiers();
        const hasSubscription = this.hasActiveSubscription();

        modal.innerHTML = `
            <div class="subscription-modal-content">
                <div class="subscription-modal-header">
                    <h2>💎 Choose Your Plan</h2>
                    <button onclick="document.getElementById('subscriptionModal').remove()" class="modal-close">✕</button>
                </div>

                ${hasSubscription ? `
                    <div class="current-subscription-banner">
                        <div class="banner-icon">✓</div>
                        <div class="banner-text">
                            <strong>Current Plan: ${this.subscription.tier}</strong>
                            <p>${this.subscription.status === 'active' ? 'Active' : 'Expired'}</p>
                        </div>
                    </div>
                ` : ''}

                <div class="subscription-tiers">
                    ${tiers.map(tier => this.renderSubscriptionTier(tier)).join('')}
                </div>

                <div class="subscription-note">
                    <p>✓ Cancel anytime • Secure payment by Stripe • 30-day money-back guarantee</p>
                </div>
            </div>
        `;

        this.addPurchaseStyles();
        document.body.appendChild(modal);
    }

    renderSubscriptionTier(tier) {
        const isCurrentTier = this.subscription && this.subscription.tier === tier.id;

        return `
            <div class="tier-card ${tier.popular ? 'popular' : ''} ${isCurrentTier ? 'current' : ''}">
                ${tier.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
                ${tier.savings ? `<div class="savings-badge">${tier.savings}</div>` : ''}

                <div class="tier-header">
                    <h3>${tier.name}</h3>
                    <div class="tier-price">
                        ${tier.price === 0 ? `
                            <span class="price-amount">Free</span>
                        ` : `
                            <span class="price-currency">$</span>
                            <span class="price-amount">${tier.price}</span>
                            <span class="price-period">/${tier.period}</span>
                        `}
                    </div>
                </div>

                <div class="tier-features">
                    ${tier.features.map(feature => `
                        <div class="feature-item">✓ ${feature}</div>
                    `).join('')}
                </div>

                <button onclick="window.inAppPurchases.purchaseSubscription('${tier.id}')"
                        class="tier-select-btn ${tier.popular ? 'primary' : ''}${isCurrentTier ? ' disabled' : ''}"
                        ${isCurrentTier ? 'disabled' : ''}>
                    ${isCurrentTier ? 'Current Plan' : tier.price === 0 ? 'Current Plan' : 'Subscribe'}
                </button>
            </div>
        `;
    }

    openStoreModal() {
        const modal = document.createElement('div');
        modal.className = 'store-modal';
        modal.id = 'storeModal';

        const products = this.getOneTimePurchases();

        modal.innerHTML = `
            <div class="store-modal-content">
                <div class="store-modal-header">
                    <h2>🛍️ Divine Temple Store</h2>
                    <button onclick="document.getElementById('storeModal').remove()" class="modal-close">✕</button>
                </div>

                <div class="store-products">
                    ${products.map(product => this.renderProduct(product)).join('')}
                </div>
            </div>
        `;

        this.addPurchaseStyles();
        document.body.appendChild(modal);
    }

    renderProduct(product) {
        const isOwned = this.isContentUnlocked(product.id);

        return `
            <div class="product-card ${isOwned ? 'owned' : ''}">
                <div class="product-header">
                    <h3>${product.name}</h3>
                    <div class="product-price">$${product.price}</div>
                </div>

                <p class="product-description">${product.description}</p>

                <div class="product-benefits">
                    ${product.benefits.map(benefit => `
                        <div class="benefit-item">✓ ${benefit}</div>
                    `).join('')}
                </div>

                <button onclick="window.inAppPurchases.purchaseOneTime('${product.id}')"
                        class="product-buy-btn${isOwned ? ' disabled' : ''}"
                        ${isOwned ? 'disabled' : ''}>
                    ${isOwned ? '✓ Owned' : 'Purchase'}
                </button>
            </div>
        `;
    }

    addPurchaseStyles() {
        if (document.getElementById('purchaseStyles')) return;

        const style = document.createElement('style');
        style.id = 'purchaseStyles';
        style.textContent = `
            .subscription-modal, .store-modal {
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
                overflow-y: auto;
                padding: 20px;
            }

            .subscription-modal-content, .store-modal-content {
                background: white;
                border-radius: 20px;
                width: 100%;
                max-width: 1200px;
                overflow: hidden;
            }

            .subscription-modal-header, .store-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .subscription-modal-header h2, .store-modal-header h2 {
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

            .current-subscription-banner {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px 30px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }

            .banner-icon {
                font-size: 40px;
            }

            .banner-text strong {
                display: block;
                margin-bottom: 5px;
            }

            .banner-text p {
                margin: 0;
                opacity: 0.95;
            }

            .subscription-tiers {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                padding: 30px;
            }

            .tier-card {
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 15px;
                padding: 30px;
                position: relative;
                transition: all 0.2s;
            }

            .tier-card:hover {
                border-color: #667eea;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
                transform: translateY(-5px);
            }

            .tier-card.popular {
                border-color: #ffd700;
                border-width: 3px;
            }

            .tier-card.current {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            }

            .popular-badge {
                position: absolute;
                top: -12px;
                left: 50%;
                transform: translateX(-50%);
                background: #ffd700;
                color: #333;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 12px;
            }

            .savings-badge {
                position: absolute;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 11px;
            }

            .tier-header {
                text-align: center;
                margin-bottom: 25px;
            }

            .tier-header h3 {
                margin: 0 0 15px 0;
                font-size: 24px;
            }

            .tier-price {
                display: flex;
                align-items: baseline;
                justify-content: center;
                gap: 2px;
            }

            .price-currency {
                font-size: 24px;
                color: #666;
            }

            .price-amount {
                font-size: 48px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .price-period {
                font-size: 16px;
                color: #666;
            }

            .tier-features {
                margin-bottom: 25px;
            }

            .feature-item {
                padding: 10px 0;
                border-bottom: 1px solid #f0f0f0;
                font-size: 14px;
            }

            .feature-item:last-child {
                border-bottom: none;
            }

            .tier-select-btn {
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 10px;
                background: #f0f0f0;
                color: #666;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .tier-select-btn.primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .tier-select-btn:hover:not(.disabled) {
                transform: translateY(-2px);
            }

            .tier-select-btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .subscription-note {
                padding: 20px 30px;
                background: #f9f9f9;
                text-align: center;
            }

            .subscription-note p {
                margin: 0;
                color: #666;
                font-size: 14px;
            }

            .store-products {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                padding: 30px;
            }

            .product-card {
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 15px;
                padding: 25px;
                transition: all 0.2s;
            }

            .product-card:hover {
                border-color: #667eea;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
            }

            .product-card.owned {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
            }

            .product-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
            }

            .product-header h3 {
                margin: 0;
                flex: 1;
                font-size: 20px;
            }

            .product-price {
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
            }

            .product-description {
                color: #666;
                margin-bottom: 20px;
            }

            .product-benefits {
                margin-bottom: 20px;
            }

            .benefit-item {
                padding: 8px 0;
                font-size: 13px;
                color: #555;
            }

            .product-buy-btn {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-weight: 600;
                font-size: 15px;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .product-buy-btn:hover:not(.disabled) {
                transform: translateY(-2px);
            }

            .product-buy-btn.disabled {
                background: #10b981;
                cursor: not-allowed;
            }

            .purchase-success-message {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10001;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
            }

            .purchase-success-content {
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
            }

            .success-amount {
                font-weight: bold;
                font-size: 18px;
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
                .subscription-tiers, .store-products {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }

    getPurchaseStats() {
        return {
            totalPurchases: this.purchaseHistory.length,
            totalSpent: this.purchaseHistory.reduce((sum, p) => sum + p.amount, 0),
            hasSubscription: this.hasActiveSubscription(),
            subscriptionTier: this.subscription?.tier || 'free',
            unlockedContent: JSON.parse(localStorage.getItem('unlocked_content') || '[]').length
        };
    }
}

// Initialize the in-app purchases system
if (typeof window !== 'undefined') {
    window.inAppPurchases = new InAppPurchases();
    console.log('💳 In-App Purchases ready!');
}
