import styled from "@emotion/styled";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ReceivedFriendRequest } from "../components/friendRequest";
import { Bell } from "@emotion-icons/boxicons-solid";
import { IUserType } from "@/types/userType";
import Loading from "@/components/loading";
import { BackDiv, Body, HeaderDiv, Main, Title, TopBar } from "./styles";
import { ArrowIosBack } from "@emotion-icons/evaicons-solid";

interface INotif {
  close: Function;
}
const Notification = ({ close }: INotif) => {
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
    | []
  >([]);

  const [getNotif, setGetNotif] = useState(false);
  const GetNotifications = async () => {
    setGetNotif(true);
    const data = await axios.get("/api/user/get-notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setGetNotif(false);
    setNotifications(data.data.notifications);
  };

  useEffect(() => {
    GetNotifications();
  }, []);

  return (
    <Main>
      <TopBar>
        <HeaderDiv>
          <BackDiv onClick={() => close()}>
            <ArrowIosBack size={30} />
          </BackDiv>
          <Title>Notifications</Title>
        </HeaderDiv>
      </TopBar>

      {getNotif && <Loading size={30} />}
      {!getNotif && notifications?.length === 0 && (
        <NoNotifications>
          <Icon>
            <Bell size={200} />
          </Icon>
          <NoText>You have no notifications.</NoText>
        </NoNotifications>
      )}

      <Body>
        {notifications?.map((item) => {
          if (item.notificationType === "receivedRequest") {
            return (
              <ReceivedFriendRequest
                user={item.user}
                key={item._id}
                matchCategory={item.matchCategory}
                percent={item.percent}
                refresh={GetNotifications}
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

const NoNotifications = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 2rem;
  height: 80%;
`;
const Icon = styled.div`
  color: ${(props) => props.theme.bgColors.primaryFade};
`;

const NoText = styled.h2`
  margin-top: 1rem;
  font-size: 2rem;
`;
