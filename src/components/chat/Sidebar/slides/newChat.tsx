import styled from "@emotion/styled";
import { IUserType } from "@/types/userType";
import { ArrowBack } from "@emotion-icons/boxicons-regular";
import { BackDiv, Body, HeaderDiv, Main, Title, TopBar } from "./styles";
import { RootState } from "@/Redux/app/store";
import { useSelector } from "react-redux";
import FriendBox from "../components/friendBox";
import Link from "next/link";
import { ArrowIosBack } from "@emotion-icons/evaicons-solid";

interface INewChat {
  close: Function;
}
const NewChat = ({ close }: INewChat) => {
  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  const Friends: IUserType[] | [] = useSelector(
    (state: RootState) => state.friends.friends
  );

  // const FriendsList: [] = [];

  // console.log(Friends);

  const FriendsList = Friends.slice().sort((a, b) =>
    a.username.localeCompare(b.username)
  );
  return (
    <Main>
      <TopBar>
        <HeaderDiv>
          <BackDiv onClick={() => close()}>
            <ArrowIosBack size={30} />
          </BackDiv>
          <Title>New Chat</Title>
        </HeaderDiv>
      </TopBar>

      <Body>
        {FriendsList?.map((item, i) => {
          return <FriendBox user={item} key={i} close={close} />;
        })}
        <NewFriendDiv>
          <NewFriendText> SYNK WITH MORE USERS</NewFriendText>
          <Link href={"/sync/match"}>
            {" "}
            <SyncButton>Synk</SyncButton>
          </Link>
        </NewFriendDiv>
      </Body>
    </Main>
  );
};

export default NewChat;

const NewFriendDiv = styled.div`
  margin-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const NewFriendText = styled.h3`
  font-size: 1.4rem;
`;

const SyncButton = styled.div`
  margin-top: 1rem;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 800;
  transition: all ease-in 0.2s;
  :hover {
    transform: scale(1.05);
  }
`;
