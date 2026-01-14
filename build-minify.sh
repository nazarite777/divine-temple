#!/bin/bash

# Divine Temple Build Script
# Minifies all JavaScript files that don't have .min.js versions

echo "🔨 Divine Temple Build Process"
echo "==============================="
echo ""

# Check if terser is installed
if ! command -v terser &> /dev/null; then
    echo "❌ terser is not installed. Installing..."
    npm install -g terser
fi

# Change to js directory
cd /home/user/divine-temple/js || exit 1

echo "📦 Minifying JavaScript files..."
echo ""

# Counter for statistics
total=0
success=0
failed=0
skipped=0

# Minify each .js file that doesn't have a .min.js version
for source_file in *.js; do
    # Skip if already a minified file
    if [[ "$source_file" == *.min.js ]]; then
        continue
    fi

    # Define minified filename
    minified_file="${source_file%.js}.min.js"

    # Check if minified version already exists
    if [ -f "$minified_file" ]; then
        echo "⏭️  Skipped: $source_file (minified version exists)"
        ((skipped++))
        continue
    fi

    echo "🔄 Minifying: $source_file → $minified_file"

    # Minify with terser
    if terser "$source_file" \
        --compress \
        --mangle \
        --output "$minified_file" \
        --comments false 2>/dev/null; then

        # Get file sizes
        original_size=$(stat -f%z "$source_file" 2>/dev/null || stat -c%s "$source_file" 2>/dev/null)
        minified_size=$(stat -f%z "$minified_file" 2>/dev/null || stat -c%s "$minified_file" 2>/dev/null)

        if [ -n "$original_size" ] && [ -n "$minified_size" ]; then
            reduction=$(( 100 - (minified_size * 100 / original_size) ))
            echo "   ✅ Success! Size: $(numfmt --to=iec $original_size 2>/dev/null || echo "$original_size bytes") → $(numfmt --to=iec $minified_size 2>/dev/null || echo "$minified_size bytes") (${reduction}% reduction)"
        else
            echo "   ✅ Success!"
        fi
        ((success++))
    else
        echo "   ❌ Failed to minify $source_file"
        ((failed++))
    fi

    ((total++))
    echo ""
done

echo ""
echo "==============================="
echo "📊 Build Summary"
echo "==============================="
echo "Total files processed: $total"
echo "✅ Successfully minified: $success"
echo "❌ Failed: $failed"
echo "⏭️  Skipped (already exists): $skipped"
echo ""

if [ $failed -eq 0 ]; then
    echo "🎉 Build completed successfully!"
    exit 0
else
    echo "⚠️  Build completed with errors"
    exit 1
fi
