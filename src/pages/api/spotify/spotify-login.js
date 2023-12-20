import { authenticateJWT } from "@/utils/middleware/authJwt";
import querystring from "querystring";

async function handler(req, res, next) {
  //   let userId = authenticateJWT(req, res, next);
  //   let state = generateRandomString(16);
  let state = "absbhdhdhhshhaha";

  let scope = "user-read-private user-read-email";

  let client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID;
  let redirect_uri = "http://localhost:3000/sync/interests";

  //   if (!userId) {
  //     return res.status(401).json({ message: "unauthorized" });
  //   }

  try {
    const queryParams = querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export default handler;
