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
import { getMostRecentReceivedMessageForUser } from "@/utils/GetRecentMessage";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface IProps {
  user: IUserType;
}
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
const ChatLayout = ({ user }: IProps) => {
  const [activeChat, setActiveChat] = useState(null);
  const [userMessages, setUserMessages] = useState<ImsgType[]>([]);
  let authToken = Cookies.get("authToken") || "";

  useEffect(() => {
    socketInitializer();
  }, [user]);

  const socketInitializer = async (): Promise<void> => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("receive-message", ({ fromUserId, message }) => {
      console.log(user._id, "userId", fromUserId, "tromId");
      if (user._id === fromUserId && message === "received a message") {
        GetRecievedMessages();
      }
    });
  };

  const GetRecievedMessages = async () => {
    try {
      let recentMessage: ImsgType | any;
      recentMessage = await getMostRecentReceivedMessageForUser(user._id);
      const response = await axios.post(
        "/api/chat/get-received-messages",
        {
          createdAt: recentMessage.createdAt
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      const messages = response.data.messages;

      console.log(messages.length);
      if (messages.length > 1) {
        await MessageDb.messages.bulkAdd(messages);
      } else if (messages.length === 1) {
        await MessageDb.messages.add(messages[0]);
      }
    } catch (err) {}
  };

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
