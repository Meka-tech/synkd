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
import { useSocket } from "@/context/SocketContext";

interface IProps {
  user: IUserType | null;
  messages: ImsgType[];
}

const ChatArea = ({ user, messages }: IProps) => {
  const socket = useSocket();
  const activeChatId = useSelector(
    (state: RootState) => state.openChat.activeChatId
  );
  const [newMessage, setNewMessage] = useState(
    sessionStorage.getItem(`${activeChatId}-chat`) || ""
  );
  const [room, setRoom] = useState("");
  let authToken = Cookies.get("authToken") || "";

  const [unSentMessages, setUnsentMessages] = useState<
    { text: string; id: number }[]
  >([]);

  useEffect(() => {
    if (activeChatId) {
      const chatId = GetChatId(user?._id, activeChatId);
      setRoom(chatId);
    }
  }, [activeChatId, user?._id]);

  const SendMessage = async () => {
    if (/\S/.test(newMessage)) {
      let Message = newMessage;
      setNewMessage("");
      sessionStorage.setItem(`${activeChatId}-chat`, "");

      const UMessage = { text: Message, id: Math.random() };
      setUnsentMessages((prev) => [...prev, UMessage]);

      const response = await axios.post(
        "/api/chat/post-message",
        {
          partnerId: activeChatId,
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
        userId: activeChatId,
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

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter" && /\S/.test(newMessage)) {
      e.preventDefault();
      SendMessage();
    }
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    let initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const calculatedHeight = initialHeight - currentHeight;

      setKeyboardHeight(calculatedHeight);

      initialHeight = currentHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Body>
      <ChatHeader />
      <ChatTextArea
        unSentMessages={unSentMessages}
        user={user}
        messages={messages}
        keyboardHeight={keyboardHeight}
      />
      <BottomBar>
        <ChatInput
          userId={user?._id || ""}
          activeChatId={activeChatId || ""}
          handleKeyPress={handleKeyDown}
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
  position: relative;
  overflow: hidden;
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const BottomBar = styled.div`
  height: fit-content;
  width: 100%;
  padding: 1.5rem 2rem;
  background-color: ${(props) => props.theme.colors.void};
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 480px) {
    height: 8%;
    padding: 1rem 1rem;
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
