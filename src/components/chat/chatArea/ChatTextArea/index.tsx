import { IUserType } from "@/types/userType";
import { GetChatId } from "@/utils/GetChatId";
import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import ChatBubble from "../chatBubble";
import Loading from "@/components/loading";
import { ImsgType } from "@/types/messageType";
import getChatDay from "@/utils/chat__functions/getChatDay";
import { RootState } from "@/Redux/app/store";
import { useSelector } from "react-redux";

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
    scrollRef.current?.scrollIntoView();
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const RoomMessages = messages.filter((message) => {
    return message.room === room;
  });

  const [isTyping, setIsTyping] = useState(false);
  const socket = useSelector((state: RootState) => state.socket.socket);

  socket?.on("userTyping", (id: string) => {
    if (chatPartner?._id === id) {
      setIsTyping(true);
    }
    return;
  });

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (isTyping) {
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [isTyping]);

  return (
    <Chats>
      {RoomMessages?.map((msg, i) => {
        let partnerId;
        const isPartner = msg.user.username !== user?.username;
        if (isPartner) {
          partnerId = msg.user._id;
        }
        let SenderMsgNxtId;
        if (RoomMessages[i + 1]) {
          SenderMsgNxtId =
            RoomMessages[i + 1].user.username === msg.user.username;
        } else {
          SenderMsgNxtId = false;
        }
        let previousTime;
        if (RoomMessages[i - 1]) {
          previousTime = RoomMessages[i - 1].createdAt;
        }
        if (RoomMessages[0] === msg) {
          previousTime = msg.createdAt;
        }

        const DayChange = getChatDay(msg.createdAt, previousTime);
        return (
          <React.Fragment key={i}>
            {DayChange && <DayChangeDiv>{DayChange}</DayChangeDiv>}
            <ChatBubble
              text={msg.text}
              key={msg._id}
              id={msg._id}
              time={msg.createdAt}
              partner={isPartner}
              readStatus={msg.readStatus}
              partnerId={partnerId}
              userSndNxtMsg={SenderMsgNxtId}
            />
          </React.Fragment>
        );
      })}
      {unSentMessages?.map((msg, i) => {
        return (
          <ChatBubble
            text={msg.text}
            key={i}
            partner={false}
            sent={false}
            userSndNxtMsg={false}
          />
        );
      })}
      {isTyping && (
        <ChatBubble
          isTyping={isTyping}
          text={""}
          partner={true}
          sent={true}
          userSndNxtMsg={false}
        />
      )}
      <ScrollPoint ref={scrollRef} />
    </Chats>
  );
};

export default ChatTextArea;
const Chats = styled.div`
  height: 80%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0 1rem;
  padding-top: 1rem;
  @media screen and (max-width: 480px) {
    height: 92%;
    padding: 0 1rem;
    padding-top: 10rem;
  }
`;

const ScrollPoint = styled.div``;

const DayChangeDiv = styled.div`
  background-color: ${(props) => props.theme.colors.gluton};
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  padding: 0.5rem 1.2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;
