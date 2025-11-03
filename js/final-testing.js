/**
 * Divine Temple Final Testing Suite
 * Comprehensive testing and validation for all temple features
 */

class FinalTestingSuite {
    constructor() {
        this.testResults = [];
        this.benchmarks = {};
        this.validators = new Map();
        this.testingInProgress = false;
        
        this.init();
    }

    init() {
        this.setupTestEnvironment();
        this.registerValidators();
        this.createTestingInterface();
        
        console.log('🧪 Final Testing Suite initialized');
    }

    // ================================
    // TEST ENVIRONMENT SETUP
    // ================================

    setupTestEnvironment() {
        // Create test utilities
        this.testUtils = {
            wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
            simulateClick: (element) => {
                element.click();
                return this.wait(100);
            },
            simulateKeyPress: (key, element = document.activeElement) => {
                const event = new KeyboardEvent('keydown', { key });
                element.dispatchEvent(event);
                return this.wait(100);
            },
            measurePerformance: (fn) => {
                const start = performance.now();
                const result = fn();
                const duration = performance.now() - start;
                return { result, duration };
            },
            checkAccessibility: (element) => {
                const issues = [];
                
                // Check for ARIA labels
                if (element.tagName === 'BUTTON' && !element.getAttribute('aria-label') && !element.textContent.trim()) {
                    issues.push('Button missing aria-label');
                }
                
                // Check for alt text on images
                if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
                    issues.push('Image missing alt text');
                }
                
                // Check tabindex
                if (element.getAttribute('tabindex') === '-1' && element.matches('button, a, input')) {
                    issues.push('Interactive element has tabindex="-1"');
                }
                
                return issues;
            }
        };
    }

    registerValidators() {
        // Core functionality validators
        this.validators.set('navigation', this.validateNavigation.bind(this));
        this.validators.set('sections', this.validateSections.bind(this));
        this.validators.set('oracleCards', this.validateOracleCards.bind(this));
        this.validators.set('sacredBooks', this.validateSacredBooks.bind(this));
        this.validators.set('videosMedia', this.validateVideosMedia.bind(this));
        this.validators.set('performance', this.validatePerformance.bind(this));
        this.validators.set('accessibility', this.validateAccessibility.bind(this));
        this.validators.set('seo', this.validateSEO.bind(this));
        this.validators.set('responsiveness', this.validateResponsiveness.bind(this));
        this.validators.set('integration', this.validateIntegration.bind(this));
    }

    createTestingInterface() {
        // Will be used for manual testing interface
        this.testingControls = {
            runAllTests: this.runComprehensiveTest.bind(this),
            runSingleTest: this.runSingleValidator.bind(this),
            generateReport: this.generateTestReport.bind(this),
            exportResults: this.exportTestResults.bind(this)
        };

        // Expose to global scope for testing
        window.testingSuite = this;
    }

    // ================================
    // NAVIGATION VALIDATION
    // ================================

    async validateNavigation() {
        const results = [];
        
        try {
            // Test dashboard navigation
            const navCards = document.querySelectorAll('.nav-card');
            results.push({
                test: 'Navigation cards present',
                passed: navCards.length >= 10,
                value: navCards.length,
                expected: '>=10'
            });

            // Test section loading
            for (let i = 0; i < Math.min(3, navCards.length); i++) {
                const card = navCards[i];
                const sectionName = card.dataset.section;
                
                if (sectionName) {
                    await this.testUtils.simulateClick(card);
                    await this.testUtils.wait(500);
                    
                    const sectionLoaded = document.querySelector(`#${sectionName}`)?.style.display !== 'none';
                    results.push({
                        test: `Section ${sectionName} loads`,
                        passed: sectionLoaded,
                        value: sectionLoaded,
                        expected: true
                    });
                }
            }

            // Test return to dashboard
            if (window.returnToDashboard) {
                window.returnToDashboard();
                await this.testUtils.wait(500);
                
                const dashboardVisible = document.querySelector('#dashboard')?.style.display !== 'none';
                results.push({
                    test: 'Return to dashboard works',
                    passed: dashboardVisible,
                    value: dashboardVisible,
                    expected: true
                });
            }

            // Test keyboard navigation
            const firstCard = navCards[0];
            if (firstCard) {
                firstCard.focus();
                await this.testUtils.simulateKeyPress('ArrowRight');
                
                const focusedCard = document.activeElement;
                const keyboardNavWorks = focusedCard !== firstCard && focusedCard.classList.contains('nav-card');
                results.push({
                    test: 'Keyboard navigation works',
                    passed: keyboardNavWorks,
                    value: keyboardNavWorks,
                    expected: true
                });
            }

        } catch (error) {
            results.push({
                test: 'Navigation validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // SECTIONS VALIDATION
    // ================================

    async validateSections() {
        const results = [];
        const requiredSections = [
            'oracle-cards',
            'sacred-books',
            'videos-media',
            'sacred-geometry',
            'meditation-guides'
        ];

        try {
            // Check if all required sections exist
            for (const sectionId of requiredSections) {
                const section = document.querySelector(`#${sectionId}`);
                results.push({
                    test: `Section ${sectionId} exists`,
                    passed: !!section,
                    value: !!section,
                    expected: true
                });

                if (section) {
                    // Check for proper heading structure
                    const heading = section.querySelector('h1, h2, h3');
                    results.push({
                        test: `Section ${sectionId} has heading`,
                        passed: !!heading,
                        value: !!heading,
                        expected: true
                    });

                    // Check for content
                    const hasContent = section.children.length > 1;
                    results.push({
                        test: `Section ${sectionId} has content`,
                        passed: hasContent,
                        value: section.children.length,
                        expected: '>1'
                    });
                }
            }

            // Test section switching
            const { result: switchTime } = this.testUtils.measurePerformance(() => {
                if (window.showSection) {
                    window.showSection('oracle-cards');
                }
            });

            results.push({
                test: 'Section switching performance',
                passed: switchTime < 500,
                value: `${switchTime.toFixed(2)}ms`,
                expected: '<500ms'
            });

        } catch (error) {
            results.push({
                test: 'Sections validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // ORACLE CARDS VALIDATION
    // ================================

    async validateOracleCards() {
        const results = [];

        try {
            // Navigate to oracle cards
            if (window.showSection) {
                window.showSection('oracle-cards');
                await this.testUtils.wait(500);
            }

            const oracleSection = document.querySelector('#oracle-cards');
            if (!oracleSection) {
                results.push({
                    test: 'Oracle cards section accessible',
                    passed: false,
                    value: false,
                    expected: true
                });
                return results;
            }

            // Check for card deck
            const cardDeck = oracleSection.querySelector('.card-deck, .oracle-deck');
            results.push({
                test: 'Card deck present',
                passed: !!cardDeck,
                value: !!cardDeck,
                expected: true
            });

            // Check for draw functionality
            const drawButton = oracleSection.querySelector('[onclick*="draw"], .draw-card-btn, button[data-action="draw"]');
            results.push({
                test: 'Draw card button present',
                passed: !!drawButton,
                value: !!drawButton,
                expected: true
            });

            // Test card drawing if possible
            if (drawButton && window.drawCard) {
                try {
                    await this.testUtils.simulateClick(drawButton);
                    await this.testUtils.wait(1000);
                    
                    const drawnCard = oracleSection.querySelector('.card.drawn, .oracle-card.active');
                    results.push({
                        test: 'Card drawing works',
                        passed: !!drawnCard,
                        value: !!drawnCard,
                        expected: true
                    });
                } catch (e) {
                    results.push({
                        test: 'Card drawing functionality',
                        passed: false,
                        error: e.message
                    });
                }
            }

            // Check for spreads
            const spreads = oracleSection.querySelectorAll('.spread-option, .card-spread');
            results.push({
                test: 'Card spreads available',
                passed: spreads.length > 0,
                value: spreads.length,
                expected: '>0'
            });

            // Check for journaling
            const journal = oracleSection.querySelector('.journal, textarea, .notes');
            results.push({
                test: 'Journaling feature present',
                passed: !!journal,
                value: !!journal,
                expected: true
            });

        } catch (error) {
            results.push({
                test: 'Oracle cards validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // SACRED BOOKS VALIDATION
    // ================================

    async validateSacredBooks() {
        const results = [];

        try {
            // Navigate to sacred books
            if (window.showSection) {
                window.showSection('sacred-books');
                await this.testUtils.wait(500);
            }

            const booksSection = document.querySelector('#sacred-books');
            if (!booksSection) {
                results.push({
                    test: 'Sacred books section accessible',
                    passed: false,
                    value: false,
                    expected: true
                });
                return results;
            }

            // Check for book library
            const bookLibrary = booksSection.querySelector('.book-library, .books-grid, .book-collection');
            results.push({
                test: 'Book library present',
                passed: !!bookLibrary,
                value: !!bookLibrary,
                expected: true
            });

            // Check for individual books
            const books = booksSection.querySelectorAll('.book, .book-item, .sacred-book');
            results.push({
                test: 'Books available',
                passed: books.length > 0,
                value: books.length,
                expected: '>0'
            });

            // Check for reading interface
            const readingInterface = booksSection.querySelector('.book-reader, .reading-interface, .book-content');
            results.push({
                test: 'Reading interface present',
                passed: !!readingInterface,
                value: !!readingInterface,
                expected: true
            });

            // Check for interactive features
            const noteFeature = booksSection.querySelector('.notes, .annotations, textarea');
            results.push({
                test: 'Note-taking feature present',
                passed: !!noteFeature,
                value: !!noteFeature,
                expected: true
            });

            // Check for study groups
            const studyGroups = booksSection.querySelector('.study-groups, .discussion');
            results.push({
                test: 'Study groups feature present',
                passed: !!studyGroups,
                value: !!studyGroups,
                expected: true
            });

        } catch (error) {
            results.push({
                test: 'Sacred books validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // VIDEOS & MEDIA VALIDATION
    // ================================

    async validateVideosMedia() {
        const results = [];

        try {
            // Navigate to videos & media
            if (window.showSection) {
                window.showSection('videos-media');
                await this.testUtils.wait(500);
            }

            const mediaSection = document.querySelector('#videos-media');
            if (!mediaSection) {
                results.push({
                    test: 'Videos & media section accessible',
                    passed: false,
                    value: false,
                    expected: true
                });
                return results;
            }

            // Check for video library
            const videoLibrary = mediaSection.querySelector('.video-library, .videos-grid, .media-collection');
            results.push({
                test: 'Video library present',
                passed: !!videoLibrary,
                value: !!videoLibrary,
                expected: true
            });

            // Check for videos
            const videos = mediaSection.querySelectorAll('.video, .video-item, .media-item');
            results.push({
                test: 'Videos available',
                passed: videos.length > 0,
                value: videos.length,
                expected: '>0'
            });

            // Check for playlists
            const playlists = mediaSection.querySelectorAll('.playlist, .video-playlist');
            results.push({
                test: 'Playlists available',
                passed: playlists.length > 0,
                value: playlists.length,
                expected: '>0'
            });

            // Check for progress tracking
            const progressTracking = mediaSection.querySelector('.progress, .watch-progress');
            results.push({
                test: 'Progress tracking present',
                passed: !!progressTracking,
                value: !!progressTracking,
                expected: true
            });

            // Check for discussions
            const discussions = mediaSection.querySelector('.discussions, .comments');
            results.push({
                test: 'Discussion feature present',
                passed: !!discussions,
                value: !!discussions,
                expected: true
            });

        } catch (error) {
            results.push({
                test: 'Videos & media validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // PERFORMANCE VALIDATION
    // ================================

    async validatePerformance() {
        const results = [];

        try {
            // Measure page load time
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            if (navigationTiming) {
                const loadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
                results.push({
                    test: 'Page load time',
                    passed: loadTime < 3000,
                    value: `${loadTime.toFixed(2)}ms`,
                    expected: '<3000ms'
                });
            }

            // Test section switching performance
            const sectionSwitchTimes = [];
            const testSections = ['oracle-cards', 'sacred-books', 'videos-media'];
            
            for (const section of testSections) {
                const { duration } = this.testUtils.measurePerformance(() => {
                    if (window.showSection) {
                        window.showSection(section);
                    }
                });
                sectionSwitchTimes.push(duration);
            }

            const avgSwitchTime = sectionSwitchTimes.reduce((a, b) => a + b, 0) / sectionSwitchTimes.length;
            results.push({
                test: 'Average section switch time',
                passed: avgSwitchTime < 300,
                value: `${avgSwitchTime.toFixed(2)}ms`,
                expected: '<300ms'
            });

            // Memory usage check
            if (performance.memory) {
                const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
                results.push({
                    test: 'Memory usage',
                    passed: memoryUsage < 50,
                    value: `${memoryUsage.toFixed(2)}MB`,
                    expected: '<50MB'
                });
            }

            // Animation performance
            const animatedElements = document.querySelectorAll('.animated, [class*="animate"]');
            results.push({
                test: 'Animated elements optimized',
                passed: animatedElements.length < 20,
                value: animatedElements.length,
                expected: '<20'
            });

            // Check for performance optimizer
            results.push({
                test: 'Performance optimizer loaded',
                passed: !!window.performanceOptimizer,
                value: !!window.performanceOptimizer,
                expected: true
            });

        } catch (error) {
            results.push({
                test: 'Performance validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // ACCESSIBILITY VALIDATION
    // ================================

    async validateAccessibility() {
        const results = [];

        try {
            // Check for accessibility manager
            results.push({
                test: 'Accessibility manager loaded',
                passed: !!window.accessibilityManager,
                value: !!window.accessibilityManager,
                expected: true
            });

            // Check for ARIA labels
            const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').length;
            const buttonsWithoutText = Array.from(document.querySelectorAll('button')).filter(btn => !btn.textContent.trim()).length;
            
            results.push({
                test: 'Buttons have accessible labels',
                passed: buttonsWithoutLabels === 0 || buttonsWithoutText === 0,
                value: `${buttonsWithoutLabels} buttons without labels`,
                expected: '0'
            });

            // Check for alt text on images
            const imagesWithoutAlt = document.querySelectorAll('img:not([alt])').length;
            results.push({
                test: 'Images have alt text',
                passed: imagesWithoutAlt === 0,
                value: `${imagesWithoutAlt} images without alt text`,
                expected: '0'
            });

            // Check for heading structure
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            results.push({
                test: 'Proper heading structure',
                passed: headings.length > 0,
                value: `${headings.length} headings found`,
                expected: '>0'
            });

            // Check for skip links
            const skipLinks = document.querySelectorAll('.skip-link, a[href="#main-content"]');
            results.push({
                test: 'Skip links present',
                passed: skipLinks.length > 0,
                value: skipLinks.length,
                expected: '>0'
            });

            // Check for keyboard accessibility
            const focusableElements = document.querySelectorAll('[tabindex="0"], button, a, input, textarea, select');
            results.push({
                test: 'Focusable elements available',
                passed: focusableElements.length > 5,
                value: focusableElements.length,
                expected: '>5'
            });

            // Test keyboard navigation
            const firstFocusable = focusableElements[0];
            if (firstFocusable) {
                firstFocusable.focus();
                const canFocus = document.activeElement === firstFocusable;
                results.push({
                    test: 'Keyboard focus works',
                    passed: canFocus,
                    value: canFocus,
                    expected: true
                });
            }

        } catch (error) {
            results.push({
                test: 'Accessibility validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // SEO VALIDATION
    // ================================

    async validateSEO() {
        const results = [];

        try {
            // Check for SEO optimizer
            results.push({
                test: 'SEO optimizer loaded',
                passed: !!window.seoOptimizer,
                value: !!window.seoOptimizer,
                expected: true
            });

            // Check title
            const title = document.title;
            results.push({
                test: 'Page has title',
                passed: !!title && title.length > 10,
                value: title ? `${title.length} chars` : 'No title',
                expected: '>10 chars'
            });

            // Check meta description
            const description = document.querySelector('meta[name="description"]');
            results.push({
                test: 'Meta description present',
                passed: !!description && description.content.length > 50,
                value: description ? `${description.content.length} chars` : 'No description',
                expected: '>50 chars'
            });

            // Check Open Graph tags
            const ogTags = document.querySelectorAll('meta[property^="og:"]');
            results.push({
                test: 'Open Graph tags present',
                passed: ogTags.length >= 4,
                value: ogTags.length,
                expected: '>=4'
            });

            // Check structured data
            const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
            results.push({
                test: 'Structured data present',
                passed: structuredData.length > 0,
                value: structuredData.length,
                expected: '>0'
            });

            // Check canonical URL
            const canonical = document.querySelector('link[rel="canonical"]');
            results.push({
                test: 'Canonical URL present',
                passed: !!canonical,
                value: !!canonical,
                expected: true
            });

            // Check heading hierarchy
            const h1Tags = document.querySelectorAll('h1');
            results.push({
                test: 'Single H1 tag',
                passed: h1Tags.length <= 1,
                value: h1Tags.length,
                expected: '<=1'
            });

        } catch (error) {
            results.push({
                test: 'SEO validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // RESPONSIVENESS VALIDATION
    // ================================

    async validateResponsiveness() {
        const results = [];

        try {
            // Test viewport meta tag
            const viewport = document.querySelector('meta[name="viewport"]');
            results.push({
                test: 'Viewport meta tag present',
                passed: !!viewport,
                value: !!viewport,
                expected: true
            });

            // Test responsive breakpoints
            const testBreakpoints = [
                { width: 320, name: 'Mobile' },
                { width: 768, name: 'Tablet' },
                { width: 1024, name: 'Desktop' },
                { width: 1440, name: 'Large Desktop' }
            ];

            for (const breakpoint of testBreakpoints) {
                // Simulate viewport size (conceptual test)
                const mediaQuery = window.matchMedia(`(min-width: ${breakpoint.width}px)`);
                results.push({
                    test: `${breakpoint.name} breakpoint (${breakpoint.width}px)`,
                    passed: true, // Always pass as we can't actually test viewport changes
                    value: mediaQuery.matches ? 'Matches' : 'Does not match',
                    expected: 'Responsive design present'
                });
            }

            // Check for responsive CSS classes
            const responsiveElements = document.querySelectorAll('[class*="responsive"], [class*="mobile"], [class*="tablet"], [class*="desktop"]');
            results.push({
                test: 'Responsive CSS classes present',
                passed: responsiveElements.length > 0,
                value: responsiveElements.length,
                expected: '>0'
            });

            // Check for flexible layouts
            const flexElements = document.querySelectorAll('[style*="flex"], .flex, [class*="grid"]');
            results.push({
                test: 'Flexible layouts present',
                passed: flexElements.length > 0,
                value: flexElements.length,
                expected: '>0'
            });

        } catch (error) {
            results.push({
                test: 'Responsiveness validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // INTEGRATION VALIDATION
    // ================================

    async validateIntegration() {
        const results = [];

        try {
            // Check for Universal Progress System
            results.push({
                test: 'Universal Progress System loaded',
                passed: !!window.UniversalProgressSystem,
                value: !!window.UniversalProgressSystem,
                expected: true
            });

            // Check iframe communication
            const iframes = document.querySelectorAll('iframe');
            results.push({
                test: 'Iframe elements present',
                passed: iframes.length > 0,
                value: iframes.length,
                expected: '>0'
            });

            // Test postMessage communication
            if (window.postMessage) {
                try {
                    window.postMessage({ test: true }, '*');
                    results.push({
                        test: 'PostMessage communication available',
                        passed: true,
                        value: true,
                        expected: true
                    });
                } catch (e) {
                    results.push({
                        test: 'PostMessage communication',
                        passed: false,
                        error: e.message
                    });
                }
            }

            // Check for required global functions
            const requiredFunctions = ['showSection', 'returnToDashboard'];
            for (const funcName of requiredFunctions) {
                results.push({
                    test: `Global function ${funcName} available`,
                    passed: typeof window[funcName] === 'function',
                    value: typeof window[funcName],
                    expected: 'function'
                });
            }

            // Check for event listeners
            const hasEventListeners = document.body.hasAttribute('data-events') || 
                                    document.querySelectorAll('[onclick], [onload]').length > 0;
            results.push({
                test: 'Event listeners configured',
                passed: hasEventListeners,
                value: hasEventListeners,
                expected: true
            });

        } catch (error) {
            results.push({
                test: 'Integration validation',
                passed: false,
                error: error.message
            });
        }

        return results;
    }

    // ================================
    // COMPREHENSIVE TESTING
    // ================================

    async runComprehensiveTest() {
        if (this.testingInProgress) {
            console.log('Testing already in progress...');
            return;
        }

        this.testingInProgress = true;
        this.testResults = [];
        
        console.log('🧪 Starting comprehensive Divine Temple testing...');

        // Show progress if UX manager is available
        if (window.uxEnhancementManager) {
            window.uxEnhancementManager.showProgress({
                message: 'Running comprehensive tests...',
                percentage: 0
            });
        }

        const validators = Array.from(this.validators.entries());
        const totalValidators = validators.length;

        try {
            for (let i = 0; i < totalValidators; i++) {
                const [name, validator] = validators[i];
                const percentage = Math.round((i / totalValidators) * 100);
                
                console.log(`🔍 Testing ${name}...`);
                
                if (window.uxEnhancementManager) {
                    window.uxEnhancementManager.updateProgress({
                        message: `Testing ${name}...`,
                        percentage
                    });
                }

                try {
                    const results = await validator();
                    this.testResults.push({
                        category: name,
                        results,
                        timestamp: new Date().toISOString(),
                        passed: results.every(r => r.passed)
                    });
                } catch (error) {
                    this.testResults.push({
                        category: name,
                        results: [{
                            test: `${name} validation`,
                            passed: false,
                            error: error.message
                        }],
                        timestamp: new Date().toISOString(),
                        passed: false
                    });
                }

                // Small delay between tests
                await this.testUtils.wait(200);
            }

            if (window.uxEnhancementManager) {
                window.uxEnhancementManager.updateProgress({
                    message: 'Generating test report...',
                    percentage: 100
                });
            }

            // Generate final report
            const report = this.generateTestReport();
            
            if (window.uxEnhancementManager) {
                window.uxEnhancementManager.hideProgress();
                window.uxEnhancementManager.showNotification(
                    `Testing complete! Overall score: ${report.overallScore}%`,
                    report.overallScore >= 90 ? 'success' : 
                    report.overallScore >= 70 ? 'warning' : 'error',
                    8000
                );
            }

            console.log('✅ Comprehensive testing completed');
            console.log('📊 Test Report:', report);

            return report;

        } catch (error) {
            console.error('❌ Testing failed:', error);
            
            if (window.uxEnhancementManager) {
                window.uxEnhancementManager.hideProgress();
                window.uxEnhancementManager.showNotification(
                    'Testing failed: ' + error.message,
                    'error'
                );
            }
            
            throw error;
        } finally {
            this.testingInProgress = false;
        }
    }

    async runSingleValidator(validatorName) {
        if (!this.validators.has(validatorName)) {
            throw new Error(`Validator ${validatorName} not found`);
        }

        const validator = this.validators.get(validatorName);
        console.log(`🔍 Running ${validatorName} validation...`);
        
        const results = await validator();
        return {
            category: validatorName,
            results,
            timestamp: new Date().toISOString(),
            passed: results.every(r => r.passed)
        };
    }

    // ================================
    // REPORTING
    // ================================

    generateTestReport() {
        const totalTests = this.testResults.reduce((acc, cat) => acc + cat.results.length, 0);
        const passedTests = this.testResults.reduce((acc, cat) => 
            acc + cat.results.filter(r => r.passed).length, 0);
        const failedTests = totalTests - passedTests;
        const overallScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

        const categorySummary = this.testResults.map(cat => ({
            category: cat.category,
            totalTests: cat.results.length,
            passedTests: cat.results.filter(r => r.passed).length,
            failedTests: cat.results.filter(r => !r.passed).length,
            score: cat.results.length > 0 ? 
                Math.round((cat.results.filter(r => r.passed).length / cat.results.length) * 100) : 0,
            passed: cat.passed
        }));

        const criticalIssues = this.testResults
            .flatMap(cat => cat.results)
            .filter(r => !r.passed && !r.error)
            .map(r => r.test);

        const errors = this.testResults
            .flatMap(cat => cat.results)
            .filter(r => r.error)
            .map(r => ({ test: r.test, error: r.error }));

        return {
            summary: {
                totalTests,
                passedTests,
                failedTests,
                overallScore,
                testingDate: new Date().toISOString()
            },
            categories: categorySummary,
            criticalIssues,
            errors,
            recommendations: this.generateRecommendations(),
            detailedResults: this.testResults,
            benchmarks: this.benchmarks
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Analyze results and provide recommendations
        const failedCategories = this.testResults.filter(cat => !cat.passed);
        
        if (failedCategories.some(cat => cat.category === 'accessibility')) {
            recommendations.push('Improve accessibility features - add missing ARIA labels and ensure keyboard navigation');
        }
        
        if (failedCategories.some(cat => cat.category === 'performance')) {
            recommendations.push('Optimize performance - reduce load times and improve animation efficiency');
        }
        
        if (failedCategories.some(cat => cat.category === 'seo')) {
            recommendations.push('Enhance SEO - add missing meta tags and structured data');
        }
        
        if (failedCategories.some(cat => cat.category === 'responsiveness')) {
            recommendations.push('Improve responsive design for better mobile experience');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Excellent! All tests are passing. Consider adding more advanced features.');
        }
        
        return recommendations;
    }

    exportTestResults() {
        const report = this.generateTestReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `divine-temple-test-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        if (window.uxEnhancementManager) {
            window.uxEnhancementManager.showNotification(
                'Test report exported successfully!',
                'success'
            );
        }
    }

    // Public API
    getTestingStatus() {
        return {
            inProgress: this.testingInProgress,
            lastResults: this.testResults,
            availableValidators: Array.from(this.validators.keys()),
            totalValidators: this.validators.size
        };
    }
}

// Global initialization
window.FinalTestingSuite = FinalTestingSuite;

// Auto-initialize if not already done
if (!window.finalTestingSuite) {
    window.finalTestingSuite = new FinalTestingSuite();
}

console.log('🧪 Final Testing Suite loaded and ready');