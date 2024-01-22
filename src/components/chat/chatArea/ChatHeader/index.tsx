import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { ArrowIosBack } from "@emotion-icons/evaicons-solid";
import { useDispatch, useSelector } from "react-redux";
import {
  updateActiveChatId,
  updateOpenChat
} from "@/Redux/features/openChat/openChatSlice";
import ChatProfile from "../../chat-components/chatProfile";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { RootState } from "@/Redux/app/store";
import { getActiveChatPartner } from "@/Redux/features/friends/friendsSlice";

interface Iprops {}
const ChatHeader = ({}: Iprops) => {
  const dispatch = useDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const [Partner, setPartner] = useState<IUserType>();
  const chatPartner = useSelector((state: RootState) =>
    getActiveChatPartner(state)
  );

  useEffect(() => {
    setPartner(chatPartner);
  }, [chatPartner]);
  const profileRef = useRef(null);
  const GoBack = () => {
    dispatch(updateOpenChat(false));
    dispatch(updateActiveChatId(""));
  };

  useClickOutside(profileRef, () => {
    setProfileOpen(false);
  });

  return (
    <TopBar>
      <ProfileDiv open={profileOpen}>
        <ChatProfile />
      </ProfileDiv>

      <TopLeft>
        <BackArrow
          onClick={() => {
            GoBack();
          }}
        >
          <ArrowIosBack size={30} />
        </BackArrow>
        <PartnerDetails
          ref={profileRef}
          onClick={() => {
            setProfileOpen(true);
          }}
        >
          <PartnerImage />
          <PartnerName>{Partner?.username}</PartnerName>
        </PartnerDetails>
      </TopLeft>
    </TopBar>
  );
};

export default ChatHeader;

const TopBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gluton};
  background-color: ${(props) => props.theme.bgColors.slateFade};
  backdrop-filter: blur(10px);
  align-items: center;
  position: relative;
  justify-content: space-between;
  display: flex;
  z-index: 100;
  @media screen and (max-width: 480px) {
    height: 6rem;
    padding: 0.5rem 0.5rem;
    position: fixed;
    top: 0;
  }
`;

interface IStyleProfile {
  open: boolean;
}
const ProfileDiv = styled.div<IStyleProfile>`
  position: absolute;
  top: 0;
  margin-top: 1rem;
  transform: ${(props) => (props.open ? "translateY(0)" : "translateY(-110%)")};
  transition: 0.3s ease-in-out all;
`;

const TopLeft = styled.div`
  display: flex;
  align-items: center;
`;
const BackArrow = styled.div`
  display: none;
  margin-right: 0.5rem;
  @media screen and (max-width: 480px) {
    display: flex;
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const PartnerDetails = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const PartnerImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: white;
`;
const PartnerName = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin-left: 1.5rem;
`;
