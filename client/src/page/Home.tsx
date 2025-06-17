import React from "react";
import toast from "react-hot-toast";
import { IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import PlayLocallyDialog from "../components/Dialog/PlayLocallyDialog";
import PlayOnlineDialog from "../components/Dialog/PlayOnlineDialog";
import SettingsDialog from "../components/Dialog/SettingsDialog";
import { useLogoutMutation } from "../redux/api/api";
import type { RootState } from "../redux/store";
import { userNotExist } from "../redux/reducers/auth";
import LoginDialog from "../components/Dialog/LoginDialog";

const Home: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout, { data }] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const loadingToast = toast.loading("Please wait...", {
      position: "top-center",
    });
    try {
      await logout()
      dispatch(userNotExist())
      toast.success(data?.message || "Logout Succesfully")
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  }
  return (
    <div className="min-h-dvh">
      <nav className="flex justify-between items-center px-12 py-4 h-16">
        <h1 className="text-xl font-semibold text-white">Ludo Game</h1>
        <div className="flex items-center gap-6 space-x-6">
          <button>
            {user && <IoLogOut size={28} className="cursor-pointer text-white" onClick={handleLogout} />}
          </button>
          <SettingsDialog />
        </div>
      </nav>

      <div className="h-[calc(100vh-64px)] flex-grow flex flex-col lg:flex-row justify-center items-center gap-16 md:gap-10 px-6 py-10">
        <div className="w-full lg:w-1/2 flex flex-col items-center space-y-6">
          <img
            src="Ludo.png"
            alt="Ludo Board"
            className="w-60 md:w-80 rounded-lg shadow-2xl"
          />
          <h1 className="text-3xl md:text-5xl font-extrabold text-center text-blue-500">
            <span className="text-red-500">L</span>
            <span className="text-green-500">U</span>
            <span className="text-yellow-300">D</span>O
          </h1>
        </div>

        <div className="w-[50%] md:w-[30%] grid grid-rows-2 gap-4 md:gap-6">
          <PlayLocallyDialog />
          {
            user ? (
              <PlayOnlineDialog />
            ) : (
              <LoginDialog/>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
