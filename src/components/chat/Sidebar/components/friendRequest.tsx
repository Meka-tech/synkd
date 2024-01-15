import Loading from "@/components/loading";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

interface IProps {
  user: IUserType;
  percent: string;
  matchCategory: string;
  refresh: Function;
}
export const ReceivedFriendRequest = ({
  user,
  percent,
  matchCategory,
  refresh
}: IProps) => {
  let token = Cookies.get("authToken") || "";
  const [loadAccept, setLoadAccept] = useState(false);
  const [loadReject, setLoadReject] = useState(false);

  const AcceptRequest = async () => {
    setLoadAccept(true);
    try {
      const data = await axios.put(
        "/api/user/notification/accept-request",
        { requestId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      refresh();
    } catch (err) {
      console.log(err);
    }
    setLoadAccept(false);
  };
  return (
    <Main>
      <ProfileDiv>
        <ProfileImage />
        <NameText>
          <b>{user.username}</b> wants to sync with you
        </NameText>
      </ProfileDiv>
      <DecisionDiv>
        <AcceptDiv onClick={AcceptRequest}>
          {loadAccept ? <Loading /> : "accept"}
        </AcceptDiv>
        <RejectDiv>{loadReject ? <Loading /> : "reject"}</RejectDiv>
      </DecisionDiv>
    </Main>
  );
};

const Main = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ProfileDiv = styled.div`
  display: flex;
  align-items: center;
  width: 60%;
  cursor: pointer;
`;
const ProfileImage = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: white;
  margin-right: 0.5rem;
`;
const NameText = styled.h2`
  font-size: 1.2rem;
  b {
    font-size: 1.2rem;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const DecisionDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 35%;
`;

const AcceptDiv = styled.div`
  cursor: pointer;
  background-color: ${(props) => props.theme.bgColors.primaryFade};
  color: ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  font-size: 1.2rem;
  width: 6rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const RejectDiv = styled(AcceptDiv)`
  background-color: ${(props) => props.theme.bgColors.dangerFade};
  color: ${(props) => props.theme.colors.danger};
`;
