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
    const user = await User.findById(userId)
      .populate({
        path: "notifications.sentRequests.user",
        model: "user",
        select: "username email" // Specify the fields you want to select
      })
      .populate({
        path: "notifications.receivedRequests.user",
        model: "user",
        select: "username email" // Specify the fields you want to select
      })
      .exec();

    const allRequests = [
      ...user.notifications.receivedRequests,
      ...user.notifications.sentRequests
    ];
    const sortedRequests = allRequests.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    return res.status(200).json({
      message: "user notifications",
      notifications: sortedRequests
    });
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
