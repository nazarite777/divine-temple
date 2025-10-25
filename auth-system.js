// ============================================
// COMPREHENSIVE MEMBER REGISTRATION & AUTHENTICATION SYSTEM
// ============================================

// Registration and payment integration functions
function showAuthTab(tabName) {
    // Hide all forms
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.remove('active');
    
    // Remove active from all tabs
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    
    // Show selected form and tab
    document.getElementById(`${tabName}-form`).classList.add('active');
    document.querySelector(`[onclick="showAuthTab('${tabName}')"]`).classList.add('active');
}

function updatePricing() {
    const membershipSelect = document.getElementById('membership-type');
    const pricingDisplay = document.getElementById('pricing-display');
    const priceAmount = document.getElementById('price-amount');
    
    if (membershipSelect.value) {
        const selectedOption = membershipSelect.selectedOptions[0];
        const price = selectedOption.getAttribute('data-price');
        
        pricingDisplay.style.display = 'block';
        priceAmount.textContent = `$${price}`;
        
        // Update benefits based on membership type
        updateMembershipBenefits(membershipSelect.value);
    } else {
        pricingDisplay.style.display = 'none';
    }
}

function updateMembershipBenefits(membershipType) {
    const benefitsList = document.querySelector('.price-info ul');
    
    let benefits = [
        '🏛️ Full access to 4 Sacred Portals',
        '📔 Dreams & Visions tracking',
        '📚 Sacred Library with ancient texts',
        '🤝 Community Hub for spiritual connection',
        '🧿 Ancient Wisdom teachings',
        '⭐ 14+ additional spiritual tools',
        '📧 Direct support & guidance'
    ];
    
    if (membershipType === 'founding') {
        benefits.push('👑 Founding Member status (Lifetime)');
        benefits.push('🎓 Licensed facilitator training included');
        benefits.push('📖 All future books FREE forever');
        benefits.push('🌟 Leadership development opportunities');
    } else if (membershipType === 'student') {
        benefits.push('📚 6 months full access');
        benefits.push('🎧 Audiobook included');
        benefits.push('📝 Workbook included');
    }
    
    benefitsList.innerHTML = benefits.map(benefit => `<li>${benefit}</li>`).join('');
}

function proceedToPayment() {
    const firstName = document.getElementById('reg-firstname').value.trim();
    const lastName = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const membershipType = document.getElementById('membership-type').value;
    
    const errorDiv = document.getElementById('registration-error');
    errorDiv.style.display = 'none';
    
    // Validation
    if (!firstName || !lastName || !email || !membershipType) {
        errorDiv.textContent = '❌ Please fill in all fields before proceeding to payment.';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorDiv.textContent = '❌ Please enter a valid email address.';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Store registration data temporarily
    const registrationData = {
        firstName,
        lastName,
        email,
        membershipType,
        timestamp: Date.now()
    };
    
    localStorage.setItem('pendingRegistration', JSON.stringify(registrationData));
    
    // Redirect to appropriate payment link
    let paymentUrl;
    switch (membershipType) {
        case 'founding':
            paymentUrl = 'https://square.link/u/xuKzAPeA';
            break;
        case 'monthly':
            paymentUrl = 'https://square.link/u/g8CFT019';
            break;
        case 'student':
            paymentUrl = 'https://square.link/u/qodANI9O';
            break;
        default:
            errorDiv.textContent = '❌ Invalid membership type selected.';
            errorDiv.style.display = 'block';
            return;
    }
    
    // Open payment in new window
    const paymentWindow = window.open(paymentUrl, '_blank');
    
    // Show payment pending message
    document.getElementById('register-form').innerHTML = `
        <div class="auth-header">
            <h2>💳 Payment Processing</h2>
            <p>Complete your payment to receive Divine Credentials</p>
        </div>
        
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">⏳</div>
            <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Payment Window Opened</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                Complete your payment in the new window, then return here to receive your Divine Credentials.
            </p>
            
            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 0.75rem; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: var(--accent-gold); margin-bottom: 1rem;">📋 Registration Summary:</h4>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Membership:</strong> ${document.getElementById('membership-type').selectedOptions[0].textContent}</p>
            </div>
            
            <button onclick="checkPaymentCompletion()" class="auth-btn" style="margin-top: 1rem;">
                ✅ I've Completed Payment
            </button>
            
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem;">
                After payment, you'll receive an email with your unique Divine Credentials within 5 minutes.
            </p>
        </div>
        
        <div class="auth-footer">
            <p>Need help? <a href="mailto:edenconsciousnesssdt@gmail.com">Contact Support</a></p>
        </div>
    `;
}

function checkPaymentCompletion() {
    const pendingData = localStorage.getItem('pendingRegistration');
    
    if (!pendingData) {
        alert('No pending registration found. Please restart the registration process.');
        location.reload();
        return;
    }
    
    const registrationData = JSON.parse(pendingData);
    
    // In a real implementation, this would verify payment with Square API
    // For now, we'll simulate the registration process
    
    // Generate unique payment ID for tracking
    const paymentId = 'SQ' + Date.now() + Math.floor(Math.random() * 1000);
    registrationData.paymentId = paymentId;
    
    // Register the new member
    const newMember = registerNewMember(registrationData);
    
    // Clear pending registration
    localStorage.removeItem('pendingRegistration');
    
    // Show success and credentials
    document.getElementById('register-form').innerHTML = `
        <div class="auth-header">
            <h2>🎉 Welcome to the Divine Temple!</h2>
            <p>Your registration is complete</p>
        </div>
        
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✨</div>
            
            <div style="background: rgba(34, 197, 94, 0.2); border: 2px solid #22c55e; border-radius: 1rem; padding: 2rem; margin: 1rem 0;">
                <h3 style="color: #22c55e; margin-bottom: 1.5rem;">🔑 Your Divine Credentials</h3>
                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="font-family: monospace; font-size: 1.1rem; margin: 0.5rem 0;">
                        <strong>Divine Name:</strong> <span style="color: var(--accent-gold);">${newMember.divineName}</span>
                    </p>
                    <p style="font-family: monospace; font-size: 1.1rem; margin: 0.5rem 0;">
                        <strong>Sacred Key:</strong> <span style="color: var(--accent-gold);">${newMember.sacredKey}</span>
                    </p>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem;">
                    ⚠️ Save these credentials safely! They grant access to your sacred portals.
                </p>
            </div>
            
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 0.75rem; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: var(--accent-blue); margin-bottom: 1rem;">📧 Welcome Email Sent</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    Check ${newMember.email} for your welcome email with these credentials and getting started guide.
                </p>
            </div>
            
            <button onclick="useNewCredentials('${newMember.divineName}', '${newMember.sacredKey}')" class="auth-btn" style="margin-top: 1.5rem;">
                🏛️ Enter Divine Temple Now
            </button>
        </div>
    `;
}

function useNewCredentials(divineName, sacredKey) {
    // Fill in the login form
    document.getElementById('divine-name').value = divineName;
    document.getElementById('sacred-key').value = sacredKey;
    
    // Switch to login tab
    showAuthTab('login');
    
    // Auto-submit after a moment
    setTimeout(() => {
        document.querySelector('#login-form form').dispatchEvent(new Event('submit'));
    }, 1000);
}

function processRegistration(event) {
    event.preventDefault();
    proceedToPayment();
}

// Enhanced authentication with member database lookup
function authenticateUser(event) {
    event.preventDefault();
    
    const divineName = document.getElementById('divine-name').value.trim();
    const sacredKey = document.getElementById('sacred-key').value;
    
    const errorDiv = document.getElementById('auth-error');
    const successDiv = document.getElementById('auth-success');
    
    // Hide previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validate credentials against member database
    const member = validateMemberCredentials(divineName, sacredKey);
    
    if (member) {
        // Success - store authentication and show portal
        localStorage.setItem('divineAuthenticated', 'true');
        localStorage.setItem('currentMember', JSON.stringify(member));
        localStorage.setItem('authTimestamp', Date.now().toString());
        
        successDiv.innerHTML = `✨ Welcome back to the Divine Temple, ${member.firstName || 'Sacred One'}! ✨`;
        successDiv.style.display = 'block';
        
        // Add welcome back activity
        addToActivityFeed(`🏛️ ${member.firstName || member.divineName} entered the Divine Temple`, 'login');
        
        setTimeout(() => {
            document.getElementById('auth-overlay').style.display = 'none';
            document.body.classList.remove('auth-active');
            
            // Update member info in UI
            updateMemberInfo(member);
        }, 2000);
    } else {
        errorDiv.textContent = '❌ Invalid Divine Credentials. Please check your Divine Name and Sacred Key.';
        errorDiv.style.display = 'block';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing authentication
    if (!checkAuthentication()) {
        showAuthOverlay();
    }
    
    // Check for completed payment (if user returns from payment)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        // Payment was successful, check for pending registration
        const pendingData = localStorage.getItem('pendingRegistration');
        if (pendingData) {
            // Show registration completion
            showAuthTab('register');
            setTimeout(checkPaymentCompletion, 1000);
        }
    }
});