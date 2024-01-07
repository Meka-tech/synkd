import { IUserType } from "@/types/userType";
import { GetChatId } from "@/utils/GetChatId";
import styled from "@emotion/styled";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import ChatBubble from "../chatBubble";
import Loading from "@/components/loading";
import { ImsgType } from "@/types/messageType";


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
        let partnerId;
        const isPartner = msg.user.username !== user?.username;
        if (isPartner) {
          partnerId = msg.user._id;
        }
        if (room === msg.room) {
          return (
            <ChatBubble
              text={msg.text}
              key={msg._id}
              id={msg._id}
              time={msg.createdAt}
              partner={isPartner}
              readStatus={msg.readStatus}
              partnerId={partnerId}
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
