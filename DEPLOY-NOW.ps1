# Quick Deploy Script - Deploy changes to Firebase Hosting
# Run this in PowerShell with Administrator privileges

Write-Host "🚀 DIVINE TEMPLE - DEPLOYING ALL CHANGES" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
Write-Host "📋 Checking Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = & npx firebase --version 2>&1
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not installed" -ForegroundColor Red
    Write-Host "Install with: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Files Ready for Deployment in: revamp-deploy/" -ForegroundColor Cyan
Write-Host "  ✅ lesson-01-what-is-programming.html (auth gate disabled)" -ForegroundColor Green
Write-Host "  ✅ members-new.html (temple flashing fixed)" -ForegroundColor Green
Write-Host ""

# Deploy to Firebase
Write-Host "🔥 Deploying to Firebase Hosting..." -ForegroundColor Cyan
Write-Host ""

try {
    & npx firebase deploy --only hosting --project sacred-community
    
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "=======================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ All changes now LIVE on:" -ForegroundColor Green
    Write-Host "   https://edenconsciousnesssdt.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Lesson page now accessible:" -ForegroundColor Green
    Write-Host "   https://edenconsciousnesssdt.com/lesson-01-what-is-programming.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Members portal fixed:" -ForegroundColor Green
    Write-Host "   https://edenconsciousnesssdt.com/members-new.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Test the audio player on the lesson page 🎵" -ForegroundColor Magenta
    Write-Host ""
} catch {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
