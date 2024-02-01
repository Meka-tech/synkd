import { updateFriends } from "@/Redux/features/friends/friendsSlice";
import Loading from "@/components/loading";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DotsVerticalRounded } from "@emotion-icons/boxicons-regular";

interface IProps {
  user: IUserType;
  percent: string;
  matchCategory: string;
  refresh: Function;
}
export const SentFriendRequest = ({
  user,
  percent,
  matchCategory,
  refresh
}: IProps) => {
  let token = Cookies.get("authToken") || "";
  const [loadAccept, setLoadAccept] = useState(false);
  const [seeMore, setSeeMore] = useState(false);
  const dispatch = useDispatch();

  const UpdateUser = async () => {
    try {
      const data = await axios.get("/api/friends/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let resFriends = data.data.friends;

      dispatch(updateFriends(resFriends));
    } catch (e) {}
  };

  const UnsendRequest = async () => {
    setLoadAccept(true);
    try {
      const data = await axios.post(
        "/api/user/notification/unsend-request",
        { requestId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await UpdateUser();
      refresh();
    } catch (err) {
      console.log(err);
    }
    setLoadAccept(false);
  };

  return (
    <Main>
      <Body>
        <ProfileDiv>
          <ProfileImage />
          <NameText>
            You requested to synk with <b>{user.username}</b>
          </NameText>
        </ProfileDiv>
        <DecisionDiv>
          <UnsendDiv onClick={UnsendRequest}>
            {loadAccept ? <Loading /> : "undo"}
          </UnsendDiv>
        </DecisionDiv>
      </Body>
    </Main>
  );
};

const Main = styled.div`
  width: 100%;
  padding: 1.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: fit-content;
  margin-bottom: 1rem;
`;

const Body = styled.div`
  width: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ProfileDiv = styled.div`
  display: flex;
  align-items: center;

  cursor: pointer;
`;
const ProfileImage = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: white;
  margin-right: 1.2rem;
`;
const NameText = styled.h2`
  font-size: 1.4rem;
  b {
    font-size: 1.4rem;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const DecisionDiv = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

const UnsendDiv = styled.div`
  cursor: pointer;
  background-color: ${(props) => props.theme.bgColors.amberFade};
  color: ${(props) => props.theme.colors.amber};
  border-radius: 8px;
  font-size: 1.2rem;
  width: 6rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const MoreDiv = styled.div`
  width: 100%;
`;
