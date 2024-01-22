import styled from "@emotion/styled";
import ChatSideBar from "./Sidebar/chatSidebar";
import ChatArea from "./chatArea";
import { IUserType } from "@/types/userType";
import { useEffect, useState } from "react";
import DefaultChatArea from "./DefaultChatArea";
import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { useLiveQuery } from "dexie-react-hooks";
import { ImsgType } from "@/types/messageType";

import { useSelector } from "react-redux";
import { RootState } from "@/Redux/app/store";

const ChatLayout = () => {
  const [userMessages, setUserMessages] = useState<ImsgType[]>([]);
  const launch = useSelector((state: RootState) => state.openChat.launch);

  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  useLiveQuery(async () => {
    const messages = await MessageDb.messages.toArray();
    setUserMessages(messages);
  }, []);

  return (
    <Body>
      {" "}
      <ChatSideBar />
      {launch ? (
        <DefaultChatArea />
      ) : (
        <ChatArea user={user} messages={userMessages} />
      )}
    </Body>
  );
};

export default ChatLayout;

const Body = styled.div`
  height: 100dvh;
  display: flex;
`;
