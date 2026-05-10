Hi, I'm continuing work on 5stelle.

**IMPORTANT:** Read `CLAUDE.md` and `TODO.md` first.

## Session Context

Last session (2026-05-10) diagnosed intermittent issues on the live app during real-device phone testing for the first client, and added client-error logging to the feedback flow so future failures can be inspected from Supabase. Dev is ahead of master by 6 commits and prod was missing important fixes.

## Symptoms Reported on Phone (Live App)

1. "Errore nel salvare la risposta" toast — sometimes blocks progression
2. UI freezes (taps on stars/buttons don't register, then unfreezes after a moment)
3. Slow answer saves — eventually works but takes a while

Strong suspects: (a) Turnstile token expiring without auto-refresh — already fixed in `2c52488` but not yet deployed to prod; (b) Supabase post-resume cold-start latency (project recently came back from pause).

## Critical State

- **Dev is ahead of master by 6 commits** (5 from before + 1 from this session). Production deploys from master (confirm in Netlify UI). Merge dev → master to get all fixes + logging live.
- **All DB migrations are live on Supabase** — verified this session: `questions.is_active`, `submissions.review_prompt_shown_at` / `review_link_clicked_at` / `review_platform_clicked`, `review_snapshots`, and the new `client_errors` table. Single Supabase project covers dev + prod.
- **Netlify env vars NOT set:** `GOOGLE_PLACES_API_KEY` and `CRON_SECRET` (TODO 13.1). Not blocking current testing (existing client is past onboarding, cron just no-ops without secret), but onboarding will 500 on the Google search step for any new signup until added.
- **`database-schema.sql` was just regenerated** from the live DB — it now reflects actual prod state including `client_errors`.

## What Was Done This Session

### `client_errors` table created on Supabase
```sql
create table public.client_errors (
  id          uuid default gen_random_uuid() primary key,
  occurred_at timestamptz default now() not null,
  context     text, message text, code text, details text,
  metadata    jsonb, user_agent text
);
alter table public.client_errors enable row level security;
create policy "Anyone can insert errors" on public.client_errors
  for insert to anon, authenticated with check (true);
create index idx_client_errors_occurred_at
  on public.client_errors (occurred_at desc);
```
No SELECT policy → clients can't read each other's errors. Read via Supabase Studio (service_role bypasses RLS).

### Logging wired in `src/components/feedback/QuestionPageClient.tsx`
- Catch now captures the error (`} catch (err) {` instead of `} catch {`) — previously the error object was being discarded entirely
- New `logClientError` helper inserts to `client_errors` with full metadata: form_id, restaurant_slug, question_id, question_type, question_index, is_last, has_turnstile_token, submission_id, table_identifier, user_agent
- Two log sites:
  - `feedback_flow:save_answer` — main catch (covers submission insert, answer upsert, sentiment update, complete update, Turnstile fetch network failures)
  - `feedback_flow:turnstile_verify_failed` — Turnstile returned `success: false` (previously a silent non-throw failure path)
- Skipped in preview mode

## What's Next (in order)

1. **Commit (already done as the last commit on dev) + merge dev → master** so prod gets the Turnstile auto-refresh fix, the smart OK-routing, the Google Reviews tracking, and the new error logging.
2. **Add `GOOGLE_PLACES_API_KEY` and `CRON_SECRET` to Netlify** env vars (TODO 13.1).
3. **Phone-test the live app** to reproduce the symptoms, then **check the logs**:
   ```sql
   select occurred_at, context, message, code, details, metadata, user_agent
   from public.client_errors
   order by occurred_at desc
   limit 50;
   ```
   Or in Supabase Studio → Table Editor → `client_errors`.
4. **If logs explain the save errors** → fix root causes (likely RLS, constraint, or post-resume connection issues). **If the freeze symptom doesn't appear in logs** (likely — that's a hung promise, not a thrown error), add timeout-based instrumentation around the Supabase calls in QuestionPageClient.
5. After stability is confirmed: **10.3 OG image + favicon**, **10.5 full testing pass**, **10.6 launch**.

## Key Files

- `TODO.md` — task tracking (Phase 14 added for observability)
- `src/components/feedback/QuestionPageClient.tsx` — feedback save logic + client error logging
- `database-schema.sql` — current live schema (regenerated this session)
