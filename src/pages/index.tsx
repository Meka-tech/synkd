import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import ChatLayout from "@/components/chat/layout";
import { IUserType } from "@/types/userType";

export default function Home() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

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
        setUser(res);
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
      <ChatLayout user={user} />
    </Body>
  );
}

const Body = styled.div``;
