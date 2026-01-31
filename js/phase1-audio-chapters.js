/**
 * Phase 1: Awakening - Audio Chapters
 * Manages Google Drive audio streaming for all book chapters
 */

const Phase1AudioChapters = {
    chapters: [
        { id: 'copyright', title: 'Copyright Page', driveId: '16H8C9uoWtxYezzTz3r5582ahm9r23x1p', duration: '~1 min' },
        { id: 'dedication', title: 'Dedication', driveId: '12dxk87Fz2eaGt116HEo-1cdK4P6PQJS-', duration: '~2 min' },
        { id: 'introduction', title: 'Introduction', driveId: '1hwRwWKa7TcP6iXLP4fia7A9Hg7CN8vSS', duration: '~8 min' },
        { id: 'chapter1', title: 'Chapter 1: The Beginning', driveId: '1xjGZAE9e_B7FGMqtW-ujp7gCT5pEk9wc', duration: '~12 min' },
        { id: 'chapter2', title: 'Chapter 2: Foundation', driveId: '1qxlYoLaYI_8iyOWkP7NrS2XOphrtKFOX', duration: '~14 min' },
        { id: 'chapter3', title: 'Chapter 3: Awakening', driveId: '1PrIRPymEsnlMx9G7vL0htbpSsM8MN0_s', duration: '~11 min' },
        { id: 'chapter4', title: 'Chapter 4: Transformation', driveId: '1fNWY8-cyWLPOmmy5QmQGrMu6aXRiF5wC', duration: '~13 min' },
        { id: 'chapter5', title: 'Chapter 5: Alignment', driveId: '1dqTo_AgYH6Rtvmii5L2EonHe7dXYDV74', duration: '~10 min' },
        { id: 'chapter6', title: 'Chapter 6: Manifestation', driveId: '172xFi6l6U0cXerrjQPvK7tou3_WdPSpb', duration: '~15 min' },
        { id: 'chapter7', title: 'Chapter 7: Mastery', driveId: '1N6xlY7UAjuU3i3pCdX0-uCXUFuXzlRYr', duration: '~12 min' },
        { id: 'chapter8', title: 'Chapter 8: Integration', driveId: '1q7bJgZkNXRutSu-PrKSERQBlkR8aLF0x', duration: '~11 min' },
        { id: 'chapter9', title: 'Chapter 9: Ascension', driveId: '1mS-shUXhHfiP9cdI_spbDny8LXLg64XN', duration: '~13 min' },
        { id: 'conclusion', title: 'Conclusion', driveId: '1UO1IuinGpvsp3uYZqJmE-a8p9nl5dyfM', duration: '~6 min' },
        { id: 'glossary', title: 'Glossary', driveId: '1Mp5hnTHm4kKWJac89LPoxlm-EPqdd966', duration: '~4 min' },
        { id: 'about-author', title: 'About the Author', driveId: '1pqMlvn8mbAtlkPGAkI18pQn7CIJoiHjd', duration: '~3 min' }
    ],

    getDriveStreamUrl(driveId) {
        return \https://drive.google.com/uc?id=\&export=download\;
    },

    init() {
        console.log('Phase 1 audio chapters loaded');
        this.renderChapters();
    },

    renderChapters() {
        const container = document.getElementById('chaptersContainer');
        if (!container) return;

        let html = '';
        this.chapters.forEach(ch => {
            const streamUrl = this.getDriveStreamUrl(ch.driveId);
            html += \
                <div class="chapter-card" data-chapter-id="\">
                    <div class="chapter-header">
                        <div class="chapter-number"></div>
                        <div class="chapter-info">
                            <h3 class="chapter-title">\</h3>
                            <p class="chapter-duration">Duration: \</p>
                        </div>
                    </div>
                    <div class="audio-controls">
                        <audio id="audio-\" controls style="width: 100%; height: 44px;">
                            <source src="\" type="audio/mpeg">
                        </audio>
                    </div>
                    <div class="chapter-actions">
                        <button class="btn btn-primary mark-complete-btn" data-chapter-id="\"> Mark Complete</button>
                    </div>
                </div>
            \;
        });
        container.innerHTML = html;

        // Add event listeners
        document.querySelectorAll('.mark-complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chapterId = e.target.dataset.chapterId;
                const card = document.querySelector(\[data-chapter-id="\"]\);
                card.classList.add('completed');
                console.log('Chapter marked complete:', chapterId);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Phase1AudioChapters.init());
