export type IUserType = {
  email: string;
  avatar: string;
  bio: string;
  password: string;
  username: string;
  location: string[];
  serachPreferences: string;
  friendsList: IUserType[];
  interests: {
    music: string[];
  };
  _id: string;
  premium: boolean;
};
