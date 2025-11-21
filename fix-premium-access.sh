#!/bin/bash

# Quick Fix Script - Add Premium Access Control to All Premium Pages
# This script adds the required Firebase and access control scripts to premium pages

echo "🔒 Adding Premium Access Control to all premium pages..."

# List of premium pages that need protection
PREMIUM_PAGES=(
  "sections/sacred-knowledge.html"
  "sections/devotion-growth.html"
  "sections/personal-growth.html"
  "sections/videos-media.html"
  "sections/spiritual-music.html"
  "sections/sacred-arts-sound.html"
  "sections/singing-bowl-garden.html"
  "sections/spiritual-tools.html"
  "sections/sacred-books.html"
  "sections/calendar.html"
)

# The script tags to add (right after <head> tag)
SCRIPTS='
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-functions-compat.js"></script>

    <!-- Premium Access Control - REQUIRED FOR PREMIUM PAGES -->
    <script src="../js/firebase-config.js"></script>
    <script src="../js/premium-access-control.js"></script>
'

# Check each page
for page in "${PREMIUM_PAGES[@]}"; do
  if [ -f "$page" ]; then
    # Check if already has access control
    if grep -q "premium-access-control" "$page"; then
      echo "✓ $page already has access control"
    else
      echo "⚠️  $page is MISSING access control - needs manual fix"
      echo "   Add these scripts after <head> tag:"
      echo "$SCRIPTS"
    fi
  else
    echo "❌ $page not found"
  fi
done

echo ""
echo "🚨 CRITICAL: You must also DEPLOY the security system:"
echo "   1. firebase deploy --only firestore:rules"
echo "   2. firebase deploy --only functions"
echo "   3. firebase deploy --only hosting"
echo ""
echo "Without deployment, the security changes won't take effect!"
