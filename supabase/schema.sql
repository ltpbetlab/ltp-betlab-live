create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text default 'user',
  tier text default 'free',
  created_at timestamptz default now()
);

create table if not exists tips (
  id uuid primary key default gen_random_uuid(),
  sport text not null,
  league text,
  match_name text not null,
  market text not null,
  odds numeric,
  signal integer,
  unit integer,
  tier text default 'free',
  summary text,
  status text default 'draft',
  created_at timestamptz default now()
);

create table if not exists telegram_logs (
  id uuid primary key default gen_random_uuid(),
  tip_id uuid references tips(id) on delete cascade,
  target_group text,
  sent_at timestamptz default now(),
  response jsonb
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  plan_key text not null,
  status text default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);
