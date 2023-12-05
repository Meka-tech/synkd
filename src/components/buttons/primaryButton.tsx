import React, { FC } from "react";
import styled from "@emotion/styled";
import { LoadingLottie, LoadingVariantLottie } from "../../../animation";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: boolean;
  loading?: boolean;
}
export const PrimaryButton: FC<IProps> = ({
  text = "Button",
  variant,
  loading,
  ...rest
}) => {
  return (
    <ButtonContainer {...rest} variant={variant}>
      {loading ? (
        <div>{variant ? <LoadingVariantLottie /> : <LoadingLottie />}</div>
      ) : (
        <ButtonText>{text}</ButtonText>
      )}
    </ButtonContainer>
  );
};

interface IButtonProps {
  variant?: boolean;
}
export const ButtonContainer = styled.button<IButtonProps>`
  all: unset;
  display: flex;
  justify-content: center;

  align-items: center;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${(props) => (props.variant ? " " : "white")};
  border-radius: 8px;
  padding: 1.1rem 1rem;
  color: ${(props) => (props.variant ? "white" : "black")};
  border: ${(props) => props.variant && `1px solid white`};
  transition: all ease 0.1s;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    padding: 0.8rem 1rem;
  }
  :disabled {
    color: #838383;
    background-color: #d1d1d1;
  }
  :active {
    transform: scale(0.98);
  }
  :hover {
    background-color: ${(props) =>
      props.variant ? "rgba(255, 255, 255, 0.05)" : "#d1d1d1"};
  }
`;

export const ButtonText = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
`;
