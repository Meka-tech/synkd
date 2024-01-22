import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "../../../../lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  if (req.method === "GET") {
    const { id } = req.query;
    try {
      const friend = await User.findById(id);

      if (!friend) {
        return res.status(404).json({ message: "Friend not found" });
      }

      res.status(200).json({ data: friend });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

// export const config = {
//   api: {
//     bodyParser: false
//   }
// };

export default handler;
