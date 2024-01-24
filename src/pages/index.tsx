import styled from "@emotion/styled";
import ChatLayout from "@/components/chat/layout";
import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { ImsgType } from "@/types/messageType";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { IUserType } from "@/types/userType";
import { RootState } from "@/Redux/app/store";
import { useDispatch, useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { ReadDBMessage } from "@/utils/indexedDb_Functions/readDBMessage";
import { getOldestUnreadMessage } from "@/utils/indexedDb_Functions/getOldestUnreadMessage";
import { updateSocket } from "@/Redux/features/socket/socketSlice";
import { useRouter } from "next/router";
import {
  updateFriend,
  updateFriends
} from "@/Redux/features/friends/friendsSlice";
import { updateUser } from "@/Redux/features/user/userSlice";
import { useSocket } from "@/context/SocketContext";

// let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Home() {
  let authToken = Cookies.get("authToken") || "";
  const prod = process.env.NODE_ENV == "production";
  const router = useRouter();
  const socket = useSocket();

  // console.log(socket);

  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  console.log(user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authToken === "") {
      router.push("/auth/sign-in");
    }

    // socketInitializer();
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connect");
      if (user?._id) {
        socket.emit("user-online", user?._id);
      }
    });
    socket?.on("get-message", async (message) => {
      await MessageDb.messages.add(message);
    });

    socket?.on("message-was-read", async (messageId) => {
      await ReadDBMessage(messageId);
    });

    socket?.on("update-profile", async (id) => {
      await UpdateFriendProfile(id);
    });
  }, [socket]);

  const UpdateFriendProfile = async (id: string) => {
    try {
      const res = await axios.get(`/api/friends/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const friend = res.data.data;

      dispatch(updateFriend(friend));
    } catch (e) {}
  };

  const socketInitializer = async (): Promise<void> => {
    // const res = await fetch("/api/socket");

    // if (prod) {
    //   socket = io(undefined as any, { path: "/api/socket" });
    // } else {
    //   socket = io();
    // }

    // dispatch(updateSocket(socket));

    socket?.on("connect", () => {
      console.log("connected");
      if (user?._id) {
        socket.emit("user-online", user?._id);
      }
    });

    socket?.on("get-message", async (message) => {
      await MessageDb.messages.add(message);
    });

    socket?.on("message-was-read", async (messageId) => {
      await ReadDBMessage(messageId);
    });

    socket?.on("update-profile", async (id) => {
      await UpdateFriendProfile(id);
    });
    socket?.on("disconnect", () => {
      console.log("Disconnected");
    });
  };
  const UpdateUser = useCallback(async () => {
    try {
      if (authToken) {
        const data = await axios.get("/api/friends/all", {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        let resFriends = data.data.friends;

        dispatch(updateFriends(resFriends));
        await GetUserMessages();
      }
    } catch (e) {
      router.push("/auth/sign-in");
    }
  }, []);

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
      UpdateUser();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  if (document.hidden) {
    UpdateUser();
  }
  return (
    <Body>
      <ChatLayout />
    </Body>
  );
}

const Body = styled.div`
  position: relative;
`;
