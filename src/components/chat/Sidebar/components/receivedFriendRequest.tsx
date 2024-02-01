import { updateFriends } from "@/Redux/features/friends/friendsSlice";
import Loading from "@/components/loading";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import axios from "axios";
import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DotsVerticalRounded } from "@emotion-icons/boxicons-regular";
import ShortenText from "@/utils/ShortenText";
import useClickOutside from "@/hooks/useClickOutside";

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
      await UpdateUser();
      refresh();
    } catch (err) {
      console.log(err);
    }
    setLoadAccept(false);
  };

  const RejectRequest = async () => {
    setLoadReject(true);
    try {
      const data = await axios.put(
        "/api/user/notification/reject-request",
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

    setLoadReject(false);
  };

  const BodyRef = useRef(null);

  useClickOutside(BodyRef, () => {
    setSeeMore(false);
  });
  return (
    <Main show={seeMore} ref={BodyRef}>
      <Body>
        <ProfileDiv>
          <ProfileImage />
          <NameText>
            <b>{ShortenText(user.username, 12)}</b> wants to synk with you
          </NameText>
        </ProfileDiv>
        <DecisionDiv>
          <AcceptDiv onClick={AcceptRequest}>
            {loadAccept ? <Loading /> : "accept"}
          </AcceptDiv>
          <RejectDiv onClick={RejectRequest}>
            {loadReject ? <Loading /> : "reject"}
          </RejectDiv>
          <DotsVerticalRounded
            cursor={"pointer"}
            size={20}
            onClick={() => setSeeMore(!seeMore)}
          />
        </DecisionDiv>
      </Body>
      <SeeMoreDiv>
        <MoreText>
          <span>{user.username}</span>
          <h2>
            You matched in <span>{matchCategory}</span> by{" "}
            <span>{percent}%</span>
          </h2>
        </MoreText>
      </SeeMoreDiv>
    </Main>
  );
};

const Main = styled.div<{ show: boolean }>`
  width: 100%;
  padding: 1.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: ${(props) => (props.show ? "fit-content" : "6rem")};
  transition: all ease-in 0.1s;
  margin-bottom: 1rem;
  @media screen and (max-width: 480px) {
    padding: 1rem 0.5rem;
    height: ${(props) => (props.show ? "fit-content" : "4rem")};
  }
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
  margin-right: 1rem;
  @media screen and (max-width: 480px) {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
  }
`;
const NameText = styled.h2`
  font-size: 1.4rem;
  b {
    font-size: 1.4rem;
    color: ${(props) => props.theme.colors.primary};
  }
  @media screen and (max-width: 480px) {
    font-size: 1rem;
    b {
      font-size: 1rem;
    }
  }
`;

const DecisionDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AcceptDiv = styled.div`
  cursor: pointer;
  background-color: ${(props) => props.theme.bgColors.primaryFade};
  color: ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  font-size: 1.4rem;
  width: fit-content;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: 500;
  @media screen and (max-width: 480px) {
    font-size: 1rem;
    padding: 0.2rem 0.8rem;
    margin-right: 0.5rem;
  }
`;
const RejectDiv = styled(AcceptDiv)`
  background-color: ${(props) => props.theme.bgColors.dangerFade};
  color: ${(props) => props.theme.colors.danger};
`;

const SeeMoreDiv = styled.div`
  width: 100%;
  height: fit-content;
  margin-top: 1.5rem;
  @media screen and (max-width: 480px) {
    margin-top: 1rem;
  }
`;

const MoreText = styled.div`
  text-align: center;
  h2 {
    font-size: 1.5rem;
    font-weight: 400;
  }
  span {
    color: ${(props) => props.theme.colors.primary};
    font-size: 1.5rem;
    font-weight: 800;
    text-transform: capitalize;
  }
  @media screen and (max-width: 480px) {
    h2 {
      font-size: 1rem;
    }
    span {
      font-size: 1rem;
    }
  }
`;
