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
import { InfoCircle } from "@emotion-icons/boxicons-regular";
import { GetProfileImage } from "@/utils/GetProfileImage";
import Image from "next/image";

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
    setTimeout(() => {
      dispatch(updateActiveChatId(""));
    }, 500);
  };

  useClickOutside(profileRef, () => {
    setProfileOpen(false);
  });

  const ProfileImage = GetProfileImage(Partner?.avatar);

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
        <PartnerDetails>
          <PartnerImage>
            <Image src={ProfileImage} alt="pfp" />
          </PartnerImage>
          <PartnerName>{Partner?.username}</PartnerName>
        </PartnerDetails>
      </TopLeft>

      <Info
        ref={profileRef}
        onClick={() => {
          setProfileOpen(true);
        }}
      >
        <InfoCircle size={25} />
      </Info>
    </TopBar>
  );
};

export default ChatHeader;

const TopBar = styled.div`
  height: 8%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gluton};
  background-color: ${(props) => props.theme.bgColors.slateFade};
  backdrop-filter: blur(10px);
  align-items: center;
  position: relative;
  justify-content: space-between;
  display: flex;
  z-index: 200;
  @media screen and (max-width: 480px) {
    height: 8%;
    padding: 0.5rem 0.5rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    height: 8%;
  }
`;

interface IStyleProfile {
  open: boolean;
}
const ProfileDiv = styled.div<IStyleProfile>`
  position: absolute;
  top: 0;
  left: 1rem;
  margin-top: 1rem;
  transform: ${(props) => (props.open ? "translateY(0)" : "translateY(-110%)")};
  transition: 0.3s ease-in-out all;
  @media screen and (max-width: 480px) {
    margin-top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
  }
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
    color: ${(props) => props.theme.colors.snow};
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
  overflow: hidden;
  img {
    width: 4rem;
    height: 4rem;
  }
`;
const PartnerName = styled.h2`
  color: white;
  font-size: 1.6rem;
  font-weight: 500;
  margin-left: 1.5rem;
`;

const Info = styled.div`
  color: ${(props) => props.theme.colors.dusty};
  cursor: pointer;
`;
