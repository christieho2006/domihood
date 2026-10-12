-- DOMIHOOD: account-scoped, private cottage visitor history.
create table if not exists public.domi_cottage_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references public.domi_accounts(id) on delete cascade,
  owner_id uuid not null references public.domi_accounts(id) on delete cascade,
  visited_at timestamptz not null default now(),
  constraint domi_cottage_visits_no_self check (visitor_id <> owner_id)
);

create index if not exists domi_cottage_visits_owner_time_idx
  on public.domi_cottage_visits (owner_id, visited_at desc);
create index if not exists domi_cottage_visits_visitor_owner_time_idx
  on public.domi_cottage_visits (visitor_id, owner_id, visited_at desc);

alter table public.domi_cottage_visits enable row level security;
-- Intentionally no anon/authenticated policies: reads/writes go through the
-- server API using the service-role client after verifying the signed session.
