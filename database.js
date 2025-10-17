/**
 * Database Module
 * Handles all Firestore database operations
 */

let syncStatusElement = null;
let lastSyncTime = null;

/**
 * Initialize sync status indicator
 */
function initSyncStatus() {
    syncStatusElement = document.getElementById('sync-status');
    updateSyncStatus('synced');
}

/**
 * Update sync status indicator
 */
function updateSyncStatus(status) {
    if (!syncStatusElement) return;
    
    switch (status) {
        case 'syncing':
            syncStatusElement.innerHTML = '🔄 Syncing...';
            syncStatusElement.style.color = '#3B82F6';
            break;
        case 'synced':
            syncStatusElement.innerHTML = '✅ Synced';
            syncStatusElement.style.color = '#10B981';
            lastSyncTime = new Date();
            break;
        case 'offline':
            syncStatusElement.innerHTML = '📴 Offline';
            syncStatusElement.style.color = '#F59E0B';
            break;
        case 'error':
            syncStatusElement.innerHTML = '⚠️ Sync Error';
            syncStatusElement.style.color = '#EF4444';
            break;
    }
}

/**
 * Save user data to Firestore
 */
async function saveUserData(userId, data) {
    try {
        updateSyncStatus('syncing');
        
        await firebase.firestore()
            .collection('userData')
            .doc(userId)
            .set(data, { merge: true });
        
        updateSyncStatus('synced');
        console.log('✅ User data saved to Firebase');
        return { success: true };
    } catch (error) {
        console.error('❌ Error saving user data:', error);
        updateSyncStatus('error');
        
        // Fallback to localStorage
        saveToLocalStorage(data);
        
        return { success: false, error: error.message };
    }
}

/**
 * Get user data from Firestore
 */
async function getUserData(userId) {
    try {
        const doc = await firebase.firestore()
            .collection('userData')
            .doc(userId)
            .get();
        
        if (doc.exists) {
            console.log('✅ User data loaded from Firebase');
            return { success: true, data: doc.data() };
        } else {
            console.log('ℹ️ No user data found in Firebase');
            return { success: true, data: null };
        }
    } catch (error) {
        console.error('❌ Error getting user data:', error);
        updateSyncStatus('error');
        
        // Fallback to localStorage
        const localData = loadFromLocalStorage();
        return { success: false, error: error.message, data: localData };
    }
}

/**
 * Update specific fields in user data
 */
async function updateUserData(userId, updates) {
    try {
        updateSyncStatus('syncing');
        
        await firebase.firestore()
            .collection('userData')
            .doc(userId)
            .update(updates);
        
        updateSyncStatus('synced');
        console.log('✅ User data updated in Firebase');
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating user data:', error);
        updateSyncStatus('error');
        return { success: false, error: error.message };
    }
}

/**
 * Save user profile data
 */
async function saveUserProfile(userId, profileData) {
    try {
        await firebase.firestore()
            .collection('users')
            .doc(userId)
            .update(profileData);
        
        console.log('✅ User profile saved');
        return { success: true };
    } catch (error) {
        console.error('❌ Error saving user profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get user profile data
 */
async function getUserProfile(userId) {
    try {
        const doc = await firebase.firestore()
            .collection('users')
            .doc(userId)
            .get();
        
        if (doc.exists) {
            return { success: true, data: doc.data() };
        } else {
            return { success: false, error: 'User profile not found' };
        }
    } catch (error) {
        console.error('❌ Error getting user profile:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Listen for real-time updates to user data
 */
function listenToUserData(userId, callback) {
    return firebase.firestore()
        .collection('userData')
        .doc(userId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log('🔄 User data updated from Firebase');
                callback(doc.data());
            }
        }, (error) => {
            console.error('❌ Error listening to user data:', error);
            updateSyncStatus('error');
        });
}

/**
 * Update membership type
 */
async function updateMembershipType(userId, membershipType) {
    try {
        const updates = {
            membershipType: membershipType,
            membershipStartDate: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await firebase.firestore()
            .collection('users')
            .doc(userId)
            .update(updates);
        
        console.log('✅ Membership updated to:', membershipType);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating membership:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Save completed chamber
 */
async function saveCompletedChamber(userId, chamberIndex, responses) {
    try {
        updateSyncStatus('syncing');
        
        const userDataRef = firebase.firestore()
            .collection('userData')
            .doc(userId);
        
        await userDataRef.update({
            completedChambers: firebase.firestore.FieldValue.arrayUnion(chamberIndex),
            [`responses.${chamberIndex}`]: responses,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        updateSyncStatus('synced');
        console.log('✅ Chamber completion saved');
        return { success: true };
    } catch (error) {
        console.error('❌ Error saving chamber completion:', error);
        updateSyncStatus('error');
        return { success: false, error: error.message };
    }
}

/**
 * Save daily log
 */
async function saveDailyLog(userId, date, logData) {
    try {
        updateSyncStatus('syncing');
        
        const userDataRef = firebase.firestore()
            .collection('userData')
            .doc(userId);
        
        await userDataRef.update({
            [`dailyLogs.${date}`]: logData,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        updateSyncStatus('synced');
        console.log('✅ Daily log saved');
        return { success: true };
    } catch (error) {
        console.error('❌ Error saving daily log:', error);
        updateSyncStatus('error');
        return { success: false, error: error.message };
    }
}

/**
 * Save manifestation
 */
async function saveManifestation(userId, manifestation) {
    try {
        updateSyncStatus('syncing');
        
        const userDataRef = firebase.firestore()
            .collection('userData')
            .doc(userId);
        
        await userDataRef.update({
            manifestations: firebase.firestore.FieldValue.arrayUnion(manifestation),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        updateSyncStatus('synced');
        console.log('✅ Manifestation saved');
        return { success: true };
    } catch (error) {
        console.error('❌ Error saving manifestation:', error);
        updateSyncStatus('error');
        return { success: false, error: error.message };
    }
}

/**
 * Fallback: Save to localStorage
 */
function saveToLocalStorage(data) {
    try {
        localStorage.setItem('temple-userdata-backup', JSON.stringify(data));
        console.log('💾 Data saved to localStorage backup');
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
    }
}

/**
 * Fallback: Load from localStorage
 */
function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('temple-userdata-backup');
        if (data) {
            console.log('💾 Data loaded from localStorage backup');
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
        return null;
    }
}

/**
 * Load user data into application state
 */
async function loadUserData() {
    const user = firebase.auth().currentUser;
    if (!user) {
        console.log('⚠️ No user authenticated, cannot load data');
        return;
    }
    
    const result = await getUserData(user.uid);
    if (result.success && result.data) {
        // Convert data to application state format
        applyUserDataToState(result.data);
    } else if (result.data) {
        // Loaded from localStorage backup
        applyUserDataToState(result.data);
    }
}

/**
 * Apply user data to application state
 */
function applyUserDataToState(data) {
    if (!data) return;
    
    // Update completedChambers
    if (data.completedChambers && Array.isArray(data.completedChambers)) {
        state.completedChambers = new Set(data.completedChambers);
    }
    
    // Update responses
    if (data.responses) {
        state.responses = data.responses;
    }
    
    // Update manifestations
    if (data.manifestations && Array.isArray(data.manifestations)) {
        state.manifestations = data.manifestations;
    }
    
    // Update daily logs
    if (data.dailyLogs) {
        state.dailyLogs = data.dailyLogs;
    }
    
    // Update achievements
    if (data.achievements && Array.isArray(data.achievements)) {
        state.achievements = data.achievements;
    }
    
    // Update current Enoch day
    if (data.currentEnochDay) {
        state.currentEnochDay = data.currentEnochDay;
    }
    
    console.log('✅ User data applied to application state');
    
    // Update UI
    updateAllDisplays();
}

/**
 * Sync current state to Firebase
 */
async function syncStateToFirebase() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const data = {
        completedChambers: Array.from(state.completedChambers),
        responses: state.responses,
        manifestations: state.manifestations,
        dailyLogs: state.dailyLogs,
        achievements: state.achievements,
        currentEnochDay: state.currentEnochDay,
        stats: {
            chambersCompleted: state.completedChambers.size,
            manifestationsCount: state.manifestations.length,
            daysLogged: Object.keys(state.dailyLogs).length
        },
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await saveUserData(user.uid, data);
}

/**
 * Update all UI displays after loading data
 */
function updateAllDisplays() {
    // Update stats
    const chambersCompleted = state.completedChambers.size;
    const daysLogged = Object.keys(state.dailyLogs).length;
    
    const statChambers = document.getElementById('stat-chambers');
    const statDays = document.getElementById('stat-days');
    
    if (statChambers) statChambers.textContent = chambersCompleted + '/9';
    if (statDays) statDays.textContent = daysLogged;
    
    // Update other displays as needed
    updateCalendar();
    updateMeditationDisplay();
}
