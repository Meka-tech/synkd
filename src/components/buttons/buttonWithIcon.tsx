import React, { FC } from "react";
import styled from "@emotion/styled";
import { ButtonContainer, ButtonText } from "./primaryButton";
import { LoadingLottie, LoadingVariantLottie } from "../../../animation";
import Loading from "../loading";

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
        <Loading />
      ) : (
        <>
          <ButtonText>{text}</ButtonText> <Icon>{icon}</Icon>
        </>
      )}
    </IconButtonContainer>
  );
};
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: boolean;
}
const IconButtonContainer = styled((props: IButtonProps) => (
  <ButtonContainer {...props} />
))``;

const Icon = styled.div`
  margin-left: 0.5rem;
`;
