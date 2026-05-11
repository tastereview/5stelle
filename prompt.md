Hi, I'm continuing work on 5stelle.

**IMPORTANT:** Read `CLAUDE.md` and `TODO.md` first.

## Session Context

Last session (2026-05-11) focused on Google Places API hardening before adding the key to Netlify. Verified that dev/master are already in sync (the previous prompt was stale on this — all four refs point to `51fced4`, prod already has all recent fixes including `client_errors` logging). The Netlify env var setup got paused mid-Cloud-Console walkthrough.

## Critical State

- **dev/master in sync** — production is current. No merge needed.
- **All DB migrations are live on Supabase** — `questions.is_active`, `submissions.review_prompt_*`, `review_snapshots`, `client_errors`. Single Supabase project covers dev + prod.
- **Netlify env vars STILL NOT SET:** `GOOGLE_PLACES_API_KEY` and `CRON_SECRET`. Both values already exist in local `.env.local` — just need copying to Netlify. Without these: any new restaurant signup will 500 on the Google search step, and the daily cron will return 500 with "CRON_SECRET not set".
- **Google Cloud key hardening — partial:** Step 1 done (API restrictions limited to "Places API (New)" only — was previously unrestricted). Steps 2 (daily quota caps) and 3 (billing budget alert) still pending. See TODO 13.1 for the exact numbers and click paths.

## Pricing Refresher (Places API New, server-side)

What the code calls and the SKU each triggers:
- `places:autocomplete` — $2.83/1k (default tier)
- `places/{id}` with field mask including `rating, userRatingCount, reviews` — **$25.00/1k (Enterprise tier)** — this is the expensive one. Called once per onboarding + once per restaurant per day from the cron
- `places/{name}/media` (photo) — $7.00/1k, only on onboarding

$200/month free credit ≈ 8k Place Details calls. ~250 active restaurants before going over the free tier.

## What's Next (in order)

1. **Finish Google Cloud hardening** (TODO 13.1):
   - Step 2: Cloud Console → APIs & Services → Places API (New) → Quotas & System Limits. Cap: Autocomplete=2000/day, Place Details Enterprise=200/day, Place Photos=100/day. User was about to do this — they may need help finding the exact quota row names (Google's UI is dense; "Place Details Enterprise" might appear as "Place Details (Enterprise) per day" or similar)
   - Step 3: Cloud Console → Billing → Budgets & alerts → €10/month budget with 50/90/100% email alerts
2. **Add env vars to Netlify** (`GOOGLE_PLACES_API_KEY`, `CRON_SECRET`) — values are in local `.env.local`. Use dashboard or `netlify env:set`. Scope = "All deploy contexts"
3. **Verify cron works after deploy:**
   ```
   curl -i -X POST https://5stelle.app/api/cron/review-snapshots \
     -H "Authorization: Bearer <CRON_SECRET>"
   ```
   Expect 200, not 401/500
4. **Phone-test the live app** to reproduce the save-error / freeze symptoms, then check `client_errors`:
   ```sql
   select occurred_at, context, message, code, details, metadata, user_agent
   from public.client_errors
   order by occurred_at desc
   limit 50;
   ```
5. **If the freeze symptom doesn't appear in logs** (likely — hung promise, not thrown error), add timeout-based instrumentation around Supabase calls in `src/components/feedback/QuestionPageClient.tsx`
6. After stability is confirmed: **10.3 OG image + favicon**, **10.5 full testing pass**, **10.6 launch**

## Key Files

- `TODO.md` — task tracking (Phase 13.1 has the granular Google Cloud steps)
- `src/lib/google-places.ts` — Places API call sites (Autocomplete, Place Details with `rating,userRatingCount,reviews,photos` field mask, Photo media)
- `src/components/feedback/QuestionPageClient.tsx` — feedback save logic + `logClientError` helper
- `netlify/functions/daily-review-snapshots.mts` — cron trigger that calls `/api/cron/review-snapshots` with `Bearer ${CRON_SECRET}`
- `database-schema.sql` — current live schema
