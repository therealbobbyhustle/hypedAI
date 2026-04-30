import { isSupabaseConfigured, supabase } from "./supabaseClient";

export function getClientId() {
  const key = "hyped_client_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
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
