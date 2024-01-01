import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";

interface IProps {
  user: IUserType;
  percent: string;
  matchCategory: string;
}
export const ReceivedFriendRequest = ({
  user,
  percent,
  matchCategory
}: IProps) => {
  return (
    <Main>
      <ProfileDiv>
        <ProfileImage />
        <NameText>
          <b>{user.username}</b> wants to sync with you
        </NameText>
      </ProfileDiv>
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
  width: 50%;
`;
const ProfileImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: white;
  margin-right: 1rem;
`;
const NameText = styled.h2`
  font-size: 1.2rem;
  b {
    font-size: 1.2rem;
    color: ${(props) => props.theme.colors.primary};
  }
`;
