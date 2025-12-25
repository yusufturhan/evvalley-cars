-- Add old_price and last_price_change_at to vehicles
alter table public.vehicles add column if not exists old_price numeric;
alter table public.vehicles add column if not exists last_price_change_at timestamp with time zone;

-- Optional: create index for queries
create index if not exists idx_vehicles_last_price_change on public.vehicles (last_price_change_at desc);

