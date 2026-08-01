-- ============================================================
-- FixitPoint360 - Supabase schema
-- Run this in the Supabase SQL Editor for your project.
-- Safe to re-run (uses IF NOT EXISTS).
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- profiles  (extends auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null default '',
  phone text not null default '',
  role text not null default 'staff' check (role in ('owner', 'admin', 'staff')),
  designation text not null default '',
  status text not null default 'active' check (status in ('active', 'inactive')),
  salary numeric not null default 0,
  commission_rate numeric not null default 0,
  joined_at date default current_date,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- clients
-- ------------------------------------------------------------
create table if not exists public.clients (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  address text,
  city text,
  pincode text,
  type text not null default 'residential' check (type in ('residential', 'business', 'corporate')),
  gstin text,
  notes text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- jobs
-- ------------------------------------------------------------
create table if not exists public.jobs (
  id text primary key,
  job_no integer not null,
  client_id text not null references public.clients(id) on delete cascade,
  category text not null default 'other' check (category in ('cctv', 'computer', 'printer', 'household', 'other')),
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid references public.profiles(id) on delete set null,
  scheduled_date date,
  completed_date date,
  charges numeric not null default 0,
  material_cost numeric not null default 0,
  advance numeric not null default 0,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'partial', 'paid')),
  payment_mode text not null default 'pending' check (payment_mode in ('cash', 'upi', 'bank', 'card', 'pending')),
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

create index if not exists idx_jobs_client on public.jobs(client_id);
create index if not exists idx_jobs_assigned on public.jobs(assigned_to);

-- ------------------------------------------------------------
-- amcs
-- ------------------------------------------------------------
create table if not exists public.amcs (
  id text primary key,
  client_id text not null references public.clients(id) on delete cascade,
  category text not null default 'other' check (category in ('cctv', 'computer', 'printer', 'household', 'other')),
  plan_name text not null,
  amount numeric not null default 0,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'quarterly', 'half_yearly', 'yearly')),
  start_date date,
  end_date date,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_amcs_client on public.amcs(client_id);

-- ------------------------------------------------------------
-- attendance
-- ------------------------------------------------------------
create table if not exists public.attendance (
  id text primary key,
  staff_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  status text not null default 'present' check (status in ('present', 'absent', 'half_day', 'leave')),
  check_in time,
  check_out time,
  notes text,
  unique (staff_id, date)
);

-- ------------------------------------------------------------
-- salary_records
-- ------------------------------------------------------------
create table if not exists public.salary_records (
  id text primary key,
  staff_id uuid not null references public.profiles(id) on delete cascade,
  month text not null,
  present_days numeric not null default 0,
  basic numeric not null default 0,
  commission numeric not null default 0,
  ta_da numeric not null default 0,
  bonus numeric not null default 0,
  deductions numeric not null default 0,
  net numeric not null default 0,
  paid boolean not null default false,
  paid_date date,
  notes text,
  unique (staff_id, month)
);

-- ------------------------------------------------------------
-- tada
-- ------------------------------------------------------------
create table if not exists public.tada (
  id text primary key,
  staff_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  type text not null default 'other' check (type in ('travel', 'daily_allowance', 'other')),
  amount numeric not null default 0,
  description text,
  job_id text references public.jobs(id) on delete set null
);

-- ------------------------------------------------------------
-- transactions
-- ------------------------------------------------------------
create table if not exists public.transactions (
  id text primary key,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  amount numeric not null default 0,
  date date not null,
  mode text not null default 'pending' check (mode in ('cash', 'upi', 'bank', 'card', 'pending')),
  client_id text references public.clients(id) on delete set null,
  job_id text references public.jobs(id) on delete set null,
  staff_id uuid references public.profiles(id) on delete set null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_date on public.transactions(date);

-- ------------------------------------------------------------
-- ledger_entries
-- ------------------------------------------------------------
create table if not exists public.ledger_entries (
  id text primary key,
  client_id text not null references public.clients(id) on delete cascade,
  date date not null,
  type text not null check (type in ('debit', 'credit')),
  amount numeric not null default 0,
  ref_id text,
  description text not null default '',
  mode text not null default 'pending' check (mode in ('cash', 'upi', 'bank', 'card', 'pending')),
  created_at timestamptz not null default now()
);

create index if not exists idx_ledger_client on public.ledger_entries(client_id);

-- ------------------------------------------------------------
-- settings  (single row key = 'firm')
-- ------------------------------------------------------------
create table if not exists public.settings (
  key text primary key,
  value jsonb not null
);

-- ------------------------------------------------------------
-- app_meta  (job counter, misc)
-- ------------------------------------------------------------
create table if not exists public.app_meta (
  key text primary key,
  value jsonb not null
);

insert into public.settings (key, value) values ('firm', '{}'::jsonb)
on conflict (key) do nothing;
insert into public.app_meta (key, value) values ('job_counter', '0'::jsonb)
on conflict (key) do nothing;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.jobs enable row level security;
alter table public.amcs enable row level security;
alter table public.attendance enable row level security;
alter table public.salary_records enable row level security;
alter table public.tada enable row level security;
alter table public.transactions enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.settings enable row level security;
alter table public.app_meta enable row level security;

-- Authenticated users can read all profiles; update only their own row.
-- (insert/delete handled by service role through the /api/admin route)
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Single-firm app: any signed-in user can read/write business data.
do $$
declare tbl text;
begin
  foreach tbl in array array['clients','jobs','amcs','attendance','salary_records','tada','transactions','ledger_entries','settings','app_meta']
  loop
    execute format('drop policy if exists "all_all" on public.%I', tbl);
    execute format('create policy "all_all" on public.%I for all to authenticated using (true) with check (true)', tbl);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Auto-create profile on new auth user signup
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, role, designation, joined_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'staff'),
    coalesce(new.raw_user_meta_data ->> 'designation', ''),
    current_date
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
