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

    const { userId, artistId, market = "US" } = await readJsonBody(request);
    if (!userId || !artistId) {
      response.status(400).json({ error: "Missing userId or artistId" });
      return;
    }

    const supabase = getSupabaseAdmin();
    const accessToken = await getAccessToken(supabase, userId);
    const payload = await spotifyFetch(accessToken, `/artists/${artistId}/top-tracks?${new URLSearchParams({ market })}`);
    const rows = (payload.tracks || []).map((track) => ({
      user_id: userId,
      spotify_artist_id: artistId,
      spotify_track_id: track.id,
      title: track.name,
      album_name: track.album?.name || null,
      album_art_url: track.album?.images?.[0]?.url || null,
      spotify_url: track.external_urls?.spotify || null,
      preview_url: track.preview_url,
      popularity: track.popularity,
      raw_provider_data: track,
    }));

    if (rows.length) {
      const { error } = await supabase.from("spotify_tracks").upsert(rows, { onConflict: "user_id,spotify_track_id" });
      if (error) throw error;
    }

    response.status(200).json({ tracks: rows });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

async function getAccessToken(supabase, userId) {
  const { data, error } = await supabase
    .from("spotify_connections")
    .select("access_token_encrypted")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return decryptToken(data?.access_token_encrypted);
}
