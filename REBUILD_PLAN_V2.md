# Eden Consciousness Rebuild Plan V2

## Current Position
- New direction confirmed: rebuild cleanly, one step at a time, no deployment until full pass is complete.
- New/updated public foundation pages already in motion:
  - home.html
  - about.html
  - books.html
  - music.html
  - join.html
  - division-i.html
- Lessons 1-5 already exist and are the onboarding curriculum:
  - lesson-01-what-is-programming.html
  - lesson-02-the-walk-back.html
  - lesson-03-ini-year.html
  - lesson-04-aligned-manifestation.html
  - lesson-05-first-decision.html

## Core Product Decision
All members enter through Phase 1 first.

Phase 1 is the mandatory onboarding path into Sacred Membership and includes:
1. Account creation/login
2. Guided Division I introduction
3. Completion tracking for Lessons 1-5
4. Saved progress and return continuity

No member should bypass Phase 1 on first entry.

## Phase Architecture (Execution Order)

### Phase A - Foundation Lock (Now)
Goal: lock flow, naming, and data model before touching more pages.

Deliverables:
- Canonical entry flow map documented.
- Role naming normalized in UI text to Sacred Member.
- Progress schema approved for Firebase.
- "No deploy" remains active.

### Phase B - Authentication + Onboarding Gate (Priority 1)
Goal: every member can login/register and continue where they left off in Phase 1.

Scope:
- Login/register UX and route behavior.
- Auth guard for onboarding-required users.
- Persist phase progress in Firestore.
- Redirect rules so new members always start at Division I.

Primary files to implement/update:
- register.html
- login page (new if missing, or repurpose existing auth page)
- auth-system.js
- js/firebase-auth.js
- js/auth-guard.js
- js/firebase-config.js

Data model (proposed):
- users/{uid}
  - membershipTier: free | sacred
  - onboardingStatus: not_started | in_progress | completed
  - phase1:
    - divisionIntroViewed: boolean
    - lessonsCompleted: ["lesson-01", ...]
    - currentLesson: string
    - completedAt: timestamp | null
    - updatedAt: timestamp

Route behavior (proposed):
- Unauthenticated user:
  - Can view public pages.
  - Prompted to login when starting saved progress journey.
- Authenticated + onboardingStatus not completed:
  - Redirect to division-i.html and next incomplete lesson.
- Authenticated + onboardingStatus completed:
  - Normal access to Sacred Member areas.

### Phase C - Phase 1 Lesson Experience Hardening (Priority 2)
Goal: lessons feel connected, trackable, and intentional.

Scope:
- Add progress component on each lesson page.
- Mark-complete actions with Firestore writes.
- Previous/Next nav and resume state.
- End-of-lesson CTA consistency.

Primary files:
- lesson-01-what-is-programming.html
- lesson-02-the-walk-back.html
- lesson-03-ini-year.html
- lesson-04-aligned-manifestation.html
- lesson-05-first-decision.html
- shared JS helper for progress tracking (new, recommended)

### Phase D - Sacred Member Transition (Priority 3)
Goal: smooth transition from free onboarding to Sacred Member commitment.

Scope:
- Update join conversion logic and CTAs after Lesson 5.
- Keep compatibility anchors where needed (#premium), but UI copy says Sacred Member.
- Ensure payment-success/premium-success pages reflect Sacred Member terminology.

Primary files:
- join.html
- payment-success.html
- premium-success.html
- pricing.html
- js/premium-checkout.js

### Phase E - Full Site Revamp Batch-by-Batch (Priority 4)
Goal: complete all remaining pages in controlled batches with no scope drift.

Batch order:
1. Public brand pages (faq/contact/features/events/testimonials)
2. Dashboard/member shell pages
3. Sections hub + section pages
4. Legal/policy/system pages

Each batch must include:
- Visual and copy pass
- Link integrity pass
- Terminology pass (Sacred Member)
- Mobile pass

## Non-Negotiable Standards
- One page/system at a time unless explicitly grouped.
- No deployment until full QA pass is complete.
- Keep existing technical anchors/API names where needed for compatibility.
- User-facing labels should use Sacred Member terminology.

## QA Gates Per Step
Before marking any step done:
1. No console-breaking JS errors on affected page.
2. No broken internal links introduced.
3. Responsive check at mobile + desktop widths.
4. Auth/progress behavior validated for logged-out and logged-in states.
5. Copy consistency check for Sacred Member naming.

## Immediate Next Action (Single-Step Start)
Implement Phase B Step 1:
- Define and build the canonical login/register entry flow (UI + redirect rules), then wire initial Firestore progress record creation on first login.

This creates the backbone needed to save Phase 1 progress for all members.
