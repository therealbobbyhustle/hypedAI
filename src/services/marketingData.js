const MAPBOX_DIRECTIONS_URL = "https://api.mapbox.com/directions/v5/mapbox";
const RADIO_BROWSER_URL = "https://de1.api.radio-browser.info/json";
const TICKETMASTER_URL = "https://app.ticketmaster.com/discovery/v2";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";

export function hasLiveDataConfig() {
  return {
    mapbox: Boolean(import.meta.env.VITE_MAPBOX_ACCESS_TOKEN),
    ticketmaster: Boolean(import.meta.env.VITE_TICKETMASTER_API_KEY),
    eventbrite: Boolean(import.meta.env.VITE_EVENTBRITE_TOKEN),
    radioBrowser: true,
  };
}

export async function getDrivingRoute(markets, options = {}) {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!token || markets.length < 2) return null;

  const profile = options.traffic ? "driving-traffic" : "driving";
  const coordinates = markets.map((market) => `${market.lng},${market.lat}`).join(";");
  const params = new URLSearchParams({
    access_token: token,
    geometries: "geojson",
    overview: "full",
    annotations: "distance,duration",
  });

  const response = await fetch(`${MAPBOX_DIRECTIONS_URL}/${profile}/${coordinates}?${params}`);
  if (!response.ok) throw new Error(`Mapbox route failed: ${response.status}`);
  const payload = await response.json();
  const route = payload.routes?.[0];

  if (!route) return null;
  return {
    miles: metersToMiles(route.distance),
    driveHours: secondsToHours(route.duration),
    geometry: route.geometry,
    summary: route.legs?.map((leg) => leg.summary).filter(Boolean),
    source: "mapbox",
  };
}

export async function getRadioStationsByState(state) {
  const response = await fetch(`${RADIO_BROWSER_URL}/stations/bystate/${encodeURIComponent(state)}?hidebroken=true&order=votes&reverse=true&limit=12`);
  if (!response.ok) throw new Error(`Radio Browser failed: ${response.status}`);
  const stations = await response.json();

  return stations.map((station) => ({
    id: station.stationuuid,
    name: station.name,
    homepage: station.homepage,
    streamUrl: station.url_resolved || station.url,
    tags: station.tags,
    state: station.state,
    country: station.country,
    votes: station.votes,
    source: "radio-browser",
  }));
}

export async function getTicketmasterEvents({ city, state, keyword = "music", size = 10 }) {
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    apikey: apiKey,
    city,
    stateCode: state,
    keyword,
    classificationName: "music",
    sort: "date,asc",
    size: String(size),
  });

  const response = await fetch(`${TICKETMASTER_URL}/events.json?${params}`);
  if (!response.ok) throw new Error(`Ticketmaster events failed: ${response.status}`);
  const payload = await response.json();

  return (payload._embedded?.events || []).map((event) => ({
    id: event.id,
    name: event.name,
    url: event.url,
    date: event.dates?.start?.localDate,
    time: event.dates?.start?.localTime,
    venue: event._embedded?.venues?.[0]?.name,
    source: "ticketmaster",
  }));
}

export async function getEventbriteEvents({ city, keyword = "music", size = 10 }) {
  const token = import.meta.env.VITE_EVENTBRITE_TOKEN;
  if (!token) return [];

  const params = new URLSearchParams({
    q: keyword,
    "location.address": city,
    expand: "venue",
    sort_by: "date",
    page_size: String(size),
  });

  const response = await fetch(`${EVENTBRITE_URL}/events/search/?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Eventbrite events failed: ${response.status}`);
  const payload = await response.json();

  return (payload.events || []).map((event) => ({
    id: event.id,
    name: event.name?.text,
    url: event.url,
    date: event.start?.local,
    venue: event.venue?.name,
    source: "eventbrite",
  }));
}

export async function getCityMarketingIntel(market) {
  const [radioStations, ticketmasterEvents, eventbriteEvents] = await Promise.allSettled([
    getRadioStationsByState(market.state),
    getTicketmasterEvents({ city: market.city, state: market.state }),
    getEventbriteEvents({ city: market.city }),
  ]);

  return {
    market,
    radioStations: settledValue(radioStations, []),
    events: [...settledValue(ticketmasterEvents, []), ...settledValue(eventbriteEvents, [])],
  };
}

function settledValue(result, fallback) {
  return result.status === "fulfilled" ? result.value : fallback;
}

function metersToMiles(meters) {
  return Math.round((meters / 1609.344) * 10) / 10;
}

function secondsToHours(seconds) {
  return Math.round((seconds / 3600) * 10) / 10;
}
