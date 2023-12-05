import React, { FC } from "react";
import styled from "@emotion/styled";
import { ButtonContainer, ButtonText } from "./primaryButton";
import { LoadingLottie, LoadingVariantLottie } from "../../../animation";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: boolean;
  loading?: boolean;
  icon?: React.ReactElement;
}
export const ButtonWithIcon: FC<IProps> = ({
  text = "Button",
  variant,
  loading,
  icon,
  ...rest
}) => {
  return (
    <IconButtonContainer {...rest} variant={variant}>
      {loading ? (
        <div>{variant ? <LoadingVariantLottie /> : <LoadingLottie />}</div>
      ) : (
        <>
          <ButtonText>{text}</ButtonText> <Icon>{icon}</Icon>
        </>
      )}
    </IconButtonContainer>
  );
};

const IconButtonContainer = styled(
  (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <ButtonContainer {...props} variant={props.variant} />
  )
)``;

const Icon = styled.div`
  margin-left: 0.5rem;
`;
