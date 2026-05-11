/**
 * Phase 1 onboarding helpers.
 * Ensures first-login progress records exist and resolves post-auth routing.
 */
(function () {
  const LESSON_SEQUENCE = [
    { id: 'lesson-01', url: 'lesson-01-what-is-programming.html' },
    { id: 'lesson-02', url: 'lesson-02-the-walk-back.html' },
    { id: 'lesson-03', url: 'lesson-03-ini-year.html' },
    { id: 'lesson-04', url: 'lesson-04-aligned-manifestation.html' },
    { id: 'lesson-05', url: 'lesson-05-first-decision.html' }
  ];

  function isOnboardingComplete(userData) {
    return userData && userData.onboardingStatus === 'completed';
  }

  function getNextPhase1Url(userData) {
    if (!userData || !userData.phase1 || !userData.phase1.divisionIntroViewed) {
      return 'division-i.html';
    }

    const completed = Array.isArray(userData.phase1.lessonsCompleted)
      ? userData.phase1.lessonsCompleted
      : [];

    const nextLesson = LESSON_SEQUENCE.find((lesson) => !completed.includes(lesson.id));
    return nextLesson ? nextLesson.url : 'division-i.html';
  }

  function membershipIsSacred(membershipLevel) {
    const level = (membershipLevel || '').toLowerCase();
    return ['premium', 'elite', 'founding', 'admin', 'student', 'monthly', 'divine', 'sacred'].includes(level);
  }

  function serverTimestamp() {
    if (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) {
      return firebase.firestore.FieldValue.serverTimestamp();
    }
    return new Date();
  }

  async function ensurePhase1Record(user, options) {
    if (!user || !user.uid) {
      throw new Error('ensurePhase1Record requires an authenticated user');
    }
    if (typeof firebase === 'undefined' || !firebase.firestore) {
      throw new Error('Firestore is not available');
    }

    const profile = options || {};
    const usersRef = firebase.firestore().collection('users').doc(user.uid);
    const existing = await usersRef.get();

    const baseData = {
      uid: user.uid,
      email: user.email || profile.email || '',
      displayName: user.displayName || profile.displayName || 'Sacred Seeker',
      membershipLevel: profile.membershipLevel || 'basic',
      onboardingStatus: 'not_started',
      phase1: {
        divisionIntroViewed: false,
        lessonsCompleted: [],
        currentLesson: 'lesson-01',
        completedAt: null,
        updatedAt: serverTimestamp()
      },
      createdAt: existing.exists ? existing.data().createdAt || serverTimestamp() : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (!existing.exists) {
      await usersRef.set(baseData, { merge: true });
      return baseData;
    }

    const data = existing.data() || {};
    const mergedPhase1 = {
      divisionIntroViewed: !!(data.phase1 && data.phase1.divisionIntroViewed),
      lessonsCompleted: Array.isArray(data.phase1 && data.phase1.lessonsCompleted)
        ? data.phase1.lessonsCompleted
        : [],
      currentLesson: (data.phase1 && data.phase1.currentLesson) || 'lesson-01',
      completedAt: (data.phase1 && data.phase1.completedAt) || null,
      updatedAt: serverTimestamp()
    };

    const merged = {
      ...data,
      uid: user.uid,
      email: data.email || user.email || profile.email || '',
      displayName: data.displayName || user.displayName || profile.displayName || 'Sacred Seeker',
      membershipLevel: data.membershipLevel || profile.membershipLevel || 'basic',
      onboardingStatus: data.onboardingStatus || 'not_started',
      phase1: mergedPhase1,
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await usersRef.set(merged, { merge: true });
    return merged;
  }

  function resolvePostAuthRedirect(userData) {
    if (!isOnboardingComplete(userData)) {
      return getNextPhase1Url(userData);
    }

    if (membershipIsSacred(userData && userData.membershipLevel)) {
      return 'members-new.html';
    }

    return 'free-dashboard.html';
  }

  window.OnboardingFlow = {
    LESSON_SEQUENCE,
    ensurePhase1Record,
    isOnboardingComplete,
    getNextPhase1Url,
    resolvePostAuthRedirect
  };
})();
