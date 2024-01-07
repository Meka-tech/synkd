import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";

interface IProps {
  user: IUserType;
  selectChat: Function;
  close: Function;
}
const FriendBox = ({ user, selectChat, close }: IProps) => {
  return (
    <Body
      onClick={() => {
        selectChat(user);
      }}
    >
      <PictureImage />
      <TextContainer>
        <Top>
          <Name>{user.username}</Name>
        </Top>
      </TextContainer>
    </Body>
  );
};

export default FriendBox;

const Body = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1.2rem 1rem;
  justify-content: space-between;
  transition: all ease-in-out 0.1s;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.slate};
  :hover {
    transform: scale(1.05);
  }
  margin-bottom: 1rem;
`;

const PictureImage = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: white;
`;

const TextContainer = styled.div`
  width: 87%;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Name = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
`;
