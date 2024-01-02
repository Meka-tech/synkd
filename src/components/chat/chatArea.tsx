import styled from "@emotion/styled";
import ChatBubble from "./chatBubble";
import ChatInput from "./chatInput";

import { Send } from "@emotion-icons/boxicons-solid";
import { DotsVerticalRounded, Bell } from "@emotion-icons/boxicons-regular";
import { useEffect, useState } from "react";

import { IUserType } from "@/types/userType";
import axios from "axios";
import Cookies from "js-cookie";
import Loading from "../loading";

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
}

const ChatArea = ({ user }: IProps) => {
  const [newMessage, setNewMessage] = useState("");
  const room = "001";
  let authToken = Cookies.get("authToken") || "";

  const [roomMessages, setRoomMessages] = useState<Imsg[]>([]);

  const SendMessage = async () => {
    if (/\S/.test(newMessage)) {
      await axios.post(
        "/api/chat/post-message",
        {
          partnerId: user._id,
          text: newMessage,
          room: room
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      setNewMessage("");
    }
    return;
  };

  const GetMessages = async () => {
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
  };
  useEffect(() => {
    GetMessages();
  }, []);

  return (
    <Body>
      <TopBar>
        <PartnerDetails>
          <PartnerImage />
          <PartnerName>Meka</PartnerName>
        </PartnerDetails>
      </TopBar>
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
      </Chats>
      <BottomBar>
        <ChatInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
`;
const TopBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gluton};
  align-items: center;
  justify-content: space-between;
  display: flex;
`;
const PartnerDetails = styled.div`
  display: flex;
  align-items: center;
`;
const PartnerImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
`;
const PartnerName = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin-left: 1.5rem;
`;
const Chats = styled.div`
  height: 80%;
  overflow-y: scroll;
  padding: 0 2rem;
  padding-top: 1rem;
`;

const BottomBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 2rem;
  border-top: 1px solid ${(props) => props.theme.colors.gluton};
  display: flex;
  align-items: center;
  justify-content: space-between;
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
`;
