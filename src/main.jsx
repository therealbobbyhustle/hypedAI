import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChevronRight,
  CircleDollarSign,
  Clock,
  Crosshair,
  Headphones,
  Home,
  House,
  Lock,
  LogOut,
  MapPin,
  Music2,
  Navigation,
  Phone,
  Plus,
  Route,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import "./styles.css";
import {
  fetchCityMarkets,
  fetchNearMeIntel,
  fetchSpotifyDashboard,
  getCurrentSession,
  saveCity,
  saveRoutePlan,
  searchSpotifyArtists,
  signInWithEmail,
  signInWithSpotifyOAuth,
  signOut,
  signUpWithEmail,
  subscribeToAuthChanges,
  syncSpotifyArtist,
} from "./services/hypedRepository";
import { isSupabaseConfigured } from "./services/supabaseClient";

const fallbackMarkets = [
  { city: "Los Angeles", state: "CA", listeners: "43K", genre: "Hip-Hop", x: 15, y: 59, lat: 34.0522, lng: -118.2437 },
  { city: "New York", state: "NY", listeners: "39K", genre: "Hip-Hop/R&B", x: 84, y: 38, lat: 40.7128, lng: -74.006 },
  { city: "Chicago", state: "IL", listeners: "28K", genre: "Hip-Hop", x: 59, y: 42, lat: 41.8781, lng: -87.6298 },
  { city: "Houston", state: "TX", listeners: "22K", genre: "Hip-Hop", x: 43, y: 76, lat: 29.7604, lng: -95.3698 },
  { city: "Atlanta", state: "GA", listeners: "20K", genre: "Hip-Hop", x: 70, y: 66, lat: 33.749, lng: -84.388 },
  { city: "Phoenix", state: "AZ", listeners: "16K", genre: "Latin Hip-Hop", x: 24, y: 65, lat: 33.4484, lng: -112.074 },
  { city: "Philadelphia", state: "PA", listeners: "14K", genre: "Hip-Hop", x: 80, y: 42, lat: 39.9526, lng: -75.1652 },
  { city: "San Diego", state: "CA", listeners: "13K", genre: "R&B", x: 16, y: 64, lat: 32.7157, lng: -117.1611 },
  { city: "Dallas", state: "TX", listeners: "12K", genre: "Hip-Hop", x: 42, y: 69, lat: 32.7767, lng: -96.797 },
  { city: "Denver", state: "CO", listeners: "10K", genre: "Rap", x: 39, y: 51, lat: 39.7392, lng: -104.9903 },
  { city: "Nashville", state: "TN", listeners: "9K", genre: "Country/Hip-Hop", x: 63, y: 60, lat: 36.1627, lng: -86.7816 },
  { city: "Austin", state: "TX", listeners: "8K", genre: "Indie Hip-Hop", x: 43, y: 72, lat: 30.2672, lng: -97.7431 },
  { city: "Miami", state: "FL", listeners: "8K", genre: "Latin Hip-Hop", x: 82, y: 86, lat: 25.7617, lng: -80.1918 },
  { city: "Seattle", state: "WA", listeners: "6K", genre: "Alternative Hip-Hop", x: 18, y: 22, lat: 47.6062, lng: -122.3321 },
  { city: "Boston", state: "MA", listeners: "6K", genre: "Hip-Hop", x: 87, y: 34, lat: 42.3601, lng: -71.0589 },
];

const dataSources = [
  {
    name: "Mapbox Directions",
    status: "Best fit",
    detail: "Accurate drive time, miles, traffic profile, and route geometry.",
  },
  {
    name: "Radio Browser",
    status: "Free",
    detail: "Internet radio station metadata by state, tag, language, and country.",
  },
  {
    name: "Ticketmaster Discovery",
    status: "Ready",
    detail: "Local concerts, venues, attractions, and event discovery by city.",
  },
  {
    name: "Eventbrite",
    status: "Key needed",
    detail: "Useful for indie showcases, parties, networking, workshops, and community events.",
  },
  {
    name: "Facebook Events",
    status: "Limited",
    detail: "Public event search is not dependable via Graph API; use links/manual imports later.",
  },
];

const contacts = [
  {
    name: "Classic Kutz",
    address: "123 Edgewood Ave, Atlanta, GA",
    tags: ["Hip-Hop", "Trap"],
    note: "Owned by local rapper, great for promo",
  },
  {
    name: "The Fade Factory",
    address: "456 Peachtree St, Atlanta, GA",
    tags: ["R&B", "Soul"],
    note: "Strong walk-in traffic and local artist network",
  },
  {
    name: "Hype Cutz",
    address: "789 Crenshaw Blvd, Los Angeles, CA",
    tags: ["Hip-Hop", "West Coast"],
    note: "Popular with emerging artists",
  },
  {
    name: "Sharp Kuts",
    address: "321 W Loop N, Houston, TX",
    tags: ["Hip-Hop", "Trap"],
    note: "Good fit for flyers, posters, and barber chair conversations",
  },
  {
    name: "The Shop",
    address: "555 Michigan Ave, Chicago, IL",
    tags: ["Hip-Hop", "Drill"],
    note: "Known for Chicago drill scene",
  },
];

const localIntel = {
  Atlanta: {
    events: ["Indie showcase tonight", "AUC campus open mic", "Edgewood nightlife mixer"],
    radio: ["WRAS Album 88", "WCLK", "AUX Atlanta"],
    targets: ["Classic Kutz", "Smith's Olde Bar", "Aisle 5"],
  },
  "Los Angeles": {
    events: ["Creator mixer tonight", "Leimert Park open mic", "Westside pop-up market"],
    radio: ["KCRW", "UCLA Radio", "Dash Radio"],
    targets: ["Hype Cutz", "The Echo", "Resident"],
  },
  "New York": {
    events: ["Lower East Side showcase", "Brooklyn networking night", "College radio session"],
    radio: ["WNYU", "WFUV", "Hot 97 community desk"],
    targets: ["Baby's All Right", "Elsewhere", "Mercury Lounge"],
  },
  Chicago: {
    events: ["South Loop DJ night", "Campus media mixer", "Indie rap showcase"],
    radio: ["WLUW", "CHIRP Radio", "WHPK"],
    targets: ["The Shop", "Subterranean", "Schubas"],
  },
  Houston: {
    events: ["Third Ward open mic", "Nightlife promoter meetup", "College poster run"],
    radio: ["KPFT", "KTSU", "Local hip-hop show"],
    targets: ["Sharp Kuts", "White Oak Music Hall", "The Secret Group"],
  },
};

const routeReasons = {
  "Los Angeles": "Largest audience cluster and strong creator/barbershop promo fit.",
  "New York": "High-value press market with enough demand to justify a focused stop.",
  Chicago: "Strong midwest signal and useful bridge between east and south routes.",
  Houston: "High listener base with strong street promo and nightlife upside.",
  Atlanta: "Core southeast market with high local influence and efficient routing.",
  Phoenix: "Fast-growth western market that works well after Southern California.",
  Philadelphia: "Good northeast add-on with campus media and venue opportunities.",
  "San Diego": "Efficient Southern California extension with R&B audience fit.",
  Dallas: "Strong Texas bridge market between Houston and Austin.",
  Denver: "Useful mountain region test city with manageable stop cost.",
  Nashville: "High-intent music city with networking and venue discovery value.",
  Austin: "Efficient Texas add-on for indie and college-market promotion.",
  Miami: "Strong content city with Latin and nightlife crossover.",
  Seattle: "Smaller but distinct alternative hip-hop audience cluster.",
  Boston: "Good college-market city when bundling with New York and Philly.",
};

const activations = [
  "Barbershop flyer drop + short-form content",
  "College radio outreach + campus posters",
  "Venue pitch list + local DJ introductions",
  "Street team test + creator meetup",
  "Pop-up performance + nightlife networking",
];

function listenerValue(market) {
  return Number(market.listeners.replace("K", "")) * 1000;
}

function maxStopsFor(mode) {
  return mode.startsWith("3") ? 3 : mode.startsWith("7") ? 7 : 5;
}

function recommendedRoute(mode, marketList) {
  return marketList.slice(0, maxStopsFor(mode));
}

function buildRoutePlan(stops, mode) {
  const count = stops.length;
  const totalListeners = stops.reduce((sum, stop) => sum + listenerValue(stop), 0);
  const totalMiles = count > 1 ? Math.round(210 + count * 185 + stops.reduce((sum, stop) => sum + stop.x + stop.y, 0) * 1.3) : 0;
  const cost = count ? Math.round(450 + count * 520 + totalMiles * 0.72) : 0;
  const driveHours = count > 1 ? Math.round(totalMiles / 58) : 0;
  const score = count ? Math.min(96, Math.round(68 + count * 3.8 + totalListeners / 12000)) : 0;

  return {
    count,
    maxStops: maxStopsFor(mode),
    totalListeners,
    totalMiles,
    cost,
    driveHours,
    score,
  };
}

function formatListeners(value) {
  return `${Math.round(value / 1000)}K`;
}

function App() {
  const [screen, setScreen] = useState("home");
  const [routeMode, setRouteMode] = useState("5-Stop Tour");
  const [stops, setStops] = useState([]);
  const [markets, setMarkets] = useState(fallbackMarkets);
  const [nearMarket, setNearMarket] = useState(fallbackMarkets.find((market) => market.city === "Atlanta") || fallbackMarkets[0]);
  const [nearIntel, setNearIntel] = useState(null);
  const [locationStatus, setLocationStatus] = useState("fallback");
  const [dataStatus, setDataStatus] = useState(isSupabaseConfigured ? "connecting" : "demo");
  const [saveStatus, setSaveStatus] = useState("");
  const [session, setSession] = useState(null);
  const [authStatus, setAuthStatus] = useState("");
  const [spotifyDashboard, setSpotifyDashboard] = useState({ connection: null, artist: null, releases: [], tracks: [] });

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const nextSession = await getCurrentSession();
        if (!cancelled) setSession(nextSession);
      } catch (error) {
        console.warn("Could not load auth session", error);
      }
    }

    loadSession();
    const unsubscribe = subscribeToAuthChanges((nextSession) => setSession(nextSession));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const userId = session?.user?.id;

    async function loadSpotify() {
      try {
        const dashboard = await fetchSpotifyDashboard(userId);
        if (!cancelled) setSpotifyDashboard(dashboard);
      } catch (error) {
        console.warn("Could not load Spotify dashboard", error);
        if (!cancelled) setSpotifyDashboard({ connection: null, artist: null, releases: [], tracks: [] });
      }
    }

    loadSpotify();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadMarkets() {
      try {
        const rows = await fetchCityMarkets();
        if (!cancelled && rows?.length) {
          setMarkets(rows);
          setNearMarket(rows.find((market) => market.city === "Atlanta") || rows[0]);
          setDataStatus("live");
        }
      } catch (error) {
        console.warn("Using demo markets after Supabase load failed", error);
        if (!cancelled) setDataStatus("demo");
      }
    }

    loadMarkets();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadIntel() {
      try {
        const intel = await fetchNearMeIntel(nearMarket);
        if (!cancelled) setNearIntel(intel);
      } catch (error) {
        console.warn("Using demo near-me intel", error);
        if (!cancelled) setNearIntel(null);
      }
    }

    loadIntel();
    return () => {
      cancelled = true;
    };
  }, [nearMarket]);

  const addStop = () => {
    const next = markets[stops.length % markets.length];
    addMarket(next);
  };

  const addMarket = (market) => {
    setStops((current) => {
      const withoutDuplicate = current.filter((stop) => stop.city !== market.city);
      return [...withoutDuplicate, market].slice(0, maxStopsFor(routeMode));
    });
    saveCity(market).catch((error) => console.warn("Could not save city yet", error));
  };

  const handleEmailAuth = async ({ mode, email, password }) => {
    setAuthStatus(mode === "signup" ? "Creating account..." : "Signing in...");
    try {
      const result = mode === "signup"
        ? await signUpWithEmail({ email, password })
        : await signInWithEmail({ email, password });

      setSession(result.session || null);
      setAuthStatus(result.session ? "Signed in" : "Check your email to confirm");
    } catch (error) {
      setAuthStatus(error.message);
    }
  };

  const handleSpotifyAuth = async () => {
    setAuthStatus("Opening Spotify...");
    try {
      await signInWithSpotifyOAuth();
    } catch (error) {
      setAuthStatus(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setSession(null);
    setSpotifyDashboard({ connection: null, artist: null, releases: [], tracks: [] });
  };

  const generateRoute = () => {
    setStops(recommendedRoute(routeMode, markets));
  };

  const saveCurrentRoute = async () => {
    if (!stops.length) return;
    setSaveStatus("Saving...");
    try {
      const plan = buildRoutePlan(stops, routeMode);
      const routeId = await saveRoutePlan({ routeMode, stops, plan });
      setSaveStatus(routeId ? "Saved to Supabase" : "Add Supabase keys to save");
    } catch (error) {
      console.warn("Route save failed", error);
      setSaveStatus("Save failed");
    }
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearestMarket(position.coords.latitude, position.coords.longitude, markets);
        setNearMarket(nearest);
        setLocationStatus("live");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  };

  return (
    <div className="app">
      {screen === "home" && <HomeScreen setScreen={setScreen} addMarket={addMarket} nearMarket={nearMarket} nearIntel={nearIntel} locationStatus={locationStatus} locateUser={locateUser} dataStatus={dataStatus} markets={markets} session={session} spotifyDashboard={spotifyDashboard} onEmailAuth={handleEmailAuth} onSpotifyAuth={handleSpotifyAuth} authStatus={authStatus} />}
      {screen === "route" && <RouteScreen routeMode={routeMode} setRouteMode={setRouteMode} stops={stops} addStop={addStop} generateRoute={generateRoute} saveCurrentRoute={saveCurrentRoute} saveStatus={saveStatus} />}
      {screen === "audience" && <AudienceScreen addMarket={addMarket} markets={markets} />}
      {screen === "contacts" && <ContactsScreen />}
      {screen === "profile" && <ProfileScreen session={session} spotifyDashboard={spotifyDashboard} onEmailAuth={handleEmailAuth} onSpotifyAuth={handleSpotifyAuth} authStatus={authStatus} onSignOut={handleSignOut} onSpotifyRefresh={async () => {
        const dashboard = await fetchSpotifyDashboard(session?.user?.id);
        setSpotifyDashboard(dashboard);
      }} />}
      <FloatingAdd onClick={screen === "home" ? () => setScreen("route") : addStop} />
      <BottomNav screen={screen} setScreen={setScreen} />
    </div>
  );
}

function findNearestMarket(lat, lng, marketList) {
  return marketList.reduce((nearest, market) => {
    const distance = distanceMiles(lat, lng, market.lat, market.lng);
    const nearestDistance = distanceMiles(lat, lng, nearest.lat, nearest.lng);
    return distance < nearestDistance ? market : nearest;
  }, marketList[0]);
}

function distanceMiles(lat1, lon1, lat2, lon2) {
  const radius = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function Header() {
  return (
    <header className="header glass">
      <div className="header-inner">
        <div className="brand-row">
          <h1><span>HYPED</span></h1>
          <b>AI Skills Studio</b>
        </div>
        <button className="mic-button" aria-label="Artist profile">🎤</button>
      </div>
    </header>
  );
}

function HomeScreen({ setScreen, addMarket, nearMarket, nearIntel, locationStatus, locateUser, dataStatus, markets, session, spotifyDashboard, onEmailAuth, onSpotifyAuth, authStatus }) {
  return (
    <div className="screen with-header">
      <Header />
      <main className="page">
        <StatScroller
          stats={[
            ["125K", "Listeners", "🎧"],
            ["8", "Cities", "🏙️"],
            ["3", "Tours", "🎫"],
            ["23%", "Growth", "📈"],
          ]}
        />

        <NearMeNow
          market={nearMarket}
          status={locationStatus}
          dataStatus={dataStatus}
          liveIntel={nearIntel}
          onLocate={locateUser}
          onAdd={() => {
            addMarket(nearMarket);
            setScreen("route");
          }}
          onEvents={() => setScreen("contacts")}
        />

        <SpotifyHomePanel
          session={session}
          spotifyDashboard={spotifyDashboard}
          onEmailAuth={onEmailAuth}
          onSpotifyAuth={onSpotifyAuth}
          authStatus={authStatus}
          onProfile={() => setScreen("profile")}
        />

        <section className="stack">
          <SectionLabel>Quick Actions</SectionLabel>
          <QuickAction icon={<Plus />} title="Start New Route" text="Build your tour itinerary" color="amber" onClick={() => setScreen("route")} />
          <QuickAction icon={<Users />} title="Audience Map" text="View your listener heatmap" color="emerald" onClick={() => setScreen("audience")} />
          <QuickAction icon={<Headphones />} title="Venue Contacts" text="Browse marketing spots" color="purple" onClick={() => setScreen("contacts")} />
        </section>

        <section className="market-section">
          <SectionLabel>Top Markets</SectionLabel>
          <div className="stack small">
            {markets.slice(0, 5).map((market) => (
              <button
                className="top-market glass"
                key={market.city}
                onClick={() => {
                  addMarket(market);
                  setScreen("route");
                }}
              >
                <span className="flag">🇺🇸</span>
                <div>
                  <strong>{market.city}</strong>
                  <small>{market.state}</small>
                </div>
                <em>{market.listeners}<small> listeners</small></em>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function SpotifyHomePanel({ session, spotifyDashboard, onEmailAuth, onSpotifyAuth, authStatus, onProfile }) {
  if (!session) {
    return <AuthPanel compact onSubmit={onEmailAuth} onSpotifyAuth={onSpotifyAuth} status={authStatus} />;
  }

  return (
    <section className="spotify-home glass">
      <div className="spotify-home-head">
        <SpotifyIcon />
        <div>
          <strong>{spotifyDashboard.connection ? "Spotify Profile Connected" : "Connect Spotify Profile"}</strong>
          <small>Profile and catalog only. Audience market data stays separate.</small>
        </div>
      </div>
      {spotifyDashboard.artist?.artist_image_url && (
        <div className="spotify-artist-mini">
          <img src={spotifyDashboard.artist.artist_image_url} alt={spotifyDashboard.artist.artist_name} />
          <div>
            <strong>{spotifyDashboard.artist.artist_name}</strong>
            <small>{spotifyDashboard.artist.genres?.slice(0, 2).join(", ") || "Spotify artist profile"}</small>
          </div>
        </div>
      )}
      <button onClick={onProfile}>{spotifyDashboard.connection ? "Manage Spotify" : "Continue with Spotify"}</button>
    </section>
  );
}

function NearMeNow({ market, status, dataStatus, liveIntel, onLocate, onAdd, onEvents }) {
  const fallbackIntel = localIntel[market.city] || {
    events: ["Local music event", "Open mic night", "Creator meetup"],
    radio: ["College radio", "Community station", "Local music show"],
    targets: ["Barbershop promo stop", "Small venue", "Campus media outlet"],
  };
  const intel = liveIntel && (liveIntel.events.length || liveIntel.radio.length || liveIntel.targets.length)
    ? {
        events: liveIntel.events.length ? liveIntel.events : fallbackIntel.events,
        radio: liveIntel.radio.length ? liveIntel.radio : fallbackIntel.radio,
        targets: liveIntel.targets.length ? liveIntel.targets : fallbackIntel.targets,
      }
    : fallbackIntel;

  const statusText = {
    fallback: "Showing Atlanta fallback",
    loading: "Finding your city...",
    live: "Using your location",
    denied: "Location off - showing fallback",
    unavailable: "Location unavailable",
  }[status];

  return (
    <section className="near-me glass">
      <div className="near-head">
        <div>
          <SectionLabel>Near Me Now</SectionLabel>
          <h2>{market.city}, {market.state}</h2>
          <p>{statusText} · {dataStatus === "live" ? "Supabase live" : dataStatus === "connecting" ? "Connecting data" : "Demo data"}</p>
        </div>
        <button onClick={onLocate} aria-label="Use my location">
          <Crosshair size={18} />
        </button>
      </div>

      <div className="near-metrics">
        <span><strong>{market.listeners}</strong><small>listeners</small></span>
        <span><strong>{market.genre}</strong><small>best-fit genre</small></span>
      </div>

      <div className="near-intel-grid">
        <IntelMini title="Tonight" items={intel.events} />
        <IntelMini title="Radio" items={intel.radio} />
        <IntelMini title="Targets" items={intel.targets} />
      </div>

      <div className="near-actions">
        <button onClick={onAdd}><Plus size={17} /> Add to Route</button>
        <button onClick={onEvents}><ChevronRight size={17} /> View Targets</button>
      </div>
    </section>
  );
}

function IntelMini({ title, items }) {
  return (
    <article>
      <strong>{title}</strong>
      {items.slice(0, 2).map((item) => <small key={item}>{item}</small>)}
    </article>
  );
}

function AudienceScreen({ addMarket, markets }) {
  return (
    <div className="screen">
      <main className="page no-header">
        <StatScroller
          stats={[
            ["253K", "Total", "🎧"],
            ["Los Angeles", "Top City", "🏆"],
            ["+23%", "Growth", "📈"],
          ]}
        />

        <AudienceMap markets={markets} />

        <FilterPills items={["All Genres", "Hip-Hop", "R&B", "Trap", "Latin", "Drill"]} />

        <section className="glass platform-card">
          <SectionLabel>Streaming Platforms</SectionLabel>
          <div className="platform-grid">
            <div className="platform spotify">
              <SpotifyIcon />
              <div><strong>Spotify</strong><small>78K listeners</small></div>
            </div>
            <div className="platform apple">
              <AppleIcon />
              <div><strong>Apple Music</strong><small>35K listeners</small></div>
            </div>
          </div>
        </section>

        <section className="stack">
          <h2 className="subhead">Top Markets ({markets.length})</h2>
          {markets.map((market) => (
            <MarketRow key={market.city} market={market} onAdd={() => addMarket(market)} />
          ))}
        </section>
      </main>
    </div>
  );
}

function RouteScreen({ routeMode, setRouteMode, stops, addStop, generateRoute, saveCurrentRoute, saveStatus }) {
  const plan = buildRoutePlan(stops, routeMode);
  return (
    <div className="screen">
      <main className="page no-header">
        <FilterPills items={["3-Stop Sprint", "5-Stop Tour", "7-Stop Full Run"]} active={routeMode} onSelect={setRouteMode} />

        <section className="route-hero glass">
          <div>
            <SectionLabel>Smart Route</SectionLabel>
            <h2>{stops.length ? "Recommended promo run" : "Build a useful route in one tap"}</h2>
            <p>{stops.length ? "Ranked by audience size, travel efficiency, and promo upside." : "Start with the strongest listener markets, then tune the route."}</p>
          </div>
          <button onClick={generateRoute}>
            <Sparkles size={18} />
            Generate
          </button>
        </section>

        <section className="route-block">
          <div className="mini-title">
            <House size={14} />
            <span>Home Base</span>
          </div>
          <button className="dashed-button">
            <House size={16} />
            Set Home Base (optional — starting point)
          </button>
        </section>

        <RouteMap stops={stops} />

        <RouteSummary plan={plan} onSave={saveCurrentRoute} saveStatus={saveStatus} />

        <section className="stack">
          <div className="mini-title">
            <Star size={14} />
            <span>Your Stops ({stops.length}/{plan.maxStops})</span>
          </div>

          {stops.length === 0 ? (
            <div className="empty-state glass">
              <div>🗺️</div>
              <p>Add cities to build your route</p>
            </div>
          ) : (
            stops.map((stop, index) => <RouteStop stop={stop} index={index + 1} key={`${stop.city}-${index}`} />)
          )}
        </section>

        <button className="outline-add" onClick={addStop}>
          <Plus size={20} />
          Add Show City
        </button>
      </main>
    </div>
  );
}

function RouteSummary({ plan, onSave, saveStatus }) {
  if (!plan.count) {
    return (
      <section className="route-summary-empty glass">
        <Sparkles size={18} />
        <p>Generate a route to see total reach, driving estimate, cost, and opportunity score.</p>
      </section>
    );
  }

  return (
    <section className="route-summary-grid">
      <SummaryMetric icon={<Headphones size={18} />} label="Reach" value={formatListeners(plan.totalListeners)} />
      <SummaryMetric icon={<Navigation size={18} />} label="Miles" value={plan.totalMiles.toLocaleString()} />
      <SummaryMetric icon={<Clock size={18} />} label="Drive" value={`${plan.driveHours}h`} />
      <SummaryMetric icon={<CircleDollarSign size={18} />} label="Est. Cost" value={`$${plan.cost.toLocaleString()}`} />
      <article className="opportunity-card glass">
        <span>Opportunity Score</span>
        <strong>{plan.score}</strong>
        <p>{plan.score >= 88 ? "Strong enough to send to your team." : "Add more high-demand cities to strengthen this run."}</p>
        <button onClick={onSave}>Save Plan</button>
        {saveStatus && <small>{saveStatus}</small>}
      </article>
    </section>
  );
}

function SummaryMetric({ icon, label, value }) {
  return (
    <article className="summary-metric glass">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ContactsScreen() {
  return (
    <div className="screen">
      <main className="page no-header">
        <section className="data-feed-panel glass">
          <SectionLabel>Live Data Feeds</SectionLabel>
          <h2>Marketing intelligence layer</h2>
          <p>These sources will power route accuracy, radio outreach, local events, and city-by-city promo targets.</p>
          <div className="data-source-list">
            {dataSources.map((source) => (
              <article key={source.name}>
                <div>
                  <strong>{source.name}</strong>
                  <small>{source.detail}</small>
                </div>
                <span>{source.status}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="stack">
          <SectionLabel>{contacts.length} venues found</SectionLabel>
          {contacts.map((contact) => (
            <article className="contact-card glass" key={contact.name}>
              <h3>{contact.name}</h3>
              <p>{contact.address}</p>
              <div className="tag-row">
                {contact.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <p>{contact.note}</p>
              <button>Contact</button>
            </article>
          ))}
        </section>

        <section className="glass tips">
          <h3>Pro Tips</h3>
          <p>• Call ahead before visiting - always confirm contact info</p>
          <p>• Bring physical promo materials to barbershops</p>
          <p>• Email labels with a press kit link, not attachments</p>
        </section>
      </main>
    </div>
  );
}

function ProfileScreen({ session, spotifyDashboard, onEmailAuth, onSpotifyAuth, authStatus, onSignOut, onSpotifyRefresh }) {
  return (
    <div className="screen">
      <main className="page no-header">
        {!session ? (
          <AuthPanel onSubmit={onEmailAuth} onSpotifyAuth={onSpotifyAuth} status={authStatus} />
        ) : (
          <>
            <section className="profile-hero glass">
              <div className="profile-avatar">🎤</div>
              <h2>{session.user.email}</h2>
              <p>HYPED account connected with email sign-in</p>
              <button className="ghost-action" onClick={onSignOut}><LogOut size={16} /> Sign Out</button>
            </section>

            <SpotifyProfilePanel
              session={session}
              dashboard={spotifyDashboard}
              onRefresh={onSpotifyRefresh}
            />

            <section className="stack">
              <QuickAction icon={<Route />} title="Saved Tours" text="Route plans save to your HYPED account" color="amber" />
              <QuickAction icon={<MapPin />} title="Audience Market Data" text="Screenshot/manual/Viberate data powers city demand" color="purple" />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function AuthPanel({ onSubmit, onSpotifyAuth, status, compact = false }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className={`auth-panel glass ${compact ? "compact" : ""}`}>
      <div className="auth-head">
        <Lock size={18} />
        <div>
          <h2>{mode === "signup" ? "Create your HYPED account" : "Sign in to HYPED"}</h2>
          <p>Email auth saves routes, cities, and Spotify profile personalization.</p>
        </div>
      </div>
      <button className="spotify-oauth-button" onClick={onSpotifyAuth}>
        <SpotifyIcon />
        Continue with Spotify
      </button>
      <div className="auth-divider"><span>Email</span></div>
      <div className="auth-mode">
        <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Sign Up</button>
        <button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign In</button>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ mode, email, password });
        }}
      >
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" minLength="6" required />
        <button type="submit">{mode === "signup" ? "Create Account" : "Sign In"}</button>
      </form>
      {status && <small>{status}</small>}
    </section>
  );
}

function SpotifyProfilePanel({ session, dashboard, onRefresh }) {
  const [query, setQuery] = useState("");
  const [artistResults, setArtistResults] = useState([]);
  const [status, setStatus] = useState("");
  const userId = session?.user?.id;
  const spotifyLoginUrl = userId ? `/api/auth/spotify/login?user_id=${encodeURIComponent(userId)}` : "#";

  async function handleSearch(event) {
    event.preventDefault();
    setStatus("Searching Spotify...");
    try {
      const payload = await searchSpotifyArtists({ userId, query });
      setArtistResults(payload.artists || []);
      setStatus(payload.artists?.length ? "Select your artist profile" : "No artists found");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleArtistSelect(artist) {
    setStatus("Syncing Spotify catalog...");
    try {
      await syncSpotifyArtist({ userId, artistId: artist.artistId });
      await onRefresh();
      setStatus("Spotify artist profile synced");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="spotify-panel glass">
      <div className="spotify-panel-head">
        <SpotifyIcon />
        <div>
          <h2>{dashboard.connection ? "Spotify Profile Connected" : "Connect Spotify"}</h2>
          <p>Profile, images, releases, and tracks only. Not Spotify for Artists analytics.</p>
        </div>
      </div>

      {dashboard.connection ? (
        <a className="spotify-badge" href={dashboard.connection.spotify_profile_url || "#"} target="_blank" rel="noreferrer">
          Spotify Profile Connected
        </a>
      ) : (
        <a className="spotify-connect" href={spotifyLoginUrl}>Continue with Spotify</a>
      )}

      {dashboard.artist ? <SpotifyArtistCard artist={dashboard.artist} /> : (
        <form className="artist-search" onSubmit={handleSearch}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your artist name" />
          <button type="submit">Search</button>
        </form>
      )}

      {artistResults.length > 0 && (
        <div className="artist-results">
          {artistResults.map((artist) => (
            <button key={artist.artistId} onClick={() => handleArtistSelect(artist)}>
              {artist.artistImageUrl && <img src={artist.artistImageUrl} alt={artist.artistName} />}
              <span>
                <strong>{artist.artistName}</strong>
                <small>{artist.genres?.slice(0, 2).join(", ") || "Spotify artist"}</small>
              </span>
            </button>
          ))}
        </div>
      )}

      {dashboard.releases.length > 0 && <LatestReleaseCard release={dashboard.releases[0]} />}
      {dashboard.tracks.length > 0 && <TopTracks tracks={dashboard.tracks} />}
      {status && <small className="spotify-status">{status}</small>}
      <p className="spotify-attribution">Artist images, album artwork, releases, and tracks provided by Spotify.</p>
    </section>
  );
}

function SpotifyArtistCard({ artist }) {
  return (
    <article className="spotify-artist-card">
      {artist.artist_image_url && <img src={artist.artist_image_url} alt={artist.artist_name} />}
      <div>
        <h3>{artist.artist_name}</h3>
        <p>{artist.genres?.slice(0, 3).join(", ") || "Spotify artist profile"}</p>
        {artist.spotify_artist_url && <a href={artist.spotify_artist_url} target="_blank" rel="noreferrer">Open on Spotify</a>}
      </div>
    </article>
  );
}

function LatestReleaseCard({ release }) {
  return (
    <article className="latest-release">
      <SectionLabel>Latest Release</SectionLabel>
      <div>
        {release.album_art_url && <img src={release.album_art_url} alt={release.title} />}
        <span>
          <strong>{release.title}</strong>
          <small>{release.release_type} · {release.release_date}</small>
          {release.spotify_url && <a href={release.spotify_url} target="_blank" rel="noreferrer">Listen on Spotify</a>}
        </span>
      </div>
    </article>
  );
}

function TopTracks({ tracks }) {
  return (
    <section className="top-tracks">
      <SectionLabel>Top Tracks</SectionLabel>
      {tracks.map((track) => (
        <a key={track.spotify_track_id || track.title} href={track.spotify_url || "#"} target="_blank" rel="noreferrer">
          {track.album_art_url && <img src={track.album_art_url} alt={track.album_name || track.title} />}
          <span>
            <strong>{track.title}</strong>
            <small>{track.album_name || "Spotify track"}</small>
          </span>
          <em>{track.popularity || "--"}</em>
        </a>
      ))}
    </section>
  );
}

function StatScroller({ stats }) {
  return (
    <div className="stat-scroll">
      {stats.map(([value, label, emoji]) => (
        <div className="stat-pill glass" key={`${value}-${label}`}>
          <span>{value}</span>
          <small>{label}</small>
          <b>{emoji}</b>
        </div>
      ))}
    </div>
  );
}

function QuickAction({ icon, title, text, color, onClick }) {
  return (
    <button className="quick-action glass" onClick={onClick}>
      <span className={`action-icon ${color}`}>{icon}</span>
      <span className="action-copy">
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <ChevronRight size={20} />
    </button>
  );
}

function SectionLabel({ children }) {
  return <h2 className="section-label">{children}</h2>;
}

function FilterPills({ items, active = items[0], onSelect = () => {} }) {
  return (
    <div className="filter-pills">
      {items.map((item) => (
        <button className={item === active ? "active" : ""} key={item} onClick={() => onSelect(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function AudienceMap({ markets }) {
  return (
    <div className="map-card">
      <USMap />
      {markets.slice(0, 10).map((market) => (
        <span className="map-dot" style={{ left: `${market.x}%`, top: `${market.y}%` }} key={market.city} />
      ))}
    </div>
  );
}

function RouteMap({ stops }) {
  return (
    <div className="map-card route-map">
      <USMap />
      {stops.map((stop, index) => (
        <span className="route-dot" style={{ left: `${stop.x}%`, top: `${stop.y}%` }} key={`${stop.city}-${index}`}>
          {index + 1}
        </span>
      ))}
    </div>
  );
}

function USMap() {
  return (
    <svg className="prototype-us-map" viewBox="0 0 1000 620" aria-label="US map">
      <path d="M151 284 L116 258 L105 221 L129 190 L164 176 L188 145 L235 147 L270 117 L322 126 L351 152 L405 140 L455 159 L512 151 L565 174 L625 164 L682 191 L725 184 L778 214 L813 245 L862 264 L892 307 L876 354 L825 378 L788 423 L747 438 L700 464 L664 501 L600 493 L548 510 L493 489 L442 512 L391 490 L348 508 L300 478 L255 466 L224 426 L184 408 L172 361 Z" />
      <path d="M715 475 L762 501 L800 538 L771 566 L724 547 L690 512 Z" />
      <path d="M119 425 L80 461 L63 508 L91 547 L141 522 L163 470 Z" />
    </svg>
  );
}

function MarketRow({ market, onAdd }) {
  return (
    <article className="market-row glass">
      <div className="market-flag">🇺🇸</div>
      <div className="market-copy">
        <div><strong>{market.city}</strong><small>{market.state}</small></div>
        <p><Music2 size={12} /> {market.genre}</p>
      </div>
      <div className="market-count"><strong>{market.listeners}</strong><small>listeners</small></div>
      <button onClick={onAdd} aria-label={`Add ${market.city}`}>
        <Plus size={18} />
      </button>
    </article>
  );
}

function RouteStop({ stop, index }) {
  return (
    <article className="route-stop-proto glass">
      <span>{index}</span>
      <div>
        <strong>{stop.city}</strong>
        <small>{stop.state} · {stop.listeners} listeners · {stop.genre}</small>
        <p>{routeReasons[stop.city] || "Selected for audience demand and route fit."}</p>
        <em><TrendingUp size={13} /> {activations[(index - 1) % activations.length]}</em>
      </div>
    </article>
  );
}

function FloatingAdd({ onClick }) {
  return (
    <button className="floating-add" onClick={onClick} aria-label="Add">
      <Plus size={28} />
    </button>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    ["home", Home],
    ["route", Route],
    ["audience", Users],
    ["contacts", Phone],
    ["profile", User],
  ];
  return (
    <nav className="bottom-nav glass">
      <div>
        {items.map(([id, Icon]) => (
          <button className={screen === id ? "active" : ""} onClick={() => setScreen(id)} key={id} aria-label={id}>
            <Icon size={24} strokeWidth={screen === id ? 2.5 : 1.5} />
          </button>
        ))}
      </div>
    </nav>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6s.12-1.02.6-1.14c4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.2 2.5c.1 1.1-.3 2.2-1 3-.7.9-1.9 1.5-3 1.4-.1-1.1.4-2.2 1-2.9.8-.9 2-1.5 3-1.5zm3.8 15.8c-.7 1.5-1 2.1-1.9 3.5-1.2 1.8-2.9 4-5 4-1.9 0-2.4-1.2-4.9-1.2s-3.1 1.2-4.9 1.2c-2.1 0-3.7-2-4.9-3.8-3.4-5.1-3.8-11.1-1.7-14.3 1.5-2.3 3.8-3.6 6-3.6s3.6 1.2 5.4 1.2c1.8 0 2.9-1.2 5.5-1.2 2 0 4.1 1.1 5.6 3-4.9 2.7-4.1 9.7.8 11.2z" />
    </svg>
  );
}

createRoot(document.getElementById("root")).render(<App />);
