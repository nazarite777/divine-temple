<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - Divine Temple</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-purple: #4f46e5;
            --accent-purple: #6366f1;
            --accent-gold: #d4af37;
            --deep-purple: #312e81;
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
            --text-light: rgba(255, 255, 255, 0.9);
            --text-muted: rgba(255, 255, 255, 0.7);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #581c87 75%, #6b21a8 100%);
            min-height: 100vh;
            color: var(--text-light);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .verification-container {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 30px;
            padding: 3rem;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }

        .verification-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--accent-purple), var(--accent-gold), var(--accent-purple));
        }

        .verification-icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            animation: pulse 2s infinite;
        }

        .verification-title {
            font-family: 'Playfair Display', serif;
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--accent-gold), #fbbf24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .verification-message {
            font-size: 1.1rem;
            line-height: 1.6;
            color: var(--text-muted);
            margin-bottom: 2rem;
        }

        .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
        }

        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 15px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--accent-purple), var(--accent-gold));
            color: white;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-light);
            border: 1px solid var(--glass-border);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .success {
            --verification-color: #10b981;
        }

        .error {
            --verification-color: #ef4444;
        }

        .loading {
            --verification-color: var(--accent-gold);
        }

        .success .verification-icon {
            color: #10b981;
        }

        .error .verification-icon {
            color: #ef4444;
        }

        .loading .verification-icon {
            color: var(--accent-gold);
        }

        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .verification-container {
            animation: fadeInUp 0.8s ease-out;
        }

        @media (max-width: 768px) {
            .verification-container {
                padding: 2rem;
                margin: 1rem;
            }

            .verification-title {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="verification-container" id="verification-container">
        <!-- Content will be dynamically populated by JavaScript -->
    </div>

    <script>
        class EmailVerification {
            constructor() {
                this.container = document.getElementById('verification-container');
                this.token = this.getTokenFromUrl();
                this.init();
            }

            getTokenFromUrl() {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get('token');
            }

            init() {
                if (!this.token) {
                    this.showError('Invalid or missing verification token');
                    return;
                }

                this.showLoading();
                this.verifyToken();
            }

            showLoading() {
                this.container.className = 'verification-container loading';
                this.container.innerHTML = `
                    <div class="verification-icon">⏳</div>
                    <h1 class="verification-title">Verifying Your Sacred Account</h1>
                    <div class="verification-message">
                        <p>Please wait while we verify your divine credentials...</p>
                        <div style="margin-top: 1rem;">
                            <div class="spinner"></div>
                        </div>
                    </div>
                `;
            }

            async verifyToken() {
                try {
                    const response = await fetch('/api/auth.php?action=verify_email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: this.token })
                    });

                    const result = await response.json();

                    if (result.success) {
                        this.showSuccess(result.user);
                    } else {
                        this.showError(result.message || 'Verification failed');
                    }

                } catch (error) {
                    console.error('Verification error:', error);
                    this.showError('A sacred disturbance occurred during verification');
                }
            }

            showSuccess(user) {
                this.container.className = 'verification-container success';
                this.container.innerHTML = `
                    <div class="verification-icon">✅</div>
                    <h1 class="verification-title">Sacred Account Verified!</h1>
                    <div class="verification-message">
                        <p>Welcome to the Divine Temple, <strong>${user.spiritual_name || user.full_name}</strong>!</p>
                        <p>Your spiritual journey can now begin. Your account is fully activated and ready for divine exploration.</p>
                    </div>
                    <div class="action-buttons">
                        <a href="/members-new.html" class="btn btn-primary">
                            🔮 Enter the Divine Temple 🔮
                        </a>
                        <a href="/register.html" class="btn btn-secondary">
                            Help Another Soul Join
                        </a>
                    </div>
                `;
            }

            showError(message) {
                this.container.className = 'verification-container error';
                this.container.innerHTML = `
                    <div class="verification-icon">❌</div>
                    <h1 class="verification-title">Verification Failed</h1>
                    <div class="verification-message">
                        <p>${message}</p>
                        <p>This could happen if the verification link has expired or has already been used.</p>
                    </div>
                    <div class="action-buttons">
                        <button onclick="this.resendVerification()" class="btn btn-primary">
                            📧 Resend Verification Email
                        </button>
                        <a href="/register.html" class="btn btn-secondary">
                            Create New Account
                        </a>
                        <a href="/members-new.html" class="btn btn-secondary">
                            Try to Login
                        </a>
                    </div>
                `;
            }

            async resendVerification() {
                try {
                    // Show loading state
                    const btn = event.target;
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<div class="spinner"></div> Sending...';
                    btn.disabled = true;

                    const response = await fetch('/api/auth.php?action=resend_verification', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: this.token })
                    });

                    const result = await response.json();

                    if (result.success) {
                        btn.innerHTML = '✅ Email Sent!';
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                        }, 3000);
                    } else {
                        throw new Error(result.message || 'Failed to resend email');
                    }

                } catch (error) {
                    console.error('Resend error:', error);
                    btn.innerHTML = '❌ Failed to Send';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 3000);
                }
            }
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new EmailVerification();
        });
    </script>
</body>
</html>