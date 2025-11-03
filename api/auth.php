<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database/UserManager.php';
require_once '../database/OracleReadingManager.php';
require_once '../database/EmailService.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$userManager = new UserManager();
$oracleManager = new OracleReadingManager();
$emailService = new EmailService();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'login':
            if ($method !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            $rememberMe = $input['remember_me'] ?? false;
            
            $result = $userManager->loginUser($email, $password, $rememberMe);
            
            if ($result['success']) {
                // Set session cookie
                setcookie('divine_session', $result['session']['session_token'], 
                         strtotime($result['session']['expires_at']), 
                         '/', '', true, true);
                         
                $_SESSION['user_id'] = $result['user']['id'];
                $_SESSION['csrf_token'] = $result['session']['csrf_token'];
            }
            
            echo json_encode($result);
            break;
            
        case 'register':
            if ($method !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $result = $userManager->registerUser($input);
            
            if ($result['success']) {
                // Send verification email
                $emailSent = $emailService->sendVerificationEmail(
                    $input['email'],
                    $input['full_name'],
                    $result['verification_token']
                );
                
                if ($emailSent) {
                    $result['email_sent'] = true;
                    $result['message'] .= ' A verification email has been sent to your sacred inbox.';
                } else {
                    $result['email_sent'] = false;
                    $result['message'] .= ' However, there was an issue sending the verification email. Please contact support.';
                }
            }
            
            echo json_encode($result);
            break;
            
        case 'verify_email':
            if ($method !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $token = $input['token'] ?? '';
            
            if (!$token) {
                throw new Exception('Verification token is required');
            }
            
            $result = $userManager->verifyEmail($token);
            
            if ($result['success']) {
                // Send welcome email after successful verification
                $emailService->sendWelcomeEmail(
                    $result['user']['email'],
                    $result['user']['full_name'],
                    $result['user']['spiritual_name']
                );
            }
            
            echo json_encode($result);
            break;
            
        case 'resend_verification':
            if ($method !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $token = $input['token'] ?? '';
            $email = $input['email'] ?? '';
            
            if (!$token && !$email) {
                throw new Exception('Token or email is required');
            }
            
            $result = $userManager->resendVerification($token, $email);
            
            if ($result['success']) {
                $emailSent = $emailService->sendVerificationEmail(
                    $result['user']['email'],
                    $result['user']['full_name'],
                    $result['new_token']
                );
                
                if (!$emailSent) {
                    $result['success'] = false;
                    $result['message'] = 'Failed to send verification email';
                }
            }
            
            echo json_encode($result);
            break;
            
        case 'logout':
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            if ($sessionToken) {
                $userManager->logoutUser($sessionToken);
                setcookie('divine_session', '', time() - 3600, '/');
            }
            
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Sacred session ended peacefully.']);
            break;
            
        case 'validate_session':
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            if ($sessionToken) {
                $result = $userManager->validateSession($sessionToken);
                echo json_encode($result);
            } else {
                echo json_encode(['valid' => false]);
            }
            break;
            
        case 'save_reading':
            if ($method !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            // Validate session
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $result = $oracleManager->saveReading($sessionData['user']['id'], $input);
            echo json_encode($result);
            break;
            
        case 'get_readings':
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $limit = $_GET['limit'] ?? 20;
            $offset = $_GET['offset'] ?? 0;
            
            $readings = $oracleManager->getUserReadings($sessionData['user']['id'], $limit, $offset);
            echo json_encode(['success' => true, 'readings' => $readings]);
            break;
            
        case 'get_reading':
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $readingId = $_GET['reading_id'] ?? '';
            if (!$readingId) {
                throw new Exception('Reading ID is required.');
            }
            
            $reading = $oracleManager->getReading($readingId, $sessionData['user']['id']);
            echo json_encode(['success' => true, 'reading' => $reading]);
            break;
            
        case 'toggle_favorite':
            if ($method !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $readingId = $input['reading_id'] ?? '';
            
            if (!$readingId) {
                throw new Exception('Reading ID is required.');
            }
            
            $result = $oracleManager->toggleFavorite($readingId, $sessionData['user']['id']);
            echo json_encode(['success' => $result, 'message' => 'Favorite status updated.']);
            break;
            
        case 'rate_reading':
            if ($method !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $readingId = $input['reading_id'] ?? '';
            $rating = $input['rating'] ?? 0;
            
            if (!$readingId || !$rating) {
                throw new Exception('Reading ID and rating are required.');
            }
            
            $result = $oracleManager->rateReading($readingId, $sessionData['user']['id'], $rating);
            echo json_encode(['success' => $result, 'message' => 'Reading accuracy rated.']);
            break;
            
        case 'get_stats':
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $readingStats = $oracleManager->getReadingStats($sessionData['user']['id']);
            $cardStats = $oracleManager->getUserCardStats($sessionData['user']['id']);
            
            echo json_encode([
                'success' => true,
                'reading_stats' => $readingStats,
                'card_stats' => $cardStats
            ]);
            break;
            
        case 'get_todays_reading':
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $todaysReading = $oracleManager->getTodaysReading($sessionData['user']['id']);
            echo json_encode(['success' => true, 'reading' => $todaysReading]);
            break;
            
        case 'get_preferences':
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $preferences = $userManager->getUserPreferences($sessionData['user']['id']);
            echo json_encode(['success' => true, 'preferences' => $preferences]);
            break;
            
        case 'update_preferences':
            if ($method !== 'POST') {
                throw new Exception('Invalid request method');
            }
            
            $sessionToken = $_COOKIE['divine_session'] ?? '';
            $sessionData = $userManager->validateSession($sessionToken);
            
            if (!$sessionData['valid']) {
                throw new Exception('Sacred session has expired. Please login again.');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $result = $userManager->updateUserPreferences($sessionData['user']['id'], $input);
            
            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Preferences updated successfully.' : 'Failed to update preferences.'
            ]);
            break;
            
        default:
            throw new Exception('Unknown action requested.');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>