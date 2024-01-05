import { IUserType } from "@/types/userType";
import { GetChatId } from "@/utils/GetChatId";
import styled from "@emotion/styled";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import ChatBubble from "../chatBubble";
import Loading from "@/components/loading";
import { ImsgType } from "@/types/messageType";

interface Imsg {
  text: string;
  user: IUserType;
  partner: IUserType;
  room: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

interface IProps {
  user: IUserType | null;
  chatPartner: IUserType | null;
  unSentMessages: { text: string; id: number }[];
  messages: ImsgType[];
}

const ChatTextArea = ({
  chatPartner,
  user,
  unSentMessages,
  messages
}: IProps) => {
  const [room, setRoom] = useState("");
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (chatPartner) {
      const chatId = GetChatId(user?._id, chatPartner?._id);
      setRoom(chatId);
    }
  }, [chatPartner, user?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Chats>
      {messages?.map((msg) => {
        const isPartner = msg.user.username !== user?.username;
        if (room === msg.room) {
          return (
            <ChatBubble
              text={msg.text}
              key={msg._id}
              time={msg.createdAt}
              partner={isPartner}
            />
          );
        }
      })}
      {unSentMessages?.map((msg, i) => {
        return (
          <ChatBubble text={msg.text} key={i} partner={false} sent={false} />
        );
      })}
      <ScrollPoint ref={scrollRef} />
    </Chats>
  );
};

export default ChatTextArea;
const Chats = styled.div`
  height: 80%;
  overflow-y: scroll;
  padding: 0 2rem;
  padding-top: 1rem;
`;

const ScrollPoint = styled.div``;
