import styled from "@emotion/styled";
import {
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";
import Picker from "emoji-picker-react";
import { RootState } from "@/Redux/app/store";
import { useSelector } from "react-redux";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleKeyPress: KeyboardEventHandler<HTMLInputElement>;
  setInput: Function;
  userId: string;
  activeChatId: string;
}
const ChatInput = ({
  handleKeyPress,
  setInput,
  userId,
  activeChatId,
  ...rest
}: IProps) => {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const socket = useSelector((state: RootState) => state.socket.socket);

  useEffect(() => {
    inputRef.current?.focus();
  });

  // const [chosenEmoji, setChosenEmoji] = useState(null);

  // const onEmojiClick = (event: any) => {
  //   // setChosenEmoji(event.emoji);

  //   console.log(event);
  // };

  const HandleChange = (e: { target: { value: any } }) => {
    setInput(e.target.value);

    socket?.emit("is-typing", {
      from: userId,
      to: activeChatId
    });
  };
  return (
    <Body>
      <Input
        ref={inputRef}
        {...rest}
        placeholder="Send a Text..."
        onKeyDown={handleKeyPress}
        onChange={HandleChange}
      />
      {/* <EmojiDiv>
        <Picker onEmojiClick={onEmojiClick} />
      </EmojiDiv> */}
    </Body>
  );
};

export default ChatInput;

const Body = styled.div`
  width: 95%;
  padding: 0.5rem 2rem;
  background-color: ${(props) => props.theme.colors.gluton};
  height: 70%;
  border-radius: 8px;
  display: flex;
  position: relative;
  @media screen and (max-width: 480px) {
    height: 4.5rem;
    width: 85%;
  }
`;
const Input = styled.input`
  border: none;
  outline: none;
  width: 90%;
  height: 100%;
  background-color: transparent;
  font-size: 1.6rem;
  font-weight: 500;
  overflow-wrap: break-word;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 1.6rem;
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

const EmojiDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(0%, -90%);
`;
