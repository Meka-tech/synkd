import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "@/Redux/features/user/userSlice";
import FriendsReducer from "@/Redux/features/friends/friendsSlice";
import SocketReducer from "@/Redux/features/socket/socketSlice";
import OpenChatReducer from "@/Redux/features/openChat/openChatSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage
};

const rootReducer = combineReducers({
  user: persistReducer(persistConfig, UserReducer),
  friends: persistReducer(persistConfig, FriendsReducer),
  socket: SocketReducer,
  openChat: OpenChatReducer
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // reducer : persistReducer,
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production"
  // middleware: [thunk]
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
