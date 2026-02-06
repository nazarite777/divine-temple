/* ===================================
   EDEN CONSCIOUSNESS LANDING SCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const landingScreen = document.getElementById('landing-screen');
    const mainSite = document.getElementById('main-site');
    const enterButton = document.getElementById('enter-button');
    const edenSong = document.getElementById('eden-song');
    const audioToggle = document.getElementById('audio-toggle');
    
    // State
    let hasEntered = false;
    
    /* ===================================
       ENTER BUTTON - START EXPERIENCE
       =================================== */
    
    enterButton.addEventListener('click', () => {
        if (hasEntered) return;
        hasEntered = true;
        
        // Start the music
        playAudio();
        
        // Transition to main site
        setTimeout(() => {
            landingScreen.classList.add('fade-out');
            mainSite.classList.add('active');
        }, 500);
        
        // Remove landing screen after fade
        setTimeout(() => {
            landingScreen.style.display = 'none';
        }, 2500);
    });
    
    /* ===================================
       AUDIO CONTROLS
       =================================== */
    
    function playAudio() {
        const playPromise = edenSong.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Audio started successfully
                    audioToggle.classList.remove('paused');
                    console.log('Audio playing');
                })
                .catch(error => {
                    // Auto-play was prevented
                    console.log('Auto-play prevented:', error);
                    audioToggle.classList.add('paused');
                    showPlayPrompt();
                });
        }
    }
    
    function pauseAudio() {
        edenSong.pause();
        audioToggle.classList.add('paused');
    }
    
    function toggleAudio() {
        if (edenSong.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    }
    
    // Audio toggle button
    audioToggle.addEventListener('click', toggleAudio);
    
    /* ===================================
       AUDIO ENDED - LOOP OR STOP
       =================================== */
    
    edenSong.addEventListener('ended', () => {
        // Option 1: Loop the song
        // edenSong.currentTime = 0;
        // playAudio();
        
        // Option 2: Just stop and show play button
        audioToggle.classList.add('paused');
    });
    
    /* ===================================
       MOBILE AUTO-PLAY FALLBACK
       =================================== */
    
    function showPlayPrompt() {
        // If auto-play fails (common on mobile), show a subtle prompt
        const prompt = document.createElement('div');
        prompt.className = 'play-prompt';
        prompt.innerHTML = `
            <p>Click to play "The Walk Back to Eden"</p>
        `;
        prompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 2rem 3rem;
            border-radius: 20px;
            border: 1px solid rgba(212, 175, 55, 0.5);
            color: white;
            font-family: 'Montserrat', sans-serif;
            text-align: center;
            z-index: 10000;
            cursor: pointer;
            backdrop-filter: blur(10px);
        `;
        
        prompt.addEventListener('click', () => {
            playAudio();
            document.body.removeChild(prompt);
        });
        
        document.body.appendChild(prompt);
        
        // Auto-remove after 5 seconds if they don'"'"'t click
        setTimeout(() => {
            if (document.body.contains(prompt)) {
                document.body.removeChild(prompt);
            }
        }, 5000);
    }
    
    /* ===================================
       KEYBOARD SHORTCUTS (OPTIONAL)
       =================================== */
    
    document.addEventListener('keydown', (e) => {
        // Space bar = toggle audio (only after entering)
        if (e.code === 'Space' && hasEntered && e.target === document.body) {
            e.preventDefault();
            toggleAudio();
        }
    });
    
    /* ===================================
       VOLUME FADE ON PAGE LEAVE
       =================================== */
    
    window.addEventListener('beforeunload', () => {
        // Fade out audio before leaving
        let volume = edenSong.volume;
        const fadeOut = setInterval(() => {
            if (volume > 0.1) {
                volume -= 0.1;
                edenSong.volume = volume;
            } else {
                clearInterval(fadeOut);
                edenSong.pause();
            }
        }, 50);
    });
    
    /* ===================================
       REMEMBER USER PREFERENCE (OPTIONAL)
       =================================== */
    
    // Save audio preference to localStorage
    function saveAudioPreference(isPlaying) {
        localStorage.setItem('edenAudioPlaying', isPlaying);
    }
    
    // Load audio preference
    function loadAudioPreference() {
        const preference = localStorage.getItem('edenAudioPlaying');
        return preference === 'true';
    }
    
    // Apply on toggle
    audioToggle.addEventListener('click', () => {
        saveAudioPreference(!edenSong.paused);
    });
    
    /* ===================================
       DEBUG INFO (REMOVE IN PRODUCTION)
       =================================== */
    
    console.log('%c Eden Consciousness Initialized', 'color: #D4AF37; font-size: 16px; font-weight: bold;');
    console.log('%cThe Walk Back to Eden', 'color: #F4E4C1; font-size: 12px;');
});

/* ===================================
   ADDITIONAL UTILITY FUNCTIONS
   =================================== */

// Smooth scroll to sections (if you have anchor links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Prevent iOS from pausing audio when screen locks
// Note: This doesn'"'"'t always work due to iOS restrictions
if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: 'The Walk Back to Eden',
        artist: 'Eden Consciousness',
        album: 'Spiritual Alignment',
        artwork: [
            { src: 'images/branding/logoyogabg.png', sizes: '512x512', type: 'image/png' }
        ]
    });
}
