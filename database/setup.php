<?php
/**
 * Divine Temple Database Setup Script
 * Run this script to initialize the sacred database
 */

require_once 'db_config.php';

echo "<h2>🏛️ Divine Temple Database Setup</h2>";

try {
    // Connect to database
    $db = DB::getInstance();
    echo "<p>✅ Database connection established</p>";
    
    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    
    if (!$schema) {
        throw new Exception("Could not read schema.sql file");
    }
    
    // Split into individual statements
    $statements = array_filter(array_map('trim', explode(';', $schema)));
    
    echo "<p>📋 Executing " . count($statements) . " SQL statements...</p>";
    
    foreach ($statements as $index => $statement) {
        if (empty($statement) || strpos($statement, '--') === 0) {
            continue; // Skip empty lines and comments
        }
        
        try {
            $db->exec($statement);
            echo "<p style='color: green; margin-left: 20px;'>✅ Statement " . ($index + 1) . " executed successfully</p>";
        } catch (PDOException $e) {
            // Check if it's just a "table already exists" error
            if (strpos($e->getMessage(), 'already exists') !== false) {
                echo "<p style='color: orange; margin-left: 20px;'>⚠️ Statement " . ($index + 1) . " - Table already exists (skipping)</p>";
            } else {
                throw $e;
            }
        }
    }
    
    echo "<h3>🎉 Database setup completed successfully!</h3>";
    echo "<div style='background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;'>";
    echo "<h4>📊 Tables Created:</h4>";
    echo "<ul>";
    echo "<li>✨ <strong>users</strong> - Member profiles and spiritual journeys</li>";
    echo "<li>🔮 <strong>oracle_readings</strong> - Sacred card reading history</li>";
    echo "<li>🔐 <strong>user_sessions</strong> - Secure authentication sessions</li>";
    echo "<li>📈 <strong>card_statistics</strong> - Personal card insights and patterns</li>";
    echo "<li>📖 <strong>sacred_journal</strong> - Spiritual insights and reflections</li>";
    echo "<li>⚙️ <strong>user_preferences</strong> - Personalization settings</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<div style='background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;'>";
    echo "<h4>🔑 Test Accounts Created:</h4>";
    echo "<p><strong>Email:</strong> seeker@divine-temple.com<br>";
    echo "<strong>Username:</strong> seeker_one<br>";
    echo "<strong>Password:</strong> (You'll need to set this in the database)</p>";
    echo "<p><strong>Email:</strong> sage@divine-temple.com<br>";
    echo "<strong>Username:</strong> wise_sage<br>";
    echo "<strong>Password:</strong> (You'll need to set this in the database)</p>";
    echo "</div>";
    
    echo "<div style='background: #d1ecf1; padding: 20px; border-radius: 10px; margin: 20px 0;'>";
    echo "<h4>🚀 Next Steps:</h4>";
    echo "<ol>";
    echo "<li>Update database credentials in <code>db_config.php</code></li>";
    echo "<li>Set proper passwords for test accounts</li>";
    echo "<li>Configure your web server to serve the API endpoints</li>";
    echo "<li>Test the Oracle Cards system with user registration</li>";
    echo "<li>Customize the spiritual journey experience</li>";
    echo "</ol>";
    echo "</div>";
    
    echo "<p style='text-align: center; margin-top: 30px;'>";
    echo "<strong>🌟 The Divine Temple database is now ready to serve souls seeking spiritual guidance! 🌟</strong>";
    echo "</p>";
    
} catch (Exception $e) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 20px; border-radius: 10px; margin: 20px 0;'>";
    echo "<h3>❌ Database Setup Failed</h3>";
    echo "<p><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>Troubleshooting:</strong></p>";
    echo "<ul>";
    echo "<li>Check your database credentials in <code>db_config.php</code></li>";
    echo "<li>Ensure MySQL/MariaDB is running</li>";
    echo "<li>Verify the database exists and user has proper permissions</li>";
    echo "<li>Check PHP PDO MySQL extension is installed</li>";
    echo "</ul>";
    echo "</div>";
}
?>