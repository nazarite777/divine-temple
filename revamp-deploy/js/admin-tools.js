/**
 * 🔧 Premium Access Admin Tools
 * 
 * Console commands for managing premium access
 * Must be logged in as authorized admin to use
 */

// Add this to browser console for admin management
window.AdminTools = {
    
    // Check current user's authorization status
    async checkMyStatus() {
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('❌ Not logged in');
            return;
        }
        
        console.log('👤 Current User:', user.email);
        console.log('🔑 Is Authorized Admin:', FirebaseConfig.auth.isAuthorizedAdmin(user.email, user.displayName));
        console.log('💎 Is Authorized Premium:', FirebaseConfig.auth.isAuthorizedPremiumUser(user.email, user.displayName));
        console.log('📊 Membership Level:', localStorage.getItem('membershipLevel'));
    },
    
    // Enable premium access for a user (admin only)
    async enablePremiumForUser(userEmail, membershipLevel = 'premium') {
        try {
            console.log(`🔓 Enabling premium access for ${userEmail}...`);
            const result = await FirebaseConfig.auth.enablePremiumAccess(userEmail, membershipLevel);
            console.log('✅', result.message);
        } catch (error) {
            console.error('❌ Failed:', error.message);
        }
    },
    
    // Check a user's current membership level
    async checkUserMembership(userEmail) {
        try {
            const usersQuery = await firebase.firestore()
                .collection('users')
                .where('email', '==', userEmail)
                .get();
                
            if (usersQuery.empty) {
                console.log('❌ User not found:', userEmail);
                return;
            }
            
            const userData = usersQuery.docs[0].data();
            console.log('👤 User:', userEmail);
            console.log('📊 Membership Level:', userData.membershipLevel || 'basic');
            console.log('📅 Created:', userData.createdAt?.toDate());
            console.log('💎 Premium Enabled At:', userData.premiumEnabledAt?.toDate() || 'Never');
            console.log('🔧 Enabled By:', userData.enabledBy || 'N/A');
            
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    },
    
    // List all users with premium memberships
    async listPremiumUsers() {
        try {
            console.log('🔍 Searching for premium users...');
            
            const premiumQuery = await firebase.firestore()
                .collection('users')
                .where('membershipLevel', 'in', ['premium', 'elite', 'admin', 'founding'])
                .get();
                
            if (premiumQuery.empty) {
                console.log('📭 No premium users found');
                return;
            }
            
            console.log(`💎 Found ${premiumQuery.docs.length} premium users:`);
            premiumQuery.docs.forEach(doc => {
                const data = doc.data();
                const isAuthorized = ['cbevvv@gmail.com', 'nazir23'].includes(data.email?.toLowerCase());
                console.log(`  ${isAuthorized ? '🟢' : '🔴'} ${data.email} (${data.membershipLevel})`);
            });
            
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    },
    
    // Test access control for current page
    async testPageAccess() {
        await window.PremiumAccessControl.initialize();
        
        const currentFile = window.location.pathname.split('/').pop();
        const hasAccess = await window.PremiumAccessControl.hasAccessToCurrentPage();
        
        console.log('📄 Current Page:', currentFile);
        console.log('🔐 Premium Required:', window.PremiumAccessControl.isCurrentPagePremium());
        console.log('✅ Has Access:', hasAccess);
        console.log('💎 Premium Access:', window.PremiumAccessControl.hasPremiumAccess);
    }
};

// Quick access commands
window.checkMyStatus = window.AdminTools.checkMyStatus;
window.enablePremium = window.AdminTools.enablePremiumForUser;
window.checkUser = window.AdminTools.checkUserMembership;
window.listPremium = window.AdminTools.listPremiumUsers;
window.testAccess = window.AdminTools.testPageAccess;

console.log(`
🔧 ADMIN TOOLS LOADED

Quick Commands:
• checkMyStatus()                    - Check your authorization
• enablePremium('email@example.com') - Enable premium for user (admin only)
• checkUser('email@example.com')     - Check user's membership
• listPremium()                      - List all premium users  
• testAccess()                       - Test current page access

Full API:
• AdminTools.checkMyStatus()
• AdminTools.enablePremiumForUser(email, level)
• AdminTools.checkUserMembership(email)
• AdminTools.listPremiumUsers()
• AdminTools.testPageAccess()
`);