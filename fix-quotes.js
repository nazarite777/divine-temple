#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, 'members-new.html');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Starting quote fixes...');
const startLen = content.length;

// Fix the fancy quote patterns
// These are the problematic console.log statements with fancy quotes

// Line 1216: '' Checking...
content = content.replace(/console\.log\('['']Checking/g, "console.log('🔍 Checking");

// Lines 1222-1224: '' Auth check...
content = content.replace(/console\.log\('['']Auth check/g, "console.log('🔍 Auth check");

// Line 1232: '' Member...
content = content.replace(/console\.log\('['']Member/g, "console.log('📊 Member");

// Line 1258: '' Attempting...
content = content.replace(/console\.log\('['']Attempting/g, "console.log('🔒 Attempting");

// Line 1442: '' User authenticated...
content = content.replace(/console\.log\('['']User authenticated/g, "console.log('🔍 User authenticated");

// Line 1742: ''„ Loading...
content = content.replace(/console\.log\('[''„]Loading/g, "console.log('📋 Loading");

// Line 2022: console.log(🎮 ...
content = content.replace(/console\.log\(🎮(?!)/g, "console.log('🎮");

// Line 2033: '' Firebase...
content = content.replace(/console\.log\('['']Firebase/g, "console.log('🔍 Firebase");

// Line 2060: ''Š Available...
content = content.replace(/console\.log\('[''Š]/g, "console.log('📖");

// Line 2102: '' Session...
content = content.replace(/console\.log\('['']Session/g, "console.log('📊 Session");

// Line 2156: '' Auth state...
content = content.replace(/console\.log\('['']Auth state/g, "console.log('🔍 Auth state");

// Line 2190: '\n'Š Test...
content = content.replace(/console\.log\('\\n['']Š/g, "console.log('\\n📖");

// Line 2200: '%c'🧠Debug...
content = content.replace(/console\.log\('%c['']🧠/g, "console.log('%c🧠");

// Line 2406: '' SEO...
content = content.replace(/console\.log\('['']SEO/g, "console.log('📱 SEO");

// Line 2412: '' Running...
content = content.replace(/console\.log\('['']Running/g, "console.log('✓ Running");

// Line 2531: ''± Members...
content = content.replace(/console\.log\('[''±]/g, "console.log('📱");

// Line 2541: ''± Members...
content = content.replace(/console\.log\('[''±]/g, "console.log('📱");

// Line 2554: 💎‰ Divine...
content = content.replace(/console\.log\(💎‰/g, "console.log('💎");

// Line 2623: ''± Members...
content = content.replace(/console\.log\('[''±]/g, "console.log('📱");

// Line 2627: ''🤝 Members...
content = content.replace(/console\.log\('['']/g, "console.log('");

// Resolve merge conflicts - keep the more complete version
// Lines around 2001-2106
content = content.replace(/<<<<<<< HEAD\n=======\n([\s\S]*?)\n>>>>>>> [\da-f]+/g, '$1');

// Clean up any remaining broken quotes
// Match '' at the start of console.log and replace with a correct character
content = content.replace(/console\.log\('[''](?!.*[''])/g, "console.log('🔍 ");

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf-8');

const endLen = content.length;
console.log(`✅ Fixed! Changed from ${startLen} to ${endLen} characters`);
console.log('Quotes fixed successfully!');
