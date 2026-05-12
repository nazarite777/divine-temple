/**
 * 💎 CRYSTAL MEMORY QUEST
 * Educational memory game that teaches crystal healing properties through gameplay
 * Version 1.0 - Complete Implementation
 */

class CrystalMemoryGame {
    constructor() {
        this.crystals = {
            // Healing & Protection Crystals
            amethyst: { icon: '💜', name: 'Amethyst', property: 'Spiritual Protection' },
            clearQuartz: { icon: '💎', name: 'Clear Quartz', property: 'Master Healer' },
            roseQuartz: { icon: '💗', name: 'Rose Quartz', property: 'Unconditional Love' },
            citrine: { icon: '💛', name: 'Citrine', property: 'Abundance & Joy' },

            // Grounding & Balance
            blackTourmaline: { icon: '🖤', name: 'Black Tourmaline', property: 'Protection & Grounding' },
            hematite: { icon: '⚫', name: 'Hematite', property: 'Grounding Energy' },
            smokyQuartz: { icon: '🤎', name: 'Smoky Quartz', property: 'Transmutation' },
            obsidian: { icon: '⬛', name: 'Obsidian', property: 'Psychic Protection' },

            // Emotional Healing
            rhodonite: { icon: '🩷', name: 'Rhodonite', property: 'Emotional Balance' },
            lapisLazuli: { icon: '💙', name: 'Lapis Lazuli', property: 'Inner Truth' },
            sodalite: { icon: '🔵', name: 'Sodalite', property: 'Logic & Intuition' },
            amazonite: { icon: '💚', name: 'Amazonite', property: 'Soothing Energy' },

            // Chakra & Energy
            carnelian: { icon: '🧡', name: 'Carnelian', property: 'Vitality & Courage' },
            tigerEye: { icon: '🟤', name: 'Tiger\'s Eye', property: 'Confidence & Power' },
            malachite: { icon: '💚', name: 'Malachite', property: 'Transformation' },
            jade: { icon: '🟢', name: 'Jade', property: 'Good Fortune' },

            // Spiritual Growth
            selenite: { icon: '🤍', name: 'Selenite', property: 'Divine Light' },
            celestite: { icon: '🩵', name: 'Celestite', property: 'Angelic Communication' },
            angelite: { icon: '💫', name: 'Angelite', property: 'Peace & Tranquility' },
            moonstone: { icon: '🌙', name: 'Moonstone', property: 'Intuition & Cycles' },

            // Manifestation
            pyrite: { icon: '✨', name: 'Pyrite', property: 'Wealth & Manifestation' },
            greenAventurine: { icon: '🍀', name: 'Green Aventurine', property: 'Luck & Opportunity' },
            sunstone: { icon: '☀️', name: 'Sunstone', property: 'Joy & Vitality' },
            fluorite: { icon: '🌈', name: 'Fluorite', property: 'Mental Clarity' }
        };

        this.selectedDifficulty = null;
        this.gameState = 'menu';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.bestTimes = this.loadBestTimes();

        console.log('💎 Crystal Memory Quest initialized');
        this.loadBestTimesDisplay();
    }

    loadBestTimes() {
        const saved = localStorage.getItem('crystalMemoryBestTimes');
        return saved ? JSON.parse(saved) : {
            easy: null,
            medium: null,
            hard: null
        };
    }

    saveBestTimes() {
        localStorage.setItem('crystalMemoryBestTimes', JSON.stringify(this.bestTimes));
    }

    loadBestTimesDisplay() {
        ['easy', 'medium', 'hard'].forEach(difficulty => {
            const element = document.getElementById(`bestTime${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`);
            if (element) {
                const time = this.bestTimes[difficulty];
                element.textContent = time ? this.formatTime(time) : '--:--';
            }
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Global functions for onclick handlers
let game = null;

function selectDifficulty(difficulty) {
    game.selectedDifficulty = difficulty;

    // Update UI
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');

    // Enable start button
    const startBtn = document.querySelector('.start-game-btn');
    startBtn.disabled = false;
    startBtn.textContent = `Start ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode`;
}

function startGame() {
    if (!game.selectedDifficulty) return;

    game.gameState = 'playing';
    game.moves = 0;
    game.matchedPairs = 0;
    game.flippedCards = [];
    game.startTime = Date.now();

    // Hide menu, show game board
    document.getElementById('menuScreen').style.display = 'none';
    document.querySelector('.best-times').style.display = 'none';
    document.getElementById('gameBoard').classList.add('active');

    // Generate cards
    generateCards();

    // Start timer
    startTimer();
}

function generateCards() {
    const numPairs = game.selectedDifficulty === 'easy' ? 4 :
                     game.selectedDifficulty === 'medium' ? 8 : 12;

    // Get random crystals
    const crystalKeys = Object.keys(game.crystals);
    const shuffled = crystalKeys.sort(() => Math.random() - 0.5);
    const selectedCrystals = shuffled.slice(0, numPairs);

    // Create pairs
    game.cards = [];
    selectedCrystals.forEach((key, index) => {
        const crystal = game.crystals[key];
        game.cards.push({ ...crystal, id: `${key}-1`, pairId: key });
        game.cards.push({ ...crystal, id: `${key}-2`, pairId: key });
    });

    // Shuffle cards
    game.cards = game.cards.sort(() => Math.random() - 0.5);

    // Render cards
    const grid = document.getElementById('cardsGrid');
    grid.className = `cards-grid ${game.selectedDifficulty}`;
    grid.innerHTML = game.cards.map((card, index) => `
        <div class="card" data-index="${index}" data-pair-id="${card.pairId}" onclick="flipCard(${index})">
            <div class="card-face card-back">
                💎
            </div>
            <div class="card-face card-front">
                <div class="card-icon">${card.icon}</div>
                <div class="card-name">${card.name}</div>
            </div>
        </div>
    `).join('');

    // Update pairs display
    document.getElementById('pairsValue').textContent = `0/${numPairs}`;
}

function flipCard(index) {
    if (game.gameState !== 'playing') return;

    const cardElement = document.querySelector(`[data-index="${index}"]`);
    if (cardElement.classList.contains('flipped') ||
        cardElement.classList.contains('matched')) return;

    // Flip the card
    cardElement.classList.add('flipped');
    game.flippedCards.push(index);

    // Check for match when two cards are flipped
    if (game.flippedCards.length === 2) {
        game.moves++;
        document.getElementById('movesValue').textContent = game.moves;

        setTimeout(() => checkMatch(), 800);
    }
}

function checkMatch() {
    const [index1, index2] = game.flippedCards;
    const card1 = document.querySelector(`[data-index="${index1}"]`);
    const card2 = document.querySelector(`[data-index="${index2}"]`);

    const pairId1 = card1.dataset.pairId;
    const pairId2 = card2.dataset.pairId;

    if (pairId1 === pairId2) {
        // Match!
        card1.classList.add('matched');
        card2.classList.add('matched');
        game.matchedPairs++;

        // Update pairs display
        const totalPairs = game.selectedDifficulty === 'easy' ? 4 :
                          game.selectedDifficulty === 'medium' ? 8 : 12;
        document.getElementById('pairsValue').textContent = `${game.matchedPairs}/${totalPairs}`;

        // Check if game is won
        if (game.matchedPairs === totalPairs) {
            setTimeout(() => gameWon(), 500);
        }
    } else {
        // No match - flip back
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    game.flippedCards = [];
}

function startTimer() {
    let seconds = 0;

    game.timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timeValue').textContent = game.formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    if (game.timerInterval) {
        clearInterval(game.timerInterval);
        game.timerInterval = null;
    }
}

function gameWon() {
    game.gameState = 'won';
    stopTimer();

    // Calculate stats
    const totalTime = Math.floor((Date.now() - game.startTime) / 1000);
    const totalPairs = game.selectedDifficulty === 'easy' ? 4 :
                       game.selectedDifficulty === 'medium' ? 8 : 12;
    const perfectMoves = totalPairs; // Perfect would be matching each pair on first try
    const efficiency = Math.round((perfectMoves / game.moves) * 100);

    // Calculate XP
    let baseXP = game.selectedDifficulty === 'easy' ? 75 :
                 game.selectedDifficulty === 'medium' ? 150 : 300;

    // Bonus XP for efficiency
    const efficiencyBonus = Math.floor(baseXP * (efficiency / 100) * 0.5);
    const totalXP = baseXP + efficiencyBonus;

    // Check for new best time
    const isNewRecord = !game.bestTimes[game.selectedDifficulty] ||
                        totalTime < game.bestTimes[game.selectedDifficulty];

    if (isNewRecord) {
        game.bestTimes[game.selectedDifficulty] = totalTime;
        game.saveBestTimes();
        document.getElementById('newRecordMsg').style.display = 'block';
    }

    // Update victory screen
    document.getElementById('finalTime').textContent = game.formatTime(totalTime);
    document.getElementById('finalMoves').textContent = game.moves;
    document.getElementById('finalEfficiency').textContent = `${efficiency}%`;
    document.getElementById('xpEarned').textContent = totalXP;

    // Hide game board, show victory screen
    document.getElementById('gameBoard').classList.remove('active');
    document.getElementById('victoryScreen').classList.add('active');

    // Award XP
    if (window.progressSystem) {
        window.progressSystem.awardXP(totalXP,
            `Completed Crystal Memory Quest (${game.selectedDifficulty})`,
            'crystals');

        window.progressSystem.logActivity('crystal_memory_completed', 'crystals', {
            difficulty: game.selectedDifficulty,
            time: totalTime,
            moves: game.moves,
            efficiency: efficiency,
            xpEarned: totalXP
        });
    }
}

function resetGame() {
    if (confirm('Reset the current game?')) {
        stopTimer();
        startGame();
    }
}

function backToMenu() {
    stopTimer();

    game.gameState = 'menu';
    game.selectedDifficulty = null;

    // Reset UI
    document.getElementById('gameBoard').classList.remove('active');
    document.getElementById('victoryScreen').classList.remove('active');
    document.getElementById('newRecordMsg').style.display = 'none';
    document.getElementById('menuScreen').style.display = 'block';
    document.querySelector('.best-times').style.display = 'block';

    // Reset start button
    const startBtn = document.querySelector('.start-game-btn');
    startBtn.disabled = true;
    startBtn.textContent = 'Select a Difficulty to Start';

    // Remove selections
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Reload best times
    game.loadBestTimesDisplay();
}

function playAgain() {
    document.getElementById('victoryScreen').classList.remove('active');
    document.getElementById('newRecordMsg').style.display = 'none';
    startGame();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    game = new CrystalMemoryGame();
    console.log('💎 Crystal Memory Quest ready to play!');
});
