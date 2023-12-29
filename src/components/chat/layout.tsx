import styled from "@emotion/styled";
import ChatSideBar from "./chatSidebar";
import ChatArea from "./chatArea";

const ChatLayout = () => {
  return (
    <Body>
      {" "}
      <ChatSideBar />
      <ChatArea />
    </Body>
  );
};

export default ChatLayout;

const Body = styled.div`
  height: 100dvh;
  display: flex;
`;
