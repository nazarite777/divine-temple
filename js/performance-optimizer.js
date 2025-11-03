/**
 * Divine Temple Performance Optimizer
 * Comprehensive performance optimization utilities for enhanced sections
 */

class PerformanceOptimizer {
    constructor() {
        this.isLowPowerMode = this.detectLowPowerMode();
        this.isMobile = this.detectMobileDevice();
        this.connection = this.getConnectionInfo();
        this.observers = new Map();
        this.animationFrames = new Map();
        this.timeouts = new Map();
        this.intervals = new Map();
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupPerformanceMonitoring();
        this.optimizeAnimations();
        this.setupMemoryManagement();
        
        console.log('🚀 Performance Optimizer initialized');
        console.log(`📱 Device: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
        console.log(`⚡ Low Power: ${this.isLowPowerMode ? 'Yes' : 'No'}`);
        console.log(`🌐 Connection: ${this.connection.effectiveType || 'Unknown'}`);
    }

    // ================================
    // DEVICE DETECTION
    // ================================

    detectMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth <= 768;
    }

    detectLowPowerMode() {
        // Detect reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Detect low-end device indicators
        const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        return prefersReducedMotion || lowMemory || lowCores;
    }

    getConnectionInfo() {
        return navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    }

    // ================================
    // LAZY LOADING SYSTEM
    // ================================

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported - falling back to immediate loading');
            return;
        }

        // Lazy load images
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Lazy load sections
        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    this.loadSection(section);
                    this.sectionObserver.unobserve(section);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        // Animation observer for performance
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                if (entry.isIntersecting) {
                    this.enableAnimations(element);
                } else {
                    this.pauseAnimations(element);
                }
            });
        }, {
            threshold: 0.1
        });
    }

    // ================================
    // IMAGE OPTIMIZATION
    // ================================

    lazyLoadImages(container = document) {
        const images = container.querySelectorAll('img[data-src], [data-background]');
        
        images.forEach(img => {
            if (this.imageObserver) {
                this.imageObserver.observe(img);
            } else {
                this.loadImage(img);
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        const background = img.dataset.background;

        if (src) {
            // Progressive loading with placeholder
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
            };
            tempImg.onerror = () => {
                img.classList.add('error');
                console.warn('Failed to load image:', src);
            };
            tempImg.src = src;
        }

        if (background) {
            img.style.backgroundImage = `url(${background})`;
            img.classList.add('loaded');
            img.removeAttribute('data-background');
        }
    }

    // ================================
    // SECTION LOADING
    // ================================

    lazyLoadSections(container = document) {
        const sections = container.querySelectorAll('.lazy-section, [data-lazy]');
        
        sections.forEach(section => {
            if (this.sectionObserver) {
                this.sectionObserver.observe(section);
            } else {
                this.loadSection(section);
            }
        });
    }

    loadSection(section) {
        const loadFunction = section.dataset.loadFunction;
        const lazyContent = section.dataset.lazyContent;

        if (loadFunction && window[loadFunction]) {
            try {
                window[loadFunction]();
                section.classList.add('loaded');
            } catch (error) {
                console.error('Failed to load section:', error);
            }
        }

        if (lazyContent) {
            this.loadLazyContent(section, lazyContent);
        }

        section.classList.add('loaded');
        section.removeAttribute('data-lazy');
    }

    loadLazyContent(container, contentType) {
        switch (contentType) {
            case 'oracle-cards':
                this.loadOracleCards(container);
                break;
            case 'video-grid':
                this.loadVideoGrid(container);
                break;
            case 'geometry-patterns':
                this.loadGeometryPatterns(container);
                break;
            default:
                console.log('Loading generic lazy content');
        }
    }

    // ================================
    // ANIMATION OPTIMIZATION
    // ================================

    optimizeAnimations() {
        // Disable animations in low power mode
        if (this.isLowPowerMode) {
            document.documentElement.style.setProperty('--animation-duration', '0.01s');
            document.documentElement.style.setProperty('--transition-duration', '0.01s');
        }

        // Optimize animations for mobile
        if (this.isMobile) {
            document.documentElement.style.setProperty('--animation-complexity', 'simple');
        }
    }

    enableAnimations(element) {
        if (this.isLowPowerMode) return;

        element.style.willChange = 'transform, opacity';
        element.classList.add('animations-enabled');
    }

    pauseAnimations(element) {
        element.style.willChange = 'auto';
        element.classList.remove('animations-enabled');
        
        // Pause any running animations
        const animations = element.getAnimations ? element.getAnimations() : [];
        animations.forEach(animation => {
            if (animation.playState === 'running') {
                animation.pause();
            }
        });
    }

    // ================================
    // SMOOTH ANIMATIONS
    // ================================

    smoothAnimation(callback, duration = 1000, element = null) {
        if (this.isLowPowerMode) {
            callback(1); // Skip animation, go to end state
            return;
        }

        const startTime = performance.now();
        const animationId = Math.random().toString(36).substr(2, 9);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const eased = this.easeOutCubic(progress);
            
            callback(eased);

            if (progress < 1) {
                this.animationFrames.set(animationId, requestAnimationFrame(animate));
            } else {
                this.animationFrames.delete(animationId);
                if (element) {
                    element.style.willChange = 'auto';
                }
            }
        };

        if (element) {
            element.style.willChange = 'transform, opacity';
        }

        this.animationFrames.set(animationId, requestAnimationFrame(animate));
        return animationId;
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    cancelAnimation(animationId) {
        const frameId = this.animationFrames.get(animationId);
        if (frameId) {
            cancelAnimationFrame(frameId);
            this.animationFrames.delete(animationId);
        }
    }

    // ================================
    // MEMORY MANAGEMENT
    // ================================

    setupMemoryManagement() {
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Monitor memory usage
        if ('memory' in performance) {
            this.monitorMemory();
        }

        // Clean up unused event listeners periodically
        this.setupPeriodicCleanup();
    }

    cleanup() {
        // Cancel all animation frames
        this.animationFrames.forEach((frameId) => {
            cancelAnimationFrame(frameId);
        });
        this.animationFrames.clear();

        // Clear all timeouts
        this.timeouts.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        this.timeouts.clear();

        // Clear all intervals
        this.intervals.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        this.intervals.clear();

        // Disconnect observers
        if (this.imageObserver) this.imageObserver.disconnect();
        if (this.sectionObserver) this.sectionObserver.disconnect();
        if (this.animationObserver) this.animationObserver.disconnect();

        console.log('🧹 Performance Optimizer cleaned up');
    }

    monitorMemory() {
        const checkMemory = () => {
            const memory = performance.memory;
            const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            
            if (usedRatio > 0.8) {
                console.warn('🚨 High memory usage detected:', usedRatio.toFixed(2));
                this.triggerMemoryOptimization();
            }
        };

        setInterval(checkMemory, 30000); // Check every 30 seconds
    }

    triggerMemoryOptimization() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }

        // Clear unnecessary cached data
        this.clearCaches();

        // Reduce animation complexity
        document.documentElement.style.setProperty('--animation-complexity', 'minimal');
    }

    clearCaches() {
        // Clear old localStorage entries
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('cache_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && (now - data.timestamp) > maxAge) {
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    localStorage.removeItem(key); // Remove corrupted cache
                }
            }
        }
    }

    setupPeriodicCleanup() {
        const cleanupInterval = setInterval(() => {
            this.clearCaches();
            
            // Remove inactive elements
            const inactiveElements = document.querySelectorAll('.inactive, .hidden');
            inactiveElements.forEach(element => {
                if (element.dataset.cleanup === 'true') {
                    element.remove();
                }
            });
        }, 300000); // Every 5 minutes

        this.intervals.set('cleanup', cleanupInterval);
    }

    // ================================
    // PERFORMANCE MONITORING
    // ================================

    setupPerformanceMonitoring() {
        // Monitor load times
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⏱️ Page load time: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('🐌 Slow page load detected');
                this.optimizeForSlowLoad();
            }
        });

        // Monitor frame rate
        this.monitorFrameRate();
    }

    monitorFrameRate() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn(`🎯 Low FPS detected: ${fps}`);
                    this.optimizeForLowFPS();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    optimizeForSlowLoad() {
        // Reduce animation complexity
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        
        // Prioritize critical content
        this.prioritizeCriticalContent();
    }

    optimizeForLowFPS() {
        // Reduce animation frequency
        document.documentElement.style.setProperty('--animation-duration', '0.5s');
        document.documentElement.style.setProperty('--animation-complexity', 'minimal');
        
        // Pause non-critical animations
        this.pauseNonCriticalAnimations();
    }

    prioritizeCriticalContent() {
        const criticalElements = document.querySelectorAll('.critical, .above-fold');
        criticalElements.forEach(element => {
            element.style.willChange = 'auto'; // Remove will-change for critical content
        });
    }

    pauseNonCriticalAnimations() {
        const nonCriticalElements = document.querySelectorAll('.decorative, .background-animation');
        nonCriticalElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    // ================================
    // CONTENT SPECIFIC OPTIMIZATIONS
    // ================================

    loadOracleCards(container) {
        // Progressive loading of oracle cards
        const cardContainer = container.querySelector('.cards-grid');
        if (!cardContainer) return;

        const cardsPerBatch = this.isMobile ? 12 : 24;
        const cards = cardContainer.querySelectorAll('.card');
        
        for (let i = 0; i < cards.length; i += cardsPerBatch) {
            const batch = Array.from(cards).slice(i, i + cardsPerBatch);
            
            setTimeout(() => {
                batch.forEach(card => {
                    card.classList.add('loaded');
                });
            }, i * 50); // Stagger loading
        }
    }

    loadVideoGrid(container) {
        // Load video thumbnails progressively
        const videos = container.querySelectorAll('.video-card');
        
        videos.forEach((video, index) => {
            setTimeout(() => {
                video.classList.add('loaded');
                this.lazyLoadImages(video);
            }, index * 100);
        });
    }

    loadGeometryPatterns(container) {
        // Load geometry patterns with reduced complexity on low-end devices
        const patterns = container.querySelectorAll('.pattern');
        
        patterns.forEach(pattern => {
            if (this.isLowPowerMode) {
                pattern.classList.add('simplified');
            } else {
                pattern.classList.add('full-detail');
            }
        });
    }

    // ================================
    // UTILITY METHODS
    // ================================

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Managed timeout/interval methods
    managedTimeout(callback, delay) {
        const id = setTimeout(callback, delay);
        this.timeouts.set(id, id);
        return id;
    }

    managedInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.intervals.set(id, id);
        return id;
    }

    clearManagedTimeout(id) {
        clearTimeout(id);
        this.timeouts.delete(id);
    }

    clearManagedInterval(id) {
        clearInterval(id);
        this.intervals.delete(id);
    }

    // ================================
    // PUBLIC API
    // ================================

    getPerformanceMetrics() {
        return {
            isMobile: this.isMobile,
            isLowPowerMode: this.isLowPowerMode,
            connection: this.connection,
            activeAnimations: this.animationFrames.size,
            activeTimeouts: this.timeouts.size,
            activeIntervals: this.intervals.size,
            memoryUsage: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }

    optimizeElement(element, options = {}) {
        const {
            lazyLoad = true,
            enableAnimations = true,
            preload = false
        } = options;

        if (lazyLoad && !preload) {
            element.dataset.lazy = 'true';
            this.lazyLoadSections(element.parentNode);
        }

        if (enableAnimations && this.animationObserver) {
            this.animationObserver.observe(element);
        }

        this.lazyLoadImages(element);
    }

    // Force optimization for critical sections
    optimizeCriticalSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Immediate loading for critical sections
        this.loadSection(section);
        this.lazyLoadImages(section);
        
        // Optimize for performance
        if (this.isLowPowerMode) {
            section.classList.add('low-power-mode');
        }
        
        if (this.isMobile) {
            section.classList.add('mobile-optimized');
        }
    }
}

// Global performance optimizer instance
window.PerformanceOptimizer = PerformanceOptimizer;

// Auto-initialize if not already done
if (!window.performanceOptimizer) {
    window.performanceOptimizer = new PerformanceOptimizer();
}

console.log('🚀 Performance Optimizer loaded');