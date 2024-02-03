import styled from "@emotion/styled";
import {
  DotsVerticalRounded,
  Bell,
  Plus
} from "@emotion-icons/boxicons-regular";
import ChatBox from "./components/chatBox";
import { IUserType } from "@/types/userType";
import { useEffect, useRef, useState } from "react";
import Notification from "./slides/notification";
import useClickOutside from "@/hooks/useClickOutside";
import axios from "axios";
import Cookies from "js-cookie";
import SearchInput from "./components/searchInput";
import { User, Filter } from "@emotion-icons/boxicons-regular";

import NewChat from "./slides/newChat";
import ActiveChats from "./components/activeChats";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/app/store";
import Profile from "./slides/profile";

interface IProps {}

type SlideType = {
  [key: string]: React.ReactNode;
};
const ChatSideBar = ({}: IProps) => {
  const [slideInActive, setSlideInActive] = useState(false);
  const [activeSlide, setActiveSlide] = useState(""); //options //notifications //profile
  const SlideRef = useRef(null);
  const ReadNotification = useSelector(
    (state: RootState) => state.user.readNotification
  );

  const RemoveSlide = () => {
    setSlideInActive(false);
    setActiveSlide("");
  };

  useClickOutside(SlideRef, () => RemoveSlide());

  const Slides: SlideType = {
    notifications: <Notification close={RemoveSlide} />,
    newChat: <NewChat close={RemoveSlide} />,
    profile: <Profile close={RemoveSlide} />
  };

  const ActivativeSlide = (slide: string) => {
    setActiveSlide(slide);
    setSlideInActive(true);
  };

  const openChat: boolean = useSelector(
    (state: RootState) => state.openChat.openChat
  );
  return (
    <Body openChat={openChat}>
      <SlideInDiv active={slideInActive} ref={SlideRef}>
        {slideInActive && Slides[activeSlide]}
      </SlideInDiv>
      <TopBar>
        <UserDetails>
          <UserImage onClick={() => ActivativeSlide("profile")}>
            <User size={30} />
          </UserImage>
        </UserDetails>
        <Utitilites>
          <AddIcon onClick={() => ActivativeSlide("newChat")}>
            <Plus size={20} />
          </AddIcon>
          <BellIcon onClick={() => ActivativeSlide("notifications")}>
            <Bell size={25} />
            {!ReadNotification && <BlueCheck />}
          </BellIcon>
          <OptionIcon>
            <DotsVerticalRounded size={25} />
          </OptionIcon>
        </Utitilites>
      </TopBar>
      <SearchArea>
        <SearchInput />
        <Filter size={20} />
      </SearchArea>
      <Texts>
        <ActiveChats />
      </Texts>
    </Body>
  );
};

export default ChatSideBar;

interface BodyProps {
  openChat: boolean;
}

const Body = styled.div<BodyProps>`
  width: 30%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.gluton};
  position: relative;
  transition: 0.15s ease-in-out;
  @media screen and (max-width: 480px) {
    width: 100vw;
    z-index: 500;
    position: absolute;
    transform: ${(props) =>
      props.openChat ? "translateX(-100%)" : "translateX(0)"};
  }
`;

const TopBar = styled.div`
  height: 8%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.slate};
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 480px) {
    height: 8%;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    height: 8%;
  }
`;
const UserDetails = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const UserImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 480px) {
    height: 3rem;
    width: 3rem;
  }
`;

const Utitilites = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 14rem;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    width: 12rem;
  }
`;

const AddIcon = styled.div`
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary};
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BellIcon = styled.div`
  cursor: pointer;
  transition: all ease 0.1s;
  position: relative;

  :hover {
    scale: 1.05;
  }
`;

const BlueCheck = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
`;
const OptionIcon = styled(BellIcon)``;

const SearchArea = styled.div`
  padding: 1rem 1.5rem;
  background-color: ${(props) => props.theme.colors.slate};
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    padding: 0.5rem 1rem;
  }
`;
const Texts = styled.div`
  padding-top: 1rem;
  height: 82%;
  overflow-y: scroll;
  width: 100%;
  @media screen and (max-width: 480px) {
    height: 82%;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    height: 82%;
  }
`;

const SlideInDiv = styled.div<{ active: boolean }>`
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme.colors.gluton};
  transform: ${(props) =>
    props.active ? "translateX(0)" : "translateX(-100%)"};
  transition: all ease 0.2s;
`;
