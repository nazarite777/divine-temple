# Audio Integration Guide

This guide shows you how to integrate your ElevenLabs-generated audio files into the Divine Temple sections.

---

## 📍 Files That Need Updates

1. `sections/meditation-mindfulness.html` - Add guided meditation audio
2. `sections/videos-media.html` - Add teaching audio/video content
3. `free-dashboard.html` - Replace Chapter 1 placeholder audio
4. `sections/sacred-arts-sound.html` - Add healing frequency sounds

---

## 🎯 1. Meditation Section Integration

### Current State:
The meditation section uses Web Audio API to generate tones, but lacks actual guided meditation audio.

### After Generating Audio:

**Location**: `sections/meditation-mindfulness.html`

**Find this section** (around line 400-500 in the practices grid):

```html
<div class="practice-card" onclick="meditationApp.startGuided(25)">
    <div class="practice-icon">🌅</div>
    <h3>Guided Meditation</h3>
    <p>Follow along with spoken guidance through consciousness expansion practices</p>
    <div class="practice-duration">10-45 min</div>
</div>
```

**Add a new meditation library section** before the practices grid:

```html
<!-- Guided Meditation Library -->
<div class="meditation-library" style="margin-bottom: 3rem;">
    <h2 style="font-family: 'Playfair Display', serif; text-align: center; color: var(--accent-blue); margin-bottom: 2rem;">
        🎧 Guided Meditation Library
    </h2>

    <div class="meditation-tracks" style="display: grid; gap: 1.5rem;">
        <!-- Return to Eden Meditation -->
        <div class="meditation-track" style="background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 20px; padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="color: var(--accent-blue); font-family: 'Playfair Display', serif; margin-bottom: 0.5rem;">
                        🌟 Return to Eden
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        A transformative meditation to help you experience your original divine state
                    </p>
                </div>
                <div style="color: var(--accent-blue); font-weight: 600; font-size: 0.9rem;">25:00</div>
            </div>

            <audio controls style="width: 100%; margin-bottom: 1rem;" preload="metadata">
                <source src="../audio/meditations/return-to-eden-meditation.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span style="background: rgba(79, 195, 247, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-blue);">Consciousness</span>
                <span style="background: rgba(79, 195, 247, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-blue);">Divine Nature</span>
                <span style="background: rgba(79, 195, 247, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-blue);">Awakening</span>
            </div>
        </div>

        <!-- Chakra Awakening Meditation -->
        <div class="meditation-track" style="background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 20px; padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="color: var(--accent-green); font-family: 'Playfair Display', serif; margin-bottom: 0.5rem;">
                        🌈 7 Chakras Awakening
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Activate and balance all seven chakras for complete energetic alignment
                    </p>
                </div>
                <div style="color: var(--accent-green); font-weight: 600; font-size: 0.9rem;">35:00</div>
            </div>

            <audio controls style="width: 100%; margin-bottom: 1rem;" preload="metadata">
                <source src="../audio/meditations/chakra-awakening-meditation.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span style="background: rgba(102, 187, 106, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-green);">Chakras</span>
                <span style="background: rgba(102, 187, 106, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-green);">Energy Healing</span>
                <span style="background: rgba(102, 187, 106, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-green);">Balance</span>
            </div>
        </div>

        <!-- Breathing Exercise -->
        <div class="meditation-track" style="background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 20px; padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="color: var(--accent-purple); font-family: 'Playfair Display', serif; margin-bottom: 0.5rem;">
                        🌬️ 4-7-8 Breathing Guided Practice
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Calm your nervous system with this powerful breathing technique
                    </p>
                </div>
                <div style="color: var(--accent-purple); font-weight: 600; font-size: 0.9rem;">10:00</div>
            </div>

            <audio controls style="width: 100%; margin-bottom: 1rem;" preload="metadata">
                <source src="../audio/meditations/breathing-guided-4-7-8.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span style="background: rgba(139, 92, 246, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-purple);">Breathwork</span>
                <span style="background: rgba(139, 92, 246, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-purple);">Relaxation</span>
                <span style="background: rgba(139, 92, 246, 0.2); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: var(--accent-purple);">Stress Relief</span>
            </div>
        </div>
    </div>
</div>
```

---

## 🎯 2. Free Dashboard - Chapter 1 Audio

### Current State:
The Chapter 1 audio is a 133-byte placeholder file.

**Location**: `free-dashboard.html` (around line 1413-1417)

**Find this:**

```html
<audio controls style="width: 100%; max-width: 600px; height: 60px; margin: 0 auto; display: block; margin-bottom: 1rem;" preload="metadata" id="chapter1-audio">
    <source src="audio/chapter-1-preview.mp3" type="audio/mpeg">
    <source src="https://github.com/nazarite777/divine-temple/raw/main/audio/chapter-1-preview.mp3" type="audio/mpeg">
