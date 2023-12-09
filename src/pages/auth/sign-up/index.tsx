import { useState } from "react";
import { PasswordInput } from "@/components/Inputs/passwordInput";
import { TextInput } from "@/components/Inputs/textInput";
import { ButtonWithIcon } from "@/components/buttons/buttonWithIcon";
import { PrimaryButton } from "@/components/buttons/primaryButton";
import { Google } from "@emotion-icons/boxicons-logos/Google";
import styled from "@emotion/styled";
import Link from "next/link";
import { SignUpValidation } from "@/utils/authValidationSchema";
import { useFormik } from "formik";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [serverErrorMessage, setServerErrorMessage] = useState({
    email: "",
    username: ""
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
      username: ""
    },
    validationSchema: SignUpValidation,
    onSubmit: async (values) => {
      setServerErrorMessage((prevState) => ({
        ...prevState,
        email: "",
        username: ""
      }));

      setLoading(true);
      try {
        const data = await axios.post("/api/auth/sign-up", values);
        router.push("/auth/sign-in");
      } catch (e: any) {
        let error = e.response.data;
        setServerErrorMessage((prevState) => ({
          ...prevState,
          [error.input]: error.message
        }));
      } finally {
        setLoading(false);
      }
    }
  });
  return (
    <Body>
      <Header>
        Welcome to <span>Synkd</span> !
      </Header>
      <Form>
        <Title>Sign Up</Title>
        <form onSubmit={formik.handleSubmit}>
          <TextInput
            id="username"
            inputlabel="Username"
            placeholder="Zeus-Almighty"
            type="text"
            onChange={formik.handleChange}
            onBlurProp={formik.handleBlur}
            value={formik.values.username}
            error={
              serverErrorMessage.username ||
              (formik.touched.username && formik.errors.username)
            }
            errorMsg={serverErrorMessage.username || formik.errors.username}
          />
          <TextInput
            id="email"
            inputlabel="Email"
            placeholder="email@example.com"
            type="email"
            onChange={formik.handleChange}
            onBlurProp={formik.handleBlur}
            value={formik.values.email}
            error={
              serverErrorMessage.email ||
              (formik.touched.email && formik.errors.email)
            }
            errorMsg={serverErrorMessage.email || formik.errors.email}
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
          <PrimaryButton
            text="Sign Up"
            type="submit"
            disabled={Object.keys(formik.errors).length !== 0}
            loading={loading}
          />
        </form>
        <OrDiv>
          <div /> <h3>or</h3> <div />
        </OrDiv>
        <GoogleButton>
          <ButtonWithIcon
            text="Google"
            onClick={() => {
              signIn("google");
            }}
            variant
            icon={<Google size={20} />}
          />
        </GoogleButton>
        <FormFooter>
          <NewAccount>
            Have an account?
            <span>
              <Link href={"/auth/sign-in"}> Sign in</Link>
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

export default SignUp;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  height: 100dvh;
`;
const Header = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 2rem;
  span {
    font-size: 3rem;
    color: ${(props) => props.theme.colors.primary};
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 2.4rem;
    span {
      font-size: 2.4rem;
    }
  }
`;

const Title = styled.h1`
  font-size: 2.4rem;
  margin-bottom: 2.5rem;
  color: white;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;
const Form = styled.div`
  width: 35%;
  border: ${(props) => `1px solid ${props.theme.colors.border}`};
  padding: 2rem 3rem;
  border-radius: 10px;
  @media screen and (max-width: 480px) {
    border: none;
    width: 100%;
  }
  @media screen and (min-width: 480px) and (max-width: 834px) {
    border: none;
    width: 100%;
  }
`;

const GoogleButton = styled.div`
  margin-top: 2rem;
  width: 100%;
  @media screen and (max-width: 480px) {
    margin-top: 1rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    margin-top: 1rem;
  }
`;

const OrDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  @media screen and (max-width: 480px) {
    margin-top: 1rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    margin-top: 1rem;
  }
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
