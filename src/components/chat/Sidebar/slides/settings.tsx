import styled from "@emotion/styled";

import { BackDiv, Body, HeaderDiv, Main, Title, TopBar } from "./styles";
import { Crown } from "@emotion-icons/boxicons-solid";
import { ArrowIosBack, ArrowIosForward } from "@emotion-icons/evaicons-solid";
import { updateSlide } from "@/Redux/features/slides/slide";
import { useDispatch } from "react-redux";
import { LogOut } from "@emotion-icons/boxicons-regular";

interface INewChat {
  close: Function;
}
const Settings = ({ close }: INewChat) => {
  const dispatch = useDispatch();

  const ShowProfile = () => {
    dispatch(updateSlide("profile"));
  };
  return (
    <Main>
      <TopBar>
        <HeaderDiv>
          <BackDiv onClick={() => close()}>
            <ArrowIosBack size={30} />
          </BackDiv>
          <Title>Settings</Title>
        </HeaderDiv>
      </TopBar>
      <StyledBody>
        <Item onClick={() => ShowProfile()}>
          <h2>Edit Profile</h2>
          <ArrowIosForward size={25} />
        </Item>
        <Premium>
          <h2>Synkd +</h2>
          <Crown size={25} />
        </Premium>
        <Item>
          <h2>Contact</h2>
          <ArrowIosForward size={25} />
        </Item>
        <Item>
          <h2>Log out</h2>
          <LogOut size={25} />
        </Item>
      </StyledBody>
      <Footnote>Synkd 1.0 Beta 2024</Footnote>
    </Main>
  );
};

export default Settings;

const StyledBody = styled(Body)`
  height: 90%;
`;

const Item = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 95%;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.void};
  padding: 0 2rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  :hover {
    transform: scaleX(1.05);
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 300;
  }
`;

const Premium = styled(Item)`
  background-color: #ffd90013;
  border: 1px solid gold;
  color: gold;
  h2 {
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const Footnote = styled.div`
  margin-top: auto;
  text-align: center;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.dusty};
`;
