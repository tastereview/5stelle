Hi, I'm continuing work on 5stelle.

**IMPORTANT:** Read `CLAUDE.md` and `TODO.md` first.

## Session Context

Last session (2026-05-17) shipped two small UX fixes to the feedback flow and added a soft expiry to the reward page so customers can't reuse old reward screens. Also did a thorough co-founder-style pre-launch review and logged the findings in `TODO.md` Phase 16. The first paying client is imminent — reliability/UX polish still top priority over new features.

## Critical State

- **Branch `dev` has 3 uncommitted modified files** at the start of this session (TODO.md, QuestionPageClient.tsx, RewardClient.tsx). Either they were committed + pushed + merged to master at session end, or they're still pending — check `git status` and `git log` to confirm.
- **Most recent landed change before this session's work:** `3a658ea` on dev + master (2026-05-16 session — Google Cloud hardening, Netlify env vars, Supabase auth URLs, Phase 15.1 review-flash fix + 15.2 cookie-banner fix).
- Netlify auto-deploys from master.
- Google Cloud hardening complete (key restricted to Places API New only, quota caps, €10/month budget). All DB migrations live. Supabase Auth URLs configured.

## What Happened in the 2026-05-17 Session

1. **Fixed submit-button spinner flicker** (Phase 15.3 in `TODO.md`). On clicking "Avanti"/"Completa", the spinner used to briefly stop *before* the next page rendered, making the button look clickable again for a split second. Root cause: `setIsSubmitting(false)` was in a `finally` block that ran immediately after `router.push()` returned, but the new page hadn't mounted yet. **Fix:** moved the reset into the `catch` block only. On success, the component unmounts on navigation so the spinner stays spinning through the transition; on error it still resets so the user can retry.

2. **Reward page expiry** (Phase 15.5). Customer could leave the `/reward` tab open and re-show it on a future visit to claim the reward again (also: screenshots). Implemented soft 1-hour expiry + prominent timestamp:
   - `RewardClient.tsx` captures `completedAt = Date.now()` once at mount via `useState(() => Date.now())`. `REWARD_VALIDITY_MS = 60 * 60 * 1000`.
   - A second `useEffect` ticks `now` every 30s + on `visibilitychange` + on `focus`, so a tab brought back into focus flips to expired immediately (not 30s later).
   - **Active state:** reward card shows reward text + small clock icon + "Premio valido fino alle HH:MM" (Italian locale via `toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })`).
   - **Expired state:** reward card swaps to muted style with "Premio scaduto" + "Torna a trovarci per ricevere un nuovo premio."
   - **Social-follow buttons** stay visible in both states.
   - **Preview mode skipped** — no expiry when accessed via `?preview=...`.
   - **Decision rationale logged in TODO 15.5:** rejected the QR-validation-by-waiter approach (waiter accounts, camera permissions, abuse prevention) as way too heavy for a €39/month product. The visible timestamp also defends against screenshots since the time is visible in the screenshot.

3. **Co-founder-style pre-launch review** — surfaced ~13 open items, logged in **TODO Phase 16** in four buckets:
   - **16.1 Critical before handoff:** End-to-end Stripe test in prod, lock down signups, destructive-action guard audit, mobile dashboard pass, print + scan a real QR, re-read /privacy and /terms.
   - **16.2 High value, soon:** Trial-expiry warning email (day 5 of 7), server-side error monitoring (extend `client_errors` to server contexts), support contact path (mailto: in dashboard footer).
   - **16.3 Polish wins:** Logo upload (column already exists in DB), dashboard metric tooltips.
   - **16.4 Nice-to-have (defer):** Email digest, CSV export, "Nuovi" separator in FeedbackList, bulk actions on feedback.

4. Confirmed sentiment-routing logic (in `QuestionPageClient.tsx:227-245`) is correct: `great` → /review (Google CTA); `ok` AND avg star rating ≥ 3.5 → /review; everything else → /reward. User tested with ok+4-star on phone, correctly routed to /review.

## What's Next (priority order)

1. **Phone-test the live app** after Netlify finishes deploying. Now covers:
   - **15.4:** confirm 15.1 (no flash on bad/ok-low-star) and 15.2 (no cookie banner on `/r/*`) still working — these landed last session
   - **15.3:** confirm the submit-button spinner stays solid all the way through page transition (no clickable-flicker)
   - **15.5:** confirm reward page shows "Premio valido fino alle HH:MM" line. To test the expired state without waiting 1 hour, temporarily lower `REWARD_VALIDITY_MS` in `RewardClient.tsx` to e.g. `60_000` and verify the "Premio scaduto" card renders.
   - Happy path still works end-to-end.
2. **Check `client_errors`** after the re-test — `select occurred_at, context, message, code, details, metadata, user_agent from public.client_errors order by occurred_at desc limit 50;` — expect zero new rows.
3. **Start clearing TODO Phase 16.1 (Critical before handoff)**. The #1 blocker is the **end-to-end Stripe test in prod** — sign up → trial countdown → trial expires → checkout → webhook → status flips to active → Customer Portal cancel → past_due. Without this, the trial-to-paid funnel could be silently broken.
4. After Critical bucket is clear, work through 16.2 (trial-expiry email is the highest-value single item).

## Key Files

- `TODO.md` — task tracking. Phase 15 has the latest UX findings, Phase 16 has the pre-handoff polish backlog.
- `src/components/feedback/QuestionPageClient.tsx` — feedback save logic + `logClientError` helper + upstream sentiment routing for /review vs /reward + (now) on-success setIsSubmitting kept true through navigation.
- `src/components/feedback/RewardClient.tsx` — reward screen with 1-hour soft expiry, visibilitychange/focus listeners.
- `src/components/feedback/ReviewPromptClient.tsx` — defensive flash-prevention safety net (no UI render before redirect resolves).
- `src/components/shared/CookieBanner.tsx` — hidden on `/r/*` via `usePathname()`.
- `src/lib/google-places.ts` — Places API call sites.
- `netlify/functions/daily-review-snapshots.mts` — cron trigger that calls `/api/cron/review-snapshots` with `Bearer ${CRON_SECRET}`.
- `database-schema.sql` — current live schema.

## Pricing Refresher (Places API New, server-side)

- `places:autocomplete` — $2.83/1k (default tier)
- `places/{id}` with field mask incl. `rating,userRatingCount,reviews` — **$25.00/1k (Enterprise tier)** — the expensive one. Once per onboarding + once per restaurant per day from the cron.
- `places/{name}/media` (photo) — $7.00/1k, onboarding only.

$200/month free credit ≈ 8k Place Details calls ≈ ~250 active restaurants before going over the free tier. Quota caps + €10 budget alert are in place as the safety net.
