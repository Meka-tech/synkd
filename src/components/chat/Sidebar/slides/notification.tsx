import styled from "@emotion/styled";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ReceivedFriendRequest } from "../components/friendRequest";
import { IUserType } from "@/types/userType";

const Notification = () => {
  let token = Cookies.get("authToken") || "";
  const [notifications, setNotifications] = useState<
    | [
        {
          user: IUserType;
          _id: string;
          matchCategory: string;
          percent: string;
          notificationType: string;
        }
      ]
    | null
  >(null);
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
    <Main>
      <Title>Notifications</Title>
      <Body>
        {notifications?.map((item) => {
          if (item.notificationType === "receivedRequest") {
            return (
              <ReceivedFriendRequest
                user={item.user}
                key={item._id}
                matchCategory={item.matchCategory}
                percent={item.percent}
              />
            );
          } else {
            return;
          }
        })}
      </Body>
    </Main>
  );
};

export default Notification;

const Main = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem;
`;
const Title = styled.h2`
  font-size: 2.5rem;
  margin-left: 1rem;
  margin-top: 1rem;
`;
const Body = styled.div`
  margin-top: 1rem;
`;
