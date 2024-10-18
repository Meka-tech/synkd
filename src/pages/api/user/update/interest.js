import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { interest, data } = req.body;

  if (!userId) {
    return res.status(404).json({ message: "unauthorized", userId: userId });
  }
  if (!data || data.length === 0) {
    return res.status(401).json({ message: "empty data" });
  }

  try {
    const user = await User.findOne({ _id: userId });

    user.interests[interest] = data;

    const newUser = await user.save();

    return res.status(200).json({ user: newUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {
    // bodyParser: false
  }
};

export default handler;
