import { IUserType } from "@/types/userType";
import { GetChatId } from "@/utils/GetChatId";
import styled from "@emotion/styled";
import axios from "axios";
import React, { ReactElement, useEffect, useRef, useState } from "react";

import ChatBubble from "../chatBubble";
import Loading from "@/components/loading";
import { ImsgType } from "@/types/messageType";
import getChatDay from "@/utils/chat__functions/getChatDay";
import { RootState } from "@/Redux/app/store";
import { useSelector } from "react-redux";
import { useSocket } from "@/context/SocketContext";
import { IUmsgType } from "@/types/unsentMessageType";

interface IProps {
  user: IUserType | null;
  unSentMessages: IUmsgType[];
  messages: ImsgType[];
  keyboardHeight: number;
}

const ChatTextArea = ({
  user,
  unSentMessages,
  messages,
  keyboardHeight
}: IProps) => {
  const [room, setRoom] = useState("");
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const chatPartnerId = useSelector(
    (state: RootState) => state.openChat.activeChatId
  );

  useEffect(() => {
    if (chatPartnerId) {
      const chatId = GetChatId(user?._id, chatPartnerId);
      setRoom(chatId);
    }
  }, [chatPartnerId, user?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const RoomMessages = messages.filter((message) => {
    return message.room === room;
  });

  const RoomUnsentMessages = unSentMessages.filter((message) => {
    return message.room === room;
  });

  const [isTyping, setIsTyping] = useState(false);

  const socket = useSocket();

  socket?.on("userTyping", (id: string) => {
    if (chatPartnerId === id) {
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
    <Chats offset={keyboardHeight}>
      {RoomMessages?.map((msg, i) => {
        let partnerId;
        const isPartner = msg.user._id !== user?._id;
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
              uuid={msg.uuid}
            />
          </React.Fragment>
        );
      })}
      {RoomUnsentMessages?.map((msg, i) => {
        return (
          <ChatBubble
            text={msg.text}
            key={i}
            partner={false}
            partnerId={msg.partnerId}
            sent={false}
            userSndNxtMsg={false}
            uuid={msg.uuid}
            room={msg.room}
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
          uuid={""}
        />
      )}
      <ScrollPoint ref={scrollRef} />
    </Chats>
  );
};

export default ChatTextArea;

interface IChat {
  offset: number;
}
const Chats = styled.div<IChat>`
  height: 82%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0 1rem;
  padding-top: 1rem;
  padding-bottom: 5rem;
  transition: ease-in all 0.1s;
  @media screen and (max-width: 480px) {
    height: 84%;
    padding: 0 1rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
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
  font-weight: 600;
  border-radius: 8px;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  width: 10rem;
  text-align: center;
  text-transform: capitalize;
  z-index: 200;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;
