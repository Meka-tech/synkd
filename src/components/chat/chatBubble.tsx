import styled from "@emotion/styled";
import { Check } from "@emotion-icons/octicons";

interface IProps {
  text: string;
  partner?: boolean;
  time: Date;
  sent?: boolean;
}

const ChatBubble = ({ text, partner = false, sent, time }: IProps) => {
  const inputDate = new Date(time);
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false // Use 24-hour format
  }).format(inputDate);

  return (
    <Body partner={partner}>
      <Text>{text}</Text>
      <Bottom>
        <Time>{formattedTime}</Time>
        {!partner && (
          <CheckIcon>
            <Check size={10} />
          </CheckIcon>
        )}
      </Bottom>
    </Body>
  );
};

export default ChatBubble;

interface BodyProp {
  partner: boolean;
}
const Body = styled.div<BodyProp>`
  background-color: ${(props) =>
    props.partner ? props.theme.colors.secondary : props.theme.colors.slate};
  height: fit-content;
  width: fit-content;
  color: ${(props) => props.theme.colors.snow};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: ${(props) => (props.partner ? "" : "8px")};
  border-bottom-right-radius: ${(props) => (props.partner ? "8px" : "")};
  padding: 0.5rem 1rem;
  display: flex;
  align-items: end;
  margin-left: ${(props) => (props.partner ? "" : "auto")};
  margin-bottom: 1rem;
  overflow-wrap: break-word;
  max-width: 40%;
`;

const Text = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
`;

const Bottom = styled.div`
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
`;

const Time = styled.h3`
  font-size: 0.8rem;
  font-weight: 300;
`;

const CheckIcon = styled.div`
  margin-left: 0.1rem;
`;
