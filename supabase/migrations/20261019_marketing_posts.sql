-- Plan de publication (onglet Marketing de l'admin). Accès réservé aux utilisateurs authentifiés.
create table if not exists public.marketing_posts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  network text not null,
  title text not null,
  format_label text not null default '',
  scheduled_at timestamptz not null,
  kind text not null default 'todo' check (kind in ('todo','scheduled','draft','manual')),
  status text not null default 'planned' check (status in ('planned','done','skipped')),
  asset text not null default '',
  is_price_post boolean not null default false,
  text_content text not null default '',
  first_comment text not null default '',
  gate text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.marketing_posts enable row level security;
drop policy if exists "Admin: full access marketing posts" on public.marketing_posts;
create policy "Admin: full access marketing posts" on public.marketing_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create index if not exists marketing_posts_scheduled_idx on public.marketing_posts (scheduled_at);
