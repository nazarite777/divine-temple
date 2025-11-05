/**
 * 🤝 Divine Temple Mentorship Program
 *
 * Features:
 * - Match beginners with advanced users
 * - Mentor/Mentee profiles
 * - Mentorship goals and progress tracking
 * - Scheduled sessions (video/chat)
 * - Mentor ratings and reviews
 * - Mentor badges and achievements
 * - Knowledge sharing (resources, tips)
 * - Graduation system
 * - XP rewards for both mentor and mentee
 */

class MentorshipProgram {
    constructor() {
        this.currentUser = null;
        this.userProfile = this.loadUserProfile();
        this.mentorships = [];
        this.requests = [];
        this.useLocalStorage = false;
        this.init();
    }

    async init() {
        console.log('🤝 Mentorship Program initialized');

        // Check if Firebase is available
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('Firebase not available. Mentorship will use local data only.');
            this.useLocalStorage = true;
            this.loadLocalData();
        } else {
            this.useLocalStorage = false;
            await this.initFirebase();
        }
    }

    async initFirebase() {
        try {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0]
                    };

                    await this.loadUserMentorshipProfile();
                    await this.loadMentorships();
                } else {
                    this.currentUser = null;
                }
            });
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.useLocalStorage = true;
            this.loadLocalData();
        }
    }

    loadLocalData() {
        const saved = localStorage.getItem('mentorship_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.mentorships = data.mentorships || [];
            this.requests = data.requests || [];
        }

        this.currentUser = {
            uid: localStorage.getItem('divine_temple_user_id') || 'local_user',
            email: 'local@user.com',
            displayName: 'Local User'
        };
    }

    saveLocalData() {
        localStorage.setItem('mentorship_data', JSON.stringify({
            mentorships: this.mentorships,
            requests: this.requests
        }));
    }

    loadUserProfile() {
        const saved = localStorage.getItem('mentorship_profile');
        return saved ? JSON.parse(saved) : {
            isMentor: false,
            isMentee: false,
            expertise: [],
            interests: [],
            availability: '',
            bio: '',
            completedSessions: 0,
            rating: 0,
            reviews: []
        };
    }

    saveUserProfile() {
        localStorage.setItem('mentorship_profile', JSON.stringify(this.userProfile));
    }

    async loadUserMentorshipProfile() {
        if (this.useLocalStorage || !this.currentUser) return;

        try {
            const db = firebase.firestore();

            const profileDoc = await db.collection('mentorshipProfiles')
                .doc(this.currentUser.uid)
                .get();

            if (profileDoc.exists) {
                this.userProfile = profileDoc.data();
            }
        } catch (error) {
            console.error('Error loading mentorship profile:', error);
        }
    }

    async loadMentorships() {
        if (this.useLocalStorage || !this.currentUser) return;

        try {
            const db = firebase.firestore();

            // Load as mentor
            const asMentorSnapshot = await db.collection('mentorships')
                .where('mentorId', '==', this.currentUser.uid)
                .where('status', '==', 'active')
                .get();

            // Load as mentee
            const asMenteeSnapshot = await db.collection('mentorships')
                .where('menteeId', '==', this.currentUser.uid)
                .where('status', '==', 'active')
                .get();

            this.mentorships = [];
            asMentorSnapshot.forEach(doc => {
                this.mentorships.push({ id: doc.id, ...doc.data(), role: 'mentor' });
            });
            asMenteeSnapshot.forEach(doc => {
                this.mentorships.push({ id: doc.id, ...doc.data(), role: 'mentee' });
            });

            console.log('Loaded mentorships:', this.mentorships.length);
        } catch (error) {
            console.error('Error loading mentorships:', error);
        }
    }

    async becomeMentor(profile) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Mentorship requires Firebase' };
        }

        // Validate profile
        if (!profile.expertise || profile.expertise.length === 0) {
            return { success: false, message: 'Please select at least one area of expertise' };
        }

        if (!profile.bio || profile.bio.length < 50) {
            return { success: false, message: 'Bio must be at least 50 characters' };
        }

        try {
            const db = firebase.firestore();

            // Check user level (must be at least level 10 to be mentor)
            if (window.progressSystem && window.progressSystem.level < 10) {
                return {
                    success: false,
                    message: 'You must be at least Level 10 to become a mentor'
                };
            }

            this.userProfile = {
                ...this.userProfile,
                isMentor: true,
                expertise: profile.expertise,
                availability: profile.availability,
                bio: profile.bio,
                becameMentorAt: new Date().toISOString(),
                rating: 0,
                totalReviews: 0,
                completedSessions: 0
            };

            await db.collection('mentorshipProfiles')
                .doc(this.currentUser.uid)
                .set(this.userProfile, { merge: true });

            this.saveUserProfile();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(100, 'Became a mentor! 🎓', 'mentorship');
            }

            return {
                success: true,
                message: 'Welcome to the mentor program! 🎓'
            };

        } catch (error) {
            console.error('Error becoming mentor:', error);
            return { success: false, message: 'Failed to join mentor program' };
        }
    }

    async requestMentorship(profile) {
        if (this.useLocalStorage) {
            return { success: false, message: 'Mentorship requires Firebase' };
        }

        // Validate profile
        if (!profile.interests || profile.interests.length === 0) {
            return { success: false, message: 'Please select at least one area of interest' };
        }

        try {
            const db = firebase.firestore();

            this.userProfile = {
                ...this.userProfile,
                isMentee: true,
                interests: profile.interests,
                goals: profile.goals || '',
                becameMenteeAt: new Date().toISOString()
            };

            await db.collection('mentorshipProfiles')
                .doc(this.currentUser.uid)
                .set(this.userProfile, { merge: true });

            this.saveUserProfile();

            // Find potential mentors
            const matches = await this.findMentorMatches();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(20, 'Joined mentorship program! 📚', 'mentorship');
            }

            return {
                success: true,
                message: 'Profile created! Finding mentors...',
                matches
            };

        } catch (error) {
            console.error('Error requesting mentorship:', error);
            return { success: false, message: 'Failed to request mentorship' };
        }
    }

    async findMentorMatches(limit = 10) {
        if (this.useLocalStorage) return [];

        try {
            const db = firebase.firestore();

            // Find mentors with matching expertise
            const mentorsSnapshot = await db.collection('mentorshipProfiles')
                .where('isMentor', '==', true)
                .limit(50)
                .get();

            const potentialMentors = [];

            for (const doc of mentorsSnapshot.docs) {
                const mentor = { uid: doc.id, ...doc.data() };

                // Skip self
                if (mentor.uid === this.currentUser.uid) continue;

                // Check if expertise matches interests
                const matchScore = this.calculateMatchScore(mentor);

                if (matchScore > 0) {
                    // Get user info
                    const userDoc = await db.collection('users').doc(mentor.uid).get();
                    const userInfo = userDoc.exists ? userDoc.data() : {};

                    potentialMentors.push({
                        ...mentor,
                        displayName: userInfo.displayName || 'Mentor',
                        photoURL: userInfo.photoURL || null,
                        matchScore
                    });
                }
            }

            // Sort by match score
            potentialMentors.sort((a, b) => b.matchScore - a.matchScore);

            return potentialMentors.slice(0, limit);

        } catch (error) {
            console.error('Error finding mentor matches:', error);
            return [];
        }
    }

    calculateMatchScore(mentor) {
        let score = 0;

        // Match expertise with interests
        if (this.userProfile.interests && mentor.expertise) {
            const matches = this.userProfile.interests.filter(interest =>
                mentor.expertise.includes(interest)
            );
            score += matches.length * 10;
        }

        // Rating bonus
        if (mentor.rating) {
            score += mentor.rating * 2;
        }

        // Experience bonus
        if (mentor.completedSessions) {
            score += Math.min(mentor.completedSessions, 20);
        }

        return score;
    }

    async sendMentorRequest(mentorId, message = '') {
        if (this.useLocalStorage) {
            return { success: false, message: 'Mentorship requires Firebase' };
        }

        try {
            const db = firebase.firestore();

            const request = {
                menteeId: this.currentUser.uid,
                menteeName: this.currentUser.displayName,
                mentorId: mentorId,
                message: message,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('mentorshipRequests').add(request);

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(10, 'Sent mentor request', 'mentorship');
            }

            return {
                success: true,
                message: 'Mentor request sent!',
                requestId: docRef.id
            };

        } catch (error) {
            console.error('Error sending mentor request:', error);
            return { success: false, message: 'Failed to send request' };
        }
    }

    async acceptMentorRequest(requestId) {
        if (this.useLocalStorage) {
            return { success: false };
        }

        try {
            const db = firebase.firestore();

            // Get request
            const requestDoc = await db.collection('mentorshipRequests').doc(requestId).get();
            if (!requestDoc.exists) {
                return { success: false, message: 'Request not found' };
            }

            const request = requestDoc.data();

            // Create mentorship
            const mentorship = {
                mentorId: request.mentorId,
                menteeId: request.menteeId,
                startDate: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active',
                sessions: [],
                goals: [],
                resources: []
            };

            const mentorshipDoc = await db.collection('mentorships').add(mentorship);

            // Update request status
            await db.collection('mentorshipRequests').doc(requestId).update({
                status: 'accepted',
                mentorshipId: mentorshipDoc.id
            });

            // Reload mentorships
            await this.loadMentorships();

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(50, 'Accepted mentorship! 🎓', 'mentorship');
            }

            return {
                success: true,
                message: 'Mentorship started!',
                mentorshipId: mentorshipDoc.id
            };

        } catch (error) {
            console.error('Error accepting request:', error);
            return { success: false, message: 'Failed to accept request' };
        }
    }

    async scheduleSession(mentorshipId, sessionData) {
        if (this.useLocalStorage) {
            return { success: false };
        }

        try {
            const db = firebase.firestore();

            const session = {
                date: sessionData.date,
                duration: sessionData.duration || 60,
                topic: sessionData.topic,
                type: sessionData.type || 'video', // video, chat, voice
                status: 'scheduled',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('mentorships')
                .doc(mentorshipId)
                .update({
                    sessions: firebase.firestore.FieldValue.arrayUnion(session)
                });

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(20, 'Scheduled mentorship session', 'mentorship');
            }

            return { success: true, message: 'Session scheduled!', session };

        } catch (error) {
            console.error('Error scheduling session:', error);
            return { success: false };
        }
    }

    async completeSession(mentorshipId, sessionIndex, notes = '') {
        if (this.useLocalStorage) {
            return { success: false };
        }

        try {
            const db = firebase.firestore();
            const mentorshipRef = db.collection('mentorships').doc(mentorshipId);

            const mentorshipDoc = await mentorshipRef.get();
            if (!mentorshipDoc.exists) {
                return { success: false };
            }

            const mentorship = mentorshipDoc.data();
            const sessions = mentorship.sessions || [];

            if (sessionIndex >= sessions.length) {
                return { success: false };
            }

            sessions[sessionIndex].status = 'completed';
            sessions[sessionIndex].completedAt = new Date().toISOString();
            sessions[sessionIndex].notes = notes;

            await mentorshipRef.update({ sessions });

            // Update completed sessions count
            await db.collection('mentorshipProfiles')
                .doc(this.currentUser.uid)
                .update({
                    completedSessions: firebase.firestore.FieldValue.increment(1)
                });

            // 🎯 AWARD XP for both mentor and mentee
            const xp = 75;
            if (window.progressSystem) {
                window.progressSystem.awardXP(xp, 'Completed mentorship session! 🎯', 'mentorship');
            }

            return { success: true, xp };

        } catch (error) {
            console.error('Error completing session:', error);
            return { success: false };
        }
    }

    async addGoal(mentorshipId, goal) {
        if (this.useLocalStorage) {
            return { success: false };
        }

        try {
            const db = firebase.firestore();

            const goalData = {
                id: Date.now().toString(),
                title: goal.title,
                description: goal.description,
                targetDate: goal.targetDate,
                status: 'active',
                progress: 0,
                createdAt: new Date().toISOString()
            };

            await db.collection('mentorships')
                .doc(mentorshipId)
                .update({
                    goals: firebase.firestore.FieldValue.arrayUnion(goalData)
                });

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(15, 'Set mentorship goal', 'mentorship');
            }

            return { success: true, goal: goalData };

        } catch (error) {
            console.error('Error adding goal:', error);
            return { success: false };
        }
    }

    async completeGoal(mentorshipId, goalId) {
        if (this.useLocalStorage) {
            return { success: false };
        }

        try {
            const db = firebase.firestore();
            const mentorshipRef = db.collection('mentorships').doc(mentorshipId);

            const mentorshipDoc = await mentorshipRef.get();
            const mentorship = mentorshipDoc.data();

            const goals = mentorship.goals || [];
            const goalIndex = goals.findIndex(g => g.id === goalId);

            if (goalIndex === -1) {
                return { success: false };
            }

            goals[goalIndex].status = 'completed';
            goals[goalIndex].completedAt = new Date().toISOString();
            goals[goalIndex].progress = 100;

            await mentorshipRef.update({ goals });

            // 🎯 AWARD BIG XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(100, 'Completed mentorship goal! 🎯', 'mentorship');
            }

            return { success: true, xp: 100 };

        } catch (error) {
            console.error('Error completing goal:', error);
            return { success: false };
        }
    }

    async rateMentor(mentorId, rating, review) {
        if (this.useLocalStorage) {
            return { success: false };
        }

        if (rating < 1 || rating > 5) {
            return { success: false, message: 'Rating must be between 1 and 5' };
        }

        try {
            const db = firebase.firestore();

            const reviewData = {
                menteeId: this.currentUser.uid,
                menteeName: this.currentUser.displayName,
                rating,
                review,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('mentorReviews').add(reviewData);

            // Update mentor's average rating
            const mentorProfileRef = db.collection('mentorshipProfiles').doc(mentorId);
            const mentorProfile = await mentorProfileRef.get();

            if (mentorProfile.exists) {
                const data = mentorProfile.data();
                const currentRating = data.rating || 0;
                const totalReviews = (data.totalReviews || 0) + 1;
                const newRating = ((currentRating * (totalReviews - 1)) + rating) / totalReviews;

                await mentorProfileRef.update({
                    rating: newRating,
                    totalReviews: totalReviews
                });
            }

            // 🎯 AWARD XP
            if (window.progressSystem) {
                window.progressSystem.awardXP(25, 'Reviewed mentor', 'mentorship');
            }

            return { success: true, message: 'Thank you for your review!' };

        } catch (error) {
            console.error('Error rating mentor:', error);
            return { success: false, message: 'Failed to submit review' };
        }
    }

    async graduateMentee(mentorshipId) {
        if (this.useLocalStorage) {
            return { success: false };
        }

        try {
            const db = firebase.firestore();

            await db.collection('mentorships')
                .doc(mentorshipId)
                .update({
                    status: 'graduated',
                    graduatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

            // 🎯 AWARD BIG XP for both
            if (window.progressSystem) {
                window.progressSystem.awardXP(500, 'Mentorship graduation! 🎓🎉', 'mentorship');
            }

            return {
                success: true,
                message: 'Congratulations on graduation! 🎓',
                xp: 500
            };

        } catch (error) {
            console.error('Error graduating mentee:', error);
            return { success: false };
        }
    }

    getExpertiseAreas() {
        return [
            'Meditation',
            'Mindfulness',
            'Chakra Healing',
            'Energy Work',
            'Tarot Reading',
            'Crystal Healing',
            'Astrology',
            'Yoga',
            'Breathwork',
            'Manifestation',
            'Shadow Work',
            'Kundalini',
            'Reiki',
            'Sound Healing',
            'Sacred Geometry'
        ];
    }

    getMentorshipStats() {
        return {
            isMentor: this.userProfile.isMentor,
            isMentee: this.userProfile.isMentee,
            activeMentorships: this.mentorships.filter(m => m.status === 'active').length,
            completedSessions: this.userProfile.completedSessions || 0,
            rating: this.userProfile.rating || 0,
            totalReviews: this.userProfile.totalReviews || 0
        };
    }

    openMentorshipDashboard() {
        // This would render the full mentorship dashboard UI
        console.log('Opening mentorship dashboard...');

        const stats = this.getMentorshipStats();

        alert(`Mentorship Dashboard\n\n` +
              `Mentor: ${stats.isMentor ? 'Yes' : 'No'}\n` +
              `Mentee: ${stats.isMentee ? 'Yes' : 'No'}\n` +
              `Active Mentorships: ${stats.activeMentorships}\n` +
              `Completed Sessions: ${stats.completedSessions}\n` +
              `Rating: ${stats.rating.toFixed(1)} ⭐`);
    }
}

// Initialize the mentorship program
if (typeof window !== 'undefined') {
    window.mentorshipProgram = new MentorshipProgram();
    console.log('🤝 Mentorship Program ready!');
}
