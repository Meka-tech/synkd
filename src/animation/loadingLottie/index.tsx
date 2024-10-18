import React from "react";
import Lottie from "lottie-react";
import Loading from "@/lottie/loading.json";
import LoadingVariant from "@/lottie/loading-variant.json";
import styled from "@emotion/styled";

export const LoadingVariantLottie = () => (
  <Container>
    <Lottie animationData={Loading} loop={true} />
  </Container>
);

export const LoadingLottie = () => (
  <Container>
    <Lottie animationData={LoadingVariant} loop={true} />
  </Container>
);

const Container = styled.div`
  width: 2rem;
  height: 2rem;
`;
