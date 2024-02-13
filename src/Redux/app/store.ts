import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "@/Redux/features/user/userSlice";
import FriendsReducer from "@/Redux/features/friends/friendsSlice";
import OpenChatReducer from "@/Redux/features/openChat/openChatSlice";
import SlideReducer from "@/Redux/features/slides/slide";
import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    }
  };
};
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["OpenChatReducer", "SlideReducer"]
};

const rootReducer = combineReducers({
  user: UserReducer,
  friends: FriendsReducer,
  openChat: OpenChatReducer,
  slide: SlideReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production"
  // middleware: [thunk]
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
