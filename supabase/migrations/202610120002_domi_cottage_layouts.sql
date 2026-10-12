-- One private cottage layout per DOMIHOOD account.
-- Run after 202610120001_domi_accounts.sql.
create table if not exists public.domi_cottage_layouts (
  user_id uuid primary key references public.domi_accounts(id) on delete cascade,
  layout_json jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.domi_cottage_layouts enable row level security;
revoke all on table public.domi_cottage_layouts from anon, authenticated;
grant all on table public.domi_cottage_layouts to service_role;
