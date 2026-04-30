import { getSupabaseAdmin } from "../_lib/supabaseAdmin.js";
import { spotifyFetch } from "../_lib/spotify.js";
import { decryptToken } from "../_lib/crypto.js";
import { readJsonBody } from "../_lib/http.js";

export default async function handler(request, response) {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { userId, query } = await readJsonBody(request);
    if (!userId || !query) {
      response.status(400).json({ error: "Missing userId or query" });
      return;
    }

    const accessToken = await getAccessToken(userId);
    const payload = await spotifyFetch(accessToken, `/search?${new URLSearchParams({ q: query, type: "artist", limit: "8" })}`);
    const artists = (payload.artists?.items || []).map((artist) => ({
      artistId: artist.id,
      artistName: artist.name,
      artistImageUrl: artist.images?.[0]?.url || null,
      genres: artist.genres || [],
      spotifyArtistUrl: artist.external_urls?.spotify || null,
      popularity: artist.popularity,
    }));

    response.status(200).json({ artists });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function getAccessToken(userId) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("spotify_connections")
    .select("access_token_encrypted")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return decryptToken(data?.access_token_encrypted);
}
