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

alter table accounts     enable row level security;
alter table categories   enable row level security;
alter table transactions enable row level security;
alter table budgets      enable row level security;
alter table settings     enable row level security;

create policy "own rows" on accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own settings" on settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

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
