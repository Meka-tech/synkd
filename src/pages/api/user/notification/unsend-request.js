import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { requestId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const requestUser = await User.findById(requestId);
    const user = await User.findById(userId);

    user.notifications.sentRequests = user.notifications.sentRequests.filter(
      (request) => request.user.toString() !== requestId
    );

    requestUser.notifications.receivedRequests =
      requestUser.notifications.receivedRequests.filter(
        (request) => request.user.toString() !== userId
      );

    await user.save();
    await requestUser.save();

    res.status(200).json({ success: "friend request un-sent sucessfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {}
};

export default handler;
