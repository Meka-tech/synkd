import Head from "next/head";
import Image from "next/image";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  let authToken = Cookies.get("authToken") || "";
  const [user, setUser] = useState({});

  const GetUser = async (token: string | null) => {
    try {
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
    } catch (e) {
      router.push("/auth/sign-in");
    }
  };

  GetUser(authToken);
  return <Body></Body>;
}

const Body = styled.div``;
