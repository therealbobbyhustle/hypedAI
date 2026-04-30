import { isSupabaseConfigured, supabase } from "./supabaseClient";

export function getClientId() {
  const key = "hyped_client_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function subscribeToAuthChanges(callback) {
  if (!isSupabaseConfigured) return () => {};

  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signUpWithEmail({ email, password }) {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithEmail({ email, password }) {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithSpotifyOAuth() {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      scopes: "user-read-private user-read-email",
      redirectTo: window.location.origin,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error("Spotify sign-in URL was not returned");
  return data;
}

export async function signOut() {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchCityMarkets() {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("city_markets")
    .select("*")
    .order("listener_count", { ascending: false });

  if (error) throw error;
  return data.map(fromCityMarketRow);
}

export async function fetchNearMeIntel(market) {
  if (!isSupabaseConfigured || !market?.slug) return null;

  const [events, radio, targets] = await Promise.all([
    supabase
      .from("local_events")
      .select("name, venue, tags")
      .eq("city_market_id", market.id)
      .limit(5),
    supabase
      .from("radio_stations")
      .select("name, tags")
      .eq("city_market_id", market.id)
      .limit(5),
    supabase
      .from("promo_targets")
      .select("name, target_type, notes, tags")
      .eq("city_market_id", market.id)
      .limit(5),
  ]);

  return {
    events: readRows(events).map((event) => event.name),
    radio: readRows(radio).map((station) => station.name),
    targets: readRows(targets).map((target) => target.name),
  };
}

export async function fetchSpotifyDashboard(userId) {
  if (!isSupabaseConfigured || !userId) return emptySpotifyDashboard();

  const [connection, artist, releases, tracks] = await Promise.all([
    supabase
      .from("spotify_connections")
      .select("spotify_user_id, display_name, email, profile_image_url, spotify_profile_url")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("spotify_artist_profiles")
      .select("spotify_artist_id, artist_name, artist_image_url, genres, spotify_artist_url, popularity")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("spotify_releases")
      .select("title, release_type, release_date, album_art_url, spotify_url")
      .eq("user_id", userId)
      .order("release_date", { ascending: false })
      .limit(4),
    supabase
      .from("spotify_tracks")
      .select("title, album_name, album_art_url, spotify_url, preview_url, popularity")
      .eq("user_id", userId)
      .order("popularity", { ascending: false })
      .limit(5),
  ]);

  return {
    connection: readMaybe(connection),
    artist: readMaybe(artist),
    releases: readRows(releases),
    tracks: readRows(tracks),
  };
}

export async function searchSpotifyArtists({ userId, query }) {
  const response = await fetch("/api/spotify/search-artist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, query }),
  });

  if (!response.ok) throw new Error("Artist search failed");
  return response.json();
}

export async function syncSpotifyArtist({ userId, artistId }) {
  const endpoints = [
    "/api/spotify/sync-artist-profile",
    "/api/spotify/sync-releases",
    "/api/spotify/sync-top-tracks",
  ];

  await Promise.all(
    endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, artistId }),
      }).then((response) => {
        if (!response.ok) throw new Error(`${endpoint} failed`);
        return response.json();
      })
    )
  );
}

export async function saveRoutePlan({ routeMode, stops, plan }) {
  if (!isSupabaseConfigured || !stops.length) return null;

  const clientId = getClientId();
  const { data: route, error } = await supabase
    .from("route_plans")
    .insert({
      client_id: clientId,
      title: `${routeMode}: ${stops[0].city} run`,
      mode: routeMode,
      total_listeners: plan.totalListeners,
      total_miles: plan.totalMiles,
      drive_hours: plan.driveHours,
      estimated_cost: plan.cost,
      opportunity_score: plan.score,
    })
    .select("id")
    .single();

  if (error) throw error;

  const stopRows = stops.map((stop, index) => ({
    route_plan_id: route.id,
    city_market_id: stop.id,
    stop_order: index + 1,
    reason: stop.reason,
    activation: stop.activation,
  }));

  const { error: stopError } = await supabase.from("route_stops").insert(stopRows);
  if (stopError) throw stopError;

  return route.id;
}

export async function saveCity(market, status = "Researching") {
  if (!isSupabaseConfigured || !market?.id) return null;

  const { data, error } = await supabase
    .from("saved_cities")
    .upsert(
      {
        client_id: getClientId(),
        city_market_id: market.id,
        status,
      },
      { onConflict: "client_id,city_market_id" }
    )
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

function readRows(result) {
  if (result.error) return [];
  return result.data || [];
}

function readMaybe(result) {
  if (result.error) return null;
  return result.data || null;
}

function emptySpotifyDashboard() {
  return {
    connection: null,
    artist: null,
    releases: [],
    tracks: [],
  };
}

function fromCityMarketRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    city: row.city,
    state: row.state,
    listeners: `${Math.round(row.listener_count / 1000)}K`,
    listenerCount: row.listener_count,
    genre: row.genre,
    x: Number(row.map_x),
    y: Number(row.map_y),
    lat: row.lat,
    lng: row.lng,
    growthRate: Number(row.growth_rate),
    opportunityScore: row.opportunity_score,
  };
}
