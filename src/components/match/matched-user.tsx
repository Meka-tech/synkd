import styled from "@emotion/styled";
import Image from "next/image";
import React, { FC, useState } from "react";
import { Sync, Undo } from "@emotion-icons/boxicons-regular";
import { CheckCircle } from "@emotion-icons/boxicons-solid";
import axios from "axios";
import { IUserType } from "@/types/userType";
import Cookies from "js-cookie";
import { css, keyframes } from "@emotion/react";
import { useSocket } from "@/context/SocketContext";
import { GetProfileImage } from "@/utils/GetProfileImage";

interface IProps {
  user: IUserType;
  percent: number;
  interest: string;
  sender: IUserType | null;
}
const MatchedUser = ({ user, percent, interest, sender }: IProps) => {
  const [hover, setHover] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  let authToken = Cookies.get("authToken") || "";
  const socket = useSocket();

  const SendFriendRequest = async () => {
    setLoading(true);
    if (!requestSent) {
      const res = await axios.post(
        "/api/user/notification/send-request",
        {
          requestId: user._id,
          matchCategory: interest,
          percent: `${percent}`
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      socket?.emit("send-notification", {
        from: sender?._id,
        to: user._id
      });
      socket?.emit("accepted-request", {
        from: sender?._id,
        to: user._id
      });
      setLoading(false);
      setRequestSent(true);
    }
  };

  const UnsendFriendRequest = async () => {
    setLoading(true);
    if (requestSent) {
      const res = await axios.post(
        "/api/user/notification/unsend-request",
        {
          requestId: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      socket?.emit("send-notification", {
        from: sender?._id,
        to: user._id
      });
      setLoading(false);
      setRequestSent(false);
    }
  };

  const AvatarImage = GetProfileImage(user?.avatar);
  return (
    <Main
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <UserDetails>
        <UserImage>
          <Image src={AvatarImage} alt="pfp" placeholder="blur" />
        </UserImage>
        <NamePercent>
          <Username>{user?.username}</Username>
          <Percent>
            <PercentText>{percent}% Match</PercentText>
          </Percent>
        </NamePercent>
      </UserDetails>
      <Right hover={hover}>
        {requestSent ? (
          <CheckSection onClick={UnsendFriendRequest}>
            <Undo size={25} />
          </CheckSection>
        ) : (
          <IconSection
            hover={hover}
            isloading={loading}
            onClick={SendFriendRequest}
          >
            <Sync size={20} />
          </IconSection>
        )}

        <SyncTextDiv hover={hover}>
          {requestSent ? (
            <h4>
              un-synk{loading ? "ing" : ""} with {user?.username}
            </h4>
          ) : (
            <h3>
              <span>Synk{loading ? "ing" : ""}</span> with {user?.username}
            </h3>
          )}
        </SyncTextDiv>
      </Right>
    </Main>
  );
};

export default MatchedUser;

const Main = styled.div`
  cursor: pointer;
  width: 100%;
  background-color: ${(props) => props.theme.colors.gluton};
  border-radius: 10px;
  height: 10rem;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ease 0.2s;
  margin-bottom: 1rem;
  position: relative;
  @media screen and (max-width: 480px) {
    height: 8rem;
    padding: 1rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    height: 8rem;
  }
`;

const UserDetails = styled.div`
  display: flex;
`;

const UserImage = styled.div`
  width: 5rem;
  height: 5rem;
  background-color: black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    width: 5rem;
    height: 5rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    width: 4rem;
    height: 4rem;
    img {
      width: 4rem;
      height: 4rem;
    }
  }
  @media screen and (max-width: 480px) {
    width: 3rem;
    height: 3rem;
    img {
      width: 3rem;
      height: 3rem;
    }
  }
`;

const NamePercent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
  align-items: start;
  justify-content: space-between;
  @media screen and (max-width: 480px) {
    margin-left: 1rem;
  }
`;
const Username = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  @media screen and (max-width: 480px) {
    font-size: 1.4rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.6rem;
  }
`;

const Percent = styled.div``;

const PercentText = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  @media screen and (max-width: 480px) {
    font-size: 1.2rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
`;
interface HoverPlane {
  hover: boolean;
  isloading?: boolean;
}
const Right = styled.div<HoverPlane>`
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
  flex-direction: column;
  color: ${(props) => props.theme.colors.primary};
  transition: all ease-in 0.1s;

  span,
  h3 {
    font-size: 1.4rem;
    color: white;
    font-weight: 400;

    @media screen and (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
  h4 {
    font-size: 1.4rem;
    font-weight: 400;
    color: ${(props) => props.theme.colors.danger};

    @media screen and (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
  span {
    color: ${(props) => props.theme.colors.primary};
  }
`;
const SyncTextDiv = styled.div<HoverPlane>`
  transform: ${(props) => (props.hover ? "translateX(-4rem)" : "")};
  transition: all ease-in 0.1s;
  position: absolute;
  opacity: ${(props) => (props.hover ? "1" : "0")};
`;
const rotateAnimation = keyframes`
  from {
    transform: rotate(-360deg);
  }
  to {
    transform: rotate(0);
  }
`;
const IconSection = styled.div<HoverPlane>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${(props) =>
    props.hover || props.isloading ? props.theme.colors.primary : "white"};
  color: ${(props) =>
    props.hover || props.isloading ? "white" : props.theme.colors.primary};
  transition: all ease-in-out 0.2s;
  transform: ${(props) => (props.hover ? "rotate(0)" : "rotate(-90deg)")};
  animation: ${(props) =>
    props.isloading
      ? css`
          ${rotateAnimation} 1s linear infinite
        `
      : "none"};
`;

const CheckSection = styled.div`
  color: ${(props) => props.theme.colors.danger};
  background-color: ${(props) => props.theme.bgColors.dangerFade};
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
