#!/usr/bin/env bash

# Divine Temple Build Script
# Minifies all JavaScript files

set -e

echo "🔨 Divine Temple Build Process"
echo "==============================="
echo ""

# Check if terser is installed
if ! command -v terser &> /dev/null; then
    echo "Installing terser..."
    npm install -g terser
fi

# Change to js directory
cd "$(dirname "$0")/js" || exit 1

echo "📦 Minifying JavaScript files..."
echo ""

# Counters
total=0
success=0
failed=0
skipped=0

# Minify each .js file
for source_file in *.js; do
    # Skip if already a minified file
    if [[ "$source_file" == *.min.js ]]; then
        continue
    fi

    # Define minified filename
    minified_file="${source_file%.js}.min.js"

    # Check if source is newer than minified (if exists)
    if [ -f "$minified_file" ] && [ "$minified_file" -nt "$source_file" ]; then
        ((skipped++))
        continue
    fi

    echo "🔄 Minifying: $source_file"
    ((total++))

    # Minify with terser
    if terser "$source_file" \
        --compress \
        --mangle \
        --output "$minified_file" \
        --comments false 2>/dev/null; then

        echo "   ✅ Success → $minified_file"
        ((success++))
    else
        echo "   ❌ Failed (syntax error or encoding issue)"
        ((failed++))
    fi
done

echo ""
echo "==============================="
echo "📊 Build Summary"
echo "==============================="
echo "Processed: $total"
echo "✅ Success: $success"
echo "❌ Failed: $failed"
echo "⏭️  Skipped: $skipped (up-to-date)"
echo ""

if [ $failed -eq 0 ]; then
    echo "🎉 Build completed successfully!"
    exit 0
else
    echo "⚠️  Build completed with $failed errors"
    exit 1
fi
