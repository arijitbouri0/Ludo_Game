import { configureStore } from "@reduxjs/toolkit";
import gameApi from "./api/api";
import authSlice from "./reducers/auth";
import localGameSlice from "./reducers/localGameSlice";
import audioSlice from "./reducers/audioSlice";
import { createSocketMiddleware } from "../middleware/SocketMiddleWare";
import { io } from 'socket.io-client';
import { url } from "../constants/api";

const socket = io(url);

const store = configureStore({
  reducer: {
    auth:authSlice.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
    localGame:localGameSlice.reducer,
    audio:audioSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gameApi.middleware).concat(createSocketMiddleware(socket)),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
