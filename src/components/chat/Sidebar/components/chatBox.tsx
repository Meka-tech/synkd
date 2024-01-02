import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";

interface IProps {
  username?: string;
  profileImage?: string;
  recentMsg?: string;
  unReadMsg?: string;
  recentMsgTime?: string;
  user: IUserType;
  selectChat: Function;
}
const ChatBox = ({ user, selectChat }: IProps) => {
  return (
    <Body onClick={() => selectChat(user)}>
      <PictureImage />
      <TextContainer>
        <Top>
          <Name>{user.username}</Name>
          <Time>21:08</Time>
        </Top>
        <Bottom>
          <RecentText>Hello World</RecentText>
          <UnReadMsg>
            <h3>1</h3>
          </UnReadMsg>
        </Bottom>
      </TextContainer>
    </Body>
  );
};

export default ChatBox;

const Body = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1.5rem 1rem;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.slate};
  transition: all ease-in-out 0.1s;
  :hover {
    background-color: ${(props) => props.theme.colors.slate};
  }
`;

const PictureImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: white;
`;

const TextContainer = styled.div`
  width: 85%;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Name = styled.h2`
  font-size: 1.4rem;
`;

const Time = styled.h3`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.dusty};
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecentText = styled.h2`
  font-weight: 400;
  font-size: 1.2rem;
`;

const UnReadMsg = styled.div`
  min-width: 2rem;
  height: 2rem;
  border-radius: 50px;
  width: fit-content;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  h3 {
    font-weight: 600;
    font-size: 1rem;
  }
`;
