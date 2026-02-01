# Mailchimp Email Automation Setup for Eden Consciousness

## Prerequisites
- Mailchimp Account (https://mailchimp.com)
- Firebase Cloud Functions
- API Keys from both services

## Step 1: Get Mailchimp API Key

1. Go to Mailchimp Account Settings → Extras → API Keys
2. Create new API key
3. Copy it (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1`)

## Step 2: Create Mailchimp Audience

1. Go to **Audiences** in Mailchimp
2. Create audience named "Eden Consciousness"
3. Get **Audience ID** from settings (format: `abc123def456`)

## Step 3: Set Up Firebase Function for Email Integration

Configure environment variables:
```bash
firebase functions:config:set mailchimp.api_key="YOUR_API_KEY" mailchimp.audience_id="YOUR_AUDIENCE_ID"
firebase deploy --only functions
```

## Step 4: Create Email Sequences in Mailchimp

### Welcome Sequence (5 emails)

**Email 1: Welcome to Eden** (sent immediately)
- Subject: "Welcome to Eden - Your Consciousness Awaits ✨"
- Content:
  - Warm welcome message
  - Explain 4-phase journey
  - Link to first meditation
  - Free resources included

**Email 2: Start Your Journey** (sent 1 day later)
- Subject: "Begin Your 4-Phase Awakening"
- Content:
  - Overview of Phase 1: Awakening
  - Link to Phase 1 materials
  - Meditation recommendation
  - FAQ link

**Email 3: Deepen Your Practice** (sent 3 days later)
- Subject: "3 Ways to Accelerate Your Awakening"
- Content:
  - Daily practice tips
  - Community introduction
  - Testimonials from other members
  - Premium upgrade CTA

**Email 4: Premium Invitation** (sent 5 days later)
- Subject: "Join 1000+ Members in Full Transformation"
- Content:
  - Comparison: Free vs Premium
  - Success stories
  - Premium features deep-dive
  - Limited-time offer (if applicable)

**Email 5: Special Offer** (sent 7 days later)
- Subject: "You're Invited: Premium Access at $9.99/month"
- Content:
  - 7-day recap
  - Premium benefits
  - Money-back guarantee
  - Join button

## Step 5: Create Segmented Campaigns

### Segment 1: Free Users
- Trigger: Not premium
- Emails:
  - Weekly insights (Mondays)
  - Community highlights (Wednesdays)
  - Premium upgrade reminder (Fridays)

### Segment 2: Premium Users
- Trigger: premium = true
- Emails:
  - Weekly digest with advanced content
  - New meditation recommendations
  - Community events
  - XP/achievement updates
  - Advanced teachings

### Segment 3: Inactive Users
- Trigger: Last opened email > 14 days ago
- Emails:
  - Re-engagement message
  - What they're missing
  - Meditation starter guide
  - Special comeback offer

## Step 6: Cloud Function for Automation

```javascript
// functions/mailchimpIntegration.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mailchimp = require('@mailchimp/mailchimp_marketing');

admin.initializeApp();
const db = admin.firestore();

mailchimp.setConfig({
  apiKey: process.env.mailchimp.api_key,
  server: 'us1' // or your region
});

// Add user to Mailchimp on signup
exports.onUserSignup = functions.auth.user().onCreate(async (user) => {
  try {
    await mailchimp.lists.addListMember(process.env.mailchimp.audience_id, {
      email_address: user.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: user.displayName || 'Sacred Seeker',
        SIGNUP_DATE: new Date().toISOString()
      },
      tags: ['new_member', 'free_plan']
    });

    console.log(`✅ Added ${user.email} to Mailchimp`);

    // Trigger welcome sequence
    await triggerWelcomeSequence(user.email);
  } catch (error) {
    console.error('Error adding to Mailchimp:', error);
  }
});

// Update Mailchimp when user goes premium
exports.onUserUpgradePremium = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (!before.premium && after.premium) {
      try {
        await mailchimp.lists.updateListMember(
          process.env.mailchimp.audience_id,
          after.email,
          {
            merge_fields: {
              PREMIUM: 'yes',
              UPGRADE_DATE: new Date().toISOString()
            },
            tags: ['premium_member']
          }
        );

        console.log(`✅ Updated ${after.email} to premium in Mailchimp`);

        // Send premium welcome email
        await sendCustomEmail(after.email, 'premium_welcome');
      } catch (error) {
        console.error('Error updating Mailchimp:', error);
      }
    }
  });

// Trigger welcome sequence
async function triggerWelcomeSequence(email) {
  try {
    // Queue first welcome email through Firebase task queue
    // This will be handled by Mailchimp automation
    console.log(`🚀 Welcome sequence triggered for ${email}`);
  } catch (error) {
    console.error('Error triggering welcome sequence:', error);
  }
}

// Send custom email
async function sendCustomEmail(email, templateId) {
  try {
    await mailchimp.messages.send({
      message: {
        to: [{ email }],
        template_name: templateId
      }
    });
    console.log(`✅ Sent ${templateId} to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
```

## Step 7: Configure Frontend

Add this to signup handler:
```javascript
// After successful signup
firebase.firestore().collection('users').doc(user.uid).set({
  // ... other fields
  mailchimpEmail: user.email,
  emailOptIn: true,
  joinedAt: new Date()
});
```

## Step 8: Weekly Digest Setup

1. In Mailchimp, create automation:
   - **Name**: "Weekly Digest - Free Members"
   - **Trigger**: Subscribed + tag: "free_plan"
   - **Schedule**: Every Monday at 8 AM
   - **Content**: 
     - Meditation recommendation
     - Weekly insight
     - Community highlight
     - Premium upgrade CTA

2. Create premium version:
   - **Name**: "Weekly Digest - Premium Members"
   - **Trigger**: Subscribed + tag: "premium_member"
   - **Content**:
     - Advanced teaching
     - Exclusive meditation
     - Community events
     - New features

## Step 9: Engagement Tracking

Add tracking to emails:
- Click tracking
- Open tracking
- Conversion tracking (link to purchase page)

Monitor in Mailchimp dashboard:
- Open rates
- Click rates
- Conversions
- Unsubscribe rates

## Step 10: Test Automation

1. Create test email address
2. Sign up as free user
3. Verify all 5 welcome emails received
4. Upgrade to premium
5. Verify premium sequence received
6. Check Mailchimp audience shows correct tags and data

## Email Metrics to Monitor

- Welcome series open rate: Target 40%+
- Click-through rate: Target 5%+
- Premium upgrade conversion: Track from email
- Unsubscribe rate: Keep below 0.5%
- Engagement score: Aim for 70%+

## Troubleshooting

**Emails not received:**
- Check Mailchimp API key is correct
- Verify audience ID matches
- Check Firebase Function logs

**Wrong data in Mailchimp:**
- Verify merge field names match exactly
- Check data types (date format, etc)
- Clear Mailchimp cache

**Automation not triggering:**
- Verify trigger conditions in Mailchimp
- Check tags are applied correctly
- Review Mailchimp activity log

## Resources

- Mailchimp API Docs: https://mailchimp.com/developer
- Firebase + Mailchimp Integration: https://firebase.google.com/docs/functions
- Mailchimp Email Templates: https://mailchimp.com/help/email-templates/
