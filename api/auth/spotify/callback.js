import { encryptToken } from "../../_lib/crypto.js";
import { getSupabaseAdmin } from "../../_lib/supabaseAdmin.js";
import { exchangeSpotifyCode, normalizeSpotifyImage, parseSpotifyState, spotifyFetch } from "../../_lib/spotify.js";

export default async function handler(request, response) {
  try {
    const url = new URL(request.url, `https://${request.headers.host}`);
    const code = url.searchParams.get("code");
    const { userId } = parseSpotifyState(url.searchParams.get("state"));

    if (!code || !userId) {
      response.status(400).json({ error: "Missing Spotify callback code or user state" });
      return;
    }

    const token = await exchangeSpotifyCode(code);
    const me = await spotifyFetch(token.access_token, "/me");
    const supabase = getSupabaseAdmin();
    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();

    const { error } = await supabase.from("spotify_connections").upsert(
      {
        user_id: userId,
        spotify_user_id: me.id,
        display_name: me.display_name,
        email: me.email,
        profile_image_url: normalizeSpotifyImage(me.images),
        spotify_profile_url: me.external_urls?.spotify || null,
        access_token_encrypted: encryptToken(token.access_token),
        refresh_token_encrypted: encryptToken(token.refresh_token),
        expires_at: expiresAt,
        raw_provider_data: me,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) throw error;

    response.writeHead(302, { Location: "/?spotify_connected=1" });
    response.end();
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

