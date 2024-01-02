import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "../../../../lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { requestId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const user = await User.findById(userId);
    const requestUser = await User.findById(requestId);

    // Find the received request by ID

    const receivedRequest = user.notifications.receivedRequests.find(
      (request) => request.user.toString() === requestId
    );
    const sentRequest = requestUser.notifications.sentRequests.find(
      (request) => request.user.toString() === userId
    );

    if (!receivedRequest) {
      return res.status(404).json({ error: "Received request not found" });
    }
    if (!sentRequest) {
      return res.status(404).json({ error: "Sent request not found" });
    }

    user.notifications.receivedRequests =
      user.notifications.receivedRequests.filter(
        (request) => request.user.toString() !== requestId
      );

    requestUser.notifications.sentRequests =
      requestUser.notifications.sentRequests.filter(
        (request) => request.user.toString() !== userId
      );

    user.friendsList.push(requestId);
    requestUser.friendsList.push(userId);

    // Save the updated user document
    await user.save();
    await requestUser.save();

    res.status(200).json({ success: "friend request accepted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {}
};

export default handler;
