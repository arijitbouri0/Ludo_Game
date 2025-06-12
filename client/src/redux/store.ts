import { configureStore } from "@reduxjs/toolkit";
import gameApi from "./api/api";
import authSlice from "./reducers/auth";
import localGameSlice from "./reducers/localGameSlice";

const store = configureStore({
  reducer: {
    auth:authSlice.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
    localGame:localGameSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gameApi.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
