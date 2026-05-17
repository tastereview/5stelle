# 5stelle - Implementation Plan

> **IMPORTANT:** Read this file at the start of every new chat session. Follow tasks in order. Mark tasks as complete with `[x]` when done.

---

## Phase 1: Project Setup

### 1.1 Initialize Project
- [x] Create Next.js 14 project with App Router
- [x] Initialize Git repository
- [x] Create GitHub repository and push initial commit (repo: tastereview)
- [x] Connected to Netlify for automatic deployments (domain: 5stelle.app)

### 1.2 Install Dependencies
- [x] shadcn/ui, Framer Motion, @dnd-kit, qrcode + jspdf, nanoid, Stripe, Supabase, canvas-confetti, lucide-react

### 1.3 Configure Supabase
- [x] Create Supabase project + environment variables
- [x] Create client utilities (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- [x] Create database tables + RLS policies
- [x] Enable email/password authentication

### 1.4 Configure Stripe
- [x] Create Stripe account + product/price (€39/month, 7-day trial)
- [x] Set up environment variables (live keys configured)
- [x] Configure webhook in Stripe dashboard (endpoint: `https://5stelle.app/api/webhooks/stripe`)
- [x] Webhook secret configured

### 1.5 Project Structure
- [x] Create folder structure and TypeScript types
- [x] ~~Apply tweakcn theme customization~~ — not needed

---

## Phase 2: Authentication & Onboarding

### 2.1 Authentication Pages
- [x] Login page (`/login`) — email/password, error handling, redirect to dashboard
- [x] Signup page (`/signup`) — email/password with confirmation, auto-login, redirect to onboarding
- [x] Auth middleware (protect dashboard routes)
- [x] Password recovery flow — forgot-password page, auth callback, reset-password page
- [x] Configure custom SMTP in Supabase (Resend)

### 2.2 Restaurant Onboarding
- [x] Onboarding page (`/onboarding`) — restaurant name + slug, auto-create restaurant + default form

### 2.3 Auth Utilities
- [x] `useAuth` hook, `useRestaurant` hook, sign-out functionality

---

## Phase 3: Dashboard

### 3.1 Dashboard Layout
- [x] Sidebar navigation (Feedback, Modulo, QR Code, Impostazioni, Abbonamento)
- [x] User menu with sign out
- [x] Responsive mobile navigation (hamburger menu)

### 3.2 Dashboard Home (`/dashboard`)
- [x] Stats cards: ScoreRing (animated SVG, color-coded), sentiment bar, summary (total/today/week/last feedback), sentiment breakdown
- [x] ScoreRing component (`src/components/dashboard/ScoreRing.tsx`) — ease-out animation, green/yellow/red thresholds

### 3.3 Feedback List (`/dashboard/feedback`)
- [x] Fetch and display submissions (date, sentiment icon, first answer preview)
- [x] Click to expand full submission (detail modal with all Q&A, timestamp, table identifier)
- [x] Empty state when no submissions
- [x] Period filter (Oggi / 7 giorni / 30 giorni)
- [x] Sentiment filter (Great / Ok / Bad)
- [x] Date-grouped sections with headers ("Oggi", "Ieri", "lunedì 17 febbraio")
- [x] Active filters indicator with "Rimuovi filtri" button

---

## Phase 4: Form Builder

### 4.1 Form Builder Page
- [x] Form builder page (`/dashboard/form-builder`)
- [x] Template selector (Quick & Simple, Feedback Dettagliato) with confirmation dialog
- [x] Sortable question list with @dnd-kit drag & drop
- [x] Question items: type icon, label, required indicator, drag handle, edit/delete buttons
- [x] Question editor (side panel): label, description, type, required toggle, options editor
- [x] Add question menu with type selector, max 6 questions enforced
- [x] Reward text editor with auto-save

---

## Phase 5: Customer Feedback Flow

### 5.1 Route & Layout
- [x] Route: `/r/[restaurantSlug]/[formId]/[index]/page.tsx`
- [x] Redirect from `/r/[slug]/[formId]` to `/r/[slug]/[formId]/1`
- [x] Full-screen centered layout, mobile-optimized, restaurant branding
- [x] `force-dynamic` on question and reward pages to prevent stale data caching

### 5.2 Question Flow
- [x] Progress bar with percentage + animated width
- [x] Framer Motion slide animations (AnimatePresence)
- [x] Field components: SentimentField, StarRatingField, OpenTextField, MultipleChoiceField, SingleChoiceField
- [x] Navigation: Back/Next buttons, "Completa" on last question, loading states

### 5.3 Answer Persistence
- [x] Create submission on first question, save answers on "Next"
- [x] Track overall_sentiment from sentiment question
- [x] Update submission with completed_at on final submit
- [x] Table identifier decoded from `?t=` URL param and stored in submission

### 5.4 Review Prompt Screen
- [x] Review prompt page (`/r/[slug]/[formId]/review`) — intermediate screen before reward
- [x] Only shows when sentiment === 'great', otherwise redirects to reward
- [x] Primary platform CTA with animated gold border (Framer Motion)
- [x] Secondary review platforms as smaller full-width buttons
- [x] 10-second countdown on "Continua" button; clicking any link also unlocks it
- [x] `primary_platform` column on restaurants table + star toggle in LinksClient

### 5.5 Reward Screen
- [x] Reward page (`/r/[slug]/[formId]/reward`) with confetti animation (3 timed bursts)
- [x] Display reward text from form settings
- [x] Always show social platform buttons as "Seguici" section
- [x] Review platform buttons removed (moved to review prompt screen)

---

## Phase 6: QR Code Generation

### 6.1 General QR Code
- [x] QR code page (`/dashboard/qr-codes`)
- [x] Generate QR with `qrcode` library (error correction H)
- [x] Display preview + encoded URL
- [x] PDF download with jspdf (restaurant name + instruction text)

### 6.2 Table QR Codes
- [x] `tables` DB table with RLS (owner-only CRUD)
- [x] TableManager component — add/delete tables with auto-generated URL-safe identifiers
- [x] Per-table QR grid on QR codes page
- [x] Table identifier base64url-encoded in URL as `?t=...` (encodeTableId/decodeTableId in `src/lib/utils.ts`)
- [x] Individual table QR PDF download
- [x] Bulk "Scarica tutti (PDF)" download

---

## Phase 7: Settings

### 7.1 Settings Page
- [x] Settings page (`/dashboard/settings`) — Restaurant Info + Social Links sections

### 7.2 Restaurant Info
- [x] Edit restaurant name and slug
- [ ] Upload logo (Supabase Storage) — skipped for MVP
- [x] Save button with loading state

### 7.3 Flexible Social Links
- [x] Replaced 4 hardcoded social columns with single `social_links` JSONB column on restaurants
- [x] 11 platforms defined in `src/lib/constants/platforms.ts`:
  - Review: Google, TripAdvisor, TheFork, Yelp, Trustpilot
  - Social: Instagram, Facebook, TikTok, YouTube, X/Twitter, LinkedIn
  - Each with: icon, name, category, placeholder, buildUrl(), buttonColor
- [x] Settings page dynamically renders platforms — 6 defaults always shown, extras addable
- [x] Google uses GooglePlaceIdFinder component (stores Place ID, not URL)
- [x] Reward screen reads from social_links JSONB, filters by category

---

## Phase 8: Stripe Integration

### 8.1 Subscription Management
- [x] Check subscription status on dashboard load + display trial days remaining
- [x] Billing page (`/dashboard/billing`) — Checkout + Customer Portal buttons
- [x] Stripe Checkout session creation with trial
- [x] Stripe Customer Portal session + redirect
- [x] Show upgrade prompt if trial expired — alert banners on billing page per status

### 8.2 Webhook Handler
- [x] Webhook route (`/api/webhooks/stripe`) with signature verification
- [x] Handle: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### 8.3 Access Control
- [x] Middleware subscription status checks (`isSubscriptionActive` helper in middleware)
- [x] Block dashboard if subscription inactive (except billing) — redirect to `/dashboard/billing`

---

## Phase 9: Critical Fixes

### 9.1 RLS: Public Restaurant Access
- [x] Add public SELECT policy on `restaurants` table (allows anyone to SELECT, write still owner-only)
- [x] Feedback flow (`/r/[slug]/...`) now works for unauthenticated customers

---

## Phase 10: Polish & Launch Prep

### 10.1 Error Handling
- [x] Global error boundary (`error.tsx`)
- [x] 404 page (`not-found.tsx`)
- [x] User-friendly error messages in Italian
- [x] Loading skeletons for all async content

### 10.2 Landing Page
- [x] Hero section with value proposition
- [x] How it works (3 steps)
- [x] Pricing section (single plan)
- [x] CTA to signup
- [x] Footer with legal links

### 10.3 SEO & Meta
- [x] Per-page meta tags (root layout has basic metadata already)
- [ ] OpenGraph images — add `/public/og-image.png` (1200x630) and uncomment in layout.tsx
- [ ] Favicon — add to `/public` or `src/app/`
- [x] robots.txt
- [x] sitemap.xml

### 10.4 Legal Pages
- [x] Privacy Policy page (`/privacy`)
- [x] Terms of Service page (`/terms`)
- [x] Cookie banner (react-cookie-consent)
- [x] Links in footer and signup flow

### 10.5 Final Testing
- [ ] Test complete signup flow
- [ ] Test form builder (all question types)
- [ ] Test customer feedback flow (all question types)
- [ ] Test QR code generation and scanning
- [ ] Test Stripe checkout and webhooks
- [ ] Test on mobile devices
- [ ] Test edge cases (empty form, max questions, etc.)

### 10.6 Launch
- [ ] Set up production environment variables
- [ ] Configure custom domain
- [x] Enable Stripe live mode
- [x] Connected Netlify for auto-deploy
- [x] **Update Supabase Auth URL config** — done 2026-05-16: Site URL = `https://5stelle.app`, Redirect URLs include `https://5stelle.app/auth/callback**`. Also fixed a typo (`ttps://...` → `https://...`) on one of the redirect URLs that would have silently broken password-reset flow.
- [ ] Final deployment
- [ ] Monitor for errors

---

## Phase 9.5: Bug Fixes (from code review)

### 9.5.1 Turnstile Token Expiry
- [x] Add `refreshExpired: 'auto'` and `onExpire` handler to TurnstileProvider so token auto-refreshes before expiry

### 9.5.2 Onboarding Slug Race Condition
- [x] Remove redundant pre-INSERT SELECT check for slug uniqueness
- [x] Add live debounced slug availability check with inline status indicator (spinner / green "Disponibile" / red "Già in uso")
- [x] Disable submit button while slug is being checked or is taken
- [x] Catch Postgres `23505` unique violation on INSERT as race condition safety net
- [x] Reset slug auto-generation when restaurant name field is cleared

### 9.5.4 Preview Mode — Reward Page Fix
- [x] Reward page was missing preview mode support — clicking "Continua" on review page redirected to question 1 instead of reward
- [x] Pass `isPreview` through reward page route → RewardClient, skip sessionStorage submission check in preview

### 9.5.3 Preserve Answers on Question Deletion
- [x] Add `is_active` column to `questions` table (soft-delete instead of hard-delete)
- [x] Question delete → `is_active = false` instead of DELETE (preserves FK link to answers)
- [x] Template apply → soft-delete old questions, reactivate matching ones (case-insensitive label + same type)
- [x] Add question → reactivate soft-deleted match if found, otherwise create new
- [x] Filter by `is_active = true` in form builder, feedback flow, dashboard question count
- [x] FeedbackDetailDialog → flip mapping to answers→questions so historical answers always render
- [x] **DB migration required:** `ALTER TABLE public.questions ADD COLUMN is_active boolean DEFAULT true NOT NULL;`

---

## Phase 11: UX Improvements

### 11.1 Preview Mode for Form Testing
- [x] ~~Add preview route~~ — uses `?preview=<signed_token>` query param instead (simpler, no duplicate routes)
- [x] "Anteprima" button in form builder links to form with signed preview token (1-hour expiry)
- [x] Preview submissions NOT saved to database (all Supabase inserts skipped in QuestionPageClient)
- [x] Amber banner "Modalità anteprima — i dati non vengono salvati" shown at top of all feedback pages via `PreviewBanner` in layout

### 11.2 Disable "Avanti" Until Answer Selected
- [x] Disable "Avanti"/"Completa" button until user has provided an answer (except `open_text` which remains optional)
  - `sentiment`: disabled until a sentiment is selected
  - `star_rating`: disabled until a rating is selected
  - `single_choice`: disabled until an option is selected
  - `multiple_choice`: disabled until at least one option is selected
  - `open_text`: always enabled (optional by nature)
- [x] Add tooltip on hover over disabled button: "Completa la domanda per continuare"
- [x] Remove red error message validation — replaced by disabled state

### 11.3 Smart Routing for "OK" Sentiment
> **Decision (2026-04-11):** Instead of removing the "OK" option, keep all 3 sentiments but route "OK" customers to Google when their star ratings suggest they'd leave a 4+ review. Goal: maximize Google reviews without risking 3-star-or-below ratings.

- [x] Save star rating answers to sessionStorage during feedback flow (`feedback_star_ratings` key, keyed by question ID)
- [x] Update review prompt routing: `great` → Google CTA; `ok` + avg star rating ≥ 3.5 → Google CTA; everything else → reward
- [x] Handle edge cases: no star rating questions in form → `ok` skips Google (safe default); user goes back and changes rating → correctly updated via question ID key

### 11.4 Guided Tutorial / Onboarding Tour
> **Decision (2026-04-11):** Skipped — the dashboard is simple enough (5 sidebar items) that a guided tour adds complexity without real value. The QuickStartChecklist already guides new users through setup steps. For B2B with manual onboarding, a walkthrough or video is more effective.

- [x] Replaced with improved QuickStartChecklist: icon button (ListChecks) in top-right of dashboard header with remaining-steps badge, opens dialog with full checklist. Shows until all steps are complete, no dismiss/localStorage needed

### 11.5 Default Template for New Users
- [x] Set "Quick & Simple" (2 questions) as default template for new users during onboarding — already implemented in onboarding page

---

## Phase 12: Google Reviews Tracking

> **Design decisions (discussed 2026-04-08):**
> - Google is THE primary review platform — always primary, not configurable. Other platforms (TripAdvisor, TheFork, etc.) remain as optional secondary links
> - Remove `primary_platform` toggle from settings — Google is hardcoded as primary
> - Google Place ID setup happens during onboarding (not later in settings) — user searches by restaurant name via Places Autocomplete, picks their restaurant, baseline snapshot captured immediately
> - Skippable but strongly discouraged — clear copy explaining they'll lose before/after tracking
> - Dashboard nudge banner if Google not connected
> - Daily cron via Netlify Scheduled Function → calls `/api/cron/review-snapshots` API route
> - All Places API calls server-side only, single API key

### 12.1 Schema & API Setup
- [x] Create `review_snapshots` table: `id`, `restaurant_id` (FK), `fetched_at`, `rating` (numeric 2,1), `review_count` (int), `recent_reviews` (jsonb), `is_baseline` (bool). Index on `(restaurant_id, fetched_at DESC)`. RLS: owner SELECT only, writes via admin client
- [x] Set up Google Places API key (`GOOGLE_PLACES_API_KEY` env var, server-side only) — done (no restrictions yet, on main Google account)
- [x] Create server-side utility to call Places API (Autocomplete + Place Details) — `src/lib/google-places.ts`
- [x] Create shared Supabase admin client — `src/lib/supabase/admin.ts`
- [x] API routes: `/api/google/autocomplete`, `/api/google/place-details`, `/api/google/baseline-snapshot`

### 12.2 Onboarding: Google Place Setup
- [x] Add new onboarding step after slug: "Trova il tuo ristorante su Google"
- [x] Search input using Places Autocomplete API (filtered: restaurants + Italy), show dropdown suggestions
- [x] On selection: show confirmation card (name, address, current rating + stars, photo if available)
- [x] On confirm: save Place ID to `social_links.google`, fetch Place Details, store baseline snapshot (`is_baseline = true`)
- [x] Skip option: "Non trovo il mio ristorante" / "Non sono ancora su Google" — clear messaging about losing before/after comparison
- [x] After this step → redirect to dashboard
- [x] Step indicator (1 of 2, 2 of 2) + back button

### 12.3 Daily Cron Job
- [x] API route: `/api/cron/review-snapshots` — protected by `CRON_SECRET` header
- [x] Logic: fetch all restaurants with `social_links->>'google'` set, call Place Details for each, insert snapshot rows
- [x] Netlify Scheduled Function: thin trigger at 3:00 AM UTC daily — `netlify/functions/daily-review-snapshots.mts`
- [ ] Add `CRON_SECRET` env var to Netlify — **user manual step**

### 12.4 Dashboard: Google Reviews Section
- [x] Current Google rating (large display) + delta since baseline
- [ ] Rating trend chart over time (baseline marked as "Inizio 5stelle") — deferred until enough data points exist
- [x] Review count growth (now vs baseline)
- [x] Baseline reference with tracking start date
- [x] If Google not connected: nudge banner "Collega il tuo ristorante a Google per monitorare le tue recensioni"

### 12.5 Settings: Google Section Update
- [ ] Replace current Google Place ID input with the same search widget from onboarding — deferred (current manual input works)
- [ ] Show current linked restaurant (name, address, rating) with option to change — deferred
- [x] Remove `primary_platform` star toggle — Google is always primary

### 12.6 Review Prompt Screen Update
- [x] Google always shown as primary CTA (animated gold border)
- [x] Other configured review platforms shown as secondary buttons below
- [x] Remove primary_platform logic, hardcode Google

### 12.7 Review Prompt Click/View Tracking + Attribution
> Implemented 2026-04-10. Tracks how many customers see the review prompt, how many click the Google CTA, and cross-references with new reviews from daily snapshots to estimate reviews driven by 5stelle.

- [x] **DB migration:** Add 3 columns to `submissions` table (migration already run)
- [x] Update `src/types/database.types.ts` — add 3 fields to submissions Row/Insert/Update
- [x] Update `src/components/feedback/ReviewPromptClient.tsx` — track view on mount, first click wins with platform key, skipped in preview
- [x] Update dashboard page — query `review_prompt_shown_at IS NOT NULL` + `review_platform_clicked = 'google'`, pass to GoogleReviewsCard
- [x] Update `src/components/dashboard/GoogleReviewsCard.tsx` — attribution section with prompt views, Google clicks, `min(googleClicks, newReviews)` estimate

### 12.8 Landing Page Copy Update
- [x] Rewrite hero/value prop to lead with Google Reviews ("Più recensioni a 5 stelle su Google")
- [x] Add before/after tracking visual in Step 3 dashboard illustration (baseline → current rating with growth)
- [x] Google as primary in routing visual (large card with gold border, secondary platforms smaller)
- [x] Updated pain point, features, stats, pricing, and CTA copy to reference Google specifically
- [x] "Monitoraggio Google Reviews" replaces "Dashboard analytics" in feature cards and pricing list

---

## Phase 13: Pre-Production Checklist

### 13.1 Environment & Security
- [x] Add `GOOGLE_PLACES_API_KEY` and `CRON_SECRET` to Netlify env vars (done 2026-05-16, scoped to Production + Deploy previews + Branch deploys + Preview server & agent runners, "Contains secret values" checked, Local-development context intentionally left empty since `.env.local` covers it)
- [x] Verify cron after deploy: `curl -i -X POST https://5stelle.app/api/cron/review-snapshots -H "Authorization: Bearer <CRON_SECRET>"` returned **HTTP 200** with `{"total":4,"success":4,"failed":0}` (2026-05-16)
- **Google Places API key hardening (completed 2026-05-16):**
  - [x] Step 1: API restrictions — key restricted to "Places API (New)" only (was previously unrestricted, accessible to all 33 enabled APIs)
  - [x] Step 2: Daily quota caps set in Cloud Console → APIs & Services → Places API (New) → Quotas & System Limits. Final values: `AutocompletePlacesRequest per day = 2000`, `GetPlaceRequest per day = 200`, `GetPhotoMediaRequest per day = 100`. Worst-case ceiling ≈ $11/day. (Note for next session: Google's UI uses legacy-style row names — `GetPlaceRequest` is Place Details, `AutocompletePlacesRequest` is Autocomplete, `GetPhotoMediaRequest` is Photos)
  - [x] Step 3: Billing budget — €10/month with 50/90/100% Actual-spend email alerts on billing account "Account Fatturazione Places" (only billing account linked to the 5stelle GCP project). Confirmed only the 5stelle project is linked to this billing account, so the budget effectively covers Places API spend alone.
  - [x] Application restrictions: confirmed "None" (server-to-server calls, no referrer header) — appropriate for our usage
- [ ] Google Cloud project is on main personal account — consider moving to dedicated account later
- [ ] Decide on email confirmation for signups (currently disabled — fine for B2B manual onboarding, risky if public signups)

### 13.2 Deployment Sync
- [x] **Merge dev → master** — verified 2026-05-11: all four refs (`master`, `dev`, `origin/master`, `origin/dev`) point to `51fced4`. Prod has Turnstile auto-refresh, slug race fix, soft-delete questions, disable Avanti, Google Reviews tracking, review prompt tracking, smart OK routing, preview banner, Google-focused landing, and `client_errors` logging

---

## Phase 14: Production Observability

> Added 2026-05-10 after the first client reported intermittent issues on the live app (save errors, UI freezes, slow saves). The catch in `QuestionPageClient.tsx` was discarding error objects, leaving us blind. Now we capture and persist them server-side.

### 14.1 client_errors Table
- [x] Create `public.client_errors` table on Supabase: `id`, `occurred_at`, `context`, `message`, `code`, `details`, `metadata` (jsonb), `user_agent`. RLS enabled with INSERT-only policy for anon + authenticated. SELECT via Supabase Studio (service_role bypasses RLS).
- [x] Index on `occurred_at DESC` for recent-errors queries.

### 14.2 Logging in Feedback Flow
- [x] `src/components/feedback/QuestionPageClient.tsx` — capture `err` in catch, add `logClientError` helper inserting to `client_errors` with form_id, restaurant_slug, question_id, question_type, question_index, is_last, has_turnstile_token, submission_id, table_identifier, user_agent.
- [x] Two log sites: `feedback_flow:save_answer` (main catch — submission/answer/sentiment/complete writes + Turnstile fetch failures) and `feedback_flow:turnstile_verify_failed` (Turnstile success=false, previously invisible).
- [x] Skipped in preview mode.

### 14.3 Open
- [x] **First phone test (2026-05-16):** 3 runs (Safari normal + 2 incognito) covering great/ok/bad sentiments. **No freezes, no save errors.** Only issues were the review-page flash (15.1) and cookie banner placement (15.2), both fixed and merged to master same session.
- [ ] After post-15.1/15.2-deploy phone re-test: review `client_errors` to confirm no new errors slipped in: `select occurred_at, context, message, code, details, metadata, user_agent from public.client_errors order by occurred_at desc limit 50;`
- [ ] If "freeze" symptom surfaces again on real-client traffic and doesn't show in `client_errors` (it's a hung promise, not a thrown error), add timeout-based instrumentation around the Supabase calls in QuestionPageClient and log slow saves.
- [ ] Consider extending logging to other catch sites if dashboard or form-builder errors become a debugging concern (`LinksClient.tsx:69`, `SettingsClient.tsx:44`, `FormBuilderClient.tsx:52/80/264`).

### 14.4 How to Check Logs
```sql
select occurred_at, context, message, code, details, metadata, user_agent
from public.client_errors
order by occurred_at desc
limit 50;
```
Or open Supabase Studio → Table Editor → `client_errors`.

---

## Phase 15: Phone-Test Findings (2026-05-16)

> Found during live-app phone testing after Netlify env vars + Google Cloud hardening were deployed. Functional flow works end-to-end (great/ok/bad sentiments + Safari normal & incognito); these are UX/routing polish.

### 15.1 Review Page Flash on Non-Qualifying Sentiments
- [x] **Bug:** OK-low-star and Bad-sentiment users briefly saw the review prompt page (Google CTA + secondary platforms) for a split second before being client-side redirected to /reward. Root cause: `QuestionPageClient.tsx:227` always navigated to `/review`, and `ReviewPromptClient` rendered the UI between mount and `router.replace()` firing.
- [x] **Fix (upstream):** `QuestionPageClient.handleNext` now computes `shouldShowReview` (great || ok-with-avg-stars≥3.5) and routes directly to `/reward` for non-qualifying users. They never hit `/review` at all.
- [x] **Fix (defensive):** `ReviewPromptClient` no longer sets `mounted=true`/`sentiment` before the redirect decision, so direct-URL/back-button visits with non-qualifying sentiment also don't flash.

### 15.2 Cookie Banner Covers Next Button
- [x] Banner was overlaying the "Avanti"/"Completa" button on the feedback flow. **Fix:** `CookieBanner` now returns `null` on `/r/*` routes via `usePathname()`. Justified: the feedback flow stores nothing beyond `sessionStorage` (no analytics, no marketing cookies, no tracking pixels) so consent isn't required there.

### 15.3 Submit Button Spinner Flicker (2026-05-17)
- [x] **Bug:** Clicking "Avanti"/"Completa" showed the button spinner during the save, then the spinner briefly stopped (button appeared clickable again) before the next page rendered. Root cause: `QuestionPageClient.tsx` reset `setIsSubmitting(false)` in a `finally` block, which ran immediately after `router.push()` returned — but `router.push` resolves before the new page mounts, so there was a visible gap.
- [x] **Fix:** Moved `setIsSubmitting(false)` from the `finally` block into the `catch` block only. On success, the component unmounts on navigation so the spinner stays spinning through the transition. On error it still resets so the user can retry.

### 15.4 Post-Deploy Verification (pending — next session)
- [ ] **Phone-test the live app again** after Netlify finishes deploying the master commit with the 15.1/15.2 fixes. Confirm: (a) bad/ok-low-star sentiment goes straight to /reward with NO flash of the Google CTA, (b) cookie banner no longer appears on `/r/*` routes (still appears on landing/dashboard/etc.), (c) happy path still works end-to-end.
- [ ] **Check `client_errors` after re-test** via Supabase Studio → Table Editor → `client_errors` (or the SQL in 14.4). Expect zero new rows from the test runs.

### 15.5 Reward Page Expiry (2026-05-17)
> **Problem:** customer could leave the `/reward` tab open and re-show it on a future visit to claim the reward again without leaving new feedback. Even worse: screenshots can be reused later.
> **Decision:** soft 1-hour expiry + prominent timestamp ("Premio valido fino alle HH:MM"). The visible timestamp defends against screenshots too (waiter sees the time in the screenshot). Rejected the QR-validation-by-waiter approach — way too much complexity (waiter accounts, camera permissions, abuse prevention) for a €39/month product.
- [x] **Capture** `completedAt` once at mount via `useState(() => Date.now())` in `RewardClient.tsx`. Expiry = `completedAt + 60min`.
- [x] **Tick** `now` every 30s via `setInterval` + `visibilitychange` + `focus` listeners so tab-restore / backgrounding flips to expired state on next focus.
- [x] **Active state:** reward card shows reward text + small clock icon + "Premio valido fino alle HH:MM" (Italian locale).
- [x] **Expired state:** reward card swaps to muted style with "Premio scaduto" + "Torna a trovarci per ricevere un nuovo premio."
- [x] **Social-follow buttons** stay visible in both states (following on social is still valuable).
- [x] **Preview mode:** skipped — no expiry in `?preview=...` (the form-builder anteprima should always show the active state).

---

## Phase 16: Pre-Handoff Polish & Open Items (2026-05-17 co-founder review)

> Items surfaced during a pre-launch review with the assistant playing co-founder. Grouped by criticality. None block deploy of the current branch, but the **Critical** bucket should be cleared before the first paying client actually starts using the app for billing/auth.

### 16.1 Critical before handoff
- [ ] **End-to-end Stripe test in prod.** Sign up → trial countdown → trial expires → middleware blocks dashboard → checkout completes → webhook fires → status flips to `active`. Also test: Customer Portal cancel flow, `past_due` via test card 4000 0000 0000 0341. Confirm Customer Portal config has **invoice history** enabled. This is the #1 launch blocker — broken trial-to-paid funnel kills the business model silently. (Cross-ref: TODO 10.5.)
- [ ] **Lock down signups.** Currently anyone with the URL can create an account and burn through a free trial. Options: (a) gate `/signup` behind an invite code, (b) disable the route entirely and onboard manually, (c) enable Supabase email confirmation. For B2B manual onboarding at this stage, (b) is simplest. (Cross-ref: TODO 13.1 last bullet.)
- [ ] **Destructive-action guard audit.** Confirm confirmation prompts exist on: question delete (form builder), table delete (`TableManager`), social-link removal in settings. One-click destructive Supabase calls = irreversible "oops". ~15 min review.
- [ ] **Mobile dashboard pass.** Open `/dashboard`, `/dashboard/feedback`, `/dashboard/form-builder`, `/dashboard/qr-codes`, `/dashboard/settings`, `/dashboard/billing` on a phone. Owners *will* check on their phone. The customer-facing flow is mobile-first; the dashboard probably isn't.
- [ ] **Print + scan a real QR code.** Take the PDF download, print on actual paper, scan from realistic table distance and lighting. Both the general QR and a table-specific one. The whole product hinges on physical QRs working.
- [ ] **Re-read `/privacy` and `/terms`.** Confirm real legal text, not placeholder. GDPR + Italian consumer law liability matters with paying clients. Worth ~10 min.

### 16.2 High value, post-launch acceptable but soon
- [ ] **Trial-expiry warning email.** Send on day 5 of the 7-day trial: "La tua prova scade tra 2 giorni." Right now the trial ends silently and the owner gets locked out one morning with no warning. High value, ~half day work (Resend + Supabase scheduled function or a separate cron).
- [ ] **Server-side error monitoring.** `client_errors` only catches the feedback flow. If `/api/cron/review-snapshots`, Stripe webhooks, or `/api/google/*` start failing, we find out from the client. Cheapest fix: extend `logClientError` to a server-side helper that writes to `client_errors` with a `server:*` context prefix. Or wire up a real error service (Sentry free tier) post-launch.
- [ ] **Support contact path.** No "Aiuto"/contact link anywhere in the dashboard. Minimum: `mailto:` in the sidebar footer or dashboard footer. When the client hits a problem at 8pm on Saturday, they need a path.

### 16.3 Polish wins
- [ ] **Settings: logo upload.** `restaurants.logo_url` column already exists. Add Supabase Storage bucket + policies + image upload (size limit, format validation) + display on the customer-facing feedback flow (header). Real branding value — makes the app feel "theirs" to the customer, not generic SaaS. Budget ~2 hours. (Cross-ref: TODO 7.2.)
- [ ] **Dashboard metric tooltips.** Add hover tooltips to: "Soddisfazione complessiva" (explain it's an average of all sentiment values converted to a 0-100 score over the period), Google Reviews delta (vs the baseline captured at onboarding date), prompt-view → click → estimated-attributed-reviews funnel. 30 min, big clarity win.

### 16.4 Nice-to-have (defer until first client requests)
- [ ] **Email digest** — daily "5 new feedback yesterday, 1 negative" summary email to the owner. Highest-value addition if owners aren't logging in daily.
- [ ] **CSV export of feedback.** Owners will ask. Cheap to ship via a dashboard button → server route → stream CSV.
- [ ] **"Nuovi" separator in `FeedbackList`** — visual marker for feedback received since last visit (cookie-based or `last_dashboard_visit_at` on the user). Better signal than a sidebar notification badge.
- [ ] **Bulk actions on feedback** — archive, mark spam.

---

## Known Issues

- **Duplicate sentiment question** — User reported seeing duplicate sentiment question in feedback flow. Likely a data issue (duplicate question rows in DB), not a code bug. Check with: `SELECT id, label, type, order_index, is_active FROM questions WHERE form_id = '<FORM_ID>' ORDER BY order_index;`
- **Intermittent feedback flow failures on live app (reported 2026-05-10)** — three symptoms: "Errore nel salvare la risposta" toast, UI freezes, slow saves. Turnstile fix already in prod; Phase 14 logging in place. 2026-05-16 phone test (3 runs) couldn't reproduce. Awaiting next real-client traffic to confirm fully resolved — keep an eye on `client_errors` table.

---

## Notes

- Keep this file updated as you complete tasks
- If you discover new tasks, add them in the appropriate phase
- Prioritize completing phases in order, but small fixes can be done anytime
