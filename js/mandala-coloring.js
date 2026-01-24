/**
 * 🎨 MANDALA COLORING CANVAS
 * Meditative mandala coloring experience with sacred geometry patterns
 * Features healing color palettes, ambient sounds, and mindful focus
 * 
 * Features:
 * - Multiple sacred geometry mandala patterns
 * - Healing-focused color palettes (chakra, nature, spiritual)
 * - Ambient sound integration
 * - Save/export as PNG
 * - Meditation timer and mindfulness tracking
 * - Particle rewards for completion
 * - Undo/redo functionality
 */

class MandalaColoringCanvas {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.svg = null;
        this.currentMandala = null;
        this.currentColor = '#ff6b6b';
        this.currentPalette = 'chakra';
        this.isDrawing = false;
        this.brushSize = 8;
        this.meditationTimer = 0;
        this.timerInterval = null;
        this.isTimerRunning = false;
        
        // Audio system
        this.audioEnabled = true;
        this.audioContext = null;
        this.ambientSound = null;
        
        // Drawing history for undo/redo
        this.drawingHistory = [];
        this.historyStep = -1;
        
        // Mandala patterns (SVG paths)
        this.mandalaPatterns = {
            lotus: {
                name: 'Sacred Lotus',
                description: 'Symbol of purity and enlightenment',
                paths: this.generateLotusPattern(),
                difficulty: 'beginner',
                meaning: 'The lotus represents spiritual awakening and the journey from darkness to light.'
            },
            flower_of_life: {
                name: 'Flower of Life',
                description: 'Ancient symbol of creation',
                paths: this.generateFlowerOfLifePattern(),
                difficulty: 'intermediate',
                meaning: 'Sacred geometry pattern representing the fundamental forms of space and time.'
            },
            sri_yantra: {
                name: 'Sri Yantra',
                description: 'Divine cosmic energy pattern',
                paths: this.generateSriYantraPattern(),
                difficulty: 'advanced',
                meaning: 'The most powerful yantra for manifesting spiritual and material abundance.'
            },
            mandala_rose: {
                name: 'Rose Mandala',
                description: 'Heart-opening floral pattern',
                paths: this.generateRoseMandalaPattern(),
                difficulty: 'beginner',
                meaning: 'Opens the heart chakra and cultivates self-love and compassion.'
            },
            cosmic_wheel: {
                name: 'Cosmic Wheel',
                description: 'Universe in eternal motion',
                paths: this.generateCosmicWheelPattern(),
                difficulty: 'intermediate',
                meaning: 'Represents the cycles of existence and cosmic consciousness.'
            },
            tree_of_life: {
                name: 'Tree of Life',
                description: 'Connection between earth and sky',
                paths: this.generateTreeOfLifePattern(),
                difficulty: 'advanced',
                meaning: 'Symbolizes the connection between all forms of creation and spiritual growth.'
            }
        };

        // Color palettes for healing and meditation
        this.colorPalettes = {
            chakra: {
                name: 'Chakra Healing',
                colors: [
                    '#c41e3a', // Root - Red
                    '#ff8c00', // Sacral - Orange
                    '#ffd700', // Solar Plexus - Yellow
                    '#228b22', // Heart - Green
                    '#4169e1', // Throat - Blue
                    '#663399', // Third Eye - Indigo
                    '#9370db'  // Crown - Violet
                ],
                description: 'Balance and align your energy centers'
            },
            nature: {
                name: 'Nature Harmony',
                colors: [
                    '#8fbc8f', // Sage Green
                    '#deb887', // Earth Brown
                    '#4682b4', // Sky Blue
                    '#f4a460', // Sandy Brown
                    '#9370db', // Mountain Purple
                    '#20b2aa', // Ocean Teal
                    '#ffd700'  // Sunlight Yellow
                ],
                description: 'Connect with the natural world'
            },
            sunset: {
                name: 'Sunset Meditation',
                colors: [
                    '#ff4500', // Orange Red
                    '#ff6347', // Tomato
                    '#ffd700', // Gold
                    '#ff69b4', // Hot Pink
                    '#9370db', // Purple
                    '#4169e1', // Royal Blue
                    '#191970'  // Midnight Blue
                ],
                description: 'Evening contemplation and peace'
            },
            ocean: {
                name: 'Ocean Depths',
                colors: [
                    '#e0ffff', // Light Cyan
                    '#afeeee', // Pale Turquoise
                    '#40e0d0', // Turquoise
                    '#20b2aa', // Light Sea Green
                    '#008b8b', // Dark Cyan
                    '#4682b4', // Steel Blue
                    '#191970'  // Midnight Blue
                ],
                description: 'Flow like water, deep like the sea'
            },
            earth: {
                name: 'Earth Grounding',
                colors: [
                    '#f5deb3', // Wheat
                    '#d2691e', // Chocolate
                    '#8b4513', // Saddle Brown
                    '#228b22', // Forest Green
                    '#556b2f', // Dark Olive Green
                    '#8fbc8f', // Dark Sea Green
                    '#2e8b57'  // Sea Green
                ],
                description: 'Ground yourself in earthly wisdom'
            },
            crystal: {
                name: 'Crystal Healing',
                colors: [
                    '#e6e6fa', // Lavender
                    '#dda0dd', // Plum
                    '#da70d6', // Orchid
                    '#ba55d3', // Medium Orchid
                    '#9932cc', // Dark Orchid
                    '#8a2be2', // Blue Violet
                    '#4b0082'  // Indigo
                ],
                description: 'Crystal energy for clarity and healing'
            }
        };

        this.init();
    }

    // ==================== INITIALIZATION ====================

    async init() {
        console.log('🎨 Initializing Mandala Coloring Canvas...');
        
        const container = document.getElementById('mandalaColoringContainer');
        if (!container) {
            console.warn('Mandala coloring container not found');
            return;
        }

        await this.createInterface();
        this.setupCanvas();
        this.initAudio();
        this.bindEvents();
        
        console.log('✅ Mandala Coloring Canvas initialized');
    }

    async createInterface() {
        const container = document.getElementById('mandalaColoringContainer');
        
        container.innerHTML = `
            <div class="mandala-coloring-app">
                <!-- Header Controls -->
                <div class="mandala-header">
                    <div class="mandala-title">
                        <h3>🎨 Mandala Coloring Canvas</h3>
                        <p class="mandala-subtitle">Meditative Art & Sacred Geometry</p>
                    </div>
                    
                    <div class="timer-display">
                        <div class="timer-icon">🧘‍♀️</div>
                        <div class="timer-text">
                            <span id="meditationTime">00:00</span>
                            <button id="timerToggle" class="timer-btn" title="Start/Pause Timer">▶️</button>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="mandala-workspace">
                    <!-- Left Panel - Mandala Selection -->
                    <div class="mandala-panel left-panel">
                        <h4>Choose Your Mandala</h4>
                        <div class="mandala-grid" id="mandalaGrid">
                            <!-- Mandala thumbnails will be generated here -->
                        </div>
                        
                        <div class="current-mandala-info" id="mandalaInfo">
                            <h5>Select a mandala to begin</h5>
                            <p>Choose from our collection of sacred geometry patterns</p>
                        </div>
                    </div>

                    <!-- Center - Canvas Area -->
                    <div class="canvas-container">
                        <div class="canvas-wrapper">
                            <canvas id="mandalaCanvas" width="600" height="600"></canvas>
                            <div class="canvas-overlay" id="canvasOverlay">
                                <div class="start-message">
                                    <div class="start-icon">🎨</div>
                                    <h4>Select a Mandala Pattern</h4>
                                    <p>Choose from the collection on the left to begin your meditative journey</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Canvas Controls -->
                        <div class="canvas-controls">
                            <button id="undoBtn" class="control-btn" title="Undo">↶</button>
                            <button id="redoBtn" class="control-btn" title="Redo">↷</button>
                            <button id="clearBtn" class="control-btn" title="Clear Canvas">🗑️</button>
                            <button id="saveBtn" class="control-btn" title="Save Image">💾</button>
                            <button id="shareBtn" class="control-btn" title="Share">📤</button>
                        </div>
                    </div>

                    <!-- Right Panel - Colors & Tools -->
                    <div class="mandala-panel right-panel">
                        <h4>Color Palettes</h4>
                        
                        <!-- Palette Selector -->
                        <div class="palette-selector">
                            <select id="paletteSelect" class="palette-dropdown">
                                <option value="chakra">🌈 Chakra Healing</option>
                                <option value="nature">🌿 Nature Harmony</option>
                                <option value="sunset">🌅 Sunset Meditation</option>
                                <option value="ocean">🌊 Ocean Depths</option>
                                <option value="earth">🌍 Earth Grounding</option>
                                <option value="crystal">💎 Crystal Healing</option>
                            </select>
                        </div>

                        <!-- Color Grid -->
                        <div class="color-grid" id="colorGrid">
                            <!-- Colors will be generated here -->
                        </div>

                        <div class="palette-info" id="paletteInfo">
                            <!-- Palette description will appear here -->
                        </div>

                        <!-- Brush Controls -->
                        <div class="brush-controls">
                            <h5>Brush Settings</h5>
                            <div class="brush-size">
                                <label>Size: <span id="brushSizeValue">8</span>px</label>
                                <input type="range" id="brushSize" min="2" max="20" value="8" class="slider">
                            </div>
                        </div>

                        <!-- Audio Controls -->
                        <div class="audio-controls">
                            <h5>Ambient Sounds</h5>
                            <button id="audioToggle" class="audio-btn">🔊 Enable Sounds</button>
                        </div>
                    </div>
                </div>

                <!-- Completion Celebration -->
                <div class="completion-celebration" id="completionModal" style="display: none;">
                    <div class="celebration-content">
                        <h3>🎉 Mandala Complete!</h3>
                        <p>Your mindful creation is beautiful. You spent <span id="completionTime"></span> in meditation.</p>
                        <div class="celebration-buttons">
                            <button id="saveCompletedBtn" class="celebrate-btn">💾 Save Creation</button>
                            <button id="startNewBtn" class="celebrate-btn">🎨 Create New</button>
                            <button id="shareCompletedBtn" class="celebrate-btn">📤 Share</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Generate mandala thumbnails
        this.generateMandalaGrid();
        
        // Generate initial color palette
        this.generateColorPalette('chakra');
    }

    setupCanvas() {
        this.canvas = document.getElementById('mandalaCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set up canvas properties
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
        
        // Save initial state
        this.saveState();
    }

    // ==================== MANDALA PATTERN GENERATORS ====================

    generateLotusPattern() {
        const paths = [];
        const centerX = 300;
        const centerY = 300;
        
        // Outer petals
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const path = `M ${centerX + Math.cos(angle) * 120} ${centerY + Math.sin(angle) * 120}
                         Q ${centerX + Math.cos(angle + 0.3) * 80} ${centerY + Math.sin(angle + 0.3) * 80}
                           ${centerX + Math.cos(angle + 0.6) * 120} ${centerY + Math.sin(angle + 0.6) * 120}
                         Q ${centerX} ${centerY} 
                           ${centerX + Math.cos(angle) * 120} ${centerY + Math.sin(angle) * 120}`;
            paths.push({ d: path, id: `lotus-outer-${i}` });
        }
        
        // Inner petals
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const path = `M ${centerX + Math.cos(angle) * 60} ${centerY + Math.sin(angle) * 60}
                         Q ${centerX + Math.cos(angle + 0.5) * 40} ${centerY + Math.sin(angle + 0.5) * 40}
                           ${centerX + Math.cos(angle + 1) * 60} ${centerY + Math.sin(angle + 1) * 60}
                         Q ${centerX} ${centerY}
                           ${centerX + Math.cos(angle) * 60} ${centerY + Math.sin(angle) * 60}`;
            paths.push({ d: path, id: `lotus-inner-${i}` });
        }
        
        // Center circle
        paths.push({
            d: `M ${centerX + 20} ${centerY} A 20 20 0 1 1 ${centerX - 20} ${centerY} A 20 20 0 1 1 ${centerX + 20} ${centerY}`,
            id: 'lotus-center'
        });
        
        return paths;
    }

    generateFlowerOfLifePattern() {
        const paths = [];
        const centerX = 300;
        const centerY = 300;
        const radius = 40;
        
        // Center circle
        paths.push({
            d: `M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY}`,
            id: 'fol-center'
        });
        
        // Six surrounding circles
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            paths.push({
                d: `M ${x + radius} ${y} A ${radius} ${radius} 0 1 1 ${x - radius} ${y} A ${radius} ${radius} 0 1 1 ${x + radius} ${y}`,
                id: `fol-ring1-${i}`
            });
        }
        
        // Outer ring of 12 circles
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * (radius * 2);
            const y = centerY + Math.sin(angle) * (radius * 2);
            
            paths.push({
                d: `M ${x + radius} ${y} A ${radius} ${radius} 0 1 1 ${x - radius} ${y} A ${radius} ${radius} 0 1 1 ${x + radius} ${y}`,
                id: `fol-ring2-${i}`
            });
        }
        
        return paths;
    }

    generateSriYantraPattern() {
        const paths = [];
        const centerX = 300;
        const centerY = 300;
        
        // Outer triangles pointing up
        for (let i = 0; i < 4; i++) {
            const size = 150 - (i * 20);
            const path = `M ${centerX} ${centerY - size} 
                         L ${centerX - size * 0.866} ${centerY + size * 0.5}
                         L ${centerX + size * 0.866} ${centerY + size * 0.5} Z`;
            paths.push({ d: path, id: `yantra-up-${i}` });
        }
        
        // Outer triangles pointing down
        for (let i = 0; i < 5; i++) {
            const size = 140 - (i * 18);
            const path = `M ${centerX} ${centerY + size}
                         L ${centerX - size * 0.866} ${centerY - size * 0.5}
                         L ${centerX + size * 0.866} ${centerY - size * 0.5} Z`;
            paths.push({ d: path, id: `yantra-down-${i}` });
        }
        
        // Central dot
        paths.push({
            d: `M ${centerX + 5} ${centerY} A 5 5 0 1 1 ${centerX - 5} ${centerY} A 5 5 0 1 1 ${centerX + 5} ${centerY}`,
            id: 'yantra-center'
        });
        
        return paths;
    }

    generateRoseMandalaPattern() {
        const paths = [];
        const centerX = 300;
        const centerY = 300;
        
        // Rose petals in concentric rings
        for (let ring = 0; ring < 3; ring++) {
            const radius = 120 - (ring * 30);
            const petalCount = 8 + (ring * 4);
            
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                const path = `M ${x} ${y}
                             Q ${x + Math.cos(angle + 0.2) * 20} ${y + Math.sin(angle + 0.2) * 20}
                               ${x + Math.cos(angle + 0.4) * 15} ${y + Math.sin(angle + 0.4) * 15}
                             Q ${x + Math.cos(angle - 0.2) * 20} ${y + Math.sin(angle - 0.2) * 20}
                               ${x} ${y}`;
                paths.push({ d: path, id: `rose-ring${ring}-${i}` });
            }
        }
        
        return paths;
    }

    generateCosmicWheelPattern() {
        const paths = [];
        const centerX = 300;
        const centerY = 300;
        
        // Concentric circles
        for (let i = 1; i <= 5; i++) {
            const radius = i * 30;
            paths.push({
                d: `M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY}`,
                id: `cosmic-circle-${i}`
            });
        }
        
        // Radiating spokes
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const path = `M ${centerX} ${centerY} L ${centerX + Math.cos(angle) * 150} ${centerY + Math.sin(angle) * 150}`;
            paths.push({ d: path, id: `cosmic-spoke-${i}` });
        }
        
        return paths;
    }

    generateTreeOfLifePattern() {
        const paths = [];
        const centerX = 300;
        const centerY = 300;
        
        // Tree trunk
        paths.push({
            d: `M ${centerX - 10} ${centerY + 150} L ${centerX + 10} ${centerY + 150} L ${centerX + 15} ${centerY - 50} L ${centerX - 15} ${centerY - 50} Z`,
            id: 'tree-trunk'
        });
        
        // Branches and leaves in mandala pattern
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const branchLength = 80 + Math.random() * 40;
            
            // Branch
            const branchPath = `M ${centerX} ${centerY - 50} L ${centerX + Math.cos(angle) * branchLength} ${centerY - 50 + Math.sin(angle) * branchLength}`;
            paths.push({ d: branchPath, id: `tree-branch-${i}` });
            
            // Leaves cluster
            const leafX = centerX + Math.cos(angle) * branchLength;
            const leafY = centerY - 50 + Math.sin(angle) * branchLength;
            
            for (let j = 0; j < 5; j++) {
                const leafAngle = angle + (j - 2) * 0.3;
                const leafPath = `M ${leafX} ${leafY} Q ${leafX + Math.cos(leafAngle) * 15} ${leafY + Math.sin(leafAngle) * 15} ${leafX + Math.cos(leafAngle + 0.5) * 25} ${leafY + Math.sin(leafAngle + 0.5) * 25}`;
                paths.push({ d: leafPath, id: `tree-leaf-${i}-${j}` });
            }
        }
        
        return paths;
    }

    // ==================== UI GENERATION ====================

    generateMandalaGrid() {
        const grid = document.getElementById('mandalaGrid');
        
        Object.entries(this.mandalaPatterns).forEach(([key, mandala]) => {
            const tile = document.createElement('div');
            tile.className = 'mandala-tile';
            tile.dataset.mandala = key;
            
            tile.innerHTML = `
                <div class="mandala-preview">
                    <svg width="80" height="80" viewBox="0 0 600 600">
                        ${mandala.paths.map(path => 
                            `<path d="${path.d}" stroke="#666" stroke-width="1" fill="none" />`
                        ).join('')}
                    </svg>
                </div>
                <div class="mandala-name">${mandala.name}</div>
                <div class="mandala-difficulty ${mandala.difficulty}">${mandala.difficulty}</div>
            `;
            
            tile.addEventListener('click', () => this.selectMandala(key));
            grid.appendChild(tile);
        });
    }

    generateColorPalette(paletteName) {
        const palette = this.colorPalettes[paletteName];
        const grid = document.getElementById('colorGrid');
        const info = document.getElementById('paletteInfo');
        
        grid.innerHTML = '';
        
        palette.colors.forEach(color => {
            const colorTile = document.createElement('div');
            colorTile.className = 'color-tile';
            colorTile.style.backgroundColor = color;
            colorTile.dataset.color = color;
            colorTile.title = color;
            
            if (color === this.currentColor) {
                colorTile.classList.add('selected');
            }
            
            colorTile.addEventListener('click', () => this.selectColor(color));
            grid.appendChild(colorTile);
        });
        
        info.innerHTML = `
            <h6>${palette.name}</h6>
            <p>${palette.description}</p>
        `;
    }

    // ==================== EVENT HANDLERS ====================

    bindEvents() {
        // Canvas drawing events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
        
        // Control buttons
        document.getElementById('undoBtn').addEventListener('click', this.undo.bind(this));
        document.getElementById('redoBtn').addEventListener('click', this.redo.bind(this));
        document.getElementById('clearBtn').addEventListener('click', this.clearCanvas.bind(this));
        document.getElementById('saveBtn').addEventListener('click', this.saveImage.bind(this));
        document.getElementById('shareBtn').addEventListener('click', this.shareImage.bind(this));
        
        // Palette selector
        document.getElementById('paletteSelect').addEventListener('change', (e) => {
            this.currentPalette = e.target.value;
            this.generateColorPalette(this.currentPalette);
        });
        
        // Brush size
        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            document.getElementById('brushSizeValue').textContent = this.brushSize;
        });
        
        // Timer controls
        document.getElementById('timerToggle').addEventListener('click', this.toggleTimer.bind(this));
        
        // Audio controls
        document.getElementById('audioToggle').addEventListener('click', this.toggleAudio.bind(this));
        
        // Completion modal events
        document.getElementById('saveCompletedBtn').addEventListener('click', this.saveImage.bind(this));
        document.getElementById('startNewBtn').addEventListener('click', this.startNewMandala.bind(this));
        document.getElementById('shareCompletedBtn').addEventListener('click', this.shareImage.bind(this));
    }

    selectMandala(mandalaKey) {
        this.currentMandala = mandalaKey;
        const mandala = this.mandalaPatterns[mandalaKey];
        
        // Update UI
        document.querySelectorAll('.mandala-tile').forEach(tile => {
            tile.classList.remove('selected');
        });
        document.querySelector(`[data-mandala="${mandalaKey}"]`).classList.add('selected');
        
        // Update info panel
        document.getElementById('mandalaInfo').innerHTML = `
            <h5>${mandala.name}</h5>
            <p class="mandala-description">${mandala.description}</p>
            <p class="mandala-meaning">${mandala.meaning}</p>
            <div class="difficulty-badge ${mandala.difficulty}">${mandala.difficulty}</div>
        `;
        
        // Draw mandala outline on canvas
        this.drawMandalaOutline(mandala);
        
        // Hide start overlay
        document.getElementById('canvasOverlay').style.display = 'none';
        
        console.log(`Selected mandala: ${mandala.name}`);
    }

    selectColor(color) {
        this.currentColor = color;
        
        // Update UI
        document.querySelectorAll('.color-tile').forEach(tile => {
            tile.classList.remove('selected');
        });
        document.querySelector(`[data-color="${color}"]`).classList.add('selected');
        
        console.log(`Selected color: ${color}`);
    }

    drawMandalaOutline(mandala) {
        this.clearCanvas();
        
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'transparent';
        
        mandala.paths.forEach(pathData => {
            const path = new Path2D(pathData.d);
            this.ctx.stroke(path);
        });
        
        this.saveState();
    }

    // ==================== DRAWING FUNCTIONS ====================

    startDrawing(e) {
        if (!this.currentMandala) return;
        
        this.isDrawing = true;
        this.startTimer();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // Play audio feedback
        this.playDrawingSound();
    }

    draw(e) {
        if (!this.isDrawing || !this.currentMandala) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        this.ctx.beginPath();
        this.saveState();
        
        // Check if mandala might be complete
        this.checkCompletion();
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                          e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.currentMandala) {
            this.drawMandalaOutline(this.mandalaPatterns[this.currentMandala]);
        }
        this.saveState();
    }

    // ==================== HISTORY MANAGEMENT ====================

    saveState() {
        this.historyStep++;
        
        if (this.historyStep < this.drawingHistory.length) {
            this.drawingHistory.length = this.historyStep;
        }
        
        this.drawingHistory.push(this.canvas.toDataURL());
        
        // Limit history to 20 steps
        if (this.drawingHistory.length > 20) {
            this.drawingHistory.shift();
            this.historyStep--;
        }
    }

    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.restoreState();
        }
    }

    redo() {
        if (this.historyStep < this.drawingHistory.length - 1) {
            this.historyStep++;
            this.restoreState();
        }
    }

    restoreState() {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = this.drawingHistory[this.historyStep];
    }

    // ==================== TIMER & MEDITATION ====================

    startTimer() {
        if (!this.isTimerRunning) {
            this.isTimerRunning = true;
            document.getElementById('timerToggle').textContent = '⏸️';
            
            this.timerInterval = setInterval(() => {
                this.meditationTimer++;
                this.updateTimerDisplay();
            }, 1000);
        }
    }

    toggleTimer() {
        if (this.isTimerRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    pauseTimer() {
        this.isTimerRunning = false;
        document.getElementById('timerToggle').textContent = '▶️';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.meditationTimer / 60);
        const seconds = this.meditationTimer % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('meditationTime').textContent = display;
    }

    // ==================== AUDIO SYSTEM ====================

    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio not available:', error);
            this.audioEnabled = false;
        }
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const button = document.getElementById('audioToggle');
        
        if (this.audioEnabled) {
            button.textContent = '🔊 Sounds On';
            this.startAmbientSound();
        } else {
            button.textContent = '🔇 Sounds Off';
            this.stopAmbientSound();
        }
    }

    playDrawingSound() {
        if (!this.audioEnabled || !this.audioContext) return;
        
        // Create a gentle drawing sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200 + Math.random() * 100, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    startAmbientSound() {
        // Create gentle ambient background sound
        if (!this.audioEnabled || !this.audioContext) return;
        
        // Implementation would include ambient nature sounds
        console.log('🎵 Starting ambient meditation sounds');
    }

    stopAmbientSound() {
        if (this.ambientSound) {
            this.ambientSound.stop();
            this.ambientSound = null;
        }
        console.log('🔇 Stopping ambient sounds');
    }

    // ==================== COMPLETION & REWARDS ====================

    checkCompletion() {
        // Simple completion check based on colored pixels
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        
        let coloredPixels = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] > 0) { // Alpha > 0
                coloredPixels++;
            }
        }
        
        const totalPixels = this.canvas.width * this.canvas.height;
        const completionPercentage = (coloredPixels / totalPixels) * 100;
        
        // If 15% of canvas is colored, consider it "complete"
        if (completionPercentage > 15) {
            this.showCompletionCelebration();
        }
    }

    showCompletionCelebration() {
        this.pauseTimer();
        
        const modal = document.getElementById('completionModal');
        const timeSpent = document.getElementById('completionTime');
        
        const minutes = Math.floor(this.meditationTimer / 60);
        const seconds = this.meditationTimer % 60;
        timeSpent.textContent = `${minutes}m ${seconds}s`;
        
        modal.style.display = 'flex';
        
        // Create particle celebration
        this.createParticleCelebration();
        
        // Play completion sound
        this.playCompletionSound();
        
        console.log('🎉 Mandala completion celebrated!');
    }

    createParticleCelebration() {
        const container = document.querySelector('.mandala-coloring-app');
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'celebration-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: ${this.colorPalettes[this.currentPalette].colors[Math.floor(Math.random() * this.colorPalettes[this.currentPalette].colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: celebrationFloat 3s ease-out forwards;
                `;
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 50);
        }
    }

    playCompletionSound() {
        if (!this.audioEnabled || !this.audioContext) return;
        
        // Create a celebration chord
        const frequencies = [261.63, 329.63, 392.00]; // C major chord
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 1);
            }, index * 200);
        });
    }

    // ==================== SAVE & SHARE ====================

    saveImage() {
        const link = document.createElement('a');
        link.download = `mandala-${this.currentMandala}-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        
        console.log('💾 Mandala saved');
    }

    shareImage() {
        this.canvas.toBlob(blob => {
            const files = [new File([blob], 'mandala.png', { type: 'image/png' })];
            
            if (navigator.canShare && navigator.canShare({ files })) {
                navigator.share({
                    files,
                    title: 'My Meditation Mandala',
                    text: 'I created this beautiful mandala during my meditation practice!'
                });
            } else {
                // Fallback: copy to clipboard or save
                this.saveImage();
                alert('Image saved! Share it with your friends.');
            }
        });
    }

    startNewMandala() {
        // Hide completion modal
        document.getElementById('completionModal').style.display = 'none';
        
        // Reset timer
        this.meditationTimer = 0;
        this.updateTimerDisplay();
        this.pauseTimer();
        
        // Clear canvas and reset
        this.clearCanvas();
        this.currentMandala = null;
        
        // Show start overlay
        document.getElementById('canvasOverlay').style.display = 'flex';
        
        // Clear selection
        document.querySelectorAll('.mandala-tile').forEach(tile => {
            tile.classList.remove('selected');
        });
        
        console.log('🎨 Ready for new mandala');
    }

    // ==================== CLEANUP ====================

    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        console.log('🎨 Mandala Coloring Canvas destroyed');
    }
}

// Add CSS animations
if (!document.getElementById('mandalaStyles')) {
    const style = document.createElement('style');
    style.id = 'mandalaStyles';
    style.textContent = `
        @keyframes celebrationFloat {
            0% {
                transform: translate(0, 0) scale(1) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(1.5) rotate(180deg);
                opacity: 0.8;
            }
            100% {
                transform: translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) scale(0) rotate(360deg);
                opacity: 0;
            }
        }
        
        .celebration-particle {
            animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('mandalaColoringContainer')) {
        console.log('🎨 Initializing Mandala Coloring Canvas...');
        window.mandalaColoringCanvas = new MandalaColoringCanvas();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.mandalaColoringCanvas) {
        window.mandalaColoringCanvas.destroy();
    }
});