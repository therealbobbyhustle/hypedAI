insert into public.city_markets (slug, city, state, lat, lng, map_x, map_y, listener_count, genre, growth_rate, opportunity_score) values
('los-angeles-ca', 'Los Angeles', 'CA', 34.0522, -118.2437, 15, 59, 43000, 'Hip-Hop', 23, 94),
('new-york-ny', 'New York', 'NY', 40.7128, -74.0060, 84, 38, 39000, 'Hip-Hop/R&B', 18, 91),
('chicago-il', 'Chicago', 'IL', 41.8781, -87.6298, 59, 42, 28000, 'Hip-Hop', 16, 86),
('houston-tx', 'Houston', 'TX', 29.7604, -95.3698, 43, 76, 22000, 'Hip-Hop', 21, 88),
('atlanta-ga', 'Atlanta', 'GA', 33.7490, -84.3880, 70, 66, 20000, 'Hip-Hop', 24, 90),
('phoenix-az', 'Phoenix', 'AZ', 33.4484, -112.0740, 24, 65, 16000, 'Latin Hip-Hop', 19, 78),
('philadelphia-pa', 'Philadelphia', 'PA', 39.9526, -75.1652, 80, 42, 14000, 'Hip-Hop', 14, 76),
('san-diego-ca', 'San Diego', 'CA', 32.7157, -117.1611, 16, 64, 13000, 'R&B', 15, 74),
('dallas-tx', 'Dallas', 'TX', 32.7767, -96.7970, 42, 69, 12000, 'Hip-Hop', 13, 73),
('denver-co', 'Denver', 'CO', 39.7392, -104.9903, 39, 51, 10000, 'Rap', 12, 70),
('nashville-tn', 'Nashville', 'TN', 36.1627, -86.7816, 63, 60, 9000, 'Country/Hip-Hop', 17, 77),
('austin-tx', 'Austin', 'TX', 30.2672, -97.7431, 43, 72, 8000, 'Indie Hip-Hop', 11, 69),
('miami-fl', 'Miami', 'FL', 25.7617, -80.1918, 82, 86, 8000, 'Latin Hip-Hop', 20, 75),
('seattle-wa', 'Seattle', 'WA', 47.6062, -122.3321, 18, 22, 6000, 'Alternative Hip-Hop', 9, 65),
('boston-ma', 'Boston', 'MA', 42.3601, -71.0589, 87, 34, 6000, 'Hip-Hop', 8, 64)
on conflict (slug) do update set
  listener_count = excluded.listener_count,
  genre = excluded.genre,
  growth_rate = excluded.growth_rate,
  opportunity_score = excluded.opportunity_score,
  updated_at = now();

insert into public.radio_stations (city_market_id, name, type, tags)
select id, station_name, 'radio', station_tags
from public.city_markets
join (values
  ('atlanta-ga', 'WRAS Album 88', array['college', 'indie', 'atlanta']),
  ('atlanta-ga', 'WCLK', array['community', 'jazz', 'atlanta']),
  ('los-angeles-ca', 'KCRW', array['college', 'music', 'los angeles']),
  ('los-angeles-ca', 'UCLA Radio', array['college', 'los angeles']),
  ('new-york-ny', 'WNYU', array['college', 'new york']),
  ('chicago-il', 'CHIRP Radio', array['community', 'chicago']),
  ('houston-tx', 'KTSU', array['community', 'houston'])
) as seed(slug, station_name, station_tags) using (slug)
on conflict do nothing;

insert into public.local_events (city_market_id, name, source, venue, tags)
select id, event_name, 'seed', venue, event_tags
from public.city_markets
join (values
  ('atlanta-ga', 'Indie showcase tonight', 'Edgewood', array['showcase', 'nightlife']),
  ('atlanta-ga', 'AUC campus open mic', 'Atlanta University Center', array['college', 'open mic']),
  ('los-angeles-ca', 'Creator mixer tonight', 'Leimert Park', array['creator', 'networking']),
  ('new-york-ny', 'Lower East Side showcase', 'LES', array['showcase', 'venue']),
  ('chicago-il', 'South Loop DJ night', 'South Loop', array['dj', 'nightlife']),
  ('houston-tx', 'Third Ward open mic', 'Third Ward', array['open mic', 'community'])
) as seed(slug, event_name, venue, event_tags) using (slug)
on conflict do nothing;

insert into public.promo_targets (city_market_id, name, target_type, address, notes, tags)
select id, target_name, target_type, address, notes, target_tags
from public.city_markets
join (values
  ('atlanta-ga', 'Classic Kutz', 'barbershop', '123 Edgewood Ave, Atlanta, GA', 'Owned by local rapper, great for promo', array['hip-hop', 'flyers']),
  ('atlanta-ga', 'Smith''s Olde Bar', 'venue', '1578 Piedmont Ave NE, Atlanta, GA', 'Small venue outreach target', array['venue', 'live music']),
  ('los-angeles-ca', 'Hype Cutz', 'barbershop', '789 Crenshaw Blvd, Los Angeles, CA', 'Popular with emerging artists', array['hip-hop', 'west coast']),
  ('houston-tx', 'Sharp Kuts', 'barbershop', '321 W Loop N, Houston, TX', 'Good fit for flyer drops', array['hip-hop', 'street promo']),
  ('chicago-il', 'The Shop', 'barbershop', '555 Michigan Ave, Chicago, IL', 'Known for Chicago drill scene', array['drill', 'hip-hop'])
) as seed(slug, target_name, target_type, address, notes, target_tags) using (slug)
on conflict do nothing;
