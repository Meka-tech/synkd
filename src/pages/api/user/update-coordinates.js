import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "../../../../lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { longitude, latitude } = req.body;

  const coordinates = [longitude, latitude];

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { location: coordinates } },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {}
};

export default handler;
