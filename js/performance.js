/**
 * Divine Temple Performance Optimization
 * Sacred acceleration for spiritual experiences
 */

// Critical CSS for above-the-fold content
const criticalCSS = `
/* Critical styles for immediate rendering */
:root {
    --primary-bg: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
    --accent-purple: #8b5fbf;
    --accent-gold: #d4af37;
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--primary-bg);
    color: white;
    line-height: 1.6;
    overflow-x: hidden;
}

.hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: var(--primary-bg);
}

.glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(212, 175, 55, 0.3);
    border-top: 4px solid var(--accent-gold);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Performance monitoring and optimization
class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadStart: performance.now(),
            domReady: null,
            fullyLoaded: null,
            interactive: null
        };
        
        this.init();
    }
    
    init() {
        this.injectCriticalCSS();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupResourceHints();
        this.monitorPerformance();
        this.setupServiceWorker();
    }
    
    // Inject critical CSS for immediate rendering
    injectCriticalCSS() {
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }
    
    // Setup lazy loading for images and iframes
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src], iframe[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Optimize images and add modern format support
    setupImageOptimization() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for native lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add intersection observer for fade-in effect
            if ('IntersectionObserver' in window) {
                const fadeObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                });
                
                img.style.opacity = '0';
                img.style.transform = 'translateY(20px)';
                img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                fadeObserver.observe(img);
            }
        });
    }
    
    // Add resource hints for better loading
    setupResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
        ];
        
        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.keys(hint).forEach(attr => {
                link.setAttribute(attr, hint[attr]);
            });
            document.head.appendChild(link);
        });
    }
    
    // Monitor and report performance metrics
    monitorPerformance() {
        // Record DOM ready time
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.metrics.domReady = performance.now() - this.metrics.loadStart;
                this.reportMetric('DOM Ready', this.metrics.domReady);
            });
        }
        
        // Record fully loaded time
        window.addEventListener('load', () => {
            this.metrics.fullyLoaded = performance.now() - this.metrics.loadStart;
            this.reportMetric('Fully Loaded', this.metrics.fullyLoaded);
            this.analyzePerformance();
        });
        
        // Monitor First Contentful Paint
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'paint') {
                        this.reportMetric(entry.name, entry.startTime);
                    }
                });
            });
            
            perfObserver.observe({ entryTypes: ['paint'] });
        }
    }
    
    // Report performance metrics
    reportMetric(name, value) {
        console.log(`🚀 Divine Temple Performance - ${name}: ${Math.round(value)}ms`);
        
        // Store in localStorage for analytics
        const metrics = JSON.parse(localStorage.getItem('divineTempleMetrics') || '{}');
        metrics[name] = Math.round(value);
        metrics.timestamp = new Date().toISOString();
        localStorage.setItem('divineTempleMetrics', JSON.stringify(metrics));
    }
    
    // Analyze overall performance and provide recommendations
    analyzePerformance() {
        const recommendations = [];
        
        if (this.metrics.domReady > 2000) {
            recommendations.push('Consider reducing JavaScript execution time for faster DOM ready');
        }
        
        if (this.metrics.fullyLoaded > 5000) {
            recommendations.push('Optimize images and resources to improve load time');
        }
        
        // Check for large images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
                recommendations.push(`Large image detected: ${img.src} - consider optimization`);
            }
        });
        
        if (recommendations.length > 0) {
            console.log('🔧 Performance Recommendations:');
            recommendations.forEach(rec => console.log(`  • ${rec}`));
        } else {
            console.log('✨ Excellent performance! The Divine Temple loads swiftly.');
        }
    }
    
    // Setup service worker for caching and offline support
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('🌟 Service Worker registered for Divine Temple');
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            });
        }
    }
    
    // Preload critical resources
    preloadResources(resources) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.type) link.type = resource.type;
            document.head.appendChild(link);
        });
    }
    
    // Optimize CSS delivery
    optimizeCSSDelivery() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(link => {
            // Make non-critical CSS load asynchronously
            if (!link.hasAttribute('data-critical')) {
                link.rel = 'preload';
                link.as = 'style';
                link.onload = function() {
                    this.rel = 'stylesheet';
                };
            }
        });
    }
    
    // Defer non-critical JavaScript
    deferNonCriticalJS() {
        const scripts = document.querySelectorAll('script[data-defer]');
        scripts.forEach(script => {
            script.defer = true;
        });
    }
}

// Resource compression and optimization utilities
class ResourceOptimizer {
    // Compress CSS by removing unnecessary whitespace and comments
    static compressCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Compress whitespace
            .replace(/;\s*}/g, '}') // Remove last semicolon in blocks
            .replace(/\s*{\s*/g, '{') // Clean opening braces
            .replace(/}\s*/g, '}') // Clean closing braces
            .replace(/:\s*/g, ':') // Clean colons
            .replace(/;\s*/g, ';') // Clean semicolons
            .trim();
    }
    
    // Minify JavaScript (basic minification)
    static minifyJS(js) {
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/\/\/.*$/gm, '') // Remove single-line comments
            .replace(/\s+/g, ' ') // Compress whitespace
            .replace(/;\s*}/g, '}') // Clean semicolons before closing braces
            .trim();
    }
    
    // Create optimized image loading
    static createOptimizedImage(src, alt, className = '') {
        const img = document.createElement('img');
        img.dataset.src = src;
        img.alt = alt;
        img.className = className;
        img.loading = 'lazy';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // Add placeholder while loading
        img.src = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1a2e"/>
                <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#d4af37" text-anchor="middle" dy=".3em">
                    ✨ Loading Sacred Image ✨
                </text>
            </svg>
        `);
        
        return img;
    }
}

// Initialize performance optimization
const performanceOptimizer = new PerformanceOptimizer();

// Export for use in other modules
window.PerformanceOptimizer = PerformanceOptimizer;
window.ResourceOptimizer = ResourceOptimizer;