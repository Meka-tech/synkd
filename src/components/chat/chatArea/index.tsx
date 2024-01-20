import styled from "@emotion/styled";
import ChatBubble from "./chatBubble";
import ChatInput from "../chat-components/chatInput";

import { Send } from "@emotion-icons/boxicons-solid";

import { useEffect, useState } from "react";
import { GetChatId } from "@/utils/GetChatId";
import { IUserType } from "@/types/userType";
import axios from "axios";
import Cookies from "js-cookie";
import ChatHeader from "./ChatHeader";
import ChatTextArea from "./ChatTextArea";
import { ImsgType } from "@/types/messageType";
import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/app/store";

interface IProps {
  user: IUserType | null;
  activeChat: IUserType | null;
  messages: ImsgType[];
  setActiveChat: Function;
}

const ChatArea = ({ user, activeChat, messages, setActiveChat }: IProps) => {
  const socket = useSelector((state: RootState) => state.socket.socket);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState("");
  let authToken = Cookies.get("authToken") || "";

  const [unSentMessages, setUnsentMessages] = useState<
    { text: string; id: number }[]
  >([]);

  useEffect(() => {
    if (activeChat) {
      const chatId = GetChatId(user?._id, activeChat?._id);
      setRoom(chatId);
    }
  }, [activeChat, user?._id]);

  const SendMessage = async () => {
    if (/\S/.test(newMessage)) {
      let Message = newMessage;
      setNewMessage("");

      const UMessage = { text: Message, id: Math.random() };
      setUnsentMessages((prev) => [...prev, UMessage]);

      const response = await axios.post(
        "/api/chat/post-message",
        {
          partnerId: activeChat?._id,
          text: Message,
          room: room
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      const ResponseMessage = response.data.message;

      socket?.emit("post-message", {
        userId: activeChat?._id,
        message: ResponseMessage
      });

      await MessageDb.messages.add(ResponseMessage);

      //get id if message has sent from socket.io, /(uuid would be create for each text)
      //compare uuid and delete from unsent array

      const filteredArray = unSentMessages.filter(
        (obj) => obj.id === UMessage.id
      );
      setUnsentMessages(filteredArray);
    }
  };

  return (
    <Body>
      <ChatHeader chatPartner={activeChat} setActiveChat={setActiveChat} />
      <ChatTextArea
        unSentMessages={unSentMessages}
        chatPartner={activeChat}
        user={user}
        messages={messages}
      />
      <BottomBar>
        <ChatInput
          userId={user?._id || ""}
          activeChatId={activeChat?._id || ""}
          handleKeyPress={(e) => {
            if (e.key === "Enter" && /\S/.test(newMessage)) {
              SendMessage();
            }
          }}
          value={newMessage}
          setInput={setNewMessage}
        />
        <SendIcon onClick={SendMessage} active={/\S/.test(newMessage)}>
          <Send size={20} />
        </SendIcon>
      </BottomBar>
    </Body>
  );
};

export default ChatArea;

const Body = styled.div`
  width: 70%;
  height: 100%;
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const BottomBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 2rem;
  border-top: 1px solid ${(props) => props.theme.colors.gluton};
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 480px) {
    height: 8%;
    padding: 0.2rem 1rem;
  }
`;

interface ISend {
  active: boolean;
}

const SendIcon = styled.div<ISend>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.slate};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-in;
  :hover {
    transform: ${(props) => (props.active ? "rotate(-45deg) scale(1.01)" : "")};
  }
  @media screen and (max-width: 480px) {
    width: 3.5rem;
    height: 3.5rem;
  }
`;
