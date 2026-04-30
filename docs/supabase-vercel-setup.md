# HYPED Supabase + Vercel Setup

## 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Create a free project.
3. Open SQL Editor.
4. Run `supabase/schema.sql`.
5. Run `supabase/seed.sql`.
6. Go to Project Settings > API.
7. Copy:
   - Project URL
   - `anon` public API key

## 2. Local Environment

Create `.env.local` in the repo root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://localhost:5173/api/auth/spotify/callback
SPOTIFY_TOKEN_ENCRYPTION_KEY=generate_a_long_random_secret
VITE_MAPBOX_ACCESS_TOKEN=
VITE_TICKETMASTER_API_KEY=
VITE_EVENTBRITE_TOKEN=
```

Then run:

```bash
npm run dev
```

The home page should show `Supabase live` inside Near Me Now when the database is connected.

## 3. Vercel Hosting

1. Go to https://vercel.com/new
2. Import the GitHub repo.
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - later: `VITE_MAPBOX_ACCESS_TOKEN`
   - later: `VITE_TICKETMASTER_API_KEY`
   - later: `VITE_EVENTBRITE_TOKEN`
7. Deploy.

## 4. MVP Data Flow

- Home page Near Me Now reads city markets plus local events/radio/targets.
- Route page saves generated route plans and route stops.
- Top markets can be saved as user city interests.
- Email sign-up/sign-in uses Supabase Auth.
- Spotify OAuth is profile/catalog data only: user profile, artist profile, releases, and top tracks.
- Spotify is not used for listener cities or Spotify for Artists analytics.
- If Supabase is not configured, the app still works with demo data.

## 5. Spotify Setup

1. Create a Spotify app at https://developer.spotify.com/dashboard.
2. Add redirect URI:
   - local: `http://localhost:5173/api/auth/spotify/callback`
   - Vercel: `https://your-vercel-domain.vercel.app/api/auth/spotify/callback`
3. Add Vercel environment variables:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REDIRECT_URI`
   - `SPOTIFY_TOKEN_ENCRYPTION_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Run `supabase/spotify-auth-migration.sql` in Supabase SQL Editor if your database was created before Spotify support.

## 6. Next Production Step

Move third-party API calls to backend endpoints before public launch. Keep `VITE_SUPABASE_ANON_KEY` public, but never expose service-role keys or paid API secrets in client code.
