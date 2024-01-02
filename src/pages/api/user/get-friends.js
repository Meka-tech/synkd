import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "../../../../lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const user = await User.findOne({ _id: userId }).populate({
      path: "friendsList",
      model: "user"
    });

    const friends = user.friendsList;

    const sortedList = friends
      .slice()
      .sort((a, b) => a.username.localeCompare(b.username));

    return res
      .status(200)
      .json({ friends: sortedList, message: "Fetched friends" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
