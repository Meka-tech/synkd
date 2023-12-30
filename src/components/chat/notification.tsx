import styled from "@emotion/styled";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Notification = () => {
  let token = Cookies.get("authToken") || "";
  const [notifications, setNotifications] = useState();
  const GetNotifications = async () => {
    const data = await axios.get("/api/user/get-notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setNotifications(data.data.notifications);
  };

  useEffect(() => {
    GetNotifications();
  }, []);

  return (
    <Body>
      <Title>Notifications</Title>
    </Body>
  );
};

export default Notification;

const Body = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem;
`;
const Title = styled.h2`
  font-size: 2.5rem;
  margin-left: 1rem;
  margin-top: 1rem;
`;
