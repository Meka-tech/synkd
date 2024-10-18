import { authenticateJWT } from "@/utils/middleware/authJwt";
import Message from "@/models/Message";
import { mongooseConnect } from "@/lib/mongoose";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { partnerId, text, room, uuid } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const message = new Message({
      user: userId,
      partner: partnerId,
      text: text,
      room: room,
      uuid: uuid
    });

    const NewMessage = await message.save();

    const returnMessage = await NewMessage.populate({
      path: "user partner",
      model: "user",
      select: "username"
    });

    return res
      .status(200)
      .json({ message: "Message Sent", message: returnMessage });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {}
};

export default handler;
