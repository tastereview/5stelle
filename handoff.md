# Session Handoff — 2026-03-04 (Session 9)

## What Was Done

### Session 9 (current)

#### 1. Preload Turnstile from First Question
**Files:** NEW `src/components/feedback/TurnstileProvider.tsx`, `src/app/r/[restaurantSlug]/[formId]/layout.tsx`, `src/components/feedback/QuestionPageClient.tsx`

- Previously Turnstile only mounted on the last question — caused a "verifying" delay before submit
- Created `TurnstileProvider` context that renders invisible Turnstile on mount (from question 1)
- Wrapped feedback layout `{children}` with `<TurnstileProvider>` so token starts resolving immediately
- `QuestionPageClient` now reads token via `useTurnstile()` hook instead of managing its own Turnstile widget
- By the time the user reaches the last question, the token is already available — no delay

---

### Session 8

#### 1. Table Active/Inactive Toggle (replaces delete)
**Files:** `src/types/database.types.ts`, `src/components/dashboard/QRCodeClient.tsx`, `src/app/r/[restaurantSlug]/[formId]/[index]/page.tsx`
**DB:** `ALTER TABLE tables ADD COLUMN is_active boolean NOT NULL DEFAULT true` + `Public can view table status` RLS policy

- Removed table deletion entirely — prevents accidental loss of printed QR codes
- Added `is_active` toggle (Switch component) on each table QR card
- Inactive tables: grayed out (opacity + grayscale), "Disattivato" badge, PDF download hidden
- Active tables sorted first in grid, with Framer Motion layout animation
- "Scarica tutti" PDF only includes active tables
- Public feedback page: scanning inactive table QR shows "Tavolo non attivo" message

---

### Session 7

#### 1. Subscription Enforcement (Middleware)
**Files:** `src/lib/supabase/middleware.ts`

- Added `isSubscriptionActive(status, trialEndsAt)` helper function:
  - `active` → true
  - `trialing` with future `trial_ends_at` → true
  - Everything else → false
- Subscription gate runs after auth guard for all `/dashboard/*` routes except `/dashboard/billing`
- Queries `restaurants` table (only `subscription_status` + `trial_ends_at`, single row by `owner_id`)
- Inactive subscription → redirect to `/dashboard/billing`

#### 2. Billing Page Inactive Subscription Alerts
**Files:** `src/components/dashboard/BillingClient.tsx`

- Added alert banner at top of billing page for inactive subscription states:
  - **Expired trial** (`trialing` + `trialDaysRemaining <= 0`): red alert
  - **Canceled**: amber alert
  - **Past due**: red alert
  - **Incomplete**: amber alert
- Uses `AlertTriangle` icon from lucide-react (same pattern as `TrialExpirationBanner`)
- Status badge now shows "Prova scaduta" (with `AlertCircle` in red) instead of "In prova" when trial expired
- Removed redundant bright `text-orange-600` "La prova è terminata" text
- Added gold pulsing animation (Framer Motion) to "Abbonati ora" button — same animation as preferred review platform button (scale pulse + amber glow + rotating conic-gradient shine)

#### 3. Login Loading State Fix
**Files:** `src/app/(auth)/login/page.tsx`

- Moved `setIsLoading(false)` out of `finally` block — now only resets on error/failure
- Spinner stays visible during navigation to dashboard (previously disappeared before redirect completed)

#### 4. Password Recovery Flow
**Files:** NEW `src/app/(auth)/forgot-password/page.tsx`, NEW `src/app/auth/callback/route.ts`, NEW `src/app/(auth)/reset-password/page.tsx`, `src/app/(auth)/login/page.tsx`

- **Forgot password page** (`/forgot-password`):
  - Email input form, calls `supabase.auth.resetPasswordForEmail()` with `redirectTo` pointing to `/auth/callback?next=/reset-password`
  - Success state shows mail icon + "Controlla la tua email" confirmation
  - Italian error translations for common Supabase errors (invalid email, rate limit)
  - "Torna al login" back link
- **Auth callback route** (`/auth/callback`):
  - GET handler exchanges Supabase auth code for session via `exchangeCodeForSession()`
  - Reads `next` query param for redirect target (defaults to `/dashboard`)
  - Falls back to `/login` on failure
- **Reset password page** (`/reset-password`):
  - New password + confirm password form
  - Same validation rules and strength indicator UI as signup page
  - Calls `supabase.auth.updateUser({ password })` — user is already authenticated via callback
  - Redirects to dashboard on success
- **Login page**: added "Password dimenticata?" link next to Password label

**BLOCKER:** Supabase default email provider only sends to org member emails (since Sep 2024). Custom SMTP required for this to work with real users.

---

## Architecture Decisions

- **Subscription check in middleware** (not layout) — catches both SSR and client-side navigation, single source of truth
- **Auth callback as separate route** (`/app/auth/callback/route.ts`) — handles PKCE code exchange for password recovery (and any future email-based auth flows like magic links)
- **Password reset via authenticated session** — callback establishes session first, then reset page calls `updateUser()` (standard Supabase pattern)

---

## New Files

| File | Purpose |
|------|---------|
| `src/components/feedback/TurnstileProvider.tsx` | Turnstile context provider — preloads invisible widget from first question |
| `src/app/(auth)/forgot-password/page.tsx` | Forgot password email form |
| `src/app/auth/callback/route.ts` | Supabase auth code exchange |
| `src/app/(auth)/reset-password/page.tsx` | New password form |

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/r/[restaurantSlug]/[formId]/layout.tsx` | Wrapped children with `<TurnstileProvider>` |
| `src/components/feedback/QuestionPageClient.tsx` | Removed local Turnstile widget, now reads token from `useTurnstile()` context |
| `src/lib/supabase/middleware.ts` | `isSubscriptionActive` helper + subscription gate for dashboard routes |
| `src/components/dashboard/BillingClient.tsx` | Inactive subscription alerts, "Prova scaduta" status, removed bright red text, gold animated subscribe button |
| `src/app/(auth)/login/page.tsx` | Loading state fix (spinner persists during redirect), "Password dimenticata?" link |

---

## Pending Items / Next Session

### Priority Tasks
- [ ] **Configure custom SMTP in Supabase** — required for password recovery (and any email-based auth) to work with real users. Resend free tier recommended.
- [ ] **Update Supabase Auth URL config for production** — change Site URL from `localhost` to `https://5stelle.app` + add `https://5stelle.app/auth/callback**` to Redirect URLs
- [ ] **Test full Stripe flow on production** — deploy, subscribe with €1.10 test price, verify webhook fires and status updates
- [ ] **Swap to real price** — change `STRIPE_PRICE_ID` to `STRIPE_PRICE_ID-actual` (€39/month) when ready

### Still Open
- [ ] Favicon — add to `/public` or `src/app/`
- [ ] OpenGraph image — add `/public/og-image.png` (1200x630) and uncomment in layout.tsx
- [ ] Delete unused `src/components/dashboard/TableManager.tsx`
- [ ] Apply tweakcn theme customization
- [ ] Final testing
- [ ] Launch

### Skipped for MVP (unchanged)
- Logo upload (Supabase Storage)
