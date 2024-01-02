import styled from "@emotion/styled";
import { DotsVerticalRounded, Bell } from "@emotion-icons/boxicons-regular";
import ChatBox from "./components/chatBox";
import { IUserType } from "@/types/userType";
import { useEffect, useRef, useState } from "react";
import Notification from "./slides/notification";
import useClickOutside from "@/hooks/useClickOutside";
import axios from "axios";
import Cookies from "js-cookie";

interface IProps {
  user: IUserType;
  setActiveChat: Function;
}

type SlideType = {
  [key: string]: React.ReactNode;
};
const ChatSideBar = ({ user, setActiveChat }: IProps) => {
  let authToken = Cookies.get("authToken") || "";
  const [slideInActive, setSlideInActive] = useState(false);
  const [activeSlide, setActiveSlide] = useState(""); //options //notifications //profile
  const SlideRef = useRef(null);
  const [friends, setFriends] = useState([]);

  useClickOutside(SlideRef, () => {
    setSlideInActive(false);
    setActiveSlide("");
  });

  const Slides: SlideType = {
    notifications: <Notification />
  };
  const GetFriends = async () => {
    try {
      const res = await axios.get("/api/user/get-friends", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setFriends(res.data.friends);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetFriends();
  }, []);
  return (
    <Body>
      <SlideInDiv active={slideInActive} ref={SlideRef}>
        {slideInActive && Slides[activeSlide]}
      </SlideInDiv>
      <TopBar>
        <UserDetails>
          <UserImage />
          <UserName>{user.username}</UserName>
        </UserDetails>
        <Utitilites>
          <BellIcon
            onClick={() => {
              setActiveSlide("notifications");
              setSlideInActive(true);
            }}
          >
            <Bell size={20} />
          </BellIcon>
          <OptionIcon>
            <DotsVerticalRounded size={20} />
          </OptionIcon>
        </Utitilites>
      </TopBar>
      <Texts>
        {friends?.map((friend, i) => {
          return <ChatBox selectChat={setActiveChat} user={friend} key={i} />;
        })}
      </Texts>
    </Body>
  );
};

export default ChatSideBar;

const Body = styled.div`
  width: 30%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.gluton};
  position: relative;
`;

const TopBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.slate};
  display: flex;
  align-items: center;
  justify-content: space-between;
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
`;
const UserName = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin-left: 1.5rem;
`;

const Utitilites = styled.div`
  display: flex;
  align-items: center;
`;

const BellIcon = styled.div`
  cursor: pointer;
  transition: all ease 0.1s;
  :hover {
    scale: 1.05;
  }
`;

const OptionIcon = styled(BellIcon)`
  margin-left: 1rem;
`;

const Texts = styled.div`
  padding-top: 1rem;
  height: 80%;
  overflow-y: scroll;
  width: 100%;
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
