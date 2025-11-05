# 🧪 Divine Temple - Comprehensive Testing Guide

## Overview

This guide covers testing for all 16 advanced feature systems implemented in Divine Temple.

---

## 📋 Testing Checklist

### ✅ Phase 1: Social & Engagement Systems

#### 1. Social Sharing System (`js/social-sharing-system.js`)
- [ ] Test share card generation
- [ ] Test Canvas API rendering
- [ ] Test social media sharing (Twitter, Facebook, LinkedIn)
- [ ] Test download functionality
- [ ] Verify XP awarded (25 XP per share)
- [ ] Test different achievement types

**Test Steps:**
```javascript
// Open browser console on members-new.html
const sharing = new SocialSharingSystem();
sharing.showShareModal('achievement', {
    name: 'First Meditation',
    icon: '🧘',
    description: 'Completed first meditation session'
});
```

---

#### 2. Challenge Calendar (`js/challenge-calendar.js`)
- [ ] Test monthly challenge display
- [ ] Test daily task completion
- [ ] Test progress tracking
- [ ] Verify XP rewards (10 XP per task, 200 XP per challenge)
- [ ] Test calendar navigation (prev/next month)
- [ ] Test localStorage persistence

**Test Steps:**
```javascript
const calendar = new ChallengeCalendar();
calendar.init();
calendar.completeTask('task-1'); // Should award XP
```

---

#### 3. Journaling System (`js/journaling-system.js`)
- [ ] Test all 5 journal types (daily, dream, gratitude, meditation, manifestation)
- [ ] Test mood tracking (8 moods)
- [ ] Test daily prompts (30+ per type)
- [ ] Test word count calculation
- [ ] Test streak tracking
- [ ] Test export to JSON
- [ ] Test export to PDF
- [ ] Verify XP rewards (20-100 XP based on word count & streak)

**Test Steps:**
```javascript
const journal = new JournalingSystem();
journal.createEntry({
    type: 'gratitude',
    title: 'Test Entry',
    content: 'Today I am grateful for this amazing platform...',
    mood: '😊 Joyful',
    tags: ['gratitude', 'happiness']
});
```

---

#### 4. Friend System (`js/friend-system.js`)
- [ ] Test send friend request by email
- [ ] Test accept/reject friend request
- [ ] Test friend list display
- [ ] Test activity feed (real-time Firebase)
- [ ] Test XP gifting functionality
- [ ] Test compare progress feature
- [ ] Test friend search
- [ ] Verify XP rewards (20 XP request, 50 XP accept, 10% karma bonus)

**Test Steps:**
```javascript
// Requires Firebase setup
const friends = new FriendSystem();
await friends.sendFriendRequest('friend@example.com');
await friends.giftXP('friendId123', 100, 'Great work! 🎉');
```

---

#### 5. Guilds/Circles System (`js/guilds-system.js`)
- [ ] Test create circle (6 types)
- [ ] Test join circle
- [ ] Test real-time chat (Firebase)
- [ ] Test shared goals
- [ ] Test circle leaderboard
- [ ] Test member management
- [ ] Verify XP rewards (100 XP create, 50 XP join, 5 XP per message)

**Test Steps:**
```javascript
const guilds = new GuildsSystem();
await guilds.createCircle({
    name: 'Awakened Souls',
    type: 'meditation',
    description: 'Daily meditation practice',
    isPrivate: false
});
```

---

### ✅ Phase 2: Infrastructure Systems

#### 6. Leaderboards System (`js/leaderboards-system.js`)
- [ ] Test global leaderboard (100 players)
- [ ] Test weekly leaderboard reset
- [ ] Test friend leaderboard
- [ ] Test section-specific leaderboards
- [ ] Test 5 ranking categories (XP, Level, Achievements, Streak, Activities)
- [ ] Test weekly rewards distribution
- [ ] Verify Firebase integration

**Test Steps:**
```javascript
const leaderboards = new LeaderboardsSystem();
await leaderboards.loadGlobalLeaderboard('xp', 100);
await leaderboards.loadFriendLeaderboard();
```

---

#### 7. Push Notifications (`js/push-notifications.js`)
- [ ] Test permission request
- [ ] Test service worker registration
- [ ] Test 7 notification types
- [ ] Test notification settings (DND mode)
- [ ] Test daily reminder scheduling
- [ ] Verify XP reward (20 XP for enabling)

**Test Steps:**
```javascript
const notifications = new PushNotificationSystem();
await notifications.requestPermission();
notifications.showNotification({
    title: 'Achievement Unlocked! 🏆',
    body: 'First Meditation Complete',
    data: { type: 'achievement', id: '123' }
});
```

---

#### 8. Service Worker (`service-worker.js`)
- [ ] Test PWA installation
- [ ] Test offline caching
- [ ] Test push notification handling
- [ ] Test background sync
- [ ] Test notification click deep linking
- [ ] Test cache versioning

**Test Steps:**
```bash
# Open DevTools → Application → Service Workers
# Verify registration
# Test offline mode (Network tab → Offline)
# Verify cached resources
```

---

#### 9. Audio Content System (`js/audio-content-system.js`)
- [ ] Test audio player controls (play, pause, seek)
- [ ] Test 6 content categories
- [ ] Test playback speed control (0.5x - 2x)
- [ ] Test sleep timer with fade-out
- [ ] Test progress tracking
- [ ] Test playlist functionality
- [ ] Verify XP rewards (10-95 XP per completion)

**Test Steps:**
```javascript
const audio = new AudioContentSystem();
audio.init();
await audio.playTrack('meditation-001');
audio.setPlaybackSpeed(1.5);
audio.setSleepTimer(30); // 30 minutes
```

---

#### 10. Video Library System (`js/video-library-system.js`)
- [ ] Test video player
- [ ] Test 6 content categories
- [ ] Test course enrollment
- [ ] Test progress tracking (auto-save)
- [ ] Test course completion detection
- [ ] Verify XP rewards (500 XP per course)

**Test Steps:**
```javascript
const videos = new VideoLibrarySystem();
videos.init();
await videos.enrollInCourse('chakra-mastery-101');
videos.playVideo('video-001');
```

---

#### 11. Multi-Language System (`js/multi-language-system.js`)
- [ ] Test all 10 languages
- [ ] Test RTL support (Arabic)
- [ ] Test translation function `t(key, params)`
- [ ] Test dynamic content translation
- [ ] Test date/number/currency localization
- [ ] Test MutationObserver for DOM changes
- [ ] Test language switcher UI

**Test Steps:**
```javascript
const lang = new MultiLanguageSystem();
lang.setLanguage('es'); // Spanish
console.log(lang.t('dashboard.welcome_message', { name: 'Usuario' }));
lang.setLanguage('ar'); // Arabic (RTL)
```

---

#### 12. PWA Install System (`js/pwa-install-system.js`)
- [ ] Test install banner display
- [ ] Test install prompt capture
- [ ] Test iOS-specific instructions
- [ ] Test app launch tracking
- [ ] Test update notifications
- [ ] Verify XP rewards (50 XP install, milestones at 10, 50, 100 launches)

**Test Steps:**
```javascript
const pwa = new PWAInstallSystem();
pwa.init();
// Wait 3 seconds for auto-banner
// Click install button
// Verify installation success
```

---

#### 13. Mentorship Program (`js/mentorship-program.js`)
- [ ] Test become mentor (requires Level 10+)
- [ ] Test mentor matching algorithm
- [ ] Test session scheduling
- [ ] Test goal tracking
- [ ] Test rating system
- [ ] Test mentee graduation
- [ ] Verify XP rewards (100 XP mentor, 75 XP per session, 500 XP graduation)

**Test Steps:**
```javascript
const mentorship = new MentorshipProgram();
await mentorship.becomeMentor({
    expertise: ['meditation', 'chakra-healing'],
    availability: ['weekday-evenings'],
    bio: 'Experienced meditation teacher...'
});
```

---

#### 14. Integrations System (`js/integrations-system.js`)
- [ ] Test Spotify OAuth flow
- [ ] Test Spotify playlist creation
- [ ] Test YouTube subscription
- [ ] Test Google Calendar event creation
- [ ] Test quick practice scheduling
- [ ] Verify XP rewards (15-30 XP per action)

**Test Steps:**
```javascript
const integrations = new IntegrationsSystem();
await integrations.connectSpotify();
await integrations.createSpotifyPlaylist('Meditation Mix', 'Calming tracks', []);
await integrations.scheduleQuickPractice('meditation', new Date(), 30);
```

---

#### 15. Personalization AI (`js/personalization-ai.js`)
- [ ] Test activity tracking
- [ ] Test behavior analysis
- [ ] Test recommendation generation (5 types)
- [ ] Test adaptive difficulty
- [ ] Test personalized quest generation
- [ ] Test insights generation
- [ ] Test time-based recommendations

**Test Steps:**
```javascript
const ai = new PersonalizationAI();
ai.init();
const recommendations = ai.generateDailyRecommendations();
const difficulty = ai.getAdaptiveDifficulty('meditation');
const quests = ai.generatePersonalizedQuests();
```

---

#### 16. In-App Purchases (`js/in-app-purchases.js`)
- [ ] Test subscription tier display
- [ ] Test Stripe Checkout integration
- [ ] Test subscription purchase flow
- [ ] Test one-time purchase flow
- [ ] Test purchase history
- [ ] Test subscription management
- [ ] Verify XP rewards (50-100 XP per purchase)

**Test Steps:**
```javascript
const purchases = new InAppPurchases();
purchases.init();
purchases.showPricingModal();
// Test purchase flow (requires Stripe test keys)
```

---

#### 17. AI Chatbot (`js/ai-chatbot.js`)
- [ ] Test OpenAI GPT-4 integration
- [ ] Test conversation history tracking
- [ ] Test smart fallback responses
- [ ] Test quick action buttons
- [ ] Test daily inspiration
- [ ] Verify XP rewards (10 XP first message, milestones at 10, 50 messages)

**Test Steps:**
```javascript
const chatbot = new AIChatbot();
chatbot.init();
await chatbot.sendMessage('How can I improve my meditation practice?');
const inspiration = chatbot.getDailyInspiration();
```

---

## 🔄 Integration Testing

### Cross-System XP Flow
Test that XP earned in one system updates the global progress:

```javascript
// 1. Complete a journal entry
journal.createEntry({...}); // Awards 50 XP

// 2. Check progress system
console.log(window.progressSystem.xp); // Should increase by 50

// 3. Check leaderboard update
leaderboards.loadGlobalLeaderboard(); // Should reflect new XP

// 4. Check friend activity feed
friends.getActivityFeed(); // Should show journal completion
```

---

### Freemium Conversion Testing

**Free User Flow:**
1. Visit `index.html` → Click "✨ Start Free Access"
2. Go to `login.html` → Select "Free Access"
3. Land on `free-dashboard.html`
4. Verify Enochian Calendar loads
5. Verify 8 premium features shown as locked
6. Click "Read More on Medium"
7. Verify redirect to Medium article

**Premium User Flow:**
1. Visit `login.html` → Select "Premium"
2. Land on `members-new.html`
3. Verify all 14 sections accessible
4. Test gamification (XP, quests, achievements)
5. Test all 16 advanced features

---

## 🐛 Bug Tracking Template

When you find bugs, document them:

```markdown
## Bug: [Short Description]

**System:** [System Name]
**Severity:** Critical / High / Medium / Low
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Console Errors:**
```javascript
// Paste any console errors
```

**Browser:** Chrome 120 / Firefox 121 / Safari 17
**Device:** Desktop / Mobile / Tablet
```

---

## ✅ Testing Status

| System | Tested | Working | Issues |
|--------|--------|---------|--------|
| Social Sharing | ⏳ | ⏳ | - |
| Challenge Calendar | ⏳ | ⏳ | - |
| Journaling | ⏳ | ⏳ | - |
| Friends | ⏳ | ⏳ | - |
| Guilds/Circles | ⏳ | ⏳ | - |
| Leaderboards | ⏳ | ⏳ | - |
| Push Notifications | ⏳ | ⏳ | - |
| Service Worker | ⏳ | ⏳ | - |
| Audio Content | ⏳ | ⏳ | - |
| Video Library | ⏳ | ⏳ | - |
| Multi-Language | ⏳ | ⏳ | - |
| PWA Install | ⏳ | ⏳ | - |
| Mentorship | ⏳ | ⏳ | - |
| Integrations | ⏳ | ⏳ | - |
| Personalization AI | ⏳ | ⏳ | - |
| In-App Purchases | ⏳ | ⏳ | - |
| AI Chatbot | ⏳ | ⏳ | - |
| Freemium Flow | ⏳ | ⏳ | - |

---

## 📊 Performance Testing

Test loading times and performance:

```javascript
// Measure system initialization time
console.time('System Init');
const system = new SystemName();
system.init();
console.timeEnd('System Init');

// Measure Firebase query performance
console.time('Firebase Query');
await db.collection('users').get();
console.timeEnd('Firebase Query');
```

**Performance Targets:**
- Initial load: < 3 seconds
- System init: < 500ms
- Firebase queries: < 1 second
- UI interactions: < 100ms

---

## 🔒 Security Testing

- [ ] Test authentication flows
- [ ] Test Firebase security rules
- [ ] Test API key exposure
- [ ] Test XSS vulnerabilities
- [ ] Test CSRF protection
- [ ] Test data validation

---

## 📱 Mobile Testing

Test on different devices:
- [ ] iPhone 14 Pro (iOS 17)
- [ ] Samsung Galaxy S23 (Android 13)
- [ ] iPad Pro (iPadOS 17)
- [ ] Chrome Android
- [ ] Safari iOS

---

## 🌐 Browser Testing

Test on different browsers:
- [ ] Chrome 120+
- [ ] Firefox 121+
- [ ] Safari 17+
- [ ] Edge 120+
- [ ] Opera 105+

---

## 🎯 Acceptance Criteria

All systems must:
✅ Load without console errors
✅ Display correct UI
✅ Award XP correctly
✅ Save data to localStorage/Firebase
✅ Work offline (where applicable)
✅ Be mobile responsive
✅ Be accessible (WCAG 2.1 AA)
✅ Handle errors gracefully

---

## 📝 Testing Notes

Document any observations, suggestions, or edge cases discovered during testing.

---

**Last Updated:** 2025-11-05
**Testing Status:** 🟡 In Progress
**Completion:** 0/17 systems tested
