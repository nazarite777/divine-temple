#!/usr/bin/env bash

# Quick Deployment Script for Divine Temple
# Run this after authenticating with Firebase

set -e

echo ""
echo "🚀 Divine Temple - Quick Deployment"
echo "===================================="
echo ""
echo "📋 Changes to Deploy:"
echo "  ✅ Trivia game: 3-question sessions + Firebase persistence"
echo "  ✅ Locked category previews (drives conversions)"
echo "  ✅ 24 minified JavaScript files (60-75% smaller)"
echo "  ✅ Fixed marketing claims (honest messaging)"
echo "  ✅ Fixed syntax errors in access control"
echo ""
echo "📊 Impact: Better UX, faster loads, higher conversions"
echo ""

# Check authentication
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &>/dev/null; then
    echo "❌ Not authenticated with Firebase"
    echo ""
    echo "Please run:"
    echo "  firebase login"
    echo ""
    echo "Then run this script again:"
    echo "  bash QUICK_DEPLOY.sh"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Confirm deployment
read -p "🚀 Deploy all changes to Firebase? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

echo ""
echo "🔨 Starting deployment..."
echo ""

# Deploy everything
echo "📤 Deploying Firestore Rules..."
firebase deploy --only firestore:rules

echo ""
echo "📤 Deploying Hosting (HTML, JS, CSS)..."
firebase deploy --only hosting

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "✅ All changes deployed successfully!"
echo ""
echo "🧪 Next Steps:"
echo "  1. Test trivia game (3 questions, completion works)"
echo "  2. Test Firebase persistence (logout/login, stats preserved)"
echo "  3. Test locked category preview (shows 12 categories)"
echo "  4. Verify marketing claims (100+ not 500+)"
echo "  5. Check page load speed (should be faster)"
echo ""
echo "📚 Full testing guide: See DEPLOYMENT_READY.md"
echo ""
