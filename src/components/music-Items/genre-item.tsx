import styled from "@emotion/styled";
import { useState } from "react";

interface IProps {
  name: string;
  onClick: () => void;
}

const GenreItem = ({ name, onClick }: IProps) => {
  const [active, setActive] = useState(false);
  const HandleClick = () => {
    setActive(!active);
    onClick();
  };
  return (
    <Body active={active} onClick={HandleClick}>
      <Text>{name}</Text>
    </Body>
  );
};

export default GenreItem;

interface IButtonProps {
  active: boolean;
}
const Body = styled.div<IButtonProps>`
  padding: 0.5rem 1.5rem;
  border-radius: 23px;
  border: ${(props) => (props.active ? "" : "1px solid #ffffffb2")};
  cursor: pointer;
  transition: all ease-in 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: fit-content;
  max-width: fit-content;
  background-color: ${(props) =>
    props.active ? `${props.theme.colors.primary}` : ""};
  color: ${(props) => (props.active ? `white` : "#ffffff83")};
  :hover {
    color: white;
  }
  margin-left: auto;
  margin-right: auto;
`;

const Text = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
  text-transform: capitalize;
`;
