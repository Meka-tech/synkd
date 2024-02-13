import styled from "@emotion/styled";
import { useState } from "react";

import Image, { StaticImageData } from "next/image";

interface IProps {
  name: string;
  onClick: () => void;
  bgImage: StaticImageData | string;
  size?: string;
}

const GenreItem = ({ name, onClick, bgImage, size = "100" }: IProps) => {
  const [active, setActive] = useState(false);
  const HandleClick = () => {
    setActive(!active);
    onClick();
  };

  return (
    <Body onClick={HandleClick} size={size}>
      <Image
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        src={bgImage}
        alt="background"
        placeholder="blur"
      />
      <Text size={size}>{name}</Text>
    </Body>
  );
};

export default GenreItem;

interface IButtonProps {
  size: string;
}

const Body = styled.div<IButtonProps>`
  position: relative;
  height: ${(props) => `calc( ${props.size} / 100 * 12.5rem)`};
  width: ${(props) => `calc( ${props.size} / 100 * 12.5rem)`};
  border-radius: 50%;
  cursor: pointer;
  transition: all ease-in 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
  overflow: hidden;
  padding: 1rem;

  img {
    position: absolute;
    opacity: 0.5;
    transition: transform 0.3s ease;
    filter: blur(1px);
  }
  :hover {
    img {
      transform: scale(1.3);
      opacity: 0.8;
      filter: blur(0px);
    }
  }
  margin-left: auto;
  margin-right: auto;

  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    height: ${(props) => `calc( ${props.size} / 100 * 10rem)`};
    width: ${(props) => `calc( ${props.size} / 100 * 10rem)`};
  }

  @media screen and (max-width: 480px) {
    height: ${(props) => `calc( ${props.size} / 100 * 7.5rem)`};
    width: ${(props) => `calc( ${props.size} / 100 * 7.5rem)`};
    img {
      filter: blur(0px);
    }
  }
`;

const Text = styled.h2<IButtonProps>`
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
  font-size: ${(props) => `calc( ${props.size} / 100 * 1.7rem)`};
  font-weight: 800;
  text-align: center;
  text-transform: capitalize;
  z-index: 10;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: ${(props) => `calc( ${props.size} / 100 * 1.4rem)`};
  }
  @media screen and (max-width: 480px) {
    font-size: ${(props) => `calc( ${props.size} / 100 * 1.1rem)`};
  }
`;
