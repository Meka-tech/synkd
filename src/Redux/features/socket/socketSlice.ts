import { IUserType } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

interface SocketSliceType {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}
const initialState: SocketSliceType = {
  socket: null
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    updateSocket: (state, action) => {
      state.socket = action.payload;
    }
  }
});

export const { updateSocket } = socketSlice.actions;

export default socketSlice.reducer;
