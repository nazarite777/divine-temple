# Cleanup members-new.html - Remove debug code and duplicate scripts

$filePath = ".\members-new.html"
$content = Get-Content $filePath -Raw

Write-Host "Starting cleanup of members-new.html..."
Write-Host "Original size: $($content.Length) bytes"

# 1. Remove premium-access-control.js
$content = $content -replace `
    '    <!-- Auth Helper for Admin Auto-Grant and Premium Checks -->\s+<script src="js/auth-helper\.js"><\/script>\s+\s+    <!-- CRITICAL: Premium Access Control - MUST LOAD BEFORE OTHER SCRIPTS -->\s+<script src="js/premium-access-control\.js"><\/script>', `
    '    <!-- Auth Helper for Admin Auto-Grant and Premium Checks -->' + [Environment]::NewLine + '    <script src="js/auth-helper.js"></script>'

Write-Host "[1/4] Removed premium-access-control.js"

# 2. Remove duplicate performance-optimizer and final-testing
$content = $content -replace `
    '    <!-- Performance Optimizer -->\s+<script src="js/performance-optimizer\.js"><\/script>\s+    \s+    <!-- Accessibility & UX Enhancement -->\s+<script src="js/accessibility-ux\.js"><\/script>\s+    \s+    <!-- SEO Optimizer -->\s+<script src="js/seo-optimizer\.js"><\/script>\s+    \s+    <!-- Final Testing Suite -->\s+<script src="js/final-testing\.js"><\/script>', `
    '    <!-- Accessibility & UX Enhancement -->' + [Environment]::NewLine + '    <script src="js/accessibility-ux.js"></script>' + [Environment]::NewLine + '    ' + [Environment]::NewLine + '    <!-- SEO Optimizer -->' + [Environment]::NewLine + '    <script src="js/seo-optimizer.js"></script>'

Write-Host "[2/4] Removed duplicate scripts"

# 3. Find and remove the debug functions section - this is a large block
$debugStart = $content.IndexOf("        // ========================================`n        // DEBUG FUNCTIONS (Console Only)`n        // ========================================")
if ($debugStart -gt 0) {
    $debugEnd = $content.IndexOf("        // ========================================`n        // INITIALIZATION`n        // ========================================", $debugStart)
    if ($debugEnd -gt 0) {
        $before = $content.Substring(0, $debugStart)
        $after = $content.Substring($debugEnd)
        $content = $before + $after
        Write-Host "[3/4] Removed debug functions section"
    }
}

# 4. Clean up initialization logging
$oldInit = @'
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🏛️ Divine Temple Portal Initializing...');
            console.log('📅 Date:', new Date().toISOString());
            
            // Initialize Performance Optimizer
            if (window.performanceOptimizer) {
                window.performanceOptimizer.optimizeCriticalSection('auth-overlay');
                window.performanceOptimizer.lazyLoadImages();
                console.log('🚀 Performance optimizations applied');
            }
            
            // Initialize Universal Progress System
            window.UniversalProgressSystem.init();
            console.log('🎮 Universal Progress System ready');
            
            // Initialize Firebase authentication check
            setTimeout(() => {
                checkAuthStatus();
                loadJourneyProgress(); // Load journey card
            }, 1000); // Wait for Firebase to load

            console.log('🔐 Firebase authentication check initiated');
            const dashboard = document.getElementById('dashboard');
            const memberBadge = document.getElementById('member-badge');
            
            // Ensure auth overlay is visible
            if (authOverlay) {
                authOverlay.style.display = 'flex';
                authOverlay.classList.remove('hidden');
                console.log('✅ Auth overlay displayed');
            }
            
            // Ensure dashboard is hidden
            if (dashboard) {
                dashboard.style.display = 'none';
                dashboard.classList.remove('active');
                dashboard.style.opacity = '0';
                console.log('✅ Dashboard hidden');
            }
            
            // Hide member badge
            if (memberBadge) {
                memberBadge.style.display = 'none';
            }
            
            // Ensure body can't scroll initially
            document.body.style.overflow = 'hidden';
            
            // Log system info
            console.log('✨ Portal ready for authentication');
            console.log('📊 Available sections:', Object.keys(SECTION_MAP).length);
            console.log('%c🏛️ Divine Temple', 'font-size: 24px; font-weight: bold; color: #F59E0B;');
            console.log('%c✨ Eden Consciousness - Nazir El', 'font-size: 16px; color: #8B5CF6;');
        });
'@

$newInit = @'
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🏛️ Divine Temple Portal Initializing...');
            
            // Initialize Performance Optimizer
            if (window.performanceOptimizer) {
                window.performanceOptimizer.optimizeCriticalSection('auth-overlay');
                window.performanceOptimizer.lazyLoadImages();
            }
            
            // Initialize Universal Progress System
            window.UniversalProgressSystem.init();
            
            // Initialize Firebase authentication check
            setTimeout(() => {
                checkAuthStatus();
                loadJourneyProgress();
            }, 1000);

            const dashboard = document.getElementById('dashboard');
            const memberBadge = document.getElementById('member-badge');
            
            // Setup initial UI state
            if (authOverlay) {
                authOverlay.style.display = 'flex';
                authOverlay.classList.remove('hidden');
            }
            
            if (dashboard) {
                dashboard.style.display = 'none';
                dashboard.classList.remove('active');
                dashboard.style.opacity = '0';
            }
            
            if (memberBadge) {
                memberBadge.style.display = 'none';
            }
            
            document.body.style.overflow = 'hidden';
        });
'@

$content = $content -replace [regex]::Escape($oldInit), $newInit
Write-Host "[4/4] Cleaned up initialization logging"

# Save the file
Set-Content -Path $filePath -Value $content -Encoding UTF8
Write-Host "Cleanup complete!"
Write-Host "New size: $($content.Length) bytes"
Write-Host "Bytes removed: $(115680 - $content.Length)"
