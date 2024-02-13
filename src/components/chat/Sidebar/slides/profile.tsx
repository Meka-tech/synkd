import styled from "@emotion/styled";
import { IUserType } from "@/types/userType";
import { BackDiv, Body, HeaderDiv, Main, Title, TopBar } from "./styles";
import { RootState } from "@/Redux/app/store";
import { useDispatch, useSelector } from "react-redux";
import { ArrowIosBack, ArrowIosForward } from "@emotion-icons/evaicons-solid";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "@emotion-icons/boxicons-solid";
import Loading from "@/components/loading";
import axios from "axios";
import Cookies from "js-cookie";
import { updateUser } from "@/Redux/features/user/userSlice";
import { Crown } from "@emotion-icons/boxicons-solid";
import { useRouter } from "next/router";
import { useSocket } from "@/context/SocketContext";
import { updateSlide } from "@/Redux/features/slides/slide";
import { GetProfileImage } from "@/utils/GetProfileImage";
import Image from "next/image";

interface IProfile {
  close: Function;
}
const Profile = ({ close }: IProfile) => {
  let authToken = Cookies.get("authToken") || "";
  const dispatch = useDispatch();
  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  const [bio, setBio] = useState(user?.bio || "");
  const [username, setUsername] = useState(user?.username || "");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameError, setUsernameError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [detailChange, setDetailChange] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  // const socket = useSelector((state: RootState) => state.socket.socket);
  const socket = useSocket();

  useEffect(() => {
    const CheckUsername = async () => {
      if (usernameError !== "") {
        setCheckingUsername(true);
      }
      try {
        const res = await axios.post(
          "/api/user/find-username",
          { username },
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );
        const usernameTaken = res.data.usernameTaken;
        setUsernameAvailable(!usernameTaken);
      } catch (error) {
        console.log(error);
      }
      setCheckingUsername(false);
    };

    if (username.length <= 3) {
      setUsernameError("username too Short");
    } else if (username.length >= 15) {
      setUsernameError("username too Long");
    } else {
      setUsernameError("");
      if (username !== user?.username) {
        CheckUsername();
      }
    }
  }, [username]);

  useEffect(() => {
    if (
      usernameError !== "" ||
      username.trim() === "" ||
      bio.trim() === "" ||
      !usernameAvailable
    ) {
      setDetailChange(false);
    } else if (bio !== user?.bio || username !== user.username) {
      setDetailChange(true);
    } else if (bio === user?.bio && username === user.username) {
      setDetailChange(false);
    }
  }, [bio, user, username, usernameAvailable, usernameError]);

  const UpdateProfile = async () => {
    if (checkingUsername) {
      return;
    }
    setIsUpdating(true);
    try {
      const data = await axios.post(
        "/api/user/update/profile",
        { username, bio },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      let resuser = data.data.user;
      socket?.emit("profile-updated", {
        from: user?._id,
        friends: user?.friendsList
      });

      dispatch(updateUser(resuser));
      close();
    } catch (error) {
      console.log(error);
    }
    setIsUpdating(false);
  };

  const Cancel = () => {
    setBio(user?.bio || "");
    setUsername(user?.username || "");
    setUsernameError("");
    setUsernameAvailable(true);
    setDetailChange(false);
  };

  const Interests = [
    {
      interest: "Music",
      link: "/update-interest/music",
      premium: false
    },
    {
      interest: "Movies",
      link: "",
      premium: true
    },
    {
      interest: "Sports",
      link: "",
      premium: true
    },
    {
      interest: "Video Games",
      link: "",
      premium: true
    }
  ];

  const InterestPage = (link: string, access: boolean) => {
    if (access) {
      router.push(link);
    }
  };

  const ChooseAvatar = () => {
    dispatch(updateSlide("avatar"));
  };

  const userAvatar = useSelector((state: RootState) => state.user.user?.avatar);

  const ProfileAvatar = GetProfileImage(userAvatar);

  return (
    <Main>
      <TopBar>
        {detailChange ? (
          <>
            <CancelButton onClick={Cancel}>
              <h2>Cancel</h2>
            </CancelButton>
            <UpdateButton onClick={UpdateProfile}>
              {isUpdating ? <Loading size={30} /> : <h2>Save</h2>}
            </UpdateButton>
          </>
        ) : (
          <HeaderDiv>
            <BackDiv onClick={() => close()}>
              <ArrowIosBack size={30} />
            </BackDiv>
            <Title>Edit Profile</Title>
          </HeaderDiv>
        )}
      </TopBar>

      <Body>
        <Item>
          <Info>
            <ImageArea>
              <ProfileImage>
                <Image src={ProfileAvatar} alt="pfp" />
              </ProfileImage>
              <AvatarText onClick={() => ChooseAvatar()}>
                <h2>Change Avatar</h2>
              </AvatarText>
            </ImageArea>
            <UsernameInput>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Indicator>
                {checkingUsername ? (
                  <Loading size={20} />
                ) : usernameError !== "" ? (
                  <ErrorMessage>{usernameError}</ErrorMessage>
                ) : username !== user?.username && usernameAvailable ? (
                  <AvailableIcon>
                    <CheckCircle size={20} />
                  </AvailableIcon>
                ) : username !== user?.username && !usernameAvailable ? (
                  <UnavailableIcon>
                    <XCircle size={20} />
                  </UnavailableIcon>
                ) : (
                  ""
                )}
              </Indicator>
            </UsernameInput>
          </Info>
        </Item>
        <Item>
          <Label>Email</Label>
          <Info>
            <h2>{user?.email}</h2>
          </Info>
        </Item>
        <Item>
          <Label>Bio</Label>
          <Info>
            <TextArea
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setBio(e.target.value);
                }
              }}
            />
            <BioRemainder remainder={100 - bio.length}>
              ({100 - bio.length})
            </BioRemainder>
          </Info>
        </Item>
        <Item>
          <Label>Interests</Label>
          <Info>
            {Interests.map((item, i) => {
              let access = true;
              if (item.premium && !user?.premium) {
                access = false;
              }

              return (
                <InterestItem
                  key={i}
                  onClick={() => InterestPage(item.link, access)}
                >
                  <h2>{item.interest}</h2>
                  {access ? (
                    <ArrowIcon>
                      <ArrowIosForward size={25} />
                    </ArrowIcon>
                  ) : (
                    <PremiumIcon>
                      <Crown size={25} />
                    </PremiumIcon>
                  )}
                </InterestItem>
              );
            })}
          </Info>
        </Item>
      </Body>
    </Main>
  );
};

export default Profile;

const UpdateButton = styled.div`
  cursor: pointer;
  h2 {
    font-size: 2rem;
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CancelButton = styled(UpdateButton)`
  h2 {
    color: ${(props) => props.theme.colors.danger};
  }
`;

const Item = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  margin-bottom: 1rem;
  @media screen and (max-width: 480px) {
    width: 95%;
  }
`;
const Label = styled.h2`
  font-size: 1.6rem;
  font-weight: 300;
  color: ${(props) => props.theme.colors.dusty};
  margin-bottom: 0.5rem;
`;

const Info = styled.div`
  background-color: ${(props) => props.theme.colors.void};
  border-radius: 0.8rem;
  padding: 1rem;
  @media screen and (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
  h2 {
    font-size: 1.6rem;
    font-weight: 300;
    color: white;
  }
`;

const ImageArea = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
`;
const ProfileImage = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: white;
  margin-right: 2rem;
  position: relative;
  overflow: hidden;

  img {
    height: 3.5rem;
    width: 3.5rem;
  }
`;
const AvatarText = styled.div`
  background-color: ${(props) => props.theme.bgColors.primaryFade};
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  h2 {
    font-weight: 700;
    color: ${(props) => props.theme.colors.primary};
  }
`;
const UsernameInput = styled.div`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.dusty};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
`;
const Input = styled.input`
  background-color: transparent;
  width: 70%;
  border: none;
  outline: none;
  font-size: 1.6rem;
  font-weight: 300;
  color: white;
`;
const Indicator = styled.div`
  display: flex;
  align-items: end;
`;
const ErrorMessage = styled.h3`
  color: ${(props) => props.theme.colors.danger};
  opacity: 0.5;
  font-size: 1.2rem;
  font-weight: 500;
`;
const AvailableIcon = styled.div`
  color: ${(props) => props.theme.colors.primary};
  opacity: 0.5;
`;
const UnavailableIcon = styled.div`
  color: ${(props) => props.theme.colors.danger};
  opacity: 0.5;
`;

const TextArea = styled.textarea`
  resize: none;
  height: 7rem;
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.6rem;
  font-weight: 300;
  color: white;
`;

interface BioRType {
  remainder: number;
}
const BioRemainder = styled.h3<BioRType>`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${(props) =>
    props.remainder < 25
      ? props.theme.colors.danger
      : props.theme.colors.primary};
  text-align: right;
`;

const InterestItem = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all ease 0.1s;

  :hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  h2 {
    font-size: 1.6rem;
    font-weight: 600;
    color: white;
  }
`;
const PremiumIcon = styled.div`
  color: gold;
`;

const ArrowIcon = styled.div`
  color: white;
`;
