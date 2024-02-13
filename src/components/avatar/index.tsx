import styled from "@emotion/styled";
import Image, { StaticImageData } from "next/image";
import { Check } from "@emotion-icons/octicons";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/app/store";
import { useState } from "react";
interface IProps {
  name: string;
  imagesrc: StaticImageData;
  chosenAvatar: string;
  chooseAvatar: Function;
}
const AvatarItem = ({ name, imagesrc, chosenAvatar, chooseAvatar }: IProps) => {
  return (
    <Container onClick={() => chooseAvatar(name)}>
      <Avatar>
        <Image
          src={imagesrc}
          alt={name}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Avatar>
      {name === chosenAvatar && (
        <CheckArea>
          <Check size={20} />
        </CheckArea>
      )}
    </Container>
  );
};

export default AvatarItem;

const Container = styled.div`
  width: 10rem;
  height: 10rem;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  cursor: pointer;
  transition: all ease-in-out 0.2s;

  @media screen and (max-width: 480px) {
    width: 8rem;
    height: 8rem;
  }
  :hover {
    scale: 1.1;
  }
`;
const Avatar = styled.div`
  border-radius: 10px;
  overflow: hidden;
  width: 10rem;
  height: 10rem;
  position: relative;
  border-radius: 10px;
  @media screen and (max-width: 480px) {
    width: 8rem;
    height: 8rem;
  }
  img {
    width: 10rem;
    height: 10rem;
    @media screen and (max-width: 480px) {
      width: 8rem;
      height: 8rem;
    }
  }
`;
const CheckArea = styled.div`
  position: absolute;
  background-color: ${(props) => props.theme.colors.primary};
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  top: -1.5rem;
  right: -1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 480px) {
    width: 2rem;
    height: 2rem;
    top: -1rem;
    right: -1rem;
  }
`;
