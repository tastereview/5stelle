Hi, I'm continuing work on 5stelle.

**IMPORTANT:** Read `CLAUDE.md` and `TODO.md` first.

## Session Context

Last session (2026-04-12) implemented smart OK-sentiment routing (11.3), preview banner (11.1), redesigned the QuickStartChecklist (11.4), and rewrote the landing page copy to focus on Google Reviews (12.8).

## What Was Done

### Phase 11.3: Smart Routing for "OK" Sentiment
- Instead of removing the "OK" option, keep all 3 sentiments but route "OK" customers to Google when their internal star ratings suggest they'd leave a 4+ review
- `QuestionPageClient.tsx`: saves star ratings to sessionStorage (`feedback_star_ratings`, keyed by question ID) alongside existing answer saves
- `ReviewPromptClient.tsx`: routing logic updated — `great` → Google CTA; `ok` + avg star rating ≥ 3.5 → Google CTA; `ok` without star questions → reward; `bad` → reward
- Countdown timer and render guards updated to work with both `great` and qualifying `ok` customers

### Phase 11.1: Preview Banner
- Added `PreviewBanner.tsx` client component — reads `?preview` from URL, shows amber bar: "Modalità anteprima — i dati non vengono salvati"
- Rendered in the feedback flow layout (`src/app/r/[restaurantSlug]/[formId]/layout.tsx`), covers all pages (questions, review, reward)
- All other preview infrastructure (signed tokens, DB skip, form builder button) was already in place

### Phase 11.4: QuickStartChecklist Redesign
- Skipped guided tutorial — dashboard is simple enough, checklist covers it
- Redesigned checklist: now a `ListChecks` icon button in the top-right of the dashboard header with a badge showing remaining steps count
- Clicking opens a dialog with the full checklist (progress bar, numbered steps, links)
- Shows whenever there are incomplete steps (removed `stats.total === 0` gate), auto-hides when all 4 done
- No localStorage collapse state needed — much simpler

### Phase 12.8: Landing Page Google Focus
- Hero rewritten: "Più recensioni a 5 stelle su Google" + subtitle mentions Google tracking
- Pain point section: references Google specifically
- Step 3 (Dashboard): renamed to "Monitora la crescita su Google", illustration redesigned with Google icon, before/after rating (4.2 → 4.6), growth indicator
- Reviews routing visual: Google as primary with gold border and large card, secondary platforms smaller
- Stats section: replaced made-up numbers with real sourced stats (BrightLocal, ReviewTrackers, Zendesk) with "Fonte:" citations
- "Tutto quello che ti serve" features section: removed (redundant with step-by-step)
- "Perfetto per il tuo locale": kept venue types but replaced generic taglines with stats per venue type tied to Google reviews
- Features list, pricing features, CTA copy all updated to reference Google
- Used actual `GoogleIcon` component instead of text "G" in illustrations

## What Changed

**Modified files:**
- `src/components/feedback/QuestionPageClient.tsx` — star rating sessionStorage tracking
- `src/components/feedback/ReviewPromptClient.tsx` — smart routing logic for OK sentiment
- `src/app/r/[restaurantSlug]/[formId]/layout.tsx` — PreviewBanner in layout
- `src/components/dashboard/QuickStartChecklist.tsx` — full rewrite (icon button + dialog)
- `src/app/(dashboard)/dashboard/page.tsx` — checklist placement (inline with header)
- `src/app/page.tsx` — landing page copy rewrite
- `TODO.md` — marked 11.1, 11.3, 11.4, 12.8 complete

**New files:**
- `src/components/feedback/PreviewBanner.tsx` — preview mode banner

## Decisions Made

- **Keep 3 sentiments** — "OK" customers with high star ratings (avg ≥ 3.5) get routed to Google, not removed entirely. Maximizes reviews without risking low ratings.
- **No guided tutorial** — QuickStartChecklist with icon button + dialog is sufficient for a simple B2B dashboard.
- **Real stats on landing page** — replaced made-up numbers with sourced industry stats from BrightLocal, ReviewTrackers, Zendesk.

## Current State

- Branch: `dev`, working directory is **dirty** (changes not committed)
- All Phase 11 UX improvements complete (11.1, 11.2, 11.3, 11.4, 11.5)
- Phase 12.8 landing page rewrite complete
- Google Places API key and CRON_SECRET are in `.env.local` (not in Netlify yet)
- Email confirmation for signups is currently disabled in Supabase Auth

## What's Next

1. **10.3 OpenGraph image + favicon**
2. **13.1 Pre-production** — Add env vars to Netlify, restrict Google API key, update Supabase Auth URLs, decide on email confirmation
3. **10.5 Full testing pass** — All flows, mobile, edge cases
4. **10.6 Launch** — Final deployment

**Key files to read first:**
- `TODO.md` — Full task tracking
- `src/components/feedback/ReviewPromptClient.tsx` — Smart routing logic
- `src/components/dashboard/QuickStartChecklist.tsx` — Setup checklist
- `src/app/page.tsx` — Landing page
