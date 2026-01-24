#!/bin/bash
# Deployment Script for Divine Temple Security Fixes
# Run this script after authenticating with Firebase

set -e  # Exit on any error

echo "🚀 Divine Temple - Security Fix Deployment"
echo "==========================================="
echo ""

# Check if Firebase CLI is authenticated
echo "📋 Step 1: Checking Firebase authentication..."
if ! npx firebase-tools projects:list &>/dev/null; then
    echo "❌ Not authenticated with Firebase"
    echo ""
    echo "Please run: npx firebase-tools login"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Authenticated with Firebase"
echo ""

# Deploy Cloud Functions
echo "📋 Step 2: Deploying Cloud Functions..."
echo "   → Deploying security fixes and new admin functions"
npx firebase-tools deploy --only functions
echo "✅ Cloud Functions deployed"
echo ""

# Deploy Firestore Rules
echo "📋 Step 3: Deploying Firestore Security Rules..."
echo "   → Deploying simplified access control"
npx firebase-tools deploy --only firestore:rules
echo "✅ Firestore Rules deployed"
echo ""

# Deploy Hosting
echo "📋 Step 4: Deploying Frontend..."
echo "   → Deploying updated client-side code"
npx firebase-tools deploy --only hosting
echo "✅ Frontend deployed"
echo ""

echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "✅ All security fixes deployed successfully!"
echo ""
echo "📊 Next Steps:"
echo "1. Test the payment flow with a test card"
echo "2. Verify premium access is granted after payment"
echo "3. Test admin utility: grantMePremium()"
echo ""
echo "📚 See SECURITY_FIX_MIGRATION.md for testing guide"
echo ""
