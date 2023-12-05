import { FC, useState } from "react";
import styled from "@emotion/styled";
// import { mq } from "@/responsive";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputlabel: string;
  errorMsg?: string;
  error?: any;
  onBlurProp?: Function;
}
export const TextInput: FC<IProps> = ({
  inputlabel,
  error = false,
  errorMsg,
  onBlurProp,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const handleBlur = (e: any) => {
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
        <StyledInput
          {...rest}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={handleBlur}
        />
      </StyledInputElementContainer>
      {error && (
        <ErrorContainer>
          <EMessage>{errorMsg}</EMessage>
        </ErrorContainer>
      )}
    </StyledInputContainer>
  );
};

export const StyledInputContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }
`;

export const LabelDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const StyledInputLabel = styled.label`
  color: white;
  font-weight: 600;
  font-size: 1.6rem;

  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
`;
interface InputContainerStyle {
  focused: boolean;
  error: boolean;
}
export const StyledInputElementContainer = styled.div<InputContainerStyle>`
  margin-top: 1rem;
  width: 100%;
  height: 4.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: ${(props) =>
    props.error
      ? `1px solid ${props.theme.colors.danger}`
      : props.focused
      ? `1px solid ${props.theme.colors.primary}`
      : `1px solid ${props.theme.colors.border}`};
  border-radius: 8px;
  padding: 1rem;
  transition: all ease 0.5s;
  background-color: ${(props) =>
    props.error
      ? props.theme.bgColors.dangerFade
      : props.focused
      ? ` `
      : "rgba(255,255,255, 0.05)"};

  backdrop-filter: blur(10px);

  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    height: 3.8rem;
    margin-top: 0.5rem;
  }
`;

export const StyledInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: 400;
  font-size: 1.4rem;
  background-color: transparent;
  color: white;
  font-weight: 600;

  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.2rem;
  }

  ::placeholder {
    color: #d9d9d99b;
    font-weight: 600;
  }
`;

export const ErrorContainer = styled.div`
  margin-top: 0.5rem;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    margin-top: 0.1rem;
  }
`;
export const EMessage = styled.h2`
  font-weight: 400;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.danger};
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1rem;
  }
`;
