<?php
/**
 * Email Service for Divine Temple
 * Sacred messenger for verification and notifications
 */

class EmailService {
    private $smtpConfig;
    
    public function __construct() {
        $this->smtpConfig = [
            'host' => 'smtp.gmail.com', // Update with your SMTP host
            'port' => 587,
            'username' => 'your-email@gmail.com', // Update with your email
            'password' => 'your-app-password', // Update with your app password
            'encryption' => 'tls'
        ];
    }
    
    /**
     * Send verification email to new member
     */
    public function sendVerificationEmail($email, $fullName, $verificationToken) {
        $verificationLink = $this->getBaseUrl() . "/verify.php?token=" . $verificationToken;
        
        $subject = "🏛️ Welcome to the Divine Temple - Verify Your Sacred Account";
        
        $htmlBody = $this->getVerificationEmailTemplate($fullName, $verificationLink);
        $plainBody = $this->getPlainVerificationEmail($fullName, $verificationLink);
        
        return $this->sendEmail($email, $fullName, $subject, $htmlBody, $plainBody);
    }
    
    /**
     * Send welcome email after verification
     */
    public function sendWelcomeEmail($email, $fullName, $spiritualName = '') {
        $displayName = $spiritualName ?: $fullName;
        
        $subject = "✨ Your Divine Temple Journey Begins, {$displayName}!";
        
        $htmlBody = $this->getWelcomeEmailTemplate($fullName, $spiritualName);
        $plainBody = $this->getPlainWelcomeEmail($fullName, $spiritualName);
        
        return $this->sendEmail($email, $fullName, $subject, $htmlBody, $plainBody);
    }
    
    /**
     * Send password reset email
     */
    public function sendPasswordResetEmail($email, $fullName, $resetToken) {
        $resetLink = $this->getBaseUrl() . "/reset-password.php?token=" . $resetToken;
        
        $subject = "🔐 Divine Temple - Reset Your Sacred Password";
        
        $htmlBody = $this->getPasswordResetTemplate($fullName, $resetLink);
        $plainBody = $this->getPlainPasswordResetEmail($fullName, $resetLink);
        
        return $this->sendEmail($email, $fullName, $subject, $htmlBody, $plainBody);
    }
    
    /**
     * Core email sending function
     */
    private function sendEmail($to, $toName, $subject, $htmlBody, $plainBody) {
        try {
            // For production, implement proper SMTP sending
            // For now, we'll simulate sending and log the email
            
            $emailData = [
                'to' => $to,
                'to_name' => $toName,
                'subject' => $subject,
                'html_body' => $htmlBody,
                'plain_body' => $plainBody,
                'sent_at' => date('Y-m-d H:i:s')
            ];
            
            // Log email for debugging (remove in production)
            error_log("Divine Temple Email Sent: " . json_encode($emailData));
            
            // In production, replace this with actual SMTP sending:
            /*
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $this->smtpConfig['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $this->smtpConfig['username'];
            $mail->Password = $this->smtpConfig['password'];
            $mail->SMTPSecure = $this->smtpConfig['encryption'];
            $mail->Port = $this->smtpConfig['port'];
            
            $mail->setFrom($this->smtpConfig['username'], 'Divine Temple');
            $mail->addAddress($to, $toName);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = $plainBody;
            $mail->isHTML(true);
            
            return $mail->send();
            */
            
            // For development, return true to simulate successful sending
            return true;
            
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get verification email HTML template
     */
    private function getVerificationEmailTemplate($fullName, $verificationLink) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Verify Your Divine Temple Account</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    background: linear-gradient(135deg, #1e1b4b, #4c1d95); 
                    margin: 0; 
                    padding: 20px; 
                    color: #333;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white; 
                    border-radius: 20px; 
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }
                .header { 
                    background: linear-gradient(135deg, #4f46e5, #d4af37); 
                    color: white; 
                    text-align: center; 
                    padding: 40px 20px;
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                    font-weight: 700;
                }
                .temple-icon { 
                    font-size: 48px; 
                    margin-bottom: 10px; 
                }
                .content { 
                    padding: 40px 30px; 
                    text-align: center;
                }
                .welcome-text { 
                    font-size: 18px; 
                    color: #4f46e5; 
                    margin-bottom: 20px; 
                    font-weight: 600;
                }
                .verify-btn { 
                    display: inline-block; 
                    background: linear-gradient(135deg, #4f46e5, #d4af37); 
                    color: white; 
                    text-decoration: none; 
                    padding: 15px 30px; 
                    border-radius: 25px; 
                    font-weight: 600; 
                    font-size: 16px;
                    margin: 20px 0;
                    transition: all 0.3s ease;
                }
                .verify-btn:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
                }
                .footer { 
                    background: #f8fafc; 
                    padding: 30px; 
                    text-align: center; 
                    color: #64748b; 
                    font-size: 14px;
                }
                .divider { 
                    height: 2px; 
                    background: linear-gradient(90deg, #4f46e5, #d4af37, #4f46e5); 
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <div class='temple-icon'>🏛️</div>
                    <h1>Welcome to the Divine Temple</h1>
                </div>
                
                <div class='content'>
                    <div class='welcome-text'>Greetings, {$fullName}!</div>
                    
                    <p>Your sacred journey begins now! You've successfully registered for the Divine Temple, a sanctuary for spiritual growth and divine wisdom.</p>
                    
                    <p>To activate your account and begin your spiritual journey, please verify your email address by clicking the button below:</p>
                    
                    <a href='{$verificationLink}' class='verify-btn'>
                        ✨ Verify My Sacred Account ✨
                    </a>
                    
                    <div class='divider'></div>
                    
                    <p><strong>What awaits you in the Divine Temple:</strong></p>
                    <p>🔮 Oracle Cards readings for divine guidance<br>
                    🧘 Meditation and spiritual practices<br>
                    📖 Personal spiritual journal<br>
                    📊 Track your spiritual growth<br>
                    🌟 Connect with like-minded souls</p>
                    
                    <p><em>If you did not create this account, please ignore this email.</em></p>
                </div>
                
                <div class='footer'>
                    <p>This email was sent from the Divine Temple<br>
                    If you have any questions, please contact our spiritual support team.</p>
                    
                    <p>May your journey be filled with light and wisdom 🌟</p>
                </div>
            </div>
        </body>
        </html>";
    }
    
    /**
     * Get plain text verification email
     */
    private function getPlainVerificationEmail($fullName, $verificationLink) {
        return "
Welcome to the Divine Temple, {$fullName}!

Your sacred journey begins now! You've successfully registered for the Divine Temple, a sanctuary for spiritual growth and divine wisdom.

To activate your account and begin your spiritual journey, please verify your email address by visiting this link:

{$verificationLink}

What awaits you in the Divine Temple:
- Oracle Cards readings for divine guidance
- Meditation and spiritual practices  
- Personal spiritual journal
- Track your spiritual growth
- Connect with like-minded souls

If you did not create this account, please ignore this email.

May your journey be filled with light and wisdom!

The Divine Temple Team
        ";
    }
    
    /**
     * Get welcome email template
     */
    private function getWelcomeEmailTemplate($fullName, $spiritualName) {
        $displayName = $spiritualName ?: $fullName;
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Welcome to Your Spiritual Journey</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1e1b4b, #4c1d95); margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #4f46e5, #d4af37); color: white; text-align: center; padding: 40px 20px; }
                .content { padding: 40px 30px; text-align: center; }
                .cta-btn { display: inline-block; background: linear-gradient(135deg, #4f46e5, #d4af37); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <div style='font-size: 48px; margin-bottom: 10px;'>🌟</div>
                    <h1>Your Journey Begins, {$displayName}!</h1>
                </div>
                
                <div class='content'>
                    <p>Welcome to the Divine Temple! Your account is now active and your spiritual journey awaits.</p>
                    
                    <p>Ready to explore your divine path? Start with your first Oracle Cards reading!</p>
                    
                    <a href='{$this->getBaseUrl()}/members-new.html' class='cta-btn'>
                        🔮 Enter the Divine Temple 🔮
                    </a>
                    
                    <p><strong>Your spiritual tools are ready:</strong><br>
                    Oracle Cards • Meditation Guides • Spiritual Journal • Progress Tracking</p>
                </div>
            </div>
        </body>
        </html>";
    }
    
    /**
     * Get plain welcome email
     */
    private function getPlainWelcomeEmail($fullName, $spiritualName) {
        $displayName = $spiritualName ?: $fullName;
        
        return "
Welcome to the Divine Temple, {$displayName}!

Your account is now active and your spiritual journey awaits.

Ready to explore your divine path? Visit: {$this->getBaseUrl()}/members-new.html

Your spiritual tools are ready:
- Oracle Cards readings
- Meditation guides  
- Spiritual journal
- Progress tracking

May your path be illuminated with divine wisdom!

The Divine Temple Team
        ";
    }
    
    /**
     * Get password reset template
     */
    private function getPasswordResetTemplate($fullName, $resetLink) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Reset Your Divine Temple Password</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1e1b4b, #4c1d95); margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #4f46e5, #d4af37); color: white; text-align: center; padding: 40px 20px; }
                .content { padding: 40px 30px; text-align: center; }
                .reset-btn { display: inline-block; background: linear-gradient(135deg, #4f46e5, #d4af37); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <div style='font-size: 48px; margin-bottom: 10px;'>🔐</div>
                    <h1>Reset Your Sacred Password</h1>
                </div>
                
                <div class='content'>
                    <p>Hello {$fullName},</p>
                    
                    <p>We received a request to reset your Divine Temple password. Click the button below to create a new password:</p>
                    
                    <a href='{$resetLink}' class='reset-btn'>
                        🔐 Reset My Password 🔐
                    </a>
                    
                    <p>This link will expire in 1 hour for your security.</p>
                    
                    <p><em>If you did not request this password reset, please ignore this email and your password will remain unchanged.</em></p>
                </div>
            </div>
        </body>
        </html>";
    }
    
    /**
     * Get plain password reset email
     */
    private function getPlainPasswordResetEmail($fullName, $resetLink) {
        return "
Hello {$fullName},

We received a request to reset your Divine Temple password. 

To reset your password, please visit: {$resetLink}

This link will expire in 1 hour for your security.

If you did not request this password reset, please ignore this email and your password will remain unchanged.

The Divine Temple Team
        ";
    }
    
    /**
     * Get base URL for the application
     */
    private function getBaseUrl() {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        return $protocol . '://' . $host;
    }
}
?>