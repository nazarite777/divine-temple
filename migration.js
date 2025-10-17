/**
 * Migration Module
 * Handles migration of localStorage data to Firebase
 */

/**
 * Check if user has localStorage data that needs migration
 */
function hasLocalStorageData() {
    const membership = localStorage.getItem('temple-membership');
    const email = localStorage.getItem('temple-email');
    const backup = localStorage.getItem('temple-userdata-backup');
    
    return !!(membership || email || backup);
}

/**
 * Get localStorage data for migration
 */
function getLocalStorageData() {
    const data = {
        membershipType: localStorage.getItem('temple-membership') || 'free',
        membershipStartDate: localStorage.getItem('temple-start-date') || null,
        email: localStorage.getItem('temple-email') || null,
        backup: null
    };
    
    // Try to get backup data
    try {
        const backupStr = localStorage.getItem('temple-userdata-backup');
        if (backupStr) {
            data.backup = JSON.parse(backupStr);
        }
    } catch (error) {
        console.error('Error parsing localStorage backup:', error);
    }
    
    return data;
}

/**
 * Migrate localStorage data to Firebase
 */
async function migrateLocalStorageToFirebase(userId) {
    try {
        const localData = getLocalStorageData();
        
        // Prepare user profile data
        const profileData = {
            membershipType: localData.membershipType
        };
        
        if (localData.membershipStartDate) {
            profileData.membershipStartDate = new Date(localData.membershipStartDate);
        }
        
        // Save user profile
        await saveUserProfile(userId, profileData);
        
        // Prepare user data (progress, logs, etc.)
        let userData = {
            completedChambers: [],
            responses: {},
            manifestations: [],
            dailyLogs: {},
            achievements: [],
            currentEnochDay: 1,
            stats: {}
        };
        
        // If backup exists, use it
        if (localData.backup) {
            userData = {
                ...userData,
                ...localData.backup
            };
        }
        
        // Save user data
        await saveUserData(userId, userData);
        
        // Mark migration as complete
        localStorage.setItem('temple-migration-complete', 'true');
        localStorage.setItem('temple-migration-date', new Date().toISOString());
        
        console.log('✅ Migration to Firebase completed successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Migration error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check if migration is needed and prompt user
 */
function checkAndPromptMigration() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const migrationComplete = localStorage.getItem('temple-migration-complete');
    
    if (!migrationComplete && hasLocalStorageData()) {
        showMigrationPrompt();
    } else {
        hideMigrationBanner();
    }
}

/**
 * Show migration prompt to user
 */
function showMigrationPrompt() {
    const banner = document.getElementById('migration-banner');
    if (banner) {
        banner.style.display = 'block';
    }
}

/**
 * Hide migration banner
 */
function hideMigrationBanner() {
    const banner = document.getElementById('migration-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

/**
 * Handle migration button click
 */
async function handleMigration() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('❌ Please sign in to migrate your data');
        return;
    }
    
    const confirmed = confirm(
        '🔄 Migrate Your Data\n\n' +
        'This will transfer your saved progress from this browser to your new account.\n\n' +
        'Your data will be:\n' +
        '✅ Saved to the cloud\n' +
        '✅ Accessible from any device\n' +
        '✅ Safely backed up\n\n' +
        'Your local data will be kept as a backup.\n\n' +
        'Continue with migration?'
    );
    
    if (!confirmed) return;
    
    // Show loading
    const migrateBtn = document.getElementById('migrate-btn');
    if (migrateBtn) {
        migrateBtn.disabled = true;
        migrateBtn.textContent = '🔄 Migrating...';
    }
    
    const result = await migrateLocalStorageToFirebase(user.uid);
    
    if (result.success) {
        alert('✅ Migration completed successfully!\n\nYour data is now safely stored in the cloud and will sync across all your devices.');
        hideMigrationBanner();
        
        // Reload user data from Firebase
        await loadUserData();
    } else {
        alert('❌ Migration failed: ' + result.error + '\n\nYour local data is still safe. Please try again or contact support.');
    }
    
    // Reset button
    if (migrateBtn) {
        migrateBtn.disabled = false;
        migrateBtn.textContent = '🔄 Migrate My Data';
    }
}

/**
 * Skip migration (dismiss banner)
 */
function skipMigration() {
    const confirmed = confirm(
        '⚠️ Skip Migration?\n\n' +
        'If you skip, your current progress will NOT be saved to the cloud.\n\n' +
        'You can migrate later from your profile settings.\n\n' +
        'Continue without migrating?'
    );
    
    if (confirmed) {
        hideMigrationBanner();
        // Set a flag to not show again this session
        sessionStorage.setItem('migration-skipped', 'true');
    }
}

/**
 * Export user data for download
 */
function exportUserData() {
    const user = firebase.auth().currentUser;
    
    const data = {
        exportDate: new Date().toISOString(),
        user: user ? {
            email: user.email,
            displayName: user.displayName
        } : null,
        state: {
            completedChambers: Array.from(state.completedChambers),
            responses: state.responses,
            manifestations: state.manifestations,
            dailyLogs: state.dailyLogs,
            achievements: state.achievements,
            currentEnochDay: state.currentEnochDay,
            membershipType: state.membershipType
        },
        localStorage: getLocalStorageData()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `divine-temple-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ User data exported');
}
