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
import { ReadDBMessage } from "@/utils/indexedDb_Functions/readDBMessage";
import { getOldestUnreadMessage } from "@/utils/indexedDb_Functions/getOldestUnreadMessage";

import { useRouter } from "next/router";
import {
  updateFriend,
  updateFriends
} from "@/Redux/features/friends/friendsSlice";
import {
  updateNotifications,
  updateUser
} from "@/Redux/features/user/userSlice";
import { useSocket } from "@/context/SocketContext";
import { updateLaunch } from "@/Redux/features/openChat/openChatSlice";

export default function Home() {
  let authToken = Cookies.get("authToken") || "";
  const router = useRouter();
  const socket = useSocket();

  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );
  const isMobile =
    /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
      navigator.userAgent
    );

  const dispatch = useDispatch();

  useEffect(() => {
    UpdateUser();
    GetUserMessages();

    if (authToken === "") {
      router.push("/auth/sign-in");
    }
    if (isMobile) {
      dispatch(updateLaunch(false));
    } else {
      dispatch(updateLaunch(true));
    }
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      if (user?._id) {
        socket.emit("user-online", user?._id);
      }
    });
    socket?.on("get-message", async (message) => {
      let existingMessage = await MessageDb.messages.get({
        _id: message._id
      });
      if (!existingMessage) {
        await MessageDb.messages.put(message);
      }
    });

    socket?.on("message-was-read", async (messageId) => {
      await ReadDBMessage(messageId);
    });

    socket?.on("update-profile", async (id) => {
      await UpdateFriendProfile(id);
    });

    socket?.on("receive-notification", async (id) => {
      await GetNotifications();
    });

    socket?.on("request-accepted", async (id) => {
      await UpdateUser();
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

  const GetNotifications = async () => {
    const data = await axios.get("/api/user/notifications", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    const notification = data.data.notifications;
    dispatch(updateNotifications(notification));
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
        // await GetUserMessages();
      }
    } catch (e) {
      router.push("/auth/sign-in");
    }
  }, []);

  // const GetUserMessages = useCallback(async () => {
  //   try {
  //     let recentMessage: ImsgType | any;
  //     recentMessage = await getOldestUnreadMessage(user?._id);
  //     if (recentMessage) {
  //       const response = await axios.post(
  //         "/api/chat/get-received-messages",
  //         {
  //           updatedAt: recentMessage.updatedAt
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${authToken}`
  //           }
  //         }
  //       );
  //       const messages: ImsgType[] = response.data.messages;

  //       for (const message of messages) {
  //         let existingMessage = await MessageDb.messages.get({
  //           _id: message._id
  //         });

  //         if (existingMessage) {
  //           existingMessage = message;
  //           MessageDb.messages.put(existingMessage);
  //         } else {
  //           MessageDb.messages.put(message);
  //         }
  //       }
  //     }
  //   } catch (err) {}
  // }, []);

  const GetUserMessages = async () => {
    const localMessages = await MessageDb.messages.toArray();
    try {
      if (authToken) {
        const data = await axios.get("/api/chat/get-user-messages", {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        const UserMessages = data.data.messages;
        await AddToLocalDb(UserMessages);
        router.push("/");
      }
    } catch (e) {}
  };

  const AddToLocalDb = async (data: []) => {
    try {
      await MessageDb.open();
      // await MessageDb.messages.clear();
      await MessageDb.messages.bulkPut(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      UpdateUser();
      GetUserMessages();
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
    GetUserMessages();
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
