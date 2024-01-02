import styled from "@emotion/styled";
import ChatSideBar from "./Sidebar/chatSidebar";
import ChatArea from "./chatArea";
import { IUserType } from "@/types/userType";
import { useState } from "react";
import DefaultChatArea from "./DefaultChatArea";

interface IProps {
  user: IUserType;
}
const ChatLayout = ({ user }: IProps) => {
  const [activeChat, setActiveChat] = useState(null);
  return (
    <Body>
      {" "}
      <ChatSideBar user={user} setActiveChat={setActiveChat} />
      {activeChat ? (
        <ChatArea user={user} activeChat={activeChat} />
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
