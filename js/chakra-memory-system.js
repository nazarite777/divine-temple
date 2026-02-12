/**
 * 🧘 CHAKRA MEMORY MATCH SYSTEM
 * Beautiful memory matching game with chakra theme
 *
 * Features:
 * - 3 difficulty levels (Easy: 4 pairs, Medium: 8 pairs, Hard: 12 pairs)
 * - Performance-based XP rewards (50-400 XP)
 * - Speed and accuracy bonuses
 * - Best time tracking
 * - Star ratings
 * - Firebase integration
 * - Educational chakra information
 * - Particle effects on matches
 */

class ChakraMemoryGame {
    constructor() {
        this.currentUser = null;
        this.gameData = null;
        this.selectedMode = null;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isProcessing = false;

        // Chakra card database - 24 unique cards (12 pairs for hard mode)
        this.chakraCards = [
            // Root Chakra - Muladhara
            {
                id: 'root-symbol',
                chakra: 'Root',
                type: 'symbol',
                icon: '🔴',
                text: 'Root Symbol',
                color: '#E53E3E',
                pair: 'root-name'
            },
            {
                id: 'root-name',
                chakra: 'Root',
                type: 'name',
                icon: '🪨',
                text: 'Muladhara',
                color: '#E53E3E',
                pair: 'root-symbol'
            },

            // Sacral Chakra - Svadhisthana
            {
                id: 'sacral-symbol',
                chakra: 'Sacral',
                type: 'symbol',
                icon: '🟠',
                text: 'Sacral Symbol',
                color: '#ED8936',
                pair: 'sacral-name'
            },
            {
                id: 'sacral-name',
                chakra: 'Sacral',
                type: 'name',
                icon: '💧',
                text: 'Svadhisthana',
                color: '#ED8936',
                pair: 'sacral-symbol'
            },

            // Solar Plexus - Manipura
            {
                id: 'solar-symbol',
                chakra: 'Solar Plexus',
                type: 'symbol',
                icon: '🟡',
                text: 'Solar Symbol',
                color: '#ECC94B',
                pair: 'solar-name'
            },
            {
                id: 'solar-name',
                chakra: 'Solar Plexus',
                type: 'name',
                icon: '🔥',
                text: 'Manipura',
                color: '#ECC94B',
                pair: 'solar-symbol'
            },

            // Heart Chakra - Anahata
            {
                id: 'heart-symbol',
                chakra: 'Heart',
                type: 'symbol',
                icon: '🟢',
                text: 'Heart Symbol',
                color: '#48BB78',
                pair: 'heart-name'
            },
            {
                id: 'heart-name',
                chakra: 'Heart',
                type: 'name',
                icon: '💚',
                text: 'Anahata',
                color: '#48BB78',
                pair: 'heart-symbol'
            },

            // Throat Chakra - Vishuddha
            {
                id: 'throat-symbol',
                chakra: 'Throat',
                type: 'symbol',
                icon: '🔵',
                text: 'Throat Symbol',
                color: '#4299E1',
                pair: 'throat-name'
            },
            {
                id: 'throat-name',
                chakra: 'Throat',
                type: 'name',
                icon: '🗣️',
                text: 'Vishuddha',
                color: '#4299E1',
                pair: 'throat-symbol'
            },

            // Third Eye - Ajna
            {
                id: 'thirdeye-symbol',
                chakra: 'Third Eye',
                type: 'symbol',
                icon: '🟣',
                text: 'Third Eye Symbol',
                color: '#667EEA',
                pair: 'thirdeye-name'
            },
            {
                id: 'thirdeye-name',
                chakra: 'Third Eye',
                type: 'name',
                icon: '👁️',
                text: 'Ajna',
                color: '#667EEA',
                pair: 'thirdeye-symbol'
            },

            // Crown Chakra - Sahasrara
            {
                id: 'crown-symbol',
                chakra: 'Crown',
                type: 'symbol',
                icon: '🟣',
                text: 'Crown Symbol',
                color: '#9F7AEA',
                pair: 'crown-name'
            },
            {
                id: 'crown-name',
                chakra: 'Crown',
                type: 'name',
                icon: '👑',
                text: 'Sahasrara',
                color: '#9F7AEA',
                pair: 'crown-symbol'
            },

            // Additional pairs for medium/hard difficulty
            // Chakra Elements
            {
                id: 'root-element',
                chakra: 'Root',
                type: 'element',
                icon: '🌍',
                text: 'Earth',
                color: '#E53E3E',
                pair: 'root-location'
            },
            {
                id: 'root-location',
                chakra: 'Root',
                type: 'location',
                icon: '🦶',
                text: 'Base of Spine',
                color: '#E53E3E',
                pair: 'root-element'
            },

            {
                id: 'sacral-element',
                chakra: 'Sacral',
                type: 'element',
                icon: '🌊',
                text: 'Water',
                color: '#ED8936',
                pair: 'sacral-emotion'
            },
            {
                id: 'sacral-emotion',
                chakra: 'Sacral',
                type: 'emotion',
                icon: '😊',
                text: 'Creativity',
                color: '#ED8936',
                pair: 'sacral-element'
            },

            {
                id: 'solar-element',
                chakra: 'Solar Plexus',
                type: 'element',
                icon: '🔥',
                text: 'Fire',
                color: '#ECC94B',
                pair: 'solar-power'
            },
            {
                id: 'solar-power',
                chakra: 'Solar Plexus',
                type: 'power',
                icon: '⚡',
                text: 'Personal Power',
                color: '#ECC94B',
                pair: 'solar-element'
            },

            {
                id: 'heart-element',
                chakra: 'Heart',
                type: 'element',
                icon: '💨',
                text: 'Air',
                color: '#48BB78',
                pair: 'heart-emotion'
            },
            {
                id: 'heart-emotion',
                chakra: 'Heart',
                type: 'emotion',
                icon: '💖',
                text: 'Love',
                color: '#48BB78',
                pair: 'heart-element'
            },

            {
                id: 'throat-element',
                chakra: 'Throat',
                type: 'element',
                icon: '🌬️',
                text: 'Ether',
                color: '#4299E1',
                pair: 'throat-function'
            },
            {
                id: 'throat-function',
                chakra: 'Throat',
                type: 'function',
                icon: '🎤',
                text: 'Communication',
                color: '#4299E1',
                pair: 'throat-element'
            }
        ];

        // Difficulty configurations
        this.difficulties = {
            easy: {
                pairs: 4,
                minMoves: 8,
                perfectMoves: 10,
                baseXP: 50,
                perfectXP: 100,
                speedBonus: 20
            },
            medium: {
                pairs: 8,
                minMoves: 16,
                perfectMoves: 20,
                baseXP: 100,
                perfectXP: 200,
                speedBonus: 50
            },
            hard: {
                pairs: 12,
                minMoves: 24,
                perfectMoves: 30,
                baseXP: 200,
                perfectXP: 400,
                speedBonus: 100
            }
        };

        this.init();
    }

    // ==================== INITIALIZATION ====================

    async init() {
        console.log('🧘 Chakra Memory Game initializing...');

        await this.waitForSystems();

        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.loadGameData();
                this.updateBestTimes();
            } else {
                window.location.href = '../members-new.html';
            }
        });
    }

    async waitForSystems() {
        return new Promise((resolve) => {
            const checkSystems = setInterval(() => {
                if (typeof firebase !== 'undefined' && window.progressSystem) {
                    clearInterval(checkSystems);
                    resolve();
                }
            }, 100);
        });
    }

    // ==================== DATA MANAGEMENT ====================

    async loadGameData() {
        try {
            const doc = await firebase.firestore()
                .collection('chakraMemoryProgress')
                .doc(this.currentUser.uid)
                .get();

            if (doc.exists) {
                this.gameData = doc.data();
            } else {
                this.gameData = {
                    userId: this.currentUser.uid,
                    gamesPlayed: 0,
                    perfectGames: 0,
                    totalXPEarned: 0,
                    bestTimes: {
                        easy: null,
                        medium: null,
                        hard: null
                    },
                    stats: {
                        easy: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 },
                        medium: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 },
                        hard: { played: 0, wins: 0, totalMoves: 0, totalTime: 0 }
                    }
                };
                await this.saveGameData();
            }
        } catch (error) {
            console.error('Error loading game data:', error);
        }
    }

    async saveGameData() {
        try {
            await firebase.firestore()
                .collection('chakraMemoryProgress')
                .doc(this.currentUser.uid)
                .set(this.gameData);
        } catch (error) {
            console.error('Error saving game data:', error);
        }
    }

    updateBestTimes() {
        if (!this.gameData) return;

        const formatTime = (seconds) => {
            if (!seconds) return '--:--';
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        document.getElementById('bestTimeEasy').textContent = formatTime(this.gameData.bestTimes.easy);
        document.getElementById('bestTimeMedium').textContent = formatTime(this.gameData.bestTimes.medium);
        document.getElementById('bestTimeHard').textContent = formatTime(this.gameData.bestTimes.hard);
    }

    // ==================== MODE SELECTION ====================

    selectMode(mode) {
        this.selectedMode = mode;

        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('selected');

        // Enable start button
        const startBtn = document.querySelector('.start-game-btn');
        startBtn.disabled = false;
        startBtn.textContent = `Start ${mode.charAt(0).toUpperCase() + mode.slice(1)} Game 🎮`;
    }

    // ==================== GAME FLOW ====================

    startGame() {
        if (!this.selectedMode) return;

        // Hide mode selection
        document.getElementById('modeSelection').style.display = 'none';

        // Show game board
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.classList.add('active');

        // Setup game
        this.setupGame();
    }

    setupGame() {
        // Reset game state
        this.moves = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.startTime = Date.now();
        this.isProcessing = false;

        // Get difficulty config
        const config = this.difficulties[this.selectedMode];

        // Select and shuffle cards
        this.cards = this.selectCards(config.pairs);
        this.shuffleCards();

        // Update UI
        document.getElementById('movesValue').textContent = '0';
        document.getElementById('pairsValue').textContent = `0/${config.pairs}`;
        document.getElementById('timeValue').textContent = '00:00';

        // Render cards
        this.renderCards();

        // Start timer
        this.startTimer();
    }

    selectCards(pairs) {
        // Shuffle available cards and take required pairs
        const shuffled = [...this.chakraCards].sort(() => Math.random() - 0.5);
        const selected = [];
        const usedPairs = new Set();

        for (let i = 0; i < shuffled.length && selected.length < pairs * 2; i++) {
            const card = shuffled[i];
            // Make sure we have both cards in the pair
            const pairCard = this.chakraCards.find(c => c.id === card.pair);

            if (pairCard && !usedPairs.has(card.chakra + card.type + card.pair)) {
                selected.push({ ...card, cardId: `card-${selected.length}` });
                selected.push({ ...pairCard, cardId: `card-${selected.length}` });
                usedPairs.add(card.chakra + card.type + card.pair);
                usedPairs.add(pairCard.chakra + pairCard.type + pairCard.pair);
            }
        }

        return selected.slice(0, pairs * 2);
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderCards() {
        const grid = document.getElementById('cardsGrid');
        grid.innerHTML = '';
        grid.className = `cards-grid ${this.selectedMode}`;

        this.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            grid.appendChild(cardElement);
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.dataset.cardId = card.cardId;
        cardDiv.dataset.pairId = card.pair;
        cardDiv.dataset.chakra = card.chakra;

        cardDiv.innerHTML = `
            <div class="card-face card-front">
                <div class="card-pattern"></div>
            </div>
            <div class="card-face card-back" style="border-color: ${card.color}">
                <div class="card-icon">${card.icon}</div>
                <div class="card-text" style="color: ${card.color}">${card.text}</div>
            </div>
        `;

        cardDiv.addEventListener('click', () => this.flipCard(cardDiv, card));

        return cardDiv;
    }

    flipCard(cardElement, card) {
        // Prevent flipping if processing, already flipped, or matched
        if (this.isProcessing ||
            cardElement.classList.contains('flipped') ||
            cardElement.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            return;
        }

        // Flip the card
        cardElement.classList.add('flipped');
        this.flippedCards.push({ element: cardElement, data: card });

        // Check for match if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.isProcessing = true;
            this.moves++;
            document.getElementById('movesValue').textContent = this.moves;

            setTimeout(() => {
                this.checkMatch();
            }, 500);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;

        // Check if cards match (they should have each other's IDs)
        if (card1.data.pair === card2.data.id) {
            // Match!
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');

            this.matchedPairs++;
            const config = this.difficulties[this.selectedMode];
            document.getElementById('pairsValue').textContent = `${this.matchedPairs}/${config.pairs}`;

            // Particle effects
            this.createParticles(card1.element, card1.data.color);
            this.createParticles(card2.element, card2.data.color);

            // Check for victory
            if (this.matchedPairs === config.pairs) {
                setTimeout(() => this.gameComplete(), 500);
            }
        } else {
            // No match - flip back
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
            }, 300);
        }

        this.flippedCards = [];
        this.isProcessing = false;
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            document.getElementById('timeValue').textContent =
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // ==================== GAME COMPLETE ====================

    async gameComplete() {
        clearInterval(this.timerInterval);

        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        const config = this.difficulties[this.selectedMode];

        // Calculate stars (1-3 based on moves)
        let stars = 1;
        if (this.moves <= config.perfectMoves) stars = 3;
        else if (this.moves <= config.minMoves * 1.5) stars = 2;

        // Calculate XP
        let xp = config.baseXP;
        const breakdown = [`Base: ${config.baseXP} XP`];

        // Perfect game bonus
        if (this.moves === config.minMoves) {
            const perfectBonus = config.perfectXP - config.baseXP;
            xp = config.perfectXP;
            breakdown.push(`Perfect Game: +${perfectBonus} XP`);
        }

        // Speed bonus (if under 2 minutes for easy, 3 for medium, 4 for hard)
        const speedThresholds = { easy: 120, medium: 180, hard: 240 };
        if (totalTime < speedThresholds[this.selectedMode]) {
            const speedBonus = Math.floor(config.speedBonus * (1 - totalTime / speedThresholds[this.selectedMode]));
            xp += speedBonus;
            breakdown.push(`Speed Bonus: +${speedBonus} XP`);
        }

        // 3-star bonus
        if (stars === 3) {
            const starBonus = 50;
            xp += starBonus;
            breakdown.push(`3-Star Bonus: +${starBonus} XP`);
        }

        // Update stats
        this.gameData.gamesPlayed++;
        this.gameData.totalXPEarned += xp;
        if (this.moves === config.minMoves) {
            this.gameData.perfectGames++;
        }

        // Update stats for difficulty
        this.gameData.stats[this.selectedMode].played++;
        this.gameData.stats[this.selectedMode].wins++;
        this.gameData.stats[this.selectedMode].totalMoves += this.moves;
        this.gameData.stats[this.selectedMode].totalTime += totalTime;

        // Check for new best time
        let isNewRecord = false;
        if (!this.gameData.bestTimes[this.selectedMode] ||
            totalTime < this.gameData.bestTimes[this.selectedMode]) {
            this.gameData.bestTimes[this.selectedMode] = totalTime;
            isNewRecord = true;
        }

        await this.saveGameData();
        this.updateBestTimes();

        // Award XP to universal system
        if (window.progressSystem) {
            await window.progressSystem.awardXP(
                xp,
                `Chakra Memory Match (${this.selectedMode})`,
                'chakra-memory'
            );
        }

        // Show victory screen
        this.showVictoryScreen(totalTime, stars, xp, breakdown, isNewRecord);
    }

    showVictoryScreen(time, stars, xp, breakdown, isNewRecord) {
        // Hide game board
        document.getElementById('gameBoard').classList.remove('active');

        // Format time
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Update victory screen
        document.getElementById('finalTime').textContent = timeStr;
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalStars').textContent = '⭐'.repeat(stars);
        document.getElementById('totalXP').textContent = xp;

        // XP breakdown
        const breakdownDiv = document.getElementById('xpBreakdown');
        breakdownDiv.innerHTML = breakdown.join('<br>');

        // New record message
        if (isNewRecord) {
            document.getElementById('newRecordMsg').style.display = 'block';
        } else {
            document.getElementById('newRecordMsg').style.display = 'none';
        }

        // Show victory screen
        document.getElementById('victoryScreen').classList.add('show');
    }

    // ==================== GAME CONTROLS ====================

    resetGame() {
        this.setupGame();
    }

    playAgain() {
        document.getElementById('victoryScreen').classList.remove('show');
        this.setupGame();
    }

    backToMenu() {
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Hide game board and victory screen
        document.getElementById('gameBoard').classList.remove('active');
        document.getElementById('victoryScreen').classList.remove('show');

        // Show mode selection
        document.getElementById('modeSelection').style.display = 'block';

        // Deselect mode
        this.selectedMode = null;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        const startBtn = document.querySelector('.start-game-btn');
        startBtn.disabled = true;
        startBtn.textContent = 'Select a Difficulty to Start';
    }

    // ==================== UI EFFECTS ====================

    createParticles(element, color) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.background = color;

            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 100 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }
    }

    shareResults() {
        const stars = document.getElementById('finalStars').textContent;
        const time = document.getElementById('finalTime').textContent;
        const xp = document.getElementById('totalXP').textContent;

        const text = `🧘 Chakra Memory Match\n\n` +
            `Difficulty: ${this.selectedMode.charAt(0).toUpperCase() + this.selectedMode.slice(1)}\n` +
            `Rating: ${stars}\n` +
            `Time: ${time}\n` +
            `XP Earned: +${xp}\n\n` +
            `Align your chakras in Divine Temple! 🌟`;

        if (navigator.share) {
            navigator.share({
                title: 'Chakra Memory Match Results',
                text: text,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }
}

// Global functions for inline onclick handlers
function selectMode(mode) {
    window.chakraGame.selectMode(mode);
}

function startGame() {
    window.chakraGame.startGame();
}

function resetGame() {
    window.chakraGame.resetGame();
}

function playAgain() {
    window.chakraGame.playAgain();
}

function backToMenu() {
    window.chakraGame.backToMenu();
}

function shareResults() {
    window.chakraGame.shareResults();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chakraGame = new ChakraMemoryGame();
});
