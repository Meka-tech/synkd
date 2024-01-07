import styled from "@emotion/styled";
import Loading from "../../../loading";
import { useEffect } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import io, { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import { MessageDb } from "@/MessageLocalDb";
import { ReadDBMessage } from "@/utils/indexedDb_Functions/readDBMessage";
import { Check, CheckDouble } from "@emotion-icons/boxicons-regular";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/app/store";

interface IProps {
  text: string;
  partner?: boolean;
  time?: Date;
  sent?: boolean;
  readStatus?: boolean;
  id?: string;
  partnerId?: string;
}

const ChatBubble = ({
  text,
  partner = false,
  sent = true,
  time,
  id,
  readStatus,
  partnerId
}: IProps) => {
  let authToken = Cookies.get("authToken") || "";
  let inputDate;

  if (time) {
    inputDate = new Date(time);
  }

  const socket = useSelector((state: RootState) => state.socket.socket);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false // Use 24-hour format
  }).format(inputDate);

  const ReadMessage = async () => {
    if (!readStatus && id && partner) {
      console.log("txt read");
      try {
        const response = await axios.post(
          "/api/chat/read-message",
          {
            messageId: id
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );
        const ResponseMessage = response.data.message;
        socket?.emit("read-message", {
          userId: partnerId,
          messageId: ResponseMessage._id
        });

        await ReadDBMessage(ResponseMessage._id);
      } catch (e) {}
    }
  };

  useEffect(() => {
    ReadMessage();
  });

  return (
    <Main>
      <Body partner={partner} sent={sent}>
        <Text>{text}</Text>
        <Bottom>
          <Time>{time && formattedTime}</Time>
          {!partner && sent && readStatus ? (
            <CheckIcon>
              <CheckDouble size={15} />
            </CheckIcon>
          ) : !partner && sent ? (
            <CheckIcon>
              <Check size={15} />
            </CheckIcon>
          ) : null}
          {!sent && <Loading size={15} />}
        </Bottom>
      </Body>
    </Main>
  );
};

export default ChatBubble;

const Main = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;
interface BodyProp {
  partner: boolean;
  sent: boolean;
}
const Body = styled.div<BodyProp>`
  cursor: pointer;
  background-color: ${(props) =>
    props.partner ? props.theme.colors.slate : props.theme.colors.primary};
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
  overflow-wrap: break-word;
  max-width: 40%;
  opacity: ${(props) => (props.sent ? "1" : "0.5")};
`;

const Text = styled.h2`
  font-size: 1.4rem;
  font-weight: 500;
  min-width: 20%;
  overflow-wrap: break-word;
`;

const Bottom = styled.div`
  margin-left: 0.8rem;
  display: flex;
  align-items: center;
`;

const Time = styled.h3`
  font-size: 0.9rem;
  font-weight: 300;
`;

const CheckIcon = styled.div`
  margin-left: 0.1rem;
`;
