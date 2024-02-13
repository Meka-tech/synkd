import Loading from "@/components/loading";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import ChatLayout from "@/components/chat/layout";
import { IUserType } from "@/types/userType";
import { MessageDb } from "@/dexieDb/MessageLocalDb";
import {
  updateNotifications,
  updateUser
} from "@/Redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLiveQuery } from "dexie-react-hooks";
import { ImsgType } from "@/types/messageType";
import { RootState } from "@/Redux/app/store";
import { getMostRecentReceivedMessageForUser } from "@/utils/indexedDb_Functions/GetRecentMessage";
import { updateFriends } from "@/Redux/features/friends/friendsSlice";

export default function Preloaded() {
  const { data: sessionData, status } = useSession();

  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  const notifications = useSelector(
    (state: RootState) => state.user.notifications
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const session = sessionData as any;

  let authToken = Cookies.get("authToken") || "";

  const GetUser = async (token: string | null) => {
    try {
      if (token) {
        const data = await axios.get("/api/user/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let resUser = data.data.user;
        let resFriends = data.data.friends;

        dispatch(updateUser(resUser));
        dispatch(updateFriends(resFriends));
        await GetUserMessages(token);
        await GetNotifications(token);

        if (resUser.interests.music.length < 1) {
          router.push("/sync/interests");
        }
      }
    } catch (e) {
      router.push("/auth/sign-in");
    }
  };

  const GetNotifications = async (token: string | null) => {
    const data = await axios.get("/api/user/notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const notification = data.data.notifications;
    dispatch(updateNotifications(notification));
  };

  const GetUserMessages = async (token: string | null) => {
    const localMessages = await MessageDb.messages.toArray();
    try {
      if (token) {
        const data = await axios.get("/api/chat/get-user-messages", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const UserMessages = data.data.messages;
        await AddToLocalDb(UserMessages);
        router.push("/");

        // if (localMessages?.length > 0) {
        //   let recentMessage: ImsgType | any;

        //   recentMessage = await getMostRecentReceivedMessageForUser(user?._id);

        //   if (recentMessage) {
        //     const response = await axios.post(
        //       "/api/chat/get-received-messages",
        //       {
        //         updatedAt: recentMessage.updatedAt
        //       },
        //       {
        //         headers: {
        //           Authorization: `Bearer ${authToken}`
        //         }
        //       }
        //     );
        //     const messages = response.data.messages;

        //     if (messages.length > 1) {
        //       await MessageDb.messages.bulkPut(messages);
        //     }
        //     if (messages.length === 1) {
        //       await MessageDb.messages.put(messages[0]);
        //     }
        //   }

        //   router.push("/");
        // }
      }
    } catch (e) {}
  };

  const AddToLocalDb = async (data: []) => {
    try {
      await MessageDb.open();
      await MessageDb.messages.clear();
      await MessageDb.messages.bulkPut(data);
    } catch (e) {
      console.log(e);
    }
  };

  const IsAuthenticated = () => {
    if (status === "authenticated" && authToken === "") {
      let token;
      if (session?.accessToken) {
        token = session?.accessToken;
        Cookies.set("authToken", token);
        GetUser(token);
      }
    }
    if (authToken) {
      GetUser(authToken);
    }
  };

  useEffect(() => {
    if (authToken === "") {
      router.push("/auth/sign-in");
    }
    IsAuthenticated();
  }, []);

  return (
    <Main>
      <Body>
        <WelcomeText>Synking , Please wait...</WelcomeText>
        <LoadingIcon>
          <Loading size={70} />
        </LoadingIcon>
      </Body>
    </Main>
  );
}
const Main = styled.div`
  width: 100dvw;
  height: 100dvh;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Body = styled.div``;
const WelcomeText = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  @media screen and (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const LoadingIcon = styled.div`
  color: ${(props) => props.theme.colors.primary};
`;
