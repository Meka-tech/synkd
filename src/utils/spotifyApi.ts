import axios from "axios";
import Cookies from "js-cookie";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID || "";
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";

let token = Cookies.get("spotifyAccessToken") || "";
let tokenExpirationTime = Cookies.get("spotifyTokenExpirationTime") || 0;

const expirationTime = tokenExpirationTime
  ? parseInt(tokenExpirationTime.toString(), 10)
  : 0;

export async function GetSpotifyToken() {
  if (Date.now() < (expirationTime as number)) {
    return token;
  }

  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");
  data.append("client_id", clientId);
  data.append("client_secret", clientSecret);

  try {
    const response = await axios.post(
      `https://accounts.spotify.com/api/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    const accessToken = response.data.access_token;
    const newTokenExpirationTime = Date.now() + response.data.expires_in * 1000;

    Cookies.set("spotifyAccessToken", accessToken);
    Cookies.set(
      "spotifyTokenExpirationTime",
      newTokenExpirationTime.toString()
    );

    return accessToken;
  } catch (error) {
    console.error(error);
  }
}

export async function searchArtistsByGenre(
  genre: string,
  limit: number = 20,
  offset: number = 0
) {
  const searchEndpoint = "https://api.spotify.com/v1/search";
  const type = "artist";
  const authToken = await GetSpotifyToken();
  if (authToken) {
    try {
      const response = await axios.get(searchEndpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        params: {
          q: `genre:"${genre}"`,
          type,
          limit,
          offset
        }
      });

      return response.data.artists.items;
    } catch (error) {
      await GetSpotifyToken();
    }
  }
}

export async function SpotifyAuth(update: boolean) {
  const BaseUrl = window.location.origin;

  const authorization_url = "https://accounts.spotify.com/authorize";
  const scope = "user-follow-read";
  const redirectUri = update
    ? `${BaseUrl}/update-interest/music`
    : `${BaseUrl}/sync/interests`;

  window.location.href = `${authorization_url}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=${encodeURIComponent(scope)}`;
}

export const getFollowedArtists = async (accessToken: string) => {
  const limit = 50;
  const ArtistsUrl = `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`;

  try {
    const response = await axios.get(ArtistsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.artists.items;
  } catch (err) {
    console.error("Error fetching listening history:", err);
  }
};
