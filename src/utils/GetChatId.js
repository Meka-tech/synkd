export const GetChatId = (userId, partnerId) => {
  const sortedIds = [userId, partnerId].sort();

  const chatRoomId = sortedIds.join("--");

  return chatRoomId;
};
