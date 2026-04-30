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

    const { userId, artistId } = await readJsonBody(request);
    if (!userId || !artistId) {
      response.status(400).json({ error: "Missing userId or artistId" });
      return;
    }

    const supabase = getSupabaseAdmin();
    const accessToken = await getAccessToken(supabase, userId);
    const payload = await spotifyFetch(accessToken, `/artists/${artistId}/albums?include_groups=album,single,appears_on&limit=12`);
    const rows = (payload.items || []).map((album) => ({
      user_id: userId,
      spotify_artist_id: artistId,
      spotify_album_id: album.id,
      title: album.name,
      release_type: album.album_type,
      release_date: album.release_date,
      album_art_url: album.images?.[0]?.url || null,
      spotify_url: album.external_urls?.spotify || null,
      raw_provider_data: album,
    }));

    if (rows.length) {
      const { error } = await supabase.from("spotify_releases").upsert(rows, { onConflict: "user_id,spotify_album_id" });
      if (error) throw error;
    }

    response.status(200).json({ releases: rows });
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
