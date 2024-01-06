import { MessageDb } from "@/MessageLocalDb";
import { RootState } from "@/Redux/app/store";
import { ImsgType } from "@/types/messageType";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

import ChatBox from "./chatBox";
import { useSelector } from "react-redux";

interface INewChat {
  selectChat: Function;
}
const ActiveChats = ({ selectChat }: INewChat) => {
  const [activeChats, setActiveChats] = useState<ImsgType[]>();
  const userDetails: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );
  const [messages, setMessages] = useState<ImsgType[]>();

  async function getMostRecentMessages() {
    const mostRecentMessages: Record<string, ImsgType> = {};

    // Get all messages ordered by room and createdAt in descending order
    const allMessages = await MessageDb.messages
      .orderBy("room")
      .reverse()
      .sortBy("createdAt");

    // Iterate through each message and keep track of the most recent message for each room
    allMessages.forEach((message) => {
      const { room } = message;
      if (!mostRecentMessages[room]) {
        mostRecentMessages[room] = message;
      }
    });

    const result: ImsgType[] = Object.values(mostRecentMessages);

    return result;
  }

  useLiveQuery(async () => {
    const messages = await MessageDb.messages.toArray();
    setMessages(messages);

    const recentChats = await getMostRecentMessages();
    setActiveChats(recentChats);
  });

  return (
    <Main>
      {activeChats?.map((chat, i) => {
        let partner;
        let user;
        let userSent = false;
        if (chat.partner._id !== userDetails?._id) {
          partner = chat.partner;
          user = chat.user;
          userSent = true;
        } else {
          partner = chat.user;
          user = chat.partner;
        }
        return (
          <ChatBox
            user={user}
            userSent={userSent}
            selectChat={selectChat}
            partner={partner}
            recentMsg={chat.text}
            key={i}
            recentMsgTime={chat.createdAt}
          />
        );
      })}
    </Main>
  );
};

export default ActiveChats;

const Main = styled.div``;
