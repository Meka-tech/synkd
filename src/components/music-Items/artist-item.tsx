import styled from "@emotion/styled";
import { useState } from "react";
import { CheckCircle } from "@emotion-icons/octicons";

interface IProps {
  name: string;
  selected?: boolean;
  onClick: () => void;
}

const ArtistItem = ({ name, selected, onClick }: IProps) => {
  const HandleClick = () => {
    setActive(!active);
    onClick();
  };
  const [active, setActive] = useState(false);
  return (
    <Body onClick={HandleClick}>
      <Text>{name}</Text>
      {selected && <CheckCircle size={20} />}
    </Body>
  );
};

export default ArtistItem;

const Body = styled.div`
  width: 100%;
  height: 4.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all ease-in 0.1s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  color: white;
  :hover {
    color: white;
  }
`;

const Text = styled.h2`
  font-size: 1.6rem;
  font-weight: 500;
  text-transform: capitalize;
`;
