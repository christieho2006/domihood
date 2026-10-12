-- Private cloud-synced memory journal for each DOMIHOOD account.
-- Run this migration in Supabase SQL Editor before deploying this feature.
create table if not exists public.domi_memory_cafe (
  user_id uuid primary key references public.domi_accounts(id) on delete cascade,
  memories_json jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.domi_memory_cafe enable row level security;
revoke all on table public.domi_memory_cafe from anon, authenticated;
grant all on table public.domi_memory_cafe to service_role;
