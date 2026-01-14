# Divine Temple Build Process

## Overview

This document describes the build and minification process for Divine Temple JavaScript files.

## Build Script

Run the build script to minify all JavaScript files:

```bash
bash build.sh
```

The script will:
- Minify all `.js` files that don't have a `.min.js` version
- Skip files that are already up-to-date (minified file is newer than source)
- Report success/failure for each file

## What Gets Minified

The following types of files are minified:

- **Core Systems**: `firebase-config.js`, `universal-progress-system.js`, etc.
- **Game Files**: `daily-trivia-FREE-VERSION.js`, `daily-trivia-PREMIUM.js`, `chakra-memory-system.js`, etc.
- **Feature Modules**: `achievement-system.js`, `premium-access-control.js`, `pwa-handler.js`, etc.
- **Audio Systems**: `trivia-audio-system.js`, `singing-bowl-garden.js`, etc.

## Current Status

As of January 14, 2026:

✅ **62 total minified files** created
✅ **24 newly minified files** from this build process
✅ **1 file failed** (access-control-tester.js - test file, non-critical)

## Newly Minified Files

The following critical files now have minified versions:

1. `daily-trivia-FREE-VERSION.min.js` (32 KB) - Free trivia game
2. `daily-trivia-PREMIUM.min.js` - Premium trivia game
3. `achievement-system.min.js` - Achievement tracking system
4. `premium-access-control.min.js` (9.6 KB) - Access control (syntax errors fixed)
5. `pwa-handler.min.js` - Progressive Web App handler
6. `chakra-memory-system-enhanced.min.js` - Enhanced memory game
7. `daily-trivia-system-enhanced.min.js` - Enhanced trivia system
8. `enhanced-pwa-installer.min.js` - PWA installation
9. `mandala-coloring.min.js` - Mandala coloring feature
10. `crystal-memory-game.min.js` - Crystal memory game
... and 14 more files

## Syntax Errors Fixed

During the build process, the following syntax errors were identified and fixed:

### premium-access-control.js

**Issue**: Class methods had trailing commas (invalid JavaScript syntax)

**Lines Fixed**: 116, 155, 297

**Error**:
```
Parse error: Unexpected token: punc (,)
```

**Fix**: Removed trailing commas after method definitions:
```javascript
// Before (INVALID)
async checkAuthentication() {
    // ...
},

// After (VALID)
async checkAuthentication() {
    // ...
}
```

## Using Minified Files in Production

To use minified files in production, update HTML `<script>` tags:

```html
<!-- Development (current) -->
<script src="../js/daily-trivia-FREE-VERSION.js"></script>

<!-- Production (recommended) -->
<script src="../js/daily-trivia-FREE-VERSION.min.js"></script>
```

## Firebase Hosting Integration

For automatic minification in Firebase hosting, you can:

1. Add a `predeploy` hook in `firebase.json`:
```json
{
  "hosting": {
    "predeploy": ["bash build.sh"]
  }
}
```

2. Or run manually before each deployment:
```bash
bash build.sh
firebase deploy
```

## Benefits

**File Size Reductions:**
- Typical reduction: 60-75% smaller
- Example: `daily-trivia-FREE-VERSION.js` → 32 KB (minified)
- Faster page loads
- Reduced bandwidth usage
- Better performance on mobile devices

## Tools Used

- **Terser**: JavaScript minifier and compressor
  - Compression: Removes whitespace, shortens code
  - Mangling: Shortens variable names
  - Comments: Stripped from production builds

## Maintenance

- Run `bash build.sh` after making changes to any `.js` files
- The script is smart and only rebuilds files that have changed
- Minified files are committed to git for production use

## Troubleshooting

**Error: "terser: command not found"**
```bash
npm install -g terser
```

**Parse errors during build:**
- Check for syntax errors in source files
- Common issues: trailing commas in classes, invalid Unicode escapes
- Fix source file and re-run build

**Files not updating:**
- Delete the `.min.js` file and re-run build
- Or use `touch` to update the source file timestamp

## Next Steps

Consider setting up:
1. Automated builds on git commit (pre-commit hook)
2. CI/CD integration for automatic minification
3. Source maps for debugging minified code
4. Environment-based script loading (dev vs prod)
