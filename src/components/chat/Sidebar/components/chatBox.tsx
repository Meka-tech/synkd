import { RootState } from "@/Redux/app/store";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import ShortenText from "@/utils/ShortenText";
import { updateOpenChat } from "@/Redux/features/openChat/openChatSlice";

interface IProps {
  user: IUserType;
  profileImage?: string;
  recentMsg?: string;
  unReadMsg: number;
  recentMsgTime?: string;
  partner: IUserType;
  selectChat: Function;
  userSent: boolean;
  readMsg: boolean;
}
const ChatBox = ({
  user,
  partner,
  selectChat,
  recentMsg,
  recentMsgTime,
  userSent,
  unReadMsg,
  readMsg
}: IProps) => {
  const userDetails: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  const dispatch = useDispatch();

  const OpenUserChat = () => {
    dispatch(updateOpenChat(true));
  };

  return (
    <Body
      onClick={() => {
        selectChat(partner);
        OpenUserChat();
      }}
    >
      <PictureImage />
      <TextContainer>
        <Top>
          <Name>{partner.username}</Name>
          <TimeDiv>
            <Time unRead={unReadMsg > 0}>{recentMsgTime}</Time>{" "}
            {unReadMsg > 0 && <UnReadMsgDiv />}
          </TimeDiv>
        </Top>
        <Bottom>
          <Message>
            <RecentText>
              {" "}
              {userSent && "You: "}
              {ShortenText(recentMsg, 30)}
            </RecentText>
          </Message>
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
  border-bottom: 1px solid ${(props) => props.theme.bgColors.primaryFade};
  transition: all ease-in-out 0.1s;
  border-radius: 10px;
  :hover {
    /* background-color: ${(props) => props.theme.bgColors.primaryFade}; */
    background-color: rgba(255, 255, 255, 0.05);
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
  margin-bottom: 0.5rem;
`;

const Name = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
`;
interface BlueText {
  unRead: boolean;
}

const TimeDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Time = styled.h3<BlueText>`
  font-size: 1.1rem;
  color: ${(props) =>
    props.unRead ? props.theme.colors.primary : props.theme.colors.dusty};
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Message = styled.div`
  display: flex;
  align-items: start;
  max-width: 90%;
`;
const RecentText = styled.h2`
  font-weight: 400;
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.dusty};
`;

const UnReadMsgDiv = styled.div`
  margin-left: 0.5rem;
  min-width: 1rem;
  height: 1rem;
  border-radius: 50%;
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
