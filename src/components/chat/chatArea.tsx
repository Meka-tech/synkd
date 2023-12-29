import styled from "@emotion/styled";
import ChatBubble from "./chatBubble";
import ChatInput from "./chatInput";
import { Send } from "@emotion-icons/boxicons-solid";
import { DotsVerticalRounded, Bell } from "@emotion-icons/boxicons-regular";

const ChatArea = () => {
  return (
    <Body>
      <TopBar>
        <PartnerDetails>
          <PartnerImage />
          <PartnerName>Meka</PartnerName>
        </PartnerDetails>
      </TopBar>
      <Chats>
        <ChatBubble text="Hello world" />
        <ChatBubble text="Hello Back" partner={true} />
      </Chats>
      <BottomBar>
        <ChatInput />
        <SendIcon>
          <Send size={25} />
        </SendIcon>
      </BottomBar>
    </Body>
  );
};

export default ChatArea;

const Body = styled.div`
  width: 70%;
  height: 100%;
`;
const TopBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gluton};
  align-items: center;
  justify-content: space-between;
  display: flex;
`;
const PartnerDetails = styled.div`
  display: flex;
  align-items: center;
`;
const PartnerImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
`;
const PartnerName = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin-left: 1.5rem;
`;
const Chats = styled.div`
  height: 80%;
  overflow-y: scroll;
  padding: 0 2rem;
  padding-top: 1rem;
`;

const BottomBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 1.5rem;
  border-top: 1px solid ${(props) => props.theme.colors.gluton};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SendIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in;
  :hover {
    transform: rotate(-45deg) scale(1.01);
  }
`;
