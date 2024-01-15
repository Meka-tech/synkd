import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "../../../../../lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { RequestId, matchCategory, percent } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  const requestToAdd = {
    user: userId, // Replace with the actual user ID of the request sender
    matchCategory,
    percent
  };

  try {
    //add to recipient Send Id
    await User.updateOne(
      { _id: RequestId },
      { $push: { "notifications.receivedRequests": requestToAdd } }
    );

    //add to User Recipient ID
    await User.updateOne(
      { _id: userId },
      { $push: { "notifications.sentRequests": { user: RequestId } } }
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
