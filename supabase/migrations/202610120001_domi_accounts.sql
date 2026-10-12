-- DOMIHOOD nickname/password accounts.
-- Run this migration in the Supabase SQL Editor before enabling registration.
create extension if not exists pgcrypto;

create table if not exists public.domi_accounts (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  nickname_normalized text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.domi_accounts enable row level security;

-- Deliberately create no anon/authenticated policies. The table is accessed only
-- by the server-side API using SUPABASE_SERVICE_ROLE_KEY. Never expose that key
-- to a browser or commit it to the repository.
revoke all on table public.domi_accounts from anon, authenticated;
grant all on table public.domi_accounts to service_role;
