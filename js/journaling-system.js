/**
 * 📖 Divine Temple Journaling System
 *
 * Features:
 * - Spiritual journal with daily entries
 * - Daily reflection prompts
 * - Mood tracking over time
 * - Dream journal integration
 * - Gratitude journal
 * - Export journal as PDF
 * - XP rewards for journaling
 * - Search and filter entries
 * - Beautiful calendar view
 */

class JournalingSystem {
    constructor() {
        this.entries = this.loadEntries();
        this.currentEntry = null;
        this.prompts = this.loadPrompts();
        this.moods = ['😊 Joyful', '😌 Peaceful', '🤔 Reflective', '😔 Sad', '😤 Frustrated', '😍 Grateful', '😴 Tired', '⚡ Energized'];
        this.journalTypes = ['daily', 'dream', 'gratitude', 'meditation', 'manifestation'];
        this.init();
    }

    init() {
        console.log('📖 Journaling System initialized');
        this.checkDailyPrompt();

        // Listen for new entries from other sections
        window.addEventListener('journal-entry-requested', (e) => {
            this.openJournalModal(e.detail.type || 'daily', e.detail.prompt || '');
        });
    }

    loadEntries() {
        const saved = localStorage.getItem('divine_temple_journal_entries');
        return saved ? JSON.parse(saved) : [];
    }

    saveEntries() {
        localStorage.setItem('divine_temple_journal_entries', JSON.stringify(this.entries));
    }

    loadPrompts() {
        return {
            daily: [
                "What spiritual insights did I receive today?",
                "How did I honor my higher self today?",
                "What am I grateful for in this present moment?",
                "What lessons did the universe teach me today?",
                "How did I show love and compassion today?",
                "What patterns am I noticing in my spiritual journey?",
                "What blocks or resistance did I feel today?",
                "How did I connect with the divine today?",
                "What synchronicities did I notice today?",
                "What intentions am I setting for tomorrow?"
            ],
            dream: [
                "What symbols or messages appeared in my dreams?",
                "What emotions did I experience in this dream?",
                "How does this dream relate to my waking life?",
                "What is my subconscious trying to tell me?",
                "What recurring themes am I noticing in my dreams?"
            ],
            gratitude: [
                "What three things am I deeply grateful for today?",
                "Who showed me kindness today?",
                "What abundance flows into my life?",
                "What challenges helped me grow?",
                "What beauty did I witness today?"
            ],
            meditation: [
                "What insights arose during my meditation?",
                "What did I feel in my body during practice?",
                "What thoughts kept returning to my awareness?",
                "How has my practice evolved?",
                "What did I learn about myself today?"
            ],
            manifestation: [
                "What am I calling into my life?",
                "How do I feel in my desired reality?",
                "What aligned actions can I take?",
                "What limiting beliefs am I releasing?",
                "What affirmations resonate with my soul?"
            ]
        };
    }

    checkDailyPrompt() {
        const today = new Date().toISOString().split('T')[0];
        const lastPrompt = localStorage.getItem('divine_temple_last_daily_prompt');

        if (lastPrompt !== today) {
            localStorage.setItem('divine_temple_last_daily_prompt', today);
            this.showDailyPromptNotification();
        }
    }

    showDailyPromptNotification() {
        const prompt = this.getDailyPrompt();

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'journal-prompt-notification';
        notification.innerHTML = `
            <div class="prompt-notification-content">
                <div class="prompt-icon">📖</div>
                <div class="prompt-text">
                    <h4>Daily Journal Prompt</h4>
                    <p>${prompt}</p>
                </div>
                <button onclick="window.journalingSystem.openJournalModal('daily', '${prompt}')" class="prompt-btn">
                    ✍️ Write Entry
                </button>
                <button onclick="this.parentElement.parentElement.remove()" class="prompt-close">✕</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .journal-prompt-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
                max-width: 400px;
            }

            .prompt-notification-content {
                padding: 20px;
                color: white;
                display: flex;
                gap: 15px;
                align-items: flex-start;
            }

            .prompt-icon {
                font-size: 32px;
                flex-shrink: 0;
            }

            .prompt-text {
                flex: 1;
            }

            .prompt-text h4 {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 600;
            }

            .prompt-text p {
                margin: 0;
                font-size: 14px;
                opacity: 0.95;
                line-height: 1.5;
            }

            .prompt-btn {
                background: white;
                color: #667eea;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 13px;
                transition: transform 0.2s;
                margin-top: 5px;
            }

            .prompt-btn:hover {
                transform: scale(1.05);
            }

            .prompt-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                flex-shrink: 0;
                transition: background 0.2s;
            }

            .prompt-close:hover {
                background: rgba(255,255,255,0.3);
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Auto-dismiss after 15 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.5s ease reverse';
                setTimeout(() => notification.remove(), 500);
            }
        }, 15000);
    }

    getDailyPrompt() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const prompts = this.prompts.daily;
        return prompts[dayOfYear % prompts.length];
    }

    getRandomPrompt(type = 'daily') {
        const prompts = this.prompts[type] || this.prompts.daily;
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    createEntry(data) {
        const entry = {
            id: Date.now().toString(),
            type: data.type || 'daily',
            date: new Date().toISOString(),
            title: data.title || this.getDefaultTitle(data.type),
            content: data.content,
            mood: data.mood || null,
            prompt: data.prompt || null,
            tags: data.tags || [],
            favorite: false,
            wordCount: data.content.split(/\s+/).filter(w => w.length > 0).length
        };

        this.entries.unshift(entry);
        this.saveEntries();

        // 🎯 AWARD XP
        const xpAmount = this.calculateEntryXP(entry);
        if (window.progressSystem) {
            window.progressSystem.awardXP(xpAmount, `Journal entry: ${entry.title}`, 'journaling');
            window.progressSystem.logActivity('journal_entry', 'journaling', {
                type: entry.type,
                wordCount: entry.wordCount,
                hasMood: !!entry.mood
            });
        }

        // Track streak
        this.updateStreak();

        // Dispatch event
        window.dispatchEvent(new CustomEvent('journal-entry-created', { detail: entry }));

        return { success: true, entry, xp: xpAmount };
    }

    calculateEntryXP(entry) {
        let xp = 20; // Base XP

        // Word count bonus
        if (entry.wordCount > 100) xp += 10;
        if (entry.wordCount > 300) xp += 20;
        if (entry.wordCount > 500) xp += 30;

        // Mood tracking bonus
        if (entry.mood) xp += 5;

        // Type bonuses
        if (entry.type === 'dream') xp += 15; // Dream journals are valuable
        if (entry.type === 'gratitude') xp += 10;

        // Streak bonus
        const streak = this.getStreak();
        if (streak >= 7) xp += 20;
        if (streak >= 30) xp += 50;

        return xp;
    }

    getDefaultTitle(type) {
        const titles = {
            daily: 'Daily Reflection',
            dream: 'Dream Journal',
            gratitude: 'Gratitude Entry',
            meditation: 'Meditation Notes',
            manifestation: 'Manifestation Journal'
        };
        return titles[type] || 'Journal Entry';
    }

    updateEntry(entryId, updates) {
        const index = this.entries.findIndex(e => e.id === entryId);
        if (index === -1) return { success: false, message: 'Entry not found' };

        this.entries[index] = {
            ...this.entries[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveEntries();

        window.dispatchEvent(new CustomEvent('journal-entry-updated', {
            detail: this.entries[index]
        }));

        return { success: true, entry: this.entries[index] };
    }

    deleteEntry(entryId) {
        const index = this.entries.findIndex(e => e.id === entryId);
        if (index === -1) return { success: false, message: 'Entry not found' };

        const deleted = this.entries.splice(index, 1)[0];
        this.saveEntries();

        window.dispatchEvent(new CustomEvent('journal-entry-deleted', {
            detail: deleted
        }));

        return { success: true };
    }

    toggleFavorite(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return { success: false };

        entry.favorite = !entry.favorite;
        this.saveEntries();

        return { success: true, favorite: entry.favorite };
    }

    searchEntries(query) {
        const lowerQuery = query.toLowerCase();
        return this.entries.filter(entry =>
            entry.title.toLowerCase().includes(lowerQuery) ||
            entry.content.toLowerCase().includes(lowerQuery) ||
            (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    }

    filterEntries(filters) {
        let filtered = [...this.entries];

        if (filters.type) {
            filtered = filtered.filter(e => e.type === filters.type);
        }

        if (filters.mood) {
            filtered = filtered.filter(e => e.mood === filters.mood);
        }

        if (filters.favorite) {
            filtered = filtered.filter(e => e.favorite);
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(e => new Date(e.date) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            filtered = filtered.filter(e => new Date(e.date) <= new Date(filters.dateTo));
        }

        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(e =>
                e.tags && e.tags.some(tag => filters.tags.includes(tag))
            );
        }

        return filtered;
    }

    getEntriesByMonth(year, month) {
        return this.entries.filter(entry => {
            const date = new Date(entry.date);
            return date.getFullYear() === year && date.getMonth() === month;
        });
    }

    updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        let streakData = localStorage.getItem('divine_temple_journal_streak');

        if (!streakData) {
            streakData = { current: 1, longest: 1, lastEntry: today };
        } else {
            streakData = JSON.parse(streakData);

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (streakData.lastEntry === yesterdayStr || streakData.lastEntry === today) {
                if (streakData.lastEntry === yesterdayStr) {
                    streakData.current++;
                }
                streakData.longest = Math.max(streakData.longest, streakData.current);
                streakData.lastEntry = today;
            } else {
                streakData.current = 1;
                streakData.lastEntry = today;
            }
        }

        localStorage.setItem('divine_temple_journal_streak', JSON.stringify(streakData));

        // Award streak bonuses
        if (streakData.current === 7 && window.progressSystem) {
            window.progressSystem.awardXP(100, '7-day journaling streak! 🔥', 'journaling');
        }
        if (streakData.current === 30 && window.progressSystem) {
            window.progressSystem.awardXP(500, '30-day journaling streak! 🔥🔥🔥', 'journaling');
        }

        return streakData;
    }

    getStreak() {
        const streakData = localStorage.getItem('divine_temple_journal_streak');
        return streakData ? JSON.parse(streakData).current : 0;
    }

    getStats() {
        const totalEntries = this.entries.length;
        const totalWords = this.entries.reduce((sum, e) => sum + e.wordCount, 0);
        const avgWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
        const streak = this.getStreak();
        const streakData = JSON.parse(localStorage.getItem('divine_temple_journal_streak') || '{}');

        const typeBreakdown = {};
        this.journalTypes.forEach(type => {
            typeBreakdown[type] = this.entries.filter(e => e.type === type).length;
        });

        const moodBreakdown = {};
        this.entries.forEach(entry => {
            if (entry.mood) {
                moodBreakdown[entry.mood] = (moodBreakdown[entry.mood] || 0) + 1;
            }
        });

        return {
            totalEntries,
            totalWords,
            avgWords,
            currentStreak: streak,
            longestStreak: streakData.longest || 0,
            favorites: this.entries.filter(e => e.favorite).length,
            typeBreakdown,
            moodBreakdown,
            firstEntry: totalEntries > 0 ? this.entries[this.entries.length - 1].date : null,
            lastEntry: totalEntries > 0 ? this.entries[0].date : null
        };
    }

    exportToJSON() {
        const data = {
            entries: this.entries,
            stats: this.getStats(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `divine-temple-journal-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        if (window.progressSystem) {
            window.progressSystem.awardXP(30, 'Exported journal to JSON', 'journaling');
        }
    }

    exportToPDF() {
        // Basic PDF export using HTML rendering
        // In production, use a library like jsPDF or pdfmake
        const printWindow = window.open('', '', 'width=800,height=600');

        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Divine Temple Journal Export</title>
                <style>
                    body {
                        font-family: 'Georgia', serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 40px;
                        color: #333;
                    }
                    h1 {
                        color: #667eea;
                        border-bottom: 3px solid #667eea;
                        padding-bottom: 10px;
                    }
                    .entry {
                        margin: 30px 0;
                        page-break-inside: avoid;
                        border-left: 4px solid #764ba2;
                        padding-left: 20px;
                    }
                    .entry-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                    }
                    .entry-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #764ba2;
                    }
                    .entry-date {
                        color: #666;
                        font-size: 14px;
                    }
                    .entry-content {
                        line-height: 1.8;
                        white-space: pre-wrap;
                    }
                    .entry-meta {
                        margin-top: 10px;
                        font-size: 12px;
                        color: #999;
                    }
                    @media print {
                        body { padding: 20px; }
                    }
                </style>
            </head>
            <body>
                <h1>📖 Divine Temple Journal</h1>
                <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total Entries:</strong> ${this.entries.length}</p>
                <hr>
        `;

        this.entries.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString();
            html += `
                <div class="entry">
                    <div class="entry-header">
                        <div class="entry-title">${entry.title}</div>
                        <div class="entry-date">${date}</div>
                    </div>
                    <div class="entry-content">${entry.content}</div>
                    <div class="entry-meta">
                        Type: ${entry.type} | Words: ${entry.wordCount}${entry.mood ? ` | Mood: ${entry.mood}` : ''}
                    </div>
                </div>
            `;
        });

        html += `
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 500);

        if (window.progressSystem) {
            window.progressSystem.awardXP(50, 'Exported journal to PDF', 'journaling');
        }
    }

    openJournalModal(type = 'daily', prompt = '') {
        const modal = document.createElement('div');
        modal.className = 'journal-modal';
        modal.id = 'journalModal';

        const randomPrompt = prompt || this.getRandomPrompt(type);

        modal.innerHTML = `
            <div class="journal-modal-content">
                <div class="journal-modal-header">
                    <h2>✍️ New ${this.getDefaultTitle(type)}</h2>
                    <button onclick="document.getElementById('journalModal').remove()" class="journal-close">✕</button>
                </div>

                <div class="journal-modal-body">
                    <div class="journal-prompt-section">
                        <label>💭 Reflection Prompt:</label>
                        <p class="journal-prompt-text">${randomPrompt}</p>
                        <button onclick="window.journalingSystem.changePrompt('${type}')" class="change-prompt-btn">
                            🔄 Change Prompt
                        </button>
                    </div>

                    <div class="journal-form">
                        <div class="form-group">
                            <label>📝 Title:</label>
                            <input type="text" id="journalTitle" placeholder="Give your entry a title..."
                                   value="${this.getDefaultTitle(type)}" class="journal-input">
                        </div>

                        <div class="form-group">
                            <label>😊 How are you feeling?</label>
                            <select id="journalMood" class="journal-select">
                                <option value="">Select a mood...</option>
                                ${this.moods.map(mood => `<option value="${mood}">${mood}</option>`).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>✍️ Your Reflection:</label>
                            <textarea id="journalContent" rows="12" placeholder="Let your thoughts flow freely..."
                                      class="journal-textarea"></textarea>
                            <div class="word-count">Words: <span id="wordCount">0</span></div>
                        </div>

                        <div class="form-group">
                            <label>🏷️ Tags (optional):</label>
                            <input type="text" id="journalTags" placeholder="meditation, gratitude, insight..."
                                   class="journal-input">
                            <small>Separate tags with commas</small>
                        </div>

                        <div class="journal-actions">
                            <button onclick="window.journalingSystem.saveEntry('${type}', '${randomPrompt}')"
                                    class="save-entry-btn">
                                💾 Save Entry
                            </button>
                            <button onclick="document.getElementById('journalModal').remove()"
                                    class="cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.addModalStyles();

        document.body.appendChild(modal);

        // Word counter
        const textarea = document.getElementById('journalContent');
        const wordCountSpan = document.getElementById('wordCount');
        textarea.addEventListener('input', () => {
            const words = textarea.value.split(/\s+/).filter(w => w.length > 0).length;
            wordCountSpan.textContent = words;
        });

        // Focus on textarea
        setTimeout(() => textarea.focus(), 100);
    }

    changePrompt(type) {
        const promptText = document.querySelector('.journal-prompt-text');
        if (promptText) {
            promptText.textContent = this.getRandomPrompt(type);
        }
    }

    saveEntry(type, prompt) {
        const title = document.getElementById('journalTitle').value.trim();
        const content = document.getElementById('journalContent').value.trim();
        const mood = document.getElementById('journalMood').value;
        const tagsInput = document.getElementById('journalTags').value;
        const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

        if (!content) {
            alert('Please write something in your journal entry!');
            return;
        }

        const result = this.createEntry({
            type,
            title: title || this.getDefaultTitle(type),
            content,
            mood,
            prompt,
            tags
        });

        if (result.success) {
            document.getElementById('journalModal').remove();
            this.showSuccessMessage(result.xp);
        }
    }

    showSuccessMessage(xp) {
        const msg = document.createElement('div');
        msg.className = 'journal-success-message';
        msg.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <div class="success-text">
                    <strong>Journal Entry Saved!</strong>
                    <p>+${xp} XP earned</p>
                </div>
            </div>
        `;

        document.body.appendChild(msg);

        setTimeout(() => msg.remove(), 3000);
    }

    addModalStyles() {
        if (document.getElementById('journalModalStyles')) return;

        const style = document.createElement('style');
        style.id = 'journalModalStyles';
        style.textContent = `
            .journal-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .journal-modal-content {
                background: white;
                border-radius: 20px;
                max-width: 700px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                animation: slideUp 0.3s ease;
            }

            .journal-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px 30px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .journal-modal-header h2 {
                margin: 0;
                font-size: 24px;
            }

            .journal-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                transition: background 0.2s;
            }

            .journal-close:hover {
                background: rgba(255,255,255,0.3);
            }

            .journal-modal-body {
                padding: 30px;
            }

            .journal-prompt-section {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                padding: 20px;
                border-radius: 15px;
                color: white;
                margin-bottom: 25px;
            }

            .journal-prompt-section label {
                font-weight: 600;
                display: block;
                margin-bottom: 10px;
                font-size: 14px;
                opacity: 0.9;
            }

            .journal-prompt-text {
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 15px 0;
                font-style: italic;
            }

            .change-prompt-btn {
                background: rgba(255,255,255,0.2);
                border: 2px solid rgba(255,255,255,0.5);
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }

            .change-prompt-btn:hover {
                background: rgba(255,255,255,0.3);
                border-color: white;
            }

            .journal-form .form-group {
                margin-bottom: 20px;
            }

            .journal-form label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }

            .journal-input, .journal-select, .journal-textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 15px;
                font-family: inherit;
                transition: border-color 0.2s;
            }

            .journal-input:focus, .journal-select:focus, .journal-textarea:focus {
                outline: none;
                border-color: #667eea;
            }

            .journal-textarea {
                resize: vertical;
                min-height: 200px;
                line-height: 1.6;
            }

            .word-count {
                text-align: right;
                font-size: 13px;
                color: #666;
                margin-top: 5px;
            }

            .journal-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }

            .save-entry-btn, .cancel-btn {
                flex: 1;
                padding: 14px;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .save-entry-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .save-entry-btn:hover {
                transform: translateY(-2px);
            }

            .cancel-btn {
                background: #f0f0f0;
                color: #666;
            }

            .cancel-btn:hover {
                background: #e0e0e0;
            }

            .journal-success-message {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10001;
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
            }

            .success-content {
                display: flex;
                gap: 15px;
                align-items: center;
            }

            .success-icon {
                font-size: 32px;
            }

            .success-text strong {
                display: block;
                font-size: 16px;
                margin-bottom: 5px;
            }

            .success-text p {
                margin: 0;
                opacity: 0.95;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
    }

    renderJournalDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stats = this.getStats();
        const recentEntries = this.entries.slice(0, 5);

        container.innerHTML = `
            <div class="journal-dashboard">
                <div class="journal-header">
                    <h1>📖 My Spiritual Journal</h1>
                    <div class="journal-header-actions">
                        <button onclick="window.journalingSystem.openJournalModal('daily')" class="new-entry-btn">
                            ✍️ New Entry
                        </button>
                        <button onclick="window.journalingSystem.showExportMenu()" class="export-btn">
                            📥 Export
                        </button>
                    </div>
                </div>

                <div class="journal-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-value">${stats.totalEntries}</div>
                        <div class="stat-label">Total Entries</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-value">${stats.currentStreak}</div>
                        <div class="stat-label">Day Streak</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">${stats.totalWords.toLocaleString()}</div>
                        <div class="stat-label">Total Words</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">${stats.favorites}</div>
                        <div class="stat-label">Favorites</div>
                    </div>
                </div>

                <div class="journal-types">
                    ${this.journalTypes.map(type => `
                        <button onclick="window.journalingSystem.openJournalModal('${type}')" class="type-btn">
                            ${this.getTypeIcon(type)} ${this.getDefaultTitle(type)}
                        </button>
                    `).join('')}
                </div>

                <div class="recent-entries">
                    <h2>Recent Entries</h2>
                    ${recentEntries.length > 0 ? `
                        <div class="entries-list">
                            ${recentEntries.map(entry => this.renderEntryCard(entry)).join('')}
                        </div>
                    ` : `
                        <div class="no-entries">
                            <p>📖 No journal entries yet. Start writing your spiritual journey!</p>
                        </div>
                    `}
                </div>
            </div>
        `;

        this.addDashboardStyles();
    }

    getTypeIcon(type) {
        const icons = {
            daily: '📅',
            dream: '🌙',
            gratitude: '🙏',
            meditation: '🧘',
            manifestation: '✨'
        };
        return icons[type] || '📖';
    }

    renderEntryCard(entry) {
        const date = new Date(entry.date).toLocaleDateString();
        const preview = entry.content.substring(0, 150) + (entry.content.length > 150 ? '...' : '');

        return `
            <div class="entry-card">
                <div class="entry-card-header">
                    <div>
                        <div class="entry-type">${this.getTypeIcon(entry.type)} ${entry.type}</div>
                        <h3>${entry.title}</h3>
                        <div class="entry-date">${date}</div>
                    </div>
                    <button onclick="window.journalingSystem.toggleFavorite('${entry.id}')"
                            class="favorite-btn ${entry.favorite ? 'active' : ''}">
                        ${entry.favorite ? '⭐' : '☆'}
                    </button>
                </div>
                ${entry.mood ? `<div class="entry-mood">${entry.mood}</div>` : ''}
                <div class="entry-preview">${preview}</div>
                <div class="entry-meta">
                    <span>${entry.wordCount} words</span>
                    ${entry.tags && entry.tags.length > 0 ?
                        `<span class="entry-tags">${entry.tags.map(t => `#${t}`).join(' ')}</span>`
                        : ''}
                </div>
            </div>
        `;
    }

    showExportMenu() {
        const menu = document.createElement('div');
        menu.className = 'export-menu';
        menu.innerHTML = `
            <div class="export-menu-content">
                <h3>📥 Export Journal</h3>
                <button onclick="window.journalingSystem.exportToJSON(); this.parentElement.parentElement.remove();" class="export-option">
                    <span class="export-icon">📄</span>
                    <div>
                        <strong>JSON Format</strong>
                        <small>Machine-readable format with all data</small>
                    </div>
                </button>
                <button onclick="window.journalingSystem.exportToPDF(); this.parentElement.parentElement.remove();" class="export-option">
                    <span class="export-icon">📋</span>
                    <div>
                        <strong>PDF Format</strong>
                        <small>Beautiful printable document</small>
                    </div>
                </button>
                <button onclick="this.parentElement.parentElement.remove()" class="export-cancel">Cancel</button>
            </div>
        `;

        document.body.appendChild(menu);
        setTimeout(() => menu.classList.add('show'), 10);
    }

    addDashboardStyles() {
        if (document.getElementById('journalDashboardStyles')) return;

        const style = document.createElement('style');
        style.id = 'journalDashboardStyles';
        style.textContent = `
            .journal-dashboard {
                padding: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }

            .journal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }

            .journal-header h1 {
                margin: 0;
                font-size: 32px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .journal-header-actions {
                display: flex;
                gap: 10px;
            }

            .new-entry-btn, .export-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .new-entry-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .export-btn {
                background: #f0f0f0;
                color: #333;
            }

            .new-entry-btn:hover, .export-btn:hover {
                transform: translateY(-2px);
            }

            .journal-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .stat-card {
                background: white;
                padding: 25px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .stat-icon {
                font-size: 40px;
                margin-bottom: 10px;
            }

            .stat-value {
                font-size: 32px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .stat-label {
                color: #666;
                font-size: 14px;
                margin-top: 5px;
            }

            .journal-types {
                display: flex;
                gap: 10px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }

            .type-btn {
                padding: 10px 20px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }

            .type-btn:hover {
                border-color: #667eea;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .recent-entries h2 {
                margin-bottom: 20px;
            }

            .entries-list {
                display: grid;
                gap: 20px;
            }

            .entry-card {
                background: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                border-left: 4px solid #764ba2;
            }

            .entry-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
            }

            .entry-type {
                font-size: 12px;
                font-weight: 600;
                color: #667eea;
                text-transform: uppercase;
                margin-bottom: 5px;
            }

            .entry-card h3 {
                margin: 0 0 5px 0;
                font-size: 20px;
            }

            .entry-date {
                font-size: 14px;
                color: #999;
            }

            .favorite-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .favorite-btn:hover {
                transform: scale(1.2);
            }

            .favorite-btn.active {
                color: #ffd700;
            }

            .entry-mood {
                display: inline-block;
                padding: 5px 12px;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                border-radius: 20px;
                font-size: 13px;
                margin-bottom: 10px;
            }

            .entry-preview {
                line-height: 1.6;
                color: #555;
                margin-bottom: 15px;
            }

            .entry-meta {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                color: #999;
            }

            .entry-tags {
                color: #667eea;
            }

            .no-entries {
                text-align: center;
                padding: 60px 20px;
                color: #999;
            }

            .export-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .export-menu.show {
                opacity: 1;
            }

            .export-menu-content {
                background: white;
                padding: 30px;
                border-radius: 20px;
                max-width: 400px;
                width: 90%;
            }

            .export-menu-content h3 {
                margin-top: 0;
            }

            .export-option {
                width: 100%;
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                margin: 10px 0;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 10px;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s;
            }

            .export-option:hover {
                border-color: #667eea;
                background: #f9f9ff;
            }

            .export-icon {
                font-size: 32px;
            }

            .export-option strong {
                display: block;
                margin-bottom: 3px;
            }

            .export-option small {
                color: #666;
                font-size: 12px;
            }

            .export-cancel {
                width: 100%;
                padding: 12px;
                margin-top: 10px;
                border: none;
                background: #f0f0f0;
                border-radius: 10px;
                cursor: pointer;
            }
        `;

        document.head.appendChild(style);
    }
}

// Initialize the journaling system
if (typeof window !== 'undefined') {
    window.journalingSystem = new JournalingSystem();
    console.log('📖 Journaling System ready!');
}
