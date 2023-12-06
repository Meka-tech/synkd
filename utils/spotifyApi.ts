import axios from "axios";
import Cookies from "js-cookie";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID || "";
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";

let token = Cookies.get("spotifyAccessToken") || "";
let tokenExpirationTime = Cookies.get("spotifyTokenExpirationTime") || 0;

export async function GetSpotifyToken() {
  const expirationTime = tokenExpirationTime
    ? parseInt(tokenExpirationTime.toString(), 10)
    : 0;

  if (token && Date.now() < (expirationTime as number)) {
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

    return token;
  } catch (error) {
    console.error(error);
  }
}

export async function searchArtistsByGenre(
  genre: string,
  limit: number = 20,
  offset: number = 0
) {
  if (!token) {
    await GetSpotifyToken();
  }
  const searchEndpoint = "https://api.spotify.com/v1/search";
  const type = "artist";

  try {
    const response = await axios.get(searchEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`
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
    console.log(error);
  }
}
