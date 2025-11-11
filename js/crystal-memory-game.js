/**
 *  CRYSTAL MATCHING MEMORY GAME
 * Educational memory game that teaches crystal healing properties through gameplay
 */

class CrystalMatchingMemoryGame {
    constructor() {
        this.gameState = 'menu';
        this.difficulty = 'easy';
        console.log(' Crystal Memory Game initialized');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('crystalMemoryContainer')) {
        window.crystalMemoryGame = new CrystalMatchingMemoryGame();
    }
});
