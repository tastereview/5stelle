Hi, I'm continuing work on 5stelle.

**IMPORTANT:** Read `CLAUDE.md` and `TODO.md` first.

## Session Context

Last session (2026-05-16) cleared the entire pre-production checklist except for two verification steps that need to happen on a phone after a Netlify deploy finishes. The first paying client wants to start using the app ASAP, so reliability/UX polish is top priority over new features.

## Critical State (all good, ready to go pending final phone re-test)

- **dev/master in sync.** Latest commit on both includes the review-prompt-flash + cookie-banner fixes (Phase 15.1 + 15.2). Netlify auto-deploys from master.
- **Netlify env vars set:** `GOOGLE_PLACES_API_KEY` and `CRON_SECRET` are live in all deploy contexts ("Contains secret values" checked, Local-development context left empty since `.env.local` covers it).
- **Cron verified in prod:** `curl POST /api/cron/review-snapshots` with Bearer secret returned 200 + `{"total":4,"success":4,"failed":0}`.
- **Google Cloud hardening complete:**
  - API key restricted to "Places API (New)" only
  - Daily quota caps set in Cloud Console (Google's UI uses legacy names — `GetPlaceRequest=200/day` = Place Details, `AutocompletePlacesRequest=2000/day` = Autocomplete, `GetPhotoMediaRequest=100/day` = Photos). Worst-case ≈ $11/day.
  - €10/month billing budget with 50/90/100% Actual-spend email alerts on "Account Fatturazione Places" billing account (only the 5stelle project is linked to it, so the budget effectively scopes to Places API spend).
  - Application restrictions = None (server-to-server, no referrer header — correct for our usage).
- **Supabase Auth URLs configured:** Site URL = `https://5stelle.app`, Redirect URLs include `https://5stelle.app/auth/callback**`. Also fixed a `ttps://` typo on one of the redirect URLs that would have silently broken password reset.
- **All DB migrations live:** `questions.is_active`, `submissions.review_prompt_*`, `review_snapshots`, `client_errors`. Single Supabase project covers dev + prod.
- **Git remote switched from HTTPS to SSH** this session (HTTPS token had expired, Cursor's askpass was failing with 401). Authenticated as GitHub user `5stelle`. SSH key at `~/.ssh/id_ed25519`, no passphrase.

## What Happened in the 2026-05-16 Session

1. Walked through Google Cloud hardening Steps 2 + 3 in the Console
2. Added both env vars in Netlify, triggered a deploy, verified cron works in prod
3. Updated Supabase Auth URLs (caught + fixed the `ttps://` typo)
4. Phone-tested the live app (3 runs: Safari normal + 2 incognito, covering great/ok/bad sentiments). Flow worked end-to-end with no freezes or save errors. But found two UX issues:
   - **15.1 Review page flash** — bad/ok-low-star users briefly saw the Google CTA before client-side redirect to /reward. Root cause: `QuestionPageClient.tsx:227` always navigated to `/review`, and `ReviewPromptClient` rendered the UI between mount and `router.replace()` firing. **Fixed:** routing decision moved upstream into `QuestionPageClient.handleNext` so non-qualifying users go directly to `/reward`. Also hardened `ReviewPromptClient` (no UI render before redirect decision) as a defensive safety net for direct-URL/back-button visits.
   - **15.2 Cookie banner covering the Avanti/Completa button** — **Fixed:** `CookieBanner` now returns `null` on `/r/*` routes via `usePathname()`. GDPR-compliant because the feedback flow uses only sessionStorage (zero non-essential cookies).
5. Switched git remote to SSH, committed + pushed both fixes, merged dev→master.

## What's Next (in order — both are quick verification steps)

1. **Phone-test the live app again** after Netlify finishes deploying the master commit. Confirm:
   - Bad/ok-low-star sentiment goes straight to /reward with **no flash** of the Google CTA
   - Cookie banner no longer appears on `/r/*` routes (should still appear on landing/dashboard/etc.)
   - Happy path (great sentiment → Google CTA → reward) still works
2. **Check `client_errors`** in Supabase Studio after the re-test:
   ```sql
   select occurred_at, context, message, code, details, metadata, user_agent
   from public.client_errors
   order by occurred_at desc
   limit 50;
   ```
   Expect zero new rows from the test runs.

## After That (nice-to-haves before broader launch)

- **10.3 OG image + favicon** (`/public/og-image.png` 1200x630, plus favicon — uncomment in `layout.tsx`)
- **10.5 Full testing pass** — Stripe checkout flow, all form-builder question types, QR scanning, edge cases
- **10.6 Final launch checks** (env-var inventory, custom-domain confirmation already done, error monitoring)
- **15.3 Verification steps above** — move to "done" once confirmed
- If "freeze" symptom comes back from real-client traffic and doesn't show in `client_errors`, add timeout-based instrumentation around the Supabase calls in `QuestionPageClient.tsx` (it's a hung promise, not a thrown error, so the existing logger won't catch it)

## Key Files

- `TODO.md` — task tracking. Phase 15 has the latest findings. Phase 13.1 fully done now. Phase 14.3 has the post-test client_errors check.
- `src/components/feedback/QuestionPageClient.tsx` — feedback save logic + `logClientError` helper + (now) upstream sentiment routing for /review vs /reward
- `src/components/feedback/ReviewPromptClient.tsx` — defensive flash-prevention safety net (no UI render before redirect resolves)
- `src/components/shared/CookieBanner.tsx` — hidden on `/r/*` via `usePathname()`
- `src/lib/google-places.ts` — Places API call sites (Autocomplete, Place Details with `rating,userRatingCount,reviews,photos` field mask, Photo media)
- `netlify/functions/daily-review-snapshots.mts` — cron trigger that calls `/api/cron/review-snapshots` with `Bearer ${CRON_SECRET}`
- `database-schema.sql` — current live schema

## Pricing Refresher (Places API New, server-side)

- `places:autocomplete` — $2.83/1k (default tier)
- `places/{id}` with field mask incl. `rating,userRatingCount,reviews` — **$25.00/1k (Enterprise tier)** — the expensive one. Called once per onboarding + once per restaurant per day from the cron.
- `places/{name}/media` (photo) — $7.00/1k, onboarding only.

$200/month free credit ≈ 8k Place Details calls ≈ ~250 active restaurants before going over the free tier. Quota caps + €10 budget alert are in place as the safety net.
