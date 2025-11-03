<?php
/**
 * Divine Temple Database Configuration
 * Sacred connection to the digital realm
 */

class DatabaseConfig {
    private $host = 'localhost';
    private $dbname = 'divine_temple';
    private $username = 'divine_user';
    private $password = 'sacred_password_2025';
    private $connection;
    
    public function __construct() {
        $this->connect();
    }
    
    private function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            
            // Set timezone for spiritual accuracy
            $this->connection->exec("SET time_zone = '+00:00'");
            
        } catch (PDOException $e) {
            error_log("Divine Temple Database Connection Error: " . $e->getMessage());
            throw new Exception("Sacred connection failed. Please try again later.");
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function closeConnection() {
        $this->connection = null;
    }
}

// Database connection singleton
class DB {
    private static $instance = null;
    private static $connection = null;
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new DatabaseConfig();
            self::$connection = self::$instance->getConnection();
        }
        return self::$connection;
    }
}
?>