/**
 * Member Features Firestore Integration
 * Real-time chat, journal, XP tracking, achievements
 */

const db = firebase.firestore();

// Journal Entry Management
class JournalService {
  static async saveEntry(userId, title, content) {
    try {
      const entry = {
        userId,
        title,
        content,
        date: new Date(),
        wordCount: content.split(/\s+/).length,
        updated: new Date()
      };
      
      const docRef = await db.collection('users').doc(userId)
        .collection('journal').add(entry);
      
      // Update XP
      await this.addXP(userId, 50);
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }

  static async getEntries(userId, limit = 10) {
    try {
      const snapshot = await db.collection('users').doc(userId)
        .collection('journal')
        .orderBy('date', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
  }

  static async addXP(userId, amount) {
    try {
      await db.collection('users').doc(userId).update({
        xp: firebase.firestore.FieldValue.increment(amount),
        journalEntries: firebase.firestore.FieldValue.increment(1)
      });
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  }
}

// Chat Service
class ChatService {
  static async sendMessage(userId, roomId, message, username = 'Anonymous') {
    try {
      const msg = {
        userId,
        username,
        content: message,
        timestamp: new Date(),
        reactions: []
      };
      
      await db.collection('chatRooms').doc(roomId)
        .collection('messages').add(msg);
      
      // Update room last message
      await db.collection('chatRooms').doc(roomId).update({
        lastMessageTime: new Date(),
        messageCount: firebase.firestore.FieldValue.increment(1)
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async getMessages(roomId, limit = 50) {
    try {
      const snapshot = await db.collection('chatRooms').doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.reverse().map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  static watchMessages(roomId, callback) {
    return db.collection('chatRooms').doc(roomId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.reverse().map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.()
        }));
        callback(messages);
      });
  }
}

// Quest Service
class QuestService {
  static async completeQuest(userId, questId, xpReward = 100) {
    try {
      const userRef = db.collection('users').doc(userId);
      
      // Add to completed quests
      await userRef.collection('quests').doc(questId).set({
        completed: true,
        completedAt: new Date()
      });
      
      // Add XP and update streak
      await userRef.update({
        xp: firebase.firestore.FieldValue.increment(xpReward),
        dailyStreak: firebase.firestore.FieldValue.increment(1)
      });
      
      // Check for achievement
      await this.checkAchievements(userId);
    } catch (error) {
      console.error('Error completing quest:', error);
      throw error;
    }
  }

  static async getCompletedQuests(userId) {
    try {
      const snapshot = await db.collection('users').doc(userId)
        .collection('quests')
        .where('completed', '==', true)
        .get();
      
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error fetching completed quests:', error);
      return [];
    }
  }

  static async checkAchievements(userId) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      // Check various achievement thresholds
      const achievements = [];
      
      if (userData.xp > 1000) {
        achievements.push('xp_seeker_1000');
      }
      if (userData.dailyStreak > 7) {
        achievements.push('streak_week');
      }
      if (userData.meditationCount > 10) {
        achievements.push('meditation_master_10');
      }
      
      // Update user achievements
      for (const achievement of achievements) {
        if (!userData.achievements?.includes(achievement)) {
          await db.collection('users').doc(userId).update({
            achievements: firebase.firestore.FieldValue.arrayUnion(achievement)
          });
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }
}

// Meditation Tracking Service
class MeditationService {
  static async recordMeditation(userId, meditationId, durationMinutes) {
    try {
      const userRef = db.collection('users').doc(userId);
      
      // Log meditation session
      await userRef.collection('meditations').add({
        meditationId,
        duration: durationMinutes,
        completedAt: new Date(),
        xpEarned: Math.floor(durationMinutes * 5)
      });
      
      // Update stats
      await userRef.update({
        meditationCount: firebase.firestore.FieldValue.increment(1),
        totalMeditationMinutes: firebase.firestore.FieldValue.increment(durationMinutes),
        xp: firebase.firestore.FieldValue.increment(Math.floor(durationMinutes * 5))
      });
      
      // Check for streak
      await this.updateMeditationStreak(userId);
    } catch (error) {
      console.error('Error recording meditation:', error);
      throw error;
    }
  }

  static async updateMeditationStreak(userId) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const lastMeditationDate = userDoc.data()?.lastMeditationDate?.toDate?.();
      const today = new Date().toDateString();
      
      if (lastMeditationDate?.toDateString() !== today) {
        // First meditation today - check if streak continues
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        if (lastMeditationDate?.toDateString() === yesterday.toDateString()) {
          // Streak continues
          await db.collection('users').doc(userId).update({
            meditationStreak: firebase.firestore.FieldValue.increment(1),
            lastMeditationDate: new Date()
          });
        } else {
          // Streak broken, restart
          await db.collection('users').doc(userId).update({
            meditationStreak: 1,
            lastMeditationDate: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error updating meditation streak:', error);
    }
  }
}

// User Stats Service
class UserStatsService {
  static async getStats(userId) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      return {
        xp: userData.xp || 0,
        level: Math.floor((userData.xp || 0) / 500) + 1,
        meditationCount: userData.meditationCount || 0,
        journalEntries: userData.journalEntries || 0,
        achievements: userData.achievements || [],
        streak: userData.dailyStreak || 0,
        premium: userData.premium || false,
        joinedAt: userData.createdAt?.toDate?.()
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  static async getLeaderboard(limit = 50) {
    try {
      const snapshot = await db.collection('users')
        .where('premium', '==', true)
        .orderBy('xp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map((doc, index) => ({
        rank: index + 1,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }
}

// Export services
window.MemberFeatures = {
  Journal: JournalService,
  Chat: ChatService,
  Quest: QuestService,
  Meditation: MeditationService,
  Stats: UserStatsService
};

console.log('✅ Member features module loaded');
