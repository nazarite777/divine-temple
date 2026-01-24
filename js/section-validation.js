// Universal Section Validation Script for Divine Temple
// This script provides standard error handling and function validation for all section files

// Universal Function Validation System
function validateSectionFunctions(sectionName, requiredFunctions = []) {
    const missing = [];
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            missing.push(funcName);
        }
    });
    
    if (missing.length > 0) {
        console.warn(`⚠️ ${sectionName}: Missing functions:`, missing);
        return false;
    }
    
    console.log(`✅ ${sectionName}: All functions validated successfully`);
    return true;
}

// Universal Error Handling
function handleSectionError(sectionName, operation, error, icon = '⚡') {
    console.error(`${icon} ${sectionName} Error in ${operation}:`, error);
    
    // Show user-friendly notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, #8B5CF6, #7C3AED);
            color: white; padding: 1rem; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
            animation: slideInRight 0.5s ease;
        ">
            <div style="font-weight: 600; margin-bottom: 0.5rem;">${icon} ${sectionName}</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
                Divine energies are realigning. Please try again in a moment.
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Universal Event Listener Prevention
function initializeSectionListeners(sectionName, customListeners = null) {
    const listenerKey = `${sectionName.toLowerCase()}ListenersInitialized`;
    
    if (window[listenerKey]) return;
    window[listenerKey] = true;
    
    // Standard escape key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal, [id*="modal"]');
            modals.forEach(modal => {
                if (modal.style.display === 'flex' || modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    // Custom listeners if provided
    if (typeof customListeners === 'function') {
        customListeners();
    }
    
    console.log(`✨ ${sectionName} enhanced listeners initialized`);
}

// Universal Theme Application with Error Recovery
function applySectionTheme(sectionName, themeName) {
    try {
        if (!themeName || typeof themeName !== 'string') {
            themeName = 'sacred-sunset'; // Default theme
        }
        
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
        
        console.log(`✨ ${sectionName} theme applied: ${themeName}`);
        
    } catch (error) {
        handleSectionError(sectionName, 'theme application', error);
    }
}

// Universal Performance Tracking
function trackSectionPerformance(sectionName) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`🚀 ${sectionName} loaded in ${Math.round(loadTime)}ms`);
    });
}

// Export for use in sections
window.DivineTemplateUtils = {
    validateSectionFunctions,
    handleSectionError,
    initializeSectionListeners,
    applySectionTheme,
    trackSectionPerformance
};