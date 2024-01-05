import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import ChatLayout from "@/components/chat/layout";
import { IUserType } from "@/types/userType";
import { MessageDb } from "@/MessageLocalDb";
import { updateUser } from "@/Redux/features/user/userSlice";
import { useDispatch } from "react-redux";

export default function Home() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const session = sessionData as any;

  let authToken = Cookies.get("authToken") || "";
  const [user, setUser] = useState<IUserType>({
    email: "",
    password: "",
    username: "",
    location: [],
    serachPreferences: "",
    interests: {
      music: []
    },
    _id: ""
  });

  const GetUser = async (token: string | null) => {
    try {
      if (token) {
        const data = await axios.get("/api/user/get-user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let res = data.data.user;
        dispatch(updateUser(res));
        setUser(res);
        await GetUserMessages(token);
        if (res.interests.music.length < 1) {
          router.push("/sync/interests");
        }
        return true;
      }
      return false;
    } catch (e) {
      router.push("/auth/sign-in");
    }
  };

  const GetUserMessages = async (token: string | null) => {
    try {
      if (token) {
        const data = await axios.get("/api/chat/get-user-messages", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const UserMessages = data.data.messages;
        await AddToLocalDb(UserMessages);
      }
    } catch (e) {}
  };

  const AddToLocalDb = async (data: []) => {
    try {
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
    IsAuthenticated();
  }, []);

  return (
    <Body>
      <ChatLayout />
    </Body>
  );
}

const Body = styled.div``;
