import { IUserType } from "@/types/userType";
import { GetChatId } from "@/utils/GetChatId";
import styled from "@emotion/styled";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import ChatBubble from "../chatBubble";
import Loading from "@/components/loading";

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
  user: IUserType;
  chatPartner: IUserType | null;
  unSentMessages: { text: string; id: number }[];
  sync: boolean;
  setSync: Function;
}

const ChatTextArea = ({
  chatPartner,
  user,
  unSentMessages,
  sync,
  setSync
}: IProps) => {
  const [room, setRoom] = useState("");
  const scrollRef = useRef<null | HTMLDivElement>(null);

  const [roomMessages, setRoomMessages] = useState<Imsg[]>([]);

  useEffect(() => {
    if (chatPartner) {
      const chatId = GetChatId(user._id, chatPartner?._id);
      setRoom(chatId);
    }
  }, [chatPartner, user._id]);
  let authToken = Cookies.get("authToken") || "";

  const GetMessages = async () => {
    if (room && sync) {
      const res = await axios.post(
        "/api/chat/get-room-message",
        {
          room
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      setRoomMessages(res.data.data);
      setSync(false);
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    GetMessages();
  }, [room, sync]);
  return (
    <Chats>
      {roomMessages.length === 0 && <Loading />}
      {roomMessages?.map((msg) => {
        const isPartner = msg.user.username !== user.username;
        return (
          <ChatBubble
            text={msg.text}
            key={msg._id}
            time={msg.createdAt}
            partner={isPartner}
          />
        );
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
