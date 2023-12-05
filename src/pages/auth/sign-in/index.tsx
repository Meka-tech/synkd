import { PasswordInput } from "@/components/Inputs/passwordInput";
import { TextInput } from "@/components/Inputs/textInput";
import { ButtonWithIcon } from "@/components/buttons/buttonWithIcon";
import { PrimaryButton } from "@/components/buttons/primaryButton";
import { Google } from "@emotion-icons/boxicons-logos/Google";
import styled from "@emotion/styled";
import { useFormik } from "formik";
import Link from "next/link";
import { SignInValidation } from "../../../../utils/authValidationSchema";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      password: "",
      email: ""
    },
    validationSchema: SignInValidation,
    onSubmit: async (values) => {
      setLoading(true);
      setServerErrorMessage("");
      try {
        let data = await axios.post("/api/auth/sign-in", values);

        localStorage.setItem("token", data?.data.token);
        router.push("/");
      } catch (e: any) {
        let error = e.response.data;
        setServerErrorMessage(error.message);
      }
      setLoading(false);
    }
  });
  return (
    <Body>
      <Header>Welcome back </Header>
      <Form>
        <TopBar>
          <Title>Sign In</Title>{" "}
          {serverErrorMessage && (
            <ServerError>{serverErrorMessage}</ServerError>
          )}{" "}
        </TopBar>

        <form onSubmit={formik.handleSubmit}>
          <TextInput
            id="email"
            inputlabel="Email"
            placeholder="email@example.com"
            type="email"
            onChange={formik.handleChange}
            onBlurProp={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email}
            errorMsg={formik.errors.email}
          />
          <PasswordInput
            id="password"
            inputlabel="Password"
            placeholder="• • • • • • • • • •"
            onChange={formik.handleChange}
            onBlurProp={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && formik.errors.password}
            errorMsg={formik.errors.password}
          />
          <BelowInputs>
            <Link href={"/forgot-password"}>
              <Forgot>Forgot Password?</Forgot>
            </Link>
          </BelowInputs>
          <PrimaryButton
            text="Sign In"
            type="submit"
            disabled={Object.keys(formik.errors).length !== 0}
            loading={loading}
          />
        </form>
        <OrDiv>
          <div /> <h3>or</h3> <div />
        </OrDiv>
        <GoogleButton>
          <ButtonWithIcon text="Google" variant icon={<Google size={20} />} />
        </GoogleButton>
        <FormFooter>
          <NewAccount>
            Don&apos;t have an account?{" "}
            <span>
              <Link href={"/auth/sign-up"}> Sign Up</Link>
            </span>
          </NewAccount>
        </FormFooter>
      </Form>
      <PageFooter>
        <h3>Terms of use</h3>
        <div />
        <h3>Privacy policy</h3>
      </PageFooter>
    </Body>
  );
}

export default SignIn;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  height: 100vh;
`;
const Header = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 2rem;
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;
const ServerError = styled.h3`
  font-weight: 500;
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.danger};
`;
const Title = styled.h1`
  font-size: 2.4rem;
  color: white;
`;
const Form = styled.div`
  width: 35%;
  border: ${(props) => `1px solid ${props.theme.colors.border}`};
  padding: 3rem;
  border-radius: 20px;
  @media screen and (max-width: 480px) {
    border: none;
    width: 100%;
  }
  @media screen and (min-width: 480px) and (max-width: 834px) {
    border: none;
    width: 100%;
  }
`;

const BelowInputs = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Forgot = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.4rem;
  cursor: pointer;
  font-weight: 400;
`;
const GoogleButton = styled.div`
  margin-top: 2rem !important;
  width: 100%;
`;

const OrDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  div {
    height: 0.1rem;
    width: 45%;
    background-color: ${(props) => props.theme.colors.border};
  }
  h3 {
    color: ${(props) => props.theme.colors.border};
    font-size: 1.8rem;
    font-weight: 600;
    @media screen and (min-width: 1300px) and (max-width: 1600px) {
      font-size: 1.2rem;
    }
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
`;

const NewAccount = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  a {
    font-size: 1.4rem;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const PageFooter = styled.div`
  margin-top: 4rem;
  display: flex;
  align-items: center;

  div {
    margin: 0 1rem;
    width: 1px;
    height: 1.5rem;
    background-color: ${(props) => props.theme.colors.border};
  }
  h3 {
    color: white;
    font-size: 1.4rem;
    font-weight: 500;
  }
`;
