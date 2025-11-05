# 🕉️ Divine Temple - Complete Spiritual Growth Platform

**A comprehensive gamified spiritual development platform with AI-powered insights, social features, and 17 advanced systems.**

[![Status](https://img.shields.io/badge/status-production%20ready-success)](https://github.com/nazarite777/divine-temple)
[![Version](https://img.shields.io/badge/version-17.0-blue)](https://github.com/nazarite777/divine-temple)
[![Systems](https://img.shields.io/badge/systems-17-purple)](https://github.com/nazarite777/divine-temple)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> *"You Never Left Eden" - Transform your spiritual journey with the most comprehensive digital temple ever created.*

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [API Configuration](#api-configuration)
- [Deployment](#deployment)
- [Support](#support)

---

## 🌟 Overview

Divine Temple is a **complete spiritual development platform** that combines:
- **14 Sacred Sections** for spiritual practices
- **17 Advanced Systems** for engagement and growth
- **Full Gamification** with XP, levels, quests, and achievements
- **AI-Powered Personalization** for your unique journey
- **Social Features** to connect with fellow seekers
- **Freemium Model** for accessible spiritual growth

Built with Firebase, powered by AI, and designed for transformation.

---

## ✨ Features

### 🎮 Core Gamification
- **XP & Leveling System:** 100 levels, spiritual ranks, unlimited growth
- **100+ Achievements:** Unlock badges for milestones and mastery
- **Daily Quests:** 3 personalized missions (Easy, Medium, Hard)
- **Perfect Day Bonus:** +300 XP for quest completion
- **Streak Tracking:** Build consistency with daily practice
- **Reward Shop:** 40+ unlockables, themes, boosters
- **Smart Insights:** AI pattern recognition and recommendations

### 🧘 14 Spiritual Sections
1. **Meditation Center** - Guided practices, breathing, mindfulness
2. **Oracle & Divination** - Tarot, I Ching, runes, sacred geometry
3. **Energy Healing** - Chakra work, aura cleansing, Reiki
4. **Devotion & Growth** - Prayer wheel, mantras, gratitude
5. **Sacred Knowledge** - Ancient texts, teachings, dream journal
6. **Spiritual Music** - Solfeggio frequencies, binaural beats
7. **Enochian Calendar** - Divine timing and cosmic cycles
8. **Spiritual Practices** - Daily rituals and ceremonies
9. **Sacred Arts** - Creative expression and divine art
10. **Community Hub** - Connect with fellow seekers
11. **Crystal Healing** - Crystal database and energy work
12. **Books Library** - Spiritual literature and wisdom
13. **Video Teachings** - Courses and master teachings
14. **Advanced Practices** - Kundalini, shadow work, ascension

---

## 🚀 Advanced Systems (17 Systems)

### 🌐 Social & Community Features

#### 1. **Social Sharing System** (`js/social-sharing-system.js`)
- Generate beautiful share cards with Canvas API
- Share achievements to Twitter, Facebook, LinkedIn
- Download progress images
- **XP Reward:** 25 XP per share

#### 2. **Challenge Calendar** (`js/challenge-calendar.js`)
- Monthly themed spiritual challenges
- Daily task completion
- Progress tracking & streaks
- **XP Rewards:** 10 XP/task, 200 XP/month

#### 3. **Journaling System** (`js/journaling-system.js`)
- 5 journal types: Daily, Dream, Gratitude, Meditation, Manifestation
- 30+ daily prompts per type
- Mood tracking (8 emotions)
- Export to PDF/JSON
- **XP Rewards:** 20-100 XP based on length & streak

#### 4. **Friend System** (`js/friend-system.js`)
- Send friend requests by email
- Real-time activity feed (Firebase)
- Gift XP to friends (10% karma bonus)
- Compare progress & stats
- **XP Rewards:** 20-50 XP for interactions

#### 5. **Guilds/Circles System** (`js/guilds-system.js`)
- Create spiritual communities (max 20 members)
- 6 circle types: Meditation, Divination, Energy, Study, Moon, General
- Real-time group chat (Firebase)
- Shared goals & challenges
- **XP Rewards:** 100 XP create, 50 XP join, 5 XP/message

---

### 📊 Infrastructure & Content

#### 6. **Leaderboards System** (`js/leaderboards-system.js`)
- Global, weekly, friend, and section leaderboards
- 5 ranking categories: XP, Level, Achievements, Streak, Activities
- Weekly rewards: 1000 XP for #1, 750 XP for #2, 500 XP for #3
- Real-time Firebase integration

#### 7. **Push Notifications** (`js/push-notifications.js`)
- Service Worker integration
- 7 notification types: Achievements, Quests, Friends, Circles, Streaks, Leaderboards, Level-Ups
- Notification settings with DND mode
- **XP Reward:** 20 XP for enabling

#### 8. **Service Worker** (`service-worker.js`)
- PWA offline caching (cache-first strategy)
- Push notification handling
- Background sync
- Deep linking on notification click

#### 9. **Audio Content System** (`js/audio-content-system.js`)
- 6 categories: Podcasts, Audiobooks, Meditations, Sleep Stories, Chants, Binaural Beats
- Full audio player with speed control (0.5x - 2x)
- Sleep timer with auto-fade
- **XP Rewards:** 10-95 XP per completion

#### 10. **Video Library System** (`js/video-library-system.js`)
- 6 categories: Courses, Teachings, Meditations, Rituals, Documentaries, Live Streams
- Course enrollment & progress tracking
- Auto-save video position
- **XP Rewards:** 30 XP/video, 500 XP/course completion

#### 11. **Multi-Language System** (`js/multi-language-system.js`)
- 10 supported languages: English, Spanish, French, German, Hindi, Sanskrit, Chinese, Japanese, Arabic, Portuguese
- RTL support for Arabic
- Translation function: `t(key, params)`
- Date/number/currency localization

#### 12. **PWA Install System** (`js/pwa-install-system.js`)
- Install prompt management
- iOS-specific instructions
- App launch tracking
- Update notifications
- **XP Rewards:** 50 XP install, milestone bonuses

#### 13. **Mentorship Program** (`js/mentorship-program.js`)
- Become a mentor (Level 10+ required)
- Mentor matching algorithm (15 expertise areas)
- Session scheduling & management
- Goal tracking & ratings
- **XP Rewards:** 100 XP mentor, 75 XP/session, 500 XP graduation

---

### 🤖 AI & Advanced Features

#### 14. **Integrations System** (`js/integrations-system.js`)
- **Spotify:** OAuth, playlist creation, music streaming
- **YouTube:** Subscribe, embed videos, channel integration
- **Google Calendar:** Schedule practices, event creation
- **XP Rewards:** 15-30 XP per connection/action

#### 15. **Personalization AI** (`js/personalization-ai.js`)
- ML-based content recommendations (5 types)
- User behavior analysis
- Adaptive difficulty system
- Smart quest generation
- Pattern recognition & insights
- Time-based recommendations

#### 16. **In-App Purchases** (`js/in-app-purchases.js`)
- **4 Subscription Tiers:**
  - Free: $0 (Calendar only)
  - Monthly: $9.99/month
  - Yearly: $99.99/year (save 17%)
  - Lifetime: $299.99 (one-time)
- One-time purchases: Courses, decks, packs
- Stripe Checkout integration
- **XP Rewards:** 50-100 XP per purchase

#### 17. **AI Chatbot** (`js/ai-chatbot.js`)
- OpenAI GPT-4 integration
- Spiritual guidance & wisdom
- Conversation history (last 20 messages)
- Smart fallback responses
- Quick actions: Meditation Guide, Chakras, Daily Inspiration
- **XP Rewards:** 10 XP first message, milestones at 10, 50

---

## 🎯 Freemium Model

### Free Tier (✨ Free Access)
- ✅ Enochian Calendar (full access)
- ✅ Basic spiritual insights
- ✅ Community access (read-only)
- ✅ Preview of premium features

### Premium Tier (💎 Premium)
- ✅ All 14 spiritual sections
- ✅ Full XP & gamification system
- ✅ All 17 advanced features
- ✅ Audio & video libraries
- ✅ AI spiritual guide
- ✅ Mentorship program
- ✅ Social features (friends, circles)
- ✅ Personalization AI

**Conversion Flow:** Free → Medium Blog Article → Premium

---

## 🚀 Quick Start

### For Users

1. **Visit** [Divine Temple](https://yourdomain.com)
2. **Choose Tier:**
   - Click "✨ Start Free Access" for free calendar
   - Click "Join Premium" for full access
3. **Register** with email and password
4. **Login** and select your tier
5. **Complete Profile** and start your journey!

### For Developers

```bash
# Clone repository
git clone https://github.com/nazarite777/divine-temple.git
cd divine-temple

# Serve locally
python -m http.server 8000
# Or use any static server
npx serve .

# Open browser
open http://localhost:8000
```

---

## 📖 Documentation

Comprehensive guides available:

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user manual for all 17 systems
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing protocols and checklist
- **[API_CONFIGURATION_GUIDE.md](API_CONFIGURATION_GUIDE.md)** - Setup Firebase, Stripe, OpenAI, OAuth
- **[FREEMIUM_SETUP.md](FREEMIUM_SETUP.md)** - Configure freemium model
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Admin operations & management *(coming soon)*

---

## 🛠️ Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Firebase SDK 10.7.1** (Auth, Firestore, Analytics, Cloud Messaging)
- **Canvas API** (Share card generation)
- **Service Workers** (PWA, offline, push notifications)
- **Responsive Design** (Mobile-first approach)

### Backend & Services
- **Firebase Authentication** (Email/Password, Google)
- **Cloud Firestore** (NoSQL real-time database)
- **Firebase Cloud Functions** (Serverless backend)
- **Stripe** (Payment processing)
- **OpenAI GPT-4** (AI chatbot)
- **OAuth 2.0** (Spotify, YouTube, Google Calendar)

### APIs & Integrations
- **Spotify Web API** (Music integration)
- **YouTube Data API v3** (Video integration)
- **Google Calendar API** (Event scheduling)
- **OpenAI API** (Chat completions)

---

## 🔑 API Configuration

Divine Temple requires several API keys. Follow the [API Configuration Guide](API_CONFIGURATION_GUIDE.md) to set up:

### Required Services
1. **Firebase** (Authentication, Database, Analytics, Cloud Messaging)
2. **Stripe** (Payment processing)
3. **OpenAI** (AI chatbot) - *Backend proxy required*
4. **Spotify** (Music integration) - *Optional*
5. **YouTube** (Video integration) - *Optional*
6. **Google Calendar** (Event scheduling) - *Optional*

### Quick Setup

```javascript
// 1. Update js/firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... rest of config
};

// 2. Update js/in-app-purchases.js
this.stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

// 3. Setup backend proxy for OpenAI (Firebase Functions or Vercel)
// See API_CONFIGURATION_GUIDE.md for details
```

**⚠️ Security:** Never expose secret keys in client-side code!

---

## 💎 XP Rewards Summary

| Activity | XP Range |
|----------|----------|
| Meditation | 10-100 XP |
| Oracle Reading | 30 XP |
| Chakra Healing | 40 XP |
| Journal Entry | 20-100 XP |
| Daily Quest | 40-200 XP |
| Perfect Day Bonus | +300 XP |
| Social Sharing | 25 XP |
| Challenge Task | 10 XP |
| Complete Challenge | 200 XP |
| Friend Interaction | 5-50 XP |
| Circle Message | 5 XP |
| Create Circle | 100 XP |
| Audio Completion | 10-95 XP |
| Video Completion | 30 XP |
| Course Completion | 500 XP |
| Mentorship Session | 75 XP |
| Mentorship Graduation | 500 XP |
| AI Chat (First) | 10 XP |
| Subscription Purchase | 100 XP |

**Total possible XP per day:** 1000+ XP

---

## 📱 Progressive Web App (PWA)

Divine Temple is a fully-featured PWA:

✅ Installable on all devices
✅ Offline functionality
✅ Push notifications
✅ App-like experience
✅ Auto-updates
✅ Fast loading with Service Worker caching

**Install:** Look for the install prompt or click the install button in your browser.

---

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## 🔐 Security & Privacy

### Security Features
- Firebase Authentication with secure tokens
- Firestore Security Rules for data protection
- HTTPS-only connections
- Environment variable management
- Rate limiting on API calls
- Input validation & sanitization

### Privacy
- User data encrypted at rest
- GDPR compliant
- Data export available
- Account deletion option
- No third-party tracking
- Journal entries are private by default

---

## 📊 Project Statistics

- **Total Systems:** 17
- **Lines of Code:** 15,000+
- **Features:** 100+
- **Languages Supported:** 10
- **XP Integration Points:** 70+
- **Achievements:** 100+
- **Quest Types:** 20+

---

## 🗺️ Roadmap

### Phase 1 ✅ Complete
- Core gamification system
- 14 spiritual sections
- Daily quests & achievements
- Reward shop & insights

### Phase 2 ✅ Complete
- Social features (friends, circles, sharing)
- Content libraries (audio, video)
- Journaling & challenge calendar
- Infrastructure (PWA, notifications, leaderboards)

### Phase 3 ✅ Complete
- AI features (chatbot, personalization)
- Mentorship program
- Integrations (Spotify, YouTube, Calendar)
- Freemium model
- In-app purchases

### Phase 4 🚧 In Progress
- Live streaming events
- Virtual retreats
- Advanced analytics dashboard
- Mobile native apps (iOS, Android)
- Blockchain rewards (NFT achievements)

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Ways to Contribute
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🎨 Design improvements
- 🔧 Code contributions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase** for the incredible backend infrastructure
- **OpenAI** for AI capabilities
- **Stripe** for secure payment processing
- **Our Community** for feedback and support

---

## 📞 Support & Contact

### Get Help
- **Documentation:** See guides above
- **Email:** support@divinetemple.com
- **GitHub Issues:** [Report bugs](https://github.com/nazarite777/divine-temple/issues)

### Stay Connected
- **Instagram:** @divinetemple
- **YouTube:** Divine Temple Channel
- **Twitter:** @divinetemple
- **Medium:** @edenconsciousnesssdt

---

## 🌟 Star History

If you find Divine Temple valuable, please ⭐ star this repository!

[![Star History Chart](https://api.star-history.com/svg?repos=nazarite777/divine-temple&type=Date)](https://star-history.com/#nazarite777/divine-temple&Date)

---

## 📸 Screenshots

*(Add screenshots here)*

---

**Built with 💜 for spiritual seekers everywhere.**

**Start your journey today!** 🚀✨🙏

---

**Version:** 17.0.0
**Last Updated:** 2025-11-05
**Status:** Production Ready
**Systems:** 17/17 Complete ✅
