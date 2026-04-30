create table if not exists public.spotify_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spotify_user_id text not null,
  display_name text,
  email text,
  profile_image_url text,
  spotify_profile_url text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  expires_at timestamptz,
  raw_provider_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.spotify_artist_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spotify_artist_id text not null,
  artist_name text not null,
  artist_image_url text,
  genres text[] not null default '{}',
  spotify_artist_url text,
  popularity integer,
  raw_provider_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, spotify_artist_id)
);

create table if not exists public.spotify_releases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spotify_artist_id text not null,
  spotify_album_id text not null,
  title text not null,
  release_type text,
  release_date text,
  album_art_url text,
  spotify_url text,
  raw_provider_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(user_id, spotify_album_id)
);

create table if not exists public.spotify_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  spotify_artist_id text not null,
  spotify_track_id text not null,
  title text not null,
  album_name text,
  album_art_url text,
  spotify_url text,
  preview_url text,
  popularity integer,
  raw_provider_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(user_id, spotify_track_id)
);

alter table public.spotify_connections enable row level security;
alter table public.spotify_artist_profiles enable row level security;
alter table public.spotify_releases enable row level security;
alter table public.spotify_tracks enable row level security;

drop policy if exists "Users can read their Spotify connection" on public.spotify_connections;
drop policy if exists "Users can read their Spotify artist profiles" on public.spotify_artist_profiles;
drop policy if exists "Users can read their Spotify releases" on public.spotify_releases;
drop policy if exists "Users can read their Spotify tracks" on public.spotify_tracks;

create policy "Users can read their Spotify connection" on public.spotify_connections for select using (auth.uid() = user_id);
create policy "Users can read their Spotify artist profiles" on public.spotify_artist_profiles for select using (auth.uid() = user_id);
create policy "Users can read their Spotify releases" on public.spotify_releases for select using (auth.uid() = user_id);
create policy "Users can read their Spotify tracks" on public.spotify_tracks for select using (auth.uid() = user_id);
