import { FC, useState } from "react";
import styled from "@emotion/styled";
import { Eye, EyeClosed } from "@emotion-icons/octicons";
import {
  EMessage,
  ErrorContainer,
  LabelDiv,
  StyledInput,
  StyledInputContainer,
  StyledInputElementContainer,
  StyledInputLabel
} from "./textInput";
import Image from "next/image";

interface IProps extends React.ButtonHTMLAttributes<HTMLInputElement> {
  inputlabel: string;
  errorMsg?: string;
  error?: any;
  onBlurProp?: Function;
}
export const PasswordInput: FC<IProps> = ({
  inputlabel,
  error = false,
  errorMsg,
  onBlurProp,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlurProp) {
      onBlurProp(e);
    }
  };
  return (
    <StyledInputContainer>
      <LabelDiv>
        <StyledInputLabel>{inputlabel}</StyledInputLabel>
      </LabelDiv>
      <StyledInputElementContainer focused={focused} error={error}>
        <ExtendInput
          type={showPassword ? "text" : "password"}
          {...rest}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={handleBlur}
        />
        <EyeDiv onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Eye size={16} color={!focused ? "white" : ""} />
          ) : (
            <EyeClosed size={16} color={!focused ? "white" : ""} />
          )}
        </EyeDiv>
      </StyledInputElementContainer>
      {error && (
        <ErrorContainer>
          <EMessage>{errorMsg}</EMessage>
        </ErrorContainer>
      )}
    </StyledInputContainer>
  );
};

const ExtendInput = styled(
  (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <StyledInput {...props} />
  )
)`
  width: 90%;
`;
const EyeDiv = styled.div`
  cursor: pointer;
  width: 5%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all ease 0.1s;
`;
