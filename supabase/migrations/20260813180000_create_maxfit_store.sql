create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  brand text not null,
  category text not null check (category in ('Proteínas','Performance','Saúde','Acessórios','Snacks')),
  goal text not null,
  size text not null,
  price numeric(10,2) not null check (price >= 0),
  old_price numeric(10,2) not null check (old_price >= price),
  rating numeric(2,1) not null default 5.0 check (rating between 0 and 5),
  reviews integer not null default 0 check (reviews >= 0),
  image_path text not null,
  badge text,
  accent text not null default '#c8ff2e',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.cart_items (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'recebido' check (status in ('recebido','em_preparacao','enviado','entregue','cancelado')),
  subtotal numeric(10,2) not null check (subtotal >= 0),
  discount numeric(10,2) not null default 0 check (discount >= 0),
  shipping numeric(10,2) not null default 0 check (shipping >= 0),
  total numeric(10,2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id bigint references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 99)
);

create index cart_items_user_id_idx on public.cart_items (user_id);
create index cart_items_product_id_idx on public.cart_items (product_id);
create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_user_id_idx on public.order_items (user_id);
create index order_items_product_id_idx on public.order_items (product_id);
create index products_active_category_idx on public.products (category) where active = true;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "products_public_read" on public.products for select to anon, authenticated using (active = true);
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "cart_select_own" on public.cart_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "cart_insert_own" on public.cart_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "cart_update_own" on public.cart_items for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "cart_delete_own" on public.cart_items for delete to authenticated using ((select auth.uid()) = user_id);
create policy "orders_select_own" on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "orders_insert_own" on public.orders for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "order_items_select_own" on public.order_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "order_items_insert_own" on public.order_items for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = (select auth.uid())
  )
);

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;
grant select, insert on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant usage, select on all sequences in schema public to authenticated;

insert into public.products (slug, name, brand, category, goal, size, price, old_price, rating, reviews, image_path, badge, accent) values
  ('whey-prime', '100% Whey Prime', 'MAXFIT LABS', 'Proteínas', 'Ganho de massa', '900 g · Chocolate belga', 139.90, 179.90, 4.9, 438, 'images/product-whey.png', 'Mais vendido', '#c8ff2e'),
  ('creatina-monohidratada', 'Creatina Monohidratada', 'MAXFIT LABS', 'Performance', 'Força e potência', '300 g · 100% pura', 79.90, 109.90, 4.9, 612, 'images/product-creatine.png', 'Top 1 creatina', '#8cf7e7'),
  ('pre-treino-insane', 'Pré-Treino Insane', 'MAXFIT LABS', 'Performance', 'Energia e foco', '300 g · Frutas vermelhas', 94.90, 129.90, 4.8, 284, 'images/product-preworkout.png', 'Novo', '#ff5b63'),
  ('whey-isolado-zero', 'Whey Isolado Zero', 'MAXFIT LABS', 'Proteínas', 'Definição muscular', '900 g · Baunilha', 189.90, 229.90, 4.8, 197, 'images/product-whey.png', 'Zero lactose', '#b6d8ff'),
  ('multivitaminico-complete', 'Multivitamínico Complete', 'MAXFIT NUTRITION', 'Saúde', 'Saúde e imunidade', '120 cápsulas', 49.90, 64.90, 4.7, 156, 'images/product-vitamins.png', null, '#ffc94a'),
  ('omega-3-ultra', 'Ômega 3 Ultra', 'MAXFIT NUTRITION', 'Saúde', 'Bem-estar diário', '120 cápsulas · 1000 mg', 59.90, 79.90, 4.8, 209, 'images/product-vitamins.png', 'Alta concentração', '#5ed2ff'),
  ('pasta-amendoim-crunchy', 'Pasta de Amendoim Crunchy', 'MAXFIT FOODS', 'Snacks', 'Energia saudável', '600 g · Crocante', 34.90, 44.90, 4.9, 331, 'images/product-snacks.png', 'Sem açúcar', '#e9ad62'),
  ('protein-bar-trio', 'Protein Bar Trio', 'MAXFIT FOODS', 'Snacks', 'Lanche proteico', 'Caixa com 12 · 15 g proteína', 74.90, 89.90, 4.7, 124, 'images/product-snacks.png', null, '#d89cff'),
  ('coqueteleira-pro-700', 'Coqueteleira Pro 700', 'MAXFIT GEAR', 'Acessórios', 'Praticidade', '700 ml · Mixer interno', 39.90, 54.90, 4.8, 275, 'images/product-shaker.png', 'BPA free', '#c8ff2e'),
  ('kit-mini-bands-force', 'Kit Mini Bands Force', 'MAXFIT GEAR', 'Acessórios', 'Treino funcional', '5 intensidades · Bolsa inclusa', 64.90, 84.90, 4.8, 188, 'images/maxfit-accessories.png', null, '#ff8f70'),
  ('luva-training-grip', 'Luva Training Grip', 'MAXFIT GEAR', 'Acessórios', 'Proteção e aderência', 'P ao GG · Par', 69.90, 89.90, 4.6, 94, 'images/maxfit-accessories.png', null, '#a6b0be'),
  ('cinto-power-lift', 'Cinto Power Lift', 'MAXFIT GEAR', 'Acessórios', 'Estabilidade e força', 'Couro sintético · P ao GG', 119.90, 149.90, 4.9, 143, 'images/maxfit-accessories.png', 'Linha premium', '#f4cc79');
