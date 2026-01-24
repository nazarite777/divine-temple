-- Divine Temple Database Schema
-- Sacred structure for the digital sanctuary

-- Users table for member profiles
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    spiritual_name VARCHAR(50),
    birth_date DATE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Spiritual Profile
    spiritual_path ENUM('Seeker', 'Practitioner', 'Adept', 'Master') DEFAULT 'Seeker',
    favorite_divination VARCHAR(50) DEFAULT 'Oracle Cards',
    meditation_experience ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Beginner',
    sacred_intentions TEXT,
    
    -- Account Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    verification_token VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_last_login (last_login)
);

-- Oracle Cards readings history
CREATE TABLE oracle_readings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    reading_type ENUM('Single', 'Three', 'Celtic Cross', 'Daily') NOT NULL,
    
    -- Reading Data
    cards_drawn JSON NOT NULL, -- Array of card objects with positions
    reading_question TEXT,
    reading_interpretation TEXT,
    personal_notes TEXT,
    
    -- Spiritual Context
    moon_phase VARCHAR(20),
    season VARCHAR(20),
    emotional_state VARCHAR(50),
    life_focus VARCHAR(100),
    
    -- Reading Metadata
    is_favorite BOOLEAN DEFAULT FALSE,
    accuracy_rating INT CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_readings (user_id, created_at),
    INDEX idx_reading_type (reading_type),
    INDEX idx_favorites (user_id, is_favorite)
);

-- Session management for secure authentication
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(128) UNIQUE NOT NULL,
    csrf_token VARCHAR(64) NOT NULL,
    
    -- Session Data
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_mobile BOOLEAN DEFAULT FALSE,
    
    -- Session Security
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_sessions (user_id, is_active),
    INDEX idx_expires (expires_at)
);

-- Card statistics for personal insights
CREATE TABLE card_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_name VARCHAR(100) NOT NULL,
    card_symbol VARCHAR(10) NOT NULL,
    
    -- Statistics
    times_drawn INT DEFAULT 1,
    times_in_position_1 INT DEFAULT 0,
    times_in_position_2 INT DEFAULT 0, 
    times_in_position_3 INT DEFAULT 0,
    times_in_position_center INT DEFAULT 0,
    
    -- Personal Connection
    personal_meaning TEXT,
    significance_notes TEXT,
    
    -- Timestamps
    first_drawn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_drawn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_card (user_id, card_name),
    INDEX idx_user_cards (user_id, times_drawn DESC)
);

-- Sacred journal entries for spiritual insights
CREATE TABLE sacred_journal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    reading_id INT NULL,
    
    -- Journal Entry
    title VARCHAR(200),
    content TEXT NOT NULL,
    entry_type ENUM('Reading Reflection', 'Spiritual Insight', 'Daily Practice', 'Dream Journal', 'Manifestation') DEFAULT 'Reading Reflection',
    
    -- Spiritual Context
    emotional_tone VARCHAR(50),
    spiritual_guidance TEXT,
    synchronicities TEXT,
    
    -- Privacy & Organization
    is_private BOOLEAN DEFAULT TRUE,
    tags JSON, -- Array of tags for organization
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reading_id) REFERENCES oracle_readings(id) ON DELETE SET NULL,
    INDEX idx_user_journal (user_id, created_at DESC),
    INDEX idx_entry_type (entry_type)
);

-- User preferences for personalization
CREATE TABLE user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- Interface Preferences
    theme VARCHAR(20) DEFAULT 'divine_gold',
    card_back_design VARCHAR(50) DEFAULT 'sacred_geometry',
    reading_layout VARCHAR(50) DEFAULT 'traditional',
    
    -- Spiritual Preferences
    preferred_reading_times JSON, -- Array of preferred times
    meditation_reminders BOOLEAN DEFAULT FALSE,
    daily_card_notifications BOOLEAN DEFAULT TRUE,
    
    -- Privacy Settings
    public_profile BOOLEAN DEFAULT FALSE,
    share_readings BOOLEAN DEFAULT FALSE,
    
    -- Notifications
    email_notifications BOOLEAN DEFAULT TRUE,
    reading_anniversary_reminders BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_prefs (user_id)
);

-- Sample data for testing
INSERT INTO users (username, email, password_hash, full_name, spiritual_name, spiritual_path) VALUES
('seeker_one', 'seeker@divine-temple.com', '$2y$12$dummy_hash_for_testing', 'Alexandra Moon', 'Luna', 'Seeker'),
('wise_sage', 'sage@divine-temple.com', '$2y$12$dummy_hash_for_testing', 'Marcus Star', 'Stellaris', 'Practitioner');

-- Insert default preferences for users
INSERT INTO user_preferences (user_id) SELECT id FROM users;