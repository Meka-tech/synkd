import { IUserType } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

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
}

const initialState: UserSliceType = {
  user: null,
  notifications: [],
  readNotification: true
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
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
