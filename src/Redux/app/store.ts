import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "@/Redux/features/user/userSlice";
import SocketReducer from "@/Redux/features/socket/socketSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage
};

const rootReducer = combineReducers({
  user: UserReducer,
  socket: SocketReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production"
  // middleware: [thunk]
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
