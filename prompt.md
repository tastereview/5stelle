Hi, I'm continuing work on 5stelle.

**IMPORTANT:** Read `CLAUDE.md` and `TODO.md` first.

## Session Context

Last session (2026-05-25) was a planning session — no code shipped. We reviewed the landing page and made a strategic decision: switch from self-serve PLG (every CTA → `/signup` with "no card required") to **demo-gated access** via Cal.com. Manual screening fits the current stage (1 client onboarded, reliability > volume per [[project_first_client]]). Cal.com account created same session, connected to Apple Calendar.

## Critical State

- **Branch `dev` modified files at session start:** TODO.md + prompt.md only (planning updates from the 2026-05-25 session) — see if they're still uncommitted or have been pushed and merged to master.
- **Most recent landed change:** `12b6609` on dev + master (2026-05-17 session — 1-hour reward page expiry + submit-button spinner flicker fix).
- Netlify auto-deploys from master.
- No production changes between 2026-05-17 and 2026-05-25.

## What Happened in the 2026-05-25 Session

1. **Reviewed the landing page** (`src/app/page.tsx`) and surfaced the top improvement areas: no social proof, text-only hero, no FAQ, generic headline, externally-sourced stats only, only 2 CTAs in the whole page.

2. **Spotted CTA/business-model mismatch.** All 4 primary CTAs (navbar, hero, pricing card, final CTA) point at `/signup` with "Nessuna carta di credito richiesta" — textbook self-serve PLG. But the user wants demo-gated access at this stage (first client just onboarded, reliability priority). Decision: swap all CTAs to "Prenota una demo" → Cal.com.

3. **Cal.com booking link:** `https://cal.eu/miralmedia/demo-5stelle-app`. Note the `cal.eu` domain (not `cal.com`) — worth confirming this is intentional (EU instance for GDPR) and not a typo. Apple Calendar connected; event type not yet configured.

4. **Logged the full plan in `TODO.md` Phase 17** in three buckets:
   - **17.1 Cal.com setup** — configure event type (15 min, Italian, intake questions), test booking flow end-to-end.
   - **17.2 Landing page CTA rework** — swap all 4 CTAs, remove "no card" microcopy, decide what to do with `/signup` route (cross-refs Phase 16.1 "lock down signups").
   - **17.3 Landing page improvements** — sharpen headline, add hero visual, FAQ section, social proof (once first client is 2-3 weeks in), swap external stats for owned data, add mid-page CTA.

## What's Next (priority order)

1. **Configure the Cal.com event type before touching the landing page.** Walk through: 15-min duration, working hours, Italian language, intake questions on the booking form (restaurant name, città, phone, "come ci hai conosciuto"), confirmation + reminder emails. Test by booking a slot from a different account. Going live with broken / half-configured booking is worse than not going live.

2. **Then the CTA rework (Phase 17.2).** Quick win — 4 string + href changes in `src/app/page.tsx`. Decide same time what `/signup` should do (Phase 16.1 has the same open question).

3. **Then Phase 17.3 polish.** Headline + hero visual + FAQ are the three biggest. Social proof waits until first client is 2-3 weeks in and willing to give a quote.

4. **Still open from Phase 16.1 (Critical before handoff):** end-to-end Stripe test in prod, destructive-action guard audit, mobile dashboard pass, print + scan a real QR, re-read `/privacy` and `/terms`. These remain the launch blockers — the demo-gating work doesn't replace them.

5. **Phase 15.4 verification still pending** — phone-test 15.3 (no spinner flicker) and 15.5 (reward "Premio valido fino alle HH:MM" + expired state) on the live app, then check `client_errors` for new rows.

## Key Files

- `src/app/page.tsx` — landing page, 4 CTA locations all currently → `/signup`
- `TODO.md` — Phase 17 has the landing-page rework plan, Phase 16.1 still has the critical pre-handoff items
- `src/components/feedback/QuestionPageClient.tsx` — feedback save logic + `logClientError` helper + sentiment routing
- `src/components/feedback/RewardClient.tsx` — reward screen with 1-hour soft expiry
- `database-schema.sql` — current live schema

## Reference

- Cal.com booking link: `https://cal.eu/miralmedia/demo-5stelle-app`
- Cal.com account: connected to user's Apple Calendar (2026-05-25)
- Saved to memory: [[reference_cal_booking]]

## Pricing Refresher (Places API New, server-side)

- `places:autocomplete` — $2.83/1k (default tier)
- `places/{id}` with field mask incl. `rating,userRatingCount,reviews` — **$25.00/1k (Enterprise tier)** — the expensive one. Once per onboarding + once per restaurant per day from the cron.
- `places/{name}/media` (photo) — $7.00/1k, onboarding only.

$200/month free credit ≈ 8k Place Details calls ≈ ~250 active restaurants before going over the free tier. Quota caps + €10 budget alert are in place as the safety net.
