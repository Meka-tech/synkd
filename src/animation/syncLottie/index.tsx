import React from "react";
import Lottie from "lottie-react";
import Loading from "@/lottie/radar.json";
import styled from "@emotion/styled";

export const SyncLottie = () => (
  <Container>
    <Lottie animationData={Loading} loop={true} />
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
