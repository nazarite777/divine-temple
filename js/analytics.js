// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // Replace with actual GA4 measurement ID

// Custom Event Tracking Functions
function trackSignup(method) {
  gtag('event', 'sign_up', {'method': method});
}

function trackPurchase(value, currency = 'USD') {
  gtag('event', 'purchase', {
    'transaction_id': 'T_' + Date.now(),
    'value': value,
    'currency': currency,
    'coupon': 'FREE_TRIAL'
  });
}

function trackCommunityJoin() {
  gtag('event', 'view_item', {
    'items': [{
      'item_id': 'community',
      'item_name': 'Join Community',
      'item_category': 'engagement'
    }]
  });
}

function trackPhaseProgress(phase) {
  gtag('event', 'view_item', {
    'items': [{
      'item_id': 'phase_' + phase,
      'item_name': 'Phase ' + phase + ' Access',
      'item_category': 'journey'
    }]
  });
}

function trackButtonClick(buttonName, category = 'engagement') {
  gtag('event', 'view_item', {
    'items': [{
      'item_id': buttonName,
      'item_name': buttonName,
      'item_category': category
    }]
  });
}

function trackPageView(pageName, pageType = 'default') {
  gtag('event', 'page_view', {
    'page_title': pageName,
    'page_path': window.location.pathname
  });
}

function trackFormSubmission(formName) {
  gtag('event', 'form_submit', {
    'form_name': formName,
    'form_location': window.location.pathname
  });
}

// Auto-track all external link clicks
document.addEventListener('click', function(e) {
  let link = e.target.closest('a[href]');
  if (link && link.href && (link.href.includes('stripe.com') || link.href.includes('medium.com') || link.href.includes('gaia.com'))) {
    gtag('event', 'click', {
      'event_category': 'external_link',
      'event_label': link.href,
      'value': 1
    });
  }
});

// Track scroll depth
let scrollTracked = false;
window.addEventListener('scroll', function() {
  if (!scrollTracked && window.scrollY > window.innerHeight) {
    gtag('event', 'scroll', {
      'event_category': 'engagement',
      'event_label': 'page_scroll'
    });
    scrollTracked = true;
  }
});

// Track time on page
let timeStarted = Date.now();
window.addEventListener('beforeunload', function() {
  let timeSpent = Math.round((Date.now() - timeStarted) / 1000);
  if (timeSpent > 10) {
    gtag('event', 'engagement', {
      'time_spent_seconds': timeSpent,
      'page': window.location.pathname
    });
  }
});
