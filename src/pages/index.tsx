import styled from "@emotion/styled";
import ChatLayout from "@/components/chat/layout";
import { MessageDb } from "@/MessageLocalDb";
import { ImsgType } from "@/types/messageType";
import axios from "axios";
import { getMostRecentReceivedMessageForUser } from "@/utils/GetRecentMessage";
import { useEffect } from "react";
import { IUserType } from "@/types/userType";
import { RootState } from "@/Redux/app/store";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { DefaultEventsMap } from "@socket.io/component-emitter";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Home() {
  let authToken = Cookies.get("authToken") || "";
  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async (): Promise<void> => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      if (user?._id) {
        socket.emit("user-online", user?._id);
      }
    });

    socket.on("get-message", (message) => {
      console.log(message);
      GetRecievedMessages();
    });
    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  };

  const GetRecievedMessages = async () => {
    try {
      let recentMessage: ImsgType | any;
      recentMessage = await getMostRecentReceivedMessageForUser(user?._id);
      const response = await axios.post(
        "/api/chat/get-received-messages",
        {
          createdAt: recentMessage.createdAt
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      const messages = response.data.messages;

      if (messages.length > 1) {
        await MessageDb.messages.bulkAdd(messages);
      } else if (messages.length === 1) {
        await MessageDb.messages.add(messages[0]);
      }
    } catch (err) {}
  };

  return (
    <Body>
      <ChatLayout />
    </Body>
  );
}

const Body = styled.div``;
