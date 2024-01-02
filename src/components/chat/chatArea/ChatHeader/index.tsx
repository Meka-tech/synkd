import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";

interface Iprops {
  chatPartner: IUserType | null;
}
const ChatHeader = ({ chatPartner }: Iprops) => {
  return (
    <TopBar>
      <PartnerDetails>
        <PartnerImage />
        <PartnerName>{chatPartner?.username}</PartnerName>
      </PartnerDetails>
    </TopBar>
  );
};

export default ChatHeader;

const TopBar = styled.div`
  height: 10%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.gluton};
  align-items: center;
  justify-content: space-between;
  display: flex;
`;
const PartnerDetails = styled.div`
  display: flex;
  align-items: center;
`;
const PartnerImage = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
`;
const PartnerName = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin-left: 1.5rem;
`;
