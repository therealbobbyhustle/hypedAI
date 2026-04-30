create extension if not exists "pgcrypto";

create table if not exists public.city_markets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  city text not null,
  state text not null,
  lat double precision not null,
  lng double precision not null,
  map_x numeric not null,
  map_y numeric not null,
  listener_count integer not null default 0,
  genre text not null,
  growth_rate numeric not null default 0,
  opportunity_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.radio_stations (
  id uuid primary key default gen_random_uuid(),
  city_market_id uuid references public.city_markets(id) on delete cascade,
  name text not null,
  type text not null default 'radio',
  url text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.local_events (
  id uuid primary key default gen_random_uuid(),
  city_market_id uuid references public.city_markets(id) on delete cascade,
  name text not null,
  source text not null default 'manual',
  starts_at timestamptz,
  venue text,
  url text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.promo_targets (
  id uuid primary key default gen_random_uuid(),
  city_market_id uuid references public.city_markets(id) on delete cascade,
  name text not null,
  target_type text not null,
  address text,
  notes text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.route_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  title text not null default 'Untitled route',
  mode text not null,
  total_listeners integer not null default 0,
  total_miles numeric not null default 0,
  drive_hours numeric not null default 0,
  estimated_cost integer not null default 0,
  opportunity_score integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.route_stops (
  id uuid primary key default gen_random_uuid(),
  route_plan_id uuid not null references public.route_plans(id) on delete cascade,
  city_market_id uuid not null references public.city_markets(id),
  stop_order integer not null,
  reason text,
  activation text,
  created_at timestamptz not null default now(),
  unique(route_plan_id, stop_order)
);

create table if not exists public.saved_cities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null,
  city_market_id uuid not null references public.city_markets(id) on delete cascade,
  status text not null default 'Researching',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(client_id, city_market_id)
);

alter table public.city_markets enable row level security;
alter table public.radio_stations enable row level security;
alter table public.local_events enable row level security;
alter table public.promo_targets enable row level security;
alter table public.route_plans enable row level security;
alter table public.route_stops enable row level security;
alter table public.saved_cities enable row level security;

create policy "Public can read city markets" on public.city_markets for select using (true);
create policy "Public can read radio stations" on public.radio_stations for select using (true);
create policy "Public can read local events" on public.local_events for select using (true);
create policy "Public can read promo targets" on public.promo_targets for select using (true);

create policy "Anon can create route plans" on public.route_plans for insert with check (true);
create policy "Anon can read route plans" on public.route_plans for select using (true);
create policy "Anon can create route stops" on public.route_stops for insert with check (true);
create policy "Anon can read route stops" on public.route_stops for select using (true);

create policy "Anon can create saved cities" on public.saved_cities for insert with check (true);
create policy "Anon can read saved cities" on public.saved_cities for select using (true);
create policy "Anon can update saved cities" on public.saved_cities for update using (true);

