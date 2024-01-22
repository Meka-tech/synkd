import { RootState } from "@/Redux/app/store";
import { getActiveChatPartner } from "@/Redux/features/friends/friendsSlice";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChatProfile = () => {
  const [Partner, setPartner] = useState<IUserType>();
  const chatPartner = useSelector((state: RootState) =>
    getActiveChatPartner(state)
  );

  useEffect(() => {
    setPartner(chatPartner);
  }, [chatPartner]);
  return (
    <Main>
      <ProfileImage />
      <Name>{Partner?.username}</Name>
      <Email>
        <h2>Email</h2>
        <h3>{Partner?.email}</h3>
      </Email>
      <Bio>
        <h2>Bio</h2>
        <h3>{Partner?.bio}</h3>
      </Bio>
      <Buttons>
        {/* <PrimaryButton text={`Block ${chatPartner?.username}`} danger={true} /> */}
        <BlockButton>{`Block ${Partner?.username}`} </BlockButton>
      </Buttons>
    </Main>
  );
};

export default ChatProfile;

const Main = styled.div`
  height: 50rem;
  width: 40rem;
  background-color: ${(props) => props.theme.colors.gluton};
  border-radius: 10px;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
`;

const ProfileImage = styled.div`
  width: 8rem;
  height: 8rem;
  background-color: white;
  border-radius: 50%;
  margin-bottom: 1.5rem;
`;
const Name = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;
const Email = styled.div`
  margin-bottom: 1rem;
  h2 {
    font-size: 1.6rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: ${(props) => props.theme.colors.dusty};
  }
  h3 {
    font-size: 1.6rem;
    font-weight: 500;
  }
`;

const Bio = styled.div`
  margin-bottom: 1rem;
  h2 {
    font-size: 1.6rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: ${(props) => props.theme.colors.dusty};
  }
  h3 {
    font-size: 1.6rem;
    font-weight: 500;
  }
`;

const Buttons = styled.div`
  padding-top: 2rem;
  border-top: 1px solid ${(props) => props.theme.colors.dusty};
  margin-top: auto;
`;

const BlockButton = styled.div`
  cursor: pointer;
  width: 100%;
  background-color: ${(props) => props.theme.colors.void};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
`;
