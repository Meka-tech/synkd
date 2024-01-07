import { MessageDb } from "@/MessageLocalDb";
import { ImsgType } from "@/types/messageType";

export async function getMostRecentMessagesAndUnreadCount(
  excludeUserId: string | undefined
): Promise<{ recentMessage: ImsgType; unreadCount: number }[]> {
  const mostRecentMessages: Record<string, ImsgType> = {};
  const unreadCountPerRoom: Record<string, number> = {};

  try {
    // Get all messages ordered by room and createdAt in descending order
    const allMessages = await MessageDb.messages
      .orderBy("room")
      .reverse()
      .sortBy("createdAt");

    // Iterate through each message and keep track of the most recent message and unread count for each room
    allMessages.forEach((message) => {
      const { room, readStatus, user } = message;

      if (
        !mostRecentMessages[room] ||
        message.createdAt > mostRecentMessages[room].createdAt
      ) {
        mostRecentMessages[room] = message;
      }

      if (!unreadCountPerRoom[room]) {
        unreadCountPerRoom[room] = 0;
      }

      if (!readStatus && user._id !== excludeUserId) {
        unreadCountPerRoom[room]++;
      }
    });

    const result: { recentMessage: ImsgType; unreadCount: number }[] =
      Object.keys(mostRecentMessages).map((room) => ({
        recentMessage: mostRecentMessages[room],
        unreadCount: unreadCountPerRoom[room] || 0
      }));

    return result;
  } catch (error) {
    console.error(
      "Error getting most recent messages and unread count:",
      error
    );
    throw error;
  }
}
