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
  const dispatch = useDispatch();

  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  const isMobile =
    /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
      navigator.userAgent
    );

  const handleGetMessage = useCallback(async (message: ImsgType) => {
    try {
      let existingMessage = await MessageDb.messages.get({ _id: message._id });
      if (!existingMessage) {
        await MessageDb.messages.put(message);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }, []);

  const handleMessageWasRead = useCallback(async (messageId: string) => {
    try {
      await ReadDBMessage(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  }, []);

  const handleUpdateProfile = useCallback(async (id: string) => {
    try {
      await UpdateFriendProfile(id);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, []);

  const handleReceiveNotification = useCallback(async () => {
    try {
      await GetNotifications();
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  const handleRequestAccepted = useCallback(async () => {
    try {
      await UpdateUser();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }, []);

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
      }
    } catch (e) {
      router.push("/auth/sign-in");
    }
  }, []);

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
    if (!socket) return;

    // Connect user if online
    socket.on("connect", () => {
      if (user?._id) {
        socket.emit("user-online", user._id);
      }
    });

    // Set up listeners
    socket.on("get-message", handleGetMessage);
    socket.on("message-was-read", handleMessageWasRead);
    socket.on("update-profile", handleUpdateProfile);
    socket.on("receive-notification", handleReceiveNotification);
    socket.on("request-accepted", handleRequestAccepted);

    // Cleanup listeners on unmount or socket change
    return () => {
      socket.off("get-message", handleGetMessage);
      socket.off("message-was-read", handleMessageWasRead);
      socket.off("update-profile", handleUpdateProfile);
      socket.off("receive-notification", handleReceiveNotification);
      socket.off("request-accepted", handleRequestAccepted);
    };
  }, [
    socket,
    user?._id,
    handleGetMessage,
    handleMessageWasRead,
    handleUpdateProfile,
    handleReceiveNotification,
    handleRequestAccepted
  ]);

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
