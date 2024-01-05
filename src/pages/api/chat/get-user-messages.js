import { authenticateJWT } from "@/utils/middleware/authJwt";
import Message from "@/models/Message";
import { mongooseConnect } from "../../../../lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const UserMessages = await Message.find({
      $or: [{ user: userId }, { partner: userId }]
    })
      .sort({
        createdAt: 1
      })
      .populate({
        path: "user partner",
        model: "user",
        select: "username"
      });
    return res
      .status(200)
      .json({ message: "User Messages Fetched ", messages: UserMessages });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {}
};

export default handler;
