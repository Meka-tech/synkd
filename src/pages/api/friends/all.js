import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const userFriends = await User.findOne({ _id: userId }).populate(
        "friendsList"
      );

      const populatedFriendsList = userFriends.friendsList;
      return res.status(200).json({ friends: populatedFriendsList });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
