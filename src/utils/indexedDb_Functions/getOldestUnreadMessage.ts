import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { ImsgType } from "@/types/messageType";

export const getOldestUnreadMessage = async (
  userIdToExclude: string | undefined
) => {
  try {
    await MessageDb.open();

    // Get all messages where user.id is not equal to a certain string amd read status is false
    const filteredMessages = await MessageDb.messages
      .filter((msg: ImsgType) => msg.user._id !== userIdToExclude)
      .toArray();

    // Sort the filtered messages by createdAt in descending order
    const sortedMessages = filteredMessages.sort((a, b) => {
      const timeA = a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0;
      const timeB = b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0;
      return timeB - timeA;
    });

    // Get the most recent message
    const mostRecentMessage = sortedMessages[sortedMessages.length - 1];

    // Handle the retrieved message
    if (mostRecentMessage) {
      return mostRecentMessage;
    }
    return null;
  } catch (error) {
    console.error("Error getting the oldest unread message:", error);
    return undefined;
  }
};
