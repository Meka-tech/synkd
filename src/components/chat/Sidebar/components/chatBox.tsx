import { RootState } from "@/Redux/app/store";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import ShortenText from "@/utils/ShortenText";
import { Envelope, EnvelopeOpen } from "@emotion-icons/boxicons-solid";
import { ArrowIosBack, ArrowIosForward } from "@emotion-icons/evaicons-solid";

import {
  updateActiveChatId,
  updateLaunch,
  updateOpenChat
} from "@/Redux/features/openChat/openChatSlice";
import { GetProfileImage } from "@/utils/GetProfileImage";
import Image from "next/image";
import { useState } from "react";

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

  const ProfileImage = GetProfileImage(partner?.avatar);
  const [hover, setHover] = useState(false);

  return (
    <Body
      onClick={() => {
        OpenUserChat();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <PictureImage>
        <Image src={ProfileImage} alt="pfp" />
      </PictureImage>
      <TextContainer>
        <Top>
          <Name>{partner?.username}</Name>
          <TimeDiv>
            <Time unRead={unReadMsg > 0}>{recentMsgTime}</Time>
            <Arrow Hover={hover}>
              <ArrowIosForward size={20} />
            </Arrow>
          </TimeDiv>
        </Top>
        <Bottom>
          <Message>
            <RecentText>
              {unReadMsg > 0 ? (
                <NewMessage>
                  <EnvelopeDiv>
                    <Envelope size={20} />{" "}
                  </EnvelopeDiv>
                  New
                </NewMessage>
              ) : unReadMsg < 1 && !userSent ? (
                <ReadMessage>
                  <EnvelopeDiv>
                    <EnvelopeOpen size={20} />{" "}
                  </EnvelopeDiv>
                  {ShortenText(recentMsg, 30)}
                </ReadMessage>
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
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background-color: white;
  overflow: hidden;
  img {
    width: 4.5rem;
    height: 4.5rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    width: 3rem;
    height: 3rem;
    img {
      width: 3rem;
      height: 3rem;
    }
  }
`;

const TextContainer = styled.div`
  width: 87%;
  @media screen and (max-width: 480px) {
    width: 84%;
  }
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
const Arrow = styled.div<{ Hover: Boolean }>`
  width: ${(props) => (props.Hover ? "2rem" : "0rem")};
  transition: ease-in-out 0.1s all;
  overflow: hidden;
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
  font-weight: 400;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.2rem;
  }
`;

const NewMessage = styled.span`
  font-weight: 700;
  display: flex;
  align-items: flex-end;
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.primary};
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.2rem;
  }
`;

const ReadMessage = styled(NewMessage)`
  color: ${(props) => props.theme.colors.dusty};
  font-weight: 400;
`;

const EnvelopeDiv = styled.div`
  margin-right: 0.5rem;
`;
