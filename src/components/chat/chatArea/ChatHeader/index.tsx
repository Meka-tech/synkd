import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { ArrowIosBack } from "@emotion-icons/evaicons-solid";
import { useDispatch } from "react-redux";
import { updateOpenChat } from "@/Redux/features/openChat/openChatSlice";

interface Iprops {
  chatPartner: IUserType | null;
  setActiveChat: Function;
}
const ChatHeader = ({ chatPartner, setActiveChat }: Iprops) => {
  const dispatch = useDispatch();
  const GoBack = () => {
    dispatch(updateOpenChat(false));
    setActiveChat(null);
  };
  return (
    <TopBar>
      <PartnerDetails>
        <BackArrow
          onClick={() => {
            GoBack();
          }}
        >
          <ArrowIosBack size={30} />
        </BackArrow>
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
  background-color: ${(props) => props.theme.bgColors.slateFade};
  backdrop-filter: blur(10px);
  align-items: center;
  justify-content: space-between;
  display: flex;
  @media screen and (max-width: 480px) {
    height: 6rem;
    padding: 0.5rem 0.5rem;
    position: absolute;
    top: 0;
  }
`;
const BackArrow = styled.div`
  display: none;
  margin-right: 0.5rem;
  @media screen and (max-width: 480px) {
    display: flex;
    color: ${(props) => props.theme.colors.secondary};
  }
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
