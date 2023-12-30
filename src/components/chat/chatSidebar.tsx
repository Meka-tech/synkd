import styled from "@emotion/styled";
import { DotsVerticalRounded, Bell } from "@emotion-icons/boxicons-regular";
import ChatSidebarBox from "./chatSiderbarBox";
import { IUserType } from "@/types/userType";

interface IProps {
  user: IUserType;
}
const ChatSideBar = ({ user }: IProps) => {
  return (
    <Body>
      <TopBar>
        <UserDetails>
          <UserImage />
          <UserName>{user.username}</UserName>
        </UserDetails>
        <Utitilites>
          <BellIcon>
            <Bell size={20} />
          </BellIcon>
          <OptionIcon>
            <DotsVerticalRounded size={20} />
          </OptionIcon>
        </Utitilites>
      </TopBar>
      <Texts>
        <ChatSidebarBox />
      </Texts>
    </Body>
  );
};

export default ChatSideBar;

const Body = styled.div`
  width: 30%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.gluton};
`;

const TopBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.slate};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const UserDetails = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const UserImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: white;
`;
const UserName = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin-left: 1.5rem;
`;

const Utitilites = styled.div`
  display: flex;
  align-items: center;
`;

const BellIcon = styled.div`
  cursor: pointer;
  transition: all ease 0.1s;
  :hover {
    scale: 1.05;
  }
`;

const OptionIcon = styled(BellIcon)`
  margin-left: 1rem;
`;

const Texts = styled.div`
  padding-top: 1rem;
  height: 80%;
  overflow-y: scroll;
  width: 100%;
`;
