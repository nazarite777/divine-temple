/**
 * Divine Temple - Social Sharing System
 *
 * Features:
 * - Share achievements to social media
 * - Share meditation streaks
 * - Beautiful share cards with stats
 * - Referral tracking
 * - Viral growth mechanics
 */

class SocialSharingSystem {
    constructor() {
        this.shareData = this.loadShareData();
        this.referralCode = this.generateReferralCode();
        this.baseUrl = window.location.origin;
        this.init();
    }

    init() {
        console.log('🌟 Social Sharing System initialized');
        this.trackReferrals();
    }

    // Generate unique referral code
    generateReferralCode() {
        const stored = localStorage.getItem('divineTemple_referralCode');
        if (stored) return stored;

        const code = 'DT' + Math.random().toString(36).substr(2, 8).toUpperCase();
        localStorage.setItem('divineTemple_referralCode', code);
        return code;
    }

    // Load share data
    loadShareData() {
        return JSON.parse(localStorage.getItem('divineTemple_shareData') || JSON.stringify({
            totalShares: 0,
            referrals: 0,
            referralRewards: 0,
            lastShared: null,
            shareHistory: []
        }));
    }

    // Save share data
    saveShareData() {
        localStorage.setItem('divineTemple_shareData', JSON.stringify(this.shareData));
    }

    // Track referral clicks
    trackReferrals() {
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');

        if (referralCode && referralCode !== this.referralCode) {
            // Someone used our referral link!
            console.log('📧 Referral tracked:', referralCode);

            // Store referral source
            localStorage.setItem('divineTemple_referredBy', referralCode);

            // Award XP to referrer (would be done server-side in production)
            this.recordReferral(referralCode);
        }
    }

    // Record successful referral
    recordReferral(code) {
        // In production, this would call your backend API
        console.log('✅ Referral recorded for code:', code);
    }

    // Share achievement to Twitter
    shareAchievement(achievementName, achievementIcon = '🏆') {
        const text = `🌟 I just unlocked "${achievementName}" ${achievementIcon} on Divine Temple! Join me on this spiritual journey! ${this.baseUrl}?ref=${this.referralCode}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

        this.openShareWindow(twitterUrl, 'Twitter');
        this.recordShare('twitter', 'achievement', achievementName);

        // Award XP for sharing
        if (window.progressSystem) {
            window.progressSystem.awardXP(50, 'Shared achievement on social media', 'social');
        }
    }

    // Share streak to social media
    shareStreak(days, platform = 'twitter') {
        const streakEmoji = days >= 100 ? '🔥💯' : days >= 30 ? '🔥✨' : '🔥';
        const text = `${streakEmoji} I've meditated for ${days} days straight on Divine Temple! Join my spiritual journey: ${this.baseUrl}?ref=${this.referralCode}`;

        let shareUrl;
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.baseUrl + '?ref=' + this.referralCode)}&quote=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.baseUrl + '?ref=' + this.referralCode)}`;
                break;
        }

        this.openShareWindow(shareUrl, platform);
        this.recordShare(platform, 'streak', days);

        // Award XP
        if (window.progressSystem) {
            window.progressSystem.awardXP(75, `Shared ${days}-day streak`, 'social');
        }
    }

    // Share progress stats
    shareProgress(stats) {
        const { level, totalXP, rank, streak } = stats;
        const text = `⚡ Level ${level} • ${totalXP.toLocaleString()} XP • ${rank} Rank • ${streak} day streak!\n\nJoin me on Divine Temple: ${this.baseUrl}?ref=${this.referralCode}`;

        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        this.openShareWindow(twitterUrl, 'Twitter');
        this.recordShare('twitter', 'progress', level);

        // Award XP
        if (window.progressSystem) {
            window.progressSystem.awardXP(100, 'Shared progress stats', 'social');
        }
    }

    // Generate beautiful share card (canvas-based image)
    async generateShareCard(type, data) {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 630;
        const ctx = canvas.getContext('2d');

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1e1b4b');
        gradient.addColorStop(0.5, '#4c1d95');
        gradient.addColorStop(1, '#6b21a8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 60px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ Divine Temple', canvas.width / 2, 100);

        // Main content based on type
        ctx.font = 'bold 80px Inter, sans-serif';
        ctx.fillStyle = '#d4af37';

        if (type === 'streak') {
            ctx.fillText(`🔥 ${data.days} Day Streak!`, canvas.width / 2, 280);
            ctx.font = '40px Inter, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('Join my spiritual journey', canvas.width / 2, 380);
        } else if (type === 'achievement') {
            ctx.fillText(`${data.icon} ${data.name}`, canvas.width / 2, 280);
            ctx.font = '40px Inter, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('Achievement Unlocked!', canvas.width / 2, 380);
        } else if (type === 'level') {
            ctx.fillText(`Level ${data.level} ⭐`, canvas.width / 2, 280);
            ctx.font = '40px Inter, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${data.xp.toLocaleString()} Total XP`, canvas.width / 2, 380);
        }

        // Footer
        ctx.font = '30px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`Referral Code: ${this.referralCode}`, canvas.width / 2, 520);

        return canvas.toDataURL('image/png');
    }

    // Download share card
    async downloadShareCard(type, data) {
        const dataUrl = await this.generateShareCard(type, data);
        const link = document.createElement('a');
        link.download = `divine-temple-${type}.png`;
        link.href = dataUrl;
        link.click();

        // Award XP
        if (window.progressSystem) {
            window.progressSystem.awardXP(25, 'Downloaded share card', 'social');
        }
    }

    // Open share window
    openShareWindow(url, platform) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
            url,
            `share-${platform}`,
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
        );
    }

    // Record share activity
    recordShare(platform, type, data) {
        this.shareData.totalShares++;
        this.shareData.lastShared = new Date().toISOString();
        this.shareData.shareHistory.push({
            platform,
            type,
            data,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 shares
        if (this.shareData.shareHistory.length > 50) {
            this.shareData.shareHistory = this.shareData.shareHistory.slice(-50);
        }

        this.saveShareData();

        // Log activity
        if (window.progressSystem) {
            window.progressSystem.logActivity('social_share', 'social', {
                platform,
                type,
                totalShares: this.shareData.totalShares
            });
        }
    }

    // Copy referral link
    copyReferralLink() {
        const referralLink = `${this.baseUrl}?ref=${this.referralCode}`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(referralLink).then(() => {
                this.showNotification('✅ Referral link copied to clipboard!');

                // Award XP
                if (window.progressSystem) {
                    window.progressSystem.awardXP(10, 'Copied referral link', 'social');
                }
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = referralLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('✅ Referral link copied!');
        }
    }

    // Show referral stats
    getReferralStats() {
        return {
            code: this.referralCode,
            link: `${this.baseUrl}?ref=${this.referralCode}`,
            totalShares: this.shareData.totalShares,
            referrals: this.shareData.referrals,
            rewardsEarned: this.shareData.referralRewards,
            lastShared: this.shareData.lastShared
        };
    }

    // Create share widget HTML
    createShareWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stats = this.getReferralStats();

        container.innerHTML = `
            <div class="share-widget">
                <h3 class="share-title">🌟 Share Divine Temple</h3>

                <div class="share-stats">
                    <div class="stat-item">
                        <div class="stat-value">${stats.totalShares}</div>
                        <div class="stat-label">Total Shares</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.referrals}</div>
                        <div class="stat-label">Referrals</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.rewardsEarned} XP</div>
                        <div class="stat-label">Rewards Earned</div>
                    </div>
                </div>

                <div class="referral-section">
                    <h4>Your Referral Link</h4>
                    <div class="referral-link-container">
                        <input type="text" readonly value="${stats.link}" class="referral-input" id="referral-input">
                        <button class="copy-btn" onclick="socialSharing.copyReferralLink()">📋 Copy</button>
                    </div>
                    <p class="referral-reward">🎁 Earn 500 XP for each friend who joins!</p>
                </div>

                <div class="share-buttons">
                    <button class="share-btn twitter" onclick="socialSharing.shareToTwitter()">
                        <span class="btn-icon">🐦</span>
                        <span class="btn-text">Share on Twitter</span>
                    </button>
                    <button class="share-btn facebook" onclick="socialSharing.shareToFacebook()">
                        <span class="btn-icon">📘</span>
                        <span class="btn-text">Share on Facebook</span>
                    </button>
                    <button class="share-btn whatsapp" onclick="socialSharing.shareToWhatsApp()">
                        <span class="btn-icon">💬</span>
                        <span class="btn-text">Share on WhatsApp</span>
                    </button>
                </div>

                <style>
                    .share-widget {
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
                        border: 1px solid rgba(139, 92, 246, 0.3);
                        border-radius: 20px;
                        padding: 2rem;
                        margin: 1rem 0;
                    }
                    .share-title {
                        text-align: center;
                        font-size: 1.8rem;
                        margin-bottom: 1.5rem;
                        background: linear-gradient(135deg, #d4af37, #8b5cf6);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .share-stats {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1rem;
                        margin-bottom: 2rem;
                    }
                    .stat-item {
                        text-align: center;
                        padding: 1rem;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 12px;
                    }
                    .stat-value {
                        font-size: 2rem;
                        font-weight: 700;
                        color: #d4af37;
                        margin-bottom: 0.5rem;
                    }
                    .stat-label {
                        font-size: 0.85rem;
                        color: rgba(255, 255, 255, 0.7);
                    }
                    .referral-section {
                        margin: 2rem 0;
                        padding: 1.5rem;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 12px;
                    }
                    .referral-section h4 {
                        margin-bottom: 1rem;
                        font-size: 1.2rem;
                    }
                    .referral-link-container {
                        display: flex;
                        gap: 0.5rem;
                        margin-bottom: 1rem;
                    }
                    .referral-input {
                        flex: 1;
                        padding: 0.75rem;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px;
                        color: white;
                        font-size: 0.9rem;
                    }
                    .copy-btn {
                        padding: 0.75rem 1.5rem;
                        background: linear-gradient(135deg, #d4af37, #f59e0b);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    .copy-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
                    }
                    .referral-reward {
                        text-align: center;
                        color: #10b981;
                        font-weight: 600;
                        font-size: 0.95rem;
                    }
                    .share-buttons {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1rem;
                    }
                    .share-btn {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        padding: 1rem;
                        border: none;
                        border-radius: 12px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    .share-btn.twitter {
                        background: linear-gradient(135deg, #1DA1F2, #0d8bd9);
                        color: white;
                    }
                    .share-btn.facebook {
                        background: linear-gradient(135deg, #4267B2, #365899);
                        color: white;
                    }
                    .share-btn.whatsapp {
                        background: linear-gradient(135deg, #25D366, #1ebe57);
                        color: white;
                    }
                    .share-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                    }
                    @media (max-width: 768px) {
                        .share-stats {
                            grid-template-columns: 1fr;
                        }
                        .share-buttons {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            </div>
        `;
    }

    // Quick share methods
    shareToTwitter() {
        if (window.progressSystem && window.progressSystem.userData) {
            const stats = window.progressSystem.userData;
            this.shareProgress({
                level: stats.level,
                totalXP: stats.totalXP,
                rank: stats.rank,
                streak: stats.currentStreak
            });
        }
    }

    shareToFacebook() {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.baseUrl + '?ref=' + this.referralCode)}`;
        this.openShareWindow(shareUrl, 'Facebook');
        this.recordShare('facebook', 'general', null);
    }

    shareToWhatsApp() {
        const text = `🌟 Join me on Divine Temple - a spiritual growth platform! ${this.baseUrl}?ref=${this.referralCode}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        this.recordShare('whatsapp', 'general', null);
    }

    // Notification helper
    showNotification(message) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }
}

// Initialize and make globally available
window.socialSharing = new SocialSharingSystem();
window.SocialSharingSystem = SocialSharingSystem;
