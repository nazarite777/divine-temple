# 🌍 Nature Sounds Sourcing Guide

Complete guide for obtaining high-quality, royalty-free nature sounds for the Divine Temple website.

## 📋 Required Sound Files

Create these files in `/audio/sounds/` directory:

### Nature Ambience
- `rain-gentle-loop.mp3` - Gentle rain falling (loopable)
- `thunder-distant.mp3` - Thunder rumble (occasional)
- `wind-breeze-loop.mp3` - Gentle wind through trees (loopable)

### Nighttime Sounds
- `crickets-night-loop.mp3` - Cricket chorus (loopable)
- `owl-forest.mp3` - Owl hooting (occasional)
- `frogs-pond-loop.mp3` - Frog croaking at night (loopable)
- `cicadas-summer-loop.mp3` - Cicada buzzing (loopable)

### Daytime Sounds
- `birds-forest-morning.mp3` - Morning bird songs (loopable)

### Animal Sounds
- `wolf-howl-distant.mp3` - Wolf howling far away (occasional)

### Water Sounds
- `ocean-waves-loop.mp3` - Ocean waves on beach (loopable)
- `stream-flowing-loop.mp3` - Gentle stream/creek (loopable)

### Fire & Earth
- `fire-crackling-loop.mp3` - Campfire crackling (loopable)
- `leaves-rustling-loop.mp3` - Leaves rustling in wind (loopable)

---

## 🎵 Best Free Sources

### 1. **Freesound.org** (Best Overall)
- **URL:** https://freesound.org/
- **License:** CC0, CC-BY (attribution required)
- **Quality:** Professional recordings
- **How to:**
  1. Create free account
  2. Search for sound (e.g., "rain loop")
  3. Filter by "CC0" or "CC-BY" license
  4. Download WAV or MP3 format
  5. Convert to 128-192 kbps MP3 if needed

**Recommended Searches:**
- `rain ambient loop`
- `thunder distant rumble`
- `wind forest breeze`
- `crickets night loop`
- `owl hoot forest`
- `wolf howl distant`
- `ocean waves beach loop`
- `stream water flowing`
- `campfire crackling loop`
- `birds morning forest`

### 2. **Zapsplat.com**
- **URL:** https://www.zapsplat.com/
- **License:** Free with attribution
- **Quality:** High-quality sound effects
- **Categories:** Nature > Ambience

### 3. **BBC Sound Effects**
- **URL:** https://sound-effects.bbcrewind.co.uk/
- **License:** RemArc License (free for personal/educational)
- **Quality:** BBC archive (33,000+ sounds)
- **Search:** "nature," "wildlife," "weather"

### 4. **Sonniss GameAudioGDC**
- **URL:** https://sonniss.com/gameaudiogdc
- **License:** Royalty-free
- **Quality:** Professional game audio
- **Note:** Annual free bundle (40+ GB)

### 5. **OpenGameArt.org**
- **URL:** https://opengameart.org/
- **License:** CC0, CC-BY, GPL
- **Search:** Audio > Ambient

---

## 🔧 Audio Specifications

### Format Requirements
```
Format: MP3
Bitrate: 128-192 kbps (balance between quality and file size)
Sample Rate: 44.1 kHz
Channels: Stereo (for spatial effects) or Mono
Length: 30-120 seconds for loops
```

### Loop Requirements
- **Seamless loops:** Must fade in/out at edges for smooth looping
- **No clicks:** Ensure waveform starts and ends at zero-crossing
- **Natural variation:** Longer loops sound more realistic (60-120s)

---

## 🛠️ Recommended Tools

### Audio Editing
1. **Audacity** (Free)
   - Download: https://www.audacityteam.org/
   - Perfect for trimming, looping, format conversion

2. **Ocenaudio** (Free)
   - Download: https://www.ocenaudio.com/
   - User-friendly, great for quick edits

### Format Conversion
```bash
# Convert WAV to MP3 (ffmpeg)
ffmpeg -i input.wav -b:a 192k output.mp3

# Create seamless loop
ffmpeg -i input.mp3 -af "afade=t=in:st=0:d=2,afade=t=out:st=58:d=2" output-loop.mp3
```

---

## 📦 Quick Start: Download Ready-Made Packs

### Option 1: Curated Free Pack (Recommended)
I recommend downloading from **Freesound.org** with these specific high-quality sounds:

#### Rain & Thunder
- **Rain:** https://freesound.org/people/InspectorJ/sounds/346642/
  - "Rain, Light, with Rolling Thunder.wav"
  - License: CC-BY 4.0
  - Rename to: `rain-gentle-loop.mp3`

- **Thunder:** https://freesound.org/people/InspectorJ/sounds/411790/
  - "Thunder Close A.wav"
  - License: CC-BY 4.0
  - Rename to: `thunder-distant.mp3`

#### Wind
- **Wind Breeze:** https://freesound.org/people/straget/sounds/527845/
  - "Wind soft natural loop"
  - License: CC0
  - Rename to: `wind-breeze-loop.mp3`

#### Crickets & Night
- **Crickets:** https://freesound.org/people/InspectorJ/sounds/437833/
  - "Crickets, Chirping, B.wav"
  - License: CC-BY 4.0
  - Rename to: `crickets-night-loop.mp3`

- **Owl:** https://freesound.org/people/InspectorJ/sounds/411543/
  - "Owl, Tawny, Hooting.wav"
  - License: CC-BY 4.0
  - Rename to: `owl-forest.mp3`

#### Water
- **Ocean Waves:** https://freesound.org/people/Luftrum/sounds/48412/
  - "Ocean Waves Loop"
  - License: CC0
  - Rename to: `ocean-waves-loop.mp3`

- **Stream:** https://freesound.org/people/gezortenplotz/sounds/45668/
  - "Small Creek Loop"
  - License: CC0
  - Rename to: `stream-flowing-loop.mp3`

#### Fire
- **Campfire:** https://freesound.org/people/joedeshon/sounds/171956/
  - "Campfire Ambiance"
  - License: CC0
  - Rename to: `fire-crackling-loop.mp3`

#### Birds
- **Morning Birds:** https://freesound.org/people/klankbeeld/sounds/393924/
  - "Forest morning birds"
  - License: CC0
  - Rename to: `birds-forest-morning.mp3`

#### Wolf
- **Wolf Howl:** https://freesound.org/people/j1987/sounds/361471/
  - "Wolf Howl Distant"
  - License: CC0
  - Rename to: `wolf-howl-distant.mp3`

---

## 🎨 Attribution Requirements

### If using CC-BY licensed sounds:

Create `/audio/sounds/CREDITS.txt`:
```
AUDIO CREDITS - Divine Temple Nature Sounds

Rain & Thunder:
- "Rain, Light, with Rolling Thunder" by InspectorJ (www.jshaw.co.uk)
  Source: https://freesound.org/people/InspectorJ/sounds/346642/
  License: CC-BY 4.0

- "Thunder Close A" by InspectorJ (www.jshaw.co.uk)
  Source: https://freesound.org/people/InspectorJ/sounds/411790/
  License: CC-BY 4.0

Crickets:
- "Crickets, Chirping, B" by InspectorJ (www.jshaw.co.uk)
  Source: https://freesound.org/people/InspectorJ/sounds/437833/
  License: CC-BY 4.0

Owl:
- "Owl, Tawny, Hooting" by InspectorJ (www.jshaw.co.uk)
  Source: https://freesound.org/people/InspectorJ/sounds/411543/
  License: CC-BY 4.0

All other sounds are CC0 (Public Domain).
```

---

## 📁 Directory Structure

After downloading, organize like this:

```
audio/
├── sounds/
│   ├── rain-gentle-loop.mp3
│   ├── thunder-distant.mp3
│   ├── wind-breeze-loop.mp3
│   ├── crickets-night-loop.mp3
│   ├── owl-forest.mp3
│   ├── frogs-pond-loop.mp3
│   ├── cicadas-summer-loop.mp3
│   ├── birds-forest-morning.mp3
│   ├── wolf-howl-distant.mp3
│   ├── ocean-waves-loop.mp3
│   ├── stream-flowing-loop.mp3
│   ├── fire-crackling-loop.mp3
│   ├── leaves-rustling-loop.mp3
│   └── CREDITS.txt
├── meditations/
└── teachings/
```

---

## ⚡ Quick Download Script

Save this as `download-sounds.sh`:

```bash
#!/bin/bash

# Create directory
mkdir -p audio/sounds
cd audio/sounds

# Download sounds (example with wget)
# Replace URLs with actual direct download links

echo "🎵 Downloading nature sounds..."

# You'll need to manually download from Freesound (requires login)
# Or use their API: https://freesound.org/docs/api/

echo "✅ Please manually download sounds from Freesound.org"
echo "📋 See NATURE_SOUNDS_SOURCING_GUIDE.md for direct links"
```

---

## 🎯 Testing Your Sounds

After downloading, test each sound:

1. **Check looping:** Does it loop seamlessly?
2. **Check volume:** Is it normalized (not too quiet/loud)?
3. **Check quality:** No distortion, artifacts, or unwanted noise?
4. **Check length:** Long enough to not feel repetitive (60-120s)?

### Testing in Browser Console:
```javascript
// Test a sound
const testAudio = new Audio('audio/sounds/rain-gentle-loop.mp3');
testAudio.loop = true;
testAudio.volume = 0.5;
testAudio.play();

// Stop
testAudio.pause();
```

---

## 💡 Pro Tips

1. **Longer is better:** 2-minute loops sound more natural than 30-second loops
2. **Layer sounds:** Combine multiple sounds (rain + thunder + wind) for richness
3. **Stereo width:** Stereo sounds feel more immersive than mono
4. **Normalize volume:** All sounds should be similar volume levels
5. **Test on mobile:** Mobile devices handle audio differently
6. **Compress wisely:** 128-192 kbps is sweet spot for web delivery
7. **Cache headers:** Set long cache times (1 year) for audio files

---

## 🚀 Next Steps

1. Download sounds from sources above
2. Place in `/audio/sounds/` directory
3. Create `CREDITS.txt` for attribution
4. Test each sound file in browser
5. Your `realistic-nature-audio-manager.js` will automatically load them!

---

## 📞 Need Help?

- **Freesound Forum:** https://freesound.org/forum/
- **Audio Quality Issues:** Use Audacity's Normalize and Equalization effects
- **Format Issues:** Use ffmpeg for reliable conversion

---

**Note:** The audio manager is already configured to use these exact file names. Just download, convert to MP3, and place in `/audio/sounds/` - it will work automatically! 🎉
