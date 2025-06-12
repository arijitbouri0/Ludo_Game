import React, { lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useMyProfileQuery } from "./redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import type { RootState } from "./redux/store";
import LudoLoader from "./components/LudoLoader";
import { SocketProvider } from "./context/SocketContext";

const Home = lazy(() => import('./page/Home'))
const LudoBoard = lazy(() => import('./page/LudoBoard'))

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { data, isSuccess, isError, isLoading } = useMyProfileQuery();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isSuccess && data && data.user) {
      dispatch(userExist(data?.user));
    }
    if (isError) {
      dispatch(userNotExist());
    }
  }, [dispatch, data, isSuccess, isError]);
  if (isLoading || (!user && !isError)) {
    return (
      <LudoLoader />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SocketProvider>
              <Home />
            </SocketProvider>}
        />
        <Route
          path="/match"
          element={
            <SocketProvider>
              <LudoBoard />
            </SocketProvider>}
        />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
};

export default App;
