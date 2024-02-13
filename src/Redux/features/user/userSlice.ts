import { IUserType } from "@/types/userType";
import { GetProfileImage } from "@/utils/GetProfileImage";
import { createSlice } from "@reduxjs/toolkit";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface INotification {
  user: IUserType;
  _id: string;
  matchCategory: string;
  percent: string;
  notificationType: string;
}

interface UserSliceType {
  user: IUserType | null;
  notifications: INotification[];
  readNotification: boolean;
  avatarImage: string | StaticImport;
}

const initialState: UserSliceType = {
  user: null,
  notifications: [],
  readNotification: true,
  avatarImage: ""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
      const ProfileAvatar = GetProfileImage(state.user?.avatar);
      state.avatarImage = ProfileAvatar;
    },
    updateNotifications: (state, action) => {
      if (state.notifications !== action.payload) {
        state.notifications = [...action.payload];
        if (state.notifications.length !== 0) {
          state.readNotification = false;
        }
      }
    },
    updateReadNotifications: (state, action) => {
      state.readNotification = action.payload;
    }
  }
});

export const { updateUser, updateReadNotifications, updateNotifications } =
  userSlice.actions;

export default userSlice.reducer;
