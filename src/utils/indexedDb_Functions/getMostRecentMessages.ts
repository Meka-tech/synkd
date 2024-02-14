import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { UnsentMessageDb } from "@/dexieDb/UnsentMessageDb";
import { ImsgType } from "@/types/messageType";
import { IUmsgType } from "@/types/unsentMessageType";

export async function getMostRecentMessagesAndUnreadCount(
  excludeUserId: string | undefined
): Promise<{ recentMessage: ImsgType | IUmsgType; unreadCount: number }[]> {
  const mostRecentMessages: Record<string, any> = {};
  const unreadCountPerRoom: Record<string, number> = {};

  function isImsgType(message: IUmsgType | ImsgType): message is ImsgType {
    return (message as ImsgType).partner !== undefined;
  }

  try {
    // Get all messages ordered by room and createdAt in descending order

    let allMessages = [];
    const sentMessages = await MessageDb.messages
      .orderBy("room")
      .reverse()
      .sortBy("createdAt");

    const unsentMessages = await UnsentMessageDb.unsentmessages
      .orderBy("room")
      .toArray();

    allMessages = [...sentMessages, ...unsentMessages];

    // Iterate through each message and keep track of the most recent message and unread count for each room
    allMessages.forEach((message) => {
      const { room } = message;
      let readStatus = true;
      if (!isImsgType(message)) {
        mostRecentMessages[room] = message;
      } else {
        const { room, user } = message;
        readStatus = message.readStatus;

        if (
          !mostRecentMessages[room] ||
          message.createdAt > mostRecentMessages[room].createdAt
        ) {
          mostRecentMessages[room] = message;
        }

        if (!readStatus && user._id !== excludeUserId) {
          unreadCountPerRoom[room]++;
        }
      }

      if (!unreadCountPerRoom[room]) {
        unreadCountPerRoom[room] = 0;
      }
    });

    const result: {
      recentMessage: ImsgType | IUmsgType;
      unreadCount: number;
    }[] = Object.keys(mostRecentMessages).map((room) => {
      return {
        recentMessage: mostRecentMessages[room],
        unreadCount: unreadCountPerRoom[room] || 0
      };
    });

    return result;
  } catch (error) {
    console.error(
      "Error getting most recent messages and unread count:",
      error
    );
    throw error;
  }
}
