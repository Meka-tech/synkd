import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { Sync } from "@emotion-icons/boxicons-regular";

interface IProps {
  size?: number;
}
const Loading = ({ size = 20 }: IProps) => {
  return (
    <Main>
      <Sync size={size} />
    </Main>
  );
};

export default Loading;

const rotateAnimation = keyframes`
  from {
    transform: rotate(-360deg);
  }
  to {
    transform: rotate(0);
  }
`;
const Main = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  animation: ${(props) =>
    css`
      ${rotateAnimation} 0.8s linear infinite
    `};
`;
