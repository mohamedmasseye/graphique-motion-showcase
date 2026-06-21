-- ═══════════════════════════════════════════════════════════════════
-- Graphique & Motion — E-commerce + Portfolio Schema
-- Exécuter dans Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

-- ── Extensions ───────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── ENUM types ───────────────────────────────────────────────────
create type order_status as enum (
  'pending',      -- commande reçue
  'confirmed',    -- paiement vérifié
  'preparing',    -- en préparation
  'shipped',      -- expédiée
  'delivered',    -- livrée
  'cancelled'     -- annulée
);

create type payment_method as enum (
  'wave',
  'orange_money',
  'cash_on_delivery'
);

create type product_status as enum ('active', 'draft', 'archived');

-- ── Categories ───────────────────────────────────────────────────
create table categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  icon        text,
  description text,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Products ─────────────────────────────────────────────────────
create table products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  description   text,
  price         integer not null,  -- en FCFA (entier, pas de décimales)
  compare_price integer,           -- prix barré (ancien prix)
  category_id   uuid references categories(id) on delete set null,
  images        text[] default '{}', -- URLs Cloudinary
  stock         integer not null default 0,
  status        product_status default 'draft',
  featured      boolean default false,
  tags          text[] default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Orders ───────────────────────────────────────────────────────
create table orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text not null unique,  -- GM-20260621-001
  customer_name   text not null,
  customer_phone  text not null,
  customer_email  text,
  customer_address text,
  city            text default 'Dakar',
  status          order_status default 'pending',
  payment_method  payment_method not null,
  payment_ref     text,                  -- référence Wave/OM
  subtotal        integer not null,      -- FCFA
  shipping_fee    integer default 0,
  total           integer not null,      -- FCFA
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Order Items ──────────────────────────────────────────────────
create table order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  product_name text not null,  -- snapshot du nom au moment de la commande
  quantity    integer not null default 1,
  unit_price  integer not null, -- FCFA au moment de la commande
  total       integer not null  -- quantité × prix
);

-- ── Portfolio ────────────────────────────────────────────────────
create table portfolio (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text not null unique,
  category    text not null,  -- web, pwa, app, logo, print, event
  image       text not null,  -- URL Cloudinary
  link        text,
  description text,
  tags        text[] default '{}',
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Site Settings (single row) ───────────────────────────────────
create table site_settings (
  id          uuid primary key default uuid_generate_v4(),
  phone       text,
  email       text,
  address     text,
  whatsapp    text,
  instagram   text,
  facebook    text,
  updated_at  timestamptz default now()
);

-- Insérer la ligne de settings par défaut
insert into site_settings (phone, email, address, whatsapp, instagram, facebook)
values (
  '+221775644478',
  'support@graphiquemotion.com',
  'Dakar, Sénégal',
  'https://wa.me/221775644478',
  'https://www.instagram.com/graphiquemotion',
  'https://www.facebook.com/share/18ZbMPjH39/'
);

-- ── Indexes ──────────────────────────────────────────────────────
create index idx_products_category on products(category_id);
create index idx_products_status on products(status);
create index idx_products_slug on products(slug);
create index idx_products_featured on products(featured) where featured = true;
create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);
create index idx_order_items_order on order_items(order_id);
create index idx_portfolio_category on portfolio(category);

-- ── Auto-update updated_at ───────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated before update on products
  for each row execute function update_updated_at();

create trigger trg_orders_updated before update on orders
  for each row execute function update_updated_at();

create trigger trg_categories_updated before update on categories
  for each row execute function update_updated_at();

create trigger trg_portfolio_updated before update on portfolio
  for each row execute function update_updated_at();

create trigger trg_settings_updated before update on site_settings
  for each row execute function update_updated_at();

-- ── Auto-generate order_number ───────────────────────────────────
create or replace function generate_order_number()
returns trigger as $$
declare
  today_count integer;
begin
  select count(*) + 1 into today_count
  from orders
  where created_at::date = now()::date;

  new.order_number = 'GM-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(today_count::text, 3, '0');
  return new;
end;
$$ language plpgsql;

create trigger trg_order_number before insert on orders
  for each row execute function generate_order_number();


-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) — couche de sécurité critique
-- ═══════════════════════════════════════════════════════════════════

-- Activer RLS sur toutes les tables
alter table categories    enable row level security;
alter table products      enable row level security;
alter table orders        enable row level security;
alter table order_items   enable row level security;
alter table portfolio     enable row level security;
alter table site_settings enable row level security;

-- ── Lecture publique (anon + authenticated) ──────────────────────
-- Produits actifs seulement, catégories, portfolio, settings
create policy "Public: read active products"
  on products for select
  using (status = 'active');

create policy "Public: read categories"
  on categories for select
  using (true);

create policy "Public: read portfolio"
  on portfolio for select
  using (true);

create policy "Public: read site settings"
  on site_settings for select
  using (true);

-- ── Création de commandes (tout le monde peut commander) ─────────
create policy "Public: create orders"
  on orders for insert
  with check (true);

create policy "Public: create order items"
  on order_items for insert
  with check (true);

-- ── Admin (authenticated users) — accès total ────────────────────
-- Seuls les utilisateurs connectés (admin) ont un accès complet
create policy "Admin: full access products"
  on products for all
  using (auth.role() = 'authenticated');

create policy "Admin: full access categories"
  on categories for all
  using (auth.role() = 'authenticated');

create policy "Admin: full access orders"
  on orders for all
  using (auth.role() = 'authenticated');

create policy "Admin: full access order items"
  on order_items for all
  using (auth.role() = 'authenticated');

create policy "Admin: full access portfolio"
  on portfolio for all
  using (auth.role() = 'authenticated');

create policy "Admin: full access site settings"
  on site_settings for all
  using (auth.role() = 'authenticated');


-- ═══════════════════════════════════════════════════════════════════
-- Realtime — activer pour les commandes (notifications admin)
-- ═══════════════════════════════════════════════════════════════════

alter publication supabase_realtime add table orders;


-- ═══════════════════════════════════════════════════════════════════
-- Données initiales — Catégories de produits
-- ═══════════════════════════════════════════════════════════════════

insert into categories (name, slug, icon, description, sort_order) values
  ('Caméras',        'cameras',      '📷', 'Caméras professionnelles et semi-pro pour vidéo et streaming',      1),
  ('Microphones',    'microphones',  '🎙️', 'Micros cravate, USB, shotgun pour un son professionnel',            2),
  ('Éclairage',      'eclairage',    '💡', 'Ring lights, panneaux LED, softbox pour un rendu parfait',          3),
  ('Trépieds',       'trepieds',     '📐', 'Trépieds, gimbals et stabilisateurs pour caméras et smartphones',  4),
  ('Accessoires',    'accessoires',  '🔌', 'Câbles, adaptateurs, batteries, cartes mémoire',                   5),
  ('Green Screens',  'green-screens','🟩', 'Fonds verts, toiles de fond et supports pour studio',              6),
  ('Streaming',      'streaming',    '📡', 'Capture cards, encodeurs, équipement pour live TikTok/YouTube',    7),
  ('Projecteurs',    'projecteurs',  '📽️', 'Vidéoprojecteurs portables et professionnels',                     8);
