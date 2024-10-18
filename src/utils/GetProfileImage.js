import { avatarList } from "@/lib/avatarData";

export const GetProfileImage = (name) => {
  let image;
  const Avatar = avatarList.find((avatar) => avatar.name === name);

  if (Avatar) {
    image = Avatar.image;
  } else {
    image = avatarList[0].image;
  }
  return image;
};
