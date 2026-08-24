-- Checkout profissional de demonstração para a Maxfit.
-- Endereços são privados por usuário e cada pedido preserva um retrato do endereço usado.

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  recipient_name text not null check (char_length(trim(recipient_name)) between 2 and 120),
  phone text not null check (char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 10 and 11),
  postal_code text not null check (postal_code ~ '^[0-9]{8}$'),
  street text not null check (char_length(trim(street)) between 2 and 160),
  number text not null check (char_length(trim(number)) between 1 and 20),
  complement text not null default '' check (char_length(complement) <= 120),
  neighborhood text not null check (char_length(trim(neighborhood)) between 2 and 100),
  city text not null check (char_length(trim(city)) between 2 and 100),
  state text not null check (state ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders
  add column address_id uuid references public.customer_addresses(id) on delete set null,
  add column shipping_address jsonb,
  add column payment_method text not null default 'pix',
  add column payment_status text not null default 'approved',
  add column payment_reference text,
  add column paid_at timestamptz,
  add column coupon_code text,
  add column delivery_min_days integer,
  add column delivery_max_days integer,
  add column estimated_delivery_start date,
  add column estimated_delivery_end date;

alter table public.orders
  add constraint orders_payment_method_check check (payment_method in ('pix')),
  add constraint orders_payment_status_check check (payment_status in ('pending', 'approved', 'failed', 'refunded')),
  add constraint orders_delivery_days_check check (
    (delivery_min_days is null and delivery_max_days is null)
    or (delivery_min_days between 1 and 30 and delivery_max_days between delivery_min_days and 45)
  ),
  add constraint orders_delivery_dates_check check (
    estimated_delivery_start is null
    or estimated_delivery_end is null
    or estimated_delivery_end >= estimated_delivery_start
  );

create index orders_address_id_idx on public.orders (address_id);

alter table public.customer_addresses enable row level security;

create policy "addresses_select_own"
  on public.customer_addresses for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "addresses_insert_own"
  on public.customer_addresses for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "addresses_update_own"
  on public.customer_addresses for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "addresses_delete_own"
  on public.customer_addresses for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.customer_addresses from anon;
grant select, insert, update, delete on table public.customer_addresses to authenticated;

-- Cria o pedido, copia seus itens e esvazia o carrinho na mesma transação.
-- A implementação privilegiada fica fora dos schemas expostos e nunca confia em preços do cliente.
create schema if not exists private;
revoke all on schema private from public;

create or replace function private.checkout_cart_internal(
  p_address_id uuid,
  p_coupon_code text default null
)
returns table (
  order_id uuid,
  order_total numeric,
  payment_reference text,
  estimated_delivery_start date,
  estimated_delivery_end date
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_address public.customer_addresses%rowtype;
  v_order_id uuid := gen_random_uuid();
  v_subtotal numeric(10,2);
  v_discount numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  v_total numeric(10,2);
  v_coupon text;
  v_payment_reference text;
  v_min_days integer;
  v_max_days integer;
  v_estimated_start date;
  v_estimated_end date;
  v_cursor date;
  v_remaining integer;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED' using errcode = '28000';
  end if;

  select address.*
    into v_address
    from public.customer_addresses as address
   where address.id = p_address_id
     and address.user_id = v_user_id;

  if not found then
    raise exception 'ADDRESS_NOT_FOUND' using errcode = 'P0001';
  end if;

  if not exists (
    select 1 from public.cart_items where user_id = v_user_id
  ) then
    raise exception 'EMPTY_CART' using errcode = 'P0001';
  end if;

  if exists (
    select 1
      from public.cart_items as cart
      left join public.products as product on product.id = cart.product_id
     where cart.user_id = v_user_id
       and (product.id is null or product.active is not true or cart.quantity > product.stock)
  ) then
    raise exception 'PRODUCT_UNAVAILABLE' using errcode = 'P0001';
  end if;

  select round(sum(product.price * cart.quantity), 2)
    into v_subtotal
    from public.cart_items as cart
    join public.products as product on product.id = cart.product_id
   where cart.user_id = v_user_id
     and product.active = true;

  v_coupon := case when upper(trim(coalesce(p_coupon_code, ''))) = 'MAX10' then 'MAX10' else null end;
  if v_coupon = 'MAX10' then
    v_discount := round(v_subtotal * 0.10, 2);
  end if;

  v_shipping := case when v_subtotal >= 199 then 0 else 14.90 end;
  v_total := round(v_subtotal - v_discount + v_shipping, 2);
  v_min_days := 3 + (right(v_address.postal_code, 1)::integer % 3);
  v_max_days := v_min_days + 3;

  v_cursor := current_date;
  v_remaining := v_min_days;
  while v_remaining > 0 loop
    v_cursor := v_cursor + 1;
    if extract(isodow from v_cursor) between 1 and 5 then
      v_remaining := v_remaining - 1;
    end if;
  end loop;
  v_estimated_start := v_cursor;

  v_cursor := current_date;
  v_remaining := v_max_days;
  while v_remaining > 0 loop
    v_cursor := v_cursor + 1;
    if extract(isodow from v_cursor) between 1 and 5 then
      v_remaining := v_remaining - 1;
    end if;
  end loop;
  v_estimated_end := v_cursor;

  v_payment_reference := 'PIX-DEMO-' || upper(substr(replace(v_order_id::text, '-', ''), 1, 12));

  insert into public.orders (
    id,
    user_id,
    status,
    subtotal,
    discount,
    shipping,
    total,
    address_id,
    shipping_address,
    payment_method,
    payment_status,
    payment_reference,
    paid_at,
    coupon_code,
    delivery_min_days,
    delivery_max_days,
    estimated_delivery_start,
    estimated_delivery_end
  ) values (
    v_order_id,
    v_user_id,
    'em_preparacao',
    v_subtotal,
    v_discount,
    v_shipping,
    v_total,
    v_address.id,
    jsonb_build_object(
      'recipient_name', v_address.recipient_name,
      'phone', v_address.phone,
      'postal_code', v_address.postal_code,
      'street', v_address.street,
      'number', v_address.number,
      'complement', v_address.complement,
      'neighborhood', v_address.neighborhood,
      'city', v_address.city,
      'state', v_address.state
    ),
    'pix',
    'approved',
    v_payment_reference,
    now(),
    v_coupon,
    v_min_days,
    v_max_days,
    v_estimated_start,
    v_estimated_end
  );

  insert into public.order_items (
    order_id,
    user_id,
    product_id,
    product_name,
    unit_price,
    quantity
  )
  select
    v_order_id,
    v_user_id,
    product.id,
    product.name || ' · ' || product.variant_name,
    product.price,
    cart.quantity
  from public.cart_items as cart
  join public.products as product on product.id = cart.product_id
  where cart.user_id = v_user_id;

  delete from public.cart_items where user_id = v_user_id;

  return query
  select v_order_id, v_total, v_payment_reference, v_estimated_start, v_estimated_end;
end;
$function$;

revoke all on function private.checkout_cart_internal(uuid, text) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.checkout_cart_internal(uuid, text) to authenticated;

-- Wrapper público sem privilégios próprios: a API expõe apenas esta assinatura controlada.
create or replace function public.checkout_cart(
  p_address_id uuid,
  p_coupon_code text default null
)
returns table (
  order_id uuid,
  order_total numeric,
  payment_reference text,
  estimated_delivery_start date,
  estimated_delivery_end date
)
language sql
security invoker
set search_path = ''
as $function$
  select * from private.checkout_cart_internal(p_address_id, p_coupon_code);
$function$;

revoke all on function public.checkout_cart(uuid, text) from public, anon;
grant execute on function public.checkout_cart(uuid, text) to authenticated;

-- Pedidos só podem ser criados pelo checkout validado; o cliente continua podendo lê-los.
revoke insert on table public.orders from authenticated;
revoke insert on table public.order_items from authenticated;

comment on table public.customer_addresses is 'Endereço de entrega privado salvo na conta do cliente.';
comment on function public.checkout_cart(uuid, text) is 'Finaliza o carrinho autenticado em uma transação com pagamento PIX simulado.';
