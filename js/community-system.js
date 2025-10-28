/**
 * Divine Temple Community System - Phase 10: Community Integration
 * Real-time spiritual community platform with sacred connections
 */

class DivineTempleComms {
    constructor() {
        this.socket = null;
        this.userId = this.generateUserId();
        this.userName = this.getUserName();
        this.currentRoom = null;
        this.activeConnections = new Map();
        this.communityFeatures = {
            meditationRooms: true,
            sacredCircles: true,
            energySharing: true,
            groupSessions: true,
            wisdomExchange: true,
            healingCircles: true
        };
        
        this.init();
    }
    
    init() {
        console.log('👥 Initializing Divine Temple Community System Phase 10...');
        this.setupCommunityInterface();
        this.initializeWebSocket();
        this.setupPresenceSystem();
        this.createCommunityHub();
    }
    
    generateUserId() {
        let userId = localStorage.getItem('divine-temple-user-id');
        if (!userId) {
            userId = 'soul_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('divine-temple-user-id', userId);
        }
        return userId;
    }
    
    getUserName() {
        let userName = localStorage.getItem('divine-temple-user-name');
        if (!userName) {
            const spiritualNames = [
                'Seeker of Light', 'Divine Wanderer', 'Sacred Soul', 'Cosmic Traveler',
                'Mystic Heart', 'Awakened Spirit', 'Celestial Being', 'Universal Love',
                'Radiant Soul', 'Infinite Wisdom', 'Sacred Journey', 'Divine Essence'
            ];
            userName = spiritualNames[Math.floor(Math.random() * spiritualNames.length)];
            localStorage.setItem('divine-temple-user-name', userName);
        }
        return userName;
    }
    
    setupCommunityInterface() {
        // Create floating community hub
        const communityHub = document.createElement('div');
        communityHub.className = 'community-hub';
        communityHub.innerHTML = `
            <div class="community-toggle" onclick="divineComms.toggleCommunityPanel()">
                <div class="community-icon">👥</div>
                <div class="online-indicator">
                    <div class="pulse-ring"></div>
                    <div class="pulse-dot"></div>
                </div>
            </div>
            
            <div class="community-panel" id="community-panel">
                <div class="community-header">
                    <h3>🏛️ Sacred Community</h3>
                    <div class="user-info">
                        <span class="user-name">${this.userName}</span>
                        <button class="edit-name-btn" onclick="divineComms.editUserName()">✏️</button>
                    </div>
                    <button class="close-community" onclick="divineComms.closeCommunityPanel()">×</button>
                </div>
                
                <div class="community-tabs">
                    <button class="tab-btn active" data-tab="rooms">🧘 Sacred Rooms</button>
                    <button class="tab-btn" data-tab="circles">🔮 Wisdom Circles</button>
                    <button class="tab-btn" data-tab="members">👥 Divine Souls</button>
                </div>
                
                <div class="community-content">
                    <div class="tab-content active" id="rooms-tab">
                        <div class="rooms-list">
                            <div class="room-item" data-room="meditation-sanctuary">
                                <div class="room-icon">🧘‍♀️</div>
                                <div class="room-info">
                                    <div class="room-name">Meditation Sanctuary</div>
                                    <div class="room-desc">Silent practice together</div>
                                    <div class="room-members">0 souls present</div>
                                </div>
                                <button class="join-room-btn" onclick="divineComms.joinRoom('meditation-sanctuary')">Join</button>
                            </div>
                            
                            <div class="room-item" data-room="chakra-healing">
                                <div class="room-icon">🌈</div>
                                <div class="room-info">
                                    <div class="room-name">Chakra Healing Circle</div>
                                    <div class="room-desc">Energy healing together</div>
                                    <div class="room-members">0 souls present</div>
                                </div>
                                <button class="join-room-btn" onclick="divineComms.joinRoom('chakra-healing')">Join</button>
                            </div>
                            
                            <div class="room-item" data-room="oracle-sharing">
                                <div class="room-icon">🔮</div>
                                <div class="room-info">
                                    <div class="room-name">Oracle Wisdom Sharing</div>
                                    <div class="room-desc">Share divine insights</div>
                                    <div class="room-members">0 souls present</div>
                                </div>
                                <button class="join-room-btn" onclick="divineComms.joinRoom('oracle-sharing')">Join</button>
                            </div>
                            
                            <div class="room-item" data-room="manifestation-circle">
                                <div class="room-icon">✨</div>
                                <div class="room-info">
                                    <div class="room-name">Manifestation Circle</div>
                                    <div class="room-desc">Co-create with intention</div>
                                    <div class="room-members">0 souls present</div>
                                </div>
                                <button class="join-room-btn" onclick="divineComms.joinRoom('manifestation-circle')">Join</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="circles-tab">
                        <div class="circles-list">
                            <div class="wisdom-sharing">
                                <h4>💫 Share Your Wisdom</h4>
                                <textarea class="wisdom-input" placeholder="Share an insight, affirmation, or blessing with the community..."></textarea>
                                <button class="share-wisdom-btn" onclick="divineComms.shareWisdom()">✨ Share Light</button>
                            </div>
                            <div class="wisdom-feed" id="wisdom-feed">
                                <!-- Wisdom posts will appear here -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="members-tab">
                        <div class="members-list" id="members-list">
                            <!-- Online members will appear here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(communityHub);
        this.setupTabNavigation();
    }
    
    setupTabNavigation() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }
    
    initializeWebSocket() {
        // Simulated WebSocket for demonstration
        // In production, this would connect to a real WebSocket server
        console.log('🌐 Connecting to Divine Temple Community Server...');
        
        // Simulate connection
        setTimeout(() => {
            this.onWebSocketConnected();
        }, 1000);
        
        // Simulate periodic updates
        setInterval(() => {
            this.simulateRoomUpdates();
        }, 10000);
    }
    
    onWebSocketConnected() {
        console.log('✨ Connected to Sacred Community Network');
        this.updateConnectionStatus(true);
        this.joinCommunityPresence();
        this.loadInitialData();
    }
    
    updateConnectionStatus(connected) {
        const indicator = document.querySelector('.online-indicator');
        if (connected) {
            indicator.classList.add('connected');
            indicator.title = 'Connected to Sacred Community';
        } else {
            indicator.classList.remove('connected');
            indicator.title = 'Connecting to Sacred Community...';
        }
    }
    
    joinCommunityPresence() {
        // Add user to online presence
        this.updateMembersList();
        this.showCommunityNotification('🌟 Welcome to the Sacred Community!');
    }
    
    loadInitialData() {
        // Load recent wisdom posts
        this.loadWisdomFeed();
        
        // Update room member counts
        this.updateRoomCounts();
    }
    
    loadWisdomFeed() {
        const wisdomPosts = [
            {
                author: 'Luminous Guide',
                message: 'In stillness, we find the infinite wisdom that has always been within us. 🌟',
                timestamp: new Date(Date.now() - 1800000),
                reactions: { light: 12, gratitude: 8, wisdom: 15 }
            },
            {
                author: 'Sacred Healer',
                message: 'Every breath is a gift, every heartbeat a prayer. Honor this moment. 🙏',
                timestamp: new Date(Date.now() - 3600000),
                reactions: { light: 8, gratitude: 12, wisdom: 6 }
            },
            {
                author: 'Cosmic Wanderer',
                message: 'The universe is not only stranger than we imagine, it is stranger than we can imagine. Embrace the mystery. ✨',
                timestamp: new Date(Date.now() - 7200000),
                reactions: { light: 20, gratitude: 15, wisdom: 25 }
            }
        ];
        
        const feed = document.getElementById('wisdom-feed');
        feed.innerHTML = wisdomPosts.map(post => this.createWisdomPost(post)).join('');
    }
    
    createWisdomPost(post) {
        return `
            <div class="wisdom-post">
                <div class="post-header">
                    <div class="post-author">${post.author}</div>
                    <div class="post-time">${this.formatRelativeTime(post.timestamp)}</div>
                </div>
                <div class="post-message">${post.message}</div>
                <div class="post-reactions">
                    <button class="reaction-btn" data-reaction="light">
                        🌟 ${post.reactions.light}
                    </button>
                    <button class="reaction-btn" data-reaction="gratitude">
                        🙏 ${post.reactions.gratitude}
                    </button>
                    <button class="reaction-btn" data-reaction="wisdom">
                        💫 ${post.reactions.wisdom}
                    </button>
                </div>
            </div>
        `;
    }
    
    formatRelativeTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        
        if (minutes < 60) {
            return `${minutes}m ago`;
        } else {
            return `${hours}h ago`;
        }
    }
    
    updateRoomCounts() {
        const roomCounts = {
            'meditation-sanctuary': Math.floor(Math.random() * 8) + 1,
            'chakra-healing': Math.floor(Math.random() * 6) + 1,
            'oracle-sharing': Math.floor(Math.random() * 5) + 1,
            'manifestation-circle': Math.floor(Math.random() * 7) + 1
        };
        
        Object.entries(roomCounts).forEach(([roomId, count]) => {
            const roomElement = document.querySelector(`[data-room="${roomId}"] .room-members`);
            if (roomElement) {
                roomElement.textContent = `${count} soul${count !== 1 ? 's' : ''} present`;
            }
        });
    }
    
    simulateRoomUpdates() {
        // Simulate room member count changes
        this.updateRoomCounts();
        
        // Occasionally add new wisdom posts
        if (Math.random() < 0.3) {
            this.addRandomWisdomPost();
        }
    }
    
    addRandomWisdomPost() {
        const wisdomMessages = [
            'The light you seek is already within you. Trust your inner knowing. ✨',
            'Today is a perfect day for miracles and magical moments. 🌟',
            'Gratitude transforms ordinary moments into sacred blessings. 🙏',
            'Your soul knows the way. Listen to its gentle whispers. 💫',
            'In unity, we find strength. In diversity, we find beauty. 🌈'
        ];
        
        const authors = [
            'Mystic Sage', 'Divine Light', 'Sacred Heart', 'Cosmic Truth',
            'Radiant Soul', 'Eternal Wisdom', 'Celestial Guide'
        ];
        
        const newPost = {
            author: authors[Math.floor(Math.random() * authors.length)],
            message: wisdomMessages[Math.floor(Math.random() * wisdomMessages.length)],
            timestamp: new Date(),
            reactions: { light: 0, gratitude: 0, wisdom: 0 }
        };
        
        const feed = document.getElementById('wisdom-feed');
        const postElement = document.createElement('div');
        postElement.innerHTML = this.createWisdomPost(newPost);
        postElement.style.animation = 'fadeInUp 0.6s ease-out';
        feed.insertBefore(postElement.firstElementChild, feed.firstChild);
        
        // Show notification
        this.showCommunityNotification(`💫 New wisdom shared by ${newPost.author}`);
    }
    
    updateMembersList() {
        const onlineMembers = [
            { name: this.userName, status: 'online', activity: 'In Sacred Space' },
            { name: 'Luminous Guide', status: 'meditating', activity: 'Meditation Sanctuary' },
            { name: 'Sacred Healer', status: 'online', activity: 'Chakra Healing Circle' },
            { name: 'Cosmic Wanderer', status: 'sharing', activity: 'Oracle Wisdom Sharing' },
            { name: 'Divine Light', status: 'manifesting', activity: 'Manifestation Circle' }
        ];
        
        const membersList = document.getElementById('members-list');
        membersList.innerHTML = onlineMembers.map(member => `
            <div class="member-item ${member.name === this.userName ? 'current-user' : ''}">
                <div class="member-avatar">
                    <div class="avatar-icon">${this.getAvatarIcon(member.name)}</div>
                    <div class="status-indicator ${member.status}"></div>
                </div>
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-activity">${member.activity}</div>
                </div>
                ${member.name !== this.userName ? `
                    <button class="connect-btn" onclick="divineComms.connectToMember('${member.name}')">
                        💫 Connect
                    </button>
                ` : ''}
            </div>
        `).join('');
    }
    
    getAvatarIcon(name) {
        const icons = ['🌟', '🔮', '🧘‍♀️', '🧘‍♂️', '✨', '💫', '🌙', '☀️', '🦋', '🌈'];
        const index = name.length % icons.length;
        return icons[index];
    }
    
    toggleCommunityPanel() {
        const panel = document.getElementById('community-panel');
        panel.classList.toggle('community-panel-open');
    }
    
    closeCommunityPanel() {
        const panel = document.getElementById('community-panel');
        panel.classList.remove('community-panel-open');
    }
    
    editUserName() {
        const newName = prompt('Enter your sacred name:', this.userName);
        if (newName && newName.trim()) {
            this.userName = newName.trim();
            localStorage.setItem('divine-temple-user-name', this.userName);
            document.querySelector('.user-name').textContent = this.userName;
            this.updateMembersList();
            this.showCommunityNotification(`✨ Your sacred name is now: ${this.userName}`);
        }
    }
    
    joinRoom(roomId) {
        if (this.currentRoom === roomId) {
            this.showCommunityNotification('🏛️ You are already in this sacred space');
            return;
        }
        
        this.currentRoom = roomId;
        this.showRoomInterface(roomId);
        this.showCommunityNotification(`🌟 Joined ${this.getRoomName(roomId)}`);
    }
    
    getRoomName(roomId) {
        const roomNames = {
            'meditation-sanctuary': 'Meditation Sanctuary',
            'chakra-healing': 'Chakra Healing Circle',
            'oracle-sharing': 'Oracle Wisdom Sharing',
            'manifestation-circle': 'Manifestation Circle'
        };
        return roomNames[roomId] || roomId;
    }
    
    showRoomInterface(roomId) {
        // Create room interface overlay
        const roomOverlay = document.createElement('div');
        roomOverlay.className = 'room-overlay';
        roomOverlay.innerHTML = `
            <div class="room-interface">
                <div class="room-header">
                    <h3>🏛️ ${this.getRoomName(roomId)}</h3>
                    <button class="leave-room-btn" onclick="divineComms.leaveRoom()">Leave Sacred Space</button>
                </div>
                
                <div class="room-content">
                    <div class="room-participants">
                        <h4>👥 Present Souls</h4>
                        <div class="participants-list" id="participants-list">
                            <!-- Participants will be added here -->
                        </div>
                    </div>
                    
                    <div class="room-activity">
                        <div class="activity-feed" id="activity-feed">
                            <!-- Room activities will appear here -->
                        </div>
                        
                        <div class="room-controls">
                            ${this.getRoomControls(roomId)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(roomOverlay);
        this.initializeRoomFeatures(roomId);
    }
    
    getRoomControls(roomId) {
        switch (roomId) {
            case 'meditation-sanctuary':
                return `
                    <button class="room-action-btn" onclick="divineComms.startGroupMeditation()">
                        🧘‍♀️ Start Group Meditation
                    </button>
                    <button class="room-action-btn" onclick="divineComms.sendMeditationBell()">
                        🔔 Ring Sacred Bell
                    </button>
                `;
            case 'chakra-healing':
                return `
                    <button class="room-action-btn" onclick="divineComms.shareEnergyHealing()">
                        🌈 Share Healing Energy
                    </button>
                    <button class="room-action-btn" onclick="divineComms.synchronizeChakras()">
                        ⚡ Synchronize Chakras
                    </button>
                `;
            case 'oracle-sharing':
                return `
                    <button class="room-action-btn" onclick="divineComms.shareOracleReading()">
                        🔮 Share Oracle Reading
                    </button>
                    <button class="room-action-btn" onclick="divineComms.requestGuidance()">
                        💫 Request Guidance
                    </button>
                `;
            case 'manifestation-circle':
                return `
                    <button class="room-action-btn" onclick="divineComms.shareIntention()">
                        ✨ Share Intention
                    </button>
                    <button class="room-action-btn" onclick="divineComms.amplifyEnergy()">
                        🌟 Amplify Collective Energy
                    </button>
                `;
            default:
                return '';
        }
    }
    
    initializeRoomFeatures(roomId) {
        this.addRoomMessage('system', `Welcome to ${this.getRoomName(roomId)} 🌟`);
        this.addRoomMessage('system', `${this.userName} has joined the sacred space ✨`);
        
        // Simulate other participants
        setTimeout(() => {
            this.simulateRoomActivity(roomId);
        }, 2000);
    }
    
    simulateRoomActivity(roomId) {
        const activities = {
            'meditation-sanctuary': [
                'Sacred Healer sent peaceful vibrations 🕯️',
                'Luminous Guide rang the meditation bell 🔔',
                'Cosmic Wanderer shared a moment of gratitude 🙏'
            ],
            'chakra-healing': [
                'Divine Light shared healing energy for the heart chakra 💚',
                'Mystic Sage aligned their root chakra 🔴',
                'Sacred Healer opened their third eye 💙'
            ],
            'oracle-sharing': [
                'Cosmic Wanderer drew The Star card ⭐',
                'Luminous Guide shared insight about new beginnings 🌱',
                'Divine Light requested guidance about their path 🛤️'
            ],
            'manifestation-circle': [
                'Sacred Healer set intention for global healing 🌍',
                'Mystic Sage amplified energy for abundance 💰',
                'Divine Light manifested love and compassion 💕'
            ]
        };
        
        const roomActivities = activities[roomId] || [];
        roomActivities.forEach((activity, index) => {
            setTimeout(() => {
                this.addRoomMessage('activity', activity);
            }, (index + 1) * 3000);
        });
    }
    
    addRoomMessage(type, message) {
        const feed = document.getElementById('activity-feed');
        if (!feed) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `room-message ${type}`;
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        feed.appendChild(messageElement);
        feed.scrollTop = feed.scrollHeight;
    }
    
    leaveRoom() {
        const overlay = document.querySelector('.room-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.currentRoom = null;
        this.showCommunityNotification('🌟 Left the sacred space. Your light continues to shine.');
    }
    
    shareWisdom() {
        const textarea = document.querySelector('.wisdom-input');
        const message = textarea.value.trim();
        
        if (!message) {
            this.showCommunityNotification('⚠️ Please enter your wisdom to share');
            return;
        }
        
        const newPost = {
            author: this.userName,
            message: message,
            timestamp: new Date(),
            reactions: { light: 0, gratitude: 0, wisdom: 0 }
        };
        
        const feed = document.getElementById('wisdom-feed');
        const postElement = document.createElement('div');
        postElement.innerHTML = this.createWisdomPost(newPost);
        postElement.style.animation = 'fadeInUp 0.6s ease-out';
        feed.insertBefore(postElement.firstElementChild, feed.firstChild);
        
        textarea.value = '';
        this.showCommunityNotification('✨ Your wisdom has been shared with the community');
    }
    
    showCommunityNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'community-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Room action methods
    startGroupMeditation() {
        this.addRoomMessage('action', `${this.userName} started a group meditation session 🧘‍♀️`);
        this.showCommunityNotification('🧘‍♀️ Group meditation session started');
    }
    
    sendMeditationBell() {
        this.addRoomMessage('action', `${this.userName} rang the sacred bell 🔔`);
        this.showCommunityNotification('🔔 Sacred bell resonates through the sanctuary');
    }
    
    shareEnergyHealing() {
        this.addRoomMessage('action', `${this.userName} shared healing energy 🌈`);
        this.showCommunityNotification('🌈 Healing energy flows through the circle');
    }
    
    synchronizeChakras() {
        this.addRoomMessage('action', `${this.userName} synchronized chakras with the group ⚡`);
        this.showCommunityNotification('⚡ Chakras synchronized with divine frequency');
    }
    
    shareOracleReading() {
        const cards = ['The Star', 'The Moon', 'The Sun', 'The High Priestess', 'The Hermit'];
        const card = cards[Math.floor(Math.random() * cards.length)];
        this.addRoomMessage('action', `${this.userName} shared oracle reading: ${card} ⭐`);
        this.showCommunityNotification(`🔮 Oracle reading shared: ${card}`);
    }
    
    requestGuidance() {
        this.addRoomMessage('action', `${this.userName} requests divine guidance 💫`);
        this.showCommunityNotification('💫 Your request for guidance has been sent to the universe');
    }
    
    shareIntention() {
        this.addRoomMessage('action', `${this.userName} shared a sacred intention ✨`);
        this.showCommunityNotification('✨ Your intention has been added to the collective energy');
    }
    
    amplifyEnergy() {
        this.addRoomMessage('action', `${this.userName} amplified the collective energy 🌟`);
        this.showCommunityNotification('🌟 Collective energy amplified! Feel the power of unity.');
    }
    
    connectToMember(memberName) {
        this.showCommunityNotification(`💫 Divine connection request sent to ${memberName}`);
    }
}

// Initialize community system
const divineComms = new DivineTempleComms();

// Export for global access
window.divineComms = divineComms;

console.log('👥 Divine Temple Community System Phase 10 loaded successfully! ✨');