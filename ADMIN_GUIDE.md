# 🛡️ Divine Temple - Administrator Guide

Complete guide for managing and maintaining the Divine Temple platform.

---

## 📋 Table of Contents

1. [Admin Access](#admin-access)
2. [User Management](#user-management)
3. [Content Management](#content-management)
4. [System Monitoring](#system-monitoring)
5. [Database Management](#database-management)
6. [Security & Backups](#security--backups)
7. [Troubleshooting](#troubleshooting)

---

## 🔐 Admin Access

### Admin Credentials
Admin access requires elevated Firebase permissions.

**Setup Admin User:**
1. Firebase Console → Authentication
2. Find admin user
3. Go to Firestore → `users` collection
4. Add field: `role: "admin"`

### Admin Panel Access
Add admin check to `members-new.html`:

```javascript
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();

        if (userData.role === 'admin') {
            // Show admin panel
            document.getElementById('admin-panel').style.display = 'block';
        }
    }
});
```

---

## 👥 User Management

### View All Users
```javascript
const usersRef = db.collection('users');
const snapshot = await usersRef.get();

snapshot.forEach(doc => {
    const user = doc.data();
    console.log({
        id: doc.id,
        email: user.email,
        tier: user.tier,
        level: user.level,
        xp: user.xp,
        subscriptionStatus: user.subscriptionStatus
    });
});
```

### Ban/Suspend User
```javascript
async function suspendUser(userId, reason) {
    await db.collection('users').doc(userId).update({
        status: 'suspended',
        suspendedAt: firebase.firestore.FieldValue.serverTimestamp(),
        suspensionReason: reason
    });

    // Disable Firebase Auth
    await firebase.auth().updateUser(userId, { disabled: true });
}
```

### Grant Premium Access
```javascript
async function grantPremiumAccess(userId, duration = 'lifetime') {
    await db.collection('users').doc(userId).update({
        tier: 'premium',
        subscriptionStatus: 'active',
        subscriptionType: duration,
        grantedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}
```

### Reset User Progress
```javascript
async function resetUserProgress(userId) {
    await db.collection('userProgress').doc(userId).set({
        xp: 0,
        level: 1,
        achievements: [],
        completedQuests: [],
        streak: 0,
        resetAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}
```

---

## 📝 Content Management

### Update Daily Quests
Edit `js/daily-quests.js` to modify quest pool:

```javascript
const questTemplates = {
    easy: [
        { title: 'Morning Meditation', xp: 40, /* ... */ },
        // Add new easy quest
    ],
    medium: [
        // Add medium quests
    ],
    hard: [
        // Add hard quests
    ]
};
```

### Add New Achievements
Edit `js/progress-system.js`:

```javascript
const achievements = [
    {
        id: 'new_achievement',
        name: 'New Achievement Name',
        description: 'Description...',
        icon: '🏆',
        category: 'meditation',
        requirement: { type: 'meditation_count', count: 50 },
        xpReward: 100
    }
];
```

### Update Audio/Video Libraries
Edit respective system files:

```javascript
// js/audio-content-system.js
podcasts: [
    {
        id: 'new_podcast_001',
        title: 'New Podcast Episode',
        artist: 'Speaker Name',
        duration: 2400, // 40 minutes
        audioUrl: 'https://path-to-audio.mp3',
        thumbnail: 'https://path-to-image.jpg'
    }
]
```

---

## 📊 System Monitoring

### Check System Health
```javascript
async function checkSystemHealth() {
    const checks = {
        firebase: await checkFirebaseConnection(),
        stripe: await checkStripeStatus(),
        openai: await checkOpenAIStatus(),
        storage: await checkStorageUsage()
    };

    console.log('System Health:', checks);
    return checks;
}
```

### Monitor Active Users
```javascript
async function getActiveUsers(timeframe = 24) {
    const cutoff = Date.now() - (timeframe * 60 * 60 * 1000);

    const snapshot = await db.collection('users')
        .where('lastActive', '>=', new Date(cutoff))
        .get();

    console.log(`Active users (last ${timeframe}h):`, snapshot.size);
    return snapshot.size;
}
```

### View Analytics Dashboard
Firebase Console → Analytics → Dashboard

Key Metrics:
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Retention Rate
- Conversion Rate (Free → Premium)
- Average Session Duration

---

## 💾 Database Management

### Backup Firestore Data
```bash
# Using Firebase CLI
firebase firestore:export gs://your-bucket/backups/$(date +%Y%m%d)
```

### Restore from Backup
```bash
firebase firestore:import gs://your-bucket/backups/YYYYMMDD
```

### Clean Up Old Data
```javascript
async function cleanUpOldData() {
    // Delete notifications older than 30 days
    const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);

    const oldNotifications = await db.collection('notifications')
        .where('timestamp', '<', new Date(cutoff))
        .get();

    const batch = db.batch();
    oldNotifications.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Deleted ${oldNotifications.size} old notifications`);
}
```

### Database Indexes
Monitor and create indexes as needed:
- Firebase Console → Firestore → Indexes
- Check for slow queries in logs
- Create composite indexes for common queries

---

## 🔒 Security & Backups

### Review Security Rules
Regularly audit Firestore security rules:

```javascript
// Example security audit
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ensure only authenticated users can read
    match /{document=**} {
      allow read: if request.auth != null;
    }

    // User data only accessible by owner
    match /users/{userId} {
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### Enable 2FA for Admin Accounts
1. Firebase Console → Authentication → Settings
2. Enable multi-factor authentication
3. Require for all admin accounts

### API Key Rotation
Rotate API keys every 90 days:
1. Generate new keys
2. Update configuration files
3. Deploy changes
4. Revoke old keys after 7 days

### Backup Schedule
- **Daily:** Firestore database (automated)
- **Weekly:** Full system backup including assets
- **Monthly:** Off-site backup to secondary location

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Users Can't Login**
```javascript
// Check Firebase Auth status
firebase.auth().currentUser; // Should return user object

// Check Firestore connection
await db.collection('users').limit(1).get(); // Should not error
```

**Solution:**
1. Verify Firebase config is correct
2. Check Firebase console for service status
3. Verify user's email is verified
4. Check browser console for errors

---

**Issue: XP Not Awarding**
```javascript
// Check progress system
console.log(window.progressSystem);
console.log(window.progressSystem.awardXP);
```

**Solution:**
1. Verify `js/progress-system.js` is loaded
2. Check for JavaScript errors in console
3. Verify Firebase connection
4. Check user's progress document exists

---

**Issue: Push Notifications Not Working**
**Solution:**
1. Verify Service Worker is registered
2. Check VAPID keys are correct
3. Ensure HTTPS is enabled
4. Check browser notification permissions

---

**Issue: Payment Failed**
**Solution:**
1. Check Stripe Dashboard for error details
2. Verify Stripe keys are correct (test vs live)
3. Ensure webhook is receiving events
4. Check customer card details

---

## 📞 Support Resources

### Internal Tools
- Firebase Console: https://console.firebase.google.com
- Stripe Dashboard: https://dashboard.stripe.com
- OpenAI Usage: https://platform.openai.com/usage

### Documentation
- Firebase Docs: https://firebase.google.com/docs
- Stripe API: https://stripe.com/docs/api
- OpenAI API: https://platform.openai.com/docs

### Emergency Contacts
- **Technical Lead:** [Contact Info]
- **DevOps:** [Contact Info]
- **Security Team:** [Contact Info]

---

## 📊 Maintenance Checklist

### Daily
- [ ] Check system health
- [ ] Review error logs
- [ ] Monitor active users
- [ ] Check payment processing

### Weekly
- [ ] Review user feedback
- [ ] Analyze usage patterns
- [ ] Update content libraries
- [ ] Check database performance

### Monthly
- [ ] Full system backup
- [ ] Security audit
- [ ] Update dependencies
- [ ] Review and rotate API keys

### Quarterly
- [ ] Performance optimization
- [ ] Feature planning
- [ ] User satisfaction survey
- [ ] Cost analysis and optimization

---

**Version:** 1.0.0
**Last Updated:** 2025-11-05
