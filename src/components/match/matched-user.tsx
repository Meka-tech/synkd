import styled from "@emotion/styled";
import Image from "next/image";
import DefaultPfp from "../../images/pfp/pfp1.jpeg";
import React, { FC, useState } from "react";
import { Sync } from "@emotion-icons/boxicons-regular";
import { CheckCircle } from "@emotion-icons/boxicons-solid";
import axios from "axios";
import { IUserType } from "@/types/userType";
import Cookies from "js-cookie";
import { css, keyframes } from "@emotion/react";
import { useSocket } from "@/context/SocketContext";

interface IProps {
  user: IUserType;
  percent: number;
  interest: string;
  sender: IUserType | null;
}
const MatchedUser = ({ user, percent, interest, sender }: IProps) => {
  const [hover, setHover] = useState(false);
  const [requestSent, setSendRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  let authToken = Cookies.get("authToken") || "";
  const socket = useSocket();

  const SendFriendRequest = async () => {
    setLoading(true);
    if (!requestSent) {
      const res = await axios.post(
        "/api/user/notification/send-request",
        {
          RequestId: user._id,
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
      setSendRequest(true);
    }
  };
  return (
    <Main
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={SendFriendRequest}
    >
      <UserDetails>
        <UserImage>
          <Image src={DefaultPfp} alt="pfp" />
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
          <CheckSection>
            <CheckCircle size={25} />
          </CheckSection>
        ) : (
          <IconSection hover={hover} isloading={loading}>
            <Sync size={20} />
          </IconSection>
        )}

        <SyncTextDiv hover={hover}>
          {requestSent ? (
            <h3>Request Sent</h3>
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
  background-color: #0c0c0c;
  border-radius: 10px;
  height: 10rem;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ease 0.2s;
  margin-bottom: 1rem;
  position: relative;
  :active {
    transform: scale(0.95);
  }
  @media screen and (max-width: 480px) {
    height: 8rem;
    padding: 1rem 2rem;
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
  @media screen and (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const Percent = styled.div``;

const PercentText = styled.h2`
  font-size: 1.8rem;
  color: ${(props) => props.theme.colors.primary};
  @media screen and (max-width: 480px) {
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
  color: ${(props) => props.theme.colors.primary};
`;
