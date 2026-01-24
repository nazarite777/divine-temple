# 🎵 Nature Sounds Directory

This directory contains real audio recordings for the Divine Temple soundboard.

## 📥 Required Files

Place the following MP3 files in this directory:

### Nature Ambience
- [ ] `rain-gentle-loop.mp3` - Gentle rain falling (loopable)
- [ ] `thunder-distant.mp3` - Thunder rumble (occasional)
- [ ] `wind-breeze-loop.mp3` - Gentle wind through trees (loopable)

### Nighttime Sounds
- [ ] `crickets-night-loop.mp3` - Cricket chorus (loopable)
- [ ] `owl-forest.mp3` - Owl hooting (occasional)
- [ ] `frogs-pond-loop.mp3` - Frog croaking at night (loopable)
- [ ] `cicadas-summer-loop.mp3` - Cicada buzzing (loopable)

### Daytime Sounds
- [ ] `birds-forest-morning.mp3` - Morning bird songs (loopable)

### Animal Sounds
- [ ] `wolf-howl-distant.mp3` - Wolf howling far away (occasional)

### Water Sounds
- [ ] `ocean-waves-loop.mp3` - Ocean waves on beach (loopable)
- [ ] `stream-flowing-loop.mp3` - Gentle stream/creek (loopable)

### Fire & Earth
- [ ] `fire-crackling-loop.mp3` - Campfire crackling (loopable)
- [ ] `leaves-rustling-loop.mp3` - Leaves rustling in wind (loopable)

## 🔍 Where to Get These Files

See the comprehensive guide: **[NATURE_SOUNDS_SOURCING_GUIDE.md](/NATURE_SOUNDS_SOURCING_GUIDE.md)**

### Quick Sources:
1. **Freesound.org** (Free, high-quality, CC0/CC-BY)
2. **Zapsplat.com** (Free with attribution)
3. **BBC Sound Effects** (33,000+ free sounds)

## ✅ File Specifications

```
Format: MP3
Bitrate: 128-192 kbps
Sample Rate: 44.1 kHz
Channels: Stereo (preferred) or Mono
Length: 30-120 seconds for loops
```

## 🧪 Testing

After adding files, test in browser console:

```javascript
checkMissingAudio(); // Shows which files are missing
testRealAudio('rain'); // Test a specific sound
```

## 📝 Attribution

If using CC-BY licensed sounds, document them in `CREDITS.txt` (see template below).

---

**Note:** The soundboard will work without these files by using synthesized sounds as fallback. Real audio recordings provide a more immersive, natural experience.
