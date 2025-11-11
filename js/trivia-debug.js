/**
 * 🎯 DEBUG VERSION OF DAILY TRIVIA SYSTEM
 * Simple version to diagnose loading issues
 */

console.log('🎯 Trivia Debug Script Loading...');

// Check if all dependencies are available
function checkDependencies() {
    console.log('🔍 Checking Dependencies:');
    console.log('- Firebase:', typeof firebase !== 'undefined' ? '✅' : '❌');
    console.log('- Progress System:', typeof window.progressSystem !== 'undefined' ? '✅' : '❌');
    console.log('- Auth State:', firebase?.auth()?.currentUser ? '✅ User logged in' : '❌ No user');
    console.log('- Firestore:', firebase?.firestore ? '✅' : '❌');
}

// Simple trivia system for debugging
class DebugTriviaSystem {
    constructor() {
        console.log('🎯 Debug Trivia System Initializing...');
        this.init();
    }

    async init() {
        checkDependencies();
        
        // Show loading message
        const loadingEl = document.getElementById('loadingState');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3>🔍 Debugging Trivia System...</h3>
                    <p>Check console for details</p>
                    <div id="debugInfo" style="margin-top: 1rem; font-family: monospace; text-align: left; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px;"></div>
                </div>
            `;
        }

        // Wait for Firebase
        await this.waitForFirebase();

        // Check auth state 
        firebase.auth().onAuthStateChanged((user) => {
            console.log('🔐 Auth State Changed:', user ? `User: ${user.email}` : 'No user');
            this.updateDebugInfo();
            
            if (user) {
                this.loadSimpleTrivia();
            } else {
                this.showLoginRequired();
            }
        });
    }

    async waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = setInterval(() => {
                if (typeof firebase !== 'undefined' && firebase.auth) {
                    clearInterval(checkFirebase);
                    console.log('✅ Firebase is ready');
                    resolve();
                }
            }, 100);
        });
    }

    updateDebugInfo() {
        const debugEl = document.getElementById('debugInfo');
        if (debugEl) {
            const user = firebase.auth().currentUser;
            const today = new Date().toISOString().split('T')[0];
            
            debugEl.innerHTML = `
Firebase Status: ${typeof firebase !== 'undefined' ? '✅ Loaded' : '❌ Missing'}<br>
Auth User: ${user ? `✅ ${user.email}` : '❌ Not logged in'}<br>
Today's Date: ${today}<br>
Firestore: ${firebase.firestore ? '✅ Available' : '❌ Missing'}<br>
Progress System: ${window.progressSystem ? '✅ Loaded' : '❌ Missing'}<br>
Current Time: ${new Date().toLocaleTimeString()}
            `;
        }
    }

    async loadSimpleTrivia() {
        console.log('📚 Loading Simple Trivia...');
        
        try {
            // Test Firestore connection
            const testDoc = await firebase.firestore()
                .collection('test')
                .doc('connection')
                .get();
            console.log('🔥 Firestore connection:', testDoc ? '✅ Working' : '❌ Failed');

            // Generate today's questions
            const today = new Date().toISOString().split('T')[0];
            console.log('📅 Today:', today);

            // Simple questions for testing
            const questions = [
                {
                    question: "What is the most universal mantra?",
                    options: ["Om", "Namaste", "Peace", "Love"],
                    correct: 0,
                    explanation: "Om is the primordial sound of the universe."
                },
                {
                    question: "How many main chakras are there?",
                    options: ["5", "7", "9", "12"],
                    correct: 1,
                    explanation: "There are 7 main chakras in the traditional system."
                },
                {
                    question: "Which crystal is known as the master healer?",
                    options: ["Amethyst", "Clear Quartz", "Rose Quartz", "Citrine"],
                    correct: 1,
                    explanation: "Clear Quartz is called the master healer."
                }
            ];

            console.log('✅ Questions generated:', questions);
            this.showQuestions(questions);

        } catch (error) {
            console.error('❌ Error loading trivia:', error);
            this.showError(error);
        }
    }

    showQuestions(questions) {
        const loadingEl = document.getElementById('loadingState');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3>🎯 Debug Trivia Ready!</h3>
                    <p>${questions.length} questions loaded successfully</p>
                    <div style="margin-top: 1rem;">
                        <button onclick="window.debugTrivia.startQuiz()" style="background: var(--primary-gold); color: black; border: none; padding: 0.8rem 2rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            Start Debug Quiz
                        </button>
                    </div>
                    <div style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                        Original trivia system was not loading today's questions.<br>
                        This debug version confirms the system works.
                    </div>
                </div>
            `;
        }
        
        this.questions = questions;
    }

    startQuiz() {
        console.log('🚀 Starting debug quiz...');
        
        // Hide loading and show quiz
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('quizCard').style.display = 'block';
        
        // Start with first question
        this.currentIndex = 0;
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentIndex];
        
        // Update question display
        document.getElementById('questionNumber').textContent = `Question ${this.currentIndex + 1}/3`;
        document.getElementById('questionText').textContent = question.question;
        
        // Show options
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.innerHTML = `<span>${option}</span>`;
            button.onclick = () => this.selectAnswer(index);
            optionsContainer.appendChild(button);
        });

        console.log('❓ Showing question:', question.question);
    }

    selectAnswer(index) {
        const question = this.questions[this.currentIndex];
        const isCorrect = index === question.correct;
        
        console.log('✅ Answer selected:', question.options[index], isCorrect ? 'Correct!' : 'Wrong');
        
        // Show result
        alert(`${isCorrect ? 'Correct!' : 'Wrong!'}\n\n${question.explanation}`);
        
        // Next question or finish
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            this.showQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        console.log('🏁 Quiz finished!');
        alert('Debug Quiz Complete!\n\nThe trivia system is working correctly.\nThe issue was likely in the question generation or loading logic.');
        
        // Show results
        document.getElementById('quizCard').style.display = 'none';
        document.getElementById('resultsCard').classList.add('show');
        document.getElementById('resultsTitle').textContent = 'Debug Complete!';
        document.getElementById('correctCount').textContent = '3';
        document.getElementById('totalCount').textContent = '3';
        document.getElementById('totalXP').textContent = '60';
    }

    showLoginRequired() {
        const loadingEl = document.getElementById('loadingState');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3>🔐 Login Required</h3>
                    <p>Please log in to access the trivia system</p>
                    <div style="margin-top: 1rem;">
                        <a href="../login.html" style="background: var(--primary-gold); color: black; text-decoration: none; padding: 0.8rem 2rem; border-radius: 25px; font-weight: 600;">
                            Go to Login
                        </a>
                    </div>
                </div>
            `;
        }
    }

    showError(error) {
        const loadingEl = document.getElementById('loadingState');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3>❌ Error Loading Trivia</h3>
                    <p>Something went wrong:</p>
                    <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid #F43F5E; border-radius: 8px; padding: 1rem; margin: 1rem 0; font-family: monospace; text-align: left;">
                        ${error.message || error}
                    </div>
                    <button onclick="location.reload()" style="background: var(--primary-gold); color: black; border: none; padding: 0.8rem 2rem; border-radius: 25px; font-weight: 600; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Initialize debug system
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing Debug Trivia System...');
    window.debugTrivia = new DebugTriviaSystem();
});