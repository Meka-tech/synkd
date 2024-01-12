import styled from "@emotion/styled";
import ChatLayout from "@/components/chat/layout";
import { MessageDb } from "@/MessageLocalDb";
import { ImsgType } from "@/types/messageType";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { IUserType } from "@/types/userType";
import { RootState } from "@/Redux/app/store";
import { useDispatch, useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { ReadDBMessage } from "@/utils/indexedDb_Functions/readDBMessage";
import { getOldestUnreadMessage } from "@/utils/indexedDb_Functions/getOldestUnreadMessage";
import { updateSocket } from "@/Redux/features/socket/socketSlice";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Home() {
  let authToken = Cookies.get("authToken") || "";

  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async (): Promise<void> => {
    await fetch("/api/socket", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Adjust based on your needs
      }
    });
    socket = io("https://synkd.netlify.app");

    dispatch(updateSocket(socket));

    socket.on("connect", () => {
      if (user?._id) {
        socket.emit("user-online", user?._id);
      }
    });

    socket.on("get-message", async (message) => {
      await MessageDb.messages.add(message);
    });

    socket.on("message-was-read", async (messageId) => {
      await ReadDBMessage(messageId);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  };

  useEffect(() => {
    GetUserMessages();
  });

  const GetUserMessages = useCallback(async () => {
    try {
      let recentMessage: ImsgType | any;
      recentMessage = await getOldestUnreadMessage(user?._id);
      if (recentMessage) {
        const response = await axios.post(
          "/api/chat/get-received-messages",
          {
            updatedAt: recentMessage.updatedAt
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );
        const messages: ImsgType[] = response.data.messages;

        for (const message of messages) {
          let existingMessage = await MessageDb.messages.get({
            _id: message._id
          });

          if (existingMessage) {
            existingMessage = message;
            MessageDb.messages.put(existingMessage);
          } else {
            MessageDb.messages.put(message);
          }
        }
      }
    } catch (err) {}
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      GetUserMessages();
    }
  }, [GetUserMessages]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange, GetUserMessages]);

  return (
    <Body>
      <ChatLayout />
    </Body>
  );
}

const Body = styled.div`
  position: relative;
`;
