/**
 * Divine Temple Image Optimization
 * Sacred image processing for optimal spiritual experiences
 */

class ImageOptimizer {
    constructor() {
        this.supportedFormats = this.detectSupportedFormats();
        this.lazyLoadObserver = null;
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupResponsiveImages();
    }
    
    // Detect supported modern image formats
    detectSupportedFormats() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        
        const formats = {
            webp: false,
            avif: false,
            jpeg2000: false
        };
        
        // Check WebP support
        try {
            formats.webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch (e) {
            formats.webp = false;
        }
        
        // Check AVIF support (newer format)
        try {
            formats.avif = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        } catch (e) {
            formats.avif = false;
        }
        
        return formats;
    }
    
    // Setup intersection observer for lazy loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.lazyLoadObserver.unobserve(entry.target);
                    }
                });
            }, {
                // Load images 50px before they come into view
                rootMargin: '50px'
            });
            
            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.lazyLoadObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.loadImage(img);
            });
        }
    }
    
    // Load individual image with optimization
    loadImage(img) {
        const originalSrc = img.dataset.src;
        const optimizedSrc = this.getOptimizedImageUrl(originalSrc);
        
        // Create a new image to preload
        const newImg = new Image();
        newImg.onload = () => {
            img.src = optimizedSrc;
            img.classList.add('loaded');
            
            // Fade in effect
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '1';
        };
        
        newImg.onerror = () => {
            // Fallback to original if optimized version fails
            img.src = originalSrc;
            img.classList.add('loaded');
        };
        
        newImg.src = optimizedSrc;
    }
    
    // Get optimized image URL based on browser support
    getOptimizedImageUrl(originalUrl) {
        if (!originalUrl) return originalUrl;
        
        // If it's already an optimized format, return as-is
        if (originalUrl.includes('.webp') || originalUrl.includes('.avif')) {
            return originalUrl;
        }
        
        // Generate optimized URL based on supported formats
        const url = new URL(originalUrl, window.location.origin);
        const pathParts = url.pathname.split('.');
        const extension = pathParts.pop();
        const basePath = pathParts.join('.');
        
        // Prefer AVIF, then WebP, then original
        if (this.supportedFormats.avif) {
            return `${basePath}.avif`;
        } else if (this.supportedFormats.webp) {
            return `${basePath}.webp`;
        }
        
        return originalUrl;
    }
    
    // Optimize existing images on the page
    optimizeExistingImages() {
        document.querySelectorAll('img:not([data-src])').forEach(img => {
            if (!img.dataset.optimized) {
                this.optimizeImage(img);
                img.dataset.optimized = 'true';
            }
        });
    }
    
    // Optimize a single image element
    optimizeImage(img) {
        // Add loading attribute if not present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add size attributes if missing (helps with layout shift)
        if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
            img.onload = () => {
                img.setAttribute('width', img.naturalWidth);
                img.setAttribute('height', img.naturalHeight);
            };
        }
        
        // Add alt text if missing
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Divine Temple Sacred Image');
        }
        
        // Apply fade-in effect
        if (!img.classList.contains('loaded')) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            if (img.complete) {
                img.style.opacity = '1';
                img.classList.add('loaded');
            } else {
                img.onload = () => {
                    img.style.opacity = '1';
                    img.classList.add('loaded');
                };
            }
        }
    }
    
    // Setup responsive images with srcset
    setupResponsiveImages() {
        document.querySelectorAll('img[data-responsive]').forEach(img => {
            const baseSrc = img.dataset.responsive;
            const sizes = [400, 800, 1200, 1600];
            
            const srcset = sizes.map(size => {
                const optimizedUrl = this.getResponsiveImageUrl(baseSrc, size);
                return `${optimizedUrl} ${size}w`;
            }).join(', ');
            
            img.setAttribute('srcset', srcset);
            img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
        });
    }
    
    // Get responsive image URL for specific width
    getResponsiveImageUrl(baseSrc, width) {
        const url = new URL(baseSrc, window.location.origin);
        const pathParts = url.pathname.split('.');
        const extension = pathParts.pop();
        const basePath = pathParts.join('.');
        
        let format = extension;
        if (this.supportedFormats.avif) {
            format = 'avif';
        } else if (this.supportedFormats.webp) {
            format = 'webp';
        }
        
        return `${basePath}_${width}w.${format}`;
    }
    
    // Create optimized placeholder
    createPlaceholder(width = 400, height = 300, text = 'Loading...') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // Sacred gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f3460');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Sacred text
        ctx.fillStyle = '#d4af37';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✨ ' + text + ' ✨', width / 2, height / 2);
        
        return canvas.toDataURL();
    }
    
    // Monitor image loading performance
    monitorImagePerformance() {
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (entry.initiatorType === 'img') {
                        console.log(`🖼️ Image loaded: ${entry.name} (${Math.round(entry.duration)}ms)`);
                        
                        // Track slow loading images
                        if (entry.duration > 1000) {
                            console.warn(`⚠️ Slow image: ${entry.name} took ${Math.round(entry.duration)}ms`);
                        }
                    }
                });
            });
            
            perfObserver.observe({ entryTypes: ['resource'] });
        }
    }
    
    // Preload critical images
    preloadCriticalImages(imageUrls) {
        imageUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = this.getOptimizedImageUrl(url);
            document.head.appendChild(link);
        });
    }
    
    // Convert image to WebP if supported
    async convertToWebP(imageFile) {
        if (!this.supportedFormats.webp) {
            return imageFile;
        }
        
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(resolve, 'image/webp', 0.8);
            };
            
            img.src = URL.createObjectURL(imageFile);
        });
    }
    
    // Get image compression ratio recommendation
    getCompressionSettings(imageSize) {
        if (imageSize < 100000) return { quality: 0.9, format: 'original' }; // < 100KB
        if (imageSize < 500000) return { quality: 0.8, format: 'webp' }; // < 500KB
        if (imageSize < 1000000) return { quality: 0.7, format: 'webp' }; // < 1MB
        return { quality: 0.6, format: 'webp' }; // > 1MB
    }
}

// CSS for optimized image loading
const imageOptimizationCSS = `
/* Image optimization styles */
img {
    max-width: 100%;
    height: auto;
    transition: opacity 0.3s ease;
}

img[data-src] {
    opacity: 0;
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

img[data-src]::before {
    content: "✨ Loading Sacred Image ✨";
    color: #d4af37;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
}

img.loaded {
    opacity: 1;
}

img.loading-error {
    background: rgba(139, 95, 191, 0.1);
    border: 2px dashed #8b5fbf;
    min-height: 200px;
    position: relative;
}

img.loading-error::after {
    content: "🏛️ Sacred Image Temporarily Unavailable";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #8b5fbf;
    font-family: 'Inter', sans-serif;
    text-align: center;
    font-size: 14px;
}

/* Responsive image container */
.responsive-image-container {
    position: relative;
    overflow: hidden;
    border-radius: 15px;
}

.responsive-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.responsive-image-container:hover img {
    transform: scale(1.05);
}

/* Image loading skeleton */
.image-skeleton {
    background: linear-gradient(90deg, #1a1a2e 25%, #2a2a4e 50%, #1a1a2e 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 15px;
    min-height: 200px;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Progressive enhancement for supported formats */
.webp .no-webp-fallback { display: none; }
.no-webp .webp-image { display: none; }
.avif .no-avif-fallback { display: none; }
.no-avif .avif-image { display: none; }
`;

// Inject optimization CSS
const style = document.createElement('style');
style.textContent = imageOptimizationCSS;
document.head.appendChild(style);

// Initialize image optimization
const imageOptimizer = new ImageOptimizer();

// Add format detection classes to html element
document.documentElement.classList.add(
    imageOptimizer.supportedFormats.webp ? 'webp' : 'no-webp',
    imageOptimizer.supportedFormats.avif ? 'avif' : 'no-avif'
);

// Export for global use
window.ImageOptimizer = ImageOptimizer;

console.log('🖼️ Divine Temple Image Optimization Loaded', imageOptimizer.supportedFormats);