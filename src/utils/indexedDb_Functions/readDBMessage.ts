import { MessageDb } from "@/MessageLocalDb";
import { ImsgType } from "@/types/messageType";

export async function ReadDBMessage(messageId: string) {
  try {
    const existingMessage: ImsgType | undefined = await MessageDb.messages.get({
      _id: messageId
    });

    if (existingMessage && !existingMessage.readStatus) {
      existingMessage.readStatus = true;
      await MessageDb.messages.put(existingMessage);
    }
  } catch (error) {
    console.error("Error editing message:", error);
  }
}
