import React, { FC } from "react";
import styled from "@emotion/styled";

import Loading from "../loading";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: boolean;
  loading?: boolean;
  bgColor?: string;
  danger?: boolean;
}
export const PrimaryButton: FC<IProps> = ({
  text = "Button",
  variant,
  loading,
  bgColor,
  danger,
  ...rest
}) => {
  return (
    <ButtonContainer {...rest} variant={variant} bg={bgColor} danger={danger}>
      {loading ? <Loading /> : <ButtonText>{text}</ButtonText>}
    </ButtonContainer>
  );
};

interface IButtonProps {
  variant?: boolean;
  danger?: boolean;
  bg?: string;
}
export const ButtonContainer = styled.button<IButtonProps>`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${(props) =>
    props.bg
      ? props.bg
      : props.danger
      ? props.theme.colors.danger
      : props.variant
      ? props.theme.bgColors.primaryFade
      : props.theme.colors.primary};
  border-radius: 8px;
  padding: 1.1rem 1rem;
  color: ${(props) => (props.variant || props.danger ? "white" : "white")};
  border: ${(props) =>
    props.variant && `1px solid ${props.theme.colors.primary}`};
  transition: all ease 0.1s;
  @media screen and (max-width: 480px) {
    padding: 1rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    padding: 0.8rem 1rem;
  }
  :disabled {
    opacity: 0.5;
  }
  :active {
    transform: scale(0.98);
  }
  :hover {
    transform: scale(1.04);
  }
`;

export const ButtonText = styled.h3`
  font-size: 1.8rem;
  font-weight: 300;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 1.6rem;
  }
`;
