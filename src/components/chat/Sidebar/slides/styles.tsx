import styled from "@emotion/styled";

export const Main = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem;
  @media screen and (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    padding: 1rem 0.5rem;
  }
`;
export const TopBar = styled.div`
  margin-top: 1rem;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const HeaderDiv = styled.div`
  display: flex;
  align-items: center;
`;
export const BackDiv = styled.div`
  cursor: pointer;
  margin-right: 1rem;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ease-in-out 0.2s;

  :hover {
    background-color: ${(props) => props.theme.colors.slate};
  }
  @media screen and (max-width: 480px) {
    margin-right: 0rem;
  }
`;
export const Title = styled.h2`
  font-size: 2.5rem;
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 2rem;
  }
`;
export const Body = styled.div`
  margin-top: 2rem;
  overflow-y: scroll;
  max-height: 90%;
  height: fit-content;
  padding: 1rem 0;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    margin-top: 1rem;
  }
`;
