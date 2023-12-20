import styled from "@emotion/styled";
import { FC, useRef, useState } from "react";
import { CaretDown } from "@emotion-icons/boxicons-regular";
import useClickOutside from "@/hooks/useClickOutside";
import { Crown } from "@emotion-icons/boxicons-solid";
import { CheckCircle } from "@emotion-icons/octicons";

interface IProps {
  options?: string[];
  selectItem: Function;
  premiumList?: string[];
  defaultString: string;
  premiumPrivileges?: boolean;
}
const DropdownInput: FC<IProps> = ({
  defaultString,
  options,
  selectItem,
  premiumList,
  premiumPrivileges = false
}) => {
  const [selectedItem, setSelectedItem] = useState(defaultString);
  const [open, setOpen] = useState(false);

  const dropRef = useRef(null);

  useClickOutside(dropRef, () => setOpen(false));

  const OnClickOption = (item: string, premiumOption: boolean) => {
    if (!premiumOption || (premiumPrivileges && premiumOption)) {
      setOpen(false);
      setSelectedItem(item);
      selectItem(item);
    }
  };

  return (
    <Main ref={dropRef}>
      <Body onClick={() => setOpen(!open)}>
        <Text>{selectedItem ? selectedItem : defaultString}</Text>
        <Caret open={open}>
          <CaretDown />
        </Caret>
      </Body>
      <OptionsDiv open={open}>
        {options?.map((option, i) => {
          let premium = false;
          if (premiumList?.includes(option)) {
            premium = true;
          }

          return (
            <OptionItem
              key={i}
              onClick={() => {
                OnClickOption(option, premium);
              }}
              isPremiumAccount={premiumPrivileges}
              premiumOption={premium}
            >
              <Text>{option}</Text>
              {(selectedItem === option && (
                <Icon>
                  <CheckCircle />
                </Icon>
              )) ||
                (premium && (
                  <CrownDiv>
                    <Crown />
                  </CrownDiv>
                ))}
            </OptionItem>
          );
        })}
      </OptionsDiv>
    </Main>
  );
};

export default DropdownInput;

const Main = styled.div`
  width: 18rem;
  position: relative;
  height: fit-content;
  @media screen and (max-width: 480px) {
    width: 12rem;
  }
`;

interface Drop {
  open: boolean;
}

const Body = styled.div`
  border-radius: 10px;
  width: 100%;
  padding: 1rem 2rem;
  background-color: #1a1919;
  cursor: pointer;
  box-shadow: inset 4px 38px 28px -25px #292828;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  @media screen and (max-width: 480px) {
    padding: 0.5rem 1rem;
  }
`;

const Caret = styled.div<Drop>`
  color: white;
  width: 2rem;
  transform: ${(props) => (props.open ? "rotate(180deg)" : "")};
  transition: all ease 0.1s;
  @media screen and (max-width: 480px) {
    width: 1rem;
  }
`;
const Text = styled.h2`
  font-size: 1.4rem;
  text-transform: capitalize;
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
`;

const OptionsDiv = styled.div<Drop>`
  width: 100%;
  position: absolute;
  bottom: -0.5rem;
  transform: translateY(100%);
  z-index: 10;
  display: ${(props) => (props.open ? "block" : "none")};
  border-radius: 10px;
  background-color: #1a1919;
  box-shadow: 0px 17px 57px -40px #000000;
  padding: 1rem 0;
`;

interface options {
  isPremiumAccount?: boolean;
  premiumOption?: boolean;
}
const OptionItem = styled.div<options>`
  width: 100%;
  padding: 0.5rem 2rem;
  cursor: pointer;
  border-radius: 10px;
  color: gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  :hover {
    color: ${(props) =>
      !props.premiumOption
        ? "white"
        : props.isPremiumAccount && props.premiumOption
        ? "white"
        : ""};
  }

  @media screen and (max-width: 480px) {
    padding: 0.5rem 1rem;
  }
`;

const CrownDiv = styled.div`
  color: gold;
  width: 2rem;
  @media screen and (max-width: 480px) {
    width: 1.5rem;
  }
`;

const Icon = styled.div`
  color: white;
  width: 2rem;
  @media screen and (max-width: 480px) {
    width: 1.5rem;
  }
`;
