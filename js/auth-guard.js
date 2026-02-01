/**
 * Auth Guard for Protected Pages
 * Add this to any page that requires authentication
 * Place before main page content loads
 */

(function() {
  // Check if user is authenticated
  const checkAuth = () => {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          // User not logged in
          console.log('⛔ Access denied: User not authenticated');
          
          // Show message and redirect
          const message = document.createElement('div');
          message.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(0,0,0,0.9); display: flex; align-items: center; 
                        justify-content: center; z-index: 9999;">
              <div style="background: #2D1B4E; padding: 2rem; border-radius: 12px; 
                          border: 1px solid #D4AF37; text-align: center; max-width: 400px;">
                <h2 style="color: #D4AF37; margin-bottom: 1rem;">Sacred Access Required</h2>
                <p style="color: #bbb; margin-bottom: 1.5rem;">Please log in to access this divine space.</p>
                <a href="members-new.html" style="background: #D4AF37; color: #2D1B4E; 
                          padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; 
                          font-weight: 600; display: inline-block;">Login Now</a>
              </div>
            </div>
          `;
          document.body.innerHTML = message.innerHTML;
          
          // Redirect after 3 seconds
          setTimeout(() => {
            window.location.href = 'members-new.html';
          }, 3000);
          
          resolve(false);
        } else {
          // User is logged in
          console.log('✅ Access granted:', user.email);
          
          // Check premium status if this is a premium feature
          const currentPage = window.location.pathname;
          const premiumPages = ['/premium-content', '/ai-guide.html', '/quests.html'];
          
          if (premiumPages.some(page => currentPage.includes(page))) {
            checkPremiumAccess(user);
          }
          
          resolve(true);
        }
      });
    });
  };

  // Check if user has premium access
  const checkPremiumAccess = async (user) => {
    try {
      const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      const isPremium = userDoc.data()?.premium || false;
      
      if (!isPremium) {
        console.log('⛔ Premium access required');
        
        // Show premium upgrade prompt
        const upgradePrompt = document.createElement('div');
        upgradePrompt.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                      background: rgba(0,0,0,0.9); display: flex; align-items: center; 
                      justify-content: center; z-index: 9999;">
            <div style="background: #2D1B4E; padding: 2rem; border-radius: 12px; 
                        border: 1px solid #D4AF37; text-align: center; max-width: 400px;">
              <h2 style="color: #D4AF37; margin-bottom: 1rem;">Premium Feature</h2>
              <p style="color: #bbb; margin-bottom: 1rem;">This feature requires a premium subscription.</p>
              <p style="color: #999; margin-bottom: 1.5rem; font-size: 0.9rem;">
                Join thousands experiencing the full consciousness transformation.
              </p>
              <div style="background: rgba(212,175,55,0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p style="color: #D4AF37; font-size: 1.5rem; font-weight: bold; margin: 0;">$9.99<span style="font-size: 0.8rem;">/month</span></p>
              </div>
              <a href="pricing.html" style="background: #D4AF37; color: #2D1B4E; 
                         padding: 0.75rem 2rem; border-radius: 6px; text-decoration: none; 
                         font-weight: 600; display: inline-block; margin-right: 1rem;">
                Upgrade Now
              </a>
              <a href="dashboard.html" style="background: transparent; color: #D4AF37; 
                         padding: 0.75rem 2rem; border-radius: 6px; border: 1px solid #D4AF37;
                         text-decoration: none; font-weight: 600; display: inline-block;">
                Go Back
              </a>
            </div>
          </div>
        `;
        
        // Replace page content
        document.body.innerHTML = upgradePrompt.innerHTML;
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  // Get protected pages configuration
  const getProtectedPages = () => {
    return {
      requiresAuth: [
        '/dashboard.html',
        '/chat.html',
        '/journal.html',
        '/profile.html',
        '/leaderboard.html',
        '/study-groups.html'
      ],
      requiresPremium: [
        '/ai-guide.html',
        '/quests.html',
        '/meditation.html',
        '/premium-content'
      ]
    };
  };

  // Initialize auth check on page load
  window.addEventListener('load', async () => {
    const isAuthenticated = await checkAuth();
    
    if (isAuthenticated) {
      // Show page content
      document.body.style.opacity = '1';
      document.body.style.pointerEvents = 'auto';
    }
  });

  // Also check on DOMContentLoaded for faster response
  document.addEventListener('DOMContentLoaded', async () => {
    // Hide content until auth check completes
    document.body.style.opacity = '0.5';
    document.body.style.pointerEvents = 'none';
  });

  // Export for external use
  window.AuthGuard = {
    checkAuth,
    checkPremiumAccess,
    getProtectedPages
  };
})();

console.log('✅ Auth guard initialized');
