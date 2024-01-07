import { authenticateJWT } from "@/utils/middleware/authJwt";
import Message from "@/models/Message";
import { mongooseConnect } from "../../../../lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { messageId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const message = await Message.findOne({ _id: messageId }).populate({
      path: "user partner",
      model: "user",
      select: "username"
    });

    message.readStatus = true;

    const readMessage = await message.save();

    return res
      .status(200)
      .json({ message: "Message Sent", message: readMessage });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {}
};

export default handler;
