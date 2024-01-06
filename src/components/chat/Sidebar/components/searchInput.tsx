import styled from "@emotion/styled";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { Search } from "@emotion-icons/boxicons-regular";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleKeyPress?: KeyboardEventHandler<HTMLInputElement>;
}
const SearchInput = ({ handleKeyPress, ...rest }: IProps) => {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <Body focused={focused}>
      <Icon focused={focused}>
        <Search size={20} />
      </Icon>
      <Input
        ref={inputRef}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
        placeholder="Search"
        // onKeyDown={handleKeyPress}
      />
    </Body>
  );
};

export default SearchInput;

interface IinputStyles {
  focused: boolean;
}

const Body = styled.div<IinputStyles>`
  width: 90%;
  padding: 0.5rem 2rem;
  background-color: ${(props) => props.theme.colors.gluton};
  border: ${(props) =>
    props.focused ? `1px solid ${props.theme.colors.primary}` : ""};
  height: 4rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all ease-in 0.25s;
`;
const Icon = styled.div<IinputStyles>`
  color: ${(props) =>
    props.focused
      ? `${props.theme.colors.primary} `
      : `${props.theme.colors.snow}`};
  margin-right: 1rem;
`;
const Input = styled.input`
  border: none;
  outline: none;
  width: 95%;
  height: 100%;
  background-color: transparent;
  font-size: 1.2rem;
  font-weight: 500;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.2rem;
  }

  ::placeholder {
    color: #d9d9d971;
    font-weight: 600;
  }

  &:-webkit-autofill {
    background-color: transparent !important;
    box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0) inset; /* Override background color */
    background-clip: text;
  }
`;
