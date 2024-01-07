import styled from "@emotion/styled";
import ChatSideBar from "./Sidebar/chatSidebar";
import ChatArea from "./chatArea";
import { IUserType } from "@/types/userType";
import { useEffect, useState } from "react";
import DefaultChatArea from "./DefaultChatArea";
import { MessageDb } from "@/MessageLocalDb";
import { useLiveQuery } from "dexie-react-hooks";
import { ImsgType } from "@/types/messageType";
import Cookies from "js-cookie";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/app/store";

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [userMessages, setUserMessages] = useState<ImsgType[]>([]);

  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  useLiveQuery(async () => {
    const messages = await MessageDb.messages.toArray();
    setUserMessages(messages);
  });

  return (
    <Body>
      {" "}
      <ChatSideBar user={user} setActiveChat={setActiveChat} />
      {activeChat ? (
        <ChatArea user={user} activeChat={activeChat} messages={userMessages} />
      ) : (
        <DefaultChatArea />
      )}
    </Body>
  );
};

export default ChatLayout;

const Body = styled.div`
  height: 100dvh;
  display: flex;
`;
