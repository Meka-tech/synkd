import { MessageDb } from "../../MessageLocalDb";

export const getMostRecentReceivedMessageForUser = async (userIdToExclude) => {
  try {
    await MessageDb.open();

    // Get all messages where user.id is not equal to a certain string
    const filteredMessages = await MessageDb.messages
      .filter((msg) => msg.user._id !== userIdToExclude)
      .toArray();

    // Sort the filtered messages by createdAt in descending order
    const sortedMessages = filteredMessages.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    // Get the most recent message
    const mostRecentMessage = sortedMessages[sortedMessages.length - 1];

    // Handle the retrieved message
    if (mostRecentMessage) {
      return mostRecentMessage;
    } else {
      console.log("No recent messages found for the specified condition.");
    }
  } catch (error) {
    // Handle the error
    console.error("Error retrieving most recent message:", error);
  }
};
