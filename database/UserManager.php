<?php
require_once 'db_config.php';

/**
 * User Management System for Divine Temple
 * Sacred guardian of member accounts and spiritual journeys
 */
class UserManager {
    private $db;
    
    public function __construct() {
        $this->db = DB::getInstance();
    }
    
    /**
     * Register a new member to the Divine Temple
     */
    public function registerUser($userData) {
        try {
            // Validate required fields
            $required = ['username', 'email', 'password', 'full_name'];
            foreach ($required as $field) {
                if (empty($userData[$field])) {
                    throw new Exception("Sacred field '{$field}' is required for your spiritual journey.");
                }
            }
            
            // Check if user already exists
            if ($this->userExists($userData['email'], $userData['username'])) {
                throw new Exception("A soul with this email or username already walks among us.");
            }
            
            // Hash password with sacred encryption
            $passwordHash = password_hash($userData['password'], PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost' => 4,
                'threads' => 3
            ]);
            
            // Generate verification token
            $verificationToken = bin2hex(random_bytes(32));
            
            // Insert new user
            $sql = "INSERT INTO users (username, email, password_hash, full_name, spiritual_name, 
                                     birth_date, spiritual_path, verification_token) 
                    VALUES (:username, :email, :password_hash, :full_name, :spiritual_name, 
                           :birth_date, :spiritual_path, :verification_token)";
            
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([
                'username' => $userData['username'],
                'email' => strtolower($userData['email']),
                'password_hash' => $passwordHash,
                'full_name' => $userData['full_name'],
                'spiritual_name' => $userData['spiritual_name'] ?? '',
                'birth_date' => $userData['birth_date'] ?? null,
                'spiritual_path' => $userData['spiritual_path'] ?? 'Seeker',
                'verification_token' => $verificationToken
            ]);
            
            if ($result) {
                $userId = $this->db->lastInsertId();
                
                // Create default preferences
                $this->createDefaultPreferences($userId);
                
                return [
                    'success' => true,
                    'user_id' => $userId,
                    'verification_token' => $verificationToken,
                    'message' => 'Welcome to the Divine Temple! Your spiritual journey begins now.'
                ];
            }
            
            throw new Exception("Failed to create your sacred account. Please try again.");
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Authenticate user login
     */
    public function loginUser($email, $password, $rememberMe = false) {
        try {
            // Find user by email
            $sql = "SELECT id, username, email, password_hash, full_name, spiritual_name, 
                           spiritual_path, is_verified, is_active, last_login 
                    FROM users WHERE email = :email";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['email' => strtolower($email)]);
            $user = $stmt->fetch();
            
            if (!$user) {
                throw new Exception("The Divine Temple does not recognize this soul.");
            }
            
            if (!$user['is_active']) {
                throw new Exception("Your account has been temporarily suspended from the sacred realm.");
            }
            
            if (!$user['is_verified']) {
                throw new Exception("Please verify your email address before entering the Divine Temple. Check your inbox for the verification email.");
            }
            
            // Verify password
            if (!password_verify($password, $user['password_hash'])) {
                throw new Exception("The sacred password does not align with your soul's essence.");
            }
            
            // Update last login
            $this->updateLastLogin($user['id']);
            
            // Create session
            $sessionData = $this->createSession($user['id'], $rememberMe);
            
            return [
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'full_name' => $user['full_name'],
                    'spiritual_name' => $user['spiritual_name'],
                    'spiritual_path' => $user['spiritual_path'],
                    'is_verified' => $user['is_verified']
                ],
                'session' => $sessionData,
                'message' => "Welcome back to the Divine Temple, {$user['spiritual_name']}!"
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Create secure session for user
     */
    private function createSession($userId, $rememberMe = false) {
        $sessionToken = bin2hex(random_bytes(64));
        $csrfToken = bin2hex(random_bytes(32));
        
        // Set expiration (24 hours or 30 days if remember me)
        $expirationHours = $rememberMe ? 720 : 24; // 30 days or 24 hours
        $expiresAt = date('Y-m-d H:i:s', strtotime("+{$expirationHours} hours"));
        
        $sql = "INSERT INTO user_sessions (user_id, session_token, csrf_token, ip_address, 
                                          user_agent, expires_at) 
                VALUES (:user_id, :session_token, :csrf_token, :ip_address, :user_agent, :expires_at)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'user_id' => $userId,
            'session_token' => $sessionToken,
            'csrf_token' => $csrfToken,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'expires_at' => $expiresAt
        ]);
        
        return [
            'session_token' => $sessionToken,
            'csrf_token' => $csrfToken,
            'expires_at' => $expiresAt
        ];
    }
    
    /**
     * Validate user session
     */
    public function validateSession($sessionToken) {
        $sql = "SELECT s.user_id, s.csrf_token, s.expires_at, s.last_activity,
                       u.username, u.email, u.full_name, u.spiritual_name, u.spiritual_path
                FROM user_sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.session_token = :session_token 
                AND s.is_active = 1 
                AND s.expires_at > NOW()";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['session_token' => $sessionToken]);
        $session = $stmt->fetch();
        
        if ($session) {
            // Update last activity
            $updateSql = "UPDATE user_sessions SET last_activity = NOW() WHERE session_token = :session_token";
            $updateStmt = $this->db->prepare($updateSql);
            $updateStmt->execute(['session_token' => $sessionToken]);
            
            return [
                'valid' => true,
                'user' => [
                    'id' => $session['user_id'],
                    'username' => $session['username'],
                    'email' => $session['email'],
                    'full_name' => $session['full_name'],
                    'spiritual_name' => $session['spiritual_name'],
                    'spiritual_path' => $session['spiritual_path']
                ],
                'csrf_token' => $session['csrf_token']
            ];
        }
        
        return ['valid' => false];
    }
    
    /**
     * Logout user and invalidate session
     */
    public function logoutUser($sessionToken) {
        $sql = "UPDATE user_sessions SET is_active = 0 WHERE session_token = :session_token";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute(['session_token' => $sessionToken]);
    }
    
    /**
     * Verify user email with token
     */
    public function verifyEmail($token) {
        try {
            // Find user by verification token
            $sql = "SELECT id, username, email, full_name, spiritual_name, is_verified 
                    FROM users WHERE verification_token = :token AND is_active = 1";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['token' => $token]);
            $user = $stmt->fetch();
            
            if (!$user) {
                throw new Exception("Invalid or expired verification token");
            }
            
            if ($user['is_verified']) {
                throw new Exception("Account is already verified");
            }
            
            // Update user as verified and clear token
            $updateSql = "UPDATE users 
                         SET is_verified = 1, verification_token = NULL, updated_at = NOW() 
                         WHERE id = :user_id";
            
            $updateStmt = $this->db->prepare($updateSql);
            $result = $updateStmt->execute(['user_id' => $user['id']]);
            
            if ($result) {
                return [
                    'success' => true,
                    'message' => 'Your divine account has been successfully verified!',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'full_name' => $user['full_name'],
                        'spiritual_name' => $user['spiritual_name']
                    ]
                ];
            }
            
            throw new Exception("Failed to verify your account");
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Resend verification email
     */
    public function resendVerification($token = '', $email = '') {
        try {
            $sql = '';
            $params = [];
            
            if ($token) {
                $sql = "SELECT id, username, email, full_name, spiritual_name, is_verified 
                       FROM users WHERE verification_token = :token";
                $params = ['token' => $token];
            } else if ($email) {
                $sql = "SELECT id, username, email, full_name, spiritual_name, is_verified 
                       FROM users WHERE email = :email";
                $params = ['email' => strtolower($email)];
            } else {
                throw new Exception("Token or email is required");
            }
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $user = $stmt->fetch();
            
            if (!$user) {
                throw new Exception("User not found");
            }
            
            if ($user['is_verified']) {
                throw new Exception("Account is already verified");
            }
            
            // Generate new verification token
            $newToken = bin2hex(random_bytes(32));
            
            // Update user with new token
            $updateSql = "UPDATE users SET verification_token = :token WHERE id = :user_id";
            $updateStmt = $this->db->prepare($updateSql);
            $updateStmt->execute(['token' => $newToken, 'user_id' => $user['id']]);
            
            return [
                'success' => true,
                'message' => 'New verification email has been sent',
                'user' => [
                    'email' => $user['email'],
                    'full_name' => $user['full_name'],
                    'spiritual_name' => $user['spiritual_name']
                ],
                'new_token' => $newToken
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Check if user exists
     */
    private function userExists($email, $username) {
        $sql = "SELECT id FROM users WHERE email = :email OR username = :username";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['email' => strtolower($email), 'username' => $username]);
        return $stmt->fetch() !== false;
    }
    
    /**
     * Update last login timestamp
     */
    private function updateLastLogin($userId) {
        $sql = "UPDATE users SET last_login = NOW() WHERE id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['user_id' => $userId]);
    }
    
    /**
     * Create default preferences for new user
     */
    private function createDefaultPreferences($userId) {
        $sql = "INSERT INTO user_preferences (user_id) VALUES (:user_id)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['user_id' => $userId]);
    }
    
    /**
     * Get user preferences
     */
    public function getUserPreferences($userId) {
        $sql = "SELECT * FROM user_preferences WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetch();
    }
    
    /**
     * Update user preferences
     */
    public function updateUserPreferences($userId, $preferences) {
        $allowedFields = [
            'theme', 'card_back_design', 'reading_layout', 'preferred_reading_times',
            'meditation_reminders', 'daily_card_notifications', 'public_profile',
            'share_readings', 'email_notifications', 'reading_anniversary_reminders'
        ];
        
        $setClause = [];
        $params = ['user_id' => $userId];
        
        foreach ($preferences as $field => $value) {
            if (in_array($field, $allowedFields)) {
                $setClause[] = "{$field} = :{$field}";
                $params[$field] = $value;
            }
        }
        
        if (empty($setClause)) {
            return false;
        }
        
        $sql = "UPDATE user_preferences SET " . implode(', ', $setClause) . " WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }
}
?>