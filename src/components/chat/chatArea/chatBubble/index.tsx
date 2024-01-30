import styled from "@emotion/styled";
import Loading from "../../../loading";
import { useCallback, useEffect, useState } from "react";

import Cookies from "js-cookie";
import axios from "axios";
import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { ReadDBMessage } from "@/utils/indexedDb_Functions/readDBMessage";
import {
  Check,
  CheckDouble,
  DotsHorizontalRounded
} from "@emotion-icons/boxicons-regular";
import { Circle, CheckCircle } from "@emotion-icons/boxicons-solid";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/app/store";
import { TypingLottie } from "../../../../../animation/typingLottie";
import { useSocket } from "@/context/SocketContext";

interface IProps {
  text: string;
  partner?: boolean;
  time?: Date;
  sent?: boolean;
  readStatus?: boolean;
  id?: string;
  partnerId?: string;
  userSndNxtMsg: boolean;
  isTyping?: boolean;
}

const ChatBubble = ({
  text,
  partner = false,
  sent = true,
  time,
  id,
  readStatus,
  partnerId,
  userSndNxtMsg = false,
  isTyping = false
}: IProps) => {
  let authToken = Cookies.get("authToken") || "";
  let inputDate;

  if (time) {
    inputDate = new Date(time);
  }

  const socket = useSocket();
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
  }, []);

  return (
    <Main>
      <Bubble partner={partner} sent={sent} userSndNxtMsg={userSndNxtMsg}>
        <Body partner={partner} sent={sent} userSndNxtMsg={userSndNxtMsg}>
          {!isTyping ? <Text>{text}</Text> : <TypingLottie />}

          <Bottom>
            <Time>{time && formattedTime}</Time>
            {!partner && sent && readStatus ? (
              <CheckIcon>
                <CheckCircle size={14} />
              </CheckIcon>
            ) : !partner && sent ? (
              <CheckIcon>
                <Circle size={14} />
              </CheckIcon>
            ) : null}
            {!sent && <Loading size={15} />}
          </Bottom>
        </Body>
        {!userSndNxtMsg && <BubbleArrow partner={partner} />}
      </Bubble>
    </Main>
  );
};

export default ChatBubble;

const Main = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  overflow: hidden;
  padding: 0 1rem;
`;
interface BodyProp {
  partner: boolean;
  sent?: boolean;
  userSndNxtMsg?: boolean;
}
const Bubble = styled.div<BodyProp>`
  cursor: pointer;
  position: relative;
  width: fit-content;
  height: fit-content;
  max-width: 80%;
  opacity: ${(props) => (props.sent ? "1" : "0.5")};
  margin-left: ${(props) => (props.partner ? "" : "auto")};
  overflow-wrap: break-word;
  @media screen and (max-width: 480px) {
    max-width: 80%;
  }
`;
const Body = styled.div<BodyProp>`
  background-color: ${(props) =>
    props.partner ? props.theme.colors.slate : props.theme.colors.primary};
  height: fit-content;
  width: fit-content;
  position: relative;
  color: ${(props) => props.theme.colors.snow};
  border-radius: 15px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: end;
  overflow-wrap: break-word;
`;
const BubbleArrow = styled.div<BodyProp>`
  position: absolute;
  width: 0;
  right: ${(props) => !props.partner && "-2px"};
  bottom: ${(props) => (props.partner ? "35px" : "35px")};
  left: ${(props) => (props.partner ? "-13px" : "auto")};
  height: 0;
  ::after {
    content: "";
    position: absolute;
    border: 0 solid transparent;
    border-top: 9px solid
      ${(props) =>
        props.partner ? props.theme.colors.slate : props.theme.colors.primary};
    border-radius: 0 20px 0;
    width: 15px;
    height: 30px;
    transform: ${(props) =>
      props.partner ? "rotate(145deg)" : " rotate(45deg) scaleY(-1)"};
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
  font-size: 1rem;
  font-weight: 300;
`;

const CheckIcon = styled.div`
  margin-left: 0.2rem;
`;
