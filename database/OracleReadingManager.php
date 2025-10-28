<?php
require_once 'db_config.php';

/**
 * Oracle Cards Reading Manager
 * Sacred keeper of divine revelations and spiritual insights
 */
class OracleReadingManager {
    private $db;
    
    public function __construct() {
        $this->db = DB::getInstance();
    }
    
    /**
     * Save an Oracle Cards reading to the user's spiritual history
     */
    public function saveReading($userId, $readingData) {
        try {
            // Validate required data
            if (empty($readingData['reading_type']) || empty($readingData['cards_drawn'])) {
                throw new Exception("Sacred reading data is incomplete.");
            }
            
            $sql = "INSERT INTO oracle_readings (user_id, reading_type, cards_drawn, reading_question,
                                               reading_interpretation, personal_notes, moon_phase, 
                                               season, emotional_state, life_focus) 
                    VALUES (:user_id, :reading_type, :cards_drawn, :reading_question,
                           :reading_interpretation, :personal_notes, :moon_phase, 
                           :season, :emotional_state, :life_focus)";
            
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([
                'user_id' => $userId,
                'reading_type' => $readingData['reading_type'],
                'cards_drawn' => json_encode($readingData['cards_drawn']),
                'reading_question' => $readingData['reading_question'] ?? '',
                'reading_interpretation' => $readingData['reading_interpretation'] ?? '',
                'personal_notes' => $readingData['personal_notes'] ?? '',
                'moon_phase' => $readingData['moon_phase'] ?? $this->getCurrentMoonPhase(),
                'season' => $readingData['season'] ?? $this->getCurrentSeason(),
                'emotional_state' => $readingData['emotional_state'] ?? '',
                'life_focus' => $readingData['life_focus'] ?? ''
            ]);
            
            if ($result) {
                $readingId = $this->db->lastInsertId();
                
                // Update card statistics
                $this->updateCardStatistics($userId, $readingData['cards_drawn']);
                
                return [
                    'success' => true,
                    'reading_id' => $readingId,
                    'message' => 'Your sacred reading has been preserved in the divine archives.'
                ];
            }
            
            throw new Exception("Failed to save your spiritual revelation.");
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Get user's reading history
     */
    public function getUserReadings($userId, $limit = 20, $offset = 0) {
        $sql = "SELECT id, reading_type, cards_drawn, reading_question, reading_interpretation,
                       personal_notes, moon_phase, season, emotional_state, life_focus,
                       is_favorite, accuracy_rating, created_at
                FROM oracle_readings 
                WHERE user_id = :user_id 
                ORDER BY created_at DESC 
                LIMIT :limit OFFSET :offset";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $readings = $stmt->fetchAll();
        
        // Decode JSON cards data
        foreach ($readings as &$reading) {
            $reading['cards_drawn'] = json_decode($reading['cards_drawn'], true);
        }
        
        return $readings;
    }
    
    /**
     * Get a specific reading by ID
     */
    public function getReading($readingId, $userId) {
        $sql = "SELECT * FROM oracle_readings WHERE id = :reading_id AND user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['reading_id' => $readingId, 'user_id' => $userId]);
        
        $reading = $stmt->fetch();
        if ($reading) {
            $reading['cards_drawn'] = json_decode($reading['cards_drawn'], true);
        }
        
        return $reading;
    }
    
    /**
     * Mark reading as favorite
     */
    public function toggleFavorite($readingId, $userId) {
        $sql = "UPDATE oracle_readings 
                SET is_favorite = NOT is_favorite 
                WHERE id = :reading_id AND user_id = :user_id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute(['reading_id' => $readingId, 'user_id' => $userId]);
    }
    
    /**
     * Rate reading accuracy
     */
    public function rateReading($readingId, $userId, $rating) {
        if ($rating < 1 || $rating > 5) {
            return false;
        }
        
        $sql = "UPDATE oracle_readings 
                SET accuracy_rating = :rating 
                WHERE id = :reading_id AND user_id = :user_id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            'reading_id' => $readingId, 
            'user_id' => $userId, 
            'rating' => $rating
        ]);
    }
    
    /**
     * Update card statistics for the user
     */
    private function updateCardStatistics($userId, $cardsDrawn) {
        foreach ($cardsDrawn as $index => $card) {
            $cardName = $card['name'];
            $cardSymbol = $card['symbol'];
            $position = $index + 1;
            
            // Check if card stat exists
            $checkSql = "SELECT id, times_drawn FROM card_statistics 
                        WHERE user_id = :user_id AND card_name = :card_name";
            $checkStmt = $this->db->prepare($checkSql);
            $checkStmt->execute(['user_id' => $userId, 'card_name' => $cardName]);
            $existing = $checkStmt->fetch();
            
            if ($existing) {
                // Update existing statistics
                $updateSql = "UPDATE card_statistics 
                             SET times_drawn = times_drawn + 1,
                                 times_in_position_{$position} = times_in_position_{$position} + 1,
                                 last_drawn = NOW()
                             WHERE id = :id";
                $updateStmt = $this->db->prepare($updateSql);
                $updateStmt->execute(['id' => $existing['id']]);
            } else {
                // Create new card statistic
                $insertSql = "INSERT INTO card_statistics 
                             (user_id, card_name, card_symbol, times_in_position_{$position}) 
                             VALUES (:user_id, :card_name, :card_symbol, 1)";
                $insertStmt = $this->db->prepare($insertSql);
                $insertStmt->execute([
                    'user_id' => $userId,
                    'card_name' => $cardName,
                    'card_symbol' => $cardSymbol
                ]);
            }
        }
    }
    
    /**
     * Get user's card statistics
     */
    public function getUserCardStats($userId, $limit = 10) {
        $sql = "SELECT card_name, card_symbol, times_drawn, 
                       times_in_position_1, times_in_position_2, times_in_position_3,
                       personal_meaning, first_drawn, last_drawn
                FROM card_statistics 
                WHERE user_id = :user_id 
                ORDER BY times_drawn DESC, last_drawn DESC 
                LIMIT :limit";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
    
    /**
     * Get reading statistics for user
     */
    public function getReadingStats($userId) {
        $stats = [];
        
        // Total readings
        $totalSql = "SELECT COUNT(*) as total_readings FROM oracle_readings WHERE user_id = :user_id";
        $totalStmt = $this->db->prepare($totalSql);
        $totalStmt->execute(['user_id' => $userId]);
        $stats['total_readings'] = $totalStmt->fetch()['total_readings'];
        
        // Readings by type
        $typeSql = "SELECT reading_type, COUNT(*) as count 
                   FROM oracle_readings 
                   WHERE user_id = :user_id 
                   GROUP BY reading_type";
        $typeStmt = $this->db->prepare($typeSql);
        $typeStmt->execute(['user_id' => $userId]);
        $stats['by_type'] = $typeStmt->fetchAll();
        
        // Favorite readings count
        $favSql = "SELECT COUNT(*) as favorites FROM oracle_readings 
                  WHERE user_id = :user_id AND is_favorite = 1";
        $favStmt = $this->db->prepare($favSql);
        $favStmt->execute(['user_id' => $userId]);
        $stats['favorites'] = $favStmt->fetch()['favorites'];
        
        // Average accuracy rating
        $ratingSql = "SELECT AVG(accuracy_rating) as avg_rating 
                     FROM oracle_readings 
                     WHERE user_id = :user_id AND accuracy_rating IS NOT NULL";
        $ratingStmt = $this->db->prepare($ratingSql);
        $ratingStmt->execute(['user_id' => $userId]);
        $stats['avg_accuracy'] = round($ratingStmt->fetch()['avg_rating'], 2);
        
        return $stats;
    }
    
    /**
     * Get today's reading if exists
     */
    public function getTodaysReading($userId) {
        $sql = "SELECT * FROM oracle_readings 
                WHERE user_id = :user_id 
                AND DATE(created_at) = CURDATE() 
                AND reading_type = 'Daily'
                ORDER BY created_at DESC 
                LIMIT 1";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['user_id' => $userId]);
        
        $reading = $stmt->fetch();
        if ($reading) {
            $reading['cards_drawn'] = json_decode($reading['cards_drawn'], true);
        }
        
        return $reading;
    }
    
    /**
     * Get current moon phase (simplified)
     */
    private function getCurrentMoonPhase() {
        $phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
        
        // Simple calculation based on day of year
        $dayOfYear = date('z');
        $phaseIndex = ($dayOfYear % 29) / 3.625;
        
        return $phases[floor($phaseIndex)];
    }
    
    /**
     * Get current season
     */
    private function getCurrentSeason() {
        $month = date('n');
        
        if ($month >= 3 && $month <= 5) return 'Spring';
        if ($month >= 6 && $month <= 8) return 'Summer';
        if ($month >= 9 && $month <= 11) return 'Autumn';
        return 'Winter';
    }
}
?>