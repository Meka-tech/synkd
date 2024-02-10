import { RootState } from "@/Redux/app/store";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import ShortenText from "@/utils/ShortenText";
import { Envelope } from "@emotion-icons/boxicons-regular";
import {
  updateActiveChatId,
  updateLaunch,
  updateOpenChat
} from "@/Redux/features/openChat/openChatSlice";

interface IProps {
  recentMsg?: string;
  unReadMsg: number;
  recentMsgTime?: string;
  partner: IUserType | null | undefined;
  userSent: boolean;
}
const ChatBox = ({
  partner,
  recentMsg,
  recentMsgTime,
  userSent,
  unReadMsg
}: IProps) => {
  const dispatch = useDispatch();

  const justLaunched = useSelector((state: RootState) => state.openChat.launch);

  const OpenUserChat = () => {
    if (justLaunched) {
      dispatch(updateLaunch(false));
    }
    dispatch(updateOpenChat(true));
    dispatch(updateActiveChatId(partner?._id));
  };

  return (
    <Body
      onClick={() => {
        OpenUserChat();
      }}
    >
      <PictureImage />
      <TextContainer>
        <Top>
          <Name>{partner?.username}</Name>
          <TimeDiv>
            <Time unRead={unReadMsg > 0}>{recentMsgTime}</Time>{" "}
          </TimeDiv>
        </Top>
        <Bottom>
          <Message>
            <RecentText>
              {unReadMsg > 0 ? (
                <NewMessage>
                  <Envelope size={20} /> New
                </NewMessage>
              ) : (
                <>
                  {" "}
                  {userSent && "You: "}
                  {ShortenText(recentMsg, 30)}
                </>
              )}
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all ease-in-out 0.1s;
  border-radius: 5px;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    padding: 1rem;
  }
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
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    width: 3rem;
    height: 3rem;
  }
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
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
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
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1rem;
  }
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
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.2rem;
  }
`;

const NewMessage = styled.h2`
  font-weight: 700;
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.primary};
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.2rem;
  }
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
