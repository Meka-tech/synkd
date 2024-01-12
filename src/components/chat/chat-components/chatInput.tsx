import styled from "@emotion/styled";
import { KeyboardEventHandler, useEffect, useRef } from "react";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleKeyPress: KeyboardEventHandler<HTMLInputElement>;
}
const ChatInput = ({ handleKeyPress, ...rest }: IProps) => {
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });
  return (
    <Body>
      <Input
        ref={inputRef}
        {...rest}
        placeholder="Send a Text..."
        onKeyDown={handleKeyPress}
      />
    </Body>
  );
};

export default ChatInput;

const Body = styled.div`
  width: 90%;
  padding: 0.5rem 2rem;
  background-color: ${(props) => props.theme.colors.gluton};
  height: 70%;
  border-radius: 8px;
  @media screen and (max-width: 480px) {
    height: 4rem;
    width: 80%;
  }
`;
const Input = styled.input`
  border: none;
  outline: none;
  width: 80%;
  height: 100%;
  background-color: transparent;
  font-size: 1.2rem;
  font-weight: 500;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1rem;
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
