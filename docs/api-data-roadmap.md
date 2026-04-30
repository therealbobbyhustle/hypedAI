# HYPED API Data Roadmap

## Route Accuracy

Use Mapbox Directions first. It supports driving and driving-traffic routes, route geometry, distance, duration, and up to 25 waypoints per request. HYPED should use this for the route result card, route line, mileage, drive time, and later traffic-aware planning.

## Radio Outreach

Use Radio Browser for the first MVP data pass. It is free and can return stations by state, tag, language, country, and other metadata. It is not the same as Radio-Locator's full commercial/local broadcast directory, but it gives us a usable API-backed starting point.

For later: license or partner for terrestrial radio/contact data if we need exact program directors, local show contacts, or station format databases.

## Events

Use Ticketmaster Discovery API for reliable venue and music-event coverage. It returns events, attractions, and venues and has a normal API key flow.

Use Eventbrite for smaller local events, showcases, workshops, networking events, and community activations. Eventbrite requires an API key/OAuth token and has content storage/display rules.

## Facebook Events

Do not rely on Facebook public event search as a primary data source. Treat it as a future manual import/social-listening feature unless Meta provides approved partner access for the exact use case.

## Architecture

Client UI should call a HYPED backend endpoint, not third-party APIs directly, once this leaves prototype mode.

Recommended backend endpoints:

- `GET /api/markets/:city/radio`
- `GET /api/markets/:city/events`
- `POST /api/routes/compute`
- `GET /api/markets/:city/intel`

The frontend service file at `src/services/marketingData.js` is a prototype adapter. Move secrets and quota-sensitive calls server-side before production.
