# Audio Files Directory

## 📁 Directory Structure

```
audio/
├── meditations/          # Guided meditation audio files
│   ├── return-to-eden-meditation.mp3
│   ├── chakra-awakening-meditation.mp3
│   ├── divine-identity-meditation.mp3
│   ├── breathing-guided-4-7-8.mp3
│   └── morning-eden-meditation.mp3
│
├── teachings/            # Teaching and audiobook content
│   ├── chapter-1-preview.mp3
│   ├── eden-consciousness-intro.mp3
│   └── divine-identity.mp3
│
└── sounds/               # Sacred sounds and healing frequencies
    ├── 528hz-healing.mp3
    ├── 432hz-earth.mp3
    ├── om-chant.mp3
    └── tibetan-bowls.mp3
```

## 📝 File Specifications

### Required Format:
- **Format**: MP3
- **Bitrate**: 128 kbps (web optimized) or 320 kbps (high quality)
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo (meditation) or Mono (teachings acceptable)

### Naming Convention:
- Use lowercase
- Use hyphens instead of spaces
- Be descriptive but concise
- Include duration in filename if helpful (optional)

Example: `chakra-awakening-meditation-35min.mp3`

## 🎙️ Generation Guide

See `ELEVENLABS_AUDIO_GUIDE.md` in the root directory for:
- Complete meditation scripts
- ElevenLabs voice settings
- Step-by-step generation instructions
- Cost estimates

## 🚀 After Adding Audio Files

1. Update the file paths in section HTML files
2. Test playback in each section
3. Verify audio controls work (play, pause, volume)
4. Check mobile compatibility
5. Consider adding to CDN for faster loading

## 📦 File Size Guidelines

- **Short meditations (5-10 min)**: ~5-10 MB @ 128kbps
- **Medium meditations (15-25 min)**: ~15-25 MB @ 128kbps
- **Long meditations (30-45 min)**: ~30-45 MB @ 128kbps
- **Healing frequencies (loops)**: ~5-10 MB for 10-min loop

## 🔄 Git LFS Recommendation

If audio files exceed 100MB total, consider using Git LFS (Large File Storage):

```bash
git lfs install
git lfs track "*.mp3"
git add .gitattributes
```

## ✅ Current Status

- [ ] return-to-eden-meditation.mp3
- [ ] chakra-awakening-meditation.mp3
- [ ] divine-identity-meditation.mp3
- [ ] breathing-guided-4-7-8.mp3
- [x] chapter-1-preview.mp3 (needs replacement - current file is 133 bytes placeholder)
- [ ] eden-consciousness-intro.mp3
- [ ] 528hz-healing.mp3
- [ ] 432hz-earth.mp3
- [ ] om-chant.mp3

---

Generate audio at: https://try.elevenlabs.io/3kzjj59tn1qx
