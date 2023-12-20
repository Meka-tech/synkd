import styled from "@emotion/styled";
import Image from "next/image";
import DefaultPfp from "../../images/pfp/pfp1.jpeg";
import React, { FC, useState } from "react";
import { Send } from "@emotion-icons/boxicons-solid";

interface IProps {
  user: {
    username: string;
  };
  percent: number;
}
const MatchedUser = ({ user, percent }: IProps) => {
  const [hover, setHover] = useState(false);
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
        <PlaneSection hover={hover}>
          <Send size={20} />
        </PlaneSection>
        <h3>
          {" "}
          <span>Synk</span> with {user?.username}
        </h3>
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
}
const Right = styled.div<HoverPlane>`
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: ${(props) => (props.hover ? "space-between" : "center")};
  flex-direction: column;
  color: ${(props) => props.theme.colors.primary};
  transition: all ease-in 0.1s;
  span,
  h3 {
    transition: all ease-in 0.1s;
    position: ${(props) => (props.hover ? "relative" : "absolute")};
    opacity: ${(props) => (props.hover ? "1" : "0")};
    margin-top: 1rem;
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
const PlaneSection = styled.div<HoverPlane>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${(props) =>
    props.hover ? props.theme.colors.primary : "white"};
  color: ${(props) => (props.hover ? "white" : props.theme.colors.primary)};
  transition: all ease-in-out 0.2s;
  transform: ${(props) => (props.hover ? "rotate(0)" : "rotate(-90deg)")};
`;
