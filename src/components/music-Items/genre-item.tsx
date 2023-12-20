import styled from "@emotion/styled";
import { useState } from "react";

import Image, { StaticImageData } from "next/image";

interface IProps {
  name: string;
  onClick: () => void;
  bgImage: StaticImageData | string;
}

const GenreItem = ({ name, onClick, bgImage }: IProps) => {
  const [active, setActive] = useState(false);
  const HandleClick = () => {
    setActive(!active);
    onClick();
  };

  return (
    <Body onClick={HandleClick}>
      <Image
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        src={bgImage}
        alt="background"
      />
      <Text>{name}</Text>
    </Body>
  );
};

export default GenreItem;

interface IButtonProps {}

const Body = styled.div<IButtonProps>`
  position: relative;
  height: 15rem;
  width: 15rem;
  border-radius: 8px;
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
    height: 12rem;
    width: 12rem;
  }

  @media screen and (max-width: 480px) {
    height: 7.5rem;
    width: 7.5rem;
    img {
      filter: blur(0px);
    }
  }
`;

const Text = styled.h2`
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
  font-size: 1.8rem;
  font-weight: 800;
  text-transform: capitalize;
  z-index: 10;
`;
