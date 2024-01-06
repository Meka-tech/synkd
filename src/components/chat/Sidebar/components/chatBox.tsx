import { RootState } from "@/Redux/app/store";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { Check } from "@emotion-icons/boxicons-regular";

interface IProps {
  user: IUserType;
  profileImage?: string;
  recentMsg?: string;
  unReadMsg?: string;
  recentMsgTime?: Date;
  partner: IUserType;
  selectChat: Function;
  userSent: boolean;
}
const ChatBox = ({
  user,
  partner,
  selectChat,
  recentMsg,
  recentMsgTime,
  userSent
}: IProps) => {
  const userDetails: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  let msgTime;

  if (recentMsgTime) {
    msgTime = new Date(recentMsgTime);
  }

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false // Use 24-hour format
  }).format(msgTime);

  return (
    <Body onClick={() => selectChat(partner)}>
      <PictureImage />
      <TextContainer>
        <Top>
          <Name>{partner.username}</Name>
          <Time>{time}</Time>
        </Top>
        <Bottom>
          <Message>
            {userSent && (
              <Tick>
                {" "}
                <Check size={15} />
              </Tick>
            )}

            <RecentText>{recentMsg}</RecentText>
          </Message>
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

const Message = styled.div`
  display: flex;
  align-items: center;
`;
const RecentText = styled.h2`
  font-weight: 400;
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.dusty};
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

const Tick = styled.div`
  margin-right: 0.1rem;
  color: ${(props) => props.theme.colors.dusty};
`;
