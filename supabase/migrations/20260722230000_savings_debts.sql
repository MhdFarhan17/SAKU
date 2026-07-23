-- savings_goals
create table savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount_minor bigint not null check (target_amount_minor >= 0),
  current_amount_minor bigint not null default 0 check (current_amount_minor >= 0),
  target_date date,
  color text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- savings_transactions
create table savings_transactions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references savings_goals(id) on delete cascade,
  amount_minor bigint not null check (amount_minor > 0),
  kind text not null check (kind in ('deposit', 'withdraw')),
  date date not null,
  created_at timestamptz not null default now()
);

-- debts
create table debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_name text not null,
  kind text not null check (kind in ('payable', 'receivable')),
  amount_minor bigint not null check (amount_minor >= 0),
  due_date date,
  status text not null default 'active' check (status in ('active', 'paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Alter transactions table
alter table transactions add column debt_id uuid references debts(id) on delete set null;

-- RLS
alter table savings_goals enable row level security;
alter table savings_transactions enable row level security;
alter table debts enable row level security;

create policy "own rows" on savings_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows" on savings_transactions
  for all using (
    exists (
      select 1 from savings_goals sg
      where sg.id = savings_transactions.goal_id and sg.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from savings_goals sg
      where sg.id = savings_transactions.goal_id and sg.user_id = auth.uid()
    )
  );

create policy "own rows" on debts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
