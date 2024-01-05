import { IUserType } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

interface UserSliceType {
  user: IUserType | null;
}
const initialState: UserSliceType = {
  user: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
