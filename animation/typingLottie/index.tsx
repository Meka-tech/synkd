import React from "react";
import Lottie from "lottie-react";

import Typing from "../../src/lottie/typing.json.json";
import styled from "@emotion/styled";

export const TypingLottie = () => (
  <Container>
    <Lottie animationData={Typing} loop={true} />
  </Container>
);

const Container = styled.div`
  width: 4rem;
  height: 2rem;
  display: flex;
  align-items: center;
`;
