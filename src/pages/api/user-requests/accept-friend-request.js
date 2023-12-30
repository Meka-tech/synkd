import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "../../../../lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { RequestId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    await User.updateOne(
      { _id: userId },
      {
        $pull: { "notifications.receivedRequests": RequestId },
        $addToSet: { friendsList: RequestId }
      }
    );

    res.status(200).json({ success: "friend request sent sucessfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {}
};

export default handler;
