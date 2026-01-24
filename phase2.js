// Phase 2: Understanding - JavaScript Functionality

// Firebase Configuration
let db;
let auth;
let currentUser = null;

// Initialize Firebase
async function initializeFirebase() {
    try {
        // Check if firebase-app.js has loaded
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length === 0) {
            // Firebase config would be set elsewhere in your app
            // For now, we'll handle the case where it's already initialized
        }
        
        if (typeof firebase !== 'undefined') {
            db = firebase.firestore();
            auth = firebase.auth();
            
            // Listen for auth changes
            auth.onAuthStateChanged(user => {
                currentUser = user;
                if (user) {
                    checkPremiumAccess(user.uid);
                    loadPhase2Progress(user.uid);
                } else {
                    showPremiumGate();
                }
            });
        }
    } catch (error) {
        console.log('Firebase initialization skipped - using demo mode');
    }
}

// Premium Access Control
async function checkPremiumAccess(userId) {
    try {
        if (db && userId) {
            const userDoc = await db.collection('users').doc(userId).get();
            const isPremium = userDoc.data()?.premium_access || false;
            
            if (!isPremium) {
                showPremiumGate();
            } else {
                hidePremiumGate();
            }
        } else {
            // Demo mode - allow access but show notice
            allowDemoAccess();
        }
    } catch (error) {
        console.log('Premium check error - allowing demo mode');
        allowDemoAccess();
    }
}

function showPremiumGate() {
    const gateContainer = document.getElementById('premium-gate-container');
    gateContainer.innerHTML = `
        <div class="premium-gate-overlay">
            <div class="premium-gate-content">
                <h2>🔒 Premium Access Required</h2>
                <p>Phase 2: Understanding is an exclusive feature for premium members. Unlock your full journey to consciousness transformation.</p>
                <button class="upgrade-button" onclick="redirectToUpgrade()">
                    Upgrade to Premium 👑
                </button>
            </div>
        </div>
    `;
}

function hidePremiumGate() {
    const gateContainer = document.getElementById('premium-gate-container');
    gateContainer.innerHTML = '';
}

function allowDemoAccess() {
    // In demo mode, allow access but disable save functionality
    hidePremiumGate();
    console.log('Phase 2 running in demo mode');
}

function redirectToUpgrade() {
    window.location.href = '/premium-success.html';
}

// Toggle Principle Expansion
function togglePrinciple(principleNumber) {
    const content = document.getElementById(`principle-${principleNumber}-content`);
    const expandButton = document.querySelector(`.principle-card[data-principle="${principleNumber}"] .expand-button`);
    
    content.classList.toggle('expanded');
    content.classList.toggle('collapsed');
    
    if (expandButton) {
        expandButton.classList.toggle('expanded');
        expandButton.textContent = content.classList.contains('expanded') ? 'Hide Details ▲' : 'Show Details ▼';
    }
}

// Mark Principle as Complete
async function markPrincipleComplete(principleNumber) {
    const statusElement = document.getElementById(`principle-${principleNumber}-status`);
    const button = event.target;
    
    // Visual feedback
    button.disabled = true;
    button.textContent = '✓ Saving...';
    
    try {
        if (currentUser && db) {
            // Save to Firebase
            const docRef = db.collection('users').doc(currentUser.uid).collection('journey_progress').doc('phase2');
            const docSnap = await docRef.get();
            
            let completedPrinciples = docSnap.data()?.completed_principles || [];
            if (!completedPrinciples.includes(principleNumber)) {
                completedPrinciples.push(principleNumber);
            }
            
            await docRef.set({
                phase: 2,
                completed_principles: completedPrinciples,
                last_updated: new Date(),
                principle_completion_dates: {
                    ...docSnap.data()?.principle_completion_dates,
                    [`principle_${principleNumber}`]: new Date()
                }
            }, { merge: true });
        }
        
        // Update UI
        statusElement.innerHTML = '<span class="status-badge completed">✓ Completed</span>';
        button.textContent = '✓ Completed!';
        button.style.opacity = '0.6';
        
        // Update overall progress
        updatePhase2Progress();
        
        // Show mini celebration
        createConfetti();
        
    } catch (error) {
        console.error('Error marking principle complete:', error);
        button.disabled = false;
        button.textContent = '✓ Mark Principle ' + principleNumber + ' Complete';
        alert('Error saving progress. Please try again.');
    }
}

// Load Phase 2 Progress
async function loadPhase2Progress(userId) {
    try {
        if (db && userId) {
            const docRef = db.collection('users').doc(userId).collection('journey_progress').doc('phase2');
            const docSnap = await docRef.get();
            
            if (docSnap.exists()) {
                const completedPrinciples = docSnap.data().completed_principles || [];
                
                // Update UI for completed principles
                completedPrinciples.forEach(principleNum => {
                    const statusElement = document.getElementById(`principle-${principleNum}-status`);
                    const button = document.querySelector(
                        `.principle-card[data-principle="${principleNum}"] .complete-button`
                    );
                    
                    if (statusElement) {
                        statusElement.innerHTML = '<span class="status-badge completed">✓ Completed</span>';
                    }
                    if (button) {
                        button.textContent = '✓ Completed!';
                        button.disabled = true;
                        button.style.opacity = '0.6';
                    }
                    
                    // Load practice checkboxes
                    loadPracticeCheckboxes(principleNum);
                });
                
                // Update overall progress
                updatePhase2Progress();
            }
        }
    } catch (error) {
        console.error('Error loading phase 2 progress:', error);
    }
}

// Load Practice Checkboxes State
async function loadPracticeCheckboxes(principleNumber) {
    try {
        if (currentUser && db) {
            const docRef = db.collection('users').doc(currentUser.uid)
                .collection('journey_progress').doc(`phase2_principle_${principleNumber}`);
            const docSnap = await docRef.get();
            
            if (docSnap.exists()) {
                const checkedPractices = docSnap.data().checked_practices || {};
                
                // Update checkboxes
                document.querySelectorAll(
                    `.practice-checkbox[data-principle="${principleNumber}"]`
                ).forEach(checkbox => {
                    const index = checkbox.dataset.index;
                    checkbox.checked = checkedPractices[`practice_${index}`] || false;
                });
            }
        }
    } catch (error) {
        console.error('Error loading practice checkboxes:', error);
    }
}

// Save Practice Checkbox State
async function savePracticeCheckbox(principleNumber, practiceIndex, isChecked) {
    try {
        if (currentUser && db) {
            const docRef = db.collection('users').doc(currentUser.uid)
                .collection('journey_progress').doc(`phase2_principle_${principleNumber}`);
            
            const docSnap = await docRef.get();
            let checkedPractices = docSnap.data()?.checked_practices || {};
            
            checkedPractices[`practice_${practiceIndex}`] = isChecked;
            
            await docRef.set({
                principle: principleNumber,
                checked_practices: checkedPractices,
                last_updated: new Date()
            }, { merge: true });
        }
    } catch (error) {
        console.error('Error saving practice checkbox:', error);
    }
}

// Update Overall Phase 2 Progress
function updatePhase2Progress() {
    const completedElements = document.querySelectorAll('.status-badge.completed');
    const totalPrinciples = 6;
    const completedCount = completedElements.length;
    
    // Update completed counter
    document.getElementById('principles-completed').textContent = `${completedCount}/${totalPrinciples}`;
    
    // Update progress bar
    const progressPercentage = (completedCount / totalPrinciples) * 100;
    document.getElementById('phase2-progress-bar').style.width = progressPercentage + '%';
    document.getElementById('phase2-progress-text').textContent = Math.round(progressPercentage) + '% Complete';
    
    // Update unlock text for Phase 3
    document.getElementById('unlock-text-phase3').textContent = `${completedCount}/${totalPrinciples} principles completed`;
    
    // Check if all principles are complete
    if (completedCount === totalPrinciples) {
        unlockPhase3();
    }
}

// Unlock Phase 3
function unlockPhase3() {
    const phase3Preview = document.getElementById('phase3-preview');
    phase3Preview.classList.remove('locked');
    phase3Preview.classList.add('unlocked');
    phase3Preview.innerHTML = `
        <h3>✅ Phase 2 Complete!</h3>
        <p>You've mastered the 6 Principles. Ready for Phase 3: Living the Calendar</p>
        <button class="cta-button" onclick="window.location.href='phase3-mastery.html'">
            Begin Phase 3: Mastery →
        </button>
    `;
    
    // Award badge if connected to Firebase
    if (currentUser && db) {
        awardBadge('understanding-master');
    }
    
    // Big celebration
    createConfettiExplosion();
}

// Award Badge
async function awardBadge(badgeId) {
    try {
        if (currentUser && db) {
            const userRef = db.collection('users').doc(currentUser.uid);
            const userDoc = await userRef.get();
            
            let badges = userDoc.data()?.badges || [];
            if (!badges.includes(badgeId)) {
                badges.push(badgeId);
                await userRef.update({ badges: badges });
            }
        }
    } catch (error) {
        console.error('Error awarding badge:', error);
    }
}

// Download Guide (PDF)
function downloadGuide(guideNumber) {
    // This will link to your PDF guides hosted on your server
    const guides = {
        1: '/guides/guide1-awakening-starter-kit.pdf',
        2: '/guides/guide2-manifestation-mastery.pdf',
        3: '/guides/guide3-sacred-timing.pdf',
        4: '/guides/guide4-divine-language-mastery.pdf',
        5: '/guides/guide5-vision-activation.pdf',
        10: '/guides/guide10-five-elements-mastery.pdf'
    };
    
    const guideUrl = guides[guideNumber];
    if (guideUrl) {
        // Check if file exists first
        fetch(guideUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    window.open(guideUrl, '_blank');
                } else {
                    alert(`Guide ${guideNumber} is not yet available. Please check back soon!`);
                }
            })
            .catch(error => {
                alert(`Guide ${guideNumber} is not yet available. Please check back soon!`);
                console.log('Guide file not found:', guideUrl);
            });
    }
}

// Confetti Effect
function createConfetti() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = ['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981'][
                Math.floor(Math.random() * 4)
            ];
            confetti.style.animation = `fall ${2 + Math.random()}s linear`;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Big Celebration Confetti
function createConfettiExplosion() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '50vh';
            confetti.style.width = (5 + Math.random() * 10) + 'px';
            confetti.style.height = (5 + Math.random() * 10) + 'px';
            confetti.style.backgroundColor = ['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981'][
                Math.floor(Math.random() * 4)
            ];
            confetti.style.animation = `explode ${3 + Math.random() * 2}s ease-out`;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 10);
    }
}

// CSS Animations for Confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
        }
    }
    
    @keyframes explode {
        0% {
            transform: translate(0, 0) rotateZ(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(
                ${Math.cos(Math.random() * Math.PI * 2) * 300}px,
                ${Math.sin(Math.random() * Math.PI * 2) * 300}px
            ) rotateZ(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add Event Listeners for Practice Checkboxes
document.addEventListener('change', function(event) {
    if (event.target.classList.contains('practice-checkbox')) {
        const principleNumber = event.target.dataset.principle;
        const practiceIndex = event.target.dataset.index;
        const isChecked = event.target.checked;
        
        savePracticeCheckbox(principleNumber, practiceIndex, isChecked);
    }
});

// Highlight Current Progress on Timeline
function highlightTimelineProgress() {
    const completedElements = document.querySelectorAll('.status-badge.completed');
    const completedCount = completedElements.length;
    
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        if (index < completedCount) {
            item.style.opacity = '1';
            item.style.borderColor = '#10B981';
        } else if (index === completedCount) {
            item.style.opacity = '0.8';
            item.style.borderColor = '#F59E0B';
        } else {
            item.style.opacity = '0.5';
        }
    });
}

// Save Progress to Firebase (Optional Auto-Save)
async function autoSaveProgress() {
    try {
        if (currentUser && db) {
            // Collect current UI state
            const completedCount = document.querySelectorAll('.status-badge.completed').length;
            
            const docRef = db.collection('users').doc(currentUser.uid).collection('journey_progress').doc('phase2');
            await docRef.set({
                phase: 2,
                last_viewed: new Date(),
                progress_percentage: (completedCount / 6) * 100
            }, { merge: true });
        }
    } catch (error) {
        console.error('Error auto-saving progress:', error);
    }
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Phase 2: Understanding page loaded');
    
    // Initialize Firebase
    initializeFirebase();
    
    // Initialize UI
    updatePhase2Progress();
    highlightTimelineProgress();
    
    // Auto-save every 30 seconds
    setInterval(autoSaveProgress, 30000);
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Keyboard Navigation
document.addEventListener('keydown', function(event) {
    // Alt + P to toggle principle details
    if (event.altKey && event.key === 'p') {
        event.preventDefault();
        const firstCard = document.querySelector('.principle-card');
        if (firstCard) {
            const principleNum = firstCard.dataset.principle;
            togglePrinciple(principleNum);
        }
    }
});

// Log page performance
if (typeof performance !== 'undefined' && performance.timing) {
    window.addEventListener('load', function() {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Phase 2 page load time:', pageLoadTime + 'ms');
    });
}
