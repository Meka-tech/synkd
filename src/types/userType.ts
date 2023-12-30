export type IUserType = {
  email: string;
  password: string;
  username: string;
  location: string[];
  serachPreferences: string;
  interests: {
    music: string[];
  };
  _id: string;
};
