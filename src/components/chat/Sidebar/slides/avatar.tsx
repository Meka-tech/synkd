import styled from "@emotion/styled";
import { BackDiv, Body, HeaderDiv, Main, Title, TopBar } from "./styles";
import { ArrowIosBack } from "@emotion-icons/evaicons-solid";
import AvatarItem from "@/components/avatar";
import { avatarList } from "../../../../../lib/avatarData";
import { useState } from "react";
import { RootState } from "@/Redux/app/store";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { PrimaryButton } from "@/components/buttons/primaryButton";
import axios from "axios";
import { useSocket } from "@/context/SocketContext";
import Cookies from "js-cookie";
import { IUserType } from "@/types/userType";
import { updateUser } from "@/Redux/features/user/userSlice";

interface INewChat {
  close: Function;
}
const Avatar = ({ close }: INewChat) => {
  let authToken = Cookies.get("authToken") || "";
  const userAvatar = useSelector((state: RootState) => state.user.user?.avatar);
  const [chosenAvatar, setChosenAvatar] = useState(userAvatar || "");
  const socket = useSocket();
  const dispatch = useDispatch();
  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const ChooseAvatar = (avatarName: string) => {
    setChosenAvatar(avatarName);
  };

  const UpdateAvatar = async () => {
    setIsUpdating(true);
    try {
      const data = await axios.post(
        "/api/user/update/avatar",
        { avatar: chosenAvatar },
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
  return (
    <Main>
      <TopBar>
        <HeaderDiv>
          <BackDiv onClick={() => close()}>
            <ArrowIosBack size={30} />
          </BackDiv>
          <Title>Choose Avatar</Title>
        </HeaderDiv>
      </TopBar>

      <StyledBody>
        <Grid>
          {avatarList.map((avatar, i) => {
            return (
              <AvatarItem
                name={avatar.name}
                imagesrc={avatar.image}
                chosenAvatar={chosenAvatar}
                key={i}
                chooseAvatar={ChooseAvatar}
              />
            );
          })}
        </Grid>
      </StyledBody>
      <UpdateButton onClick={() => UpdateAvatar()}>
        <PrimaryButton text="Update Avatar" loading={isUpdating} />
      </UpdateButton>
    </Main>
  );
};

export default Avatar;

const StyledBody = styled(Body)`
  height: 80%;
`;

const Grid = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
`;

const UpdateButton = styled.div`
  margin-top: 2rem;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`;
