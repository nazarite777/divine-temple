/**
 * Divine Temple SEO Optimization Suite
 * Comprehensive SEO enhancement for maximum visibility and discoverability
 */

class SEOOptimizer {
    constructor() {
        this.structuredData = {};
        this.metaTags = new Map();
        this.sitemapData = [];
        this.currentSection = 'dashboard';
        
        this.init();
    }

    init() {
        this.setupBasicMeta();
        this.setupOpenGraph();
        this.setupTwitterCards();
        this.setupStructuredData();
        this.setupCanonicalUrls();
        this.optimizeHeadingStructure();
        this.setupDynamicMeta();
        
        console.log('🔍 SEO Optimizer initialized');
    }

    // ================================
    // BASIC META TAGS
    // ================================

    setupBasicMeta() {
        const baseUrl = window.location.origin + window.location.pathname;
        
        const metaTags = [
            { name: 'description', content: 'Divine Temple - Your spiritual sanctuary for consciousness expansion, oracle guidance, sacred geometry, and enlightenment. Explore mystical teachings and divine wisdom.' },
            { name: 'keywords', content: 'spiritual guidance, oracle cards, sacred geometry, consciousness expansion, mystical teachings, divine wisdom, enlightenment, meditation, spiritual growth, sacred books' },
            { name: 'author', content: 'Divine Temple' },
            { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
            { name: 'googlebot', content: 'index, follow' },
            { name: 'theme-color', content: '#8B5CF6' },
            { name: 'msapplication-TileColor', content: '#8B5CF6' },
            { name: 'language', content: 'en' },
            { name: 'geo.region', content: 'US' },
            { name: 'geo.placename', content: 'Global' },
            { name: 'distribution', content: 'global' },
            { name: 'rating', content: 'general' },
            { name: 'revisit-after', content: '7 days' }
        ];

        metaTags.forEach(tag => {
            this.setMetaTag(tag.name, tag.content, 'name');
        });

        // HTTP-EQUIV tags
        this.setMetaTag('content-type', 'text/html; charset=UTF-8', 'http-equiv');
        this.setMetaTag('content-language', 'en', 'http-equiv');
        this.setMetaTag('expires', 'never', 'http-equiv');
        this.setMetaTag('pragma', 'no-cache', 'http-equiv');
        this.setMetaTag('cache-control', 'public, max-age=3600', 'http-equiv');
    }

    setMetaTag(name, content, type = 'name') {
        let tag = document.querySelector(`meta[${type}="${name}"]`);
        
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(type, name);
            document.head.appendChild(tag);
        }
        
        tag.setAttribute('content', content);
        this.metaTags.set(name, content);
    }

    // ================================
    // OPEN GRAPH PROTOCOL
    // ================================

    setupOpenGraph() {
        const baseUrl = window.location.origin + window.location.pathname;
        
        const ogTags = [
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'Divine Temple' },
            { property: 'og:title', content: 'Divine Temple - Spiritual Sanctuary for Consciousness Expansion' },
            { property: 'og:description', content: 'Explore divine wisdom through oracle cards, sacred geometry, mystical teachings, and spiritual guidance. Your journey to enlightenment begins here.' },
            { property: 'og:url', content: baseUrl },
            { property: 'og:image', content: `${baseUrl}/images/divine-temple-og.jpg` },
            { property: 'og:image:alt', content: 'Divine Temple - Spiritual sanctuary with mystical elements' },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:type', content: 'image/jpeg' },
            { property: 'og:locale', content: 'en_US' },
            { property: 'og:updated_time', content: new Date().toISOString() },
            { property: 'article:author', content: 'Divine Temple' },
            { property: 'article:publisher', content: 'Divine Temple' },
            { property: 'article:section', content: 'Spirituality' },
            { property: 'article:tag', content: 'spirituality,consciousness,oracle,sacred geometry,mysticism' }
        ];

        ogTags.forEach(tag => {
            this.setOpenGraphTag(tag.property, tag.content);
        });
    }

    setOpenGraphTag(property, content) {
        let tag = document.querySelector(`meta[property="${property}"]`);
        
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            document.head.appendChild(tag);
        }
        
        tag.setAttribute('content', content);
    }

    // ================================
    // TWITTER CARDS
    // ================================

    setupTwitterCards() {
        const baseUrl = window.location.origin + window.location.pathname;
        
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@DivinTemple' },
            { name: 'twitter:creator', content: '@DivinTemple' },
            { name: 'twitter:title', content: 'Divine Temple - Spiritual Sanctuary for Consciousness Expansion' },
            { name: 'twitter:description', content: 'Explore divine wisdom through oracle cards, sacred geometry, mystical teachings, and spiritual guidance.' },
            { name: 'twitter:image', content: `${baseUrl}/images/divine-temple-twitter.jpg` },
            { name: 'twitter:image:alt', content: 'Divine Temple - Your spiritual sanctuary for growth and enlightenment' },
            { name: 'twitter:domain', content: window.location.hostname },
            { name: 'twitter:url', content: baseUrl }
        ];

        twitterTags.forEach(tag => {
            this.setMetaTag(tag.name, tag.content, 'name');
        });
    }

    // ================================
    // STRUCTURED DATA (JSON-LD)
    // ================================

    setupStructuredData() {
        this.createOrganizationSchema();
        this.createWebsiteSchema();
        this.createBreadcrumbSchema();
        this.createFAQSchema();
        this.createServiceSchema();
    }

    createOrganizationSchema() {
        const baseUrl = window.location.origin + window.location.pathname;
        
        const organization = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Divine Temple",
            "alternateName": "Divine Temple Spiritual Sanctuary",
            "description": "A spiritual sanctuary dedicated to consciousness expansion, divine wisdom, and mystical teachings.",
            "url": baseUrl,
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/images/divine-temple-logo.png`,
                "width": 400,
                "height": 400
            },
            "sameAs": [
                "https://twitter.com/DivinTemple",
                "https://facebook.com/DivinTemple",
                "https://instagram.com/DivinTemple"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "spiritual guidance",
                "areaServed": "Worldwide",
                "availableLanguage": "English"
            },
            "founder": {
                "@type": "Person",
                "name": "Divine Temple Founder"
            },
            "foundingDate": "2024",
            "knowsAbout": [
                "Spiritual Guidance",
                "Oracle Cards",
                "Sacred Geometry",
                "Consciousness Expansion",
                "Mystical Teachings",
                "Divine Wisdom",
                "Meditation",
                "Enlightenment"
            ]
        };

        this.addStructuredData('organization', organization);
    }

    createWebsiteSchema() {
        const baseUrl = window.location.origin + window.location.pathname;
        
        const website = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Divine Temple",
            "alternateName": "Divine Temple Spiritual Sanctuary",
            "description": "Your spiritual sanctuary for consciousness expansion and divine wisdom",
            "url": baseUrl,
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${baseUrl}/?search={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            },
            "about": {
                "@type": "Thing",
                "name": "Spirituality and Consciousness",
                "description": "Spiritual practices, mystical teachings, and consciousness expansion"
            },
            "audience": {
                "@type": "Audience",
                "audienceType": "Spiritual seekers and consciousness explorers"
            },
            "inLanguage": "en-US",
            "isAccessibleForFree": true,
            "usageInfo": "Free access to spiritual guidance and teachings"
        };

        this.addStructuredData('website', website);
    }

    createBreadcrumbSchema() {
        const breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": window.location.origin + window.location.pathname
                }
            ]
        };

        this.addStructuredData('breadcrumbs', breadcrumbs);
    }

    createFAQSchema() {
        const faq = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is Divine Temple?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Divine Temple is a spiritual sanctuary dedicated to consciousness expansion, offering oracle cards, sacred geometry, mystical teachings, and divine wisdom for spiritual growth and enlightenment."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I access the oracle cards?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Navigate to the Oracle Cards section from the main dashboard. You can draw cards for guidance, perform various spreads, and journal your insights."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What spiritual content is available?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Divine Temple offers oracle cards, sacred books, spiritual videos, sacred geometry patterns, mystical teachings, meditation guides, and consciousness expansion content."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Is the content free to access?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Many features are freely accessible, with premium content available for deeper spiritual exploration and advanced teachings."
                    }
                }
            ]
        };

        this.addStructuredData('faq', faq);
    }

    createServiceSchema() {
        const baseUrl = window.location.origin + window.location.pathname;
        
        const service = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Spiritual Guidance Services",
            "description": "Comprehensive spiritual guidance through oracle cards, sacred teachings, and consciousness expansion tools",
            "provider": {
                "@type": "Organization",
                "name": "Divine Temple"
            },
            "areaServed": "Worldwide",
            "availableChannel": {
                "@type": "ServiceChannel",
                "serviceUrl": baseUrl,
                "serviceSupportedBy": {
                    "@type": "WebSite",
                    "url": baseUrl
                }
            },
            "category": "Spiritual Services",
            "serviceType": "Spiritual Guidance",
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free spiritual guidance and premium content available"
            }
        };

        this.addStructuredData('service', service);
    }

    addStructuredData(key, data) {
        this.structuredData[key] = data;
        
        // Remove existing script if present
        const existingScript = document.querySelector(`script[data-schema="${key}"]`);
        if (existingScript) {
            existingScript.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-schema', key);
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    // ================================
    // CANONICAL URLS
    // ================================

    setupCanonicalUrls() {
        this.updateCanonicalUrl();
        
        // Update canonical URL when section changes
        window.addEventListener('sectionChange', (e) => {
            this.updateCanonicalUrl(e.detail.section);
        });
    }

    updateCanonicalUrl(section = '') {
        const baseUrl = window.location.origin + window.location.pathname;
        const canonicalUrl = section ? `${baseUrl}#${section}` : baseUrl;
        
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        
        canonical.href = canonicalUrl;
        this.currentSection = section;
    }

    // ================================
    // HEADING STRUCTURE OPTIMIZATION
    // ================================

    optimizeHeadingStructure() {
        // Ensure proper heading hierarchy
        this.validateHeadingHierarchy();
        this.addMissingHeadings();
        this.optimizeHeadingContent();
    }

    validateHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const issues = [];
        let lastLevel = 0;

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (index === 0 && level !== 1) {
                issues.push('First heading should be H1');
            }
            
            if (level > lastLevel + 1) {
                issues.push(`Heading level skip detected: ${heading.tagName} after H${lastLevel}`);
            }
            
            lastLevel = level;
        });

        if (issues.length > 0) {
            console.warn('Heading hierarchy issues:', issues);
        }

        return issues;
    }

    addMissingHeadings() {
        // Ensure each section has proper headings
        document.querySelectorAll('.section-container').forEach(section => {
            const sectionId = section.id;
            const existingHeading = section.querySelector('h1, h2, h3');
            
            if (!existingHeading && sectionId) {
                const heading = document.createElement('h2');
                heading.textContent = this.generateHeadingFromId(sectionId);
                heading.className = 'section-heading';
                section.insertBefore(heading, section.firstChild);
            }
        });
    }

    generateHeadingFromId(id) {
        const headingMap = {
            'oracle-cards': 'Oracle Cards - Divine Guidance',
            'sacred-books': 'Sacred Books - Mystical Teachings',
            'videos-media': 'Videos & Media - Spiritual Content',
            'sacred-geometry': 'Sacred Geometry - Divine Patterns',
            'meditation-guides': 'Meditation Guides - Inner Peace',
            'astrology': 'Astrology - Celestial Wisdom',
            'numerology': 'Numerology - Sacred Numbers',
            'crystal-healing': 'Crystal Healing - Earth Energy',
            'chakra-balancing': 'Chakra Balancing - Energy Centers',
            'dream-interpretation': 'Dream Interpretation - Subconscious Messages',
            'tarot-reading': 'Tarot Reading - Mystical Insights',
            'energy-healing': 'Energy Healing - Spiritual Restoration',
            'spiritual-blog': 'Spiritual Blog - Divine Insights',
            'community': 'Community - Spiritual Connection'
        };

        return headingMap[id] || id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    optimizeHeadingContent() {
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
            const text = heading.textContent.trim();
            
            // Ensure headings are descriptive
            if (text.length < 10) {
                const section = heading.closest('.section-container');
                if (section && section.id) {
                    const enhancedText = this.enhanceHeadingText(text, section.id);
                    heading.textContent = enhancedText;
                }
            }
        });
    }

    enhanceHeadingText(text, sectionId) {
        const enhancements = {
            'oracle-cards': 'Oracle Cards - Divine Guidance & Spiritual Insights',
            'sacred-books': 'Sacred Books - Ancient Wisdom & Mystical Teachings',
            'videos-media': 'Spiritual Videos & Media - Enlightening Content',
            'sacred-geometry': 'Sacred Geometry - Divine Patterns & Cosmic Mathematics'
        };

        return enhancements[sectionId] || text;
    }

    // ================================
    // DYNAMIC META UPDATES
    // ================================

    setupDynamicMeta() {
        // Update meta based on current section
        window.addEventListener('sectionChange', (e) => {
            this.updateDynamicMeta(e.detail.section);
        });
    }

    updateDynamicMeta(section) {
        const sectionMeta = this.getSectionMeta(section);
        
        // Update title
        document.title = sectionMeta.title;
        
        // Update description
        this.setMetaTag('description', sectionMeta.description);
        
        // Update Open Graph
        this.setOpenGraphTag('og:title', sectionMeta.title);
        this.setOpenGraphTag('og:description', sectionMeta.description);
        this.setOpenGraphTag('og:url', `${window.location.origin}${window.location.pathname}#${section}`);
        
        // Update Twitter Cards
        this.setMetaTag('twitter:title', sectionMeta.title);
        this.setMetaTag('twitter:description', sectionMeta.description);
        
        // Update breadcrumbs
        this.updateBreadcrumbs(section, sectionMeta.title);
    }

    getSectionMeta(section) {
        const meta = {
            'oracle-cards': {
                title: 'Oracle Cards - Divine Guidance | Divine Temple',
                description: 'Draw oracle cards for spiritual guidance and divine insights. Interactive spreads, card meanings, and journaling for your spiritual journey.'
            },
            'sacred-books': {
                title: 'Sacred Books - Mystical Teachings | Divine Temple',
                description: 'Explore ancient wisdom and sacred texts with interactive reading features, note-taking, and study groups for spiritual growth.'
            },
            'videos-media': {
                title: 'Spiritual Videos & Media | Divine Temple',
                description: 'Watch curated spiritual content, meditation guides, and enlightening videos for consciousness expansion and spiritual development.'
            },
            'sacred-geometry': {
                title: 'Sacred Geometry - Divine Patterns | Divine Temple',
                description: 'Discover the mathematical language of the universe through sacred geometry patterns, symbols, and their mystical meanings.'
            },
            'meditation-guides': {
                title: 'Meditation Guides - Inner Peace | Divine Temple',
                description: 'Guided meditations for mindfulness, spiritual growth, and consciousness expansion. Find your path to inner peace.'
            },
            'astrology': {
                title: 'Astrology - Celestial Wisdom | Divine Temple',
                description: 'Explore astrological insights, birth chart readings, and cosmic influences on your spiritual journey.'
            },
            'numerology': {
                title: 'Numerology - Sacred Numbers | Divine Temple',
                description: 'Discover the mystical significance of numbers and their influence on your spiritual path and life purpose.'
            },
            'crystal-healing': {
                title: 'Crystal Healing - Earth Energy | Divine Temple',
                description: 'Harness the healing power of crystals and gemstones for energy alignment and spiritual cleansing.'
            }
        };

        return meta[section] || {
            title: 'Divine Temple - Spiritual Sanctuary for Consciousness Expansion',
            description: 'Your spiritual sanctuary for divine wisdom, consciousness expansion, and mystical teachings. Explore oracle cards, sacred geometry, and more.'
        };
    }

    updateBreadcrumbs(section, title) {
        const breadcrumbs = this.structuredData.breadcrumbs;
        
        // Reset to home
        breadcrumbs.itemListElement = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": window.location.origin + window.location.pathname
            }
        ];

        // Add current section
        if (section) {
            breadcrumbs.itemListElement.push({
                "@type": "ListItem",
                "position": 2,
                "name": title,
                "item": `${window.location.origin}${window.location.pathname}#${section}`
            });
        }

        this.addStructuredData('breadcrumbs', breadcrumbs);
    }

    // ================================
    // SITEMAP GENERATION
    // ================================

    generateSitemap() {
        const baseUrl = window.location.origin + window.location.pathname;
        const sections = [
            'oracle-cards',
            'sacred-books', 
            'videos-media',
            'sacred-geometry',
            'meditation-guides',
            'astrology',
            'numerology',
            'crystal-healing',
            'chakra-balancing',
            'dream-interpretation',
            'tarot-reading',
            'energy-healing',
            'spiritual-blog',
            'community'
        ];

        const sitemap = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Divine Temple Sitemap",
            "description": "Complete navigation of Divine Temple spiritual sections",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "url": baseUrl,
                    "description": "Divine Temple main dashboard and spiritual sanctuary entrance"
                }
            ]
        };

        sections.forEach((section, index) => {
            const meta = this.getSectionMeta(section);
            sitemap.itemListElement.push({
                "@type": "ListItem",
                "position": index + 2,
                "name": meta.title,
                "url": `${baseUrl}#${section}`,
                "description": meta.description
            });
        });

        return sitemap;
    }

    // ================================
    // PERFORMANCE & ANALYTICS
    // ================================

    addAnalyticsTags() {
        // Google Analytics 4
        if (window.gtag) {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
                content_group1: 'Spiritual Content',
                content_group2: this.currentSection || 'Dashboard'
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'PageView', {
                content_category: 'Spiritual',
                content_name: document.title
            });
        }
    }

    trackSectionView(section) {
        // Google Analytics event
        if (window.gtag) {
            gtag('event', 'section_view', {
                section_name: section,
                engagement_time_msec: Date.now()
            });
        }

        // Custom tracking
        console.log(`📊 Section view tracked: ${section}`);
    }

    // ================================
    // SEO VALIDATION & REPORTING
    // ================================

    validateSEO() {
        const issues = [];
        const warnings = [];
        const recommendations = [];

        // Title validation
        const title = document.title;
        if (!title || title.length < 30) {
            issues.push('Title too short or missing');
        } else if (title.length > 60) {
            warnings.push('Title may be truncated in search results');
        }

        // Meta description validation
        const description = this.metaTags.get('description');
        if (!description || description.length < 120) {
            issues.push('Meta description too short or missing');
        } else if (description.length > 160) {
            warnings.push('Meta description may be truncated');
        }

        // Heading structure
        const headingIssues = this.validateHeadingHierarchy();
        issues.push(...headingIssues);

        // Images without alt text
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
            issues.push(`${imagesWithoutAlt.length} images missing alt text`);
        }

        // Internal links
        const internalLinks = document.querySelectorAll('a[href^="#"], a[href^="/"]');
        if (internalLinks.length < 5) {
            recommendations.push('Add more internal links for better navigation');
        }

        // Structured data validation
        if (Object.keys(this.structuredData).length < 3) {
            recommendations.push('Add more structured data types');
        }

        return {
            issues,
            warnings,
            recommendations,
            score: this.calculateSEOScore(issues, warnings),
            lastCheck: new Date().toISOString()
        };
    }

    calculateSEOScore(issues, warnings) {
        let score = 100;
        score -= issues.length * 10;
        score -= warnings.length * 5;
        return Math.max(0, score);
    }

    generateSEOReport() {
        const validation = this.validateSEO();
        
        return {
            title: document.title,
            description: this.metaTags.get('description'),
            currentSection: this.currentSection,
            metaTags: Array.from(this.metaTags.entries()),
            structuredDataTypes: Object.keys(this.structuredData),
            validation,
            recommendations: [
                'Ensure all images have descriptive alt text',
                'Add more internal linking between sections',
                'Create unique meta descriptions for each section',
                'Implement FAQ sections for common questions',
                'Add review and rating structured data',
                'Create topic clusters around spiritual themes'
            ],
            features: [
                'Dynamic meta tags',
                'Open Graph optimization',
                'Twitter Cards',
                'Structured data (JSON-LD)',
                'Canonical URLs',
                'Sitemap generation',
                'Heading hierarchy optimization',
                'SEO validation'
            ]
        };
    }

    // Public API
    updateSection(section) {
        this.updateDynamicMeta(section);
        this.trackSectionView(section);
        
        // Dispatch event for other systems
        window.dispatchEvent(new CustomEvent('seoSectionUpdate', {
            detail: { section, timestamp: Date.now() }
        }));
    }
}

// Global initialization
window.SEOOptimizer = SEOOptimizer;

// Auto-initialize if not already done
if (!window.seoOptimizer) {
    window.seoOptimizer = new SEOOptimizer();
}

console.log('🔍 SEO Optimizer loaded and initialized');