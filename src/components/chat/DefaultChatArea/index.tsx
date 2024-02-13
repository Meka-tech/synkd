import styled from "@emotion/styled";
import Link from "next/link";
const DefaultChatArea = () => {
  return (
    <Main>
      <Body>
        <Text>
          {" "}
          <b>Synk</b> with like-mind users and get chatting!
        </Text>
        <Link href={"/sync/match"}>
          <Button>Synk</Button>
        </Link>
      </Body>
    </Main>
  );
};

export default DefaultChatArea;

const Main = styled.div`
  width: 70%;
  height: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Text = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  b {
    color: ${(props) => props.theme.colors.primary};
    font-size: 2rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 1.6rem;
    b {
      font-size: 1.6rem;
    }
  }
`;

const Button = styled.div`
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 800;
  transition: all ease-in 0.2s;
  :hover {
    transform: scale(1.05);
  }
`;
