import {
  updateActiveChatId,
  updateLaunch,
  updateOpenChat
} from "@/Redux/features/openChat/openChatSlice";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import ShortenText from "@/utils/ShortenText";
import { RootState } from "@/Redux/app/store";

interface IProps {
  user: IUserType;

  close: Function;
}
const FriendBox = ({ user, close }: IProps) => {
  const dispatch = useDispatch();
  const justLaunched = useSelector((state: RootState) => state.openChat.launch);

  const OpenUserChat = () => {
    if (justLaunched) {
      dispatch(updateLaunch(false));
    }
    dispatch(updateOpenChat(true));
    dispatch(updateActiveChatId(user._id));
  };

  return (
    <Body
      onClick={() => {
        OpenUserChat();
      }}
    >
      <PictureImage />
      <TextContainer>
        <Name>{user.username}</Name>
        <Bio> {ShortenText(user.bio, 30)}</Bio>
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
  @media screen and (max-width: 480px) {
    width: 90%;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    padding: 1rem;
  }
`;

const PictureImage = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: white;
  @media screen and (max-width: 480px) {
    width: 2.5rem;
    height: 2.5rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    width: 3rem;
    height: 3rem;
  }
`;

const TextContainer = styled.div`
  width: 87%;
`;

const Name = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
`;

const Bio = styled.h2`
  font-size: 1.4rem;
  margin-top: 0.5rem;
  font-weight: 300;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.2rem;
  }
`;
