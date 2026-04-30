import { buildSpotifyLoginUrl } from "../../_lib/spotify.js";

export default function handler(request, response) {
  try {
    const url = new URL(request.url, `https://${request.headers.host}`);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      response.status(400).json({ error: "Missing user_id" });
      return;
    }

    response.writeHead(302, { Location: buildSpotifyLoginUrl({ userId }) });
    response.end();
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

