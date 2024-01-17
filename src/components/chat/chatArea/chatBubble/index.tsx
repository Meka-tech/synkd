import styled from "@emotion/styled";
import Loading from "../../../loading";
import { useCallback, useEffect, useState } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import io, { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import { MessageDb } from "@/dexieDb/MessageLocalDb";
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
  userSndNxtMsg: boolean;
}

const ChatBubble = ({
  text,
  partner = false,
  sent = true,
  time,
  id,
  readStatus,
  partnerId,
  userSndNxtMsg = false
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

  const ReadMessage = useCallback(async () => {
    if (!readStatus && id && partner) {
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
  }, []);

  useEffect(() => {
    ReadMessage();
  });

  return (
    <Main>
      <Body partner={partner} sent={sent} userSndNxtMsg={userSndNxtMsg}>
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
  userSndNxtMsg: boolean;
}
const Body = styled.div<BodyProp>`
  cursor: pointer;
  background-color: ${(props) =>
    props.partner ? props.theme.colors.slate : props.theme.colors.primary};
  height: fit-content;
  width: fit-content;
  color: ${(props) => props.theme.colors.snow};
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: ${(props) =>
    props.userSndNxtMsg ? "15px" : props.partner ? "" : "15px"};
  border-bottom-right-radius: ${(props) =>
    props.userSndNxtMsg ? "15px" : props.partner ? "15px" : ""};
  padding: 0.5rem 1rem;
  display: flex;
  align-items: end;
  margin-left: ${(props) => (props.partner ? "" : "auto")};
  overflow-wrap: break-word;
  max-width: 60%;
  opacity: ${(props) => (props.sent ? "1" : "0.5")};
  @media screen and (max-width: 480px) {
    max-width: 70%;
  }
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
