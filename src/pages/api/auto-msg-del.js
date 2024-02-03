import { authenticateJWT } from "@/utils/middleware/authJwt";
import Message from "@/models/Message";
import { mongooseConnect } from "../../../../lib/mongoose";
import cron from "node-cron";

async function handler(req, res, next) {
  await mongooseConnect();

  cron.schedule("0 0 * * *", async () => {
    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Delete messages where updatedAt is older than 24 hours
      const result = await Message.deleteMany({
        updatedAt: { $lt: twentyFourHoursAgo },
        readStatus: true
      });

      console.log(`${result.deletedCount} messages deleted.`);
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  });
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
