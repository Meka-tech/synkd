import styled from "@emotion/styled";
import {
  KeyboardEventHandler,
  ReactElement,
  useEffect,
  useRef,
  useState
} from "react";
import { useSocket } from "@/context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/app/store";

interface IProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement>;
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
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  const [scrollingUp, setScrollingUp] = useState(false);
  const socket = useSocket();
  const chatId = useSelector((state: RootState) => state.openChat.activeChatId);

  useEffect(() => {
    textareaRef.current?.focus();
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;

      const scrollThreshold = 100;

      if (currentPosition < scrollThreshold) {
        setScrollingUp(true);
      } else {
        setScrollingUp(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "30px";
    }
  }, []);

  useEffect(() => {
    if (scrollingUp) {
      textareaRef.current?.blur();
    }
  }, [scrollingUp]);

  const HandleChange = (e: { target: { value: any } }) => {
    setInput(e.target.value);
    sessionStorage.setItem(`${chatId}-chat`, e.target.value);

    const target = e.target as HTMLTextAreaElement;
    if (textareaRef.current) {
      textareaRef.current.style.height = "30px";
      textareaRef.current.style.height = `${
        target.scrollHeight < 500 && target.scrollHeight
      }px`;
    }

    socket?.emit("is-typing", {
      from: userId,
      to: activeChatId
    });
  };

  return (
    <Body>
      <Input
        ref={textareaRef}
        {...rest}
        placeholder="Send a Text..."
        onKeyDown={handleKeyPress}
        onChange={HandleChange}
      />
    </Body>
  );
};

export default ChatInput;

const Body = styled.div`
  width: 95%;
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  height: fit-content;
  border-radius: 15px;
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 1rem;
  @media screen and (max-width: 480px) {
    border: none;
    background-color: ${(props) => props.theme.colors.gluton};
    width: 85%;
    padding: 0.5rem 1rem;
    margin-right: 1.5rem;
  }
`;
const Input = styled.textarea`
  border: none;
  outline: none;
  width: 100%;
  resize: none;
  min-height: 2rem;
  background-color: transparent;
  font-size: 1.6rem;
  font-weight: 400;
  overflow-wrap: break-word;

  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.6rem;
    min-height: 2rem;
    max-height: 15rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 1.6rem;
    min-height: 1rem;
    max-height: 10rem;
  }
  ::placeholder {
    color: ${(props) => props.theme.colors.dusty};
    font-weight: 400;
  }

  &:-webkit-autofill {
    background-color: transparent !important;
    box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0) inset; /* Override background color */
    background-clip: text;
  }
`;

const SendDiv = styled.div`
  position: relative;
`;
