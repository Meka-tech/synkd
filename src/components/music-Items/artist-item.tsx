import styled from "@emotion/styled";
import { useState } from "react";

interface IProps {
  name: string;
}

const ArtistItem = ({ name }: IProps) => {
  const [active, setActive] = useState(false);
  return (
    <Body active={active} onClick={() => setActive(!active)}>
      <Text>{name}</Text>
    </Body>
  );
};

export default ArtistItem;

interface IButtonProps {
  active: boolean;
}
const Body = styled.div<IButtonProps>`
  padding: 1rem 1.2rem;
  border-radius: 10px;

  cursor: pointer;
  transition: all ease-in 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 3rem;
  min-width: fit-content;
  max-width: fit-content;
  background-color: ${(props) =>
    props.active ? `${props.theme.colors.primary}` : `#4b4b4b83`};
  color: white;
  :hover {
    color: white;
  }
  margin-left: auto;
  margin-right: auto;
`;

const Text = styled.h2`
  font-size: 1.4rem;
  font-weight: 500;
  text-transform: capitalize;
`;
