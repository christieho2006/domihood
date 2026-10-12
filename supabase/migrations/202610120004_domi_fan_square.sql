-- Public fan-square posts, likes, and comments for DOMIHOOD.
create table if not exists public.domi_square_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.domi_accounts(id) on delete cascade,
  nickname text not null,
  content text not null check (char_length(content) between 1 and 500),
  mood text not null default 'gentle' check (mood in ('gentle','happy','support','daily')),
  created_at timestamptz not null default now()
);
create index if not exists domi_square_posts_created_at_idx on public.domi_square_posts (created_at desc);

create table if not exists public.domi_square_likes (
  post_id uuid not null references public.domi_square_posts(id) on delete cascade,
  user_id uuid not null references public.domi_accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists domi_square_likes_post_id_idx on public.domi_square_likes (post_id);

create table if not exists public.domi_square_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.domi_square_posts(id) on delete cascade,
  user_id uuid not null references public.domi_accounts(id) on delete cascade,
  nickname text not null,
  content text not null check (char_length(content) between 1 and 300),
  created_at timestamptz not null default now()
);
create index if not exists domi_square_comments_post_created_idx on public.domi_square_comments (post_id, created_at asc);

alter table public.domi_square_posts enable row level security;
alter table public.domi_square_likes enable row level security;
alter table public.domi_square_comments enable row level security;
revoke all on table public.domi_square_posts, public.domi_square_likes, public.domi_square_comments from anon, authenticated;
grant all on table public.domi_square_posts, public.domi_square_likes, public.domi_square_comments to service_role;
