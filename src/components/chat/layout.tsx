import styled from "@emotion/styled";
import ChatSideBar from "./Sidebar/chatSidebar";
import ChatArea from "./chatArea";
import { IUserType } from "@/types/userType";

interface IProps {
  user: IUserType;
}
const ChatLayout = ({ user }: IProps) => {
  return (
    <Body>
      {" "}
      <ChatSideBar user={user} />
      <ChatArea user={user} />
    </Body>
  );
};

export default ChatLayout;

const Body = styled.div`
  height: 100dvh;
  display: flex;
`;
