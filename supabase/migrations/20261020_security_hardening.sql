-- Durcissement sécurité (audit du 20/10/2026)
-- 1) Admin = liste explicite (et non « tout utilisateur connecté »)
-- 2) Plus de paiement confirmable par le client
-- 3) Prix calculés côté serveur
-- 4) Insertions directes verrouillées

-- ── 1. Admins ───────────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;  -- aucune policy : lecture/écriture via service role uniquement
insert into public.admins (user_id) values ('753935b2-c3d4-470e-9fdf-71dfd1f9df4c') on conflict do nothing;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

do $$
declare t text; pol record;
begin
  foreach t in array array['categories','marketing_posts','order_items','orders','portfolio','product_reviews','product_variants','products','site_settings']
  loop
    for pol in select policyname from pg_policies where schemaname='public' and tablename=t and policyname like 'Admin:%' loop
      execute format('drop policy %I on public.%I', pol.policyname, t);
    end loop;
    execute format('create policy "Admin: full access %s" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- ── 2. Commandes : insertion directe impossible ─────────────────
drop policy if exists "Public: create orders" on public.orders;
drop policy if exists "Public: create order items" on public.order_items;
-- les commandes ne se créent plus que par create_order() (security definer)

alter table public.orders add column if not exists stock_decremented boolean not null default false;
alter table public.orders add column if not exists admin_notified boolean not null default false;
update public.orders set admin_notified = true;

-- Avis : jamais auto-approuvés par le client
drop policy if exists "Public: create reviews" on public.product_reviews;
create policy "Public: create reviews" on public.product_reviews
  for insert with check (coalesce(is_approved, false) = false and rating between 1 and 5
                         and char_length(author_name) between 1 and 80 and char_length(coalesce(comment, '')) <= 2000);

-- ── 3. Création de commande : prix et stock calculés ici ────────
drop function if exists public.create_order(text, text, text, text, text, public.payment_method, integer, integer, integer, text);

create or replace function public.create_order(
  p_customer_name text, p_customer_phone text, p_customer_email text, p_customer_address text,
  p_city text, p_payment_method public.payment_method, p_notes text, p_items jsonb
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_order_id uuid; v_number text; v_subtotal integer := 0;
  it jsonb; v_pid uuid; v_vid uuid; v_qty integer; v_price integer; v_pname text; v_vname text; v_n integer;
begin
  if p_payment_method not in ('wave', 'cash_on_delivery') then raise exception 'Mode de paiement invalide'; end if;
  if char_length(btrim(coalesce(p_customer_name, ''))) not between 2 and 100
     or char_length(btrim(coalesce(p_customer_phone, ''))) not between 9 and 20
     or char_length(btrim(coalesce(p_customer_address, ''))) not between 5 and 300
     or char_length(coalesce(p_city, '')) > 80 or char_length(coalesce(p_customer_email, '')) > 200
     or char_length(coalesce(p_notes, '')) > 1000 then
    raise exception 'Données de commande invalides';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 50 then
    raise exception 'Panier invalide';
  end if;

  insert into orders (order_number, customer_name, customer_phone, customer_email, customer_address, city,
                      payment_method, subtotal, shipping_fee, total, notes, status, payment_status, stock_decremented)
  values ('TEMP', btrim(p_customer_name), btrim(p_customer_phone), nullif(btrim(coalesce(p_customer_email, '')), ''),
          btrim(p_customer_address), coalesce(nullif(btrim(p_city), ''), 'Dakar'), p_payment_method, 0, 0, 0,
          nullif(btrim(coalesce(p_notes, '')), ''), 'pending', 'pending', true)
  returning id, order_number into v_order_id, v_number;

  for it in select * from jsonb_array_elements(p_items) loop
    v_pid := (it ->> 'product_id')::uuid;
    v_vid := nullif(it ->> 'variant_id', '')::uuid;
    v_qty := (it ->> 'quantity')::integer;
    if v_qty is null or v_qty < 1 or v_qty > 99 then raise exception 'Quantité invalide'; end if;

    select name, price into v_pname, v_price from products where id = v_pid and status = 'active';
    if v_pname is null then raise exception 'Produit indisponible'; end if;
    v_vname := null;

    if v_vid is not null then
      update product_variants set stock = stock - v_qty
        where id = v_vid and product_id = v_pid and stock >= v_qty
        returning name, price into v_vname, v_price;
      get diagnostics v_n = row_count;
      if v_n = 0 then raise exception 'Stock insuffisant'; end if;
    else
      update products set stock = stock - v_qty where id = v_pid and stock >= v_qty;
      get diagnostics v_n = row_count;
      if v_n = 0 then raise exception 'Stock insuffisant'; end if;
    end if;

    insert into order_items (order_id, product_id, product_name, variant_id, variant_name, quantity, unit_price, total)
    values (v_order_id, v_pid, v_pname, v_vid, v_vname, v_qty, v_price, v_price * v_qty);
    v_subtotal := v_subtotal + v_price * v_qty;
  end loop;

  update orders set subtotal = v_subtotal, total = v_subtotal where id = v_order_id;
  return json_build_object('id', v_order_id, 'order_number', v_number, 'total', v_subtotal);
end;
$$;
revoke all on function public.create_order(text, text, text, text, text, public.payment_method, text, jsonb) from public;
grant execute on function public.create_order(text, text, text, text, text, public.payment_method, text, jsonb) to anon, authenticated, service_role;

-- ── 4. Fonctions sensibles : plus d'appel public ────────────────
revoke all on function public.confirm_wave_payment(text) from public, anon, authenticated;
revoke all on function public.decrement_stock_for_order(uuid) from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
grant execute on function public.confirm_wave_payment(text) to service_role;
grant execute on function public.decrement_stock_for_order(uuid) to service_role;

-- search_path fixé
alter function public.update_updated_at() set search_path = public;
alter function public.generate_order_number() set search_path = public;
