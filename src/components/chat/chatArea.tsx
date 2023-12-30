import styled from "@emotion/styled";
import ChatBubble from "./chatBubble";
import ChatInput from "./chatInput";
import firebase from "firebase/compat/app";
import { Send } from "@emotion-icons/boxicons-solid";
import { DotsVerticalRounded, Bell } from "@emotion-icons/boxicons-regular";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { fireStoreDb } from "@/firebase-config";
import { IUserType } from "@/types/userType";

interface Imsg {
  text: string;
  user: string;
  room: string;
  createdAt: firebase.firestore.Timestamp;
  id: string;
}

interface IProps {
  user: IUserType;
}

const ChatArea = ({ user }: IProps) => {
  const [newMessage, setNewMessage] = useState("");
  const room = "001";

  const messagesRef = collection(fireStoreDb, "messages");
  const [roomMessages, setRoomMessages] = useState<Imsg[]>([]);
  const queryMessages = query(
    messagesRef,
    where("room", "==", room),
    orderBy("createdAt")
  );

  useEffect(() => {
    const unSubscrbe = onSnapshot(queryMessages, (snapshot) => {
      let messages: Imsg[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const message: Imsg = {
          text: data.text,
          user: data.user,
          room: data.room,
          createdAt: data.createdAt,
          id: doc.id
        };
        messages.push(message);
      });
      setRoomMessages(messages);
    });

    return () => unSubscrbe();
  }, []);

  const SendMessage = async () => {
    if (/\S/.test(newMessage)) {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: user.username,
        room
      });
      setNewMessage("");
    }
    return;
  };

  return (
    <Body>
      <TopBar>
        <PartnerDetails>
          <PartnerImage />
          <PartnerName>Meka</PartnerName>
        </PartnerDetails>
      </TopBar>
      <Chats>
        {roomMessages?.map((msg) => {
          const isPartner = msg.user !== user.username;
          return (
            <ChatBubble
              text={msg.text}
              key={msg.id}
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
