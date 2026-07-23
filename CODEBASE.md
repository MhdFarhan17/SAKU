# CODEBASE.md — Saku Technical Architecture

The engineering blueprint. Scope in PRD.md, UX in design.md, visuals in STYLEGUIDE.md. Read this before writing code.

---

## 1. Architecture in one paragraph

Saku is a **Next.js (App Router) app** deployed on **Vercel**, backed by **Supabase** (Postgres + Auth). It is **server-authoritative and multi-user**: every person signs up, logs in, and sees only their own rows. Data isolation is enforced in the database with **Row-Level Security (RLS)**, not in the UI. Balances are derived in SQL, never stored. Money is stored as integer minor units (IDR, exponent 0) to avoid float drift. Public marketing pages are server-rendered for SEO; the app lives behind auth.

## 2. Stack (committed)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js App Router (14/15) + TypeScript strict** | Vercel is Next's platform, marketing pages need SSR/SEO, Supabase Auth has first-class Next integration. |
| Hosting | **Vercel** | Native Next hosting, GitHub push-to-deploy. |
| DB + Auth | **Supabase (Postgres + Auth + RLS)** | One vendor for relational data, email auth, and per-row security. Postgres is right for financial data and SQL aggregation. |
| Auth glue | **@supabase/ssr** + Next middleware | Cookie-based sessions across server and client, route protection. |
| Styling | **Tailwind + CSS-variable tokens** | Utilities map to STYLEGUIDE variables. No raw hex. |
| Components | **Radix UI primitives + CVA, our own styled layer** | Accessibility for free, our own look. Not stock shadcn. |
| Server state | **TanStack Query** (client) + **Server Components** (marketing/initial) | Optimistic writes for the fast add loop; SSR where SEO matters. |
| UI state | **Zustand** | Ephemeral state: active period, filters, open sheets. |
| Forms | **react-hook-form + zod** | Validation contract doubles as TS types. |
| Charts | **Recharts, fully themed** | Reliable; STYLEGUIDE §12 overrides all colors/chrome. visx is the escape hatch. |
| Motion | **Framer Motion** | Purposeful only, reduced-motion respected. |
| Icons | **lucide-react** | One set, consistent. |
| Dates | **date-fns** + locale packs | Locale-aware. |
| Virtualization | **@tanstack/react-virtual** | Long transaction lists. |
| Test | **Vitest + Testing Library + Playwright + axe-core** | Includes an RLS cross-user test. |
| Lint/format | **ESLint (typescript-eslint, jsx-a11y, i18next) + Prettier** | i18n and a11y gates. |

## 3. Environment variables

| Var | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Public anon key (RLS still applies) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Admin actions (delete account). Never sent to the client, never in a `NEXT_PUBLIC_` var. |
| `NEXT_PUBLIC_SITE_URL` | client + server | Base URL for auth redirects |

Set in Vercel project settings and in a local `.env.local` (gitignored). Configure Supabase Auth "Site URL" and redirect allow-list to match.

## 4. Folder structure (App Router)

```
app/
  layout.tsx                 # root html, providers, no-flash theme script
  globals.css
  (marketing)/
    layout.tsx               # public nav + footer
    page.tsx                 # /  Home/Landing
    features/page.tsx        # /features
    about/page.tsx           # /about
    privacy/page.tsx  terms/page.tsx  contact/page.tsx
  (auth)/
    login/page.tsx  signup/page.tsx
    forgot-password/page.tsx  reset-password/page.tsx
  auth/callback/route.ts     # OAuth/email code exchange -> session
  (protected)/
    app/
      layout.tsx             # session guard + app shell (nav per breakpoint)
      page.tsx               # /app Dashboard
      transactions/page.tsx
      accounts/page.tsx  accounts/[id]/page.tsx
      reports/page.tsx  budgets/page.tsx
      settings/page.tsx  onboarding/page.tsx
middleware.ts                # refresh session, protect /app/*
src/
  components/                # styled UI layer (Radix + CVA): Button, Input, Card, Sheet,
                             #   AmountChip, AccountChip, CategoryToken, EmptyState,
                             #   Skeleton, ErrorState, PeriodControl, FlowBar, AuthCard, Footer
  features/
    transactions/ { components/ api.ts queries.ts TransactionSheet.tsx }
    accounts/ categories/ budgets/ reports/ dashboard/ settings/ onboarding/ auth/
  lib/
    supabase/ { client.ts server.ts middleware.ts admin.ts }
    money.ts date.ts format.ts
  db/
    types.ts                 # generated Supabase types + domain types
  charts/  i18n/  store/  theme/  styles/
supabase/
  migrations/                # versioned SQL, checked into git
  seed.sql                   # optional local seed
```

Rule: a feature never imports another feature's internals. Cross-feature needs go through `lib/`, `components/`, `store/`, or the data layer.

## 5. Data model and SQL schema

Money is `bigint` **minor units**, `>= 0`. IDR exponent is 0. Never float. Balances are never stored.

```sql
-- accounts
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('cash','bank','card','ewallet')),
  currency text not null default 'IDR',
  starting_balance_minor bigint not null default 0,
  color text, icon text,
  archived boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('income','expense')),
  parent_id uuid references categories(id) on delete set null,
  color text, icon text,
  archived boolean not null default false,
  sort_order int not null default 0
);

-- transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('income','expense','transfer')),
  amount_minor bigint not null check (amount_minor >= 0),
  account_id uuid not null references accounts(id) on delete restrict,
  to_account_id uuid references accounts(id) on delete restrict,
  category_id uuid references categories(id) on delete restrict,
  date date not null,
  note text, tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfer_shape check (
    (kind = 'transfer' and to_account_id is not null and category_id is null)
    or (kind in ('income','expense') and category_id is not null and to_account_id is null)
  )
);
create index on transactions (user_id, date);
create index on transactions (user_id, account_id, date);
create index on transactions (user_id, category_id, date);

-- budgets
create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  amount_minor bigint not null check (amount_minor >= 0),
  period text not null default 'monthly',
  start_month date not null
);

-- settings (one row per user)
create table settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'en',
  theme text not null default 'light',
  currency text not null default 'IDR',
  first_day_of_week int not null default 1,
  onboarding_complete boolean not null default false
);
```

The `transfer_shape` check makes bad transaction shapes impossible at the database, not just discouraged in code. Every `on delete cascade` to `auth.users` is what makes account deletion wipe the user's data cleanly.

## 6. Security: RLS is the number one rule

Per-user isolation is enforced in the database. If this is wrong, one user reads another's finances through the API. Non-negotiable.

Enable RLS on every table and add own-rows policies:

```sql
alter table accounts     enable row level security;
alter table categories   enable row level security;
alter table transactions enable row level security;
alter table budgets      enable row level security;
alter table settings     enable row level security;

create policy "own rows" on accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- identical policy repeated for categories, transactions, budgets
create policy "own settings" on settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Rules:
- RLS stays **on** for every table. A new table without RLS is a bug that blocks merge.
- The client only ever uses the **anon key**. RLS does the isolation, the client cannot bypass it.
- The **service-role key** bypasses RLS and is server-only. It is used in exactly one place in v1: the delete-account admin path (§9). Never import `lib/supabase/admin.ts` into a client component.
- **Required test (must exist, must pass):** sign in as user A, insert a row, sign in as user B, attempt to select and to update A's row. Both must return zero rows / be denied. This test is in the suite and CI. See §16.

## 7. Balances derived in SQL

No `balance` column. Balance is a security-invoker view (Postgres 15+, Supabase), so it runs under the caller's RLS and returns only their accounts:

```sql
create view account_balances with (security_invoker = true) as
select a.id as account_id, a.user_id,
  a.starting_balance_minor + coalesce(sum(
    case
      when t.kind = 'income'   and t.account_id    = a.id then  t.amount_minor
      when t.kind = 'transfer' and t.to_account_id = a.id then  t.amount_minor
      when t.kind = 'expense'  and t.account_id    = a.id then -t.amount_minor
      when t.kind = 'transfer' and t.account_id    = a.id then -t.amount_minor
      else 0
    end), 0) as balance_minor
from accounts a
left join transactions t
  on t.user_id = a.user_id and (t.account_id = a.id or t.to_account_id = a.id)
group by a.id;
```

Report aggregations (monthly totals, spending by category, net-worth series) are similar security-invoker views or RPC functions, so heavy math runs in Postgres and stays per-user. A cached mutable balance is how finance apps silently lie; do not add one. Property tests assert derived balances equal the direct sum after any random write sequence.

## 8. Money layer

`lib/money.ts` is the only place currency is formatted or mathed. `formatMoney(amountMinor, 'IDR', locale)` wraps `Intl.NumberFormat(locale, { style:'currency', currency:'IDR', minimumFractionDigits:0 })`, rendering `Rp` with `.` grouping. Arithmetic is integer-only on minor units. Signed display (`+`/`-` and color) is decided at the presentation layer (`AmountChip`) from `kind`. No `Intl` for money outside this module.

## 9. Auth

Uses `@supabase/ssr` for cookie sessions.

- **Clients:** `lib/supabase/client.ts` (`createBrowserClient`) for client components, `lib/supabase/server.ts` (`createServerClient`, reads/writes cookies) for server components, route handlers, and server actions.
- **Middleware** (`middleware.ts`) refreshes the session on every request and guards routes: unauthenticated requests to `/app/*` redirect to `/login`; authenticated requests to `/login` and `/signup` redirect to `/app`.
- **Flows:** signup (email + password), login, logout, forgot/reset password. `/auth/callback` exchanges the email code for a session. All auth errors surface as localized, blameless copy, never raw Supabase strings.
- **New-user seeding:** a Postgres trigger on `auth.users` insert seeds that user's `settings` row and default categories, so a new account is usable immediately. This runs in a `security definer` function scoped to the new `user_id`.
- **Delete account (FR-AUTH-6):** a server action or route handler that (1) verifies the current session with the server client, (2) uses `lib/supabase/admin.ts` (service-role) to `auth.admin.deleteUser(user.id)`, which cascades and wipes all their rows. The service-role key never touches the client. Confirmation is a typed phrase in the UI, and the copy states it is irreversible.

## 10. Data fetching and state

- **App data:** client components use the browser Supabase client wrapped in a per-feature data layer (`features/*/api.ts` for writes, `queries.ts` for reads), consumed via **TanStack Query**. Query keys include the resource; mutations use optimistic updates for the transaction loop and invalidate balances and lists on settle. On failure, optimistic rows roll back with a retry.
- **Marketing/auth:** Server Components and server actions where SEO or first-paint matters.
- **UI state:** Zustand (`store/ui.ts`): active period, filters, sheet state. Kept minimal.
- All writes go through the feature data layer, never scattered `supabase.from(...).insert` calls in components.

## 11. Theming (light default, no flash)

- Tokens in `styles/tokens.css`: `:root` light, `.dark` dark (STYLEGUIDE §3). Tailwind `darkMode: 'class'`.
- Default is **light on first load, always.** No system read on first visit.
- Preference persists (`light | dark | system`); `system` consults `matchMedia` only when chosen. For logged-in users the choice also lives in `settings.theme` and syncs.
- A **no-flash inline script** in the root layout sets `.dark` before paint when the stored preference resolves to dark, preventing a light-to-dark flicker. Because the default is light, most first paints need no class.
- Switch flips `.dark` on `<html>` and cross-fades (reduced-motion respected).

## 12. Internationalization

- `i18next` + `react-i18next`, resources `id` / `en`, `fallbackLng: 'en'`. On first visit, default to Indonesian if `navigator.language` starts with `id`, else English; user choice persists (and syncs to `settings.language` when logged in).
- Every user-facing string is a key in `i18n/locales/*.json`, ID written natively. The lint rule fails the build on inline user-facing text.
- Numbers, dates, currency via `Intl` through `lib/` helpers. Layout tested against the ID locale (longer strings). Applies to marketing, auth, and app.

## 13. Routing

Route groups: `(marketing)` public, `(auth)`, `(protected)/app`. The `(protected)/app/layout.tsx` checks the session server-side and renders the responsive shell. Add-transaction is not a route; it is a global sheet driven by UI state.

## 14. Charts

`charts/theme.ts` bridges CSS-variable tokens into Recharts (which needs explicit JS colors), re-reading on theme change so STYLEGUIDE stays the single source of truth and dark mode works. Wrapped components enforce fixed series colors (income green, expense red, net ink), a curated category ramp (no rainbow), hairline gridlines, a custom tooltip, and a drill-through callback. A chart that cannot be drilled is cut.

## 15. Performance

- Transaction lists virtualized (`@tanstack/react-virtual`).
- Filtered reads hit the composite indexes (§5); aggregations run in Postgres views/RPCs, not in the browser.
- TanStack Query caches and dedupes; marketing pages are static/SSR.
- Use the Supabase connection pooler for serverless.
- Seed 5,000 fake transactions for one user and verify list and report performance before shipping those views.

## 16. Testing

- **Unit (Vitest):** `money.ts`, balance math, the transfer-shape and amount constraints. Property test: derived balances equal the direct sum after any random write sequence.
- **Security (must exist):** the RLS cross-user test from §6, run against a local Supabase or a test project: user A's rows are invisible and unwritable to user B.
- **Component (Testing Library):** the transaction sheet (validation, 4-tap path, optimistic + rollback), amount chip, empty/error states, auth forms.
- **E2E (Playwright):** signup → confirm → onboarding → record expense → transfer → month-end review; login/logout; theme and language persistence; delete-account.
- **A11y (axe-core):** every top-level screen in CI, zero critical violations, plus a manual keyboard pass.

## 17. Coding standards

- TypeScript `strict`, no `any`. Generate Supabase types into `db/types.ts` and use them.
- Path alias `@/` to `src/`.
- No business logic in `components/`; no data access outside the feature data layer; no `Intl` for money outside `lib/money.ts`; no raw hex; no inline user-facing strings; no service-role key on the client. These are enforced by lint where possible, review where not.
- Conventional Commits. Small PRs mapped to PRD requirement IDs.
- Prettier + ESLint (typescript-eslint, react-hooks, jsx-a11y, i18next) must pass clean.

## 18. Build and deploy

- `pnpm dev` local. Supabase CLI runs a local stack for development and applies `supabase/migrations`.
- All schema changes are **migration files checked into git**, so the database is reproducible. No clicking around the Supabase dashboard for schema.
- Push to GitHub, Vercel builds and deploys. Set the four env vars in Vercel. Configure Supabase Auth Site URL and redirect allow-list to the Vercel domain.
- CI runs typecheck, lint, unit, RLS, and axe on every push; e2e on main.

## 19. Definition of done (per feature)

Uses only STYLEGUIDE tokens (no raw hex); all user-facing strings localized (ID + EN), layout survives ID; loading, empty (new + filtered), error, and populated states all present; keyboard-navigable, visible focus, passes axe, AA both themes; money via `lib/money.ts`, balances derived, writes via the feature data layer; **RLS on for any new table and the cross-user test green**; works in light and dark; tests present for critical paths. "Renders the happy path" is not done.
