# PRD — Saku (Personal Finance Tracker)

> Working title: **Saku** (Indonesian for "pocket"). Rename freely; docs reference the token `APP_NAME`, not the literal string.

**Status:** Draft v2 (stack locked: Next.js + Supabase)
**Owner:** [you]
**Doc language:** English (agent-facing). Product UI ships in Indonesian + English.
**Last updated:** 2026-07-22

---

## 1. Why this exists

People in Indonesia hold money in many places at once: cash, one or two bank cards, and several e-wallets (GoPay, OVO, DANA, ShopeePay, bank transfers). Most trackers force one account model, look dated, or bury the one number that matters (how much do I have, where is it going) under clutter.

Saku's single job: **make your money legible at a glance and cheap to record.** Legible means one honest total, split by where the money lives and where it goes. Cheap means adding a transaction takes under five seconds on a phone with one thumb.

If a feature does not serve one of those two jobs, it is out of scope for v1.

## 2. What this is and is not

**Is:** a free, hosted, multi-user web app. Each person signs up with email, logs in, and sees only their own financial data. Data lives in a Postgres database (Supabase), isolated per user.

**Is not:**
- Not a bank or payment app. No real money moves.
- Not accounting software. No double-entry ledger exposed, no tax reports.
- Not an investment/portfolio tracker.
- Not multi-user *collaboration* (no shared household ledgers in v1). Multi-user means many separate private accounts, not shared ones.
- Not multi-currency. **IDR only in v1.** Deliberately deferred; see §12.
- Not offline-capable in v1. Data is server-authoritative, so a connection is required. Offline is a post-v1 consideration.

**Free means free:** there is no paid tier, no paywall, no locked feature, no "upgrade" prompt anywhere. Every feature in this doc is available to every user at no cost. (Infrastructure has free-tier limits, which is an operational concern in §11, not a product paywall.)

## 3. Target users

**Primary — "Rani, the multi-wallet juggler."** 24-35, urban Indonesia. Uses 2-4 e-wallets plus cash plus a debit card. Wants to know at month-end where the money went without doing accounting. Records on the go on a mid-range Android, often on mobile data. Cares that it is fast, private, and does not nag.

**Secondary — "Dimas, the spreadsheet migrant."** 30-45, tracks in Excel today, wants structure, categories, and real reports, and wants to import history. Uses tablet and desktop more.

Ties break toward Rani: mobile-first, speed-first. Dimas is served by depth in Reports and by import, not by making the daily loop heavier.

## 4. Platform and constraints

- **Next.js (App Router) web app**, deployed on **Vercel**. Backend and data on **Supabase** (Postgres + Auth).
- Mobile-first. Excellent on smartphone (primary), good on tablet/iPad, complete on desktop.
- **Authentication required** for the app. Public marketing pages are open.
- **Default language:** follows the browser on first visit if Indonesian, else English. User override persists.
- **Default theme:** Light on first open, always, regardless of system. Dark and "follow system" are opt-in.
- **Currency:** IDR only. Rupiah, no decimals, `.` thousand separators.
- **Data isolation is enforced at the database (RLS), not just the UI.** See §9 and CODEBASE §Security.

## 5. Page map

Three groups. The footer (on public pages) carries Privacy Policy, Terms of Service, and Contact/Support.

**Public (open, SEO-indexed):**
- `/` Home / Landing
- `/features` Features
- `/about` About
- `/privacy` Privacy Policy (footer)
- `/terms` Terms of Service (footer)
- `/contact` Contact / Support (footer; may be a simple mailto + form)

**Auth:**
- `/login`, `/signup`
- `/forgot-password`, `/reset-password`
- `/auth/callback` (email confirmation / session exchange)

**App (protected, per-user):**
- `/app` Dashboard
- `/app/transactions` (list, filter, add/edit)
- `/app/accounts`, `/app/accounts/[id]`
- `/app/reports`
- `/app/budgets`
- `/app/settings` (appearance, money, manage categories/accounts, **Account**: change email/password, logout, **delete account + all data**, data export/import)
- `/app/onboarding` (first run after signup)

## 6. Scope for v1 (functional requirements)

IDs, plain statements, acceptance criteria (AC). Must = v1. Should = v1 if cheap. Could = deferred.

### 6.1 Authentication & account (`FR-AUTH`)
- **FR-AUTH-1 (Must):** Sign up with email + password. AC: password rules enforced, clear errors, email confirmation flow handled.
- **FR-AUTH-2 (Must):** Log in and log out.
- **FR-AUTH-3 (Must):** Forgot password / reset via email link.
- **FR-AUTH-4 (Must):** Unauthenticated users are redirected from `/app/*` to `/login`; authenticated users are redirected away from `/login` and `/signup`.
- **FR-AUTH-5 (Must):** In Settings, change password and view the account email.
- **FR-AUTH-6 (Must):** **Delete account.** Permanently deletes the auth user and cascades to all their data, behind an explicit confirmation. This is a legal requirement (right to erasure, see §10), not a nicety.

### 6.2 Accounts / Wallets (`FR-ACC`)
- **FR-ACC-1 (Must):** Create accounts of type `cash`, `bank`, `card`, `ewallet`. AC: name, type, IDR currency, starting balance, color, icon. Type drives the default glyph.
- **FR-ACC-2 (Must):** Current balance shown per account, **derived** from starting balance plus/minus its transactions. Editing/deleting a transaction updates it immediately.
- **FR-ACC-3 (Must):** Edit and archive an account. Archived accounts keep history, drop out of pickers/totals. Deleting an account with transactions is refused; offer archive.
- **FR-ACC-4 (Should):** Account detail view with its own history and balance trend.

### 6.3 Transactions (`FR-TXN`)
- **FR-TXN-1 (Must):** Record `income`, `expense`, or `transfer`. Income/expense: type, amount, account, category, date (default today), optional note/tags. Transfer: amount, from account, to account, date, optional note; never counts as income or expense in reports.
- **FR-TXN-2 (Must):** Add flow reachable in one tap anywhere, completable under 5 seconds for the common case. Amount field focused with numeric keypad on open. Optimistic UI so the write feels instant.
- **FR-TXN-3 (Must):** List, search, filter (date range, account, category, type, tag), sort. Default newest-first, grouped by day with per-day subtotal.
- **FR-TXN-4 (Must):** Edit and delete, with undo on delete.
- **FR-TXN-5 (Should):** Recurring transactions.
- **FR-TXN-6 (Could, deferred):** Receipt attachments (Supabase Storage), split transactions.

### 6.4 Categories (`FR-CAT`)
- **FR-CAT-1 (Must):** Ship default categories (income + expense), localized. User can add, rename, recolor, re-icon, archive. On signup, defaults are seeded for that user.
- **FR-CAT-2 (Should):** One level of sub-categories.
- **FR-CAT-3 (Must):** Every income/expense has exactly one category; transfers have none.

### 6.5 Budgets (`FR-BUD`)
- **FR-BUD-1 (Should):** Monthly budget per expense category, with spent vs budget and an over-budget state on Dashboard and Budgets.
- **FR-BUD-2 (Could, deferred):** Rollover, non-monthly periods.

### 6.6 Dashboard (`FR-DASH`)
- **FR-DASH-1 (Must):** One screen answering "how much do I have and how is this month going": total balance across active accounts, this-month income/expense/net, a cashflow visual, budget summary, per-account balances, recent transactions.
- **FR-DASH-2 (Must):** Every figure respects IDR formatting and the selected period.

### 6.7 Reports (`FR-RPT`)
- **FR-RPT-1 (Must):** Spending by category for a period (share-of-total visual + ranked list with amounts and percentages).
- **FR-RPT-2 (Must):** Income vs expense over time (monthly) and net cashflow.
- **FR-RPT-3 (Must):** Net worth / total balance over time.
- **FR-RPT-4 (Should):** Month-over-month comparison, top categories.
- **FR-RPT-5 (Must):** Date-range control with presets (this month, last month, last 3 months, this year, custom). Every chart is drillable to the transactions behind it.

### 6.8 Settings & data (`FR-SET`)
- **FR-SET-1 (Must):** Toggle language (ID/EN), theme (Light/Dark/System, default Light), first day of week.
- **FR-SET-2 (Must):** Manage categories and accounts.
- **FR-SET-3 (Must):** Export all of the user's data (JSON full fidelity, CSV for transactions). Import from that JSON and from a documented CSV shape.
- **FR-SET-4 (Must):** Account section: change password, logout, delete account + data.

### 6.9 Onboarding (`FR-ONB`)
- **FR-ONB-1 (Must):** After first signup: confirm language/currency (IDR fixed), create first account, categories already seeded, land on Dashboard with a prompt to add the first transaction. Three light steps, skippable defaults.

### 6.10 Marketing pages (`FR-MKT`)
- **FR-MKT-1 (Must):** Home/Landing that states what Saku is, shows the product honestly, and drives to signup. Server-rendered for SEO.
- **FR-MKT-2 (Must):** Features and About pages, server-rendered, localized.
- **FR-MKT-3 (Must):** Footer on all public pages linking Privacy, Terms, Contact.
- No Pricing page. The product is free; say so plainly on the landing instead.

## 7. Key user flows

1. **Record an expense (must be perfect):** tap FAB → amount keypad focused → amount → category (recents first) → account defaults to last used → Save → toast + running balance updates. Target under 5 seconds, 4 taps, optimistic.
2. **Transfer between wallets:** FAB → Transfer → amount → from GoPay → to Cash → Save. Reports never double count it.
3. **Month-end review:** Reports → "This month" → read category breakdown and income vs expense → drill into a category → see the transactions behind the number.
4. **Sign up and start:** signup → confirm email → onboarding → first transaction, all in one sitting.
5. **Leave cleanly:** Settings → Delete account → explicit confirm → auth user and all data removed.

## 8. Success criteria

No product analytics that ship transaction contents. Success is observable quality:
- A new user records their first transaction within a couple of minutes of signup, no instructions.
- The daily loop is 4 taps / under 5 seconds.
- Every screen has designed loading, empty (new vs filtered), and error states.
- Reports answer "where did my money go this month" without touching a filter.
- Automated a11y (axe) passes with zero critical violations; core flows are keyboard-navigable.
- **A user cannot read or write another user's data**, verified by a test that tries and fails (see §9).

## 9. Data isolation (the rule that must not be wrong)

Every user's data is private. This is enforced in the database with **Row-Level Security (RLS)**, not in the UI. Every data table carries a `user_id` referencing `auth.users(id)`. RLS is enabled on every table with a policy: a user can only read or write rows where `user_id = auth.uid()`. If RLS is off or a policy is wrong, one user can read another's finances through the API directly. For a finance app that is a breach, not a bug. CODEBASE §Security specifies the policies and the test that must exist.

## 10. Legal and privacy (UU 27/2022 PDP)

Once financial records are stored on the server, you are a personal-data controller under Indonesia's UU No. 27/2022 (PDP). The product must support this, not just claim it:
- **Privacy Policy** stating what is collected (email, financial records), the purpose, where it is stored, retention, and user rights (access, correct, delete).
- **Right to erasure** is satisfied by FR-AUTH-6 (delete account + cascade).
- **Data export** (FR-SET-3) supports the right of access / portability.
- **Cross-border transfer disclosure:** Supabase regions are outside Indonesia (recommend Singapore for latency). Storing Indonesian users' data abroad is a cross-border transfer that PDP regulates and the Privacy Policy must disclose. You are the legal expert here; the docs flag the requirement, you write the binding text.

Terms of Service should at minimum disclaim that Saku is a personal tool, not financial advice or a regulated financial service.

## 11. Infrastructure and its free-tier limits (be honest with yourself)

Free for users; the infra free tiers still have edges to plan around:
- **Supabase free:** project pauses after roughly a week of inactivity, ~500MB database, and built-in auth email has a low hourly send limit. For reliable signup/reset emails, configure a free SMTP (for example Resend's free tier) rather than the built-in sender.
- **Vercel Hobby:** free but intended for non-commercial use per Vercel's terms. Fine for a personal/portfolio or non-commercial public tool, which this is. If it ever becomes an official or monetized service, revisit the plan.
- Choose the Supabase region closest to users (Singapore) and note it in the Privacy Policy.

None of this changes that the product is free to users. It is operational reality you should know before launch.

## 12. Open / settled decisions

- **Currency:** IDR only. Settled. Multi-currency and FX are out of v1.
- **Cloud sync:** now inherent (server-authoritative). Settled.
- **Framework:** Next.js App Router. Settled.
- **Backend:** Supabase (Postgres + Auth). Settled.
- **Paid tier:** none. Settled.
- **App name:** `Saku` placeholder; give a real one if you have it.
- **Email confirmation on signup:** recommended on, with custom SMTP. Confirm you want confirmation (adds a step) vs instant access (simpler, weaker).

## 13. Roadmap / phasing

- **Phase 0 — Skeleton:** Next.js app, Supabase project, schema + RLS + migrations, auth (signup/login/logout/reset), middleware route protection, theme + i18n plumbing, design tokens, empty app shells, and the public marketing shell.
- **Phase 1 — Core loop:** accounts CRUD, transaction CRUD (income/expense/transfer), category management, the add sheet, the ledger with filters. Per-user, RLS-verified.
- **Phase 2 — Insight:** dashboard, reports (SQL aggregations), budgets, date-range engine.
- **Phase 3 — Polish & durability:** onboarding, export/import, all states, motion pass, a11y audit, performance at 5k+ transactions per user, marketing pages finalized, Privacy/Terms live.
- **Phase 4 (post-v1):** recurring transactions, receipts, offline support, shared household ledgers.

Do not build Phase 2 charts before Phase 1 data and RLS are real and tested.

## 14. Risks

- **RLS misconfiguration → data breach.** The top risk. Mitigation: RLS on by default, policies reviewed, a cross-user access test that must fail.
- **Balance drift.** Mitigation: balances derived in SQL, money as integer minor units, tests on balance math.
- **AI-slop UI.** Mitigation: STYLEGUIDE is binding, own component layer, AGENTS anti-slop rules.
- **Auth email deliverability on free tier.** Mitigation: custom SMTP.
- **Service-role key leakage.** The delete-account and admin paths need the Supabase service-role key, which is server-only. Mitigation: never expose it to the client; use it only in server actions/route handlers. See CODEBASE §Security.
- **i18n rot.** Mitigation: no hardcoded user-facing strings, lint gate.
