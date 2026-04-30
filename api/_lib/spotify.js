const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const SCOPES = ["user-read-private", "user-read-email"];

export function getSpotifyConfig() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing Spotify OAuth environment variables");
  }

  return { clientId, clientSecret, redirectUri };
}

export function buildSpotifyLoginUrl({ userId }) {
  const { clientId, redirectUri } = getSpotifyConfig();
  const state = Buffer.from(JSON.stringify({ userId, nonce: cryptoRandomId() })).toString("base64url");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SCOPES.join(" "),
    redirect_uri: redirectUri,
    state,
  });

  return `${SPOTIFY_AUTH_URL}?${params}`;
}

export function parseSpotifyState(state) {
  if (!state) return {};

  try {
    return JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
  } catch {
    return {};
  }
}

export async function exchangeSpotifyCode(code) {
  const { clientId, clientSecret, redirectUri } = getSpotifyConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Spotify token exchange failed: ${response.status}`);
  }

  return response.json();
}

export async function spotifyFetch(accessToken, path, options = {}) {
  const response = await fetch(`${SPOTIFY_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API failed: ${response.status}`);
  }

  return response.json();
}

export function normalizeSpotifyImage(images = []) {
  return images[0]?.url || null;
}

function cryptoRandomId() {
  return crypto.randomBytes(16).toString("hex");
}
import crypto from "node:crypto";

