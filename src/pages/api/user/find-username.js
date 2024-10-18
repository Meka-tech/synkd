import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { username } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    let usernameTaken = false;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      usernameTaken = true;
    }

    return res.status(200).json({ usernameTaken, message: "success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// export const config = {
//   api: {
//     bodyParser: false
//   }
// };

export default handler;
