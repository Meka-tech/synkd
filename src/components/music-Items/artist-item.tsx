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
  color: ${(props) => props.theme.colors.dusty};
  :hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${(props) => props.theme.colors.snow};
  }
  @media screen and (max-width: 480px) {
    height: 4rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    height: 4rem;
  }
`;

const Text = styled.h2`
  font-size: 1.6rem;
  font-weight: 400;
  text-transform: capitalize;

  @media screen and (max-width: 480px) {
    font-size: 1.4rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
`;
