import { RootState } from "@/Redux/app/store";
import { IUserType } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

interface FriendsSliceType {
  friends: IUserType[] | [];
}
const initialState: FriendsSliceType = {
  friends: []
};

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    updateFriends: (state, action) => {
      state.friends = action.payload;
    },
    updateFriend: (state, action) => {
      console.log(action.payload);
      const friendIndex = state.friends.findIndex(
        (friend) => friend._id === action.payload._id
      );

      if (friendIndex !== -1) {
        const updatedFriends = [
          ...state.friends.slice(0, friendIndex),
          action.payload,
          ...state.friends.slice(friendIndex + 1)
        ];

        console.log(updatedFriends);

        return {
          ...state,
          friends: updatedFriends
        };
      }
      return state;
    }
  }
});

export const getActiveChatPartner = (state: RootState) => {
  const friends = state.friends.friends;
  const Id = state.openChat.activeChatId;
  return friends.find((friend) => friend._id === Id);
};

export const { updateFriends, updateFriend } = friendsSlice.actions;

export default friendsSlice.reducer;
