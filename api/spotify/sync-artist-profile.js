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
    const artist = await spotifyFetch(accessToken, `/artists/${artistId}`);

    const row = {
      user_id: userId,
      spotify_artist_id: artist.id,
      artist_name: artist.name,
      artist_image_url: artist.images?.[0]?.url || null,
      genres: artist.genres || [],
      spotify_artist_url: artist.external_urls?.spotify || null,
      popularity: artist.popularity,
      raw_provider_data: artist,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("spotify_artist_profiles")
      .upsert(row, { onConflict: "user_id,spotify_artist_id" })
      .select("*")
      .single();

    if (error) throw error;
    response.status(200).json({ artist: data });
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
