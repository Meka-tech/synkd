import { createSlice } from "@reduxjs/toolkit";

interface OpenChatType {
  openChat: boolean;
  activeChatId: string;
  launch: boolean;
}
const initialState: OpenChatType = {
  openChat: false,
  activeChatId: "",
  launch: true
};

export const openChatSlice = createSlice({
  name: "openChat",
  initialState,
  reducers: {
    updateOpenChat: (state, action) => {
      state.openChat = action.payload;
    },
    updateActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
    updateLaunch: (state, action) => {
      state.launch = action.payload;
    }
  }
});

export const { updateOpenChat, updateActiveChatId, updateLaunch } =
  openChatSlice.actions;

export default openChatSlice.reducer;
