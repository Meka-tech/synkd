import { createSlice } from "@reduxjs/toolkit";

interface OpenChatType {
  openChat: boolean;
}
const initialState: OpenChatType = {
  openChat: false
};

export const openChatSlice = createSlice({
  name: "openChat",
  initialState,
  reducers: {
    updateOpenChat: (state, action) => {
      state.openChat = action.payload;
    }
  }
});

export const { updateOpenChat } = openChatSlice.actions;

export default openChatSlice.reducer;
