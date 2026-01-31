/**
 * Check Total Registered Users
 * Connects to Firebase and displays subscriber statistics
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
try {
  const serviceAccount = require(path.join(__dirname, 'sacred-community-firebase-adminsdk.json'));
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'sacred-community'
    });
  }
} catch (error) {
  console.error('Error loading service account key:', error.message);
  console.log('\nTo fix this:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate New Private Key"');
  console.log('3. Save as sacred-community-firebase-adminsdk.json in the divine-temple folder');
  process.exit(1);
}

const db = admin.firestore();

async function checkSubscribers() {
  try {
    console.log('\n📊 DIVINE TEMPLE - SUBSCRIBER STATISTICS');
    console.log('=========================================\n');

    // Get all users
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    const totalUsers = snapshot.size;
    let premiumCount = 0;
    let freeCount = 0;
    let adminCount = 0;
    const users = [];

    snapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        uid: doc.id,
        email: userData.email || 'N/A',
        membershipLevel: userData.membershipLevel || 'free',
        createdAt: userData.createdAt || userData.started_date || 'N/A',
        displayName: userData.displayName || 'N/A'
      });

      // Count by membership level
      const level = userData.membershipLevel || 'free';
      if (level === 'premium' || level === 'elite' || level === 'founding') {
        premiumCount++;
      } else if (level === 'admin') {
        adminCount++;
      } else {
        freeCount++;
      }
    });

    // Display summary
    console.log(`Total Registered Users: ${totalUsers}`);
    console.log(`├─ Premium Users: ${premiumCount}`);
    console.log(`├─ Free Users: ${freeCount}`);
    console.log(`└─ Admin Users: ${adminCount}`);
    console.log(`\n📈 Premium Conversion: ${totalUsers > 0 ? ((premiumCount / totalUsers) * 100).toFixed(1) : 0}%`);

    // Display user list
    console.log('\n👥 REGISTERED USERS:');
    console.log('─'.repeat(80));
    console.log(`${'Email'.padEnd(30)} ${'Tier'.padEnd(12)} ${'Name'.padEnd(20)}`);
    console.log('─'.repeat(80));

    users.sort((a, b) => {
      // Sort by membership level (premium first)
      const levelOrder = { admin: 0, premium: 1, elite: 1, founding: 1, free: 2, basic: 2 };
      return (levelOrder[a.membershipLevel] || 3) - (levelOrder[b.membershipLevel] || 3);
    }).forEach(user => {
      const tier = user.membershipLevel === 'free' ? '🆓 Free' : `💎 ${user.membershipLevel}`;
      console.log(`${user.email.padEnd(30)} ${tier.padEnd(12)} ${user.displayName.padEnd(20)}`);
    });

    console.log('─'.repeat(80));
    console.log(`\n✅ Query complete. Total: ${totalUsers} users\n`);

  } catch (error) {
    console.error('Error querying users:', error);
  } finally {
    admin.app().delete();
  }
}

// Run the query
checkSubscribers();
